'use client';
import { Box, Typography, Button } from '@mui/material';
import { keyframes } from '@mui/system';

const bubbleIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export default function HeroSection() {
  return (
    <Box
      component="section"
      id="hero"
      sx={{
        background: 'linear-gradient(165deg, #FEF9E7 0%, #FDEBD0 30%, #FAD7A0 60%, #F8C471 100%)',
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: 3,
        py: 8,
        '@media (prefers-color-scheme: dark)': {
          background: 'linear-gradient(165deg, #1A1A2E 0%, #16213E 30%, #0F3460 60%, #1B4F72 100%)',
        },
      }}
    >
      <Box sx={{ maxWidth: 720 }}>
        {/* ★ この4行が空白の原因。必ず存在すること ★ */}
        <Typography
          variant="h3"
          component="h1"
          className="speakable"
          sx={{
            fontWeight: 700,
            mb: 2,
            opacity: 0,
            animation: `${bubbleIn} 0.8s ease-out 0.3s forwards`,
            '@media (prefers-reduced-motion: reduce)': {
              opacity: '1 !important',
              animation: 'none !important',
            },
          }}
        >
          60年間、頑張ってきたあなたへ。
        </Typography>

        <Typography
          variant="h6"
          className="speakable"
          sx={{
            color: 'text.secondary',
            mb: 2,
            opacity: 0,
            animation: `${bubbleIn} 0.6s ease-out 1.2s forwards`,
            '@media (prefers-reduced-motion: reduce)': {
              opacity: '1 !important',
              animation: 'none !important',
            },
          }}
        >
          定年後、こんなモヤモヤを抱えていませんか？
        </Typography>

        <Typography
          variant="h5"
          className="speakable hero-split hero-hover-text"
          sx={{
            fontStyle: 'italic',
            fontWeight: 600,
            color: '#8B4513',
            mb: 2,
            opacity: 0,
            animation: `${bubbleIn} 0.8s ease-out 2.2s forwards`,
            '@media (prefers-reduced-motion: reduce)': {
              opacity: '1 !important',
              animation: 'none !important',
            },
          }}
        >
          &ldquo;自分の経験なんて、もう誰にも必要とされない&rdquo;
        </Typography>

        <Typography
          variant="h5"
          className="speakable"
          sx={{
            fontWeight: 700,
            mb: 6,
            opacity: 0,
            animation: `${bubbleIn} 0.6s ease-out 3.5s forwards`,
            '@media (prefers-reduced-motion: reduce)': {
              opacity: '1 !important',
              animation: 'none !important',
            },
          }}
        >
          ——そんなことはありません。
        </Typography>

        {/* CTAボタン（これは既に表示されている） */}
        <Button
          variant="contained"
          size="large"
          href="https://line.me/R/ti/p/@skill60plus"
          aria-label="3分であなたのすごいところがわかります - LINEが開きます"
          sx={{
            bgcolor: '#E67E22',
            borderRadius: 8,
            px: 5,
            py: 2,
            fontSize: '1.1rem',
            fontWeight: 700,
            textTransform: 'none',
            '&:hover': { bgcolor: '#D35400' },
            animation: `${bubbleIn} 0.6s ease-out 4.0s forwards`,
            opacity: 0,
            '@media (prefers-reduced-motion: reduce)': {
              opacity: '1 !important',
              animation: 'none !important',
            },
          }}
        >
          3分で、あなたの&ldquo;すごいところ&rdquo;がわかります
        </Button>

        <Typography
          variant="body2"
          sx={{
            mt: 2,
            color: 'text.secondary',
            opacity: 0,
            animation: `${bubbleIn} 0.4s ease-out 4.3s forwards`,
            '@media (prefers-reduced-motion: reduce)': {
              opacity: '1 !important',
              animation: 'none !important',
            },
          }}
        >
          LINEでかんたん・3分で完了・ずっと無料
        </Typography>
      </Box>
    </Box>
  );
}
