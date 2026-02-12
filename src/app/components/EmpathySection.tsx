'use client';

import React from 'react';
import { Box, Container, Typography, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import ScrollReveal from './ScrollReveal';

export default function EmpathySection() {
    return (
        <Box
            sx={{
                py: { xs: 12, md: 16 },
                color: '#000',
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">
                    <Grid size={{ xs: 12, md: 7 }}>
                        <ScrollReveal animation="slide-up">
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
                                定年後の不安を、
                                <br />
                                可能性に変える
                            </Typography>
                        </ScrollReveal>
                    </Grid>
                    <Grid size={{ xs: 12, md: 5 }}>
                        <ScrollReveal animation="slide-up" delay={0.15}>
                            <Stack spacing={3}>
                                <Typography
                                    sx={{
                                        fontSize: 'var(--font-size-body)',
                                        lineHeight: 1.8,
                                        color: 'rgba(0,0,0,0.75)',
                                    }}
                                >
                                    孤独感、自信の喪失、収入の不安 &#8212;
                                    人生の第2章を前に、誰もが抱く悩みです。SKILL60+のAIが、あなたの経験を客観的に分析し、
                                    新しいキャリアの道筋を具体的に提案します。
                                </Typography>
                                <Typography
                                    component="a"
                                    href="#features"
                                    sx={{
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        color: '#000',
                                        textDecoration: 'none',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        cursor: 'pointer',
                                        '&:hover': { textDecoration: 'underline' },
                                    }}
                                >
                                    詳しく見る &rarr;
                                </Typography>
                            </Stack>
                        </ScrollReveal>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
