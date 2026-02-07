# SKILL60+ LP 最強修正会議

> 前回KPT(総合診断)で**実装率17%・致命的問題12件**を検出。
> 本会議は「診断」ではなく「修正の設計図」を出す。全員コードを見ながら話す。

---

## 天才キャラ4人 (修正実行特化)

### 1. コンポーネント外科医 (Component Surgeon)
全13ファイルを1行ずつ開腹し、「切る・縫う・残す」を即断する。不要コードは容赦なく切除。中途半端なplaceholderは感染源と見なす。

> 「このLPには13ファイルある。そのうち**3ファイルにバグ**、**2ファイルに孤立コード**、**4ファイルにplaceholder**がある。外科手術に"来週"はない。」

### 2. アニメーション調律師 (Animation Harmonizer)
GSAP・React Spring・Framer Motion・Lottieの4ライブラリが衝突せず、各自の得意領域だけで動く"オーケストラ編成"を設計する。

> 「4つのアニメーションライブラリが同居しているのに、**指揮者がいない**。GSAPがバイオリンを弾きながらドラムも叩いている。React SpringとFramer Motionが同じパートを取り合っている。まず**楽譜**を書く。」

### 3. 60歳のリアル (The Real 60)
「自分は68歳、元経理部長。スマホはRakuten Hand。老眼鏡をかけて、朝の電車でこのLPを見る」という設定で、全セクションを上から順に体験してレビューする。

> 「テーマカラーやフォントサイズの話はもういい。私が知りたいのは**"このボタンを押したらどうなるの？"**、それだけだ。60年間の経験を"0円"から始めるカウンターを見て、気分がいいと思うか？」

### 4. ライブラリ裁判官 (Library Judge)
package.jsonの全依存を法廷に立たせ、「有罪(削除)」「無罪(残留)」「保護観察(条件付き残留)」の判決を下す。tree-shakingの幻想に騙されない。

> 「被告framer-motion、あなたはインストールされて以来**一度もimportされていない**。弁護人の"将来使う予定"という証言は採用しない。容量33KB、判決は——」

---

## KPT会議ダイアログ

### Keep (修正不要・触るな)

**コンポーネント外科医 (Keep1: 手術不要の健全臓器)**

「以下は健全。不用意に触れば逆に壊れる:」

| ファイル | 理由 |
|:--|:--|
| `layout.tsx` | SSR/CSR分離が正確。AppRouterCacheProvider配置も正しい。metadata日本語も合格 |
| `theme.ts` | カラー・フォント・ボタンスタイル全て設計書準拠。MUI7のcreateTheme構成も正しい |
| `Footer.tsx` | 静的コンポーネント。アニメーション不要。リンクのhref="#"は現時点で正しい仕様 |
| `StepsSection.tsx` | GSAP stagger実装が正確。duration 0.8s、stagger 0.3sはシニアに適正。ScrollTrigger start 70%も妥当 |

**60歳のリアル (Keep2: 心に刺さるコピー)**

「いくつかのコピーは残してほしい:」
- Hero: **「60年の経験は、まだ社会の宝だ。」** — これは刺さる。「まだ」が重要。自分の価値を疑っている人間にとって、この一言は救いになる
- Empathy: **「こんなモヤモヤ、抱えていませんか？」** — 「モヤモヤ」という曖昧さが逆にいい。「不安」と言われると身構えるが「モヤモヤ」なら素直に認められる
- Solution: **「経理一筋40年の経験が」** — 具体的な年数が信頼を作る。これは自分の話だと感じさせる

**アニメーション調律師 (Keep3: GSAPの正しい使い方)**

「以下のGSAP使用パターンは模範:」

```tsx
// StepsSection.tsx - これは正解
gsap.from(stepsRef.current, {
    y: 50, opacity: 0,
    duration: 0.8,        // 1秒以下 → 正しい
    stagger: 0.3,         // 順次表示 → 正しい
    ease: 'power3.out',   // 自然減衰 → 正しい
    scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 70%',  // スクロール発火 → 正しい(非FV要素)
    }
});
```

