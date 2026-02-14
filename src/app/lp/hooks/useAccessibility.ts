'use client';
import { useState, useEffect, useCallback } from 'react';

type FontSize = 'standard' | 'large' | 'xlarge';
interface AccessibilityState { fontSize: FontSize; buttonMode: boolean; textOnly: boolean; }
const KEY = 'skill60-accessibility';
const SIZES: FontSize[] = ['standard', 'large', 'xlarge'];
const FONT_T = ['文字が小さい','文字小さい','字が小さい','見えない','見えにくい','読めない','読みにくい','文字を大きく','大きくして','もっと大きく'];
const BTN_T = ['話すのが苦手','入力が苦手','打つのが苦手','ボタンがいい','選択肢','打てない'];
const TXT_T = ['耳が遠い','音声なし','音を消して','聞こえにくい','音声いらない','音なし'];

export function useAccessibility() {
  const [state, setState] = useState<AccessibilityState>({ fontSize: 'standard', buttonMode: false, textOnly: false });
  useEffect(() => { try { const s = sessionStorage.getItem(KEY); if (s) { const p = JSON.parse(s); setState(p); applyFont(p.fontSize); } } catch {} }, []);
  const save = useCallback((s: AccessibilityState) => { setState(s); try { sessionStorage.setItem(KEY, JSON.stringify(s)); } catch {} }, []);
  const applyFont = (sz: FontSize) => { document.body.classList.remove('font-large','font-xlarge'); if (sz==='large') document.body.classList.add('font-large'); if (sz==='xlarge') document.body.classList.add('font-xlarge'); };
  const cycleFontSize = useCallback(() => { const n = SIZES[(SIZES.indexOf(state.fontSize)+1)%SIZES.length]; applyFont(n); save({...state,fontSize:n}); return n; }, [state,save]);
  const toggleButtonMode = useCallback(() => { const v=!state.buttonMode; save({...state,buttonMode:v}); return v; }, [state,save]);
  const toggleTextOnly = useCallback(() => { const v=!state.textOnly; save({...state,textOnly:v}); return v; }, [state,save]);
  const checkMessage = useCallback((msg:string):{handled:boolean;type?:string;response?:string} => {
    if (FONT_T.some(t=>msg.includes(t))) { const n=cycleFontSize(); const r:Record<FontSize,string>={standard:'標準の大きさに戻しましたよ。',large:'文字を大きくしましたよ。これで見やすくなったかしら？\nまだ小さかったら、もう一度言ってくださいね。',xlarge:'特大にしましたわ。これなら大丈夫ね。'}; return{handled:true,type:'font_size',response:r[n]}; }
    if (BTN_T.some(t=>msg.includes(t))) { toggleButtonMode(); return{handled:true,type:'button_mode',response:'ボタンで選べるようにしましたよ。これなら楽でしょう？'}; }
    if (TXT_T.some(t=>msg.includes(t))) { toggleTextOnly(); return{handled:true,type:'text_only',response:'音声を止めて、文字だけにしましたよ。ゆっくり読んでくださいね。'}; }
    return{handled:false};
  }, [cycleFontSize,toggleButtonMode,toggleTextOnly]);
  return { ...state, cycleFontSize, toggleButtonMode, toggleTextOnly, checkMessage };
}
