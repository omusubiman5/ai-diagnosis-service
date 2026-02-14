'use client';
import { useState, useRef, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';

interface MemoryCard {
  id: number;
  era: string;
  icon: string;
  color: string;
  label: string;
  photo: string;
  voice: string;
}

const CARDS: MemoryCard[] = [
  { id: 1, era: '1958-1964', icon: '🎒', color: '#F8BBD0', label: '幼少期', photo: '/img/memory/card-1.webp', voice: '/audio/yoshiko-memory-1.mp3' },
  { id: 2, era: '1973-1976', icon: '📚', color: '#B3E5FC', label: '学生時代', photo: '/img/memory/card-2.webp', voice: '/audio/yoshiko-memory-2.mp3' },
  { id: 3, era: '1976-1981', icon: '💼', color: '#FFE0B2', label: '就職', photo: '/img/memory/card-3.webp', voice: '/audio/yoshiko-memory-3.mp3' },
  { id: 4, era: '1981-1986', icon: '👶', color: '#C8E6C9', label: '結婚・子育て', photo: '/img/memory/card-4.webp', voice: '/audio/yoshiko-memory-4.mp3' },
  { id: 5, era: '1991-1997', icon: '🏢', color: '#FFD54F', label: 'バブル崩壊', photo: '/img/memory/card-5.webp', voice: '/audio/yoshiko-memory-5.mp3' },
  { id: 6, era: '1995-2011', icon: '🕯️', color: '#CE93D8', label: '試練', photo: '/img/memory/card-6.webp', voice: '/audio/yoshiko-memory-6.mp3' },
  { id: 7, era: '2020-2023', icon: '🌅', color: '#F48FB1', label: '再出発', photo: '/img/memory/card-7.webp', voice: '/audio/yoshiko-memory-7.mp3' },
  { id: 8, era: '2025-', icon: '✨', color: '#E67E22', label: '今のヨシコ', photo: '/img/memory/card-8.webp', voice: '/audio/yoshiko-memory-8.mp3' },
];

// ★ 展開角度の計算（8枚）
const FAN_ANGLES = [-21, -15, -9, -3, 3, 9, 15, 21];
const FAN_Y_OFFSETS = [-10, -6, -2, -1, -1, -2, -6, -10]; // 弧を描くY位置

export default function MemoryCards({ onChatbotOpen }: { onChatbotOpen: () => void }) {
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const allFlipped = flipped.size === 8;

  // ★ スクロール連動展開
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / sectionHeight));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFlip = (id: number) => {
    setFlipped(prev => new Set(prev).add(id));
    try {
      const saved = sessionStorage.getItem('skill60-accessibility');
      const textOnly = saved ? JSON.parse(saved).textOnly : false;
      if (!textOnly) {
        const c = CARDS.find(c => c.id === id);
        if (c?.voice) new Audio(c.voice).play().catch(() => {});
      }
    } catch {}
    window.dataLayer?.push({ event: 'memory_card_flip', card_id: id, card_label: CARDS.find(c => c.id === id)?.label });
    // カードめくりアニメーション(0.6s)を見せてから1秒後にモーダル表示
    setTimeout(() => {
      setActiveCard(id);
    }, 1000);
  };

  useEffect(() => {
    if (allFlipped) {
      window.dataLayer?.push({ event: 'memory_cards_all_flipped' });
    }
  }, [allFlipped]);

  return (
    <Box component="section" ref={sectionRef} sx={{ height: '200vh', position: 'relative' }}>
      <Box sx={{
        position: 'sticky', top: 0, height: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          ヨシコの思い出
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
          カードをめくると、ヨシコの67年間が見えます
        </Typography>

        {/* カードファンコンテナ */}
        <Box sx={{
          position: 'relative',
          width: { xs: 280, md: 400 },
          height: { xs: 350, md: 480 },
          perspective: '1200px',
        }}>
          {CARDS.map((card, i) => {
            const targetAngle = FAN_ANGLES[i];
            const targetY = FAN_Y_OFFSETS[i];
            const currentAngle = targetAngle * scrollProgress;
            const currentY = targetY * scrollProgress;

            return (
              <Box key={card.id}
                onClick={() => handleFlip(card.id)}
                sx={{
                  position: 'absolute',
                  width: { xs: 160, md: 220 },
                  height: { xs: 224, md: 310 },
                  left: '50%',
                  bottom: 20,
                  marginLeft: { xs: '-80px', md: '-110px' },
                  cursor: 'pointer',
                  transformStyle: 'preserve-3d',
                  transformOrigin: 'bottom center',
                  transform: `rotateZ(${currentAngle}deg) translateY(${currentY}px)`,
                  transition: 'box-shadow 0.3s ease, opacity 0.4s ease',
                  zIndex: activeCard === card.id ? 20 : 8 - Math.abs(i - 3.5),
                  boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                  opacity: activeCard ? 0 : 1,
                  '&:hover': {
                    boxShadow: '0 12px 35px rgba(0,0,0,0.25)',
                    zIndex: '20 !important',
                  },
                }}>
                {/* 表面 */}
                <Box sx={{
                  position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                  background: `linear-gradient(135deg, ${card.color}, ${card.color}dd)`,
                  borderRadius: 3, p: 2,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  transform: flipped.has(card.id) ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                }}>
                  <Typography sx={{ fontSize: { xs: '2.5rem', md: '3rem' }, mb: 1 }}>
                    {card.icon}
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, fontSize: { xs: '0.7rem', md: '0.8rem' } }}>
                    {card.era}
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: { xs: '0.65rem', md: '0.75rem' }, mt: 0.5 }}>
                    {card.label}
                  </Typography>
                </Box>
                {/* 裏面 */}
                <Box sx={{
                  position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                  borderRadius: 3, overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  transform: flipped.has(card.id) ? 'rotateY(0deg)' : 'rotateY(-180deg)',
                  transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                }}>
                  <Box component="img" src={card.photo} alt={card.label}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* 全めくり完了時のCTA */}
        {allFlipped && (
          <Box sx={{ textAlign: 'center', mt: 4, animation: 'fadeInUp 0.8s ease-out' }}>
            <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2, color: 'text.secondary' }}>
              「ね、同じ時代を歩いてきたでしょう？」
            </Typography>
            <Button variant="contained" size="large" onClick={onChatbotOpen}
              sx={{ borderRadius: 8, px: 4, py: 1.5, fontSize: '1rem', bgcolor: '#E67E22', '&:hover': { bgcolor: '#D35400' } }}>
              ヨシコに自分の話もしてみる
            </Button>
          </Box>
        )}
      </Box>

      {/* 拡大モーダル */}
      {activeCard && flipped.has(activeCard) && (
        <Box onClick={() => setActiveCard(null)} sx={{
          position: 'fixed', inset: 0, zIndex: 1200,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <Box component="img"
            src={CARDS.find(c => c.id === activeCard)?.photo}
            alt={CARDS.find(c => c.id === activeCard)?.label}
            sx={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: 3,
                  boxShadow: '0 8px 40px rgba(0,0,0,0.4)' }} />
        </Box>
      )}
    </Box>
  );
}
