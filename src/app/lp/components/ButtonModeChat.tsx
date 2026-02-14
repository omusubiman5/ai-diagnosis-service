'use client';
import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
const FLOW = [
  {q:'はじめまして。ヨシコです。\nあなたのことを教えてくださいね。\n今の気持ちに近いのはどれかしら？',opts:['何かやりたい気持ちはある','まだ何をしたいか分からない','家族のことで手一杯','とりあえず話を聞きたい']},
  {q:'そうなのね。\nこれまで一番長く続けてきたことは何かしら？',opts:['仕事（会社員・公務員など）','家事・子育て','趣味・ボランティア','介護・家族の世話']},
  {q:'すごいわ。それだけ続けてこられたのは、あなたの力よ。\n——もっと詳しく話を聞かせてもらえたら嬉しいわ。LINEでゆっくりお話しない？',opts:['LINEで話してみる','もう少しここで話したい']},
];
export default function ButtonModeChat({onLineRedirect}:{onLineRedirect:()=>void}) {
  const [step,setStep]=useState(0);
  const [history,setHistory]=useState<{q:string;a:string}[]>([]);
  const choose=(c:string)=>{setHistory(p=>[...p,{q:FLOW[step].q,a:c}]);if(c==='LINEで話してみる'){onLineRedirect();return;}if(step<FLOW.length-1)setStep(s=>s+1);window.dataLayer?.push({event:'button_mode_choice',step,choice:c});};
  return (
    <Box sx={{p:2,height:'100%',overflowY:'auto'}}>
      {history.map((h,i)=>(
        <Box key={i} sx={{mb:2}}>
          <Box sx={{display:'flex',gap:1,mb:1}}>
            <Box component="img" src="/img/yoshiko-avatar.webp" sx={{width:28,height:28,borderRadius:'50%',flexShrink:0}} />
            <Typography variant="body2" sx={{bgcolor:'#FFF8F0',p:1.5,borderRadius:2,whiteSpace:'pre-line',fontSize:'inherit'}}>{h.q}</Typography>
          </Box>
          <Typography variant="body2" sx={{bgcolor:'#E3F2FD',p:1.5,borderRadius:2,ml:'auto',maxWidth:'80%',textAlign:'right',fontSize:'inherit'}}>{h.a}</Typography>
        </Box>
      ))}
      <Box sx={{display:'flex',gap:1,mb:2}}>
        <Box component="img" src="/img/yoshiko-avatar.webp" sx={{width:28,height:28,borderRadius:'50%',flexShrink:0}} />
        <Typography variant="body2" sx={{bgcolor:'#FFF8F0',p:1.5,borderRadius:2,whiteSpace:'pre-line',fontSize:'inherit'}}>{FLOW[step].q}</Typography>
      </Box>
      <Box sx={{display:'flex',flexDirection:'column',gap:1.5,mt:2}}>
        {FLOW[step].opts.map(o=>(
          <Button key={o} variant="outlined" onClick={()=>choose(o)}
            sx={{textAlign:'left',justifyContent:'flex-start',py:1.5,px:2,borderRadius:2,fontSize:'inherit',minHeight:48,borderColor:'#E0E0E0','&:hover':{bgcolor:'#FFF8F0',borderColor:'#E67E22'}}}>{o}</Button>
        ))}
      </Box>
    </Box>
  );
}
