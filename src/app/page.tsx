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
import Footer from './components/Footer';
import VoiceControl from './components/VoiceControl';
import AIChatWidget from './components/AIChatWidget';

const SECTION_COLORS = [
  '#FFFFFF', // Hero
  '#00D632', // Empathy
  '#FFFFFF', // Features
  '#FAFAFA', // Solution
  '#FFFFFF', // Steps
  '#FAFAFA', // Trust
  '#000000', // CTA
  '#000000', // Footer
];

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = mainRef.current?.querySelectorAll('[data-bg-color]');
    if (!sections || sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the most visible section
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

  // Determine text color based on background
  const isDark = bgColor === '#000000';

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
      <Box component="section" data-bg-color="#000000">
        <Footer />
      </Box>
      <VoiceControl
        onChatToggle={() => setIsChatOpen(true)}
        isChatOpen={isChatOpen}
      />
      <AIChatWidget
        open={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </Box>
  );
}
