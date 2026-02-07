'use client';
import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { useVoiceGuide } from '../hooks/useVoiceGuide';

interface VoiceControlProps {
  onChatToggle?: () => void;
  isChatOpen?: boolean;
}

export default function VoiceControl({ onChatToggle, isChatOpen }: VoiceControlProps) {
    const { isPlaying, speak, cancel } = useVoiceGuide();

    return (
        <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000, display: 'flex', gap: 1, alignItems: 'center' }}>
            {onChatToggle && !isChatOpen && (
                <Tooltip title="AIに相談する">
                    <IconButton
                        onClick={onChatToggle}
                        sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            boxShadow: 3,
                            width: 56,
                            height: 56,
                            '&:hover': { bgcolor: 'primary.dark' },
                        }}
                        aria-label="AIチャットを開く"
                    >
                        <ChatIcon />
                    </IconButton>
                </Tooltip>
            )}
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
