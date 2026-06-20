import { useState, useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { useStore } from '../store';

type ExportState = 'idle' | 'loading-ffmpeg' | 'recording' | 'converting' | 'done' | 'error';

export function useVideoExport() {
  const { exportConfig } = useStore();
  const [exportState, setExportState] = useState<ExportState>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isRecordingRef = useRef(false);

  const loadFFmpeg = useCallback(async () => {
    if (ffmpegRef.current?.loaded) return ffmpegRef.current;
    
    setExportState('loading-ffmpeg');
    setProgress(0);
    
    const ffmpeg = new FFmpeg();
    ffmpegRef.current = ffmpeg;

    ffmpeg.on('progress', ({ progress }) => {
      setProgress(Math.round(progress * 100));
    });

    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
    
    try {
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      return ffmpeg;
    } catch (err) {
      console.error('Failed to load FFmpeg:', err);
      throw new Error('Failed to load FFmpeg. Please refresh and try again.');
    }
  }, []);



  const startRecording = useCallback(async (
    previewElement: HTMLElement,
    onAnimationStart: () => void,
    onAnimationComplete: () => Promise<void>
  ) => {
    try {
      setErrorMessage('');
      isRecordingRef.current = true;
      recordedChunksRef.current = [];

      // Create a canvas to render frames
      const rect = previewElement.getBoundingClientRect();
      const scale = exportConfig.resolution === '4k' ? 2 : exportConfig.resolution === '1080p' ? 1.5 : 1;
      const width = Math.round(rect.width * scale);
      const height = Math.round(rect.height * scale);

      canvasRef.current = document.createElement('canvas');
      canvasRef.current.width = width;
      canvasRef.current.height = height;

      // Set up MediaRecorder
      const stream = canvasRef.current.captureStream(30);
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';
      
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      // Start recording
      setExportState('recording');
      setProgress(0);
      mediaRecorderRef.current.start(100); // Capture every 100ms

      // Start frame capture loop
      const captureFrame = async () => {
        if (!isRecordingRef.current || !canvasRef.current) return;
        
        try {
          const frameCanvas = await html2canvas(previewElement, {
            backgroundColor: null,
            scale,
            useCORS: true,
            logging: false,
          });
          
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(frameCanvas, 0, 0, width, height);
          }
        } catch (err) {
          console.error('Frame capture error:', err);
        }

        if (isRecordingRef.current) {
          animationFrameRef.current = requestAnimationFrame(captureFrame);
        }
      };

      // Start animation and capture
      onAnimationStart();
      captureFrame();

      // Wait for animation to complete
      await onAnimationComplete();

      // Stop recording
      await stopRecording();

    } catch (err) {
      console.error('Recording error:', err);
      setExportState('error');
      setErrorMessage(err instanceof Error ? err.message : 'Recording failed');
      isRecordingRef.current = false;
    }
  }, [exportConfig.resolution]);

  const stopRecording = useCallback(async () => {
    isRecordingRef.current = false;
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    return new Promise<void>((resolve) => {
      if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
        resolve();
        return;
      }

      mediaRecorderRef.current.onstop = async () => {
        try {
          // Create WebM blob
          const webmBlob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
          
          // Convert to MP4 using FFmpeg
          setExportState('converting');
          setProgress(0);

          const ffmpeg = await loadFFmpeg();

          // Write WebM to virtual filesystem
          await ffmpeg.writeFile('input.webm', await fetchFile(webmBlob));

          // Convert to MP4
          await ffmpeg.exec([
            '-i', 'input.webm',
            '-c:v', 'libx264',
            '-preset', 'fast',
            '-crf', '22',
            '-pix_fmt', 'yuv420p',
            'output.mp4'
          ]);

          // Read the output
          const data = await ffmpeg.readFile('output.mp4');
          // @ts-expect-error ffmpeg wasm returns Uint8Array which works with Blob
          const mp4Blob = new Blob([data], { type: 'video/mp4' });

          // Download
          const url = URL.createObjectURL(mp4Blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `chatvid-export-${Date.now()}.mp4`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          setExportState('done');
          setProgress(100);

          // Reset after a delay
          setTimeout(() => {
            setExportState('idle');
            setProgress(0);
          }, 3000);

          resolve();
        } catch (err) {
          console.error('Conversion error:', err);
          setExportState('error');
          setErrorMessage(err instanceof Error ? err.message : 'Conversion failed');
          resolve();
        }
      };

      mediaRecorderRef.current.stop();
    });
  }, [loadFFmpeg]);

  const exportWebM = useCallback(async (
    previewElement: HTMLElement,
    onAnimationStart: () => void,
    durationMs: number
  ) => {
    try {
      setErrorMessage('');
      isRecordingRef.current = true;
      recordedChunksRef.current = [];

      const rect = previewElement.getBoundingClientRect();
      const scale = exportConfig.resolution === '4k' ? 2 : exportConfig.resolution === '1080p' ? 1.5 : 1;
      const width = Math.round(rect.width * scale);
      const height = Math.round(rect.height * scale);

      canvasRef.current = document.createElement('canvas');
      canvasRef.current.width = width;
      canvasRef.current.height = height;

      const stream = canvasRef.current.captureStream(30);
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';
      
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chatvid-export-${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setExportState('done');
        setTimeout(() => {
          setExportState('idle');
          setProgress(0);
        }, 3000);
      };

      setExportState('recording');
      setProgress(0);
      mediaRecorderRef.current.start(100);

      const captureFrame = async () => {
        if (!isRecordingRef.current || !canvasRef.current) return;
        
        try {
          const frameCanvas = await html2canvas(previewElement, {
            backgroundColor: null,
            scale,
            useCORS: true,
            logging: false,
          });
          
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(frameCanvas, 0, 0, width, height);
          }
        } catch (err) {
          console.error('Frame capture error:', err);
        }

        if (isRecordingRef.current) {
          animationFrameRef.current = requestAnimationFrame(captureFrame);
        }
      };

      onAnimationStart();
      captureFrame();

      // Progress updates
      const startTime = Date.now();
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        setProgress(Math.min(Math.round((elapsed / durationMs) * 100), 99));
      }, 100);

      // Stop after duration
      setTimeout(() => {
        clearInterval(progressInterval);
        isRecordingRef.current = false;
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
      }, durationMs + 500);

    } catch (err) {
      console.error('Export error:', err);
      setExportState('error');
      setErrorMessage(err instanceof Error ? err.message : 'Export failed');
    }
  }, [exportConfig.resolution]);

  const cancelExport = useCallback(() => {
    isRecordingRef.current = false;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setExportState('idle');
    setProgress(0);
  }, []);

  return {
    exportState,
    progress,
    errorMessage,
    startRecording,
    stopRecording,
    exportWebM,
    cancelExport,
    loadFFmpeg,
  };
}
