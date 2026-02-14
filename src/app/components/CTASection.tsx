'use client';

import React from 'react';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import ScrollReveal from './ScrollReveal';

const stats = [
    { value: '10,000+', label: '診断実績' },
    { value: '95%', label: '満足度' },
    { value: '3分', label: '診断時間' },
];

export default function CTASection() {
    return (
        <Box
            component="section"
            id="cta"
            sx={{
                color: '#FFF',
                overflow: 'hidden',
            }}
        >
            {/* 現行: Stats grid */}
            <Container maxWidth="lg" sx={{ py: { xs: 10, md: 14 } }}>
                <ScrollReveal animation="slide-up">
                    <Typography
                        sx={{
                            fontFamily: 'var(--font-nanum-myeongjo)',
                            fontSize: 'var(--font-size-h2)',
                            fontWeight: 800,
                            letterSpacing: '-0.03em',
                            lineHeight: 1.15,
                            mb: { xs: 6, md: 8 },
                        }}
                    >
                        SKILL60+で、
                        <br />
                        経験を価値に変える
                    </Typography>
                </ScrollReveal>

                <Grid container spacing={0}>
                    {stats.map((stat, index) => (
                        <Grid size={{ xs: 6, md: 3 }} key={index}>
                            <ScrollReveal animation="slide-up" delay={index * 0.1}>
                                <Box
                                    sx={{
                                        py: { xs: 4, md: 5 },
                                        pr: 4,
                                        borderTop: '1px solid rgba(255,255,255,0.15)',
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontFamily: 'var(--font-nanum-myeongjo)',
                                            fontSize: { xs: '2rem', md: '2.5rem' },
                                            fontWeight: 800,
                                            letterSpacing: '-0.02em',
                                            lineHeight: 1,
                                            mb: 1,
                                            color: '#00D632',
                                        }}
                                    >
                                        {stat.value}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '0.9rem',
                                            color: 'rgba(255,255,255,0.6)',
                                        }}
                                    >
                                        {stat.label}
                                    </Typography>
                                </Box>
                            </ScrollReveal>
                        </Grid>
                    ))}

                    <Grid size={{ xs: 12, md: 3 }}>
                        <ScrollReveal animation="slide-up" delay={0.3}>
                            <Box
                                component="a"
                                href="#"
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    py: { xs: 4, md: 5 },
                                    borderTop: '1px solid rgba(255,255,255,0.15)',
                                    cursor: 'pointer',
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    transition: 'all 0.3s ease',
                                    '&:hover .cta-arrow': {
                                        transform: 'translateX(4px)',
                                    },
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontFamily: 'var(--font-nanum-myeongjo)',
                                        fontSize: { xs: '1.25rem', md: '1.5rem' },
                                        fontWeight: 700,
                                        mb: 0.5,
                                    }}
                                >
                                    今すぐ始める
                                </Typography>
                                <Typography
                                    className="cta-arrow"
                                    sx={{
                                        fontSize: '1.5rem',
                                        color: '#00D632',
                                        transition: 'transform 0.3s ease',
                                    }}
                                >
                                    &rarr;
                                </Typography>
                            </Box>
                        </ScrollReveal>
                    </Grid>
                </Grid>
            </Container>

            {/* design1要素: 緑CTA帯 */}
            <Box
                sx={{
                    bgcolor: '#00D632',
                    color: '#000',
                    py: { xs: 8, md: 12 },
                    textAlign: 'center',
                }}
            >
                <Container maxWidth="md">
                    <ScrollReveal animation="slide-up">
                        <Typography
                            sx={{
                                fontFamily: 'var(--font-nanum-myeongjo)',
                                fontSize: { xs: '1.5rem', md: 'var(--font-size-h2)' },
                                fontWeight: 700,
                                letterSpacing: '-0.02em',
                                lineHeight: 1.3,
                                mb: 2,
                            }}
                        >
                            今すぐ始めよう
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: 'var(--font-size-body)',
                                lineHeight: 1.8,
                                mb: 5,
                            }}
                        >
                            あなたの60年の経験を、次の価値へ。
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            href="#"
                            sx={{
                                bgcolor: '#000',
                                color: '#00D632',
                                fontSize: '1.2rem',
                                px: 8,
                                py: 2.5,
                                borderRadius: '50px',
                                textTransform: 'none',
                                fontWeight: 700,
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    bgcolor: '#111',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 30px rgba(0, 0, 0, 0.3)',
                                },
                            }}
                        >
                            無料で診断を始める
                        </Button>
                    </ScrollReveal>
                </Container>
            </Box>
        </Box>
    );
}
