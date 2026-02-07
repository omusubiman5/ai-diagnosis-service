'use client';
import React, { useRef } from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export default function SolutionSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const afterBoxRef = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();

    useGSAP(() => {
        if (prefersReducedMotion) return;

        if (afterBoxRef.current) {
            gsap.fromTo(afterBoxRef.current,
                { opacity: 0, scale: 0.8, x: 50 },
                {
                    opacity: 1,
                    scale: 1,
                    x: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top center',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }
    }, { scope: containerRef });

    return (
        <Box ref={containerRef} sx={{ py: 12, bgcolor: 'background.default' }}>
            <Container maxWidth="lg">
                <Typography
                    variant="h2"
                    align="center"
                    color="primary"
                    gutterBottom
                    sx={{ mb: 8, fontWeight: 'bold' }}
                >
                    その不安、<br />SKILL60+が解決します。
                </Typography>

                <Grid container spacing={6} alignItems="center">
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box>
                            <Typography variant="h3" gutterBottom sx={{ color: 'secondary.main', fontWeight: 'bold' }}>
                                AIが客観的に分析
                            </Typography>
                            <Typography variant="h4" paragraph sx={{ fontWeight: 'bold', mb: 4 }}>
                                あなたの「埋もれた価値」を<br />発見します。
                            </Typography>
                            <Typography variant="body1" paragraph color="text.secondary" sx={{ fontSize: '1.25rem' }}>
                                自分では当たり前だと思っていた経験も、<br />
                                他社から見れば「喉から手が出るほど欲しいスキル」かもしれません。<br /><br />
                                SKILL60+のAIは、膨大な求人データと照らし合わせ、
                                あなたの市場価値を客観的な数字で算出します。
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ p: 4, borderRadius: 4, bgcolor: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
                            <Box sx={{
                                position: 'absolute', top: 0, right: 0, bgcolor: 'secondary.main',
                                color: '#fff', px: 3, py: 1, borderBottomLeftRadius: 16, fontWeight: 'bold'
                            }}>
                                成功事例
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    Sさん (68歳・元経理部長)
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                                    <Box sx={{ flex: 1, p: 2, bgcolor: '#f0f0f0', borderRadius: 2, textAlign: 'center' }}>
                                        <Typography variant="body2" color="text.secondary">Before</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>求職活動に苦戦</Typography>
                                    </Box>
                                    <Typography variant="h4" color="secondary">→</Typography>
                                    <Box ref={afterBoxRef} sx={{ flex: 1, p: 2, bgcolor: 'secondary.light', color: '#fff', borderRadius: 2, textAlign: 'center', boxShadow: '0 4px 12px rgba(50, 205, 50, 0.2)' }}>
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>After</Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>月収25万円</Typography>
                                    </Box>
                                </Box>
                                <Typography variant="body1">
                                    「経理一筋40年の経験が、中小企業の顧問としてこれほど評価されるとは驚きでした。週3日の勤務で、無理なく働けています。」
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
