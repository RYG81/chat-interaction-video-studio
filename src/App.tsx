import { useEffect, useRef, useCallback } from 'react';
import { useStore } from './store';
import { usePlayback } from './hooks/usePlayback';
import { useVideoExport } from './hooks/useVideoExport';
import Preview from './components/Preview';
import TemplatePanel from './components/panels/TemplatePanel';
import ScriptPanel from './components/panels/ScriptPanel';
import TimingPanel from './components/panels/TimingPanel';
import ExportPanel from './components/panels/ExportPanel';
import CustomizePanel from './components/panels/CustomizePanel';

const tabs = [
  { id: 'templates' as const, label: 'Template', icon: '🎨' },
  { id: 'customize' as const, label: 'Customize', icon: '✏️' },
  { id: 'script' as const, label: 'Script', icon: '📝' },
  { id: 'timing' as const, label: 'Timing', icon: '⏱️' },
  { id: 'export' as const, label: 'Export', icon: '📤' },
];

function Sidebar({ 
  onExportMP4,
  onExportWebM,
  exportState,
  exportProgress,
  errorMessage,
}: {
  onExportMP4: () => void;
  onExportWebM: () => void;
  exportState: string;
  exportProgress: number;
  errorMessage: string;
}) {
  const { activePanel, setActivePanel, playbackState, messages, timing } = useStore();
  const { play, stop, showFinalState } = usePlayback();

  // Calculate estimated duration
  const estimatedDuration = messages.reduce((total, msg) => {
    const delay = msg.delayBefore || 500;
    const duration = msg.role === 'assistant' ? (msg.duration || 3000) : (msg.content.length * timing.typingSpeed);
    return total + delay + duration + (msg.role === 'assistant' ? timing.delayAfterAssistant : timing.delayBeforeAssistant);
  }, timing.finalPauseDuration);

  const formatDuration = (ms: number) => {
    const seconds = Math.round(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <div className="w-[340px] flex-shrink-0 bg-[#0d0d14] border-r border-gray-800 flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">ChatVid Studio</h1>
            <p className="text-[10px] text-gray-500">Chat Interaction Video Engine</p>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex border-b border-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActivePanel(tab.id)}
            className={`flex-1 py-2.5 px-2 text-center transition-all border-b-2 ${
              activePanel === tab.id
                ? 'border-indigo-500 text-white bg-indigo-500/5'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <div className="text-base">{tab.icon}</div>
            <div className="text-[10px] font-medium mt-0.5">{tab.label}</div>
          </button>
        ))}
      </div>

      {/* Panel content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0">
        {activePanel === 'templates' && <TemplatePanel />}
        {activePanel === 'customize' && <CustomizePanel />}
        {activePanel === 'script' && <ScriptPanel />}
        {activePanel === 'timing' && <TimingPanel />}
        {activePanel === 'export' && (
          <ExportPanel
            onExportMP4={onExportMP4}
            onExportWebM={onExportWebM}
            exportState={exportState as 'idle' | 'loading-ffmpeg' | 'recording' | 'converting' | 'done' | 'error'}
            exportProgress={exportProgress}
            errorMessage={errorMessage}
          />
        )}
      </div>

      {/* Playback controls */}
      <div className="px-4 py-3 border-t border-gray-800 bg-[#0a0a10]">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-gray-500">{messages.length} messages</span>
          <span className="text-xs text-gray-700">•</span>
          <span className="text-xs text-gray-500">~{formatDuration(estimatedDuration)}</span>
          <span className="text-xs text-gray-700">•</span>
          <span className={`text-xs font-medium ${
            playbackState === 'playing' ? 'text-green-400' :
            playbackState === 'finished' ? 'text-blue-400' :
            'text-gray-500'
          }`}>
            {playbackState === 'playing' ? '▶ Playing...' :
             playbackState === 'finished' ? '✓ Finished' :
             '⏸ Ready'}
          </span>
        </div>
        <div className="flex gap-2">
          {playbackState === 'playing' ? (
            <button
              onClick={stop}
              className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
              </svg>
              Stop
            </button>
          ) : (
            <button
              onClick={play}
              className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Play Animation
            </button>
          )}
          <button
            onClick={showFinalState}
            className="py-2.5 px-3 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-xl transition-colors border border-gray-700"
            title="Show final state"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3" /><line x1="19" y1="3" x2="19" y2="21" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { showFinalState, play } = usePlayback();
  const { exportWebM, exportState, progress, errorMessage, loadFFmpeg, startRecording } = useVideoExport();
  const initialized = useRef(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const { messages, timing } = useStore();
  
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      showFinalState();
    }
  }, [showFinalState]);

  // Calculate animation duration
  const calculateAnimationDuration = useCallback(() => {
    return messages.reduce((total, msg) => {
      const delay = msg.delayBefore || 500;
      const duration = msg.role === 'assistant' ? (msg.duration || 3000) : (msg.content.length * timing.typingSpeed);
      return total + delay + duration + (msg.role === 'assistant' ? timing.delayAfterAssistant : timing.delayBeforeAssistant);
    }, timing.finalPauseDuration);
  }, [messages, timing]);

  const handleExportMP4 = useCallback(async () => {
    if (!previewRef.current) return;
    
    // Pre-load FFmpeg
    try {
      await loadFFmpeg();
    } catch {
      return;
    }

    const duration = calculateAnimationDuration();
    
    // Create a promise that resolves when animation completes
    const animationComplete = new Promise<void>((resolve) => {
      setTimeout(resolve, duration + 1000);
    });

    await startRecording(
      previewRef.current,
      () => play(),
      () => animationComplete
    );
  }, [loadFFmpeg, calculateAnimationDuration, startRecording, play]);

  const handleExportWebM = useCallback(() => {
    if (!previewRef.current) return;
    
    const duration = calculateAnimationDuration();
    exportWebM(previewRef.current, () => play(), duration + 1000);
  }, [calculateAnimationDuration, exportWebM, play]);

  return (
    <div className="flex h-screen w-screen bg-[#111118] overflow-hidden">
      <Sidebar
        onExportMP4={handleExportMP4}
        onExportWebM={handleExportWebM}
        exportState={exportState}
        exportProgress={progress}
        errorMessage={errorMessage}
      />
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-[#0d0d14] flex-shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-gray-400">Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <PreviewInfo />
          </div>
        </div>
        {/* Preview area */}
        <div className="flex-1 min-h-0 overflow-hidden bg-[#111118]">
          <Preview ref={previewRef} isRecording={exportState === 'recording'} />
        </div>
      </main>
    </div>
  );
}

function PreviewInfo() {
  const { scene, exportConfig } = useStore();
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] text-gray-500 bg-gray-800 px-2 py-1 rounded font-mono">
        {scene.template.toUpperCase()}
      </span>
      <span className="text-[10px] text-gray-500 bg-gray-800 px-2 py-1 rounded font-mono">
        {scene.theme.toUpperCase()}
      </span>
      <span className="text-[10px] text-gray-500 bg-gray-800 px-2 py-1 rounded font-mono">
        {scene.device.toUpperCase()}
      </span>
      <span className="text-[10px] text-gray-500 bg-gray-800 px-2 py-1 rounded font-mono">
        {exportConfig.format}
      </span>
    </div>
  );
}
