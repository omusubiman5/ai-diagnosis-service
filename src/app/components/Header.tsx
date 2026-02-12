'use client';

import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Stack } from '@mui/material';

export default function Header() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <Box
            component="header"
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                py: 1.5,
                px: 2,
                transition: 'all 0.3s ease',
                bgcolor: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
                backdropFilter: scrolled ? 'blur(20px)' : 'none',
                borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
            }}
        >
            <Container maxWidth="xl">
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography
                        sx={{
                            fontFamily: 'var(--font-nanum-myeongjo)',
                            fontWeight: 800,
                            fontSize: '1.25rem',
                            color: '#000',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        SKILL60+
                    </Typography>

                    <Stack direction="row" spacing={1} alignItems="center">
                        <Button
                            variant="contained"
                            size="small"
                            href="#cta"
                            sx={{
                                bgcolor: '#000',
                                color: '#fff',
                                fontSize: '0.85rem',
                                px: 2.5,
                                py: 0.8,
                                borderRadius: '50px',
                                textTransform: 'none',
                                fontWeight: 600,
                                boxShadow: 'none',
                                '&:hover': {
                                    bgcolor: '#222',
                                    boxShadow: 'none',
                                },
                            }}
                        >
                            診断を始める
                        </Button>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
}
