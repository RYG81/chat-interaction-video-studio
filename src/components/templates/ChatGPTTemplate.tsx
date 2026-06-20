import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useStore } from '../../store';
import type { ThemeMode } from '../../types';

/*
 * EXACT ChatGPT UI Clone - May 2025
 * Font: Söhne (fallback to system fonts)
 * Colors extracted from chatgpt.com CSS variables
 */

const colors = {
  dark: {
    // Main surfaces
    mainSurfacePrimary: '#212121',
    mainSurfaceSecondary: '#2f2f2f', 
    mainSurfaceTertiary: '#424242',
    // Sidebar
    sidebarSurfacePrimary: '#171717',
    sidebarSurfaceSecondary: '#0d0d0d',
    sidebarSurfaceTertiary: '#212121',
    // Text
    textPrimary: '#ececec',
    textSecondary: '#b4b4b4',
    textTertiary: '#8e8e8e',
    // Components
    borderLight: '#2f2f2f',
    borderMedium: '#424242',
    userBubble: '#2f2f2f',
    iconDefault: '#b4b4b4',
    iconHover: '#ffffff',
    buttonPrimary: '#ffffff',
    buttonPrimaryText: '#000000',
  },
  light: {
    mainSurfacePrimary: '#ffffff',
    mainSurfaceSecondary: '#f7f7f8',
    mainSurfaceTertiary: '#ececec',
    sidebarSurfacePrimary: '#f9f9f9',
    sidebarSurfaceSecondary: '#ececec',
    sidebarSurfaceTertiary: '#e5e5e5',
    textPrimary: '#0d0d0d',
    textSecondary: '#6e6e6e',
    textTertiary: '#8e8e8e',
    borderLight: '#e5e5e5',
    borderMedium: '#d9d9d9',
    userBubble: '#f4f4f4',
    iconDefault: '#6e6e6e',
    iconHover: '#0d0d0d',
    buttonPrimary: '#0d0d0d',
    buttonPrimaryText: '#ffffff',
  }
};

