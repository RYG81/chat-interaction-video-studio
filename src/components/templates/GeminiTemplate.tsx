import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useStore } from '../../store';
import type { ThemeMode } from '../../types';

/*
 * EXACT Google Gemini UI Clone - 2025
 * Font: Google Sans / Google Sans Text
 * Colors from gemini.google.com
 */

const colors = {
  dark: {
    bg: '#1e1f20',
    sidebar: '#131314',
    text: '#e3e3e3',
    textMuted: '#9aa0a6',
    userBubble: '#004a77',
    userText: '#c2e7ff',
    border: '#3c4043',
    inputBg: '#282a2c',
    hoverBg: '#37393b',
    activeBg: '#394457',
  },
  light: {
    bg: '#ffffff',
    sidebar: '#f0f4f9',
    text: '#1f1f1f',
    textMuted: '#5f6368',
    userBubble: '#d3e3fd',
    userText: '#041e49',
    border: '#c4c7c5',
    inputBg: '#f0f4f9',
    hoverBg: '#e8eaed',
    activeBg: '#d3e3fd',
  }
};

// Gemini sparkle/star icon
const GeminiIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <path 
      d="M14 0C14 7.732 7.732 14 0 14C7.732 14 14 20.268 14 28C14 20.268 20.268 14 28 14C20.268 14 14 7.732 14 0Z" 
      fill="url(#gemini_grad)"
    />
    <defs>
      <linearGradient id="gemini_grad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4285f4"/>
        <stop offset="0.5" stopColor="#9b72cb"/>
        <stop offset="1" stopColor="#d96570"/>
      </linearGradient>
    </defs>
  </svg>
);

