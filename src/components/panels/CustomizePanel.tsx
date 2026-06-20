import { useStore } from '../../store';

const fontOptions = [
  { id: 'system', name: 'System Default', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  { id: 'inter', name: 'Inter', value: 'Inter, sans-serif' },
  { id: 'sf', name: 'SF Pro', value: '"SF Pro Display", -apple-system, sans-serif' },
  { id: 'roboto', name: 'Roboto', value: 'Roboto, sans-serif' },
];

const sidebarWidthOptions = [
  { id: 'narrow', name: 'Narrow', value: 220 },
  { id: 'default', name: 'Default', value: 260 },
  { id: 'wide', name: 'Wide', value: 300 },
];

export default function CustomizePanel() {
  const { scene, setScene } = useStore();

  return (
    <div className="space-y-6">
      {/* Quick info */}
      <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
        <p className="text-xs text-indigo-300">
          Customize the visual appearance of the chat interface. Changes apply to all templates.
        </p>
      </div>

      {/* Colors */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Accent Color
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={scene.accentColor}
            onChange={(e) => setScene({ accentColor: e.target.value })}
            className="w-12 h-12 rounded-xl border border-gray-700 cursor-pointer bg-transparent"
          />
          <div className="flex-1">
            <input
              type="text"
              value={scene.accentColor}
              onChange={(e) => setScene({ accentColor: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 font-mono focus:border-indigo-500 focus:outline-none"
            />
            <p className="text-[10px] text-gray-500 mt-1">Used for buttons, links, and highlights</p>
          </div>
        </div>
      </div>

      {/* Preset accent colors */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Preset Colors
        </label>
        <div className="grid grid-cols-6 gap-2">
          {[
            '#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f43f5e', '#ef4444',
            '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981',
            '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#1d4ed8', '#4f46e5',
          ].map((color) => (
            <button
              key={color}
              onClick={() => setScene({ accentColor: color })}
              className={`w-full aspect-square rounded-lg border-2 transition-all ${
                scene.accentColor === color ? 'border-white scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Font */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Font Family
        </label>
        <div className="space-y-1.5">
          {fontOptions.map((font) => (
            <button
              key={font.id}
              className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all ${
                scene.accentColor === font.id
                  ? 'border-indigo-500 bg-indigo-500/10'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              }`}
            >
              <span className="text-sm text-gray-200" style={{ fontFamily: font.value }}>{font.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* UI Scale */}
      <div>
        <div className="flex justify-between text-xs mb-2">
          <label className="font-semibold text-gray-400 uppercase tracking-wider">Message Font Size</label>
          <span className="text-gray-500 font-mono">15px</span>
        </div>
        <input
          type="range"
          min={12}
          max={18}
          defaultValue={15}
          className="w-full accent-indigo-500 h-1.5"
        />
      </div>

      {/* Avatar Style */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Avatar Style
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'circle', name: 'Circle' },
            { id: 'rounded', name: 'Rounded' },
            { id: 'square', name: 'Square' },
          ].map((style) => (
            <button
              key={style.id}
              className="py-2.5 px-3 rounded-lg text-xs font-medium bg-gray-800 text-gray-400 border border-gray-700 hover:text-gray-200 transition-all"
            >
              {style.name}
            </button>
          ))}
        </div>
      </div>

      {/* Message Bubble Style */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Message Bubble Radius
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'sharp', name: 'Sharp', value: '8px' },
            { id: 'rounded', name: 'Rounded', value: '16px' },
            { id: 'pill', name: 'Pill', value: '24px' },
          ].map((style) => (
            <button
              key={style.id}
              className="py-2.5 px-3 rounded-lg text-xs font-medium bg-gray-800 text-gray-400 border border-gray-700 hover:text-gray-200 transition-all"
            >
              {style.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sidebar Width */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Sidebar Width
        </label>
        <div className="grid grid-cols-3 gap-2">
          {sidebarWidthOptions.map((opt) => (
            <button
              key={opt.id}
              className="py-2.5 px-3 rounded-lg text-xs font-medium bg-gray-800 text-gray-400 border border-gray-700 hover:text-gray-200 transition-all"
            >
              {opt.name}
            </button>
          ))}
        </div>
      </div>

      {/* Code Block Theme */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Code Block Theme
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'dark', name: 'Dark (VS Code)' },
            { id: 'light', name: 'Light' },
            { id: 'monokai', name: 'Monokai' },
            { id: 'github', name: 'GitHub' },
          ].map((theme) => (
            <button
              key={theme.id}
              className="py-2.5 px-3 rounded-lg text-xs font-medium bg-gray-800 text-gray-400 border border-gray-700 hover:text-gray-200 transition-all"
            >
              {theme.name}
            </button>
          ))}
        </div>
      </div>

      {/* Reset */}
      <button className="w-full py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-gray-400 text-sm font-medium rounded-xl transition-colors border border-gray-700">
        Reset to Defaults
      </button>
    </div>
  );
}
