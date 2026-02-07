'use client';
import React, { useState } from 'react';
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

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);

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
      />
    </Box>
  );
}
