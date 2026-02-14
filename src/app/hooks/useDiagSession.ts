'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useSpeechToText } from './useSpeechToText';
import { useTTS } from './useTTS';
import { useMaTimer, type MaPhase } from './useMaTimer';

// --- Types ---

export type DiagState =
  | 'idle'
  | 'bot_speaking'
  | 'listening'
  | 'confirming'
  | 'ma_waiting'
  | 'complete';

export interface DiagQuestion {
  id: string;
  text: string;
  tapChoices: string[];
}

export interface DiagAnswer {
  questionId: string;
  answer: string;
  method: 'voice' | 'tap';
}

// --- Constants ---

const DIAG_QUESTIONS: DiagQuestion[] = [
  {
    id: 'q1_experience',
    text: 'これまで一番長くやってきたことは何ですか？\nお仕事でも、趣味でも、家のことでも。',
    tapChoices: ['事務・経理', '販売・接客', '製造・工場', '料理・家事', 'その他'],
  },
  {
    id: 'q2_enjoyment',
    text: 'その中で、一番楽しかったことは何ですか？',
    tapChoices: ['人と話すこと', 'ものを作ること', '計算や整理', '教えること', 'その他'],
  },
  {
    id: 'q3_pride',
    text: '「これだけは誰にも負けない」ということ、ありますか？',
    tapChoices: ['丁寧さ', '根気強さ', 'やさしさ', '知識', '特にない'],
  },
  {
    id: 'q4_interest',
    text: 'もし時間とお金の心配がなかったら、何をしたいですか？',
    tapChoices: ['旅行', '趣味を深める', '人の役に立つこと', 'のんびり過ごす', 'わからない'],
  },
  {
    id: 'q5_concern',
    text: '今、一番気になっていることは何ですか？',
    tapChoices: ['健康のこと', 'お金のこと', '生きがい', '家族のこと', '特にない'],
  },
];

// --- Hook ---

interface UseDiagSessionOptions {
  silentMode?: boolean;
  ttsPitch?: number;
  ttsRate?: number;
}

