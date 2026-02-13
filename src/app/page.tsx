'use client';
import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import HeroSection from './components/HeroSection';
import EmpathySection from './components/EmpathySection';
import SolutionSection from './components/SolutionSection';
import FeaturesSection from './components/FeaturesSection';
import StepsSection from './components/StepsSection';
import TrustSection from './components/TrustSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import VoiceControl from './components/VoiceControl';
import AIChatWidget from './components/AIChatWidget';

// 即時カスタム: フォントサイズ変更トリガー
const FONT_TRIGGERS: Record<string, { className: string; label: string }> = {
  '文字を大きくして': { className: 'font-large', label: '大きめ' },
  '大きくして': { className: 'font-large', label: '大きめ' },
  '文字大きく': { className: 'font-large', label: '大きめ' },
  'もっと大きく': { className: 'font-xlarge', label: '特大' },
  '特大にして': { className: 'font-xlarge', label: '特大' },
  '文字を小さくして': { className: '', label: '標準' },
  '小さくして': { className: '', label: '標準' },
  '元に戻して': { className: '', label: '標準' },
  '標準にして': { className: '', label: '標準' },
};

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleBeforeSend = useCallback((message: string): { handled: boolean; response?: string } => {
    // フォントサイズ変更
    for (const [trigger, config] of Object.entries(FONT_TRIGGERS)) {
      if (message.includes(trigger)) {
        document.body.classList.remove('font-large', 'font-xlarge');
        if (config.className) {
          document.body.classList.add(config.className);
        }
        return {
          handled: true,
          response: config.className
            ? `文字を${config.label}にしましたよ。見やすくなりましたか？もっと大きくしたい場合は「もっと大きく」、元に戻したい場合は「元に戻して」と言ってくださいね。`
            : `文字の大きさを標準に戻しました。また変えたいときはいつでも言ってくださいね。`,
        };
      }
    }
    return { handled: false };
  }, []);

  return (
    <Box component="main">
      <HeroSection />
      <EmpathySection />
      <SolutionSection />
      <FeaturesSection />
      <StepsSection />
      <TrustSection />
      <CTASection />
      <Footer />
      <VoiceControl
        onChatToggle={() => setIsChatOpen(true)}
        isChatOpen={isChatOpen}
      />
      <AIChatWidget
        open={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onBeforeSend={handleBeforeSend}
      />
    </Box>
  );
}
