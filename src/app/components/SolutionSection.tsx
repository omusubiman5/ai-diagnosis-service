'use client';

import React from 'react';
import { Box, Container, Typography, Grid, List, ListItem, ListItemText } from '@mui/material';
import ScrollReveal from './ScrollReveal';

const benefits = [
    '自分では当たり前だと思っていた経験の価値を再発見',
    '具体的な企業ニーズとマッチした提案',
    '無理のない働き方で月収を確保',
];

export default function SolutionSection() {
    return (
        <Box
            sx={{
                py: { xs: 12, md: 20 },
                color: '#000',
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">
                    {/* Left: Text content */}
                    <Grid size={{ xs: 12, md: 6 }}>
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
                                経験を、収入に変える
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 'var(--font-size-body)',
                                    lineHeight: 1.8,
                                    color: '#666',
                                    mb: 4,
                                }}
                            >
                                40年の専門知識は、中小企業にとって「喉から手が出るほど欲しいスキル」。
                                AIが客観的な数字で、あなたの市場価値を算出します。
                            </Typography>

                            <List disablePadding sx={{ mb: 4 }}>
                                {benefits.map((item, i) => (
                                    <ListItem key={i} disablePadding sx={{ py: 0.6 }}>
                                        <ListItemText
                                            primary={item}
                                            primaryTypographyProps={{
                                                sx: {
                                                    fontSize: '1rem',
                                                    color: '#444',
                                                    lineHeight: 1.6,
                                                    '&::before': {
                                                        content: '"\\2713"',
                                                        color: '#00D632',
                                                        fontWeight: 700,
                                                        mr: 1.5,
                                                    },
                                                },
                                            }}
                                        />
                                    </ListItem>
                                ))}
                            </List>

                            <Typography
                                component="a"
                                href="#cta"
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
                        </ScrollReveal>
                    </Grid>

                    {/* Right: Success story card */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <ScrollReveal animation="slide-up" delay={0.2}>
                            <Box
                                sx={{
                                    p: { xs: 4, md: 6 },
                                    borderRadius: 4,
                                    bgcolor: '#FFF',
                                    boxShadow: '0 2px 40px rgba(0,0,0,0.06)',
                                    border: '1px solid rgba(0,0,0,0.06)',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontFamily: 'var(--font-ibm-plex-mono)',
                                        fontSize: '0.75rem',
                                        letterSpacing: '0.1em',
                                        color: '#999',
                                        mb: 3,
                                    }}
                                >
                                    SUCCESS STORY
                                </Typography>

                                <Typography
                                    variant="h5"
                                    sx={{ fontWeight: 700, mb: 4 }}
                                >
                                    Sさん (68歳・元経理部長)
                                </Typography>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 3,
                                        mb: 4,
                                        pb: 4,
                                        borderBottom: '1px solid #eee',
                                    }}
                                >
                                    <Box sx={{ flex: 1 }}>
                                        <Typography
                                            sx={{
                                                fontFamily: 'var(--font-ibm-plex-mono)',
                                                fontSize: '0.7rem',
                                                color: '#999',
                                                letterSpacing: '0.08em',
                                                mb: 0.5,
                                            }}
                                        >
                                            BEFORE
                                        </Typography>
                                        <Typography sx={{ color: '#666' }}>
                                            求職活動に苦戦
                                        </Typography>
                                    </Box>
                                    <Typography
                                        sx={{
                                            fontSize: '1.5rem',
                                            color: '#00D632',
                                            fontWeight: 300,
                                        }}
                                    >
                                        &rarr;
                                    </Typography>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography
                                            sx={{
                                                fontFamily: 'var(--font-ibm-plex-mono)',
                                                fontSize: '0.7rem',
                                                color: '#999',
                                                letterSpacing: '0.08em',
                                                mb: 0.5,
                                            }}
                                        >
                                            AFTER
                                        </Typography>
                                        <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                                            月収25万円
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontFamily: 'var(--font-ibm-plex-mono)',
                                                fontSize: '0.75rem',
                                                color: '#999',
                                            }}
                                        >
                                            週3日・顧問契約
                                        </Typography>
                                    </Box>
                                </Box>

                                <Typography
                                    sx={{
                                        fontStyle: 'italic',
                                        color: '#555',
                                        lineHeight: 1.8,
                                        fontSize: '0.95rem',
                                    }}
                                >
                                    &ldquo;経理一筋40年の経験が、中小企業の顧問としてこれほど評価されるとは驚きでした。
                                    無理なく、誇りを持って働けています。&rdquo;
                                </Typography>
                            </Box>
                        </ScrollReveal>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