```tsx
// SolutionSection.tsx - Before→Afterスライドインも正解
gsap.fromTo(afterBoxRef.current,
    { opacity: 0, scale: 0.8, x: 50 },
    { opacity: 1, scale: 1, x: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: containerRef.current, start: 'top center',
        toggleActions: 'play none none reverse'  // reverse付き → 正しい
    }}
);
```

---

### Problem (ファイル別・行番号付き)

**コンポーネント外科医 (Problem1: 手術が必要な全箇所)**

#### 緊急度S: 今すぐ修正

| ファイル:行 | 症状 | 診断 |
|:--|:--|:--|
| `useVoiceGuide.tsx:58` | `utterance.rate = 1` | シニア最適は0.85。過去KPT全回で指摘済み |
| `useVoiceGuide.tsx:74-79` | `cancel()`がaudio.pauseのみ | `speechSynthesis.cancel()`が呼ばれない。音声停止が**実質機能しない** |
| `FeaturesSection.tsx:79` | `onMouseEnter={() => speak()}` | 自動音声発動。電車内で他人に丸聞こえ |
| `page.tsx` | VoiceControl未import | 音声コントロールUIが画面に存在しない |
| `HeroSection.tsx:27` | `repeat: -1, yoyo: true` | 永続ループGPUアニメ。バッテリー食い潰す |
| `HeroSection.tsx:41-42` | カウンターScrollTrigger | FV内要素なのにスクロール発火。初期値"0円" |

#### 緊急度A: 1週間以内

| ファイル:行 | 症状 | 診断 |
|:--|:--|:--|
| `HeroSection.tsx:121-123` | 右カラム空 | デスクトップ画面40%が空白 |
| `HeroSection.tsx:54-57` | CTA→alert() | ダイアログではなくブラウザalert。CTASectionではDialogを使っているのに不統一 |
| `EmpathySection.tsx:10-58` | Lottie placeholder (青円) | 意味のないアニメーション。ないほうがマシ |
| `FeaturesSection.tsx:9-58` | Lottie placeholder (緑円) | 同上 |
| `CTASection.tsx:10` | `useSpring({scale:1})` | scale:1→1.1のみ。whileTap/whileFocus不在。キーボードユーザー無視 |
| 全ファイル | prefers-reduced-motion | CSS/JSともにゼロ実装 |

---

**アニメーション調律師 (Problem2: 4ライブラリの衝突と役割不在)**

「現在の混乱状態:」

```
GSAP: Hero背景ループ + テキスト登場 + カウンター + Solution + Steps + Trust
      → 6箇所で使用。役割: スクロール連動 + 入場アニメ + 永続ループ(混在)

React Spring: Empathyカードhover + CTAボタンhover
      → 2箇所。役割: hover効果のみ

Lottie: Empathy + Features
      → 2箇所。役割: placeholder(機能していない)

Framer Motion: ゼロ箇所
      → インストール済み、未使用
```

「問題は**3つの領域で責任が曖昧**:」

| 領域 | 現担当 | 本来の最適解 |
|:--|:--|:--|
| **スクロール連動** | GSAP ScrollTrigger | GSAP (正しい) |
| **マイクロインタラクション** (hover/tap/focus) | React Spring + CSS transition (混在) | Framer Motion `whileHover/whileTap/whileFocus` **又は** React Spring統一 |
| **装飾アニメ** (アイコン、ローディング) | Lottie (placeholder) | Lottie (本物のJSON) **又は** CSSアニメで代替 |
| **入場アニメ** | GSAP timeline | GSAP (正しい) **又は** Framer Motion `whileInView` |

「React SpringとFramer Motionが**hover領域で競合**している。CTASection.tsxはReact Springの`useSpring`、HeroSection.tsxのボタンはCSS `transition: transform 0.2s`。同じ"ボタンhover"に2つの手法。**統一しなければ保守地獄**。」

