'use client';
import React, { useState, useEffect, useRef } from 'react';
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
import LpSectionsWrapper from './components/LpSectionsWrapper';
import InfiniteLoopScroll from './components/InfiniteLoopScroll';

// LP sections (aliased to avoid name conflicts)
import LpHeroSection from './lp/components/HeroSection';
import LpMeetSection from './lp/components/MeetSection';
import LpStoriesSection from './lp/components/StoriesSection';
import LpTrustSection from './lp/components/TrustSection';
import LpActionSection from './lp/components/ActionSection';
import LpChatbot from './lp/components/LpChatbot';
import VoicevoxPlayer from './lp/components/VoicevoxPlayer';
import FontSizeControl from './lp/components/FontSizeControl';
import VoiceDiagOverlay from './lp/components/VoiceDiagOverlay';
import VoiceControl from './lp/components/VoiceControl';

export default function Home() {
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [isDiagOpen, setIsDiagOpen] = useState(false);
  const [silentMode, setSilentMode] = useState(false);
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

  // Listen for start-diag custom event
  useEffect(() => {
    const handler = () => setIsDiagOpen(true);
    window.addEventListener('start-diag', handler);
    return () => window.removeEventListener('start-diag', handler);
  }, []);

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

      <InfiniteLoopScroll>
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

        {/* === Transition: Main -> LP === */}
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
      </InfiniteLoopScroll>

      {/* === Floating UI === */}
      <FontSizeControl />
      <VoiceControl />
      <LpChatbot />
      <VoicevoxPlayer />
      <VoiceDiagOverlay
        isOpen={isDiagOpen}
        onClose={() => setIsDiagOpen(false)}
        silentMode={silentMode}
        onSilentModeToggle={() => setSilentMode(!silentMode)}
      />
    </Box>
  );
}
