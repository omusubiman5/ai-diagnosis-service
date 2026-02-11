'use client';
import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import ScrollReveal from './ScrollReveal';

export default function TrustSection() {
    return (
        <Box
            component="section"
            sx={{
                py: { xs: 12, md: 20 },
                bgcolor: '#F5F5F5',
                color: '#000',
            }}
        >
            <Container maxWidth="md">
                <ScrollReveal animation="slideUp">
                    <Typography
                        variant="h2"
                        align="center"
                        sx={{
                            mb: 8,
                            fontWeight: 700,
                            letterSpacing: '-0.02em',
                            fontSize: 'var(--font-size-h2)',
                            fontFamily: 'var(--font-nanum-myeongjo)',
                        }}
                    >
                        信頼の実績
                    </Typography>
                </ScrollReveal>

                <ScrollReveal animation="slideUp" delay={0.2}>
                    <Box
                        sx={{
                            textAlign: 'center',
                            p: 6,
                            bgcolor: '#FFF',
                            borderRadius: 2,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: '3rem',
                                fontWeight: 700,
                                color: '#00D632',
                                mb: 2,
                                fontFamily: 'var(--font-ibm-plex-mono)',
                            }}
                        >
                            10,000+
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: 'var(--font-size-h3)',
                                fontWeight: 600,
                                mb: 3,
                            }}
                        >
                            診断実績
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: 'var(--font-size-body)',
                                lineHeight: 1.8,
                                color: '#666',
                            }}
                        >
                            多くのシニアの方々が、SKILL60+で新しいキャリアの可能性を発見しています。
                        </Typography>
                    </Box>
                </ScrollReveal>
            </Container>
        </Box>
    );
}
