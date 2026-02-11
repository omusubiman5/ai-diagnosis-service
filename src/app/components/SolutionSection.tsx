'use client';
import React from 'react';
import { Box, Container, Typography, Paper, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import ScrollReveal from './ScrollReveal';

export default function SolutionSection() {
    return (
        <Box sx={{ py: 20, bgcolor: '#050505', color: '#fff' }}>
            <Container maxWidth="lg">
                <ScrollReveal animation="slide-up">
                    <Typography
                        variant="h2"
                        align="center"
                        gutterBottom
                        sx={{ mb: 16, fontWeight: 400, letterSpacing: '-0.03em' }}
                    >
                        その不安、<br />SKILL60+が解決します。
                    </Typography>
                </ScrollReveal>

                <Grid container spacing={12} alignItems="center">
                    <Grid size={{ xs: 12, md: 6 }}>
                        <ScrollReveal animation="slide-up" delay={0.2}>
                            <Box>
                                <Typography variant="h3" gutterBottom sx={{ mb: 4, lineHeight: 1.4, color: 'primary.main' }}>
                                    AIが導き出す、<br />
                                    あなただけの市場価値
                                </Typography>
                                <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 2.2, color: '#ccc' }}>
                                    自分では当たり前だと思っていた経験も、他社から見れば「喉から手が出るほど欲しいスキル」かもしれません。<br /><br />
                                    SKILL60+のAIは、膨大な求人データと照らし合わせ、あなたの市場価値を客観的な数字で算出します。
                                </Typography>
                            </Box>
                        </ScrollReveal>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <ScrollReveal animation="scale-up" delay={0.4}>
                            <Paper
                                sx={{
                                    p: 6,
                                    borderRadius: 4,
                                    bgcolor: '#151515',
                                    boxShadow: '0 4px 40px rgba(0,214,50,0.05)',
                                    border: '1px solid #333'
                                }}
                            >
                                <Typography variant="caption" sx={{ display: 'block', mb: 3, letterSpacing: '0.1em', color: '#888', fontFamily: 'var(--font-ibm-plex-mono)' }}>
                                    SUCCESS STORY
                                </Typography>
                                <Box sx={{ mb: 5 }}>
                                    <Typography variant="h5" sx={{ mb: 1, fontWeight: 700, color: '#fff' }}>
                                        Sさん (68歳・元経理部長)
                                    </Typography>
                                </Box>

                                <Stack spacing={4}>
                                    <Stack direction="row" alignItems="center" spacing={4}>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="caption" sx={{ fontFamily: 'var(--font-ibm-plex-mono)', color: '#666' }} gutterBottom>Before</Typography>
                                            <Typography variant="body1" sx={{ color: '#ccc' }}>求職活動に苦戦</Typography>
                                        </Box>
                                        <Typography variant="h4" sx={{ fontWeight: 300, color: 'primary.main' }}>→</Typography>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="caption" sx={{ fontFamily: 'var(--font-ibm-plex-mono)', color: '#666' }} gutterBottom>After</Typography>
                                            <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>月収25万円</Typography>
                                            <Typography variant="caption" sx={{ color: '#888' }}>週3日・顧問契約</Typography>
                                        </Box>
                                    </Stack>

                                    <Box sx={{ pt: 4, borderTop: '1px solid #333' }}>
                                        <Typography variant="body1" sx={{ fontStyle: 'italic', color: '#aaa' }}>
                                            「経理一筋40年の経験が、中小企業の顧問としてこれほど評価されるとは驚きでした。無理なく、誇りを持って働けています。」
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Paper>
                        </ScrollReveal>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
