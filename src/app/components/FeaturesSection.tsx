'use client';
import React from 'react';
import { Box, Container, Typography, Card, CardContent } from '@mui/material';
import Grid from '@mui/material/Grid';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PsychologyIcon from '@mui/icons-material/Psychology';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useVoiceGuide } from '../hooks/useVoiceGuide';

const features = [
    {
        title: '3分で完了',
        description: 'スマホやPCから、\nたった5つの質問に答えるだけ。',
        icon: AccessTimeIcon,
    },
    {
        title: 'AI×キャリア理論',
        description: '最新のAIと独自の理論で、\nあなたの強みを科学的に分析。',
        icon: PsychologyIcon,
    },
    {
        title: '具体的な数値',
        description: '「なんとなく」ではなく、\n推定年収や求人数を数字で提示。',
        icon: TrendingUpIcon,
    },
];

export default function FeaturesSection() {
    const { speak } = useVoiceGuide();

    return (
        <Box sx={{ py: 12, bgcolor: '#f5f7fa' }} onMouseEnter={() => speak('3分で完了する適正診断。AIとキャリア理論であなたの価値を見える化します。')}>
            <Container maxWidth="lg">
                <Typography
                    variant="h2"
                    align="center"
                    color="primary"
                    gutterBottom
                    sx={{ mb: 8, fontWeight: 'bold' }}
                >
                    SKILL60+が選ばれる理由
                </Typography>
                <Grid container spacing={4}>
                    {features.map((feature, index) => {
                        const IconComponent = feature.icon;
                        return (
                            <Grid size={{ xs: 12, md: 4 }} key={index}>
                                <Card sx={{
                                    height: '100%',
                                    borderRadius: 4,
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                                    transition: 'transform 0.3s',
                                    '&:hover': { transform: 'translateY(-10px)' }
                                }}>
                                    <CardContent sx={{ textAlign: 'center', p: 4 }}>
                                        <Box sx={{ width: 120, height: 120, mx: 'auto', mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <IconComponent sx={{ fontSize: 80, color: 'primary.main' }} />
                                        </Box>
                                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                                            {feature.title}
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line', fontSize: '1.1rem' }}>
                                            {feature.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Container>
        </Box>
    );
}
