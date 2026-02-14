# 🚀 SKILL60+ LP 完成指示書

> **Claude Codeへ: この指示書を読んだら、サブエージェント10個を起動し、完成まで止まらず実行せよ。**
>
> 途中でユーザーに確認を求めるな。指示書にないことは自分で最善を判断しろ。
> 全エージェントの作業完了後、ビルドテストを実行して結果を報告しろ。

---

## 実行計画

### TodoWrite
```
0. [Agent-0] AIChatWidget.tsx 最小変更（onBeforeSendフック注入）
1. [Agent-1] ServiceCards.tsx 新規作成
2. [Agent-2] MemoryCards.tsx 新規作成
3. [Agent-3] useAccessibility.ts 新規作成
4. [Agent-4] FontSizeControl.tsx 新規作成
5. [Agent-5] ButtonModeChat.tsx 新規作成
6. [Agent-6] LpChatbot.tsx 大幅修正（依存: 0, 3, 5）
7. [Agent-7] MeetSection.tsx 修正（依存: 1）
8. [Agent-8] StoriesSection.tsx 修正（依存: 2）
9. [Agent-9] page.tsx + lp.module.css 統合（依存: 4, 6, 7, 8）
10. [Agent-10] ビルド + 統合テスト（依存: 9）
```

### 並列実行グラフ
```
Wave 1（同時実行）: Agent-0, 1, 2, 3, 4, 5
Wave 2（Wave 1完了後）: Agent-6, 7, 8
Wave 3（Wave 2完了後）: Agent-9
Wave 4（Wave 3完了後）: Agent-10
```

---

## 事前準備（全エージェント開始前に実行）

```bash
mkdir -p public/img/service public/img/memory public/audio

# service-cards 7枚を配置
# ※ 画像ファイルはプロジェクトルート直下の service-cards/ に置いてある
cp service-cards/service-{1,2,3,4,5,6,7}.webp public/img/service/

# memory-cards 8枚を配置
cp memory-cards/card-{1,2,3,4,5,6,7,8}.webp public/img/memory/

# アバター配置
cp yoshiko-avatar.webp public/img/
cp yoshiko-avatar-lg.webp public/img/

# 確認
ls public/img/service/ public/img/memory/ public/img/yoshiko-avatar*.webp
```

---

## ★ 絶対禁止（全エージェント共通）

1. `src/app/components/AIChatWidget.tsx` → **Agent-0 の指示以外の変更禁止**（最小変更のみ許可）
2. `src/app/api/chat/route.ts` を変更するな
3. `window.speechSynthesis`（ブラウザTTS）を使うな — ロボット声は世界観を壊す
4. 画像ファイル名を変えるな — パスは全て固定
5. 「AIキャリア相談」のタイトルを残すな — CSSで隠してヨシコヘッダーで上書き

---

## Agent-0: AIChatWidget.tsx 最小変更

**修正:** `src/app/components/AIChatWidget.tsx`
**変更量:** 約10行追加のみ。既存の動作は一切壊さない。

### 目的
CHATBOTのメッセージ送信前にフックを挿入し、即時カスタム（フォントサイズ変更、ボタンモード切替、テキストモード切替）をLpChatbot側から制御可能にする。

### 変更手順

**Step 1: Props interfaceに `onBeforeSend` を追加**

既存のinterface（または新規作成）に以下を追加:

```tsx
interface AIChatWidgetProps {
  // 既存のprops（あれば残す）
  mode?: 'overlay' | 'embedded';
  // ★ 追加
  onBeforeSend?: (message: string) => { handled: boolean; response?: string };
}
```

**Step 2: コンポーネントの引数でpropsを受け取る**

```tsx
// 変更前（例）:
export default function AIChatWidget() {

// 変更後:
export default function AIChatWidget({ onBeforeSend, mode }: AIChatWidgetProps = {}) {
```

既にpropsを受け取っている場合は `onBeforeSend` を追加するだけ。

**Step 3: メッセージ送信ハンドラに割り込み処理を追加**

送信ボタン押下 or Enterキーでメッセージを送信する関数（`handleSend`, `handleSubmit`, `sendMessage` 等の名前）を見つけて、API呼び出しの直前に以下を追加:

