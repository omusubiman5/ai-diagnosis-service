'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

// Web Speech API type declarations (not yet in all TS libs)
interface IWindow extends Window {
  SpeechRecognition?: new () => ISpeechRecognition;
  webkitSpeechRecognition?: new () => ISpeechRecognition;
}

interface ISpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onresult: ((event: ISpeechRecognitionEvent) => void) | null;
  onerror: ((event: ISpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

interface ISpeechRecognitionEvent {
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [index: number]: { transcript: string };
    };
  };
}

interface ISpeechRecognitionErrorEvent {
  error: string;
}

export const useSpeechToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported] = useState(() => {
    if (typeof window !== 'undefined') {
      const w = window as unknown as IWindow;
      const SpeechRecognitionAPI = w.SpeechRecognition || w.webkitSpeechRecognition;
      return !!SpeechRecognitionAPI;
    }
    return false;
  });

  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error('[SpeechToText] Stop error:', e);
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterimTranscript('');
  }, []);

  const startListening = useCallback(() => {
    setError(null);
    setTranscript('');
    setInterimTranscript('');

    const w = window as unknown as IWindow;
    const SpeechRecognitionAPI = w.SpeechRecognition || w.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setError('お使いのブラウザは音声認識に対応していません。Google Chromeなどの対応ブラウザをご利用ください。');
      return;
    }

    // Ensure previous recognition is stopped
    if (recognitionRef.current) {
      stopListening();
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = 'ja-JP';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      console.log('[SpeechToText] Recognition started');
    };

    recognition.onresult = (event: ISpeechRecognitionEvent) => {
      let accumulatedFinal = '';
      let currentInterim = '';

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          accumulatedFinal = result[0].transcript;
        } else {
          currentInterim = result[0].transcript;
        }
      }

      if (accumulatedFinal) setTranscript(accumulatedFinal);
      setInterimTranscript(currentInterim);
    };

    recognition.onerror = (event: ISpeechRecognitionErrorEvent) => {
      console.error('[SpeechToText] Error:', event.error);
      setIsListening(false);

      switch (event.error) {
        case 'not-allowed':
          setError('マイクの使用が許可されていません。アドレスバーの「鍵マーク」から設定を確認してください。');
          break;
        case 'no-speech':
          setError('声が聞き取れませんでした。もう少し近づいて話してみてください。');
          break;
        case 'network':
          setError('ネットワークエラーにより音声認識が中断されました。');
          break;
        default:
          setError(`音声認識エラー (${event.error}): もう一度お試しください。`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
      console.log('[SpeechToText] Recognition ended');
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (e) {
      console.error('[SpeechToText] Failed to start:', e);
      setError('マイクの準備中にエラーが発生しました。ページを更新してもう一度お試しください。');
      setIsListening(false);
    }
  }, [stopListening]);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return {
    startListening,
    stopListening,
    clearTranscript,
    transcript,
    interimTranscript,
    isListening,
    isSupported,
    error,
  };
};
