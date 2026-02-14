# カードファンアニメーション移植指示書

## 状況
- トップページ（`localhost:3000`）のHeroSectionに **Cash App風カードファン** がある
- Cash Cardのデザイン（緑色のクレジットカード画像）がそのまま表示されている
- これは本来 **ServiceCards（7つの世界観）** と **MemoryCards（ヨシコの8つの思い出）** に適用すべきアニメーション

## ゴール
1. Cash Cardの画像とコンポーネントを **削除**
2. カードファンの **スクロール連動展開アニメーション** を ServiceCards / MemoryCards に移植
3. カードの中身を SKILL60+ のコンテンツに変更

## ★ 絶対禁止
- `AIChatWidget.tsx` を変更するな（onBeforeSend対応済み）
- `src/app/api/chat/route.ts` を変更するな
- Framer Motion を使うな
- Cash Card の画像やデザインを残すな

---

## Step 1: 現在のカードファンCSS・コードを特定

ローカルのファイルを確認:
```bash
# カードファンのコードがどこにあるか特定
grep -rn "card-fan\|CardFan\|Cash Card\|cash-card" src/ --include="*.tsx" --include="*.css"
grep -rn "card-fan\|CardFan" src/app/globals.css
```

見つかったファイルの **CSSアニメーション部分だけ** を残し、Cash Card固有の部分を削除する。

---

## Step 2: HeroSectionからCash Cardを削除

`src/app/components/HeroSection.tsx` を編集:
- Cash Cardの画像（`<img>` や `<Box component="img">`）を削除
- CardFanコンポーネントの呼び出しを削除
- テキスト・CTAボタンはそのまま残す

---

## Step 3: ServiceCards.tsx を作成

**作成先:** `src/app/lp/components/ServiceCards.tsx`
（`src/app/lp/` ディレクトリがなければ作成）

Cash Cardから移植した **スクロール連動カードファンアニメーション** を使い、
SKILL60+の7つの世界観をカードで表示する。

### 構造

```
<section style="height: 200vh">     ← スクロール領域
  <div style="position: sticky">    ← ビューポートに固定
    <div class="card-fan-container"> ← カード群
      <div class="card-fan-item">   ← 各カード（7枚）
```

### カードの中身（Cash Cardではなく以下）

| # | アイコン | ラベル | 色 | 裏面画像 |
|:--|:--|:--|:--|:--|
| 1 | 🤝 | AIの友人 | #FF8A80 | /img/service/service-1.webp |
| 2 | ✨ | 全部スキル | #FFD740 | /img/service/service-2.webp |
| 3 | 💎 | あなた専用 | #B388FF | /img/service/service-3.webp |
| 4 | ⚡ | あなたのペース | #69F0AE | /img/service/service-4.webp |
| 5 | 🔄 | 3つのモード | #82B1FF | /img/service/service-5.webp |
| 6 | 🛡️ | 生活まるごと | #FFCC80 | /img/service/service-6.webp |
| 7 | 🌳 | みんなが得する | #A5D6A7 | /img/service/service-7.webp |

### アニメーション仕様

**スクロール連動展開（Cash Cardから移植するアニメーションの動き）:**
- 初期状態: カードがスタック（重なった状態）
- スクロールに連動して: 徐々にトランプのように扇形に展開
- 上にスクロールすると: 閉じる（可逆）
- 個別ホバー: カードが浮き上がる

**実装方法（優先順）:**
1. 現在のCash Cardで使われている方式をそのまま流用（GSAPのScrollTrigger scrub等）
2. もし純粋CSSで書かれているなら `animation-timeline: scroll()` に変換

**各カードの展開角度:**
```
カード1: rotateZ(-18deg)  ← 一番左
カード2: rotateZ(-12deg)
カード3: rotateZ(-6deg)
カード4: rotateZ(0deg)    ← 中央
カード5: rotateZ(6deg)
カード6: rotateZ(12deg)
カード7: rotateZ(18deg)   ← 一番右
```

**transform-origin:** `bottom center`（扇の軸は下端中央）

### タップ/クリック動作
- カードをタップ → 裏返す（rotateY 180deg）
- 裏面に画像（service-1〜7.webp）が表示
- もう一度タップ → 画像を拡大表示（モーダル）

### コード

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

// ★ 展開角度の計算
const FAN_ANGLES = [-18, -12, -6, 0, 6, 12, 18];
const FAN_Y_OFFSETS = [-8, -4, -1, 0, -1, -4, -8]; // 弧を描くY位置