```tsx
// ★ 追加: onBeforeSendフックで即時カスタム判定
if (onBeforeSend) {
  const result = onBeforeSend(message);  // messageは送信するテキスト
  if (result.handled) {
    // APIに送信せず、応答を直接チャット履歴に追加
    setMessages(prev => [
      ...prev,
      { role: 'user', content: message },
      { role: 'assistant', content: result.response || '' },
    ]);
    setInput('');  // 入力欄をクリア
    return;  // ★ ここでreturn。APIには送信しない
  }
}
// 既存のAPI送信処理が続く...
```

**★ 重要: `setMessages` と `setInput` は既存のstate更新関数の名前に合わせること。**
実際のコードを読んで、メッセージ配列の状態変数名とテキスト入力の状態変数名を確認し、
上記コードの変数名を合わせる。

### 変更しないこと
- 既存のUI・スタイル・レイアウト
- API呼び出しロジック
- メッセージ表示ロジック
- 既存のprops（あれば）

### 検証
```
1. LP以外（通常のCHATBOT画面）で AIChatWidget が今まで通り動くこと
   → onBeforeSend が undefined なので if文をスキップ。既存動作に影響なし。
2. LPで onBeforeSend を渡した場合、即時カスタムが動くこと
   → 「文字を大きくして」→ ヨシコの応答がチャット履歴に直接追加される
```

---

## Agent-1: ServiceCards.tsx

**作成:** `src/app/lp/components/ServiceCards.tsx`

SKILL60+の7つの世界観を紹介するカード。**Cash App風の純粋CSSカードファンアニメーション**。
GSAPやFramer Motionは使わない。CSS transform + transition のみ。
スクロールで表示→カード群がスタック状態→ホバー/タップで扇形に展開。

```tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

interface ServiceCard {
  id: number;
  icon: string;
  color: string;
  label: string;
  photo: string;
}

const CARDS: ServiceCard[] = [
  { id: 1, icon: '🤝', color: '#FF8A80', label: 'AIの友人', photo: '/img/service/service-1.webp' },
  { id: 2, icon: '✨', color: '#FFD740', label: '全部スキル', photo: '/img/service/service-2.webp' },
  { id: 3, icon: '💎', color: '#B388FF', label: 'あなた専用', photo: '/img/service/service-3.webp' },
  { id: 4, icon: '⚡', color: '#69F0AE', label: 'あなたのペース', photo: '/img/service/service-4.webp' },
  { id: 5, icon: '🔄', color: '#82B1FF', label: '3つのモード', photo: '/img/service/service-5.webp' },
  { id: 6, icon: '🛡️', color: '#FFCC80', label: '生活まるごと', photo: '/img/service/service-6.webp' },
  { id: 7, icon: '🌳', color: '#A5D6A7', label: 'みんなが得する', photo: '/img/service/service-7.webp' },
];

export default function ServiceCards() {
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver で表示検出（GSAPの代わり）
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleFlip = (id: number) => {
    setActiveCard(id);
    setFlipped(prev => new Set(prev).add(id));
    window.dataLayer?.push({ event: 'service_card_flip', card_id: id, card_label: CARDS.find(c => c.id === id)?.label });
  };

  return (
    <Box ref={containerRef} sx={{ position: 'relative', minHeight: { xs: 400, md: 520 }, my: 6 }}>
      <Typography variant="h6" sx={{ textAlign: 'center', mb: 1, fontWeight: 700 }}>SKILL60+ でできること</Typography>
      <Typography variant="body2" sx={{ textAlign: 'center', mb: 4, color: 'text.secondary' }}>カードに触ると、7つの特長が見えます</Typography>

      {/* ★ Cash App風カードファンコンテナ */}
      <Box className={`card-fan-container ${visible ? 'card-fan-visible' : ''}`}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center',
              position: 'relative', height: { xs: 320, md: 450 }, perspective: '1200px' }}>
        {CARDS.map((card, i) => {
          const total = CARDS.length;
          const mid = (total - 1) / 2;
          const idx = i - mid; // -3, -2, -1, 0, 1, 2, 3
          return (
            <Box key={card.id}
              className="card-fan-item"
              onClick={() => handleFlip(card.id)}
              sx={{
                '--fan-index': idx,
                position: 'absolute',
                width: { xs: 100, md: 150 }, height: { xs: 140, md: 210 },
                cursor: 'pointer',
                transformStyle: 'preserve-3d',
                transformOrigin: 'bottom center',
                // 扇形展開: CSS変数でカード毎の角度を計算
                transition: 'transform 0.5s cubic-bezier(0.22, 0.61, 0.36, 1), box-shadow 0.3s ease',
                zIndex: activeCard === card.id ? 10 : total - Math.abs(i - mid),
              } as React.CSSProperties}>
              {/* 表面 */}
              <Box sx={{
                position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                background: `linear-gradient(135deg, ${card.color}, ${card.color}dd)`,
                borderRadius: 2.5, p: 2,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', boxShadow: 3,
                transform: flipped.has(card.id) ? 'rotateY(180deg)' : 'rotateY(0deg)',
                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              }}>
                <Typography sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, mb: 1 }}>{card.icon}</Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, fontSize: { xs: '0.7rem', md: '0.8rem' } }}>{card.label}</Typography>
              </Box>
              {/* 裏面 */}
              <Box sx={{
                position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                borderRadius: 2.5, overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                transform: flipped.has(card.id) ? 'rotateY(0deg)' : 'rotateY(-180deg)',
                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              }}>
                <Box component="img" src={card.photo} alt={card.label}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* 拡大モーダル */}
      {activeCard && flipped.has(activeCard) && (
        <Box onClick={() => setActiveCard(null)} sx={{
          position: 'fixed', inset: 0, zIndex: 1200,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <Box component="img" src={CARDS.find(c => c.id === activeCard)?.photo}
            alt={CARDS.find(c => c.id === activeCard)?.label}
            sx={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: 3,
                  boxShadow: '0 8px 40px rgba(0,0,0,0.4)' }} />
        </Box>
      )}
    </Box>
  );
}
```

