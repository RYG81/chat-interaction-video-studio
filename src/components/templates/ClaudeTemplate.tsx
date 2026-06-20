import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useStore } from '../../store';
import type { ThemeMode } from '../../types';

/*
 * EXACT Claude AI UI Clone - 2025
 * Font: Styrene (proprietary) / fallback to system serif-inspired
 * Colors from claude.ai - warm cream/beige palette
 */

const colors = {
  dark: {
    bg: '#2a2825',
    sidebar: '#1a1916',
    text: '#ebe5db',
    textMuted: '#a39b8b',
    userBubble: '#3d3830',
    border: '#3d3830',
    inputBg: '#3d3830',
    inputBorder: '#4d473e',
    accent: '#da7756',
    hoverBg: '#353229',
    activeChat: '#3d3830',
  },
  light: {
    bg: '#faf9f6',
    sidebar: '#f3f0eb',
    text: '#1a1816',
    textMuted: '#6b635b',
    userBubble: '#e9e4db',
    border: '#e5dfd4',
    inputBg: '#ffffff',
    inputBorder: '#d9d3c8',
    accent: '#da7756',
    hoverBg: '#ebe6dd',
    activeChat: '#e9e4db',
  }
};

// Claude logo - simplified globe/world icon (exported for potential future use)
const _ClaudeLogo = ({ size = 24, color = '#da7756' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
    <ellipse cx="12" cy="12" rx="4" ry="10" stroke={color} strokeWidth="1.5" fill="none"/>
    <line x1="2" y1="12" x2="22" y2="12" stroke={color} strokeWidth="1.5"/>
    <path d="M4 7h16M4 17h16" stroke={color} strokeWidth="1" opacity="0.6"/>
  </svg>
);
void _ClaudeLogo; // Silence unused warning

function UserMessage({ content, theme }: { content: string; theme: ThemeMode }) {
  const c = colors[theme];
  return (
    <div className="flex justify-end mb-8 animate-fadeIn">
      <div 
        className="max-w-[75%] rounded-2xl px-5 py-3.5"
        style={{ 
          backgroundColor: c.userBubble,
          color: c.text,
          fontFamily: '"Styrene A", Georgia, "Times New Roman", serif',
          fontSize: '16px',
          lineHeight: '1.6',
        }}
      >
        {content}
      </div>
    </div>
  );
}

function AssistantMessage({ content, theme }: { content: string; theme: ThemeMode }) {
  const c = colors[theme];
  return (
    <div className="flex gap-4 mb-10 animate-fadeIn">
      <div className="flex-shrink-0 mt-1">
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: c.accent }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
        </div>
      </div>
      <div 
        className="flex-1 min-w-0"
        style={{ 
          color: c.text,
          fontFamily: '"Styrene A", Georgia, "Times New Roman", serif',
          fontSize: '17px',
          lineHeight: '1.7',
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className="mb-5 last:mb-0">{children}</p>,
            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            em: ({ children }) => <em className="italic">{children}</em>,
            ul: ({ children }) => <ul className="list-disc pl-6 mb-5 space-y-2">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-6 mb-5 space-y-2">{children}</ol>,
            h1: ({ children }) => <h1 className="text-2xl font-semibold mb-4 mt-8 first:mt-0">{children}</h1>,
            h2: ({ children }) => <h2 className="text-xl font-semibold mb-3 mt-6 first:mt-0">{children}</h2>,
            h3: ({ children }) => <h3 className="text-lg font-semibold mb-2 mt-5 first:mt-0">{children}</h3>,
            code: ({ className, children }) => {
              const isBlock = className?.includes('language-');
              if (isBlock) {
                const lang = className?.replace('language-', '') || '';
                return (
                  <div className="rounded-xl my-5 overflow-hidden border" style={{ borderColor: c.border, backgroundColor: theme === 'dark' ? '#1a1916' : '#faf9f6' }}>
                    <div className="flex items-center justify-between px-4 py-2.5 text-xs border-b" style={{ borderColor: c.border, color: c.textMuted }}>
                      <span className="font-medium uppercase tracking-wide">{lang}</span>
                      <button className="flex items-center gap-1.5" style={{ color: c.accent }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                        Copy
                      </button>
                    </div>
                    <pre className="p-4 overflow-x-auto text-sm" style={{ fontFamily: '"JetBrains Mono", "Fira Code", monospace' }}>
                      <code style={{ color: c.text }}>{children}</code>
                    </pre>
                  </div>
                );
              }
              return (
                <code 
                  className="px-1.5 py-0.5 rounded text-[15px]"
                  style={{ backgroundColor: c.border, color: c.accent, fontFamily: '"JetBrains Mono", monospace' }}
                >
                  {children}
                </code>
              );
            },
            table: ({ children }) => (
              <div className="overflow-x-auto my-5">
                <table className="w-full text-sm border-collapse border" style={{ borderColor: c.border }}>{children}</table>
              </div>
            ),
            th: ({ children }) => (
              <th className="text-left px-4 py-2.5 font-semibold border" style={{ borderColor: c.border, backgroundColor: c.hoverBg }}>{children}</th>
            ),
            td: ({ children }) => (
              <td className="px-4 py-2.5 border" style={{ borderColor: c.border }}>{children}</td>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-3 pl-5 my-5 italic" style={{ borderColor: c.accent, color: c.textMuted }}>
                {children}
              </blockquote>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export default function ClaudeTemplate() {
  const { scene, visibleMessages, streamingText, isTyping, playbackState, currentStep, messages } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const c = colors[scene.theme];

  const currentMsg = currentStep >= 0 && currentStep < messages.length ? messages[currentStep] : null;
  const isUserTyping = playbackState === 'playing' && currentMsg?.role === 'user' && isTyping;
  const isAssistantStreaming = playbackState === 'playing' && currentMsg?.role === 'assistant' && streamingText && !isTyping;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [visibleMessages, streamingText, isTyping]);

  return (
    <div 
      className="flex h-full w-full overflow-hidden"
      style={{ 
        backgroundColor: c.bg,
        fontFamily: '"Styrene A", Georgia, "Times New Roman", serif',
      }}
    >
      {/* Sidebar */}
      {scene.sidebarVisible && (
        <div className="w-[260px] flex-shrink-0 flex flex-col" style={{ backgroundColor: c.sidebar }}>
          {/* New chat */}
          <div className="p-3">
            <button 
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors"
              style={{ borderColor: c.border, color: c.text }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = c.hoverBg}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              New chat
            </button>
          </div>

          {/* Chat list */}
          <div className="flex-1 overflow-y-auto px-2">
            <div className="text-[11px] font-semibold px-3 py-2 uppercase tracking-widest" style={{ color: c.textMuted }}>
              Today
            </div>
            <div 
              className="px-3 py-2.5 rounded-lg text-sm truncate mb-0.5"
              style={{ backgroundColor: c.activeChat, color: c.text }}
            >
              Research on AI Ethics
            </div>
            <div 
              className="px-3 py-2.5 rounded-lg text-sm truncate cursor-pointer transition-colors"
              style={{ color: c.textMuted }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = c.hoverBg}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Code Review Session
            </div>
          </div>

          {/* User */}
          <div className="p-3 border-t" style={{ borderColor: c.border }}>
            <div 
              className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors"
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = c.hoverBg}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium" style={{ backgroundColor: c.accent }}>
                U
              </div>
              <span className="text-sm" style={{ color: c.text }}>User</span>
            </div>
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between px-5 py-3 h-14" style={{ borderBottom: `1px solid ${c.border}` }}>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded flex items-center justify-center" style={{ backgroundColor: c.accent }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
              </svg>
            </div>
            <span className="text-lg font-medium tracking-tight" style={{ color: c.text }}>Claude</span>
            <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: c.hoverBg, color: c.textMuted }}>{scene.modelName}</span>
          </div>
          <button className="px-3 py-1.5 rounded-lg text-sm border transition-colors" style={{ borderColor: c.border, color: c.text }}>
            ⭐ Star
          </button>
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5">
          <div className="max-w-3xl mx-auto py-8">
            {visibleMessages.map((msg) => (
              msg.role === 'user' 
                ? <UserMessage key={msg.id} content={msg.content} theme={scene.theme} />
                : <AssistantMessage key={msg.id} content={msg.content} theme={scene.theme} />
            ))}

            {isUserTyping && streamingText && (
              <div className="flex justify-end mb-8">
                <div className="max-w-[75%] rounded-2xl px-5 py-3.5" style={{ backgroundColor: c.userBubble, color: c.text, fontSize: '16px' }}>
                  {streamingText}<span className="inline-block w-[2px] h-4 ml-0.5 align-text-bottom animate-pulse" style={{ backgroundColor: c.text }} />
                </div>
              </div>
            )}

            {playbackState === 'playing' && isTyping && currentMsg?.role === 'assistant' && (
              <div className="flex gap-4 mb-10">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: c.accent }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="10"/></svg>
                </div>
                <div className="flex items-center gap-1.5 pt-2">
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: c.accent, animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: c.accent, animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: c.accent, animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            {isAssistantStreaming && (
              <div className="flex gap-4 mb-10">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: c.accent }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="10"/></svg>
                </div>
                <div className="flex-1" style={{ color: c.text, fontSize: '17px', lineHeight: '1.7' }}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{streamingText}</ReactMarkdown>
                  <span className="inline-block w-[3px] h-5 ml-0.5 align-text-bottom rounded-sm animate-pulse" style={{ backgroundColor: c.accent }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Composer */}
        <div className="p-5">
          <div className="max-w-3xl mx-auto">
            <div 
              className="relative rounded-2xl border overflow-hidden"
              style={{ backgroundColor: c.inputBg, borderColor: c.inputBorder }}
            >
              <div className="flex items-center gap-3 px-4 py-4">
                <button style={{ color: c.textMuted }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
                  </svg>
                </button>
                <span className="flex-1 text-[17px]" style={{ color: c.textMuted }}>Message Claude...</span>
                <button 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: c.accent }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