---

**60歳のリアル (Problem3: 68歳としての体験レポート)**

「朝の電車。Rakuten Handで開いた:」

**Hero到達 (0秒):**
> 「60年の経験は、まだ社会の宝だ」— おっ、いい言葉だな。
> 推定市場価値... **0円〜** — は？ 0円？ 私の40年が0円？
> (スクロールしなければカウンターが動かない。最初に見える数字が"0")

**Empathy到達 (スクロール):**
> 孤独感、自信喪失、収入への不満 — わかる。でもこの**青い丸がくるくる回ってる**のは何？故障かと思った。

**Features到達 (さらにスクロール):**
> スクロールしただけで**突然声が鳴った**。電車で恥ずかしい。慌ててミュートにした。もう触りたくない。
> → **この時点で離脱**

「到達しなかったセクション: Steps, Trust, CTA。つまり**7セクション中4セクションが見られていない**。原因は Features の自動音声。」

---

**ライブラリ裁判官 (Problem4: 依存関係の判決)**

| 被告 | 罪状 | 現状 |
|:--|:--|:--|
| `framer-motion` (33KB) | 一度もimportされていない | インストール後放置 |
| `react-hook-form` (9KB) | フォームが存在しない | 将来用に先行インストール |
| `react-intersection-observer` (3KB) | 一度もimportされていない | GSAPのScrollTriggerと機能重複 |
| `@gsap/react` (2KB) | 正当に使用中 | useGSAP hook |
| `lottie-react` (15KB) | importされているがplaceholderのみ | 実質的に機能していない |

---

### Try (ファイル別修正設計図)

#### Try1: ライブラリ役割の確定宣言 [最優先]

**アニメーション調律師 (Try)**

「まずオーケストラの楽譜を決める。**二度と変えない**:」

```
┌─────────────────────────────────────────────────────┐
│           SKILL60+ アニメーション憲法                    │
├─────────────────────────────────────────────────────┤
│                                                       │
│  GSAP ScrollTrigger                                   │
│  ├─ スクロール連動アニメーション (入場・退場)              │
│  ├─ カウンターアニメーション                             │
│  └─ タイムラインシーケンス (Hero初回のみ)                │
│                                                       │
│  Framer Motion (motion.div / motion.button)            │
│  ├─ whileHover → ボタン・カードのhover全て               │
│  ├─ whileTap → タップフィードバック全て                  │
│  ├─ whileFocus → キーボードフォーカス全て                │
│  └─ whileInView → 軽量な表示時フェードイン              │
│                                                       │
│  React Spring → 削除                                  │
│  (理由: Framer Motionと役割100%重複)                    │
│                                                       │
│  Lottie → 保護観察                                    │
│  ├─ 本物のJSONアニメを用意できるなら残留                 │
│  └─ placeholderのままなら削除、MUIアイコンで代替          │
│                                                       │
└─────────────────────────────────────────────────────┘
```

**判決理由:**
- React Spring削除: CTAのhoverとEmpathyのhoverしか使っていない。Framer Motionの`whileHover/whileTap/whileFocus`で完全代替可能。2つ残すと「このhoverはどっちで実装？」という問いが永遠に続く
- Framer Motion採用: `whileFocus`がある。React Springにはない。**キーボードナビゲーションのシニアを救える唯一のライブラリ**

---

#### Try2: useVoiceGuide 全面書き直し [緊急S]

**コンポーネント外科医 (Try)**

「現在のuseVoiceGuideは5つのバグを抱えている。パッチではなく全面書き直し:」

