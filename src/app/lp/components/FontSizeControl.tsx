'use client';
import { useState, useEffect } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
type FontSize = 'standard'|'large'|'xlarge';
const SIZES: FontSize[] = ['standard','large','xlarge'];
const LABELS: Record<FontSize,string> = {standard:'標準',large:'大',xlarge:'特大'};
export default function FontSizeControl() {
  const [size,setSize] = useState<FontSize>('standard');
  useEffect(() => { try { const s=sessionStorage.getItem('skill60-accessibility'); if(s){const p=JSON.parse(s); if(SIZES.includes(p.fontSize))setSize(p.fontSize);} } catch{} }, []);
  const cycle = () => {
    const next = SIZES[(SIZES.indexOf(size)+1)%SIZES.length]; setSize(next);
    document.body.classList.remove('font-large','font-xlarge');
    if(next==='large')document.body.classList.add('font-large');
    if(next==='xlarge')document.body.classList.add('font-xlarge');
    try{const s=sessionStorage.getItem('skill60-accessibility');const p=s?JSON.parse(s):{};p.fontSize=next;sessionStorage.setItem('skill60-accessibility',JSON.stringify(p));}catch{}
  };
  return (
    <Box sx={{position:'fixed',top:64,right:16,zIndex:999,display:'flex',alignItems:'center',gap:0.5,
      bgcolor:'rgba(255,255,255,0.95)',borderRadius:2,px:1.5,py:0.5,boxShadow:1,border:'1px solid #e0e0e0'}}>
      <IconButton onClick={cycle} size="small" aria-label="文字サイズ変更">
        <Typography sx={{fontWeight:700,fontSize:'1.1rem',lineHeight:1}}>A<span style={{fontSize:size==='standard'?'0.7rem':size==='large'?'0.9rem':'1.1rem'}}>A</span></Typography>
      </IconButton>
      <Typography variant="caption" sx={{fontSize:'0.65rem',color:'text.secondary',minWidth:24}}>{LABELS[size]}</Typography>
    </Box>
  );
}