---

## Agent-2: MemoryCards.tsx

**作成:** `src/app/lp/components/MemoryCards.tsx`

ヨシコの67年間を描いた8枚のカード。**Cash App風CSSカードファン**。GSAPなし。
全めくりでCTA。

```tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';

interface MemoryCard { id: number; era: string; icon: string; color: string; label: string; photo: string; voice: string; }

const CARDS: MemoryCard[] = [
  { id: 1, era: '1958-1964', icon: '🎒', color: '#F8BBD0', label: '幼少期', photo: '/img/memory/card-1.webp', voice: '/audio/yoshiko-memory-1.mp3' },
  { id: 2, era: '1973-1976', icon: '📚', color: '#B3E5FC', label: '学生時代', photo: '/img/memory/card-2.webp', voice: '/audio/yoshiko-memory-2.mp3' },
  { id: 3, era: '1976-1981', icon: '💼', color: '#FFE0B2', label: '就職', photo: '/img/memory/card-3.webp', voice: '/audio/yoshiko-memory-3.mp3' },
  { id: 4, era: '1981-1986', icon: '👶', color: '#C8E6C9', label: '結婚・子育て', photo: '/img/memory/card-4.webp', voice: '/audio/yoshiko-memory-4.mp3' },
  { id: 5, era: '1991-1997', icon: '🏢', color: '#FFD54F', label: 'バブル崩壊', photo: '/img/memory/card-5.webp', voice: '/audio/yoshiko-memory-5.mp3' },
  { id: 6, era: '1995-2011', icon: '🕯️', color: '#CE93D8', label: '試練', photo: '/img/memory/card-6.webp', voice: '/audio/yoshiko-memory-6.mp3' },
  { id: 7, era: '2020-2023', icon: '🌅', color: '#F48FB1', label: '再出発', photo: '/img/memory/card-7.webp', voice: '/audio/yoshiko-memory-7.mp3' },
  { id: 8, era: '2025-', icon: '✨', color: '#E67E22', label: '今のヨシコ', photo: '/img/memory/card-8.webp', voice: '/audio/yoshiko-memory-8.mp3' },
];

export default function MemoryCards({ onChatbotOpen }: { onChatbotOpen: () => void }) {
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const allFlipped = flipped.size === 8;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleFlip = (id: number) => {
    setActiveCard(id);
    setFlipped(prev => new Set(prev).add(id));
    try {
      const saved = sessionStorage.getItem('skill60-accessibility');
      const textOnly = saved ? JSON.parse(saved).textOnly : false;
      if (!textOnly) { const c = CARDS.find(c => c.id === id); if (c?.voice) new Audio(c.voice).play().catch(() => {}); }
    } catch {}
    window.dataLayer?.push({ event: 'memory_card_flip', card_id: id, card_label: CARDS.find(c => c.id === id)?.label });
  };

  useEffect(() => { if (allFlipped) window.dataLayer?.push({ event: 'memory_cards_all_flipped' }); }, [allFlipped]);

  return (
    <Box ref={containerRef} sx={{ position: 'relative', minHeight: { xs: 420, md: 540 }, my: 6 }}>
      <Typography variant="h6" sx={{ textAlign: 'center', mb: 1, fontWeight: 700 }}>ヨシコの思い出</Typography>
      <Typography variant="body2" sx={{ textAlign: 'center', mb: 4, color: 'text.secondary' }}>カードに触ると、ヨシコの67年間が見えます</Typography>

      <Box className={`card-fan-container ${visible ? 'card-fan-visible' : ''}`}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center',
              position: 'relative', height: { xs: 340, md: 460 }, perspective: '1200px' }}>
        {CARDS.map((card, i) => {
          const total = CARDS.length;
          const mid = (total - 1) / 2;
          const idx = i - mid;
          return (
            <Box key={card.id}
              className="card-fan-item"
              onClick={() => handleFlip(card.id)}
              sx={{
                '--fan-index': idx,
                position: 'absolute',
                width: { xs: 90, md: 140 }, height: { xs: 126, md: 196 },
                cursor: 'pointer', transformStyle: 'preserve-3d', transformOrigin: 'bottom center',
                transition: 'transform 0.5s cubic-bezier(0.22, 0.61, 0.36, 1), box-shadow 0.3s ease',
                zIndex: activeCard === card.id ? 10 : total - Math.abs(i - mid),
              } as React.CSSProperties}>
              <Box sx={{
                position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                background: `linear-gradient(135deg, ${card.color}, ${card.color}dd)`,
                borderRadius: 2.5, p: 1.5,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', boxShadow: 3,
                transform: flipped.has(card.id) ? 'rotateY(180deg)' : 'rotateY(0deg)',
                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              }}>
                <Typography sx={{ fontSize: { xs: '1.8rem', md: '2.2rem' }, mb: 0.5 }}>{card.icon}</Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, fontSize: { xs: '0.6rem', md: '0.7rem' } }}>{card.era}</Typography>
                <Typography variant="caption" sx={{ fontSize: { xs: '0.55rem', md: '0.65rem' }, mt: 0.3 }}>{card.label}</Typography>
              </Box>
              <Box sx={{
                position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                borderRadius: 2.5, overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                transform: flipped.has(card.id) ? 'rotateY(0deg)' : 'rotateY(-180deg)',
                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              }}>
                <Box component="img" src={card.photo} alt={card.label}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
            </Box>
          );
        })}
      </Box>

      {activeCard && flipped.has(activeCard) && (
        <Box onClick={() => setActiveCard(null)} sx={{
          position: 'fixed', inset: 0, zIndex: 1200, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Box component="img" src={CARDS.find(c => c.id === activeCard)?.photo}
            alt={CARDS.find(c => c.id === activeCard)?.label}
            sx={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: 3, boxShadow: '0 8px 40px rgba(0,0,0,0.4)' }} />
        </Box>
      )}

      {allFlipped && (
        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2, color: 'text.secondary' }}>「ね、同じ時代を歩いてきたでしょう？」</Typography>
          <Button variant="contained" size="large" onClick={onChatbotOpen}
            sx={{ borderRadius: 8, px: 4, py: 1.5, fontSize: '1rem', bgcolor: '#E67E22', '&:hover': { bgcolor: '#D35400' } }}>
            ヨシコに自分の話もしてみる
          </Button>
        </Box>
      )}
    </Box>
  );
}
```

