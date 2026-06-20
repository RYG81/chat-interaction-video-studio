import { useStore } from '../../store';
import type { AnimationPreset, StreamingStyle } from '../../types';

const presets: { id: AnimationPreset; name: string; desc: string; icon: string }[] = [
  { id: 'realistic', name: 'Realistic', desc: 'Natural delays, authentic feel', icon: '🎬' },
  { id: 'fast', name: 'Fast Demo', desc: 'Quick transitions', icon: '⚡' },
  { id: 'social', name: 'Social Media', desc: 'Fast pacing, punchy', icon: '📱' },
  { id: 'tutorial', name: 'Tutorial', desc: 'Slower, educational', icon: '📚' },
  { id: 'cinematic', name: 'Cinematic', desc: 'Smooth, dramatic', icon: '🎥' },
];

const presetTimings: Record<AnimationPreset, Record<string, number>> = {
  realistic: { typingSpeed: 45, streamSpeed: 25, delayBeforeAssistant: 800, delayAfterAssistant: 500, finalPauseDuration: 2000 },
  fast: { typingSpeed: 20, streamSpeed: 10, delayBeforeAssistant: 300, delayAfterAssistant: 200, finalPauseDuration: 1000 },
  social: { typingSpeed: 15, streamSpeed: 8, delayBeforeAssistant: 200, delayAfterAssistant: 150, finalPauseDuration: 800 },
  tutorial: { typingSpeed: 60, streamSpeed: 35, delayBeforeAssistant: 1200, delayAfterAssistant: 800, finalPauseDuration: 3000 },
  cinematic: { typingSpeed: 50, streamSpeed: 30, delayBeforeAssistant: 1000, delayAfterAssistant: 600, finalPauseDuration: 2500 },
};

const streamingStyles: { id: StreamingStyle; name: string }[] = [
  { id: 'token', name: 'Token chunks' },
  { id: 'word', name: 'Word-by-word' },
  { id: 'sentence', name: 'Sentence' },
  { id: 'typewriter', name: 'Typewriter' },
];

export default function TimingPanel() {
  const { timing, setTiming, scene, setScene } = useStore();

  const applyPreset = (preset: AnimationPreset) => {
    setScene({ preset });
    const timingValues = presetTimings[preset];
    if (timingValues) setTiming(timingValues);
  };

  return (
    <div className="space-y-6">
      {/* Animation presets */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Animation Preset
        </label>
        <div className="space-y-1.5">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => applyPreset(p.id)}
              className={`w-full text-left p-3 rounded-xl border transition-all ${
                scene.preset === p.id
                  ? 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500/30'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{p.icon}</span>
                <span className="text-sm font-medium text-gray-200">{p.name}</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5 ml-6">{p.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Streaming style */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Streaming Style
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {streamingStyles.map((s) => (
            <button
              key={s.id}
              onClick={() => setScene({ streamingStyle: s.id })}
              className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                scene.streamingStyle === s.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-400 border border-gray-700 hover:text-gray-200'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Fine-grained controls */}
      <div className="space-y-4">
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Fine Controls
        </label>

        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-gray-400">Typing Speed</span>
            <span className="text-gray-500 font-mono">{timing.typingSpeed}ms/char</span>
          </div>
          <input
            type="range"
            min={5}
            max={100}
            value={timing.typingSpeed}
            onChange={(e) => setTiming({ typingSpeed: Number(e.target.value) })}
            className="w-full accent-indigo-500 h-1.5"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-gray-400">Stream Speed</span>
            <span className="text-gray-500 font-mono">{timing.streamSpeed}ms/token</span>
          </div>
          <input
            type="range"
            min={3}
            max={80}
            value={timing.streamSpeed}
            onChange={(e) => setTiming({ streamSpeed: Number(e.target.value) })}
            className="w-full accent-indigo-500 h-1.5"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-gray-400">Delay Before Assistant</span>
            <span className="text-gray-500 font-mono">{timing.delayBeforeAssistant}ms</span>
          </div>
          <input
            type="range"
            min={100}
            max={3000}
            step={100}
            value={timing.delayBeforeAssistant}
            onChange={(e) => setTiming({ delayBeforeAssistant: Number(e.target.value) })}
            className="w-full accent-indigo-500 h-1.5"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-gray-400">Delay After Assistant</span>
            <span className="text-gray-500 font-mono">{timing.delayAfterAssistant}ms</span>
          </div>
          <input
            type="range"
            min={100}
            max={2000}
            step={100}
            value={timing.delayAfterAssistant}
            onChange={(e) => setTiming({ delayAfterAssistant: Number(e.target.value) })}
            className="w-full accent-indigo-500 h-1.5"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-gray-400">Final Pause</span>
            <span className="text-gray-500 font-mono">{timing.finalPauseDuration}ms</span>
          </div>
          <input
            type="range"
            min={500}
            max={5000}
            step={500}
            value={timing.finalPauseDuration}
            onChange={(e) => setTiming({ finalPauseDuration: Number(e.target.value) })}
            className="w-full accent-indigo-500 h-1.5"
          />
        </div>
      </div>
    </div>
  );
}
