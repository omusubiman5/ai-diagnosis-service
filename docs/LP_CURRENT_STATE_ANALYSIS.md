# SKILL60+ LP 現状分析レポート

## 1. プロジェクト概要

| 項目 | 設計書 | 実際 |
|:--|:--|:--|
| **Framework** | Next.js 15 | Next.js 16.1.6 |
| **UI Library** | MUI v6 | MUI v7.3.7 |
| **Animation** | Framer Motion のみ | GSAP + Framer Motion + Lottie + React Spring (4種全導入) |
| **Language** | TypeScript | TypeScript |
| **React** | - | React 19.2.3 |

## 2. セクション構成と実装状況

| セクション | ファイル | GSAP | React Spring | Lottie | Framer Motion | Voice |
|:--|:--|:--|:--|:--|:--|:--|
| Hero | `HeroSection.tsx` | ScrollTrigger + Timeline | - | - | - | speak() |
| Empathy | `EmpathySection.tsx` | - | カードhover | placeholder | - | - |
| Solution | `SolutionSection.tsx` | ScrollTrigger | - | - | - | - |
| Features | `FeaturesSection.tsx` | - | - | placeholder | - | onMouseEnter自動発動 |
| Steps | `StepsSection.tsx` | ScrollTrigger stagger | - | - | - | - |
| Trust | `TrustSection.tsx` | ScrollTrigger左右 | - | - | - | - |
| CTA | `CTASection.tsx` | - | hover scale | - | - | - |
| Footer | `Footer.tsx` | - | - | - | - | - |

## 3. 致命的なギャップ一覧

### A. Framer Motion: インストール済み・使用ゼロ

```json
// package.json に存在
"framer-motion": "^12.33.0"
```

全8コンポーネントで `import` すらされていない。過去KPT会議で「Motion.devでCTAボタンのwhileHover/whileTap/whileFocus」を最重要施策としたが、完全未実装。

### B. prefers-reduced-motion: 完全不在

CSS `@media (prefers-reduced-motion: reduce)` → ゼロ箇所
JS `window.matchMedia('(prefers-reduced-motion: reduce)')` → ゼロ箇所
`gsap.globalTimeline.clear()` による停止 → 未実装

### C. Voice Guide の問題

| 項目 | 推奨値 | 実装値 | 状態 |
|:--|:--|:--|:--|
| 音声速度 | 0.85 | 1.0 | 未対応 |
| Chunk分割 | 30秒(150文字)単位 | なし | 未実装 |
| ESCキー停止 | 必須 | なし | 未実装 |
| 自動発動禁止 | 手動のみ | FeaturesSection onMouseEnter | 逆パターン実装 |
| 音声中アニメ停止 | synth.onstart→gsap.pause() | なし | 未実装 |
| 進捗バー | utterance.onboundary | なし | 未実装 |
| VoiceControl | page.tsxに配置 | page.tsxに未import | 孤立コンポーネント |

### D. Lottie: プレースホルダーのみ

EmpathySection と FeaturesSection で使用されているが、中身は単純な円のストロークアニメーション。過去KPTで提案された「成長アイコン(緑の芽→木)」「チェックマーク+粒子エフェクト」等は未実装。

### E. Hero右カラム: 空

```tsx
<Grid size={{ xs: 12, md: 5 }} sx={{ display: { xs: 'none', md: 'block' } }}>
    {/* Visual content would go here */}
</Grid>
```

過去KPT最重要施策「68歳元経理部長の動画」が入るべき場所が完全に空。

## 4. 依存関係の健全性

| パッケージ | 用途 | 実使用 |
|:--|:--|:--|
| gsap + @gsap/react | ScrollTrigger | 4コンポーネントで使用 |
| @react-spring/web | 物理アニメ | 2コンポーネントで使用 |
| lottie-react | アイコンアニメ | 2コンポーネント(placeholder) |
| framer-motion | マイクロインタラクション | **未使用(dead dependency)** |
| react-hook-form | フォーム | **未使用(dead dependency)** |
| react-intersection-observer | 表示検知 | **未使用(dead dependency)** |

## 5. アクセシビリティ現状

| 基準 | 目標 | 現状 |
|:--|:--|:--|
| コントラスト比 | 7:1 (AAA) | 未検証 |
| タップターゲット | 56px | CTAボタン: 44px (MUI default) |
| prefers-reduced-motion | 完全対応 | ゼロ対応 |
| aria-label | 全インタラクティブ要素 | 部分的 |
| キーボードナビゲーション | Tab順序最適 | 未検証 |
| フォントサイズ | 24px基準 | 18px (body1) |
