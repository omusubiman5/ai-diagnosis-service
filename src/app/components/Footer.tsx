'use client';
import React from 'react';
import { Box, Container, Typography, Link, Stack, Divider } from '@mui/material';
import ScrollReveal from './ScrollReveal';

export default function Footer() {
    return (
        <Box sx={{ py: 12, bgcolor: '#000000', color: '#FFFFFF' }}>
            <Container maxWidth="lg">
                <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="flex-start" spacing={8} sx={{ mb: 8 }}>
                    <ScrollReveal animation="slide-up">
                        <Box sx={{ maxWidth: '400px' }}>
                            <Typography variant="h4" sx={{ fontFamily: 'var(--font-nanum-myeongjo)', mb: 3, letterSpacing: '-0.02em', fontWeight: 700 }}>
                                SKILL60+
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.7, lineHeight: 1.8 }}>
                                あなたの60年の経験を、次の価値へ。<br />
                                シニア独立支援AIキャリア診断サービス
                            </Typography>
                        </Box>
                    </ScrollReveal>

                    <ScrollReveal animation="slide-up" delay={0.2}>
                        <Stack spacing={2}>
                            <Link href="#" color="inherit" underline="hover" sx={{ opacity: 0.8, fontSize: '0.9rem', fontFamily: 'var(--font-ibm-plex-mono)' }}>
                                COMPANY
                            </Link>
                            <Link href="#" color="inherit" underline="hover" sx={{ opacity: 0.8, fontSize: '0.9rem', fontFamily: 'var(--font-ibm-plex-mono)' }}>
                                PRIVACY
                            </Link>
                            <Link href="#" color="inherit" underline="hover" sx={{ opacity: 0.8, fontSize: '0.9rem', fontFamily: 'var(--font-ibm-plex-mono)' }}>
                                TERMS
                            </Link>
                        </Stack>
                    </ScrollReveal>
                </Stack>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 4 }} />

                <ScrollReveal animation="fade-in" delay={0.4}>
                    <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" sx={{ opacity: 0.4, fontSize: '0.75rem', fontFamily: 'var(--font-ibm-plex-mono)' }}>
                            © {new Date().getFullYear()} SKILL60+. All rights reserved.
                        </Typography>
                    </Stack>
                </ScrollReveal>
            </Container>
        </Box>
    );
}
