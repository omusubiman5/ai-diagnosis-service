'use client';
import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import ScrollReveal from './ScrollReveal';

export default function CTASection() {
    return (
        <Box
            component="section"
            sx={{
                py: { xs: 16, md: 24 },
                bgcolor: '#00D632',
                color: '#000',
            }}
        >
            <Container maxWidth="md">
                <ScrollReveal animation="slideUp">
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography
                            variant="h2"
                            sx={{
                                mb: 4,
                                fontWeight: 700,
                                letterSpacing: '-0.02em',
                                fontSize: 'var(--font-size-hero)',
                                fontFamily: 'var(--font-nanum-myeongjo)',
                                lineHeight: 1.2,
                            }}
                        >
                            今すぐ始めよう
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 'var(--font-size-body)',
                                lineHeight: 1.8,
                                mb: 6,
                                maxWidth: '600px',
                                mx: 'auto',
                            }}
                        >
                            あなたの60年の経験を、次の価値へ。
                        </Typography>

                        <Button
                            variant="contained"
                            size="large"
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
                                }
                            }}
                        >
                            無料で診断を始める
                        </Button>
                    </Box>
                </ScrollReveal>
            </Container>
        </Box>
    );
}
