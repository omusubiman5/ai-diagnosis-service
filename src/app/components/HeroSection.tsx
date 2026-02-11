
'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions, Fade } from '@mui/material';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useVoiceGuide } from '../hooks/useVoiceGuide';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { useAIChat } from '../hooks/useAIChat';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import SmartphoneMockup from './SmartphoneMockup';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    // Hooks
    const {
        speak,
        cancel,
        isPlaying: isSpeaking
    } = useVoiceGuide();

    const {
        startListening,
        stopListening,
        transcript,
        interimTranscript,
        isListening,
        error: speechError
    } = useSpeechToText();

    const {
        sendMessage,
        messages,
        isLoading: isChatLoading
    } = useAIChat();

    const [openDialog, setOpenDialog] = useState(false);
    const [hasPermission, setHasPermission] = useState(true);

    // Detect permission error
    useEffect(() => {
        if (speechError && speechError.includes('許可')) {
            setHasPermission(false);
            setOpenDialog(true);
        }
    }, [speechError]);

    // GSAP Animation - Slower, more elegant fade-in
    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
        if (textRef.current) {
            tl.fromTo(textRef.current,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 2.0, delay: 0.5 }
            );
        }
    }, { scope: containerRef });

    // Handle Mic Click
    const handleMicClick = () => {
        if (!hasPermission) {
            setOpenDialog(true);
            return;
        }

        if (isListening) {
            stopListening();
        } else {
            cancel();
            startListening();
        }
    };

    // Auto-send message when transcript is final
    const prevIsListening = useRef(isListening);
    useEffect(() => {
        if (prevIsListening.current && !isListening && transcript) {
            sendMessage(transcript);
        }
        prevIsListening.current = isListening;
    }, [isListening, transcript, sendMessage]);

    // Auto-speak response
    const prevMessagesLength = useRef(messages.length);
    useEffect(() => {
        if (messages.length > prevMessagesLength.current) {
            const lastMsg = messages[messages.length - 1];
            if (lastMsg.role === 'assistant') {
                speak(lastMsg.content);
            }
        }
        prevMessagesLength.current = messages.length;
    }, [messages, speak]);


    return (
        <Box
            ref={containerRef}
            component="section"
            sx={{
                position: 'relative',
                minHeight: '90vh', // Taller hero
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                overflow: 'hidden',
                pt: 12,
                pb: 12
            }}
        >
            <Container maxWidth="lg">
                <Stack
                    ref={textRef}
                    spacing={8}
                    alignItems="center"
                    textAlign="center"
                    sx={{ opacity: 0 }}
                >
                    <Box sx={{ maxWidth: '900px', mx: 'auto' }}>
                        <Typography
                            variant="h1"
                            component="h1"
                            gutterBottom
                            sx={{
                                color: 'text.primary',
                                mb: 4,
                                textShadow: '0px 0px 1px rgba(0,0,0,0.05)' // Subtle sharpness
                            }}
                        >
                            60年の経験は、<br />
                            まだ社会の宝だ。
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{
                                maxWidth: '600px',
                                mx: 'auto',
                                fontSize: '1.25rem', // Slightly larger layout
                                lineHeight: 2.0,
                            }}
                        >
                            あなたの積み重ねた知識と技術は、次の世代への贈り物。<br />
                            AIとの対話で、その価値をもう一度見つけませんか？
                        </Typography>
                    </Box>

                    {/* Voice Interaction Area */}
                    <Box sx={{ position: 'relative', width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                        {/* Status / Prompt */}
                        <Fade in={!isListening && !isSpeaking && !isChatLoading}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, letterSpacing: '0.05em' }}>
                                マイクをタップして、一言お話しください
                            </Typography>
                        </Fade>

                        {/* Mic Button - Minimalist Ring */}
                        <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', mb: 4 }}>
                            {/* Pulse Effect Rings */}
                            {isListening && (
                                <>
                                    <Box sx={{
                                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                        borderRadius: '50%', border: '1px solid rgba(17,17,17,0.1)',
                                        animation: 'voice-ripple 2s infinite'
                                    }} />
                                    <Box sx={{
                                        position: 'absolute', top: -10, left: -10, right: -10, bottom: -10,
                                        borderRadius: '50%', border: '1px solid rgba(17,17,17,0.05)',
                                        animation: 'voice-ripple 2s infinite 0.5s'
                                    }} />
                                </>
                            )}

                            <Button
                                onClick={handleMicClick}
                                variant="outlined"
                                aria-label="音声診断を開始"
                                sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: '50%',
                                    borderWidth: '1px',
                                    borderColor: isListening ? '#111' : '#E0E0E0',
                                    color: isListening ? '#FFF' : '#111',
                                    bgcolor: isListening ? '#111' : 'transparent',
                                    transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                                    zIndex: 10,
                                    '&:hover': {
                                        transform: 'scale(1.03)',
                                        borderColor: '#111',
                                        bgcolor: isListening ? '#333' : 'rgba(0,0,0,0.02)'
                                    }
                                }}
                            >
                                {isListening ? (
                                    <StopIcon sx={{ fontSize: 32 }} />
                                ) : (
                                    <MicIcon sx={{ fontSize: 32 }} />
                                )}
                            </Button>
                        </Box>

                        {/* Active Status Display */}
                        {(isListening || isSpeaking || isChatLoading) && (
                            <Fade in={true}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, height: 24 }}>
                                    {isListening ? (
                                        <Typography variant="caption" sx={{ color: '#111', fontWeight: 500 }}>
                                            聞き取っています...
                                        </Typography>
                                    ) : (
                                        <>
                                            <Box className="speaking-wave-container">
                                                <div className="speaking-wave-bar"></div>
                                                <div className="speaking-wave-bar"></div>
                                                <div className="speaking-wave-bar"></div>
                                            </Box>
                                            <Typography variant="caption" sx={{ color: '#111', fontWeight: 500 }}>
                                                {isChatLoading ? '分析中...' : '応答中'}
                                            </Typography>
                                        </>
                                    )}
                                </Box>
                            </Fade>
                        )}


                        {/* Transcript Area */}
                        {(transcript || interimTranscript) && (
                            <Fade in={true}>
                                <Box
                                    sx={{
                                        mt: 4,
                                        p: 0,
                                        textAlign: 'center',
                                        maxWidth: '100%'
                                    }}
                                >
                                    <Typography variant="h3" sx={{ fontSize: '1.5rem !important', lineHeight: 1.6 }}>
                                        {transcript}
                                        <span className="interim-text" style={{ opacity: 0.5 }}>{interimTranscript}</span>
                                    </Typography>
                                </Box>
                            </Fade>
                        )}

                        {/* Error Message */}
                        {speechError && !openDialog && (
                            <Typography color="error" variant="caption" sx={{ mt: 2, display: 'block' }}>
                                {speechError}
                            </Typography>
                        )}
                    </Box>

                    {/* Smartphone Mockup Animation */}
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <SmartphoneMockup />
                    </Box>

                </Stack>
            </Container>

            {/* Permission Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                PaperProps={{
                    sx: { borderRadius: 2, p: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }
                }}
            >
                <DialogTitle sx={{ fontFamily: 'var(--font-nanum-myeongjo)' }}>マイクの使用許可について</DialogTitle>
                <DialogContent>
                    <Typography>
                        音声診断を行うには、マイクの使用許可が必要です。<br />
                        ブラウザの設定で許可してください。
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} sx={{ color: '#111' }}>
                        閉じる
                    </Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
}
