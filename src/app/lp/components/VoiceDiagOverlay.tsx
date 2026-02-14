'use client';

import React, { useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  LinearProgress,
  Fade,
  Grow,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import CheckIcon from '@mui/icons-material/Check';
import ReplayIcon from '@mui/icons-material/Replay';
import confetti from 'canvas-confetti';
import { useDiagSession } from '../../hooks/useDiagSession';

interface VoiceDiagOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  silentMode: boolean;
  onSilentModeToggle: () => void;
}

export default function VoiceDiagOverlay({
  isOpen,
  onClose,
  silentMode,
  onSilentModeToggle,
}: VoiceDiagOverlayProps) {
  const diag = useDiagSession({ silentMode });

  // Start session when overlay opens
  useEffect(() => {
    if (isOpen) {
      diag.startSession();
    }
    return () => {
      if (!isOpen) {
        diag.endSession();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Confetti on completion (DIAG-010)
  useEffect(() => {
    if (diag.state === 'complete') {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
      });
    }
  }, [diag.state]);

  const handleClose = useCallback(() => {
    diag.endSession();
    onClose();
  }, [diag, onClose]);

  if (!isOpen) return null;

  const progress =
    diag.totalQuestions > 0
      ? ((diag.questionIndex + (diag.state === 'complete' ? 1 : 0)) /
          diag.totalQuestions) *
        100
      : 0;

  return (
    <Fade in={isOpen}>
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          bgcolor: '#1A1A2E',
          color: '#FFF',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
          }}
        >
          <IconButton onClick={handleClose} sx={{ color: '#FFF' }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            おしゃべりスキル診断
          </Typography>
          <IconButton onClick={onSilentModeToggle} sx={{ color: '#FFF' }}>
            {silentMode ? <VolumeOffIcon /> : <VolumeUpIcon />}
          </IconButton>
        </Box>

        {/* Progress bar */}
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            mx: 2,
            height: 6,
            borderRadius: 3,
            bgcolor: 'rgba(255,255,255,0.1)',
            '& .MuiLinearProgress-bar': {
              bgcolor: '#FFD700',
              borderRadius: 3,
            },
          }}
        />
        <Typography
          variant="caption"
          sx={{ textAlign: 'right', px: 2, mt: 0.5, opacity: 0.5 }}
        >
          {diag.questionIndex + 1} / {diag.totalQuestions}
        </Typography>

        {/* Main content area */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            px: 3,
            gap: 3,
          }}
        >
          {/* Avatar area */}
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              bgcolor: diag.isSpeaking ? '#FFD700' : '#4ECDC4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              transition: 'all 0.3s ease',
              animation: diag.isSpeaking
                ? 'pulse 1.5s ease-in-out infinite'
                : 'none',
              '@keyframes pulse': {
                '0%, 100%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.08)' },
              },
            }}
          >
            {diag.state === 'complete' ? '🎉' : '👵'}
          </Box>

          {/* Bot speech text display (DIAG-008) */}
          {diag.state !== 'complete' && (
            <Fade in={!!diag.botText} timeout={500}>
              <Box
                sx={{
                  bgcolor: 'rgba(255,255,255,0.08)',
                  borderRadius: 3,
                  p: 3,
                  maxWidth: 400,
                  width: '100%',
                  textAlign: 'center',
                  minHeight: 80,
                }}
              >
                <Typography
                  sx={{
                    fontSize: '1.4rem',
                    fontWeight: 500,
                    lineHeight: 1.8,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {diag.botText}
                </Typography>
              </Box>
            </Fade>
          )}

          {/* Completion summary */}
          {diag.state === 'complete' && (
            <Grow in timeout={800}>
              <Box
                sx={{
                  bgcolor: 'rgba(255,215,0,0.1)',
                  border: '2px solid #FFD700',
                  borderRadius: 3,
                  p: 3,
                  maxWidth: 400,
                  width: '100%',
                  textAlign: 'center',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '1.1rem',
                    lineHeight: 1.8,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {diag.diagSummary}
                </Typography>
              </Box>
            </Grow>
          )}

          {/* Ma prompt text (DIAG-005) */}
          {diag.maPromptText && diag.state === 'listening' && (
            <Fade in timeout={300}>
              <Typography
                sx={{
                  fontSize: '1rem',
                  color: '#FFD700',
                  textAlign: 'center',
                  fontStyle: 'italic',
                }}
              >
                {diag.maPromptText}
              </Typography>
            </Fade>
          )}

          {/* User transcript display */}
          {(diag.state === 'listening' || diag.state === 'confirming') && (
            <Box
              sx={{
                bgcolor: 'rgba(78,205,196,0.1)',
                borderRadius: 2,
                p: 2,
                maxWidth: 400,
                width: '100%',
                textAlign: 'center',
                minHeight: 50,
              }}
            >
              <Typography
                sx={{
                  fontSize: '1.2rem',
                  color: diag.interimTranscript ? 'rgba(255,255,255,0.5)' : '#4ECDC4',
                }}
              >
                {diag.interimTranscript || diag.userTranscript || '...'}
              </Typography>
            </Box>
          )}

          {/* Tap choices (DIAG-005: appear after 15s silence) */}
          {diag.showTapChoices &&
            diag.currentQuestion &&
            (diag.state === 'listening' || diag.state === 'confirming') && (
              <Grow in timeout={500}>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    justifyContent: 'center',
                    maxWidth: 400,
                  }}
                >
                  {diag.currentQuestion.tapChoices.map((choice) => (
                    <Button
                      key={choice}
                      variant="outlined"
                      onClick={() => diag.selectTapChoice(choice)}
                      sx={{
                        color: '#FFF',
                        borderColor: 'rgba(255,255,255,0.3)',
                        fontSize: '1rem',
                        px: 2.5,
                        py: 1,
                        borderRadius: 5,
                        '&:hover': {
                          borderColor: '#FFD700',
                          bgcolor: 'rgba(255,215,0,0.1)',
                        },
                      }}
                    >
                      {choice}
                    </Button>
                  ))}
                </Box>
              </Grow>
            )}

          {/* Confirmation bar (DIAG-009) */}
          {diag.state === 'confirming' && diag.userTranscript && (
            <Fade in timeout={300}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <Typography sx={{ fontSize: '1rem', opacity: 0.8 }}>
                  「{diag.userTranscript}」で合っていますか？
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<CheckIcon />}
                    onClick={diag.confirmAnswer}
                    sx={{
                      bgcolor: '#4ECDC4',
                      color: '#1A1A2E',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      px: 4,
                      py: 1.2,
                      borderRadius: 5,
                      '&:hover': { bgcolor: '#45B7A0' },
                    }}
                  >
                    確認
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<ReplayIcon />}
                    onClick={diag.retryAnswer}
                    sx={{
                      color: '#FFF',
                      borderColor: 'rgba(255,255,255,0.3)',
                      fontSize: '1.1rem',
                      px: 3,
                      py: 1.2,
                      borderRadius: 5,
                    }}
                  >
                    やり直し
                  </Button>
                </Box>
              </Box>
            </Fade>
          )}
        </Box>

        {/* Bottom area: Mic button */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pb: 4,
            gap: 1,
          }}
        >
          {diag.state !== 'complete' && !silentMode && (
            <>
              <IconButton
                onClick={() => {
                  if (diag.isListening) {
                    // Manual stop → go to confirming
                  } else if (diag.state === 'listening' || diag.state === 'confirming') {
                    diag.retryAnswer();
                  }
                }}
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: diag.isListening ? '#FF6B6B' : '#4ECDC4',
                  color: '#FFF',
                  '&:hover': {
                    bgcolor: diag.isListening ? '#E55555' : '#45B7A0',
                  },
                  animation: diag.isListening
                    ? 'micPulse 1.2s ease-in-out infinite'
                    : 'none',
                  '@keyframes micPulse': {
                    '0%, 100%': {
                      boxShadow: '0 0 0 0 rgba(255,107,107,0.4)',
                    },
                    '50%': {
                      boxShadow: '0 0 0 20px rgba(255,107,107,0)',
                    },
                  },
                }}
              >
                {diag.isListening ? (
                  <MicIcon sx={{ fontSize: 40 }} />
                ) : (
                  <MicOffIcon sx={{ fontSize: 40 }} />
                )}
              </IconButton>
              <Typography variant="caption" sx={{ opacity: 0.5 }}>
                {diag.isListening ? '話してください...' : 'マイク待機中'}
              </Typography>
            </>
          )}

          {/* STT/TTS errors */}
          {(diag.sttError || diag.ttsError) && (
            <Typography
              sx={{ color: '#FF6B6B', fontSize: '0.85rem', textAlign: 'center', px: 2 }}
            >
              {diag.sttError || diag.ttsError}
            </Typography>
          )}

          {/* Complete CTA */}
          {diag.state === 'complete' && (
            <Button
              variant="contained"
              onClick={handleClose}
              sx={{
                bgcolor: '#FFD700',
                color: '#1A1A2E',
                fontWeight: 700,
                fontSize: '1.1rem',
                px: 4,
                py: 1.5,
                borderRadius: 5,
                '&:hover': { bgcolor: '#E5C100' },
              }}
            >
              ヨシコともっと話してみる
            </Button>
          )}

          {/* Phone support (ACC-010) */}
          <Typography
            variant="caption"
            sx={{ opacity: 0.4, mt: 1, textAlign: 'center' }}
          >
            お困りの場合はお電話ください: 0776-XX-XXXX
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
}
