'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  IconButton,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Fade,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useAIChat } from '../hooks/useAIChat';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { useVoiceGuide } from '../hooks/useVoiceGuide';

interface AIChatWidgetProps {
  open: boolean;
  onClose: () => void;
}

export default function AIChatWidget({ open, onClose }: AIChatWidgetProps) {
  const { messages, sendMessage, isLoading, error, clearMessages } = useAIChat();
  const {
    startListening,
    stopListening,
    clearTranscript,
    transcript,
    interimTranscript,
    isListening,
    isSupported: isSpeechSupported,
    error: speechError,
  } = useSpeechToText();
  const { speak, cancel, isPlaying, prime } = useVoiceGuide();

  const [inputValue, setInputValue] = useState('');
  const autoSpeak = true; // Auto-speaking is always enabled
  const lastMessageCountRef = useRef(messages.length);
  const lastProcessedTranscriptRef = useRef('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Auto-speak effect - Simplified
  useEffect(() => {
    // Only speak assistant messages that haven't been spoken yet
    if (autoSpeak && messages.length > lastMessageCountRef.current) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.role === 'assistant') {
        console.log('[AIChatWidget] Auto-speaking assistant message:', lastMessage.content.substring(0, 20) + '...');
        speak(lastMessage.content);
      }
    }
    lastMessageCountRef.current = messages.length;
  }, [messages, autoSpeak, speak]);

  // Prime when chat opens to "wake up" the speech engine
  useEffect(() => {
    if (open) {
      prime();
      console.log('[AIChatWidget] Initial priming on open');
    }
  }, [open, prime]);

  const handleSend = useCallback((textOverride?: string | React.MouseEvent | React.KeyboardEvent) => {
    let text = '';
    if (typeof textOverride === 'string') {
      text = textOverride;
    } else {
      text = inputValue;
    }

    text = text.trim();
    if (!text) return;

    // Cancel any ongoing speech and prime for next one
    cancel();
    prime();

    sendMessage(text);
    setInputValue('');
    if (isListening) stopListening();
  }, [cancel, prime, sendMessage, isListening, stopListening, inputValue]);

  // When speech recognition completes a transcript, send it directly
  useEffect(() => {
    if (transcript && transcript !== lastProcessedTranscriptRef.current) {
      lastProcessedTranscriptRef.current = transcript;
      // Use queueMicrotask to avoid synchronous state update warning
      queueMicrotask(() => {
        handleSend(transcript);
        // Clear transcript after sending to prevent re-sending
        clearTranscript();
      });
    }
  }, [transcript, clearTranscript]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      // Ensure speech is stopped before mic starts
      cancel();
      setTimeout(() => {
        startListening();
      }, 100);
    }
  };

  const handleSpeak = (text: string) => {
    if (isPlaying) {
      cancel();
    } else {
      // Ensure mic is stopped before speak starts
      if (isListening) stopListening();
      speak(text);
    }
  };

  if (!open) return null;

  return (
    <Fade in={open}>
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: { xs: 0, sm: 20 },
          right: { xs: 0, sm: 20 },
          width: { xs: '100%', sm: 400 },
          height: { xs: '100dvh', sm: 500 },
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1300,
          borderRadius: { xs: 0, sm: 3 },
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            px: 2,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: 56,
          }}
        >
          <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 700 }}>
            AIキャリア相談
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="会話をクリア">
              <IconButton
                onClick={clearMessages}
                size="small"
                sx={{ color: 'white' }}
                aria-label="会話をクリア"
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="閉じる">
              <IconButton
                onClick={onClose}
                size="small"
                sx={{ color: 'white' }}
                aria-label="チャットを閉じる"
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Messages area */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            px: 2,
            py: 1,
            bgcolor: '#F5F7FA',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          }}
        >
          {messages.length === 0 && (
            <Box sx={{ textAlign: 'center', mt: 4, px: 2 }}>
              <Typography
                variant="body1"
                sx={{ color: 'text.secondary', fontSize: '1rem', lineHeight: 1.8 }}
              >
                こんにちは！SKILL60+のAIキャリア相談です。
                <br />
                あなたの経験やスキルについて、お気軽にお話しください。
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', mt: 2, fontSize: '0.875rem' }}
              >
                {isSpeechSupported
                  ? '🎤 マイクボタンで音声入力もできます'
                  : '⌨️ テキストでメッセージを送信できます'}
              </Typography>

            </Box>
          )}

          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-end',
                gap: 0.5,
              }}
            >
              <Paper
                elevation={1}
                className={
                  msg.role === 'assistant' && isPlaying && index === messages.length - 1
                    ? 'message-speaking'
                    : ''
                }
                sx={{
                  px: 2,
                  py: 1.5,
                  maxWidth: '80%',
                  bgcolor: msg.role === 'user' ? 'primary.main' : 'white',
                  color: msg.role === 'user' ? 'white' : 'text.primary',
                  borderRadius: 2,
                  borderBottomRightRadius: msg.role === 'user' ? 0 : 2,
                  borderBottomLeftRadius: msg.role === 'assistant' ? 0 : 2,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: '1rem',
                    lineHeight: 1.7,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.content}
                </Typography>
              </Paper>
              {msg.role === 'assistant' && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Tooltip title={isPlaying ? '読み上げを停止' : '読み上げる'}>
                    <IconButton
                      onClick={() => handleSpeak(msg.content)}
                      size="small"
                      className={isPlaying && index === messages.length - 1 ? 'speaker-active' : ''}
                      sx={{ color: 'primary.main', minWidth: 36, minHeight: 36 }}
                      aria-label={isPlaying ? '読み上げを停止' : 'この応答を読み上げる'}
                    >
                      <VolumeUpIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {/* Speaking Wave Animation showing only for the current playing message */}
                  {isPlaying && index === messages.length - 1 && (
                    <Box className="speaking-wave-container">
                      <Box className="speaking-wave-bar" />
                      <Box className="speaking-wave-bar" />
                      <Box className="speaking-wave-bar" />
                      <Box className="speaking-wave-bar" />
                      <Box className="speaking-wave-bar" />
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          ))}

          {isLoading && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 1 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                考えています...
              </Typography>
            </Box>
          )}

          {(error || speechError) && (
            <Typography
              variant="body2"
              sx={{ color: 'error.main', textAlign: 'center', py: 1 }}
            >
              {error || speechError}
            </Typography>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* Interim transcript display */}
        {isListening && interimTranscript && (
          <Box className="interim-container" sx={{ px: 2, py: 1, borderTop: '1px solid #E0E0E0' }}>
            <Typography
              variant="body2"
              className="interim-text"
              sx={{
                color: 'text.secondary',
                fontStyle: 'italic',
                fontWeight: 500,
              }}
            >
              {interimTranscript}
            </Typography>
          </Box>
        )}

        {/* Input area */}
        <Box
          className={isListening ? 'input-area-recording' : ''}
          sx={{
            px: 2,
            py: 1.5,
            bgcolor: 'white',
            borderTop: '1px solid #E0E0E0',
            display: 'flex',
            alignItems: 'flex-end',
            gap: 1,
          }}
        >
          {isSpeechSupported && (
            <Tooltip title={isListening ? '一時停止（または話し終えると自動送信）' : '音声で入力'}>
              <Box sx={{ position: 'relative' }}>
                <IconButton
                  onClick={handleMicToggle}
                  className={isListening ? 'mic-recording' : ''}
                  sx={{
                    bgcolor: isListening ? 'error.main' : 'grey.100',
                    color: isListening ? 'white' : 'primary.main',
                    width: 48,
                    height: 48,
                    '&:hover': {
                      bgcolor: isListening ? 'error.dark' : 'grey.200',
                    },
                  }}
                  aria-label={isListening ? '音声入力を停止' : '音声で入力'}
                >
                  {isListening ? <MicOffIcon /> : <MicIcon />}
                </IconButton>
                {isListening && <Box className="recording-badge" />}
              </Box>
            </Tooltip>
          )}

          <TextField
            fullWidth
            multiline
            maxRows={3}
            placeholder="メッセージを入力..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            size="small"
            sx={{
              '& .MuiInputBase-root': {
                fontSize: '1rem',
                borderRadius: 2,
              },
            }}
          />

          <Tooltip title="送信">
            <span>
              <IconButton
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  width: 48,
                  height: 48,
                  '&:hover': { bgcolor: 'primary.dark' },
                  '&.Mui-disabled': { bgcolor: 'grey.300', color: 'grey.500' },
                }}
                aria-label="メッセージを送信"
              >
                <SendIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Paper>
    </Fade>
  );
}