export const useDiagSession = (options: UseDiagSessionOptions = {}) => {
  const { silentMode = false, ttsPitch = -3.0, ttsRate = 0.85 } = options;

  const [state, setState] = useState<DiagState>('idle');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<DiagAnswer[]>([]);
  const [botText, setBotText] = useState('');
  const [showTapChoices, setShowTapChoices] = useState(false);
  const [maPromptText, setMaPromptText] = useState('');
  const [diagSummary, setDiagSummary] = useState('');

  const stateRef = useRef(state);
  stateRef.current = state;
  const transcriptRef = useRef('');

  // Sub-hooks
  const stt = useSpeechToText();
  // DIAG-002: TTS stays active even in silent mode ("音声ガイドは聞くだけ")
  const tts = useTTS({ pitch: ttsPitch, rate: ttsRate });
  const maTimer = useMaTimer({
    onPhaseChange: (phase: MaPhase) => {
      if (stateRef.current !== 'listening') return;
      // Skip if user already has a transcript (spoke but STT still active)
      if (transcriptRef.current) return;

      // DIAG-005: Speak prompts aloud, pausing STT to avoid echo pickup
      const speakAndResume = async (text: string) => {
        stt.stopListening();
        await tts.speak(text);
        if (stateRef.current === 'listening') {
          stt.startListening();
        }
      };

      switch (phase) {
        case 'gentle':
          setMaPromptText('ゆっくりでいいですよ');
          speakAndResume('ゆっくりでいいですよ');
          break;
        case 'encourage':
          setMaPromptText('急がなくて大丈夫。声でも、ボタンでも。');
          speakAndResume('急がなくて大丈夫。声でも、ボタンでも。');
          break;
        case 'tap_choices':
          setShowTapChoices(true);
          setMaPromptText('下のボタンからも選べますよ');
          speakAndResume('下のボタンからも選べますよ');
          break;
      }
    },
  });

  // Current question
  const currentQuestion =
    questionIndex < DIAG_QUESTIONS.length ? DIAG_QUESTIONS[questionIndex] : null;
  const totalQuestions = DIAG_QUESTIONS.length;

  // --- Actions ---

  const advanceToNextQuestion = useCallback(async () => {
    const nextIndex = questionIndex + 1;
    if (nextIndex >= DIAG_QUESTIONS.length) {
      // All questions answered - generate summary
      setState('complete');
      maTimer.stop();
      stt.stopListening();
      return;
    }

    setQuestionIndex(nextIndex);
    setShowTapChoices(false);
    setMaPromptText('');

    // DIAG-010: Announce "あともう1問！" before last question
    if (nextIndex === DIAG_QUESTIONS.length - 1) {
      setBotText('あともう1問！');
      setState('bot_speaking');
      await tts.speak('あともう1問！');
    }

    const nextQ = DIAG_QUESTIONS[nextIndex];
    setBotText(nextQ.text);
    setState('bot_speaking');

    await tts.speak(nextQ.text);

    // After TTS finishes, start listening
    if (!silentMode && stt.isSupported) {
      setState('listening');
      stt.clearTranscript();
      stt.startListening();
      maTimer.start();
    } else {
      // Silent mode: show tap choices immediately
      setState('listening');
      setShowTapChoices(true);
    }
  }, [questionIndex, tts, stt, maTimer, silentMode]);

  const startSession = useCallback(async () => {
    setQuestionIndex(0);
    setAnswers([]);
    setShowTapChoices(false);
    setMaPromptText('');
    setDiagSummary('');

    const firstQ = DIAG_QUESTIONS[0];
    setBotText(firstQ.text);
    setState('bot_speaking');

    await tts.speak(firstQ.text);

    // After TTS, start listening
    if (!silentMode && stt.isSupported) {
      setState('listening');
      stt.clearTranscript();
      stt.startListening();
      maTimer.start();
    } else {
      setState('listening');
      setShowTapChoices(true);
    }
  }, [tts, stt, maTimer, silentMode]);

  const confirmAnswer = useCallback(() => {
    if (!currentQuestion) return;
    const answerText = stt.transcript;
    if (!answerText) return;

    stt.stopListening();
    maTimer.stop();
    setShowTapChoices(false);
    setMaPromptText('');

    setAnswers((prev) => [
      ...prev,
      { questionId: currentQuestion.id, answer: answerText, method: 'voice' },
    ]);

    advanceToNextQuestion();
  }, [currentQuestion, stt, maTimer, advanceToNextQuestion]);

  const retryAnswer = useCallback(() => {
    stt.clearTranscript();
    setShowTapChoices(false);
    setMaPromptText('');
    setState('listening');
    stt.startListening();
    maTimer.start();
  }, [stt, maTimer]);

  const selectTapChoice = useCallback(
    (choice: string) => {
      if (!currentQuestion) return;

      stt.stopListening();
      maTimer.stop();
      setShowTapChoices(false);
      setMaPromptText('');

      setAnswers((prev) => [
        ...prev,
        { questionId: currentQuestion.id, answer: choice, method: 'tap' },
      ]);

      advanceToNextQuestion();
    },
    [currentQuestion, stt, maTimer, advanceToNextQuestion]
  );

  const endSession = useCallback(() => {
    stt.stopListening();
    tts.stop();
    maTimer.stop();
    setState('idle');
    setQuestionIndex(0);
    setAnswers([]);
    setBotText('');
    setShowTapChoices(false);
    setMaPromptText('');
    setDiagSummary('');
  }, [stt, tts, maTimer]);

  // --- STT transcript change detection ---
  // When user speaks (interim transcript changes), reset the ma timer
  useEffect(() => {
    if (state === 'listening' && stt.interimTranscript) {
      maTimer.reset();
      setMaPromptText('');
      setShowTapChoices(false);
    }
  }, [stt.interimTranscript, state, maTimer]);

  // When user finishes speaking (final transcript arrives), go to confirming
  useEffect(() => {
    if (state === 'listening' && stt.transcript && !stt.isListening) {
      setState('confirming');
      maTimer.stop();
    }
  }, [stt.transcript, stt.isListening, state, maTimer]);

  // Keep transcript ref in sync for ma timer callback
  useEffect(() => {
    transcriptRef.current = stt.transcript;
  }, [stt.transcript]);

  // DIAG-009: Speak confirmation prompt aloud
  useEffect(() => {
    if (state === 'confirming' && stt.transcript) {
      tts.speak(`${stt.transcript}ですね。合っていますか？`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // --- Generate summary when complete ---
  useEffect(() => {
    if (state !== 'complete' || answers.length === 0) return;

    let cancelled = false;

    const generateSummary = async () => {
      // Show loading text immediately
      setDiagSummary('ヨシコが分析中...');

      try {
        const apiAnswers = answers.map((a) => {
          const q = DIAG_QUESTIONS.find((q) => q.id === a.questionId);
          return {
            questionId: a.questionId,
            question: q?.text?.split('\n')[0] || '',
            answer: a.answer,
          };
        });

        const res = await fetch('/api/diag-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers: apiAnswers }),
        });

        if (!cancelled) {
          if (res.ok) {
            const data = await res.json();
            setDiagSummary(data.summary);
          } else {
            // Fallback summary
            const lines = answers.map((a) => {
              const q = DIAG_QUESTIONS.find((q) => q.id === a.questionId);
              return `${q?.text?.split('\n')[0] || ''} → 「${a.answer}」`;
            });
            setDiagSummary(
              'おつかれさまでした！\n\n' + lines.join('\n') + '\n\nあなたの経験は宝物よ。'
            );
          }
          tts.speak('おつかれさまでした！あなたの強みが見えてきましたよ。');
        }
      } catch {
        if (!cancelled) {
          setDiagSummary('おつかれさまでした！あなたの経験は宝物よ。');
          tts.speak('おつかれさまでした！');
        }
      }
    };

    generateSummary();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, answers.length]);

  return {
    // State
    state,
    currentQuestion,
    questionIndex,
    totalQuestions,
    botText,
    showTapChoices,
    maPromptText,
    diagSummary,
    answers,

    // STT state (passthrough)
    userTranscript: stt.transcript,
    interimTranscript: stt.interimTranscript,
    isListening: stt.isListening,
    isSttSupported: stt.isSupported,
    sttError: stt.error,

    // TTS state (passthrough)
    isSpeaking: tts.isSpeaking,
    ttsError: tts.error,

    // Actions
    startSession,
    confirmAnswer,
    retryAnswer,
    selectTapChoice,
    endSession,
  };
};
