import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useStore } from '../../store';
import type { ThemeMode } from '../../types';

/*
 * Generic/Custom AI Chat Template
 * Fully customizable - uses accent color from scene config
 */

const getColors = (theme: ThemeMode, accentColor: string) => ({
  dark: {
    bg: '#0f172a',
    sidebar: '#1e293b',
    text: '#f1f5f9',
    textMuted: '#94a3b8',
    userBubble: '#1e293b',
    assistantBg: '#1e293b',
    border: '#334155',
    inputBg: '#1e293b',
    accent: accentColor,
    hoverBg: '#334155',
  },
  light: {
    bg: '#ffffff',
    sidebar: '#f8fafc',
    text: '#0f172a',
    textMuted: '#64748b',
    userBubble: '#f1f5f9',
    assistantBg: '#f8fafc',
    border: '#e2e8f0',
    inputBg: '#ffffff',
    accent: accentColor,
    hoverBg: '#f1f5f9',
  }
})[theme];

function UserMessage({ content, theme, accent }: { content: string; theme: ThemeMode; accent: string }) {
  const c = getColors(theme, accent);
  return (
    <div className="flex gap-4 mb-6 animate-fadeIn">
      <div 
        className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold"
        style={{ background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)' }}
      >
        U
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: c.textMuted }}>You</p>
        <div style={{ color: c.text, fontSize: '15px', lineHeight: '1.6' }}>{content}</div>
      </div>
    </div>
  );
}

function AssistantMessage({ content, theme, accent }: { content: string; theme: ThemeMode; accent: string }) {
  const c = getColors(theme, accent);
  return (
    <div className="flex gap-4 mb-6 animate-fadeIn">
      <div 
        className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold"
        style={{ backgroundColor: accent }}
      >
        AI
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: accent }}>Assistant</p>
        <div style={{ color: c.text, fontSize: '15px', lineHeight: '1.6' }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
              ul: ({ children }) => <ul className="list-disc pl-5 mb-4 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-5 mb-4 space-y-1">{children}</ol>,
              code: ({ className, children }) => {
                const isBlock = className?.includes('language-');
                if (isBlock) {
                  const lang = className?.replace('language-', '') || '';
                  return (
                    <div className="rounded-lg my-4 overflow-hidden border" style={{ borderColor: c.border, backgroundColor: theme === 'dark' ? '#0f172a' : '#f8fafc' }}>
                      <div className="flex items-center justify-between px-4 py-2 text-xs border-b" style={{ borderColor: c.border, color: c.textMuted }}>
                        <span className="font-medium">{lang}</span>
                        <button style={{ color: accent }}>Copy</button>
                      </div>
                      <pre className="p-4 overflow-x-auto text-sm"><code style={{ color: c.text }}>{children}</code></pre>
                    </div>
                  );
                }
                return <code className="px-1.5 py-0.5 rounded text-sm" style={{ backgroundColor: c.border, color: accent }}>{children}</code>;
              },
              table: ({ children }) => <div className="overflow-x-auto my-4"><table className="w-full text-sm border-collapse border" style={{ borderColor: c.border }}>{children}</table></div>,
              th: ({ children }) => <th className="text-left px-3 py-2 font-semibold border" style={{ borderColor: c.border, backgroundColor: c.hoverBg }}>{children}</th>,
              td: ({ children }) => <td className="px-3 py-2 border" style={{ borderColor: c.border }}>{children}</td>,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export default function GenericTemplate() {
  const { scene, visibleMessages, streamingText, isTyping, playbackState, currentStep, messages } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const c = getColors(scene.theme, scene.accentColor);

  const currentMsg = currentStep >= 0 && currentStep < messages.length ? messages[currentStep] : null;
  const isUserTyping = playbackState === 'playing' && currentMsg?.role === 'user' && isTyping;
  const isAssistantStreaming = playbackState === 'playing' && currentMsg?.role === 'assistant' && streamingText && !isTyping;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [visibleMessages, streamingText, isTyping]);

  return (
    <div className="flex h-full w-full overflow-hidden" style={{ backgroundColor: c.bg, fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Sidebar */}
      {scene.sidebarVisible && (
        <div className="w-[260px] flex-shrink-0 flex flex-col border-r" style={{ backgroundColor: c.sidebar, borderColor: c.border }}>
          <div className="p-3">
            <button 
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border"
              style={{ borderColor: c.border, color: c.text }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New conversation
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-2">
            <div 
              className="px-3 py-2.5 rounded-lg text-sm truncate"
              style={{ backgroundColor: c.hoverBg, color: c.text }}
            >
              Current conversation
            </div>
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center px-5 h-14 border-b" style={{ borderColor: c.border }}>
          <span className="font-semibold" style={{ color: c.text }}>AI Assistant</span>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5">
          <div className="max-w-3xl mx-auto py-6">
            {visibleMessages.map((msg) => (
              msg.role === 'user' 
                ? <UserMessage key={msg.id} content={msg.content} theme={scene.theme} accent={scene.accentColor} />
                : <AssistantMessage key={msg.id} content={msg.content} theme={scene.theme} accent={scene.accentColor} />
            ))}

            {isUserTyping && streamingText && (
              <div className="flex gap-4 mb-6">
                <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)' }}>U</div>
                <div className="flex-1">
                  <p className="text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: c.textMuted }}>You</p>
                  <div style={{ color: c.text, fontSize: '15px' }}>
                    {streamingText}<span className="inline-block w-[2px] h-4 ml-0.5 align-text-bottom animate-pulse" style={{ backgroundColor: c.text }} />
                  </div>
                </div>
              </div>
            )}

            {playbackState === 'playing' && isTyping && currentMsg?.role === 'assistant' && (
              <div className="flex gap-4 mb-6">
                <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: scene.accentColor }}>AI</div>
                <div className="flex items-center gap-1.5 pt-3">
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: scene.accentColor, animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: scene.accentColor, animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: scene.accentColor, animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            {isAssistantStreaming && (
              <div className="flex gap-4 mb-6">
                <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: scene.accentColor }}>AI</div>
                <div className="flex-1">
                  <p className="text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: scene.accentColor }}>Assistant</p>
                  <div style={{ color: c.text, fontSize: '15px', lineHeight: '1.6' }}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{streamingText}</ReactMarkdown>
                    <span className="inline-block w-[3px] h-5 ml-0.5 align-text-bottom rounded-sm animate-pulse" style={{ backgroundColor: scene.accentColor }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-5">
          <div className="max-w-3xl mx-auto">
            <div className="relative rounded-xl border overflow-hidden" style={{ backgroundColor: c.inputBg, borderColor: c.border }}>
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="flex-1" style={{ color: c.textMuted, fontSize: '15px' }}>Type your message...</span>
                <button className="w-9 h-9 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: scene.accentColor }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
