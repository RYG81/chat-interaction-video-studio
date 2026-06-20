import { create } from 'zustand';
import type { AppState, ChatMessage } from './types';

const generateId = () => Math.random().toString(36).substring(2, 9);

const defaultMessages: ChatMessage[] = [
  {
    id: generateId(),
    role: 'user',
    content: 'Can you explain how neural networks learn?',
    delayBefore: 800,
  },
  {
    id: generateId(),
    role: 'assistant',
    content: `Neural networks learn through a process called **backpropagation** combined with **gradient descent**. Here's how it works:

1. **Forward Pass** — Input data flows through the network, layer by layer, producing an output prediction.

2. **Loss Calculation** — The prediction is compared to the expected output using a loss function (e.g., cross-entropy, MSE).

3. **Backward Pass** — The gradient of the loss is computed with respect to each weight using the chain rule of calculus.

4. **Weight Update** — Each weight is adjusted in the direction that reduces the loss:
   \`w_new = w_old - learning_rate × gradient\`

5. **Iteration** — Steps 1–4 are repeated across many batches of data (epochs) until the model converges.

The key insight is that by making many small adjustments based on errors, the network gradually finds weight configurations that produce accurate predictions.`,
    stream: true,
    duration: 6000,
  },
  {
    id: generateId(),
    role: 'user',
    content: 'What is the learning rate and how do you choose it?',
    delayBefore: 1200,
  },
  {
    id: generateId(),
    role: 'assistant',
    content: `The **learning rate** is a hyperparameter that controls how much the weights are adjusted during each update step. It's one of the most important settings in training.

**Too high** → The model overshoots the optimal weights, causing unstable training or divergence.

**Too low** → Training is extremely slow and may get stuck in local minima.

**Common strategies for choosing it:**

| Method | Description |
|--------|-------------|
| Grid search | Try values like 0.1, 0.01, 0.001 |
| Learning rate finder | Gradually increase LR and plot loss |
| Schedulers | Start high and decay over time |
| Adam optimizer | Adapts LR per parameter automatically |

A typical starting point is \`0.001\` with the Adam optimizer, which works well for most tasks.`,
    stream: true,
    duration: 5000,
  },
];

const sampleConversations: Record<string, ChatMessage[]> = {
  demo1: defaultMessages,
  demo2: [
    {
      id: generateId(),
      role: 'user',
      content: 'Summarize this article about climate change in 3 bullet points.',
      delayBefore: 600,
    },
    {
      id: generateId(),
      role: 'assistant',
      content: `Here are the 3 key points from the article:

• **Global temperatures** have risen by 1.1°C since pre-industrial times, with the last decade being the warmest on record.

• **Extreme weather events** — including heatwaves, floods, and droughts — are becoming more frequent and severe due to climate change.

• **Urgent action** is needed: the article calls for a 45% reduction in greenhouse gas emissions by 2030 to limit warming to 1.5°C.`,
      stream: true,
      duration: 4000,
    },
    {
      id: generateId(),
      role: 'user',
      content: 'Make it even shorter — one sentence each.',
      delayBefore: 1000,
    },
    {
      id: generateId(),
      role: 'assistant',
      content: `• Temperatures are up 1.1°C and rising fast.
• Extreme weather is getting worse everywhere.
• We must cut emissions 45% by 2030.`,
      stream: true,
      duration: 2500,
    },
  ],
  demo3: [
    {
      id: generateId(),
      role: 'user',
      content: 'Write a Python function to find all prime numbers up to n.',
      delayBefore: 500,
    },
    {
      id: generateId(),
      role: 'assistant',
      content: `Here's an efficient implementation using the **Sieve of Eratosthenes**:

\`\`\`python
def sieve_of_eratosthenes(n: int) -> list[int]:
    """Find all prime numbers up to n."""
    if n < 2:
        return []
    
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    
    for i in range(2, int(n**0.5) + 1):
        if is_prime[i]:
            for j in range(i*i, n + 1, i):
                is_prime[j] = False
    
    return [i for i in range(2, n + 1) if is_prime[i]]

# Example usage
primes = sieve_of_eratosthenes(50)
print(primes)
# [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]
\`\`\`

**Time complexity:** O(n log log n)
**Space complexity:** O(n)

This is one of the fastest algorithms for finding all primes in a range.`,
      stream: true,
      duration: 7000,
    },
    {
      id: generateId(),
      role: 'user',
      content: 'Can you add type hints and docstring?',
      delayBefore: 900,
    },
    {
      id: generateId(),
      role: 'assistant',
      content: `Already done! The function includes:

- ✅ Type hint: \`n: int\` parameter and \`list[int]\` return type
- ✅ Docstring: \`"""Find all prime numbers up to n."""\`

If you want a more detailed docstring:

\`\`\`python
def sieve_of_eratosthenes(n: int) -> list[int]:
    """
    Find all prime numbers up to n using the
    Sieve of Eratosthenes algorithm.
    
    Args:
        n: Upper bound (inclusive) for prime search.
        
    Returns:
        A sorted list of all prime numbers <= n.
        
    Raises:
        TypeError: If n is not an integer.
        
    Example:
        >>> sieve_of_eratosthenes(10)
        [2, 3, 5, 7]
    """
\`\`\``,
      stream: true,
      duration: 4500,
    },
  ],
};

export const useStore = create<AppState>((set) => ({
  // Scene
  scene: {
    template: 'chatgpt',
    theme: 'dark',
    device: 'desktop',
    preset: 'realistic',
    streamingStyle: 'token',
    sidebarVisible: true,
    accentColor: '#6366f1',
    modelName: 'GPT-4o',
  },
  messages: defaultMessages,
  timing: {
    totalDuration: 30,
    typingSpeed: 40,
    streamSpeed: 20,
    delayBeforeAssistant: 600,
    delayAfterAssistant: 400,
    scrollSpeed: 300,
    finalPauseDuration: 2000,
    autoFitDuration: false,
  },
  exportConfig: {
    format: '16:9',
    resolution: '1080p',
    showCursor: true,
    clickRipple: false,
    watermark: '',
  },

  // Playback
  playbackState: 'idle',
  currentStep: -1,
  visibleMessages: [],
  streamingText: '',
  isTyping: false,

  // UI
  activePanel: 'templates',
  showPreview: true,

  // Actions
  setScene: (scene) =>
    set((state) => ({ scene: { ...state.scene, ...scene } })),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  updateMessage: (id, updates) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    })),
  removeMessage: (id) =>
    set((state) => ({
      messages: state.messages.filter((m) => m.id !== id),
    })),
  setTiming: (timing) =>
    set((state) => ({ timing: { ...state.timing, ...timing } })),
  setExportConfig: (config) =>
    set((state) => ({ exportConfig: { ...state.exportConfig, ...config } })),
  setActivePanel: (activePanel) => set({ activePanel }),
  setPlaybackState: (playbackState) => set({ playbackState }),
  setCurrentStep: (currentStep) => set({ currentStep }),
  setVisibleMessages: (visibleMessages) => set({ visibleMessages }),
  setStreamingText: (streamingText) => set({ streamingText }),
  setIsTyping: (isTyping) => set({ isTyping }),
  resetPlayback: () =>
    set({
      playbackState: 'idle',
      currentStep: -1,
      visibleMessages: [],
      streamingText: '',
      isTyping: false,
    }),
  loadSampleConversation: (sample) =>
    set({
      messages: sampleConversations[sample] || defaultMessages,
      playbackState: 'idle',
      currentStep: -1,
      visibleMessages: [],
      streamingText: '',
      isTyping: false,
    }),
}));
