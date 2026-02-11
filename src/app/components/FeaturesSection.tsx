'use client';
import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import ScrollReveal from './ScrollReveal';

const features = [
    {
        id: '01',
        title: 'AI診断',
        description: '最新のAIがあなたの経験を分析',
    },
    {
        id: '02',
        title: '具体的提案',
        description: '推定年収や求人数を数字で提示',
    },
    {
        id: '03',
        title: '3分で完了',
        description: 'スマホから簡単に診断開始',
    },
];

export default function FeaturesSection() {
    return (
        <Box
            component="section"
            sx={{
                py: { xs: 12, md: 20 },
                bgcolor: '#FFF',
                color: '#000',
                transition: 'background-color 0.6s ease, color 0.6s ease',
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
                        SKILL60+が選ばれる理由
                    </Typography>
                </ScrollReveal>

                <Grid container spacing={6} justifyContent="center">
                    {features.map((feature, index) => (
                        <Grid size={{ xs: 12, md: 4 }} key={index}>
                            <ScrollReveal animation="slideUp" delay={index * 0.15}>
                                <Box
                                    sx={{
                                        textAlign: 'center',
                                        p: 4,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontFamily: 'var(--font-ibm-plex-mono)',
                                            fontSize: '3rem',
                                            color: '#E0E0E0',
                                            fontWeight: 300,
                                            lineHeight: 1,
                                            mb: 3,
                                        }}
                                    >
                                        {feature.id}
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontFamily: 'var(--font-nanum-myeongjo)',
                                            fontWeight: 700,
                                            mb: 2,
                                        }}
                                    >
                                        {feature.title}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: 'var(--font-size-body)',
                                            lineHeight: 1.8,
                                            color: '#666',
                                        }}
                                    >
                                        {feature.description}
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
