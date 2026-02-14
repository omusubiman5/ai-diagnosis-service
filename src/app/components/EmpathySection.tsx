'use client';

import React from 'react';
import { Box, Container, Typography, Stack, Divider } from '@mui/material';
import Grid from '@mui/material/Grid';
import ScrollReveal from './ScrollReveal';

const worries = [
    { title: '孤独感', description: '定年後、社会との繋がりが\n急になくなるのが怖い...' },
    { title: '自信喪失', description: '自分の経験が今の時代に\n通用するのか不安...' },
    { title: '収入への不満', description: '再雇用での大幅な年収ダウンに\n納得がいかない...' },
];

export default function EmpathySection() {
    return (
        <Box
            sx={{
                py: { xs: 12, md: 16 },
                color: '#000',
            }}
        >
            <Container maxWidth="lg">
                {/* 現行: ヘッドライン + 説明文 */}
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

                {/* design1要素: 3カード悩みUI */}
                <Grid container spacing={8} justifyContent="center" sx={{ mt: { xs: 8, md: 12 } }}>
                    {worries.map((worry, index) => (
                        <Grid size={{ xs: 12, md: 4 }} key={index}>
                            <ScrollReveal animation="slide-up" delay={0.2 + index * 0.1}>
                                <Stack spacing={2} alignItems="center" textAlign="center">
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight: 400,
                                            fontFamily: 'var(--font-nanum-myeongjo)',
                                            color: '#00D632',
                                        }}
                                    >
                                        {worry.title}
                                    </Typography>
                                    <Divider sx={{ width: '40px', borderColor: 'rgba(0,0,0,0.15)', borderBottomWidth: 1 }} />
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            whiteSpace: 'pre-line',
                                            lineHeight: 2.0,
                                            color: 'rgba(0,0,0,0.55)',
                                        }}
                                    >
                                        {worry.description}
                                    </Typography>
                                </Stack>
                            </ScrollReveal>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