export default function ServiceCards() {
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // ★ スクロール連動: Cash Cardと同じ方式で展開
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / sectionHeight));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFlip = (id: number) => {
    setActiveCard(id);
    setFlipped(prev => new Set(prev).add(id));
  };

  return (
    <Box component="section" ref={sectionRef} sx={{ height: '200vh', position: 'relative' }}>
      <Box sx={{
        position: 'sticky', top: 0, height: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          SKILL60+ でできること
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
          カードに触ると、7つの特長が見えます
        </Typography>

        {/* カードファンコンテナ */}
        <Box sx={{
          position: 'relative',
          width: { xs: 280, md: 400 },
          height: { xs: 350, md: 480 },
          perspective: '1200px',
        }}>
          {CARDS.map((card, i) => {
            // スクロール量に応じて角度を0→目標値に補間
            const targetAngle = FAN_ANGLES[i];
            const targetY = FAN_Y_OFFSETS[i];
            const currentAngle = targetAngle * scrollProgress;
            const currentY = targetY * scrollProgress;

            return (
              <Box key={card.id}
                onClick={() => handleFlip(card.id)}
                sx={{
                  position: 'absolute',
                  width: { xs: 160, md: 220 },
                  height: { xs: 224, md: 310 },
                  left: '50%',
                  bottom: 20,
                  marginLeft: { xs: '-80px', md: '-110px' },
                  cursor: 'pointer',
                  transformStyle: 'preserve-3d',
                  transformOrigin: 'bottom center',
                  transform: `rotateZ(${currentAngle}deg) translateY(${currentY}px)`,
                  transition: 'box-shadow 0.3s ease',
                  zIndex: activeCard === card.id ? 20 : 7 - Math.abs(i - 3),
                  boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                  '&:hover': {
                    boxShadow: '0 12px 35px rgba(0,0,0,0.25)',
                    zIndex: '20 !important',
                  },
                }}>
                {/* 表面 */}
                <Box sx={{
                  position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                  background: `linear-gradient(135deg, ${card.color}, ${card.color}dd)`,
                  borderRadius: 3, p: 2,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  transform: flipped.has(card.id) ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                }}>
                  <Typography sx={{ fontSize: { xs: '2.5rem', md: '3rem' }, mb: 1 }}>
                    {card.icon}
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: { xs: '0.8rem', md: '0.95rem' } }}>
                    {card.label}
                  </Typography>
                </Box>
                {/* 裏面 */}
                <Box sx={{
                  position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                  borderRadius: 3, overflow: 'hidden',
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
      </Box>

      {/* 拡大モーダル */}
      {activeCard && flipped.has(activeCard) && (
        <Box onClick={() => setActiveCard(null)} sx={{
          position: 'fixed', inset: 0, zIndex: 1200,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <Box component="img"
            src={CARDS.find(c => c.id === activeCard)?.photo}
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

## Step 4: MemoryCards.tsx を作成

`src/app/lp/components/MemoryCards.tsx` を同じパターンで作成。
ServiceCards.tsx のコードをコピーし、以下を変更:

- カード枚数: 7 → 8
- 展開角度: `[-21, -15, -9, -3, 3, 9, 15, 21]`
- カードデータ:

| # | icon | era | label | color | photo |
|:--|:--|:--|:--|:--|:--|
| 1 | 🎒 | 1958-1964 | 幼少期 | #F8BBD0 | /img/memory/card-1.webp |
| 2 | 📚 | 1973-1976 | 学生時代 | #B3E5FC | /img/memory/card-2.webp |
| 3 | 💼 | 1976-1981 | 就職 | #FFE0B2 | /img/memory/card-3.webp |
| 4 | 👶 | 1981-1986 | 結婚・子育て | #C8E6C9 | /img/memory/card-4.webp |
| 5 | 🏢 | 1991-1997 | バブル崩壊 | #FFD54F | /img/memory/card-5.webp |
| 6 | 🕯️ | 1995-2011 | 試練 | #CE93D8 | /img/memory/card-6.webp |
| 7 | 🌅 | 2020-2023 | 再出発 | #F48FB1 | /img/memory/card-7.webp |
| 8 | ✨ | 2025- | 今のヨシコ | #E67E22 | /img/memory/card-8.webp |

- 全めくり完了時にCTAボタン表示:「ヨシコに自分の話もしてみる」

---

## Step 5: globals.css にカードファンCSSを追加（なければ）

Cash Card用のCSSが既にあれば、クラス名をそのまま流用。
なければ以下を追加:

```css
/* ========== 即時カスタム: フォントサイズ変更 ========== */
:root { --fs-base: 16px; --fs-large: 20px; --fs-xlarge: 24px; }

body.font-large p, body.font-large span, body.font-large button,
body.font-large input, body.font-large textarea,
body.font-large [class*="MuiTypography"],
body.font-large [class*="MuiButton"],
body.font-large [class*="MuiInputBase"] {
  font-size: var(--fs-large) !important;
}
body.font-large h1 { font-size: 2rem !important; }
body.font-large h2 { font-size: 1.6rem !important; }

body.font-xlarge p, body.font-xlarge span, body.font-xlarge button,
body.font-xlarge input, body.font-xlarge textarea,
body.font-xlarge [class*="MuiTypography"],
body.font-xlarge [class*="MuiButton"],
body.font-xlarge [class*="MuiInputBase"] {
  font-size: var(--fs-xlarge) !important;
}
body.font-xlarge h1 { font-size: 2.4rem !important; }
body.font-xlarge h2 { font-size: 2rem !important; }
```

---

## Step 6: 確認

```bash
npm run build
npm run dev
```

チェック:
- [ ] `localhost:3000` に Cash Card が **表示されない**
- [ ] ServiceCards がスクロール連動で扇形展開する
- [ ] カードタップでめくれる
- [ ] 裏面に画像が表示される
- [ ] 「文字を大きくして」でフォントサイズが変わる
- [ ] 375px幅で崩れない
