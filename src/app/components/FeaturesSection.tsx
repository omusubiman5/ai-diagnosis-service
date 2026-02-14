'use client';

import React from 'react';
import { Box, Container, Typography, Grid, List, ListItem, ListItemText } from '@mui/material';
import ScrollReveal from './ScrollReveal';
import CardFan from './CardFan';

const featureItems = [
    '最新AIが膨大な求人データからマッチング',
    '推定年収・求人数を具体的な数字で提示',
    '週1日からの柔軟な働き方も提案',
    'スマホから3分で完了する簡単操作',
];

export default function FeaturesSection() {
    return (
        <Box
            component="section"
            id="features"
            sx={{
                py: { xs: 12, md: 20 },
                color: '#000',
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">
                    {/* Left: Card fan visual */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <ScrollReveal animation="slide-up">
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minHeight: { xs: '280px', md: '400px' },
                                }}
                            >
                                <CardFan />
                            </Box>
                        </ScrollReveal>
                    </Grid>

                    {/* Right: Text + bullet list */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <ScrollReveal animation="slide-up" delay={0.15}>
                            <Typography
                                variant="h2"
                                sx={{
                                    fontWeight: 800,
                                    letterSpacing: '-0.03em',
                                    lineHeight: 1.15,
                                    mb: 4,
                                    fontFamily: 'var(--font-nanum-myeongjo)',
                                    fontSize: 'var(--font-size-h2)',
                                }}
                            >
                                AI診断で見つかる、
                                <br />
                                あなただけの市場価値
                            </Typography>

                            <List disablePadding sx={{ mb: 4 }}>
                                {featureItems.map((item, i) => (
                                    <ListItem key={i} disablePadding sx={{ py: 0.8 }}>
                                        <ListItemText
                                            primary={item}
                                            primaryTypographyProps={{
                                                sx: {
                                                    fontSize: 'var(--font-size-body)',
                                                    color: '#333',
                                                    lineHeight: 1.7,
                                                    pl: 2,
                                                    borderLeft: '2px solid #00D632',
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
                                診断を試す &rarr;
                            </Typography>
                        </ScrollReveal>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
