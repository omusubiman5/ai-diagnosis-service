'use client';
import React, { useRef, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import { Noto_Sans_JP } from 'next/font/google';
import { useGsapAnimations } from '../lp/hooks/useGsapAnimations';
import '../lp/globals.css';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    speakSection?: (sectionId: string) => void;
    playYoshikoWelcome?: () => void;
  }
}

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const lpTheme = createTheme({
  palette: {
    primary: { main: '#1B4F72' },
    secondary: { main: '#2E86C1' },
  },
  typography: {
    fontFamily: `'Noto Sans JP', ${notoSansJP.style.fontFamily}, system-ui, -apple-system, sans-serif`,
  },
});

export default function LpSectionsWrapper({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  useGsapAnimations(containerRef);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // GA4 dataLayer初期化
    window.dataLayer = window.dataLayer || [];

    // セクション閲覧トラッキング
    const gaObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.target.id) {
            window.dataLayer?.push({
              event: 'section_view',
              section_id: e.target.id,
            });
            gaObserver.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    container.querySelectorAll('section[id]').forEach((s) => gaObserver.observe(s));

    // CTAクリックトラッキング
    const ctaButtons = container.querySelectorAll('.cta-button');
    const handleCtaClick = (btn: Element) => () => {
      const section = btn.closest('section');
      window.dataLayer?.push({
        event: 'cta_click',
        cta_section: section?.id || 'unknown',
        cta_text: btn.textContent?.trim(),
      });
    };

    const cleanups: Array<() => void> = [];
    ctaButtons.forEach((btn) => {
      const handler = handleCtaClick(btn);
      btn.addEventListener('click', handler);
      cleanups.push(() => btn.removeEventListener('click', handler));
    });

    return () => {
      gaObserver.disconnect();
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <ThemeProvider theme={lpTheme}>
      <div ref={containerRef} className={`lp-scope ${notoSansJP.className}`}>
        {children}
      </div>
    </ThemeProvider>
  );
}
