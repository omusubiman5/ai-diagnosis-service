'use client';
import React from 'react';
import { Box, Container, Typography, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useVoiceGuide } from '../hooks/useVoiceGuide';

const features = [
    {
        id: '01',
        title: '3分で完了',
        description: 'スマホやPCから、\nたった5つの質問に答えるだけ。',
    },
    {
        id: '02',
        title: 'AI×キャリア理論',
        description: '最新のAIと独自の理論で、\nあなたの強みを科学的に分析。',
    },
    {
        id: '03',
        title: '具体的な数値',
        description: '「なんとなく」ではなく、\n推定年収や求人数を数字で提示。',
    },
];

export default function FeaturesSection() {
    const { speak } = useVoiceGuide();

    return (
        <Box sx={{ py: 20, bgcolor: '#FAFAFA' }} onMouseEnter={() => speak('3分で完了する適正診断。AIとキャリア理論であなたの価値を見える化します。')}>
            <Container maxWidth="lg">
                <Typography
                    variant="h2"
                    align="center"
                    gutterBottom
                    sx={{ mb: 16, fontWeight: 400, letterSpacing: '-0.02em' }}
                >
                    SKILL60+が選ばれる理由
                </Typography>
                <Grid container spacing={8} justifyContent="center">
                    {features.map((feature, index) => (
                        <Grid size={{ xs: 12, md: 4 }} key={index}>
                            <Stack spacing={3} alignItems="center" textAlign="center">
                                <Typography variant="h1" sx={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: '4rem', color: '#E0E0E0', fontWeight: 300, lineHeight: 1 }}>
                                    {feature.id}
                                </Typography>
                                <Typography variant="h5" sx={{ fontFamily: 'var(--font-nanum-myeongjo)', fontWeight: 700 }}>
                                    {feature.title}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line', fontSize: '1rem', lineHeight: 2.0 }}>
                                    {feature.description}
                                </Typography>
                            </Stack>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
