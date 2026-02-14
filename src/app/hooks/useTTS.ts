'use client';

import { useState, useCallback, useRef } from 'react';

interface UseTTSOptions {
  pitch?: number;
  rate?: number;
  silentMode?: boolean;
}

export const useTTS = (options: UseTTSOptions = {}) => {
  const { pitch = -3.0, rate = 0.85, silentMode = false } = options;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queueRef = useRef<Array<{ text: string; resolve: () => void }>>([]);
  const isPlayingRef = useRef(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const processQueue = useCallback(async () => {
    if (isPlayingRef.current || queueRef.current.length === 0) {
      if (queueRef.current.length === 0) {
        setIsSpeaking(false);
      }
      return;
    }

    isPlayingRef.current = true;
    setIsSpeaking(true);
    setError(null);

    const item = queueRef.current.shift()!;

    try {
      const controller = new AbortController();
      abortRef.current = controller;

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: item.text,
          pitch,
          speakingRate: rate,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`TTS API error: ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      currentAudioRef.current = audio;

      await new Promise<void>((resolveAudio, rejectAudio) => {
        audio.onended = () => {
          URL.revokeObjectURL(url);
          currentAudioRef.current = null;
          resolveAudio();
        };
        audio.onerror = () => {
          URL.revokeObjectURL(url);
          currentAudioRef.current = null;
          rejectAudio(new Error('Audio playback failed'));
        };
        audio.play().catch(rejectAudio);
      });
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Intentional abort, not an error
      } else {
        console.error('[useTTS] Error:', err);
        setError(
          err instanceof Error ? err.message : 'Audio playback failed'
        );
      }
    } finally {
      isPlayingRef.current = false;
      abortRef.current = null;
      item.resolve();
      // Process next item in queue
      processQueue();
    }
  }, [pitch, rate]);

  const speak = useCallback(
    (text: string): Promise<void> => {
      if (silentMode) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve) => {
        queueRef.current.push({ text, resolve });
        processQueue();
      });
    },
    [silentMode, processQueue]
  );

  const stop = useCallback(() => {
    // Abort in-flight fetch
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    // Stop current audio playback
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    // Clear queue
    queueRef.current.forEach((item) => item.resolve());
    queueRef.current = [];
    isPlayingRef.current = false;
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking, error };
};
