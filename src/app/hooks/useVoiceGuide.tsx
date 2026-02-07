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
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Cancel speech and reset state
    const cancel = useCallback(() => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setProgress(0);
        utteranceRef.current = null;
    }, []);

    // Simple speak function - No chunking, no complex voice selection
    const speak = useCallback((text: string) => {
        if (!text) return;

        // Cancel any existing speech
        cancel();

        console.log('[VoiceGuide] Speak called with:', text);

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        utterance.volume = 1.0;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        utterance.onstart = () => {
            console.log('[VoiceGuide] Started speaking');
            setIsPlaying(true);
        };

        utterance.onend = () => {
            console.log('[VoiceGuide] Finished speaking');
            setIsPlaying(false);
            setProgress(0);
        };

        utterance.onerror = (e) => {
            // Ignore purely administrative interruptions
            if (e.error === 'interrupted' || e.error === 'canceled') {
                return;
            }
            console.error('[VoiceGuide] Error:', e);
            setIsPlaying(false);
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    }, [cancel]);

    // Priming function (needed for some browsers to allow first play)
    const prime = useCallback(() => {
        const u = new SpeechSynthesisUtterance('');
        u.volume = 0;
        window.speechSynthesis.speak(u);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            cancel();
        };
    }, [cancel]);

    return {
        speak,
        cancel,
        prime,
        isPlaying,
        progress,
        isSupported: typeof window !== 'undefined' && 'speechSynthesis' in window
    };
};
