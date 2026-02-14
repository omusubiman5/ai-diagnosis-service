'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Box, IconButton, Tooltip, Fade, Typography } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { useSpeechToText } from '../../hooks/useSpeechToText';

export default function VoiceControl() {
  const [speakerOn, setSpeakerOn] = useState(true);
  const stt = useSpeechToText();
  const prevTranscriptRef = useRef('');

  // スピーカーON/OFF → sessionStorage に保存して LpChatbot の TTS と連携
  const toggleSpeaker = useCallback(() => {
    setSpeakerOn((prev) => {
      const next = !prev;
      try {
        const s = sessionStorage.getItem('skill60-accessibility');
        const p = s ? JSON.parse(s) : {};
        p.textOnly = !next;
        sessionStorage.setItem('skill60-accessibility', JSON.stringify(p));
      } catch { /* ignore */ }
      return next;
    });
  }, []);

  // 初期値をsessionStorageから復元
  useEffect(() => {
    try {
      const s = sessionStorage.getItem('skill60-accessibility');
      if (s) {
        const p = JSON.parse(s);
        if (p.textOnly === true) setSpeakerOn(false);
      }
    } catch { /* ignore */ }
  }, []);

  // マイクボタン → STT開始/停止
  const toggleMic = useCallback(() => {
    if (stt.isListening) {
      stt.stopListening();
    } else {
      stt.startListening();
    }
  }, [stt]);

  // 音声認識結果をBotpressに送信
  useEffect(() => {
    if (stt.transcript && stt.transcript !== prevTranscriptRef.current) {
      prevTranscriptRef.current = stt.transcript;

      // Botpress webchat にテキストを送信
      if (window.botpress) {
        // まずチャットを開く
        window.botpress.open();
        // sendEvent でユーザーメッセージを送信
        window.botpress.sendEvent({
          type: 'text',
          text: stt.transcript,
        }).catch((err: unknown) => {
          console.warn('[VoiceControl] sendEvent failed:', err);
        });
      }

      stt.stopListening();
    }
  }, [stt.transcript, stt]);

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 100,
        right: 20,
        zIndex: 998,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        alignItems: 'center',
      }}
    >
      {/* スピーカー ON/OFF */}
      <Tooltip title={speakerOn ? '音声を消す' : '音声をつける'} placement="left">
        <IconButton
          onClick={toggleSpeaker}
          aria-label={speakerOn ? '音声を消す' : '音声をつける'}
          sx={{
            width: 48,
            height: 48,
            bgcolor: speakerOn ? '#4ECDC4' : 'rgba(0,0,0,0.5)',
            color: '#FFF',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            '&:hover': {
              bgcolor: speakerOn ? '#45B7A0' : 'rgba(0,0,0,0.7)',
            },
          }}
        >
          {speakerOn ? <VolumeUpIcon /> : <VolumeOffIcon />}
        </IconButton>
      </Tooltip>

      {/* マイク ON/OFF */}
      <Tooltip title={stt.isListening ? '音声入力を停止' : '声で話しかける'} placement="left">
        <IconButton
          onClick={toggleMic}
          aria-label={stt.isListening ? '音声入力を停止' : '声で話しかける'}
          sx={{
            width: 48,
            height: 48,
            bgcolor: stt.isListening ? '#FF6B6B' : '#E67E22',
            color: '#FFF',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            animation: stt.isListening
              ? 'voicePulse 1.2s ease-in-out infinite'
              : 'none',
            '@keyframes voicePulse': {
              '0%, 100%': { boxShadow: '0 0 0 0 rgba(255,107,107,0.4)' },
              '50%': { boxShadow: '0 0 0 12px rgba(255,107,107,0)' },
            },
            '&:hover': {
              bgcolor: stt.isListening ? '#E55555' : '#D35400',
            },
          }}
        >
          {stt.isListening ? <MicIcon /> : <MicOffIcon />}
        </IconButton>
      </Tooltip>

      {/* 音声認識中の表示 */}
      <Fade in={stt.isListening}>
        <Typography
          sx={{
            fontSize: '0.7rem',
            color: '#FF6B6B',
            fontWeight: 600,
            textAlign: 'center',
            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
          }}
        >
          聞いています...
        </Typography>
      </Fade>

      {/* エラー表示 */}
      {stt.error && (
        <Typography
          sx={{
            fontSize: '0.65rem',
            color: '#FF6B6B',
            maxWidth: 120,
            textAlign: 'center',
            bgcolor: 'rgba(0,0,0,0.7)',
            borderRadius: 1,
            px: 1,
            py: 0.5,
          }}
        >
          {stt.error}
        </Typography>
      )}
    </Box>
  );
}
