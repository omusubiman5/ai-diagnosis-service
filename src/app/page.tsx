'use client';
import React from 'react';
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

export default function Home() {
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
      <VoiceControl />
    </Box>
  );
}
