'use client';
import React, { useRef } from 'react';
import { Box, Container, Typography, Stack, Divider } from '@mui/material';
import Grid from '@mui/material/Grid';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function TrustSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Minimal animations if needed
    }, { scope: containerRef });

    return (
        <Box ref={containerRef} sx={{ py: 20, bgcolor: '#FFFFFF' }}>
            <Container maxWidth="lg">
                <Box sx={{ mb: 16, textAlign: 'center' }}>
                    <Typography
                        variant="h2"
                        gutterBottom
                        sx={{ fontWeight: 400, letterSpacing: '-0.02em', mb: 4 }}
                    >
                        なぜ、正確に診断できるのか？
                    </Typography>
                </Box>

                <Grid container spacing={12} alignItems="flex-start">
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ pr: { md: 8 } }}>
                            <Typography variant="h4" gutterBottom sx={{ fontFamily: 'var(--font-nanum-myeongjo)', mb: 6 }}>
                                2つのデータの融合
                            </Typography>

                            <Stack spacing={6}>
                                <Box>
                                    <Typography variant="h6" sx={{ fontFamily: 'var(--font-ibm-plex-mono)', mb: 2, color: '#888', letterSpacing: '0.05em' }}>
                                        DATA 01
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontFamily: 'var(--font-nanum-myeongjo)', mb: 2, fontWeight: 700 }}>
                                        求人市場データ
                                    </Typography>
                                    <Typography variant="body1" paragraph color="text.secondary" sx={{ lineHeight: 2.0 }}>
                                        数百万件以上のシニア向け求人データを解析し、リアルタイムな市場価値を算出します。
                                    </Typography>
                                </Box>
                                <Divider />
                                <Box>
                                    <Typography variant="h6" sx={{ fontFamily: 'var(--font-ibm-plex-mono)', mb: 2, color: '#888', letterSpacing: '0.05em' }}>
                                        DATA 02
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontFamily: 'var(--font-nanum-myeongjo)', mb: 2, fontWeight: 700 }}>
                                        キャリア理論
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 2.0 }}>
                                        長年の研究に基づくキャリア理論をAIに学習させ、表面的な経歴だけでなく、潜在的なスキルも抽出します。
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{
                            position: 'relative',
                            p: 8,
                            bgcolor: '#FAFAFA',
                        }}>
                            <Typography variant="caption" sx={{ display: 'block', mb: 4, letterSpacing: '0.1em', color: '#111', fontFamily: 'var(--font-ibm-plex-mono)' }}>
                                SUPERVISOR
                            </Typography>
                            <Typography variant="h5" sx={{ fontFamily: 'var(--font-nanum-myeongjo)', mb: 4, fontWeight: 700 }}>
                                シニアキャリア研究所 監修
                            </Typography>
                            <Box sx={{ position: 'relative' }}>
                                <Typography variant="h1" sx={{ position: 'absolute', top: -40, left: -20, fontFamily: 'serif', fontSize: '8rem', color: '#F0F0F0', zIndex: 0 }}>
                                    “
                                </Typography>
                                <Typography variant="body1" sx={{ fontFamily: 'var(--font-nanum-myeongjo)', lineHeight: 2.2, position: 'relative', zIndex: 1 }}>
                                    これまでの経験は、必ず誰かの役に立ちます。<br />
                                    AI診断を通じて、あなたの新しい可能性を見つけてください。
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