// Official OpenAI/ChatGPT logo SVG
const OpenAILogo = ({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364l2.0201-1.1638a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.4022-.6813zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" fill={color}/>
  </svg>
);

function UserMessage({ content, theme }: { content: string; theme: ThemeMode }) {
  const c = colors[theme];
  return (
    <div className="flex justify-end mb-6 animate-fadeIn group">
      <div 
        className="max-w-[70%] rounded-3xl px-4 py-2.5"
        style={{ 
          backgroundColor: c.userBubble,
          color: c.textPrimary,
          fontFamily: '"Söhne", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
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
    <div className="flex gap-4 mb-6 animate-fadeIn group">
      {/* Avatar */}
      <div 
        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
        style={{ 
          backgroundColor: theme === 'dark' ? '#ab68ff' : '#000000',
          border: theme === 'light' ? '1px solid #e5e5e5' : 'none'
        }}
      >
        <OpenAILogo size={16} color="#ffffff" />
      </div>
      
      {/* Message content */}
      <div 
        className="flex-1 min-w-0"
        style={{ 
          color: c.textPrimary,
          fontFamily: '"Söhne", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
          fontSize: '16px',
          lineHeight: '1.6',
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            em: ({ children }) => <em className="italic">{children}</em>,
            ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
            li: ({ children }) => <li className="pl-1">{children}</li>,
            h1: ({ children }) => <h1 className="text-2xl font-semibold mb-4 mt-6 first:mt-0">{children}</h1>,
            h2: ({ children }) => <h2 className="text-xl font-semibold mb-3 mt-5 first:mt-0">{children}</h2>,
            h3: ({ children }) => <h3 className="text-lg font-semibold mb-2 mt-4 first:mt-0">{children}</h3>,
            code: ({ className, children }) => {
              const isBlock = className?.includes('language-');
              if (isBlock) {
                const lang = className?.replace('language-', '') || '';
                return (
                  <div className="rounded-md my-4 overflow-hidden" style={{ backgroundColor: '#0d0d0d' }}>
                    <div 
                      className="flex items-center justify-between px-4 py-2 text-xs"
                      style={{ backgroundColor: '#2f2f2f', color: '#b4b4b4' }}
                    >
                      <span className="font-medium">{lang}</span>
                      <button className="flex items-center gap-1.5 hover:text-white transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2"/>
                          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                        </svg>
                        Copy code
                      </button>
                    </div>
                    <pre className="p-4 overflow-x-auto text-sm" style={{ fontFamily: '"Söhne Mono", Monaco, "Andale Mono", "Ubuntu Mono", monospace' }}>
                      <code style={{ color: '#f4f4f4' }}>{children}</code>
                    </pre>
                  </div>
                );
              }
              return (
                <code 
                  className="px-1 py-0.5 rounded text-sm"
                  style={{ 
                    backgroundColor: theme === 'dark' ? '#424242' : '#f4f4f4',
                    color: theme === 'dark' ? '#f4f4f4' : '#0d0d0d',
                    fontFamily: '"Söhne Mono", Monaco, monospace',
                  }}
                >
                  {children}
                </code>
              );
            },
            table: ({ children }) => (
              <div className="overflow-x-auto my-4">
                <table className="w-full text-sm border-collapse" style={{ borderColor: c.borderMedium }}>
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th 
                className="text-left px-3 py-2 font-semibold border-b"
                style={{ borderColor: c.borderMedium, backgroundColor: c.mainSurfaceSecondary }}
              >
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-3 py-2 border-b" style={{ borderColor: c.borderLight }}>{children}</td>
            ),
            blockquote: ({ children }) => (
              <blockquote 
                className="border-l-4 pl-4 my-4 italic"
                style={{ borderColor: c.borderMedium, color: c.textSecondary }}
              >
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

export default function ChatGPTTemplate() {
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
        backgroundColor: c.mainSurfacePrimary,
        fontFamily: '"Söhne", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Sidebar */}
      {scene.sidebarVisible && (
        <div 
          className="w-[260px] flex-shrink-0 flex flex-col h-full"
          style={{ backgroundColor: c.sidebarSurfacePrimary }}
        >
          {/* New chat button */}
          <div className="p-2">
            <button 
              className="w-full flex items-center gap-2 px-3 py-3 rounded-lg text-sm transition-colors"
              style={{ 
                color: c.textPrimary,
                backgroundColor: 'transparent',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = c.sidebarSurfaceTertiary}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <OpenAILogo size={20} color={c.textPrimary} />
              <span className="flex-1 text-left font-medium">ChatGPT</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
          </div>

          {/* Chat history */}
          <div className="flex-1 overflow-y-auto px-2">
            <div className="text-xs font-semibold px-3 py-2 uppercase tracking-wide" style={{ color: c.textTertiary }}>
              Today
            </div>
            <div 
              className="px-3 py-2 rounded-lg text-sm truncate mb-0.5"
              style={{ backgroundColor: c.sidebarSurfaceTertiary, color: c.textPrimary }}
            >
              Neural Networks Overview
            </div>
            <div 
              className="px-3 py-2 rounded-lg text-sm truncate mb-0.5 cursor-pointer transition-colors"
              style={{ color: c.textSecondary }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = c.sidebarSurfaceTertiary}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              React Performance Tips
            </div>
            <div 
              className="px-3 py-2 rounded-lg text-sm truncate cursor-pointer transition-colors"
              style={{ color: c.textSecondary }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = c.sidebarSurfaceTertiary}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              API Design Best Practices
            </div>
          </div>

          {/* User section */}
          <div className="p-2 border-t" style={{ borderColor: c.borderLight }}>
            <div 
              className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer"
              style={{ color: c.textPrimary }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = c.sidebarSurfaceTertiary}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold" style={{ background: 'linear-gradient(135deg, #ab68ff 0%, #6366f1 100%)' }}>
                U
              </div>
              <span className="text-sm font-medium">User</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header 
          className="flex items-center justify-between px-4 h-14 flex-shrink-0"
          style={{ borderBottom: `1px solid ${c.borderLight}` }}
        >
          <div className="flex items-center gap-1">
            <span className="font-semibold" style={{ color: c.textPrimary }}>{scene.modelName}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c.textSecondary} strokeWidth="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
          <button 
            className="p-2 rounded-lg transition-colors"
            style={{ color: c.iconDefault }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = c.mainSurfaceSecondary}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
            </svg>
          </button>
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-6">
            {visibleMessages.map((msg) => (
              msg.role === 'user' 
                ? <UserMessage key={msg.id} content={msg.content} theme={scene.theme} />
                : <AssistantMessage key={msg.id} content={msg.content} theme={scene.theme} />
            ))}

            {/* User typing */}
            {isUserTyping && streamingText && (
              <div className="flex justify-end mb-6">
                <div 
                  className="max-w-[70%] rounded-3xl px-4 py-2.5"
                  style={{ backgroundColor: c.userBubble, color: c.textPrimary, fontSize: '16px' }}
                >
                  {streamingText}
                  <span className="inline-block w-[2px] h-4 ml-0.5 align-text-bottom animate-pulse" style={{ backgroundColor: c.textPrimary }} />
                </div>
              </div>
            )}

            {/* Assistant thinking */}
            {playbackState === 'playing' && isTyping && currentMsg?.role === 'assistant' && (
              <div className="flex gap-4 mb-6">
                <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: scene.theme === 'dark' ? '#ab68ff' : '#000000' }}>
                  <OpenAILogo size={16} color="#ffffff" />
                </div>
                <div className="flex items-center gap-1 pt-2">
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: c.textSecondary, animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: c.textSecondary, animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: c.textSecondary, animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            {/* Assistant streaming */}
            {isAssistantStreaming && (
              <div className="flex gap-4 mb-6">
                <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: scene.theme === 'dark' ? '#ab68ff' : '#000000' }}>
                  <OpenAILogo size={16} color="#ffffff" />
                </div>
                <div className="flex-1" style={{ color: c.textPrimary, fontSize: '16px', lineHeight: '1.6' }}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{streamingText}</ReactMarkdown>
                  <span className="inline-block w-[3px] h-5 ml-0.5 align-text-bottom rounded-sm animate-pulse" style={{ backgroundColor: c.textPrimary }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Composer */}
        <div className="p-4 flex-shrink-0">
          <div className="max-w-3xl mx-auto">
            <div 
              className="relative rounded-3xl border overflow-hidden"
              style={{ backgroundColor: c.mainSurfaceSecondary, borderColor: c.borderMedium }}
            >
              <div className="flex items-center gap-2 px-4 py-3">
                <button className="p-1.5 rounded-lg transition-colors" style={{ color: c.iconDefault }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
                  </svg>
                </button>
                <div className="flex-1 text-base" style={{ color: c.textTertiary }}>
                  Message ChatGPT
                </div>
                <button 
                  className="p-2 rounded-full transition-colors"
                  style={{ backgroundColor: c.buttonPrimary, color: c.buttonPrimaryText }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 19V5M5 12l7-7 7 7"/>
                  </svg>
                </button>
              </div>
            </div>
            <p className="text-xs text-center mt-2" style={{ color: c.textTertiary }}>
              ChatGPT can make mistakes. Check important info.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
