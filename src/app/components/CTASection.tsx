'use client';
import React, { useState } from 'react';
import { Box, Container, Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { motion } from 'framer-motion';

const MotionButton = motion(Button);

export default function CTASection() {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ py: 16, bgcolor: 'primary.main', color: '#fff', textAlign: 'center' }}>
            <Container maxWidth="md">
                <Typography variant="h2" gutterBottom sx={{ fontWeight: 900, mb: 4 }}>
                    あなたの新しい可能性、<br />今すぐ確認しませんか？
                </Typography>
                <Typography variant="h5" sx={{ mb: 8, opacity: 0.9 }}>
                    10,000人以上が診断済み。登録は無料です。
                </Typography>

                <MotionButton
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={handleClickOpen}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    whileFocus={{ outline: '3px solid #32CD32' }}
                    sx={{
                        py: 2,
                        px: 8,
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        borderRadius: 50,
                        boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                    }}
                >
                    無料で診断を始める
                </MotionButton>
            </Container>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="cta-dialog-title"
            >
                <DialogTitle id="cta-dialog-title" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {"Coming Soon!"}
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        SKILL60+診断機能は現在開発中です。
                        <br />
                        正式リリースまで今しばらくお待ちください。
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        閉じる
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
