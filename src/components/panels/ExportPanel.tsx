import { useStore } from '../../store';
import type { VideoFormat } from '../../types';

const formats: { id: VideoFormat; name: string; desc: string }[] = [
  { id: '16:9', name: 'Landscape', desc: 'YouTube, presentations' },
  { id: '9:16', name: 'Vertical', desc: 'Reels, TikTok, Stories' },
  { id: '1:1', name: 'Square', desc: 'Instagram, social posts' },
];

const resolutions = [
  { id: '720p' as const, name: '720p', desc: 'HD' },
  { id: '1080p' as const, name: '1080p', desc: 'Full HD' },
  { id: '4k' as const, name: '4K', desc: 'Ultra HD' },
];

interface ExportPanelProps {
  onExportMP4?: () => void;
  onExportWebM?: () => void;
  exportState?: 'idle' | 'loading-ffmpeg' | 'recording' | 'converting' | 'done' | 'error';
  exportProgress?: number;
  errorMessage?: string;
}

export default function ExportPanel({
  onExportMP4,
  onExportWebM,
  exportState = 'idle',
  exportProgress = 0,
  errorMessage = '',
}: ExportPanelProps) {
  const { exportConfig, setExportConfig } = useStore();

  const isExporting = exportState === 'recording' || exportState === 'converting' || exportState === 'loading-ffmpeg';

  return (
    <div className="space-y-6">
      {/* Export Status */}
      {exportState !== 'idle' && (
        <div className={`p-4 rounded-xl border ${
          exportState === 'error' ? 'bg-red-500/10 border-red-500/30' :
          exportState === 'done' ? 'bg-green-500/10 border-green-500/30' :
          'bg-indigo-500/10 border-indigo-500/30'
        }`}>
          <div className="flex items-center gap-3 mb-2">
            {isExporting && (
              <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            )}
            {exportState === 'done' && (
              <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
            {exportState === 'error' && (
              <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            )}
            <span className={`text-sm font-medium ${
              exportState === 'error' ? 'text-red-400' :
              exportState === 'done' ? 'text-green-400' :
              'text-indigo-400'
            }`}>
              {exportState === 'loading-ffmpeg' && 'Loading FFmpeg...'}
              {exportState === 'recording' && 'Recording animation...'}
              {exportState === 'converting' && 'Converting to MP4...'}
              {exportState === 'done' && 'Export complete!'}
              {exportState === 'error' && 'Export failed'}
            </span>
          </div>
          {isExporting && (
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
          )}
          {exportState === 'error' && errorMessage && (
            <p className="text-xs text-red-400 mt-2">{errorMessage}</p>
          )}
        </div>
      )}

      {/* Video Format */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Video Format
        </label>
        <div className="space-y-1.5">
          {formats.map((f) => (
            <button
              key={f.id}
              onClick={() => setExportConfig({ format: f.id })}
              disabled={isExporting}
              className={`w-full text-left p-3 rounded-xl border transition-all ${
                exportConfig.format === f.id
                  ? 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500/30'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              } ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-200">{f.name}</span>
                  <span className="text-xs text-gray-500 ml-2">{f.id}</span>
                </div>
                <div className={`flex items-center justify-center border rounded ${
                  f.id === '16:9' ? 'w-8 h-5' : f.id === '9:16' ? 'w-5 h-8' : 'w-6 h-6'
                } ${exportConfig.format === f.id ? 'border-indigo-400 bg-indigo-500/20' : 'border-gray-600'}`} />
              </div>
              <p className="text-xs text-gray-500 mt-1">{f.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Resolution */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Resolution
        </label>
        <div className="flex gap-2">
          {resolutions.map((r) => (
            <button
              key={r.id}
              onClick={() => setExportConfig({ resolution: r.id })}
              disabled={isExporting}
              className={`flex-1 py-2.5 px-3 rounded-lg text-center transition-all ${
                exportConfig.resolution === r.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-400 border border-gray-700 hover:text-gray-200'
              } ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="text-sm font-medium">{r.name}</div>
              <div className="text-[10px] mt-0.5">{r.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Options */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Options
        </label>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-300">Show cursor</label>
            <button
              onClick={() => setExportConfig({ showCursor: !exportConfig.showCursor })}
              disabled={isExporting}
              className={`w-10 h-6 rounded-full transition-all relative ${
                exportConfig.showCursor ? 'bg-indigo-600' : 'bg-gray-700'
              } ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${exportConfig.showCursor ? 'left-5' : 'left-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-300">Click ripple effect</label>
            <button
              onClick={() => setExportConfig({ clickRipple: !exportConfig.clickRipple })}
              disabled={isExporting}
              className={`w-10 h-6 rounded-full transition-all relative ${
                exportConfig.clickRipple ? 'bg-indigo-600' : 'bg-gray-700'
              } ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${exportConfig.clickRipple ? 'left-5' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Watermark Text
        </label>
        <input
          type="text"
          value={exportConfig.watermark}
          onChange={(e) => setExportConfig({ watermark: e.target.value })}
          disabled={isExporting}
          className={`w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-200 focus:border-indigo-500 focus:outline-none ${
            isExporting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          placeholder="Optional watermark..."
        />
      </div>

      {/* Export buttons */}
      <div className="pt-2 space-y-2">
        <button
          onClick={onExportMP4}
          disabled={isExporting}
          className={`w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 ${
            isExporting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {isExporting ? 'Exporting...' : 'Export MP4'}
        </button>
        
        <button
          onClick={onExportWebM}
          disabled={isExporting}
          className={`w-full py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2 border border-gray-700 ${
            isExporting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export WebM (Faster)
        </button>

        <p className="text-[10px] text-gray-500 text-center">
          WebM exports directly. MP4 requires FFmpeg.wasm (may need special browser headers).
        </p>
        <p className="text-[10px] text-yellow-500/80 text-center mt-1">
          ⚠️ For best results, record for at least 5 seconds
        </p>
      </div>
    </div>
  );
}
