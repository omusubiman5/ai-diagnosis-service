'use client';

import React from 'react';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import SmartphoneMockup from './SmartphoneMockup';
import CardFan from './CardFan';

export default function HeroSection() {
    return (
        <Box
            component="section"
            sx={{
                position: 'relative',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#000',
                color: '#FFF',
                overflow: 'hidden',
                py: { xs: 8, md: 0 },
            }}
        >
            <Container maxWidth="xl">
                <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
                    {/* Left: Massive Text */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box
                            sx={{
                                animation: 'slideUp 0.8s ease-out',
                                '@keyframes slideUp': {
                                    from: { opacity: 0, transform: 'translateY(40px)' },
                                    to: { opacity: 1, transform: 'translateY(0)' }
                                }
                            }}
                        >
                            <Typography
                                variant="h1"
                                component="h1"
                                sx={{
                                    fontSize: 'var(--font-size-hero)',
                                    fontWeight: 700,
                                    lineHeight: 1.1,
                                    letterSpacing: '-0.02em',
                                    mb: 4,
                                    fontFamily: 'var(--font-nanum-myeongjo)',
                                }}
                            >
                                60年の経験は、<br />
                                <Box component="span" sx={{ color: '#00D632' }}>
                                    まだ社会の宝だ。
                                </Box>
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 'var(--font-size-body)',
                                    color: '#999',
                                    mb: 6,
                                    maxWidth: '500px',
                                    lineHeight: 1.6,
                                }}
                            >
                                あなたの積み重ねた知識と技術は、次の世代への贈り物。<br />
                                AIとの対話で、その価値をもう一度見つけませんか？
                            </Typography>

                            <Button
                                variant="contained"
                                size="large"
                                sx={{
                                    bgcolor: '#00D632',
                                    color: '#000',
                                    fontSize: '1.1rem',
                                    px: 6,
                                    py: 2,
                                    borderRadius: '50px',
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    boxShadow: '0 4px 20px rgba(0, 214, 50, 0.3)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        bgcolor: '#00FF3C',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 30px rgba(0, 214, 50, 0.4)',
                                    }
                                }}
                            >
                                診断を始める
                            </Button>
                        </Box>
                    </Grid>

                    {/* Right: Phone + Card Fan */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box
                            sx={{
                                position: 'relative',
                                height: { xs: '500px', md: '600px' },
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {/* Card Fan - Behind */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    zIndex: 1,
                                }}
                            >
                                <CardFan />
                            </Box>

                            {/* Smartphone - Front */}
                            <Box
                                sx={{
                                    position: 'relative',
                                    zIndex: 2,
                                }}
                            >
                                <SmartphoneMockup />
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
