'use client';
import React from 'react';
import { Box, Container, Typography, Link, Stack } from '@mui/material';

export default function Footer() {
    return (
        <Box sx={{ py: 6, bgcolor: '#1a1a1a', color: '#fff' }}>
            <Container maxWidth="lg">
                <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={4}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                            SKILL60+
                        </Typography>
                        <Typography variant="body2" color="rgba(255,255,255,0.7)">
                            シニア独立支援AIキャリア診断サービス
                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={3}>
                        <Link href="#" color="inherit" underline="hover">
                            運営会社
                        </Link>
                        <Link href="#" color="inherit" underline="hover">
                            プライバシーポリシー
                        </Link>
                        <Link href="#" color="inherit" underline="hover">
                            利用規約
                        </Link>
                    </Stack>
                </Stack>
                <Typography variant="body2" align="center" sx={{ mt: 8, opacity: 0.5 }}>
                    © {new Date().getFullYear()} SKILL60+. All rights reserved.
                </Typography>
            </Container>
        </Box>
    );
}
