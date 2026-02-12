'use client';

import React from 'react';
import { Box, Container, Typography, Link, Stack, Divider } from '@mui/material';

export default function Footer() {
    return (
        <Box sx={{ py: { xs: 8, md: 10 }, color: '#FFF' }}>
            <Container maxWidth="lg">
                {/* Contact info */}
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={{ xs: 3, md: 6 }}
                    sx={{ mb: 6 }}
                >
                    <Box>
                        <Typography sx={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', mb: 0.5 }}>
                            お問い合わせ
                        </Typography>
                        <Link
                            href="mailto:support@skill60plus.jp"
                            sx={{
                                color: '#FFF',
                                textDecoration: 'none',
                                fontSize: '1rem',
                                fontWeight: 500,
                                '&:hover': { textDecoration: 'underline' },
                            }}
                        >
                            support@skill60plus.jp
                        </Link>
                    </Box>
                    <Box>
                        <Typography sx={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', mb: 0.5 }}>
                            チャットサポート
                        </Typography>
                        <Typography sx={{ fontSize: '1rem', color: '#FFF' }}>
                            アプリ内で24時間対応
                        </Typography>
                    </Box>
                </Stack>

                {/* Navigation links */}
                <Stack
                    direction="row"
                    spacing={3}
                    sx={{ mb: 6, flexWrap: 'wrap', gap: 1.5 }}
                >
                    {['会社概要', 'プライバシーポリシー', '利用規約', 'よくある質問', 'お問い合わせ'].map(
                        (label) => (
                            <Link
                                key={label}
                                href="#"
                                sx={{
                                    color: 'rgba(255,255,255,0.6)',
                                    textDecoration: 'none',
                                    fontSize: '0.85rem',
                                    '&:hover': { color: '#FFF' },
                                }}
                            >
                                {label}
                            </Link>
                        )
                    )}
                </Stack>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 4 }} />

                {/* Bottom bar */}
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', md: 'center' }}
                    spacing={2}
                >
                    <Typography
                        sx={{
                            fontFamily: 'var(--font-nanum-myeongjo)',
                            fontWeight: 700,
                            fontSize: '1rem',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        SKILL60+
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: 'var(--font-ibm-plex-mono)',
                            fontSize: '0.7rem',
                            color: 'rgba(255,255,255,0.3)',
                        }}
                    >
                        &copy; {new Date().getFullYear()} SKILL60+. All rights reserved.
                    </Typography>
                </Stack>
            </Container>
        </Box>
    );
}
