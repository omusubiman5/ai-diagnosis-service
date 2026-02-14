'use client';
import { Box, Typography } from '@mui/material';
import ScrollReveal from './ScrollReveal';

export default function TransitionSection() {
  return (
    <Box
      component="section"
      sx={{
        background: 'linear-gradient(180deg, #000000 0%, #1B4F72 50%, #FEF9E7 100%)',
        py: { xs: 10, md: 14 },
        px: 3,
        textAlign: 'center',
      }}
    >
      <ScrollReveal animation="fade-in" duration={1.2}>
        <Typography
          variant="h4"
          sx={{
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: { xs: '1.3rem', md: '1.8rem' },
            lineHeight: 1.8,
            textShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}
        >
          ここからは、あなたの
          <br />
          &ldquo;元気&rdquo;を応援するプログラム
        </Typography>
      </ScrollReveal>
    </Box>
  );
}
