export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  delayBefore?: number;
  duration?: number;
  stream?: boolean;
}

export type TemplateName = 'chatgpt' | 'gemini' | 'claude' | 'generic';
export type ThemeMode = 'light' | 'dark';
export type DeviceFrame = 'desktop' | 'mobile' | 'tablet';
export type VideoFormat = '16:9' | '9:16' | '1:1';
export type AnimationPreset = 'realistic' | 'fast' | 'social' | 'tutorial' | 'cinematic';
export type StreamingStyle = 'token' | 'word' | 'sentence' | 'fade' | 'typewriter';
export type PlaybackState = 'idle' | 'playing' | 'paused' | 'finished';

export interface TimingConfig {
  totalDuration: number; // seconds
  typingSpeed: number; // ms per character
  streamSpeed: number; // ms per token
  delayBeforeAssistant: number; // ms
  delayAfterAssistant: number; // ms
  scrollSpeed: number; // ms
  finalPauseDuration: number; // ms
  autoFitDuration: boolean;
}

export interface ExportConfig {
  format: VideoFormat;
  resolution: '720p' | '1080p' | '4k';
  showCursor: boolean;
  clickRipple: boolean;
  watermark: string;
}

export interface SceneConfig {
  template: TemplateName;
  theme: ThemeMode;
  device: DeviceFrame;
  preset: AnimationPreset;
  streamingStyle: StreamingStyle;
  sidebarVisible: boolean;
  accentColor: string;
  modelName: string;
}

export interface AppState {
  // Scene
  scene: SceneConfig;
  messages: ChatMessage[];
  timing: TimingConfig;
  exportConfig: ExportConfig;

  // Playback
  playbackState: PlaybackState;
  currentStep: number;
  visibleMessages: ChatMessage[];
  streamingText: string;
  isTyping: boolean;

  // UI
  activePanel: 'templates' | 'customize' | 'script' | 'timing' | 'export';
  showPreview: boolean;

  // Actions
  setScene: (scene: Partial<SceneConfig>) => void;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  removeMessage: (id: string) => void;
  setTiming: (timing: Partial<TimingConfig>) => void;
  setExportConfig: (config: Partial<ExportConfig>) => void;
  setActivePanel: (panel: AppState['activePanel']) => void;
  setPlaybackState: (state: PlaybackState) => void;
  setCurrentStep: (step: number) => void;
  setVisibleMessages: (messages: ChatMessage[]) => void;
  setStreamingText: (text: string) => void;
  setIsTyping: (typing: boolean) => void;
  resetPlayback: () => void;
  loadSampleConversation: (sample: 'demo1' | 'demo2' | 'demo3') => void;
}
