import { forwardRef } from 'react';
import { useStore } from '../store';
import ChatGPTTemplate from './templates/ChatGPTTemplate';
import GeminiTemplate from './templates/GeminiTemplate';
import ClaudeTemplate from './templates/ClaudeTemplate';
import GenericTemplate from './templates/GenericTemplate';

const templateComponents = {
  chatgpt: ChatGPTTemplate,
  gemini: GeminiTemplate,
  claude: ClaudeTemplate,
  generic: GenericTemplate,
};

interface PreviewProps {
  isRecording?: boolean;
}

const Preview = forwardRef<HTMLDivElement, PreviewProps>(({ isRecording = false }, ref) => {
  const { scene, exportConfig } = useStore();
  const TemplateComponent = templateComponents[scene.template];

  const bgPattern = {
    backgroundImage: `radial-gradient(circle at 1px 1px, #1f1f2e 1px, transparent 0)`,
    backgroundSize: '20px 20px',
  };

  // Calculate dimensions based on export format
  const getPreviewDimensions = () => {
    const baseWidth = scene.device === 'mobile' ? 390 : scene.device === 'tablet' ? 820 : 1200;
    switch (exportConfig.format) {
      case '9:16':
        return { width: Math.min(baseWidth, 400), height: Math.min(baseWidth * (16/9), 720) };
      case '1:1':
        return { width: Math.min(baseWidth, 600), height: Math.min(baseWidth, 600) };
      default:
        return { width: baseWidth, height: baseWidth * (9/16) };
    }
  };

  const dims = getPreviewDimensions();

  if (scene.device === 'desktop') {
    return (
      <div className="w-full h-full flex items-center justify-center p-4 overflow-auto" style={isRecording ? {} : bgPattern}>
        <div 
          ref={ref}
          className="flex flex-col shadow-2xl shadow-black/50"
          style={{ 
            width: `min(${dims.width}px, calc(100% - 32px))`,
            height: `min(${dims.height}px, calc(100vh - 140px))`,
            minHeight: '400px',
          }}
        >
          {/* Browser chrome */}
          <div className="bg-[#2c2c2c] rounded-t-xl px-4 py-2.5 flex items-center gap-3 flex-shrink-0">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex-1 mx-8">
              <div className="bg-[#1a1a1a] rounded-lg px-4 py-1.5 text-xs text-gray-400 flex items-center gap-2 max-w-md mx-auto">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <span className="truncate">
                  {scene.template === 'chatgpt' ? 'chatgpt.com' :
                   scene.template === 'gemini' ? 'gemini.google.com' :
                   scene.template === 'claude' ? 'claude.ai' :
                   'assistant.app'}
                </span>
              </div>
            </div>
            <div className="flex gap-2 opacity-50">
              <div className="w-3 h-3" />
              <div className="w-3 h-3" />
            </div>
          </div>
          {/* Content */}
          <div className="flex-1 rounded-b-xl overflow-hidden border border-t-0 border-[#3a3a3a] min-h-0">
            <TemplateComponent />
          </div>
        </div>
      </div>
    );
  }

  if (scene.device === 'mobile') {
    return (
      <div className="w-full h-full flex items-center justify-center p-4 overflow-auto" style={isRecording ? {} : bgPattern}>
        <div
          ref={ref}
          className="bg-black flex flex-col relative shadow-2xl shadow-black/60"
          style={{
            width: '390px',
            height: 'min(844px, calc(100vh - 100px))',
            borderRadius: '50px',
            padding: '6px',
            boxShadow: '0 0 0 2px #2a2a2a, inset 0 0 0 2px #1a1a1a, 0 40px 100px rgba(0,0,0,0.7)',
          }}
        >
          {/* iPhone notch / Dynamic Island */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
            <div 
              className="bg-black rounded-b-[20px] flex items-start justify-center"
              style={{ width: '126px', height: '34px', marginTop: '6px' }}
            >
              <div className="w-[90px] h-[28px] bg-black rounded-full mt-1" />
            </div>
          </div>
          
          {/* Screen content */}
          <div 
            className="flex-1 overflow-hidden bg-black relative"
            style={{ borderRadius: '44px' }}
          >
            {/* Status bar */}
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-8 pt-3 pb-1" style={{ paddingTop: '14px' }}>
              <span className="text-white text-sm font-semibold">9:41</span>
              <div className="flex items-center gap-1">
                <svg width="17" height="12" viewBox="0 0 17 12" fill="white">
                  <path d="M1 4.5C1 3.67 1.67 3 2.5 3H3.5C4.33 3 5 3.67 5 4.5V10.5C5 11.33 4.33 12 3.5 12H2.5C1.67 12 1 11.33 1 10.5V4.5Z"/>
                  <path d="M6 3C6 2.17 6.67 1.5 7.5 1.5H8.5C9.33 1.5 10 2.17 10 3V10.5C10 11.33 9.33 12 8.5 12H7.5C6.67 12 6 11.33 6 10.5V3Z"/>
                  <path d="M11 1.5C11 0.67 11.67 0 12.5 0H13.5C14.33 0 15 0.67 15 1.5V10.5C15 11.33 14.33 12 13.5 12H12.5C11.67 12 11 11.33 11 10.5V1.5Z"/>
                </svg>
                <svg width="16" height="12" viewBox="0 0 16 12" fill="white">
                  <path d="M8 2C11.87 2 15 5.13 15 9H13C13 6.24 10.76 4 8 4C5.24 4 3 6.24 3 9H1C1 5.13 4.13 2 8 2Z" opacity="0.3"/>
                  <path d="M8 5C10.21 5 12 6.79 12 9H10C10 7.9 9.1 7 8 7C6.9 7 6 7.9 6 9H4C4 6.79 5.79 5 8 5Z"/>
                </svg>
                <svg width="25" height="12" viewBox="0 0 25 12" fill="white">
                  <rect x="0" y="1" width="22" height="10" rx="2.5" stroke="white" strokeWidth="1" fill="none" opacity="0.4"/>
                  <rect x="23" y="4" width="1.5" height="4" rx="0.5" fill="white" opacity="0.5"/>
                  <rect x="2" y="3" width="18" height="6" rx="1" fill="white"/>
                </svg>
              </div>
            </div>
            
            {/* App content */}
            <div className="h-full pt-12">
              <TemplateComponent />
            </div>
          </div>
          
          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20">
            <div className="w-[134px] h-[5px] bg-white rounded-full opacity-60" />
          </div>
        </div>
      </div>
    );
  }

  if (scene.device === 'tablet') {
    return (
      <div className="w-full h-full flex items-center justify-center p-4 overflow-auto" style={isRecording ? {} : bgPattern}>
        <div
          ref={ref}
          className="bg-black flex flex-col shadow-2xl shadow-black/60"
          style={{
            width: 'min(920px, calc(100vw - 400px))',
            height: 'min(680px, calc(100vh - 100px))',
            borderRadius: '36px',
            padding: '10px',
            boxShadow: '0 0 0 2px #2a2a2a, 0 40px 100px rgba(0,0,0,0.7)',
          }}
        >
          {/* Screen content */}
          <div className="flex-1 overflow-hidden relative" style={{ borderRadius: '26px' }}>
            {/* Status bar */}
            <div 
              className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-2"
              style={{ backgroundColor: scene.theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)' }}
            >
              <span className={`text-sm font-medium ${scene.theme === 'dark' ? 'text-white' : 'text-black'}`}>9:41</span>
              <div className="flex items-center gap-2">
                <svg width="17" height="12" viewBox="0 0 17 12" fill={scene.theme === 'dark' ? 'white' : 'black'}>
                  <path d="M1 4.5C1 3.67 1.67 3 2.5 3H3.5C4.33 3 5 3.67 5 4.5V10.5C5 11.33 4.33 12 3.5 12H2.5C1.67 12 1 11.33 1 10.5V4.5Z"/>
                  <path d="M6 3C6 2.17 6.67 1.5 7.5 1.5H8.5C9.33 1.5 10 2.17 10 3V10.5C10 11.33 9.33 12 8.5 12H7.5C6.67 12 6 11.33 6 10.5V3Z"/>
                  <path d="M11 1.5C11 0.67 11.67 0 12.5 0H13.5C14.33 0 15 0.67 15 1.5V10.5C15 11.33 14.33 12 13.5 12H12.5C11.67 12 11 11.33 11 10.5V1.5Z"/>
                </svg>
                <svg width="25" height="12" viewBox="0 0 25 12" fill={scene.theme === 'dark' ? 'white' : 'black'}>
                  <rect x="0" y="1" width="22" height="10" rx="2.5" stroke={scene.theme === 'dark' ? 'white' : 'black'} strokeWidth="1" fill="none" opacity="0.4"/>
                  <rect x="2" y="3" width="18" height="6" rx="1"/>
                </svg>
              </div>
            </div>
            
            {/* App content */}
            <div className="h-full">
              <TemplateComponent />
            </div>
          </div>
          
          {/* Home indicator */}
          <div className="flex justify-center mt-2">
            <div className="w-[120px] h-[5px] bg-gray-600 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return null;
});

Preview.displayName = 'Preview';

export default Preview;
