'use client';
import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import ScrollReveal from './ScrollReveal';

const steps = [
    {
        step: 'STEP 1',
        title: '診断開始',
        description: 'スマホやPCから簡単にアクセス',
    },
    {
        step: 'STEP 2',
        title: 'AI分析',
        description: 'あなたの経験をAIが分析',
    },
    {
        step: 'STEP 3',
        title: '結果確認',
        description: '具体的な提案を受け取る',
    },
];

export default function StepsSection() {
    return (
        <Box
            component="section"
            sx={{
                py: { xs: 12, md: 20 },
                bgcolor: '#000',
                color: '#FFF',
            }}
        >
            <Container maxWidth="lg">
                <ScrollReveal animation="slideUp">
                    <Typography
                        variant="h2"
                        align="center"
                        sx={{
                            mb: 12,
                            fontWeight: 700,
                            letterSpacing: '-0.02em',
                            fontSize: 'var(--font-size-h2)',
                            fontFamily: 'var(--font-nanum-myeongjo)',
                        }}
                    >
                        3ステップで完了
                    </Typography>
                </ScrollReveal>

                <Grid container spacing={6}>
                    {steps.map((item, index) => (
                        <Grid size={{ xs: 12, md: 4 }} key={index}>
                            <ScrollReveal animation="slideUp" delay={index * 0.15}>
                                <Box sx={{ textAlign: 'center', p: 4 }}>
                                    <Typography
                                        sx={{
                                            fontFamily: 'var(--font-ibm-plex-mono)',
                                            fontSize: '0.875rem',
                                            color: '#00D632',
                                            fontWeight: 600,
                                            mb: 2,
                                            letterSpacing: '0.1em',
                                        }}
                                    >
                                        {item.step}
                                    </Typography>
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            fontFamily: 'var(--font-nanum-myeongjo)',
                                            fontWeight: 700,
                                            mb: 2,
                                        }}
                                    >
                                        {item.title}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: 'var(--font-size-body)',
                                            lineHeight: 1.8,
                                            color: '#999',
                                        }}
                                    >
                                        {item.description}
                                    </Typography>
                                </Box>
                            </ScrollReveal>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