```typescript
// 現在の致命的バグ:
// 1. rate=1.0 (シニアには速すぎる)
// 2. cancel()がspeechSynthesis.cancel()を呼ばない
// 3. ESCキー停止なし
// 4. Chunk分割なし
// 5. audio state が使われていないのに残っている (dead code)

// 修正後の設計:
export const useVoiceGuide = () => {
  // state
  isPlaying: boolean
  progress: number (0-100)

  // methods
  speak(text: string): void
    → speechSynthesis.cancel() → chunk分割(150文字) → rate=0.85 → 順次再生
  cancel(): void
    → speechSynthesis.cancel() → state reset

  // effects
  ESCキー → cancel()
  unmount → cancel()

  // 削除するもの
  audio state (HTMLAudioElement) → 未使用dead code
  messageKey引数 → textMapは外部に移動
};
```

---

#### Try3: HeroSection 4箇所同時修正 [緊急S]

**60歳のリアル (Try)**

「Heroの"0円"問題は最優先。私が朝の電車で見ても気分が良くなる修正:」

```
修正1: 背景ループ削除
  HeroSection.tsx:25-28
  before: repeat: -1, yoyo: true (永続ループ)
  after:  CSSグラデーション固定 + GSAP初回フェードインのみ(1回)

修正2: カウンター即時発火
  HeroSection.tsx:36-51
  before: ScrollTrigger start: 'top 80%' (スクロール依存)
  after:  タイムライン内で delay:1.5 後に発火(FVで確実に動く)
  + snap: { innerText: 1000 } (千円刻みで見やすく)

修正3: CTA alert→Dialog
  HeroSection.tsx:54-57
  before: alert('Coming Soon!')
  after:  CTASection.tsxと同じDialogパターンに統一

修正4: 右カラムにコンテンツ配置
  HeroSection.tsx:121-123
  before: {/* Visual content would go here */}
  after:  成功事例サマリーカード or 信頼指標(診断済み人数、満足度)
```

---

#### Try4: FeaturesSection 自動音声削除 + Lottie判定 [緊急S]

**コンポーネント外科医 (Try)**

```
修正1: 自動音声削除
  FeaturesSection.tsx:79
  before: <Box ... onMouseEnter={() => speak('features_intro')}>
  after:  <Box ... >  (onMouseEnter削除)

修正2: useVoiceGuide import削除
  FeaturesSection.tsx:6 (onMouseEnter削除後、speakの呼び出し箇所がゼロになる)
  before: import { useVoiceGuide } from '../hooks/useVoiceGuide';
  after:  削除

修正3: Lottie placeholder判定
  FeaturesSection.tsx:9-58 / EmpathySection.tsx:10-58
  選択肢A: 本物のLottie JSONを用意する → public/animations/に配置
  選択肢B: placeholderを削除 → MUI Iconsで代替
    '3分で完了' → <AccessTimeIcon sx={{ fontSize: 80 }} />
    'AI×キャリア理論' → <PsychologyIcon sx={{ fontSize: 80 }} />
    '具体的な数値' → <TrendingUpIcon sx={{ fontSize: 80 }} />
```

---

#### Try5: page.tsx にVoiceControl統合 [緊急S]

**コンポーネント外科医 (Try)**

```
page.tsx 修正:
  import VoiceControl from './components/VoiceControl';

  <Box component="main">
    <HeroSection />
    <EmpathySection />
    ...
    <Footer />
    <VoiceControl />   ← 追加 (fixed position なので最後でOK)
  </Box>
```

---

#### Try6: prefers-reduced-motion 全面対応 [緊急S]

**アニメーション調律師 (Try)**

```
新規ファイル: hooks/useReducedMotion.ts
  → window.matchMedia('(prefers-reduced-motion: reduce)')
  → 変更イベント監視

適用対象:
  HeroSection.tsx   → useGSAP内で reduced なら timeline不実行
  SolutionSection.tsx → 同上
  StepsSection.tsx   → 同上
  TrustSection.tsx   → 同上
  EmpathySection.tsx → Framer Motion移行時に animate={reduced ? {} : ...}
  CTASection.tsx     → 同上

新規CSS (globals.css復活 or layout.tsxにインライン):
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
```

---

#### Try7: React Spring → Framer Motion 移行 [優先A]

**ライブラリ裁判官 (Try)**

