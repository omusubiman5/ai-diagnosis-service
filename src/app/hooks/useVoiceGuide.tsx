'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * useVoiceGuide Hook
 *
 * Text-to-Speech voice guide using Web Speech API with chunk-based playback.
 * Features:
 * - ESC key to cancel playback
 * - 150-character chunk splitting for stable playback
 * - Progress tracking (0-100%)
 * - Optimized speech rate (0.85x)
 */
export const useVoiceGuide = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const chunksRef = useRef<string[]>([]);
    const currentChunkIndexRef = useRef(0);

    /**
     * Split text into ~150 character chunks at sentence boundaries
     */
    const splitIntoChunks = (text: string): string[] => {
        const CHUNK_SIZE = 150;
        const chunks: string[] = [];

        // Split by sentence boundaries
        const sentences = text.split(/([。！？\n])/);
        let currentChunk = '';

        for (let i = 0; i < sentences.length; i++) {
            const part = sentences[i];
            if (currentChunk.length + part.length <= CHUNK_SIZE) {
                currentChunk += part;
            } else {
                if (currentChunk) {
                    chunks.push(currentChunk.trim());
                }
                currentChunk = part;
            }
        }

        if (currentChunk) {
            chunks.push(currentChunk.trim());
        }

        return chunks.filter(chunk => chunk.length > 0);
    };

    /**
     * Play next chunk in sequence
     */
    const playNextChunk = useCallback(() => {
        if (currentChunkIndexRef.current >= chunksRef.current.length) {
            // All chunks completed
            setIsPlaying(false);
            setProgress(100);
            currentChunkIndexRef.current = 0;
            chunksRef.current = [];
            console.log('[VoiceGuide] Playback completed');
            return;
        }

        const chunk = chunksRef.current[currentChunkIndexRef.current];
        const utterance = new SpeechSynthesisUtterance(chunk);

        utterance.lang = 'ja-JP';
        utterance.volume = 1;
        utterance.rate = 0.85;
        utterance.pitch = 1;

        utterance.onend = () => {
            currentChunkIndexRef.current++;
            const newProgress = Math.round((currentChunkIndexRef.current / chunksRef.current.length) * 100);
            setProgress(newProgress);
            playNextChunk();
        };

        utterance.onerror = (e) => {
            console.error('[VoiceGuide] Error:', e);
            cancel();
        };

        currentUtteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    }, []);

    /**
     * Start speaking text with chunk-based playback
     */
    const speak = useCallback((text: string) => {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        console.log('[VoiceGuide] Starting playback');

        // Split text into chunks
        chunksRef.current = splitIntoChunks(text);
        currentChunkIndexRef.current = 0;

        setIsPlaying(true);
        setProgress(0);

        // Start playing first chunk
        playNextChunk();
    }, [playNextChunk]);

    /**
     * Cancel current playback and reset state
     */
    const cancel = useCallback(() => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setProgress(0);
        currentChunkIndexRef.current = 0;
        chunksRef.current = [];
        currentUtteranceRef.current = null;
        console.log('[VoiceGuide] Playback cancelled');
    }, []);

    /**
     * Setup ESC key handler and cleanup
     */
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isPlaying) {
                cancel();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            cancel();
        };
    }, [isPlaying, cancel]);

    return {
        speak,
        cancel,
        isPlaying,
        progress
    };
};
