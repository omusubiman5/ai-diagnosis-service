'use client';
import React from 'react';
import { Box, Container, Typography, Stack, Divider } from '@mui/material';
import Grid from '@mui/material/Grid';

const worries = [
    { title: '孤独感', description: '定年後、社会との繋がりが\n急になくなるのが怖い...' },
    { title: '自信喪失', description: '自分の経験が今の時代に\n通用するのか不安...' },
    { title: '収入への不満', description: '再雇用での大幅な年収ダウンに\n納得がいかない...' },
];

export default function EmpathySection() {
    return (
        <Box sx={{ py: 20, bgcolor: '#FFFFFF' }}>
            <Container maxWidth="lg">
                <Box sx={{ mb: 16, textAlign: 'center' }}>
                    <Typography
                        variant="h2"
                        gutterBottom
                        sx={{ fontWeight: 400, letterSpacing: '-0.02em', mb: 4 }}
                    >
                        こんなモヤモヤ、<br />抱えていませんか？
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
                        人生の第2章を前に、誰もが抱く不安。<br />
                        あなたは一人ではありません。
                    </Typography>
                </Box>

                <Grid container spacing={8} justifyContent="center">
                    {worries.map((worry, index) => (
                        <Grid size={{ xs: 12, md: 4 }} key={index}>
                            <Stack spacing={3} alignItems="center" textAlign="center">
                                <Typography variant="h5" sx={{ fontWeight: 400, fontFamily: 'var(--font-nanum-myeongjo)' }}>
                                    {worry.title}
                                </Typography>
                                <Divider sx={{ width: '40px', borderColor: '#111', borderBottomWidth: 1 }} />
                                <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line', lineHeight: 2.0 }}>
                                    {worry.description}
                                </Typography>
                            </Stack>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
