'use client';
import React, { useRef } from 'react';
import { Box, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const steps = [
    { number: '01', title: '会員登録', description: 'LINEかメールアドレスで\n1分で登録完了。' },
    { number: '02', title: '5つの質問', description: 'これまでの経験について\n簡単な質問に答えます。' },
    { number: '03', title: '診断結果', description: 'あなたの推定市場価値と\nおすすめの働き方が分かります。' },
];

export default function StepsSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
    const prefersReducedMotion = useReducedMotion();

    useGSAP(() => {
        if (prefersReducedMotion) return;

        gsap.from(stepsRef.current, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.3,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 70%',
            }
        });
    }, { scope: containerRef });

    return (
        <Box ref={containerRef} sx={{ py: 12, bgcolor: '#FFFFFF' }}>
            <Container maxWidth="lg">
                <Typography
                    variant="h2"
                    align="center"
                    color="primary"
                    gutterBottom
                    sx={{ mb: 8, fontWeight: 'bold' }}
                >
                    ご利用の流れ
                </Typography>
                <Grid container spacing={4}>
                    {steps.map((step, index) => (
                        <Grid size={{ xs: 12, md: 4 }} key={index}>
                            <Box
                                ref={(el: HTMLDivElement | null) => { stepsRef.current[index] = el }}
                                sx={{
                                    textAlign: 'center',
                                    position: 'relative',
                                    p: 4,
                                }}
                            >
                                <Typography
                                    variant="h1"
                                    color="secondary"
                                    sx={{
                                        fontSize: '6rem',
                                        fontWeight: 900,
                                        opacity: 0.2,
                                        lineHeight: 1,
                                        mb: -4,
                                        position: 'relative',
                                        zIndex: 0,
                                    }}
                                >
                                    {step.number}
                                </Typography>
                                <Box sx={{ position: 'relative', zIndex: 1 }}>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                                        {step.title}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                                        {step.description}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
