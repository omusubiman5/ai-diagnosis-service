'use client';

import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import ScrollReveal from './ScrollReveal';

const steps = [
    {
        step: '01',
        title: '質問に答える',
        description: 'スマホから5つの簡単な質問に回答。職歴やスキルをAIが読み取ります。',
    },
    {
        step: '02',
        title: 'AIが分析',
        description: '膨大な求人データと照合し、あなたの経験の市場価値を数値化します。',
    },
    {
        step: '03',
        title: '結果を受け取る',
        description: '推定年収・マッチ求人数・おすすめの働き方を具体的にお届けします。',
    },
];

export default function StepsSection() {
    return (
        <Box
            component="section"
            sx={{
                py: { xs: 12, md: 20 },
                color: '#000',
            }}
        >
            <Container maxWidth="lg">
                <ScrollReveal animation="slide-up">
                    <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 12 } }}>
                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: 800,
                                letterSpacing: '-0.03em',
                                lineHeight: 1.15,
                                mb: 3,
                                fontFamily: 'var(--font-nanum-myeongjo)',
                                fontSize: 'var(--font-size-h2)',
                            }}
                        >
                            3分で完了、簡単3ステップ
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: 'var(--font-size-body)',
                                color: '#666',
                                maxWidth: '500px',
                                mx: 'auto',
                                lineHeight: 1.7,
                            }}
                        >
                            面倒な登録は不要。スマホひとつで、あなたの市場価値がわかります。
                        </Typography>
                    </Box>
                </ScrollReveal>

                <Grid container spacing={{ xs: 4, md: 6 }}>
                    {steps.map((item, index) => (
                        <Grid size={{ xs: 12, md: 4 }} key={index}>
                            <ScrollReveal animation="slide-up" delay={index * 0.12}>
                                <Box
                                    sx={{
                                        p: { xs: 4, md: 5 },
                                        borderRadius: 4,
                                        bgcolor: '#FAFAFA',
                                        border: '1px solid rgba(0,0,0,0.04)',
                                        height: '100%',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            bgcolor: '#F5F5F5',
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                                        },
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontFamily: 'var(--font-ibm-plex-mono)',
                                            fontSize: '2.5rem',
                                            color: '#00D632',
                                            fontWeight: 600,
                                            lineHeight: 1,
                                            mb: 3,
                                        }}
                                    >
                                        {item.step}
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontFamily: 'var(--font-nanum-myeongjo)',
                                            fontWeight: 700,
                                            mb: 2,
                                            fontSize: '1.25rem',
                                        }}
                                    >
                                        {item.title}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '0.95rem',
                                            lineHeight: 1.8,
                                            color: '#666',
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