```
EmpathySection.tsx WorryCard:
  before: useSpring + animated.div + onMouseEnter/Leave
  after:  motion.div whileHover={{ scale: 1.05, boxShadow: '...' }}
          + whileFocus={{ outline: '3px solid #32CD32' }}

CTASection.tsx AnimatedButton:
  before: useSpring + animated(Button) + onMouseEnter/Leave
  after:  motion(Button) whileHover={{ scale: 1.1 }}
          + whileTap={{ scale: 0.95 }}
          + whileFocus={{ outline: '3px solid #32CD32' }}

HeroSection.tsx CTAボタン:
  before: CSS transition: transform 0.2s + &:hover scale(1.05)
  after:  motion(Button) whileHover/whileTap/whileFocus 統一

完了後:
  npm uninstall @react-spring/web
```

---

#### Try8: Dead Dependency 清掃 [優先A]

**ライブラリ裁判官 (Try)**

```bash
# 即日判決
npm uninstall react-hook-form         # フォーム未実装、再必要時に再install
npm uninstall react-intersection-observer  # GSAP ScrollTriggerと完全重複

# React Spring移行完了後
npm uninstall @react-spring/web       # Framer Motionに統一完了後

# Lottie判定後 (本物JSON未準備なら)
npm uninstall lottie-react            # MUI Iconsで代替した場合
```

---

## 会議内容の構造化整理

### 1. 修正実行ロードマップ

```
━━━ Phase 0: 即時修正 (30分以内) ━━━━━━━━━━━━━━━━━━

  [0-1] useVoiceGuide.tsx  rate 1→0.85 (1行)
  [0-2] useVoiceGuide.tsx  cancel()にspeechSynthesis.cancel()追加
  [0-3] FeaturesSection.tsx  onMouseEnter削除 (1行)
  [0-4] page.tsx  VoiceControl import追加 (2行)
  → 効果: 自動音声暴発停止、音声コントロールUI出現

━━━ Phase 1: 緊急修正 (当日中) ━━━━━━━━━━━━━━━━━━━

  [1-1] useVoiceGuide.tsx  全面書き直し (ESC/Chunk/progress)
  [1-2] HeroSection.tsx  背景ループ削除 (repeat:-1除去)
  [1-3] HeroSection.tsx  カウンターScrollTrigger→即時発火
  [1-4] HeroSection.tsx  alert()→Dialog統一
  [1-5] hooks/useReducedMotion.ts  新規作成
  [1-6] globals.css  prefers-reduced-motion CSS追加
  [1-7] 全GSAPコンポーネント  useReducedMotion適用
  → 効果: シニア安全性確保、GPU負荷解消、アクセシビリティ基盤

━━━ Phase 2: ライブラリ統一 (3日以内) ━━━━━━━━━━━━━━━

  [2-1] EmpathySection.tsx  React Spring→Framer Motion移行
  [2-2] CTASection.tsx  React Spring→Framer Motion移行
  [2-3] HeroSection.tsx  CSS hover→Framer Motion統一
  [2-4] npm uninstall @react-spring/web
  [2-5] npm uninstall react-hook-form react-intersection-observer
  → 効果: hover/tap/focus統一、dead dep清掃、bundle -45KB

━━━ Phase 3: コンテンツ強化 (1週間以内) ━━━━━━━━━━━━━

  [3-1] HeroSection.tsx  右カラムにコンテンツ配置
  [3-2] Lottie placeholder判定→MUI Icons代替 or 本物JSON
  [3-3] VoiceControl.tsx  進捗バー追加
  [3-4] 各セクション  whileFocus追加(キーボードナビ)
  → 効果: FV空白解消、視覚品質向上、音声UX完成
```

### 2. ファイル別修正マップ

