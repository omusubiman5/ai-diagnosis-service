'use client';
import { useEffect } from 'react';

export default function VoicevoxPlayer() {
  useEffect(() => {
    // ═══ セクション読み上げ: VOICEVOX事前生成音声 ═══
    const sectionAudioMap: Record<string, string> = {
      hero: '/audio/yoshiko-section1.mp3',
      encounter: '/audio/yoshiko-section2.mp3',
      stories: '/audio/yoshiko-section3.mp3',
      assurance: '/audio/yoshiko-section4.mp3',
      action: '/audio/yoshiko-section5.mp3',
    };

    let currentAudio: HTMLAudioElement | null = null;

    window.speakSection = function (sectionId: string) {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
      }

      const src = sectionAudioMap[sectionId];
      if (!src) return;

      currentAudio = new Audio(src);
      currentAudio.play().catch((err) => {
        console.warn('[VoicevoxPlayer] 音声再生失敗:', err);
      });
    };

    // ═══ ヨシコのウェルカム音声（事前録音1本のみ）═══
    window.playYoshikoWelcome = function () {
      const audio = new Audio('/audio/yoshiko-welcome.mp3');
      audio.play().catch((err) => {
        console.warn('[VoicevoxPlayer] ウェルカム音声再生失敗:', err);
      });
    };

    return () => {
      // クリーンアップ
      if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
      }
    };
  }, []);

  // このコンポーネントはUIを持たない（音声再生のみ）
  return null;
}
