import { useCallback, useRef } from 'react';
import { useStore } from '../store';

export function usePlayback() {
  const {
    messages,
    timing,
    playbackState,
    setPlaybackState,
    setVisibleMessages,
    setStreamingText,
    setIsTyping,
    setCurrentStep,
    resetPlayback,
  } = useStore();

  const animationRef = useRef<{ cancel: boolean }>({ cancel: false });

  const sleep = (ms: number) =>
    new Promise<void>((resolve) => {
      const timeout = setTimeout(resolve, ms);
      const checkCancel = setInterval(() => {
        if (animationRef.current.cancel) {
          clearTimeout(timeout);
          clearInterval(checkCancel);
          resolve();
        }
      }, 50);
    });

  const streamText = useCallback(
    async (text: string, durationMs: number) => {
      // Token-based streaming
      const words = text.split('');
      const chunkSize = Math.max(1, Math.floor(words.length / (durationMs / timing.streamSpeed)));
      let current = '';

      for (let i = 0; i < words.length; i += chunkSize) {
        if (animationRef.current.cancel) return;
        current = words.slice(0, i + chunkSize).join('');
        setStreamingText(current);
        await sleep(timing.streamSpeed);
      }

      setStreamingText(text);
    },
    [timing.streamSpeed, setStreamingText]
  );

  const typeText = useCallback(
    async (text: string) => {
      setIsTyping(true);
      for (let i = 0; i <= text.length; i++) {
        if (animationRef.current.cancel) {
          setIsTyping(false);
          return;
        }
        setStreamingText(text.substring(0, i));
        await sleep(timing.typingSpeed);
      }
      setIsTyping(false);
    },
    [timing.typingSpeed, setStreamingText, setIsTyping]
  );

  const play = useCallback(async () => {
    animationRef.current.cancel = false;
    setPlaybackState('playing');
    setVisibleMessages([]);
    setStreamingText('');
    setCurrentStep(-1);

    const allVisible: typeof messages = [];

    for (let i = 0; i < messages.length; i++) {
      if (animationRef.current.cancel) break;

      const msg = messages[i];
      setCurrentStep(i);

      // Delay before message
      const delayBefore = msg.delayBefore || 500;
      await sleep(delayBefore);

      if (animationRef.current.cancel) break;

      if (msg.role === 'user') {
        // Type user message
        await typeText(msg.content);
        if (animationRef.current.cancel) break;

        // Brief pause, then "submit"
        await sleep(200);
        setStreamingText('');

        // Add user message
        allVisible.push(msg);
        setVisibleMessages([...allVisible]);

        // Delay before assistant
        await sleep(timing.delayBeforeAssistant);
      } else {
        // Assistant message — stream it
        if (msg.stream !== false) {
          const duration = msg.duration || 3000;
          setStreamingText('');
          
          // Show loading indicator briefly
          setIsTyping(true);
          await sleep(400);
          if (animationRef.current.cancel) { setIsTyping(false); break; }
          setIsTyping(false);

          // Stream the text
          await streamText(msg.content, duration);
          if (animationRef.current.cancel) break;

          // Finalize — add as full message
          setStreamingText('');
          allVisible.push(msg);
          setVisibleMessages([...allVisible]);

          // Delay after assistant
          await sleep(timing.delayAfterAssistant);
        } else {
          allVisible.push(msg);
          setVisibleMessages([...allVisible]);
          await sleep(timing.delayAfterAssistant);
        }
      }
    }

    if (!animationRef.current.cancel) {
      // Final pause
      await sleep(timing.finalPauseDuration);
      setPlaybackState('finished');
    }
  }, [
    messages,
    timing,
    setPlaybackState,
    setVisibleMessages,
    setStreamingText,
    setCurrentStep,
    setIsTyping,
    typeText,
    streamText,
  ]);

  const stop = useCallback(() => {
    animationRef.current.cancel = true;
    resetPlayback();
  }, [resetPlayback]);

  const showFinalState = useCallback(() => {
    setVisibleMessages([...messages]);
    setStreamingText('');
    setIsTyping(false);
    setPlaybackState('finished');
    setCurrentStep(messages.length - 1);
  }, [messages, setVisibleMessages, setStreamingText, setIsTyping, setPlaybackState, setCurrentStep]);

  return { play, stop, showFinalState, playbackState };
}
