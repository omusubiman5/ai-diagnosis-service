'use client';
import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { useVoiceGuide } from '../hooks/useVoiceGuide';

export default function VoiceControl() {
    const { isPlaying, speak, cancel } = useVoiceGuide();

    // Welcome message on mount (optional, but good for feedback)
    React.useEffect(() => {
        // Short delay to allow interaction requirements in some browsers
        const timer = setTimeout(() => {
            // console.log("Voice Guide Ready"); 
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000, display: 'flex', gap: 1, alignItems: 'center' }}>
            <Tooltip title="音声テスト">
                <IconButton
                    onClick={() => speak('音声ガイド機能、正常に動作しています。')}
                    sx={{ bgcolor: 'white', boxShadow: 2, '&:hover': { bgcolor: '#f0f0f0' } }}
                >
                    🎤
                </IconButton>
            </Tooltip>
            <Tooltip title={isPlaying ? "音声を停止" : "音声ガイド (準備中)"}>
                <IconButton
                    onClick={cancel}
                    sx={{
                        bgcolor: isPlaying ? 'secondary.main' : 'background.paper',
                        color: isPlaying ? 'white' : 'inherit',
                        boxShadow: 3,
                        width: 56,
                        height: 56,
                        '&:hover': { bgcolor: isPlaying ? 'secondary.dark' : 'secondary.light' }
                    }}
                >
                    {isPlaying ? '🔊' : '🔈'}
                </IconButton>
            </Tooltip>
        </Box>
    );
}
