'use client';
import React, { useRef } from 'react';
import { Box, Container, Typography, Paper, Avatar } from '@mui/material';
import Grid from '@mui/material/Grid';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export default function TrustSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const leftColRef = useRef<HTMLDivElement>(null);
    const rightColRef = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();

    useGSAP(() => {
        if (prefersReducedMotion) return;

        gsap.from(leftColRef.current, {
            x: -50, opacity: 0, duration: 1, ease: 'power2.out',
            scrollTrigger: { trigger: containerRef.current, start: 'top 75%' }
        });
        gsap.from(rightColRef.current, {
            x: 50, opacity: 0, duration: 1, delay: 0.2, ease: 'power2.out',
            scrollTrigger: { trigger: containerRef.current, start: 'top 75%' }
        });
    }, { scope: containerRef });

    return (
        <Box ref={containerRef} sx={{ py: 12, bgcolor: '#FFFFFF' }}>
            <Container maxWidth="lg">
                <Typography variant="h2" align="center" color="primary" gutterBottom sx={{ mb: 8, fontWeight: 'bold' }}>
                    なぜ、正確に診断できるのか？
                </Typography>

                <Grid container spacing={6} alignItems="center">
                    <Grid size={{ xs: 12, md: 6 }}>
                        <div ref={leftColRef}>
                            <Paper sx={{ p: 4, borderRadius: 4, bgcolor: '#f0f4f9', borderLeft: '8px solid #205493' }}>
                                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                    2つのデータの融合
                                </Typography>
                                <Box sx={{ my: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        📈 膨大な求人市場データ
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        数百万件以上のシニア向け求人データをリアルタイムで解析。
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
                                        🧠 キャリア理論
                                    </Typography>
                                    <Typography variant="body1">
                                        長年の研究に基づくキャリア理論をAIに学習させ、潜在的なスキルを抽出。
                                    </Typography>
                                </Box>
                            </Paper>
                        </div>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <div ref={rightColRef}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                <Avatar sx={{ width: 120, height: 120, mb: 2, bgcolor: 'text.secondary', fontSize: '3rem' }}>
                                    監
                                </Avatar>
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                    シニアキャリア研究所
                                </Typography>
                                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                    監修
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 2, maxWidth: 400 }}>
                                    「これまでの経験は、必ず誰かの役に立ちます。
                                    AI診断を通じて、あなたの新しい可能性を見つけてください。」
                                </Typography>
                            </Box>
                        </div>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
