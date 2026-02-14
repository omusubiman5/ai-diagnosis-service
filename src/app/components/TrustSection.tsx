'use client';

import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import ScrollReveal from './ScrollReveal';

const metrics = [
    { value: '10,000+', label: '診断実績' },
    { value: '95%', label: '利用者満足度' },
    { value: '3分', label: '平均診断時間' },
];

export default function TrustSection() {
    return (
        <Box
            component="section"
            sx={{
                py: { xs: 12, md: 16 },
                color: '#000',
            }}
        >
            <Container maxWidth="md">
                <ScrollReveal animation="slide-up">
                    <Typography
                        variant="h2"
                        align="center"
                        sx={{
                            fontWeight: 800,
                            letterSpacing: '-0.03em',
                            lineHeight: 1.15,
                            mb: 6,
                            fontFamily: 'var(--font-nanum-myeongjo)',
                            fontSize: 'var(--font-size-h2)',
                        }}
                    >
                        多くの方が、新しい一歩を
                        <br />
                        踏み出しています
                    </Typography>
                </ScrollReveal>

                {/* design1要素: 指標カード */}
                <Grid container spacing={3} sx={{ mb: 6 }}>
                    {metrics.map((metric, index) => (
                        <Grid size={{ xs: 4 }} key={index}>
                            <ScrollReveal animation="slide-up" delay={index * 0.1}>
                                <Box
                                    sx={{
                                        textAlign: 'center',
                                        p: { xs: 3, md: 4 },
                                        bgcolor: '#FFF',
                                        borderRadius: 3,
                                        boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
                                        border: '1px solid rgba(0,0,0,0.04)',
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: { xs: '1.5rem', md: '2.5rem' },
                                            fontWeight: 700,
                                            color: '#00D632',
                                            mb: 0.5,
                                            fontFamily: 'var(--font-ibm-plex-mono)',
                                            lineHeight: 1,
                                        }}
                                    >
                                        {metric.value}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: { xs: '0.75rem', md: '0.9rem' },
                                            color: '#666',
                                        }}
                                    >
                                        {metric.label}
                                    </Typography>
                                </Box>
                            </ScrollReveal>
                        </Grid>
                    ))}
                </Grid>

                {/* 現行: 体験談カード */}
                <ScrollReveal animation="slide-up" delay={0.3}>
                    <Box
                        sx={{
                            bgcolor: '#FFF',
                            borderRadius: 4,
                            p: { xs: 4, md: 6 },
                            boxShadow: '0 2px 30px rgba(0,0,0,0.04)',
                            border: '1px solid rgba(0,0,0,0.04)',
                            textAlign: 'center',
                            mb: 4,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: { xs: '1.1rem', md: '1.25rem' },
                                fontStyle: 'italic',
                                color: '#333',
                                lineHeight: 2,
                                maxWidth: '600px',
                                mx: 'auto',
                                mb: 3,
                            }}
                        >
                            &ldquo;定年後は自分に価値がないと思っていました。
                            でもSKILL60+の診断で、私の30年の製造管理経験が
                            中小企業に求められていると知り、自信が戻りました。&rdquo;
                        </Typography>
                        <Typography
                            sx={{
                                fontFamily: 'var(--font-ibm-plex-mono)',
                                fontSize: '0.85rem',
                                color: '#999',
                            }}
                        >
                            &#8212; Tさん (65歳・元製造管理職)
                        </Typography>
                    </Box>
                </ScrollReveal>

                <ScrollReveal animation="slide-up" delay={0.4}>
                    <Typography
                        component="a"
                        href="#cta"
                        sx={{
                            display: 'block',
                            textAlign: 'center',
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: '#000',
                            textDecoration: 'none',
                            cursor: 'pointer',
                            '&:hover': { textDecoration: 'underline' },
                        }}
                    >
                        体験談をもっと見る &rarr;
                    </Typography>
                </ScrollReveal>
            </Container>
        </Box>
    );
}