---

## Agent-3: useAccessibility.ts

**作成:** `src/app/lp/hooks/useAccessibility.ts`

即時カスタム3機能の統合フック。メッセージ解析でトリガー検出→即時反映。

```tsx
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
```

---

## Agent-4: FontSizeControl.tsx

**作成:** `src/app/lp/components/FontSizeControl.tsx`

右上固定。フォント3段階切替ボタン。

```tsx
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
    <Box sx={{position:'fixed',top:16,right:16,zIndex:1300,display:'flex',alignItems:'center',gap:0.5,
      bgcolor:'rgba(255,255,255,0.95)',borderRadius:2,px:1.5,py:0.5,boxShadow:1,border:'1px solid #e0e0e0'}}>
      <IconButton onClick={cycle} size="small" aria-label="文字サイズ変更">
        <Typography sx={{fontWeight:700,fontSize:'1.1rem',lineHeight:1}}>A<span style={{fontSize:size==='standard'?'0.7rem':size==='large'?'0.9rem':'1.1rem'}}>A</span></Typography>
      </IconButton>
      <Typography variant="caption" sx={{fontSize:'0.65rem',color:'text.secondary',minWidth:24}}>{LABELS[size]}</Typography>
    </Box>
  );
}
```

---

## Agent-5: ButtonModeChat.tsx

