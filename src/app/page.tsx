'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box } from '@mui/material';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import EmpathySection from './components/EmpathySection';
import FeaturesSection from './components/FeaturesSection';
import SolutionSection from './components/SolutionSection';
import StepsSection from './components/StepsSection';
import TrustSection from './components/TrustSection';
import CTASection from './components/CTASection';
import TransitionSection from './components/TransitionSection';
import VoiceControl from './components/VoiceControl';
import AIChatWidget from './components/AIChatWidget';
import LpSectionsWrapper from './components/LpSectionsWrapper';

// LP sections (aliased to avoid name conflicts)
import LpHeroSection from './lp/components/HeroSection';
import LpMeetSection from './lp/components/MeetSection';
import LpStoriesSection from './lp/components/StoriesSection';
import LpTrustSection from './lp/components/TrustSection';
import LpActionSection from './lp/components/ActionSection';
import LpChatbot from './lp/components/LpChatbot';
import VoicevoxPlayer from './lp/components/VoicevoxPlayer';
import FontSizeControl from './lp/components/FontSizeControl';

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
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = mainRef.current?.querySelectorAll('[data-bg-color]');
    if (!sections || sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let maxRatio = 0;
        let activeColor = bgColor;
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            activeColor = (entry.target as HTMLElement).dataset.bgColor || '#FFFFFF';
          }
        });
        if (maxRatio > 0) {
          setBgColor(activeColor);
        }
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
        rootMargin: '-40% 0px -40% 0px',
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const isDark = bgColor === '#000000';

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
    <Box
      ref={mainRef}
      component="main"
      sx={{
        backgroundColor: bgColor,
        transition: 'background-color 0.6s ease-in-out',
        color: isDark ? '#FFF' : '#000',
      }}
    >
      <Header />

      {/* === Main Sections === */}
      <Box component="section" data-bg-color="#FFFFFF">
        <HeroSection />
      </Box>
      <Box component="section" data-bg-color="#00D632">
        <EmpathySection />
      </Box>
      <Box component="section" data-bg-color="#FFFFFF">
        <FeaturesSection />
      </Box>
      <Box component="section" data-bg-color="#FAFAFA">
        <SolutionSection />
      </Box>
      <Box component="section" data-bg-color="#FFFFFF">
        <StepsSection />
      </Box>
      <Box component="section" data-bg-color="#FAFAFA">
        <TrustSection />
      </Box>
      <Box component="section" data-bg-color="#000000">
        <CTASection />
      </Box>

      {/* === Transition: Main → LP === */}
      <TransitionSection />

      {/* === LP Sections (scoped) === */}
      <LpSectionsWrapper>
        <Box component="section" data-bg-color="#FEF9E7" id="lp-hero">
          <LpHeroSection />
        </Box>
        <Box component="section" data-bg-color="#F8F9FA">
          <LpMeetSection />
        </Box>
        <Box component="section" data-bg-color="#FDFEFE">
          <LpStoriesSection />
        </Box>
        <Box component="section" data-bg-color="#F8F9FA">
          <LpTrustSection />
        </Box>
        <Box component="section" data-bg-color="#FFF8E1">
          <LpActionSection />
        </Box>
      </LpSectionsWrapper>

      {/* === Floating UI === */}
      <FontSizeControl />
      <VoiceControl
        onChatToggle={() => setIsChatOpen(true)}
        isChatOpen={isChatOpen}
      />
      <AIChatWidget
        open={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onBeforeSend={handleBeforeSend}
      />
      <LpChatbot />
      <VoicevoxPlayer />
    </Box>
  );
}