function UserMessage({ content, theme }: { content: string; theme: ThemeMode }) {
  const c = colors[theme];
  return (
    <div className="flex justify-end mb-6 animate-fadeIn">
      <div 
        className="max-w-[80%] rounded-[24px] px-5 py-3"
        style={{ 
          backgroundColor: c.userBubble,
          color: c.userText,
          fontFamily: '"Google Sans Text", "Google Sans", Roboto, Arial, sans-serif',
          fontSize: '16px',
          lineHeight: '1.5',
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
    <div className="flex gap-4 mb-8 animate-fadeIn">
      <div className="flex-shrink-0 mt-1">
        <GeminiIcon size={28} />
      </div>
      <div 
        className="flex-1 min-w-0"
        style={{ 
          color: c.text,
          fontFamily: '"Google Sans Text", "Google Sans", Roboto, Arial, sans-serif',
          fontSize: '16px',
          lineHeight: '1.6',
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
            strong: ({ children }) => <strong className="font-medium">{children}</strong>,
            ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1.5">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1.5">{children}</ol>,
            code: ({ className, children }) => {
              const isBlock = className?.includes('language-');
              if (isBlock) {
                const lang = className?.replace('language-', '') || '';
                return (
                  <div className="rounded-lg my-4 overflow-hidden border" style={{ borderColor: c.border, backgroundColor: theme === 'dark' ? '#282a2c' : '#f8f9fa' }}>
                    <div className="flex items-center justify-between px-4 py-2 text-xs border-b" style={{ borderColor: c.border, color: c.textMuted }}>
                      <span className="font-medium">{lang}</span>
                      <button className="flex items-center gap-1">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                        Copy
                      </button>
                    </div>
                    <pre className="p-4 overflow-x-auto text-sm" style={{ fontFamily: '"Google Sans Mono", "Roboto Mono", monospace' }}>
                      <code style={{ color: c.text }}>{children}</code>
                    </pre>
                  </div>
                );
              }
              return (
                <code className="px-1.5 py-0.5 rounded text-sm" style={{ backgroundColor: c.hoverBg, color: theme === 'dark' ? '#8ab4f8' : '#1a73e8', fontFamily: '"Google Sans Mono", monospace' }}>
                  {children}
                </code>
              );
            },
            table: ({ children }) => (
              <div className="overflow-x-auto my-4">
                <table className="w-full text-sm border-collapse border" style={{ borderColor: c.border }}>{children}</table>
              </div>
            ),
            th: ({ children }) => (
              <th className="text-left px-3 py-2 font-medium border" style={{ borderColor: c.border, backgroundColor: c.hoverBg }}>{children}</th>
            ),
            td: ({ children }) => (
              <td className="px-3 py-2 border" style={{ borderColor: c.border }}>{children}</td>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
        
        {/* Action buttons */}
        <div className="flex items-center gap-1 mt-4">
          {['👍', '👎', '🔄', '📋', '⋯'].map((icon, i) => (
            <button 
              key={i}
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm transition-colors"
              style={{ color: c.textMuted }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = c.hoverBg}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function GeminiTemplate() {
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
        fontFamily: '"Google Sans", Roboto, Arial, sans-serif',
      }}
    >
      {/* Sidebar */}
      {scene.sidebarVisible && (
        <div className="w-[280px] flex-shrink-0 flex flex-col p-3" style={{ backgroundColor: c.sidebar }}>
          {/* New chat button */}
          <button 
            className="flex items-center gap-3 px-5 py-3 rounded-full text-sm font-medium mb-6 transition-colors"
            style={{ 
              backgroundColor: scene.theme === 'dark' ? '#37393b' : '#ffffff',
              color: c.text,
              boxShadow: scene.theme === 'light' ? '0 1px 3px rgba(0,0,0,0.12)' : 'none',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New chat
          </button>

          {/* Chat list */}
          <div className="flex-1 overflow-y-auto space-y-1">
            <div className="text-xs font-medium px-4 py-2" style={{ color: c.textMuted }}>Recent</div>
            <div 
              className="flex items-center gap-3 px-4 py-3 rounded-full text-sm truncate"
              style={{ backgroundColor: c.activeBg, color: scene.theme === 'dark' ? '#c2e7ff' : '#041e49' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
              Neural Networks
            </div>
            <div 
              className="flex items-center gap-3 px-4 py-3 rounded-full text-sm truncate cursor-pointer transition-colors"
              style={{ color: c.text }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = c.hoverBg}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
              Python Tutorial
            </div>
          </div>

          {/* User */}
          <div className="pt-3 border-t" style={{ borderColor: c.border }}>
            <div 
              className="flex items-center gap-3 px-4 py-2 rounded-full cursor-pointer transition-colors"
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = c.hoverBg}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">U</div>
              <span className="text-sm font-medium" style={{ color: c.text }}>user@gmail.com</span>
            </div>
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-xl" style={{ color: c.text }}>Gemini</span>
            <span 
              className="text-[10px] px-2 py-0.5 rounded-sm font-medium uppercase tracking-wide"
              style={{ backgroundColor: scene.theme === 'dark' ? '#394457' : '#d3e3fd', color: scene.theme === 'dark' ? '#8ab4f8' : '#1967d2' }}
            >
              {scene.modelName}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-600" />
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6">
          <div className="max-w-3xl mx-auto py-6">
            {visibleMessages.map((msg) => (
              msg.role === 'user' 
                ? <UserMessage key={msg.id} content={msg.content} theme={scene.theme} />
                : <AssistantMessage key={msg.id} content={msg.content} theme={scene.theme} />
            ))}

            {isUserTyping && streamingText && (
              <div className="flex justify-end mb-6">
                <div className="max-w-[80%] rounded-[24px] px-5 py-3" style={{ backgroundColor: c.userBubble, color: c.userText, fontSize: '16px' }}>
                  {streamingText}<span className="inline-block w-[2px] h-4 ml-0.5 align-text-bottom animate-pulse" style={{ backgroundColor: c.userText }} />
                </div>
              </div>
            )}

            {playbackState === 'playing' && isTyping && currentMsg?.role === 'assistant' && (
              <div className="flex gap-4 mb-8">
                <div className="animate-pulse"><GeminiIcon size={28} /></div>
                <div className="flex items-center gap-2 pt-2">
                  <div className="h-2 w-32 rounded-full animate-pulse" style={{ background: 'linear-gradient(90deg, #4285f4 0%, #9b72cb 50%, #d96570 100%)' }} />
                </div>
              </div>
            )}

            {isAssistantStreaming && (
              <div className="flex gap-4 mb-8">
                <div><GeminiIcon size={28} /></div>
                <div className="flex-1" style={{ color: c.text, fontSize: '16px', lineHeight: '1.6' }}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{streamingText}</ReactMarkdown>
                  <span className="inline-block w-[3px] h-5 ml-0.5 align-text-bottom rounded-sm animate-pulse" style={{ background: 'linear-gradient(180deg, #4285f4, #d96570)' }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Composer */}
        <div className="p-6">
          <div className="max-w-3xl mx-auto">
            <div 
              className="relative rounded-[28px] border-2"
              style={{ backgroundColor: c.inputBg, borderColor: c.border }}
            >
              <div className="flex items-center gap-3 px-5 py-4">
                <span className="flex-1" style={{ color: c.textMuted, fontSize: '16px' }}>Enter a prompt here</span>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-full transition-colors" style={{ color: c.textMuted }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>
                  </button>
                  <button className="p-2 rounded-full bg-blue-600 text-white">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                  </button>
                </div>
              </div>
            </div>
            <p className="text-xs text-center mt-3" style={{ color: c.textMuted }}>
              Gemini may display inaccurate info, including about people, so double-check its responses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