| ファイル | Phase 0 | Phase 1 | Phase 2 | Phase 3 |
|:--|:--|:--|:--|:--|
| `useVoiceGuide.tsx` | rate修正, cancel修正 | 全面書き直し | - | - |
| `FeaturesSection.tsx` | onMouseEnter削除 | reduced-motion | - | Lottie判定 |
| `page.tsx` | VoiceControl追加 | - | - | - |
| `HeroSection.tsx` | - | ループ削除, カウンター修正, alert→Dialog | hover統一 | 右カラム |
| `EmpathySection.tsx` | - | reduced-motion | RS→FM移行 | Lottie判定 |
| `CTASection.tsx` | - | reduced-motion | RS→FM移行 | whileFocus |
| `SolutionSection.tsx` | - | reduced-motion | - | - |
| `StepsSection.tsx` | - | (修正不要) | - | - |
| `TrustSection.tsx` | - | reduced-motion | - | - |
| `useReducedMotion.ts` | - | **新規作成** | - | - |
| `globals.css` | - | **新規作成** | - | - |
| `VoiceControl.tsx` | - | - | - | 進捗バー |
| `package.json` | - | - | dep削除 | - |

### 3. KPT最終結論

| 区分 | 内容 |
|:--|:--|
| **Keep** | layout.tsx, theme.ts, Footer.tsx, StepsSection.tsx, AIDMA動線構成, Heroキャッチコピー, Empathy「モヤモヤ」コピー, Solution成功事例テキスト, GSAPスクロール連動パターン(Steps/Solution/Trust) |
| **Problem** | useVoiceGuide 5バグ(rate/cancel/ESC/chunk/deadCode), FeaturesSection自動音声, page.tsx VoiceControl未統合, Hero背景永続ループ, Heroカウンター0円問題, Hero右カラム空, Lottie placeholder2箇所, React Spring/Framer Motion衝突, dead dep 3個(FM/RHF/RIO), prefers-reduced-motion完全不在, CTA alert()不統一 |
| **Try** | Phase0: 即時4修正(30分), Phase1: 緊急7修正(当日), Phase2: ライブラリ統一5修正(3日), Phase3: コンテンツ強化4修正(1週間) |

### 4. 修正後の到達目標

```
アニメーション:
  ライブラリ数:     4個 → 2個 (GSAP + Framer Motion)
  ライブラリ衝突:   3箇所 → 0箇所
  永続ループ:       1個 → 0個
  prefers-reduced:  0箇所 → 全コンポーネント

音声ガイド:
  rate:            1.0 → 0.85
  cancel機能:      壊れている → speechSynthesis.cancel()
  ESC停止:         なし → 実装済み
  Chunk分割:       なし → 150文字単位
  自動発動:        1箇所(Features) → 0箇所
  UIコントロール:   画面に不在 → fixed bottom-right

依存関係:
  dead dep:        3個 → 0個
  bundle削減:      ~45KB gzip削減予測

コンテンツ:
  Hero右カラム:     空 → 成功事例 or 信頼指標
  カウンター初期値:  "0円" → 即時アニメ発火
  Lottie状態:      placeholder → MUI Icons or 本物JSON
```

### 5. 天才キャラ最終宣告

**コンポーネント外科医:** 「Phase 0の4修正は合計10行以下の変更。それだけで"電車で突然声が鳴る"と"音声が止められない"の2つの致命傷が消える。まずここから。」

**アニメーション調律師:** 「React SpringとFramer Motionの同居を1日でも長く放置すれば、次にhoverを実装する人が"どっちを使えばいい？"と迷う。ライブラリ統一は技術負債の利息を止める行為だ。」

**60歳のリアル:** 「私の朝の電車体験で、FeaturesSectionの自動音声が全てを台無しにした。7セクション中4セクションが見られなかった。この1行の`onMouseEnter`が、LP全体の価値を破壊している。」

**ライブラリ裁判官:** 「framer-motion に判決を出す。**無罪(残留)**。ただし**執行猶予なし** — Phase 2で全hover/tap/focusをFramer Motionに移行すること。移行完了をもってReact Springに**有罪(削除)**を宣告する。react-hook-formとreact-intersection-observerは**即日有罪(削除)**。」