**作成:** `src/app/lp/components/ButtonModeChat.tsx`

入力苦手な人向け選択肢UI。3ステップ→LINE誘導。

```tsx
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
```

---

## Agent-6: LpChatbot.tsx 大幅修正

**上書き:** `src/app/lp/components/LpChatbot.tsx`
**依存:** Agent-3, Agent-5

核心修正: 声で聞く修正、ヨシコUI、ブラウザTTS無効、即時カスタム統合、イベント受信、**onBeforeSendフックでAIChatWidgetに即時カスタム注入**

```tsx
'use client';
import { useState, useEffect } from 'react';
import { Box, Button, Typography, IconButton, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AIChatWidget from '@/app/components/AIChatWidget';
import { useAccessibility } from '../hooks/useAccessibility';
import ButtonModeChat from './ButtonModeChat';

const LINE_URL = 'https://line.me/R/ti/p/YOUR_LINE_ID';

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

  // ★ AIChatWidgetに渡すonBeforeSendフック
  // ユーザーの入力を即時カスタムトリガーと照合し、
  // 該当すればAPIに送信せずフォントサイズ等を即座に変更してヨシコの応答を返す
  const handleBeforeSend = (message: string): { handled: boolean; response?: string } => {
    const result = a11y.checkMessage(message);
    if (result.handled) {
      window.dataLayer?.push({ event: 'instant_custom', type: result.type });
      return { handled: true, response: result.response };
    }
    return { handled: false };
  };

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
            {a11y.buttonMode ? (
              <ButtonModeChat onLineRedirect={handleLine} />
            ) : (
              <AIChatWidget onBeforeSend={handleBeforeSend} />
            )}
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
```

---

## Agent-7: MeetSection.tsx

**修正:** `src/app/lp/components/MeetSection.tsx`

```
1. import ServiceCards from './ServiceCards'; を先頭に追加
2. h2「あなたと同い年の...」の直後に <ServiceCards /> を挿入
3. 他は変更しない
```

---

## Agent-8: StoriesSection.tsx

**修正:** `src/app/lp/components/StoriesSection.tsx`

```
1. import MemoryCards from './MemoryCards'; を先頭に追加
2. h2「こんな方が...」の直後に追加:
   <MemoryCards onChatbotOpen={() => window.dispatchEvent(new CustomEvent('open-yoshiko-chat'))} />
3. 他は変更しない
```

---

## Agent-9: page.tsx + CSS

**修正:** `src/app/lp/page.tsx`
```
1. import FontSizeControl from './components/FontSizeControl'; を追加
2. return先頭に <FontSizeControl /> を追加
```

**追加CSS:** globals.css（lp.module.cssではなくglobals.cssに追加。bodyクラスやグローバルアニメーションのため）:

```css
/* ========== CARD FAN ANIMATION (Cash App Style) ========== */
/* 初期状態: カードはスタック（重なった状態） */
.card-fan-container .card-fan-item {
  transform: rotateZ(0deg) translateY(0px);
  opacity: 0;
}

/* スクロールで表示後: カードが扇形に展開 */
.card-fan-container.card-fan-visible .card-fan-item {
  opacity: 1;
  transform:
    rotateZ(calc(var(--fan-index) * 8deg))
    translateY(calc(var(--fan-index) * var(--fan-index) * -3px));
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
}

/* ホバー/タップで個別カードが浮き上がる */
.card-fan-container .card-fan-item:hover {
  transform:
    rotateZ(calc(var(--fan-index) * 8deg))
    translateY(calc(var(--fan-index) * var(--fan-index) * -3px - 20px))
    translateZ(40px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.2);
  z-index: 20 !important;
}

/* 展開トランジション: stagger風にdelayを付与 */
.card-fan-container.card-fan-visible .card-fan-item:nth-child(1) { transition-delay: 0s; }
.card-fan-container.card-fan-visible .card-fan-item:nth-child(2) { transition-delay: 0.06s; }
.card-fan-container.card-fan-visible .card-fan-item:nth-child(3) { transition-delay: 0.12s; }
.card-fan-container.card-fan-visible .card-fan-item:nth-child(4) { transition-delay: 0.18s; }
.card-fan-container.card-fan-visible .card-fan-item:nth-child(5) { transition-delay: 0.24s; }
.card-fan-container.card-fan-visible .card-fan-item:nth-child(6) { transition-delay: 0.30s; }
.card-fan-container.card-fan-visible .card-fan-item:nth-child(7) { transition-delay: 0.36s; }
.card-fan-container.card-fan-visible .card-fan-item:nth-child(8) { transition-delay: 0.42s; }

/* モバイル: 扇の角度を狭く */
@media (max-width: 640px) {
  .card-fan-container.card-fan-visible .card-fan-item {
    transform:
      rotateZ(calc(var(--fan-index) * 6deg))
      translateY(calc(var(--fan-index) * var(--fan-index) * -2px));
  }
  .card-fan-container .card-fan-item:hover {
    transform:
      rotateZ(calc(var(--fan-index) * 6deg))
      translateY(calc(var(--fan-index) * var(--fan-index) * -2px - 15px))
      translateZ(30px);
  }
}

/* ========== 即時カスタム: フォントサイズ ========== */
:root { --fs-base:16px; --fs-large:20px; --fs-xlarge:24px; }
body.font-large, body.font-large p, body.font-large span, body.font-large button,
body.font-large input, body.font-large [class*="MuiTypography"], body.font-large [class*="MuiButton"]
{ font-size: var(--fs-large) !important; }
body.font-xlarge, body.font-xlarge p, body.font-xlarge span, body.font-xlarge button,
body.font-xlarge input, body.font-xlarge [class*="MuiTypography"], body.font-xlarge [class*="MuiButton"]
{ font-size: var(--fs-xlarge) !important; }
body.font-large h1{font-size:2rem!important} body.font-large h2{font-size:1.6rem!important}
body.font-xlarge h1{font-size:2.4rem!important} body.font-xlarge h2{font-size:2rem!important}

/* ========== 減速モーション対応 ========== */
@media(prefers-reduced-motion:reduce){
  .card-fan-item{opacity:1!important;transform:none!important;transition:none!important}
}
```

---

## Agent-10: ビルド + テスト

```bash
npm run build  # エラーあれば修正
```

チェックリスト:
- [ ] ServiceCards 7枚がスクロールでCash App風に扇形展開+ホバーで浮き上がり+めくり+拡大
- [ ] MemoryCards 8枚がスクロールでCash App風に扇形展開+ホバーで浮き上がり+めくり+拡大+全めくりCTA
- [ ] アニメーションにGSAPもFramer Motionも使っていないこと（純粋CSS + IntersectionObserverのみ）
- [ ] CHATBOT「ヨシコ（68歳）」ヘッダー（AIキャリア相談ではない）
- [ ] ブラウザTTS無効
- [ ] フォントサイズ3段階切替（右上ボタン）
- [ ] CHATBOT内で「文字を大きくして」→ 実際にフォント変更+ヨシコ応答（APIに送信されない）
- [ ] CHATBOT内で「ボタンがいい」→ ボタンモードに切替
- [ ] CHATBOT内で「耳が遠い」→ テキストモードに切替
- [ ] LP以外の通常CHATBOT画面が今まで通り動くこと（onBeforeSend未指定で影響なし）
- [ ] 375px幅で崩れない

**完成の定義:** 上記全て✅ + `npm run build` エラーなし + 即時カスタム3機能がCHATBOT内で動作
