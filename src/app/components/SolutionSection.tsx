'use client';
import React, { useRef } from 'react';
import { Box, Container, Typography, Paper, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function SolutionSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const fadeRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (fadeRef.current) {
            gsap.fromTo(fadeRef.current,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 70%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }
    }, { scope: containerRef });

    return (
        <Box ref={containerRef} sx={{ py: 20, bgcolor: '#F9F9F9' }}>
            <Container maxWidth="lg">
                <Typography
                    variant="h2"
                    align="center"
                    gutterBottom
                    sx={{ mb: 16, fontWeight: 400, letterSpacing: '-0.03em' }}
                >
                    その不安、<br />SKILL60+が解決します。
                </Typography>

                <Grid container spacing={12} alignItems="center">
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box>
                            <Typography variant="h3" gutterBottom sx={{ mb: 4, lineHeight: 1.4 }}>
                                AIが導き出す、<br />
                                あなただけの市場価値
                            </Typography>
                            <Typography variant="body1" paragraph color="text.secondary" sx={{ fontSize: '1.1rem', lineHeight: 2.2 }}>
                                自分では当たり前だと思っていた経験も、他社から見れば「喉から手が出るほど欲しいスキル」かもしれません。<br /><br />
                                SKILL60+のAIは、膨大な求人データと照らし合わせ、あなたの市場価値を客観的な数字で算出します。
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper
                            ref={fadeRef}
                            sx={{
                                p: 6,
                                borderRadius: 4, // Slightly rounded for "Interlude" softness
                                bgcolor: '#FFFFFF',
                                boxShadow: '0 4px 40px rgba(0,0,0,0.03)', // Very subtle shadow
                                border: '1px solid rgba(0,0,0,0.02)'
                            }}
                        >
                            <Typography variant="caption" sx={{ display: 'block', mb: 3, letterSpacing: '0.1em', color: '#111', fontFamily: 'var(--font-ibm-plex-mono)' }}>
                                SUCCESS STORY
                            </Typography>
                            <Box sx={{ mb: 5 }}>
                                <Typography variant="h5" sx={{ mb: 1, fontWeight: 700 }}>
                                    Sさん (68歳・元経理部長)
                                </Typography>
                            </Box>

                            <Stack spacing={4}>
                                <Stack direction="row" alignItems="center" spacing={4}>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="caption" color="text.secondary" gutterBottom sx={{ fontFamily: 'var(--font-ibm-plex-mono)' }}>Before</Typography>
                                        <Typography variant="body1">求職活動に苦戦</Typography>
                                    </Box>
                                    <Typography variant="h4" sx={{ fontWeight: 300, color: '#E0E0E0' }}>→</Typography>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="caption" color="text.secondary" gutterBottom sx={{ fontFamily: 'var(--font-ibm-plex-mono)' }}>After</Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 700 }}>月収25万円</Typography>
                                        <Typography variant="caption" color="text.secondary">週3日・顧問契約</Typography>
                                    </Box>
                                </Stack>

                                <Box sx={{ pt: 4, borderTop: '1px solid #F0F0F0' }}>
                                    <Typography variant="body1" sx={{ fontStyle: 'italic', color: '#555' }}>
                                        「経理一筋40年の経験が、中小企業の顧問としてこれほど評価されるとは驚きでした。無理なく、誇りを持って働けています。」
                                    </Typography>
                                </Box>
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
