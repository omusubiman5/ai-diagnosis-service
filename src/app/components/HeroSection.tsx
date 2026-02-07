'use client';

import React, { useRef, useState } from 'react';
import { Box, Container, Typography, Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Grid from '@mui/material/Grid';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useVoiceGuide } from '../hooks/useVoiceGuide';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const headlineRef = useRef<HTMLHeadingElement>(null);
    const subheadlineRef = useRef<HTMLHeadingElement>(null);
    const ctaRef = useRef<HTMLButtonElement>(null);
    const counterRef = useRef<HTMLSpanElement>(null);
    const { speak } = useVoiceGuide();
    const [dialogOpen, setDialogOpen] = useState(false);

    useGSAP(() => {
        const tl = gsap.timeline();

        // Background Gradient Initial Fade (single execution)
        tl.fromTo(containerRef.current,
            { background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' },
            { background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)', duration: 2, ease: 'sine.inOut' }
        );

        // Text & CTA Entry
        tl.from(headlineRef.current, { y: 50, opacity: 0, duration: 1, ease: 'power3.out' }, 0.5)
            .from(subheadlineRef.current, { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
            .from(ctaRef.current, { scale: 0, opacity: 0, duration: 0.5, ease: 'back.out(1.7)' }, '-=0.4');

        // Counter Animation (fires immediately after delay, no ScrollTrigger)
        if (counterRef.current) {
            tl.to(counterRef.current, {
                innerText: 250000,
                duration: 2,
                delay: 1.5,
                snap: { innerText: 1000 },
                onUpdate: function () {
                    if (counterRef.current) {
                        counterRef.current.innerText = Math.ceil(this.targets()[0].innerText).toLocaleString();
                    }
                }
            }, '-=0.2');
        }
    }, { scope: containerRef });

    const handleCTAClick = () => {
        speak('hero_cta_click');
        alert('Coming Soon! 先行登録を受け付けています。');
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    return (
        <Box ref={containerRef} sx={{
            minHeight: '90vh',
            display: 'flex',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            overflow: 'hidden',
            position: 'relative'
        }}>
            <Container maxWidth="lg">
                <Grid container spacing={4} alignItems="center">
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Typography
                            ref={headlineRef}
                            variant="h1"
                            component="h1"
                            sx={{
                                fontWeight: 800,
                                mb: 2,
                                color: 'primary.main',
                                lineHeight: 1.2,
                                textShadow: '0 4px 10px rgba(0,0,0,0.1)'
                            }}
                        >
                            60年の経験は、<br />
                            まだ社会の宝だ。
                        </Typography>
                        <Typography
                            ref={subheadlineRef}
                            variant="h5"
                            color="text.secondary"
                            sx={{ mb: 6, fontWeight: 500, lineHeight: 1.8 }}
                        >
                            <Box component="span" sx={{ display: 'block', mb: 1 }}>
                                あなたのキャリアをAIが再発掘。
                            </Box>
                            推定市場価値 <Box component="span" ref={counterRef} sx={{ fontSize: '2em', fontWeight: 'bold', color: 'secondary.main' }}>0</Box> 円〜
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <Button
                                ref={ctaRef}
                                variant="contained"
                                color="secondary"
                                size="large"
                                onClick={handleCTAClick}
                                sx={{
                                    py: 2,
                                    px: 6,
                                    fontSize: '1.2rem',
                                    borderRadius: 50,
                                    boxShadow: '0 8px 25px rgba(50, 205, 50, 0.4)',
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                    },
                                }}
                            >
                                無料で価値を診断する
                            </Button>
                        </Stack>
                    </Grid>
                    {/* Right Column: Trust Indicators & Success Metrics */}
                    <Grid size={{ xs: 12, md: 5 }} sx={{ display: { xs: 'none', md: 'block' } }}>
                        <Box sx={{
                            p: 4,
                            borderRadius: 4,
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: 'primary.main' }}>
                                信頼の実績
                            </Typography>
                            <Stack spacing={3}>
                                <Box>
                                    <Typography variant="h3" sx={{ fontWeight: 800, color: 'secondary.main', mb: 1 }}>
                                        10,000+
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        診断済みユーザー数
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="h3" sx={{ fontWeight: 800, color: 'secondary.main', mb: 1 }}>
                                        94%
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        診断結果満足度
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="h3" sx={{ fontWeight: 800, color: 'secondary.main', mb: 1 }}>
                                        平均 38万円
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        推定市場価値（60代）
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* Coming Soon Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={handleDialogClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 700, color: 'primary.main' }}>
                    Coming Soon!
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        先行登録を受け付けています。
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        サービス開始時にお知らせいたします。
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} variant="contained" color="primary">
                        閉じる
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
