'use client';
import { useState, useRef, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

interface ServiceCard {
  id: number;
  icon: string;
  color: string;
  label: string;
  photo: string;
}

const CARDS: ServiceCard[] = [
  { id: 1, icon: '🤝', color: '#FF8A80', label: 'AIの友人', photo: '/img/service/service-1.webp' },
  { id: 2, icon: '✨', color: '#FFD740', label: '全部スキル', photo: '/img/service/service-2.webp' },
  { id: 3, icon: '💎', color: '#B388FF', label: 'あなた専用', photo: '/img/service/service-3.webp' },
  { id: 4, icon: '⚡', color: '#69F0AE', label: 'あなたのペース', photo: '/img/service/service-4.webp' },
  { id: 5, icon: '🔄', color: '#82B1FF', label: '3つのモード', photo: '/img/service/service-5.webp' },
  { id: 6, icon: '🛡️', color: '#FFCC80', label: '生活まるごと', photo: '/img/service/service-6.webp' },
  { id: 7, icon: '🌳', color: '#A5D6A7', label: 'みんなが得する', photo: '/img/service/service-7.webp' },
];

export default function ServiceCards() {
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initGsap = async () => {
      try {
        const gsap = (await import('gsap')).default;
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);
        if (!containerRef.current) return;
        const cards = containerRef.current.querySelectorAll('.service-card');
        gsap.set(cards, { opacity: 0, scale: 0.3, x: 0, y: 0 });
        const TOTAL = 7, OFFSET = -90;
        const RADIUS = window.innerWidth < 640 ? 120 : 180;
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top 70%',
          onEnter: () => {
            gsap.to(cards, {
              opacity: 1, scale: 1,
              x: (i: number) => Math.cos((OFFSET + (i / TOTAL) * 360) * Math.PI / 180) * RADIUS,
              y: (i: number) => Math.sin((OFFSET + (i / TOTAL) * 360) * Math.PI / 180) * RADIUS,
              rotation: 0, stagger: 0.12, duration: 1.0, ease: 'back.out(1.2)',
            });
          },
        });
      } catch {
        containerRef.current?.querySelectorAll('.service-card')
          .forEach(el => ((el as HTMLElement).style.opacity = '1'));
      }
    };
    initGsap();
  }, []);

  const handleFlip = (id: number) => {
    setFlipped(prev => new Set(prev).add(id));
    window.dataLayer?.push({ event: 'service_card_flip', card_id: id, card_label: CARDS.find(c => c.id === id)?.label });
    // カードめくりアニメーション(0.6s)を見せてから1秒後にモーダル表示
    setTimeout(() => {
      setActiveCard(id);
    }, 1000);
  };

  return (
    <Box ref={containerRef} sx={{ position: 'relative', minHeight: { xs: 400, md: 600 }, my: 6 }}>
      <Typography variant="h6" sx={{ textAlign: 'center', mb: 1, fontWeight: 700 }}>SKILL60+ でできること</Typography>
      <Typography variant="body2" sx={{ textAlign: 'center', mb: 4, color: 'text.secondary' }}>カードをめくると、7つの特長が見えます</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', height: { xs: 400, md: 600 }, perspective: '1200px' }}>
        {CARDS.map((card) => (
          <Box key={card.id} className="service-card"
            sx={{ position: 'absolute', width: { xs: 100, md: 160 }, height: { xs: 140, md: 224 }, zIndex: activeCard === card.id ? 10 : 1,
              opacity: activeCard ? 0 : 1, transition: 'opacity 0.4s ease' }}>
            {/* めくりアニメーション用の内側Box */}
            <Box onClick={() => handleFlip(card.id)}
              sx={{ width: '100%', height: '100%', cursor: 'pointer', transformStyle: 'preserve-3d',
                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)', transform: flipped.has(card.id) ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
              <Box sx={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', background: `linear-gradient(135deg, ${card.color}, ${card.color}dd)`, borderRadius: 2.5, p: 2,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: 3 }}>
                <Typography sx={{ fontSize: '2.5rem', mb: 1 }}>{card.icon}</Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.8rem' }}>{card.label}</Typography>
              </Box>
              <Box sx={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderRadius: 2.5, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', overflow: 'hidden' }}>
                <Box component="img" src={card.photo} alt={card.label} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
      {activeCard && flipped.has(activeCard) && (
        <Box onClick={() => setActiveCard(null)} sx={{ position: 'fixed', inset: 0, zIndex: 1200, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Box component="img" src={CARDS.find(c => c.id === activeCard)?.photo} alt={CARDS.find(c => c.id === activeCard)?.label}
            sx={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: 3, boxShadow: '0 8px 40px rgba(0,0,0,0.4)' }} />
        </Box>
      )}
    </Box>
  );
}
