'use client';
import { useState, useEffect } from 'react';
import { Box, Button, Typography, IconButton, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AIChatWidget from '@/app/components/AIChatWidget';
import { useAccessibility } from '../hooks/useAccessibility';
import ButtonModeChat from './ButtonModeChat';

const LINE_URL = 'https://line.me/R/ti/p/@skill60plus';

export default function LpChatbot() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const a11y = useAccessibility();

  useEffect(() => { const t=setTimeout(()=>setShowWelcome(true),5000); return()=>clearTimeout(t); }, []);

  // MemoryCards全めくり完了からのイベント受信
  useEffect(() => {
    const handler = () => { setShowWelcome(false); setShowChat(true); };
    window.addEventListener('open-yoshiko-chat', handler);
    return () => window.removeEventListener('open-yoshiko-chat', handler);
  }, []);

  const handleChoice = (action: string) => {
    window.dataLayer?.push({ event: 'chatbot_choice', choice: action });
    if (action === 'voice') {
      const audio = new Audio('/audio/yoshiko-intro.mp3');
      audio.play().catch(() => { setShowWelcome(false); setShowChat(true); });
    }
    if (action === 'ask') {
      const el = document.getElementById('faq-section') || document.getElementById('trust-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      setShowWelcome(false);
    }
    if (action === 'try') { setShowWelcome(false); setShowChat(true); }
  };
  const openChat = () => { setShowWelcome(false); setShowChat(true); };
  const handleLine = () => { window.dataLayer?.push({event:'line_redirect'}); window.open(LINE_URL,'_blank'); };

  return (
    <>
      {showWelcome && !showChat && (
        <Paper sx={{position:'fixed',bottom:80,right:16,zIndex:1000,p:2,maxWidth:280,borderRadius:3,boxShadow:'0 4px 20px rgba(0,0,0,0.12)'}}>
          <IconButton size="small" onClick={()=>setShowWelcome(false)} sx={{position:'absolute',top:4,right:4}}><CloseIcon fontSize="small"/></IconButton>
          <Box sx={{display:'flex',alignItems:'center',gap:1,mb:1.5}}>
            <Box component="img" src="/img/yoshiko-avatar.webp" alt="ヨシコ" sx={{width:40,height:40,borderRadius:'50%'}} />
            <Typography sx={{fontWeight:700,fontSize:'0.9rem'}}>ヨシコ（68歳）</Typography>
          </Box>
          <Typography variant="body2" sx={{mb:2,fontSize:'inherit'}}>こんにちは。何かお手伝いしますか？</Typography>
          <Box sx={{display:'flex',flexDirection:'column',gap:1}}>
            <Button variant="outlined" onClick={()=>handleChoice('voice')} startIcon={<span>🎤</span>} sx={{justifyContent:'flex-start',borderRadius:2,fontSize:'inherit'}}>声で聞く</Button>
            <Button variant="outlined" onClick={()=>handleChoice('ask')} startIcon={<span>💬</span>} sx={{justifyContent:'flex-start',borderRadius:2,fontSize:'inherit'}}>質問がある</Button>
            <Button variant="outlined" onClick={()=>handleChoice('try')} startIcon={<span>✨</span>} sx={{justifyContent:'flex-start',borderRadius:2,fontSize:'inherit'}}>試してみたい</Button>
          </Box>
        </Paper>
      )}
      {showChat && (
        <Box sx={{position:'fixed',bottom:16,right:16,zIndex:1100,width:{xs:340,md:380},height:520,borderRadius:3,overflow:'hidden',boxShadow:'0 8px 40px rgba(0,0,0,0.2)',bgcolor:'#fff',display:'flex',flexDirection:'column'}}>
          <Box sx={{display:'flex',alignItems:'center',gap:1.5,p:1.5,bgcolor:'#FFF8F0',borderBottom:'1px solid #eee',flexShrink:0}}>
            <Box component="img" src="/img/yoshiko-avatar.webp" alt="ヨシコ" sx={{width:36,height:36,borderRadius:'50%'}} />
            <Typography sx={{fontWeight:700,fontSize:'0.95rem'}}>ヨシコ（68歳）</Typography>
            <IconButton size="small" onClick={()=>setShowChat(false)} sx={{ml:'auto'}}><CloseIcon fontSize="small"/></IconButton>
          </Box>
          <Box sx={{flex:1,overflow:'hidden',
            '& [class*="header"], & [class*="Header"]':{display:'none !important'},
            '& [class*="tts"], & [class*="speech"], & [class*="voice-btn"], & [class*="speaker"]':{display:'none !important'},
          }}>
            {a11y.buttonMode ? <ButtonModeChat onLineRedirect={handleLine} /> : <AIChatWidget open={true} onClose={() => setShowChat(false)} />}
          </Box>
        </Box>
      )}
      {!showChat && !showWelcome && (
        <IconButton onClick={openChat} sx={{position:'fixed',bottom:16,right:16,zIndex:1000,width:56,height:56,bgcolor:'#E67E22',color:'#fff',boxShadow:'0 4px 16px rgba(0,0,0,0.2)','&:hover':{bgcolor:'#D35400'}}}>
          <Box component="img" src="/img/yoshiko-avatar.webp" sx={{width:40,height:40,borderRadius:'50%'}} />
        </IconButton>
      )}
    </>
  );
}
