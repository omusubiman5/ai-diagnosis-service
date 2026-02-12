'use client';

import React, { useRef } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import SmartphoneMockup from './SmartphoneMockup';

export default function HeroSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    });

    const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const textY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);
    const mockupScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.9]);
    const mockupOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

    return (
        <Box
            ref={sectionRef}
            component="div"
            sx={{
                position: 'relative',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000',
                overflow: 'hidden',
                pt: { xs: 12, md: 8 },
                pb: { xs: 4, md: 0 },
            }}
        >
            <Container maxWidth="md">
                <motion.div
                    style={{ opacity: textOpacity, y: textY }}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography
                            variant="h1"
                            component="h1"
                            sx={{
                                fontSize: 'var(--font-size-hero)',
                                fontWeight: 800,
                                lineHeight: 1.05,
                                letterSpacing: '-0.03em',
                                mb: 3,
                                fontFamily: 'var(--font-nanum-myeongjo)',
                                color: '#000',
                            }}
                        >
                            60年の経験が、
                            <br />
                            次の価値になる
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 'var(--font-size-body)',
                                color: '#666',
                                mb: 5,
                                maxWidth: '520px',
                                mx: 'auto',
                                lineHeight: 1.7,
                            }}
                        >
                            あなたの積み重ねた知識と技術を、AIが分析。
                            <br />
                            具体的なキャリアプランと市場価値を、無料でお届けします。
                        </Typography>

                        <Button
                            variant="contained"
                            size="large"
                            href="#cta"
                            endIcon={<ArrowRight size={18} />}
                            sx={{
                                bgcolor: '#00D632',
                                color: '#000',
                                fontSize: '1.05rem',
                                px: 5,
                                py: 1.8,
                                borderRadius: '50px',
                                textTransform: 'none',
                                fontWeight: 700,
                                boxShadow: '0 4px 20px rgba(0, 214, 50, 0.25)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    bgcolor: '#00C02D',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 30px rgba(0, 214, 50, 0.35)',
                                },
                            }}
                        >
                            無料で診断を始める
                        </Button>
                    </Box>
                </motion.div>
            </Container>

            {/* Phone mockup with parallax scale-down */}
            <motion.div
                style={{
                    scale: mockupScale,
                    opacity: mockupOpacity,
                }}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            >
                <Box
                    sx={{
                        mt: { xs: 6, md: 8 },
                        position: 'relative',
                        zIndex: 1,
                    }}
                >
                    <SmartphoneMockup />
                </Box>
            </motion.div>
        </Box>
    );
}
