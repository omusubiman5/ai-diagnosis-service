'use client';
import React, { useRef } from 'react';
import { Box, Container, Typography, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
    { number: '01', title: '会員登録', description: 'LINEかメールアドレスで\n1分で登録完了。' },
    { number: '02', title: '5つの質問', description: 'これまでの経験について\n簡単な質問に答えます。' },
    { number: '03', title: '診断結果', description: 'あなたの推定市場価値と\nおすすめの働き方が分かります。' },
];

export default function StepsSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

    useGSAP(() => {
        gsap.from(stepsRef.current, {
            y: 30,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 75%',
            }
        });
    }, { scope: containerRef });

    return (
        <Box ref={containerRef} sx={{ py: 20, bgcolor: '#FFFFFF' }}>
            <Container maxWidth="lg">
                <Box sx={{ mb: 16, textAlign: 'center' }}>
                    <Typography
                        variant="h2"
                        gutterBottom
                        sx={{ fontWeight: 400, letterSpacing: '-0.02em', mb: 2 }}
                    >
                        ご利用の流れ
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: '0.9rem', letterSpacing: '0.1em' }} >
                        HOW IT WORKS
                    </Typography>
                </Box>

                <Grid container spacing={8} justifyContent="center">
                    {steps.map((step, index) => (
                        <Grid size={{ xs: 12, md: 4 }} key={index}>
                            <Box
                                ref={(el: HTMLDivElement | null) => { stepsRef.current[index] = el }}
                                sx={{
                                    textAlign: 'center',
                                    borderTop: '1px solid #111',
                                    pt: 4,
                                    mt: 4
                                }}
                            >
                                <Stack alignItems="center" spacing={3}>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontFamily: 'var(--font-ibm-plex-mono)',
                                            fontSize: '1rem',
                                            fontWeight: 500,
                                            color: '#111',
                                            letterSpacing: '0.1em'
                                        }}
                                    >
                                        STEP {step.number}
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontFamily: 'var(--font-nanum-myeongjo)', mb: 2, fontWeight: 700 }}>
                                        {step.title}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line', lineHeight: 2.0 }}>
                                        {step.description}
                                    </Typography>
                                </Stack>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
