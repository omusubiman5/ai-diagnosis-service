'use client';
import React, { useState } from 'react';
import { Box, Container, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

export default function CTASection() {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ py: 24, bgcolor: '#111111', color: '#FFFFFF', textAlign: 'center' }}>
            <Container maxWidth="md">
                <Typography variant="h2" gutterBottom sx={{ fontFamily: 'var(--font-nanum-myeongjo)', mb: 6, fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.4 }}>
                    あなたの新しい可能性、<br />今すぐ確認しませんか？
                </Typography>
                <Typography variant="body1" sx={{ mb: 12, opacity: 0.7, fontSize: '1.2rem', fontFamily: 'var(--font-nanum-myeongjo)' }}>
                    10,000人以上が診断済み。登録は無料です。
                </Typography>

                <Button
                    variant="contained"
                    size="large"
                    onClick={handleClickOpen}
                    sx={{
                        bgcolor: '#FFFFFF',
                        color: '#111111',
                        py: 2.5,
                        px: 10,
                        fontSize: '1.1rem',
                        borderRadius: 9999,
                        boxShadow: 'none',
                        fontFamily: 'var(--font-ibm-plex-mono)',
                        fontWeight: 500,
                        '&:hover': {
                            bgcolor: '#E0E0E0',
                            boxShadow: 'none',
                        }
                    }}
                >
                    START DIAGNOSIS
                </Button>
            </Container>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="cta-dialog-title"
                PaperProps={{
                    sx: { borderRadius: 4, p: 4 }
                }}
            >
                <DialogTitle id="cta-dialog-title" sx={{ fontFamily: 'var(--font-nanum-myeongjo)', textAlign: 'center', fontSize: '1.5rem' }}>
                    Coming Soon!
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ textAlign: 'center', lineHeight: 2 }}>
                        SKILL60+診断機能は現在開発中です。
                        <br />
                        正式リリースまで今しばらくお待ちください。
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button onClick={handleClose} sx={{ color: '#111' }}>
                        閉じる
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
