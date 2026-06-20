import { useStore } from '../../store';
import type { TemplateName, ThemeMode, DeviceFrame } from '../../types';

const templates: { id: TemplateName; name: string; desc: string; icon: string }[] = [
  { id: 'chatgpt', name: 'ChatGPT-style', desc: 'Dark sidebar, rounded bubbles', icon: '🟢' },
  { id: 'gemini', name: 'Gemini-style', desc: 'Clean, gradient avatar', icon: '🔵' },
  { id: 'claude', name: 'Claude-style', desc: 'Warm tones, amber accent', icon: '🟠' },
  { id: 'generic', name: 'Custom', desc: 'Fully customizable template', icon: '⚙️' },
];

const modelPresets: Record<TemplateName, string[]> = {
  chatgpt: ['GPT-4o', 'GPT-4o mini', 'GPT-4', 'o1-preview', 'o1-mini'],
  gemini: ['1.5 Pro', '1.5 Flash', '1.0 Ultra', '2.0 Flash'],
  claude: ['3.5 Sonnet', '3.5 Haiku', '3 Opus', '4 Sonnet'],
  generic: ['Assistant', 'AI Helper', 'Custom Model'],
};

export default function TemplatePanel() {
  const { scene, setScene } = useStore();

  return (
    <div className="space-y-6">
      {/* Template selection */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Interface Template
        </label>
        <div className="grid grid-cols-2 gap-2">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setScene({ template: t.id, modelName: modelPresets[t.id][0] });
              }}
              className={`text-left p-3 rounded-xl border transition-all ${
                scene.template === t.id
                  ? 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500/30'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800'
              }`}
            >
              <div className="text-lg mb-1">{t.icon}</div>
              <div className="text-sm font-medium text-gray-200">{t.name}</div>
              <div className="text-xs text-gray-500 mt-0.5">{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Theme */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Theme
        </label>
        <div className="flex gap-2">
          {(['light', 'dark'] as ThemeMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setScene({ theme: mode })}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium capitalize transition-all ${
                scene.theme === mode
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-gray-200 border border-gray-700'
              }`}
            >
              {mode === 'light' ? '☀️' : '🌙'} {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Device */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Device Frame
        </label>
        <div className="flex gap-2">
          {([
            { id: 'desktop', icon: '🖥️', label: 'Desktop' },
            { id: 'mobile', icon: '📱', label: 'Mobile' },
            { id: 'tablet', icon: '📋', label: 'Tablet' },
          ] as { id: DeviceFrame; icon: string; label: string }[]).map((d) => (
            <button
              key={d.id}
              onClick={() => setScene({ device: d.id })}
              className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                scene.device === d.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-gray-200 border border-gray-700'
              }`}
            >
              <span className="text-base">{d.icon}</span>
              <div className="text-xs mt-1">{d.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Model Name */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Model Name
        </label>
        <select
          value={scene.modelName}
          onChange={(e) => setScene({ modelName: e.target.value })}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-200 focus:border-indigo-500 focus:outline-none"
        >
          {(modelPresets[scene.template] || []).map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Sidebar toggle */}
      <div className="flex items-center justify-between">
        <label className="text-sm text-gray-300">Show sidebar</label>
        <button
          onClick={() => setScene({ sidebarVisible: !scene.sidebarVisible })}
          className={`w-10 h-6 rounded-full transition-all relative ${
            scene.sidebarVisible ? 'bg-indigo-600' : 'bg-gray-700'
          }`}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
              scene.sidebarVisible ? 'left-5' : 'left-1'
            }`}
          />
        </button>
      </div>

      {/* Accent color for custom */}
      {scene.template === 'generic' && (
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Accent Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={scene.accentColor}
              onChange={(e) => setScene({ accentColor: e.target.value })}
              className="w-10 h-10 rounded-lg border border-gray-700 cursor-pointer"
            />
            <input
              type="text"
              value={scene.accentColor}
              onChange={(e) => setScene({ accentColor: e.target.value })}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 font-mono"
            />
          </div>
        </div>
      )}
    </div>
  );
}
