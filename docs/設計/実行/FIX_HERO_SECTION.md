# 🔴 緊急修正指示: ヒーローセクション空白問題

## 問題

`localhost:3000/lp` のヒーローセクション（Section 1）が空白になっている。
CTAボタン「3分で、あなたの"すごいところ"がわかります」と
サブテキスト「LINEでかんたん・3分で完了・ずっと無料」だけが下部に表示され、
h1/pテキスト4行が見えない。

## 原因（2パターン両方を確認して修正すること）

### パターンA: HTMLが出力されていない

HeroSection.tsx に以下の4行のテキストが存在しない可能性がある。

**修正:** HeroSection.tsx に以下の4行を追加する。

```tsx
<h1 className="hero-line-1">60年間、頑張ってきたあなたへ。</h1>
<p className="hero-line-2">定年後、こんなモヤモヤを抱えていませんか？</p>
<p className="hero-line-3">&quot;自分の経験なんて、もう誰にも必要とされない&quot;</p>
<p className="hero-line-4">——そんなことはありません。</p>
```

これらはCTAボタンの**上**に配置する。順番を守ること。

### パターンB: CSSアニメーションの opacity: 0 が解除されていない

Build Orderの仕様では、hero-line-1〜4 は以下のCSSで初期状態 `opacity: 0` にし、
`bubble-in` アニメーションで `opacity: 1` にフェードインする設計。

```css
#hero .hero-line-1 { opacity: 0; animation: bubble-in 0.8s ease-out 0.3s forwards; }
#hero .hero-line-2 { opacity: 0; animation: bubble-in 0.6s ease-out 1.2s forwards; }
#hero .hero-line-3 { opacity: 0; animation: bubble-in 0.8s ease-out 2.2s forwards; }
#hero .hero-line-4 { opacity: 0; animation: bubble-in 0.6s ease-out 3.5s forwards; }
```

**確認ポイント:**
1. `@keyframes bubble-in` が定義されているか？
2. `forwards` が指定されているか？（なければアニメーション終了後に opacity: 0 に戻る）
3. セレクターが合っているか？（`#hero .hero-line-1` vs `.hero-line-1` など）
4. Next.js の CSS Modules を使っている場合、クラス名がハッシュ化されていないか？

**@keyframes bubble-in の定義（必須）:**
```css
@keyframes bubble-in {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

### パターンBの回避策（CSS Modules対応版）

Next.js + CSS Modules 環境では、クラス名がハッシュ化される。
`#hero .hero-line-1` のようなセレクターが効かない場合がある。

**推奨: インラインスタイル or sx で直接指定する**

```tsx
// HeroSection.tsx
'use client';
import { Box, Typography, Button } from '@mui/material';
import { keyframes } from '@mui/system';

const bubbleIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export default function HeroSection() {
  return (
    <Box
      component="section"
      id="hero"
      sx={{
        background: 'linear-gradient(165deg, #FEF9E7 0%, #FDEBD0 30%, #FAD7A0 60%, #F8C471 100%)',
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: 3,
        py: 8,
      }}
    >
      <Box sx={{ maxWidth: 720 }}>
        {/* ★ この4行が空白の原因。必ず存在すること ★ */}
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 2,
            opacity: 0,
            animation: `${bubbleIn} 0.8s ease-out 0.3s forwards`,
          }}
        >
          60年間、頑張ってきたあなたへ。
        </Typography>

        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            mb: 2,
            opacity: 0,
            animation: `${bubbleIn} 0.6s ease-out 1.2s forwards`,
          }}
        >
          定年後、こんなモヤモヤを抱えていませんか？
        </Typography>

        <Typography
          variant="h5"
          sx={{
            fontStyle: 'italic',
            fontWeight: 600,
            color: '#8B4513',
            mb: 2,
            opacity: 0,
            animation: `${bubbleIn} 0.8s ease-out 2.2s forwards`,
          }}
        >
          &ldquo;自分の経験なんて、もう誰にも必要とされない&rdquo;
        </Typography>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 6,
            opacity: 0,
            animation: `${bubbleIn} 0.6s ease-out 3.5s forwards`,
          }}
        >
          ——そんなことはありません。
        </Typography>

        {/* CTAボタン（これは既に表示されている） */}
        <Button
          variant="contained"
          size="large"
          href="https://line.me/R/ti/p/@skill60plus"
          sx={{
            bgcolor: '#E67E22',
            borderRadius: 8,
            px: 5,
            py: 2,
            fontSize: '1.1rem',
            fontWeight: 700,
            '&:hover': { bgcolor: '#D35400' },
            animation: `${bubbleIn} 0.6s ease-out 4.0s forwards`,
            opacity: 0,
          }}
        >
          3分で、あなたの&ldquo;すごいところ&rdquo;がわかります
        </Button>

        <Typography
          variant="body2"
          sx={{
            mt: 2,
            color: 'text.secondary',
            opacity: 0,
            animation: `${bubbleIn} 0.4s ease-out 4.3s forwards`,
          }}
        >
          LINEでかんたん・3分で完了・ずっと無料
        </Typography>
      </Box>
    </Box>
  );
}
```

## アニメーションのタイミング設計（ANIM-13: 共感の「間」）

| 要素 | 表示開始 | 意図 |
|:--|:--|:--|
| h1「60年間、頑張ってきたあなたへ。」 | 0.3秒後 | 最初に目に入る |
| p「定年後、こんなモヤモヤを〜」 | 1.2秒後 | h1の余韻の後 |
| p「"自分の経験なんて〜"」 | 2.2秒後 | **1.0秒の「間」**（本音を突きつける沈黙） |
| p「——そんなことはありません。」 | 3.5秒後 | **1.3秒の「間」**（救済の前の沈黙。ここが最重要） |
| CTAボタン | 4.0秒後 | 救済の言葉の直後 |
| サブテキスト | 4.3秒後 | 最後に補足 |

**★ line-2→line-3 の1.0秒の「間」と、line-3→line-4 の1.3秒の「間」が
このLPの感情設計の核心。この沈黙が心に残る。絶対に削るな。**

## ダークモード対応

```tsx
// sx に追加
'@media (prefers-color-scheme: dark)': {
  background: 'linear-gradient(165deg, #1A1A2E 0%, #16213E 30%, #0F3460 60%, #1B4F72 100%)',
}
```

## reduced-motion 対応

```tsx
// アニメーションを無効化してすべて即時表示
'@media (prefers-reduced-motion: reduce)': {
  opacity: '1 !important',
  animation: 'none !important',
}
```

## 確認手順

修正後、以下を確認すること:

1. [ ] `localhost:3000/lp` にアクセス
2. [ ] 0.3秒後に「60年間、頑張ってきたあなたへ。」が表示される
3. [ ] 1.2秒後に「定年後、こんなモヤモヤを〜」が表示される
4. [ ] 2.2秒後に「"自分の経験なんて〜"」が表示される（1.0秒の間の後）
5. [ ] 3.5秒後に「——そんなことはありません。」が表示される（1.3秒の間の後）
6. [ ] 4.0秒後にCTAボタンが表示される
7. [ ] スマホ幅（375px）でテキストが折り返しても読める
8. [ ] ダークモードで背景色が切り替わる
9. [ ] DevToolsで `prefers-reduced-motion: reduce` を有効にすると、全テキストが即時表示される
