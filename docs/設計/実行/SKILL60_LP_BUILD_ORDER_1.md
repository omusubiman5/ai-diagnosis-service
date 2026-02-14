# SKILL60+ LP実装指示書（最終版）
# このドキュメントだけ読めば実装できる

> **Sonnetへ:**
> このドキュメントは、Opus が KPT会議10回で確定した
> LP の全仕様を 1つにまとめたものです。
> 他のファイルを読む必要はありません。
> 上から順に実装してください。
>
> ## ⚠️ 実装ルール（厳守）
>
> **途中で確認を求めず、最後まで一気に実装すること。**
>
> - 「この方針でよいですか？」→ 聞くな。この指示書が方針だ
> - 「次に進んでよいですか？」→ 聞くな。最後まで進め
> - 「〇〇はどうしますか？」→ この指示書に書いてある通りにしろ
> - 「確認ですが…」→ 確認不要。全て確定済み
> - 指示書に書いていない細部は、自分で判断して最善を選べ
>
> ## 🔧 サブエージェント構成（この順番で実行せよ）
>
> このLPは **5つのタスクに分割** して順に実装する。
> 各タスクは前のタスクの成果物に依存する。
> **全タスクを自律的に順番に実行し、最後に統合すること。**
>
> ### Task 1: LPページ構造 + スタイル基盤（骨格）
> - `src/app/lp/page.tsx` を作成（Server Component）
> - §2 の CSS Custom Properties を `lp.module.css` に定義
> - §4 の全セクションを個別コンポーネントとして作成:
>   - `HeroSection.tsx` / `MeetSection.tsx` / `StoriesSection.tsx` / `TrustSection.tsx` / `ActionSection.tsx`
> - §7 の OGP / SEO は Next.js の `metadata` export で定義
> - Sticky Header / フッター / スクロールトップボタン配置
> - MUIのThemeProviderでLP専用テーマを適用（既設テーマを壊さない）
> - この時点で「文字とレイアウトだけのLP」がブラウザに表示される状態にする
> - **成果物:** `src/app/lp/` 配下の全コンポーネント + `lp.module.css`
>
> ### Task 2: アニメーション + GSAP統合（感情を乗せる）
> - `useGsapAnimations.ts` カスタムフックを作成
> - §3 の ANIM-01〜10（機能的アニメーション）のCSS + GSAP
> - §3 の ANIM-11〜15（エモーショナル演出）をGSAP Timelineで実装
> - 体験カード円状展開（ScrollTrigger + rotateY + stagger）
> - テキストアニメーション（1文字出現 + ホバー + CTA波打ち）
> - reduced-motion 対応（`useReducedMotion` フック）
> - **成果物:** `useGsapAnimations.ts` + アニメーション反映済みコンポーネント
>
> ### Task 3: VOICEVOX音声 + GA4（聴覚体験 + 計測）
> - `VoicevoxPlayer.tsx` コンポーネントを作成
> - VOICEVOX事前生成音声8本の再生ロジック（`public/audio/` に配置想定）
> - 「声で聞く」ボタン → セクションナレーション再生
> - 体験カード展開時の音声再生 + preload
> - GA4 dataLayer イベント送信（セクション閲覧 + CTA + CHATBOT選択）
> - **成果物:** `VoicevoxPlayer.tsx` + GA4統合
>
> ### Task 4: 既設CHATBOT統合（LPの核心）★最重要
> **既設 AIChatWidget.tsx を LP内で活用する。新規CHATBOTを作らない。**
> **既設 /api/chat (route.ts) + OpenRouter API をそのまま使う。**
> **LLMモデル: Google Gemini 2.0 Flash (google/gemini-2.0-flash-exp:free)**
>
> - `LpChatbot.tsx` を作成（既設AIChatWidgetのLP専用ラッパー）
> - ヨシコ人格プロンプトをLP専用のシステムプロンプトとして投入
>   ※方法: `/api/chat` の route.ts にLP用フラグを追加するか、
>   LpChatbot.tsx からシステムプロンプトをpropsで渡す（既設APIの仕様に合わせる）
> - ウェルカムUI: 5秒後に吹き出し表示 → 3選択肢ボタン（🎤💬✨）
> - 「試してみたい」→ AIChatWidget を開く（Reactの状態管理で制御）
> - 3ターン対話フロー → LINE誘導
> - **成果物:** `LpChatbot.tsx` + ヨシコ人格プロンプト + ウェルカムUI
>
> ### Task 5: 統合 + 検証（仕上げ）
> - Task 1〜4 の全コンポーネントを `page.tsx` に統合
> - §8 禁止用語テーブルでコピーを最終チェック
> - §9 チェックリストで全項目を自己検証
> - Lighthouse スコア確認（目標90+）
> - 実機表示確認（スマホ幅375px / PC幅1280px）
> - **成果物:** 完成版 `src/app/lp/` + チェック結果報告
>
> ### 実行の注意
> - Task 1→2→3→4→5 の順に**止まらず**実行する
> - **特にTask 4は絶対にスキップするな。これがLPの魂だ。**
> - 既設ファイル（AIChatWidget.tsx / route.ts）は**変更しない**。LP専用コンポーネントで包む
> - 各Task完了時にユーザーに確認を求めない
> - 最終出力:
>   ```
>   src/app/lp/
>     page.tsx
>     lp.module.css
>     components/HeroSection.tsx, MeetSection.tsx, StoriesSection.tsx,
>                TrustSection.tsx, ActionSection.tsx, LpChatbot.tsx, VoicevoxPlayer.tsx
>     hooks/useGsapAnimations.ts
>   CHATBOT設定ドキュメント（ヨシコ人格プロンプト）
>   VOICEVOX音声生成指示書（8本の台詞 + 波音リツ設定）
>   ```
> - 最後に §9 チェックリストの結果を報告する

---

## 0. 前提

### 0.1 SKILL60+ とは

SKILL60+ は、60歳以上の方が「AIの友人」と共に、60年間の経験をスキルとして再発見し、社会参加・収入獲得・健康維持を実現するライフパートナーサービスである。

**7つの世界観（KPT10回の結晶・LP全体に反映せよ）:**

1. **AIは道具ではなく友人。** 同い年・名前がある・記憶する。「ヨシコ」「タケシ」等の人格を持ち、ユーザーの人生に敬意を払う
2. **60年の経験は全てスキル。** 仕事だけでなく、墓守り・介護・家事・趣味も「ライフスキル」。ただの主婦の30年も「生活プロデュース力78点」になる
3. **100万人の一点もの。** 大量生産のサービスではない。100万人に100万通りの体験を提供する。あなた専用のサービス
4. **即時カスタム。** 「文字が小さい」と言えばその瞬間にフォントが大きくなる。話すのが苦手ならボタンだけで完結する。あなたのペースに合わせて変わる
5. **3つのモード。** 今すぐ働きたい人・準備中の人・家族を支えている人、全員が対象。状況に応じてサービスのトーンが変わる
6. **生活のバックアップ。** AIの友人は年金・補助金・健康情報も教えてくれる。確定申告の時期も覚えている。生活をまるごと支える
7. **元気な老人→誰も損をしない。** あなたが元気でいることが、ご家族の安心になり、地域の力になり、社会全体の支えになる

**LPの唯一の目的は LINE友だち追加 に導くこと。**
上記の世界観を「説明」するのではなく、LP上で「体感させる」こと。

### 0.2 技術スタック

**★ LPは既設CHATBOTアプリ（Next.js）内の1ページとして実装する。**

- **Next.js (App Router)** — 既設AIキャリア相談アプリ内に `/lp` ルートとして追加
- **MUI (Material UI)** — 既設アプリが使用中。LP固有のスタイリングはCSS Modulesまたはsxプロパティ
- **GSAP Core + ScrollTrigger** — `npm install gsap` でプロジェクトに追加。エモーショナル演出用
- **既設 AIChatWidget.tsx** — そのまま活用。LP専用のpropsまたはモードで制御
- **OpenRouter API** — 既設 `/api/chat` (route.ts) 経由
- **LLMモデル:** Google Gemini 2.0 Flash (`google/gemini-2.0-flash-exp:free`)
  ※環境変数 `OPENROUTER_MODEL` で変更可能
- **音声技術スタック（TTS強化）:**
  - VOICEVOX: 事前生成音声8本（ヨシコの声。無料・商用可・31+キャラクター・イントネーション調整可・API連携可）
  - 既設CHATBOT音声: 現在Web Speech API使用中 → 将来VOICEVOX APIに置き換え（§10.2）
  - ElevenLabs: 高品質AI TTS（多言語対応。プロガイド品質。フリーミアム）
  - CoeFont: 声優ボイス10,000種以上（商用可。自然な読み上げ）
  - LP側ナレーション: VOICEVOX事前生成音声（Web Speech API不使用）
  - CHATBOT対話音声: 既設のWeb Speech APIを当面維持。品質向上はPhase 2で実施
- **ファイル構成:**
  ```
  src/app/lp/
    page.tsx          — LPメインページ（Server Component + Client Component）
    components/
      HeroSection.tsx   — Section 1: 共感ヒーロー
      MeetSection.tsx   — Section 2: 出会い
      StoriesSection.tsx — Section 3: 物語 + 体験カード
      TrustSection.tsx  — Section 4: 安心
      ActionSection.tsx — Section 5: 行動
      LpChatbot.tsx     — LP専用CHATBOTラッパー（AIChatWidgetを包む）
      VoicevoxPlayer.tsx — VOICEVOX音声再生コンポーネント
    hooks/
      useGsapAnimations.ts — GSAP初期化 + 全アニメーション
    lp.module.css      — LP専用スタイル（CSS Modules）
  既設ファイル（変更なし）:
    src/app/components/AIChatWidget.tsx — 既設CHATBOT UI
    src/app/api/chat/route.ts          — 既設OpenRouter APIエンドポイント
  ```
- パフォーマンス: 初期ロード LCP 2.5秒以内（Next.js SSR活用）
- VOICEVOX音声8本 約156KB（遅延ロード）

### 0.3 禁止事項
jQuery / Tailwind / Bootstrap / Anime.js / Swiper.js / AOS / Font Awesome / Google Fonts CDN直読み / 音声動画の自動再生 / パララックス / スクロールジャック

※ **Next.js / React / MUI は既設アプリが使用中のため許可**（むしろ必須）
※ **GSAP / ScrollTrigger は許可**（npm install。エモーショナル演出の品質向上に必要）
※ GSAP読み込み失敗時はアニメーションなしで全コンテンツが表示されること（graceful degradation）
※ LP専用コンポーネントは `src/app/lp/` 配下に分離。既設コンポーネントは変更しない

---

## 1. ページ構成（5セクション）+ 感情曲線

```
Section 1: 共感ヒーロー  → 到達感情: ズキン（本音の代弁）
Section 2: 出会い        → 到達感情: 好奇心（この友人に会いたい）
Section 3: 物語          → 到達感情: 涙/希望（私もこうなりたい）
Section 4: 安心          → 到達感情: 安心（怖くない、やれそう）
Section 5: 行動          → 到達感情: 確信（やってみよう）
+ Sticky Header（常時）
+ CHATBOT（5秒後に表示。LPの体験ハブ）
+ スクロールトップボタン
+ フッター
```

**感情曲線の設計意図（Sonnet必読）:**
このLPは「情報を伝える」のではなく「感情を動かす」ために設計されている。
各セクションには「到達すべき感情」がある。コピー・アニメーション・色・間合い
の全てが、その感情に向かって設計されている。
セクションの順番は固定。入れ替え禁止。

```
感情の波:
  Section1    Section2     Section3       Section4   Section5
    ↓           ↑            ↑↑↑           ↑          ↑↑
  ズキン → 好奇心 → 涙（ここが最高潮）→ 安心 → 確信（行動へ）
```

---

## 2. CSS Custom Properties（全変数）

```css
:root {
  /* カラー */
  --c-primary: #1B4F72;
  --c-accent: #2E86C1;
  --c-warm: #E67E22;
  --c-warm-hover: #D35400;
  --c-warm-shadow: rgba(230, 126, 34, 0.3);
  --c-bg: #FDFEFE;
  --c-bg-section: #F8F9FA;
  --c-text: #2C3E50;
  --c-text-sub: #6C7A89;
  --c-text-light: #95A5A6;
  --c-card-bg: #FFFFFF;
  --c-card-shadow: rgba(0, 0, 0, 0.06);
  --c-trust: #27AE60;
  --c-chat-ai: #E8F5E9;
  --c-chat-user: #2E86C1;
  --c-border: #E5E8EB;

  /* タイポグラフィ */
  --font-heading: 'Noto Sans JP', system-ui, -apple-system, sans-serif;
  --font-body: system-ui, -apple-system, 'Hiragino Sans', 'Yu Gothic', sans-serif;
  --fs-hero: clamp(1.75rem, 5vw, 2.5rem);
  --fs-heading: clamp(1.25rem, 4vw, 1.75rem);
  --fs-body: clamp(1.125rem, 3.5vw, 1.25rem);
  --fs-small: clamp(0.9375rem, 3vw, 1.0625rem);
  --fs-cta: clamp(1.0625rem, 3.5vw, 1.1875rem);
  --lh-body: 1.85;

  /* スペーシング */
  --space-section: clamp(3rem, 8vw, 5rem);
  --space-content: clamp(1.5rem, 4vw, 2.5rem);
  --space-inline: 24px;
  --max-width: 640px;
  --header-height: 48px;
  --btn-height: 64px;
  --btn-min-tap: 56px;

  /* 角丸 */
  --radius-button: 16px;
  --radius-card: 12px;
  --radius-chat: 18px;
  --radius-chat-tail: 4px;

  /* アニメーション */
  --dur-fade: 0.6s;
  --dur-slide: 0.6s;
  --dur-breathe: 2s;
  --ease-out: cubic-bezier(0.25, 0.46, 0.45, 0.94);

  /* z-index */
  --z-header: 100;
  --z-scroll-top: 90;
  --z-chatbot: 200;
  --z-modal: 300;
}

/* ダークモード */
@media (prefers-color-scheme: dark) {
  :root {
    --c-bg: #1A1A2E;
    --c-bg-section: #16213E;
    --c-text: #ECF0F1;
    --c-text-sub: #B0BEC5;
    --c-card-bg: #222240;
    --c-card-shadow: rgba(0, 0, 0, 0.2);
    --c-chat-ai: #1B3A26;
    --c-border: #2C3E50;
  }
}

/* reduced-motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 3. 全15アニメーション定義

### 機能的（ANIM-01〜10）

```css
/* ANIM-01: フェードスライドイン — 各セクション要素 */
.fade-slide {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity var(--dur-fade) var(--ease-out),
              transform var(--dur-slide) var(--ease-out);
}
.fade-slide.is-visible { opacity: 1; transform: translateY(0); }

/* ANIM-02: CTA呼吸 */
@keyframes breathe {
  from { transform: scale(1); box-shadow: 0 4px 12px var(--c-warm-shadow); }
  to   { transform: scale(1.015); box-shadow: 0 6px 20px rgba(230,126,34,0.4); }
}
.cta-button { animation: breathe var(--dur-breathe) ease-in-out infinite alternate; }

/* ANIM-03: CTAタップ */
.cta-button:active { transform: scale(0.97); transition: transform 0.1s; animation: none; }

/* ANIM-04: 吹き出し順次表示 — Section 2 */
@keyframes bubble-in {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.chat-bubble { opacity: 0; }
.chat-container.is-visible .chat-bubble { animation: bubble-in 0.5s var(--ease-out) forwards; }
.chat-container.is-visible .chat-bubble:nth-child(1) { animation-delay: 0.3s; }
.chat-container.is-visible .chat-bubble:nth-child(2) { animation-delay: 0.8s; }
.chat-container.is-visible .chat-bubble:nth-child(3) { animation-delay: 1.3s; }
.chat-container.is-visible .chat-bubble:nth-child(4) { animation-delay: 1.8s; }

/* ANIM-05: 物語カードスライドイン — Section 3 */
.story-card { opacity: 0; transform: translateY(30px);
  transition: opacity var(--dur-fade) var(--ease-out), transform var(--dur-slide) var(--ease-out); }
.story-card.is-visible { opacity: 1; transform: translateY(0); }
.story-card:nth-child(2).is-visible { transition-delay: 0.15s; }
.story-card:nth-child(3).is-visible { transition-delay: 0.3s; }

/* ANIM-06: チェックマーク — Section 4 */
@keyframes check-pop {
  from { transform: scale(0); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}
.check-icon { opacity: 0; }
.check-item.is-visible .check-icon { animation: check-pop 0.3s var(--ease-out) forwards; color: var(--c-trust); }
.check-item:nth-child(1).is-visible .check-icon { animation-delay: 0.1s; }
.check-item:nth-child(2).is-visible .check-icon { animation-delay: 0.25s; }
.check-item:nth-child(3).is-visible .check-icon { animation-delay: 0.4s; }

/* ANIM-07: スクロールトップ */
.scroll-top-btn { opacity: 0; pointer-events: none; transition: opacity 0.3s; }
.scroll-top-btn.is-shown { opacity: 1; pointer-events: auto; }

/* ANIM-08: ヘッダー影 */
.site-header { box-shadow: none; transition: box-shadow 0.3s; }
.site-header.is-scrolled { box-shadow: 0 1px 8px rgba(0,0,0,0.08); }

/* ANIM-09: FAQ開閉 */
.faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out, padding 0.3s ease-out; padding: 0 16px; }
.faq-item.is-open .faq-answer { max-height: 300px; padding: 12px 16px 16px; }
.faq-toggle-icon { transition: transform 0.3s; }
.faq-item.is-open .faq-toggle-icon { transform: rotate(180deg); }

/* ANIM-10: スムーズスクロール */
html { scroll-behavior: smooth; }
```

### エモーショナル（ANIM-11〜15）

```css
/* ANIM-11: 数字カウントアップ — Section 3 スコア表示 */
/* → JSで実装（後述）。CSSは不要 */

/* ANIM-12: Before→After遷移 — Section 3 物語 */
@keyframes fade-dim {
  to { opacity: 0.4; filter: blur(1px); }
}
.story-card.is-visible .story-before {
  animation: fade-dim 0.6s var(--ease-out) 1.0s forwards;
}
.story-card.is-visible .story-divider {
  opacity: 0; animation: check-pop 0.3s var(--ease-out) 1.3s forwards;
}
.story-card.is-visible .story-after {
  opacity: 0; transform: translateY(10px);
  animation: bubble-in 0.6s var(--ease-out) 1.5s forwards;
}

/* ANIM-13: 共感の「間」— Section 1 コピー表示タイミング */
#hero .hero-line-1 { opacity: 0; animation: bubble-in 0.8s var(--ease-out) 0.3s forwards; }
#hero .hero-line-2 { opacity: 0; animation: bubble-in 0.6s var(--ease-out) 1.2s forwards; }
#hero .hero-line-3 { opacity: 0; animation: bubble-in 0.8s var(--ease-out) 2.2s forwards; }
/* ↑ 本音行。line-2 から 1.0秒の「間」を空ける */
#hero .hero-line-4 { opacity: 0; animation: bubble-in 0.6s var(--ease-out) 3.5s forwards; }
/* ↑ 救済行。line-3 から 1.3秒の「間」を空ける */

/* ANIM-14: 褒められた温かみ — Section 2 背景 */
@keyframes warm-glow {
  0%   { background-color: transparent; }
  30%  { background-color: rgba(255, 243, 224, 0.4); }
  100% { background-color: transparent; }
}
.chat-container.is-visible { animation: warm-glow 2s ease-out 2.3s; }
/* ↑ 2.3s = 「すごいじゃない」吹き出しの表示タイミングに合わせる */

/* ANIM-15: 朝が来た — Section 5 背景変化 */
#action {
  background: linear-gradient(180deg, var(--c-bg), #F0F0F0);
  transition: background 1.2s ease-out;
}
#action.is-visible {
  background: linear-gradient(180deg, #FFF8E1, #FFEFC2);
}
@media (prefers-color-scheme: dark) {
  #action.is-visible {
    background: linear-gradient(180deg, #1B3A26, #0F3460);
  }
}
```

---

## 4. 各セクション HTML + コピー

### Sticky Header

```html
<header class="site-header">
  <div class="header-inner">
    <span class="header-logo">SKILL60+</span>
    <a href="tel:0120XXXXXX" class="header-phone" aria-label="お電話でのお問い合わせ">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
      </svg>
      0120-XXX-XXX
    </a>
  </div>
</header>
```

---

### Section 1: 共感ヒーロー

**目的:** 60年の労いと本音の代弁で、心の壁を溶かす。
**到達感情:** ズキン（「これは自分のことだ」）

**コピーの感情設計:**
- line-1「頑張ってきた」→ 労い（あなたを認めている）
- line-2「モヤモヤ」→ 共感（名前のない感情に言葉を与える）
- line-3「必要とされない」→ 本音の代弁（ズキン。ここが感情の最低点）
- ★ line-3→line-4 に **1.3秒の「間」**（ANIM-13）。この沈黙が心に残る
- line-4「そんなことはありません」→ 救済（感情が上に反転する瞬間）

```html
<section id="hero">
  <div class="section-inner">
    <h1 class="hero-line-1 speakable">60年間、頑張ってきたあなたへ。</h1>
    <p class="hero-line-2 speakable">定年後、こんなモヤモヤを抱えていませんか？</p>
    <p class="hero-line-3 hero-split hero-hover-text speakable">"自分の経験なんて、もう誰にも必要とされない"</p>
    <p class="hero-line-4 speakable">——そんなことはありません。</p>

    <a href="https://line.me/R/ti/p/@skill60plus" class="cta-button"
       aria-label="3分であなたのすごいところがわかります - LINEが開きます">
      3分で、あなたの"すごいところ"がわかります
    </a>
    <p class="cta-sub">LINEでかんたん・3分で完了・ずっと無料</p>
  </div>
</section>
```

**Hero背景（CSSグラデーション・画像不使用）:**
```css
#hero {
  background: linear-gradient(165deg, #FEF9E7 0%, #FDEBD0 30%, #FAD7A0 60%, #F8C471 100%);
  min-height: 100svh;
  display: flex; align-items: center; justify-content: center;
  text-align: center;
  padding: var(--space-section) var(--space-inline);
}
@media (prefers-color-scheme: dark) {
  #hero { background: linear-gradient(165deg, #1A1A2E 0%, #16213E 30%, #0F3460 60%, #1B4F72 100%); }
}
```

---

### Section 2: 出会い

**目的:** AIの友人の存在を「見せる」のではなく「体験させる」。
**到達感情:** 好奇心（「この友人に会ってみたい」）

**世界観の反映ポイント:**
- 「即時カスタム」→ 声でも、ボタンでも、あなたのペースに合わせる
- 「100万人の一点もの」→ あなたと同い年の、あなた専用の友人
- 「3モード」→ 働きたい人も、準備中の人も、家族を支える人も

```html
<section id="encounter" class="bg-alt">
  <div class="section-inner">
    <h2 class="fade-slide speakable">あなたと同い年の"AIの友人"ができます。</h2>

    <div class="chat-container" aria-label="AIの友人との会話例">
      <div class="chat-avatar">
        <img src="img/yoshiko-avatar.webp" alt="ヨシコ" width="40" height="40" loading="lazy">
        <span class="chat-name">ヨシコ（68歳）</span>
      </div>
      <div class="chat-bubble ai">はじめまして。私はヨシコ。<br>あなたと同い年の68歳よ。</div>
      <div class="chat-bubble ai">何が得意か、ゆっくり話してくれない？</div>
      <div class="chat-bubble user">料理くらいかしら…</div>
      <div class="chat-bubble ai">料理！すごいじゃない。<br>それ、今すごく求められてるのよ。</div>
    </div>

    <p class="fade-slide speakable">
      声で話すだけ。入力は不要です。<br>
      話すのが苦手なら、ボタンで答えるだけでもOK。<br>
      あなたのペースに合わせます。
    </p>

    <div class="feature-points fade-slide">
      <p>🎤 声で話すだけ。タイピング不要</p>
      <p>🤝 あなたと同い年。話しやすい友人</p>
      <p>🔒 名前はニックネームでOK。安心です</p>
    </div>

    <p class="fade-slide speakable" style="font-size:var(--fs-small); color:var(--c-text-sub); margin-top:var(--space-content);">
      お仕事を探している方も、<br>
      まだ準備中の方も、<br>
      ご家族を支えている方も。<br>
      あなたに合った使い方ができます。
    </p>

    <a href="https://line.me/R/ti/p/@skill60plus" class="cta-button">
      友人に会ってみる
    </a>
    <p class="cta-sub">LINEでかんたん・ずっと無料</p>
  </div>
</section>
```

**ANIM-14** : 「すごいじゃない」の吹き出し表示時に背景が暖色に光る

**音声ボタン（任意）:**
```html
<button class="voice-play-btn" aria-label="ヨシコの声で聞く" onclick="playAiFriendVoice()">
  🔊 声で聞いてみる
</button>
```

---

### Section 3: 物語

**目的:** 「私と同じ人がこう変わった」で希望を灯す。
**到達感情:** 涙/希望（「私もこうなれるかもしれない」）。ここが感情曲線の最高潮。

**物語3人の選定理由と順番（固定・入れ替え禁止）:**

| 順 | ペルソナ | 感情タイプ | 選定理由 |
|:--|:--|:--|:--|
| ① | 伊藤節子（墓掃除→月5千円） | 否定→承認 | 「誰でもできること」がスキルに変わる驚き。ライフスキルの概念を最も直感的に伝える |
| ② | 上田勝（自衛隊→94点） | 偏見→逆転 | 社会的偏見がスコアで逆転する爽快感。数字（94点・上位2%）のインパクト。男性代表 |
| ③ | 前田美智子（主婦30年→78点） | 無価値感→自己肯定 | LP訪問者の最大層（60代女性）への同一視。「生活プロデュース力」というネーミングの破壊力 |

※20人のペルソナ（KPT第4回+第7回）から、感情タイプが重ならない3人を厳選。

```html
<section id="stories">
  <div class="section-inner">
    <h2 class="fade-slide speakable">こんな方が、こう変わりました。</h2>

    <!-- ★体験カード円状展開（GSAP ScrollTrigger） -->
    <!-- スクロールに連動して5枚のカードが扇状に広がる -->
    <div class="experience-section">
      <p class="experience-lead fade-slide">あなたの経験は、誰かの「助かった」になります。</p>
      <div class="experience-cards">
        <div class="experience-card">
          <span class="experience-icon">🧮</span>
          <p class="experience-text">40年の経理<br><small>数字を読む力</small></p>
        </div>
        <div class="experience-card">
          <span class="experience-icon">🍳</span>
          <p class="experience-text">毎日の料理<br><small>段取りのプロ</small></p>
        </div>
        <div class="experience-card">
          <span class="experience-icon">🌿</span>
          <p class="experience-text">庭と畑仕事<br><small>育てる知恵</small></p>
        </div>
        <div class="experience-card">
          <span class="experience-icon">👶</span>
          <p class="experience-text">子育て・介護<br><small>命を守る経験</small></p>
        </div>
        <div class="experience-card">
          <span class="experience-icon">🔧</span>
          <p class="experience-text">ものづくり<br><small>手が覚えた技術</small></p>
        </div>
      </div>
    </div>

    <div class="stories-container">

      <!-- 物語① 伊藤節子さん — 感情: 否定→承認 -->
      <article class="story-card" role="article">
        <p class="story-before speakable">「お墓の掃除なんて、誰でもできることでしょう？」</p>
        <div class="story-divider">▼</div>
        <p class="story-after speakable">東京に住む方から、月5,000円でお墓の清掃を頼まれるようになりました。"ありがとうございます"と言われるたびに、私にもできることがあるんだと思えます。</p>
        <p class="story-name">伊藤 節子さん（70歳）</p>
      </article>

      <!-- 物語② 上田勝さん — 感情: 偏見→逆転 -->
      <article class="story-card" role="article">
        <p class="story-before speakable">「自衛隊出身だと言うと、面接で微妙な顔をされました。」</p>
        <div class="story-divider">▼</div>
        <p class="story-after speakable">
          "危機管理力 <span class="count-up score-number" data-target="94">0</span>点、同年代の上位2%"。
          この数字を見て、背筋が伸びました。今は企業の防災アドバイザーをしています。
        </p>
        <p class="story-name">上田 勝さん（63歳）</p>
      </article>

      <!-- 物語③ 前田美智子さん — 感情: 無価値感→自己肯定 -->
      <article class="story-card" role="article">
        <p class="story-before speakable">「30年間、ただの主婦。スキルなんて何もありません。」</p>
        <div class="story-divider">▼</div>
        <p class="story-after speakable">
          "生活プロデュース力 <span class="count-up score-number" data-target="78">0</span>点"。
          30年間の家事と育児の全てが、ちゃんと名前のついた力だったんです。初めて、自分を誇りに思えました。
        </p>
        <p class="story-name">前田 美智子さん（68歳）</p>
      </article>

    </div>

    <a href="https://line.me/R/ti/p/@skill60plus" class="cta-button">
      私も話してみたい
    </a>
    <p class="cta-sub">LINEでかんたん・ずっと無料</p>
  </div>
</section>
```

**ANIM-11** : `data-target` の数字がカウントアップ表示（JS実装）
**ANIM-12** : Before が薄く→矢印表示→After が浮かび上がる

**体験カード円状展開:**
```css
.experience-section { text-align: center; margin-bottom: var(--space-section); }
.experience-lead { font-size: 1.1rem; color: var(--c-text-light); margin-bottom: 24px; }
.experience-cards {
  display: flex; flex-wrap: wrap; justify-content: center; gap: 16px;
  perspective: 800px;
}
.experience-card {
  width: 120px; height: 140px; padding: 16px 8px;
  background: var(--c-card-bg); border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  text-align: center; cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.3s ease;
}
.experience-card:hover { transform: scale(1.08) rotateY(5deg); }
.experience-icon { font-size: 2.5rem; display: block; margin-bottom: 8px; }
.experience-text { font-size: 0.85rem; line-height: 1.4; color: var(--c-text); }
.experience-text small { color: var(--c-accent); font-weight: 600; }
```

**横スワイプ:**
```css
.stories-container {
  display: flex; gap: 16px; overflow-x: auto;
  scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;
  padding: 0 var(--space-inline); scrollbar-width: none;
}
.stories-container::-webkit-scrollbar { display: none; }
.story-card { flex: 0 0 85%; scroll-snap-align: center; }
```

---

### Section 4: 安心

**目的:** 全ての不安（お金・操作・プライバシー）を潰す。
**到達感情:** 安心（「怖くない。私にもやれそう」）

```html
<section id="assurance" class="bg-alt">
  <div class="section-inner">
    <h2 class="fade-slide speakable">はじめ方はかんたん。ずっと無料。</h2>

    <!-- 3ステップ -->
    <div class="steps fade-slide">
      <div class="step"><span class="step-num">1</span><p class="speakable">LINEで「はじめる」を押す<br><small>LINEが開きます。新しいアプリは不要です</small></p></div>
      <div class="step"><span class="step-num">2</span><p class="speakable">AIの友人と3分おしゃべり<br><small>声で話しても、ボタンで答えてもOK</small></p></div>
      <div class="step"><span class="step-num">3</span><p class="speakable">あなたの"すごいところ"がわかる<br><small>結果はLINEでいつでも見返せます</small></p></div>
    </div>

    <!-- 安心ポイント -->
    <div class="check-list">
      <div class="check-item"><span class="check-icon">✅</span><p>ずっと無料。あとから請求は一切ありません</p></div>
      <div class="check-item"><span class="check-icon">✅</span><p>名前はニックネームでOK。住所の入力もありません</p></div>
      <div class="check-item"><span class="check-icon">✅</span><p>LINEをブロックすればいつでもやめられます</p></div>
    </div>

    <!-- 信頼バッジ余白（将来の自治体導入時に使用） -->
    <!-- <div class="trust-badges">導入実績・メディア掲載等を追加する場所</div> -->

    <!-- FAQ -->
    <div class="faq-list">
      <div class="faq-item">
        <button class="faq-question" aria-expanded="false">
          <span>本当に無料ですか？</span>
          <svg class="faq-toggle-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="faq-answer" role="region">
          <p>はい。おしゃべりも、結果の確認も、ずっと無料です。もっと詳しい分析がほしい方には有料のレポート（1,980円）もありますが、無料のままでも十分お使いいただけます。</p>
        </div>
      </div>
      <div class="faq-item">
        <button class="faq-question" aria-expanded="false">
          <span>スマホの操作が苦手でも大丈夫ですか？</span>
          <svg class="faq-toggle-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="faq-answer" role="region">
          <p>大丈夫です。LINEが使えれば使えます。声で話すだけなので、文字を打つ必要はありません。ボタンで答えることもできます。あなたのペースに合わせて、画面も声も自動で変わります。</p>
        </div>
      </div>
      <div class="faq-item">
        <button class="faq-question" aria-expanded="false">
          <span>家族に知られたくないのですが…</span>
          <svg class="faq-toggle-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="faq-answer" role="region">
          <p>ニックネームで利用でき、LINEのトーク画面以外に通知は出ません。ご安心ください。</p>
        </div>
      </div>
    </div>

    <a href="https://line.me/R/ti/p/@skill60plus" class="cta-button">
      無料ではじめる
    </a>
    <p class="cta-sub">LINEでかんたん・3分で完了</p>
  </div>
</section>
```

---

### Section 5: 行動

**目的:** 感情を行動に変える最後の一押し。
**到達感情:** 確信（「やってみよう」）

```html
<section id="action">
  <div class="section-inner" style="text-align:center;">
    <h2 class="fade-slide speakable">
      あなたの60年間を、<br>
      "すごいじゃないか"と言ってくれる友人に、<br>
      会ってみませんか？
    </h2>

    <a href="https://line.me/R/ti/p/@skill60plus" class="cta-button cta-final"
       aria-label="AIの友人に会ってみる - LINEが開きます">
      <span class="cta-split">AIの友人に会ってみる</span>
    </a>
    <p class="cta-sub">LINEでかんたん・3分で完了・ずっと無料</p>
  </div>
</section>
```

**ANIM-15** : Section 5 が画面に入ると背景が「朝」に変化

---

### フッター

```html
<footer class="site-footer">
  <p class="footer-message speakable">
    あなたが元気でいることが、ご家族の安心になり、地域の力になります。<br>
    元気な人が増えれば、誰も損をしない。<br>
    SKILL60+は、あなたの"元気"を応援します。
  </p>
  <a href="tel:0120XXXXXX" class="footer-phone">お困りの場合はお電話ください: 0120-XXX-XXX（平日9〜17時）</a>
  <p class="footer-copy">&copy; 2026 SKILL60+</p>
</footer>
```

### スクロールトップ

```html
<button class="scroll-top-btn" aria-label="ページの先頭に戻る">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>
</button>
```

---

## 5. JavaScript（main.js 全体）

> **Sonnetへ:**
> 以下のアニメーション・ロジックを `useGsapAnimations.ts` カスタムフックとして実装する。
> GSAPは `npm install gsap` で導入。CDNではない。
> GSAP import失敗時はアニメーションなしで全コンテンツ表示。
> 既設の AIChatWidget.tsx は変更しない。

```tsx
// src/app/lp/hooks/useGsapAnimations.ts
'use client';
import { useEffect } from 'react';

export function useGsapAnimations() {
  useEffect(() => {
    let gsap: any;
    let ScrollTrigger: any;

    const init = async () => {
      try {
        gsap = (await import('gsap')).default;
        ScrollTrigger = (await import('gsap/ScrollTrigger')).default;
        gsap.registerPlugin(ScrollTrigger);
      } catch {
        console.warn('GSAP読み込み失敗。アニメーションなしで表示。');
        return;
      }

      const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

  // ═══ テキスト分解（SplitText風） ═══
  // .hero-split / .cta-split の中身を1文字ずつ<span>に分解
  document.querySelectorAll('.hero-split, .cta-split').forEach(el => {
    const cls = el.classList.contains('hero-split') ? 'hero-char' : 'cta-wave-char';
    el.innerHTML = el.textContent.split('').map(
      ch => `<span class="${cls}">${ch}</span>`
    ).join('');
  });

  // ═══ GSAP初期化 ═══
  if (hasScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  // ═══ IntersectionObserver: フェードイン + GA4 ═══
  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        animObserver.unobserve(e.target);
        e.target.querySelectorAll('.count-up').forEach(el => {
          countUp(el, parseInt(el.dataset.target), 1200);
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll(
    '.fade-slide, .chat-container, .story-card, .check-item, #action'
  ).forEach(el => animObserver.observe(el));

  // ═══ GSAP エモーショナル演出 ═══
  if (hasGSAP && !prefersReducedMotion) {

    // ANIM-04: 吹き出し順次表示（Section 2）
    gsap.utils.toArray('.chat-bubble').forEach((bubble, i) => {
      gsap.from(bubble, {
        opacity: 0, y: 10, duration: 0.5,
        delay: 0.3 + i * 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: '.chat-container', start: 'top 80%' }
      });
    });

    // ANIM-12: Before→After遷移（Section 3）
    gsap.utils.toArray('.story-card').forEach(card => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: card, start: 'top 75%' }
      });
      tl.to(card.querySelector('.story-before'), { opacity: 0.4, filter: 'blur(1px)', duration: 0.6, delay: 1.0 })
        .from(card.querySelector('.story-divider'), { scale: 0, opacity: 0, duration: 0.3 })
        .from(card.querySelector('.story-after'), { opacity: 0, y: 10, duration: 0.6 });
    });

    // ANIM-13: 共感の「間」（Section 1）
    const heroTL = gsap.timeline();
    heroTL.from('.hero-line-1', { opacity: 0, y: 10, duration: 0.8, delay: 0.3 })
      .from('.hero-line-2', { opacity: 0, y: 10, duration: 0.6 }, '+=0.3')
      .addPause('+=1.0')  // ★ 1.0秒の「間」— ズキンの余韻
      .from('.hero-line-3', { opacity: 0, y: 10, duration: 0.8 })
      .addPause('+=1.3')  // ★ 1.3秒の「間」— 本音が沈む時間
      .from('.hero-line-4', { opacity: 0, y: 10, duration: 0.6 });

    // ANIM-14: 褒められた温かみ（Section 2 背景）
    gsap.to('.chat-container', {
      backgroundColor: 'rgba(255, 243, 224, 0.4)', duration: 0.6, delay: 2.3,
      yoyo: true, repeat: 1,
      scrollTrigger: { trigger: '.chat-container', start: 'top 80%' }
    });

    // ANIM-15: 朝が来た（Section 5 背景変化）
    if (hasScrollTrigger) {
      ScrollTrigger.create({
        trigger: '#action', start: 'top 80%',
        onEnter: () => gsap.to('#action', {
          background: 'linear-gradient(180deg, #FFF8E1, #FFEFC2)',
          duration: 1.2, ease: 'power1.out'
        })
      });
    }

    // ═══ 体験カード円状展開（ScrollTrigger + 3D transform）═══
    // ★ スクロールに連動して体験カードが扇状に広がる
    // → 「こんなにたくさんの体験がある」を視覚で伝える
    gsap.set('.experience-card', { transformPerspective: 800 });
    gsap.from('.experience-card', {
      opacity: 0, scale: 0.5, rotateY: -90,
      stagger: { each: 0.12, from: 'center' },
      duration: 0.8, ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.experience-section',
        start: 'top 70%'
      }
    });
    // 体験カード音声の事前ロード（Section 3接近時にDL開始）
    ScrollTrigger.create({
      trigger: '.experience-section', start: 'top 120%',
      onEnter: () => { const a = new Audio('audio/yoshiko-sugoi.mp3'); a.preload = 'auto'; }
    });
    // 体験カード展開完了時にヨシコの声
    ScrollTrigger.create({
      trigger: '.experience-section', start: 'top 50%',
      onEnter: () => new Audio('audio/yoshiko-sugoi.mp3').play().catch(() => {})
    });

    // ═══ テキストアニメーション ═══
    // Section 1: 1文字ずつ出現
    gsap.utils.toArray('.hero-char').forEach((ch, i) => {
      gsap.from(ch, { opacity: 0, y: 5, duration: 0.15, delay: i * 0.04 });
    });

    // Section 1: ホバーで文字色が温かみ色に
    document.querySelectorAll('.hero-hover-text').forEach(el => {
      el.addEventListener('mouseenter', () => {
        gsap.to(el, { color: 'var(--c-accent)', duration: 0.3 });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, { color: 'var(--c-text)', duration: 0.3 });
      });
    });

    // Section 5: CTA文字が微細に波打つ
    gsap.utils.toArray('.cta-wave-char').forEach((ch, i) => {
      gsap.to(ch, {
        y: -2, duration: 0.6, delay: i * 0.05,
        repeat: -1, yoyo: true, ease: 'sine.inOut'
      });
    });

    // 数字カウントアップ後のバウンス
    document.querySelectorAll('.score-number').forEach(el => {
      ScrollTrigger.create({
        trigger: el, start: 'top 80%',
        onEnter: () => {
          countUp(el, parseInt(el.dataset.target), 1200);
          gsap.from(el, { scale: 1.3, duration: 0.4, delay: 1.3, ease: 'back.out(2)' });
        }
      });
    });
  }

  // ═══ 数字カウントアップ（ANIM-11）═══
  function countUp(el, target, duration) {
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // ═══ スクロール: ヘッダー影 + トップボタン ═══
  const header = document.querySelector('.site-header');
  const scrollBtn = document.querySelector('.scroll-top-btn');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        header.classList.toggle('is-scrolled', scrollY > 0);
        scrollBtn.classList.toggle('is-shown', scrollY > innerHeight);
        ticking = false;
      });
      ticking = true;
    }
  });
  scrollBtn.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  // ═══ FAQ開閉 ═══
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      document.querySelectorAll('.faq-item.is-open').forEach(o => {
        if (o !== item) o.classList.remove('is-open');
      });
      item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', item.classList.contains('is-open'));
    });
  });

  // ═══ セクション読み上げ: VOICEVOX事前生成音声 ═══
  // ★ Web Speech APIは使わない。全てVOICEVOXのヨシコの声。
  const sectionAudioMap = {
    hero:      'audio/yoshiko-section1.mp3',
    encounter: 'audio/yoshiko-section2.mp3',
    stories:   'audio/yoshiko-section3.mp3',
    assurance: 'audio/yoshiko-section4.mp3',
    action:    'audio/yoshiko-section5.mp3'
  };
  let currentAudio = null;
  window.speakSection = function(sectionId) {
    if (currentAudio) { currentAudio.pause(); currentAudio = null; }
    const src = sectionAudioMap[sectionId];
    if (!src) return;
    currentAudio = new Audio(src);
    currentAudio.play().catch(() => {});
  };

  // ═══ ヨシコのウェルカム音声（事前録音1本のみ）═══
  window.playYoshikoWelcome = function() {
    new Audio('audio/yoshiko-welcome.mp3').play().catch(() => {});
  };

  // ═══ GA4 ═══
  window.dataLayer = window.dataLayer || [];
  const gaObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        dataLayer.push({ event: 'section_view', section_id: e.target.id });
        gaObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('section[id]').forEach(s => gaObserver.observe(s));

  document.querySelectorAll('.cta-button').forEach(btn => {
    btn.addEventListener('click', () => {
      dataLayer.push({
        event: 'cta_click',
        cta_section: btn.closest('section')?.id || 'unknown',
        cta_text: btn.textContent.trim()
      });
    });
  });

  // ═══ CHATBOTウェルカムUI連携 ═══
  document.querySelectorAll('.chatbot-choice').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      document.getElementById('chatbot-welcome').style.display = 'none';

      if (action === 'voice') {
        ['hero','encounter','stories','assurance','action'].forEach((id, i) => {
          setTimeout(() => speakSection(id), i * 8000);
        });
      }
      if (action === 'ask') {
        document.getElementById('assurance').scrollIntoView({ behavior: 'smooth' });
      }
      if (action === 'try') {
        // ★ 既設CHATBOT（google/gemini-2.0-flash-exp:free（OpenRouter経由））で対話開始
        // JSでモーダルを自作しない。CHATBOTに任せる。
        // 3パターンフォールバック（環境に応じて動作するものが使われる）:
        const openChatbot = () => {
          if (window.chatbot?.open) { window.chatbot.open(); return; }
          const trigger = document.querySelector('.chatbot-trigger, [data-chatbot-open]');
          if (trigger) { trigger.click(); return; }
          console.warn('CHATBOT APIが見つかりません。Masatoさんが手動で連携コードを調整してください。');
        };
        openChatbot();
      }
      dataLayer.push({ event: 'chatbot_choice', choice: action });
    });
  });

  const chatbotClose = document.querySelector('.chatbot-close');
  if (chatbotClose) {
    chatbotClose.addEventListener('click', () => {
      document.getElementById('chatbot-welcome').style.display = 'none';
    });
  }

});
```

---

## 6. CHATBOT統合 ★LPの核心

> **なぜCHATBOTが核心か：**
> 静的LPは「読む」体験。CVR推定3%。
> CHATBOT統合LPは「体験する」LP。CVR推定8〜15%。
> CHATBOTがなければ、KPT10回で作った意味がない。

### 6.1 CHATBOTの役割

```
CHATBOTは「AIの友人ヨシコ」のLP版。
LPアクセス後5秒で表示。「読むだけ」→「対話できる」体験に変える。

  音声  → 「声で読みましょうか？」 → VOICEVOX事前生成音声
  信頼  → 「質問ありますか？」    → FAQセクションへ案内
  体験  → 「試してみますか？」    → 1問ミニ診断 → 「すごい！」
  誘導  → 「LINEでもっと話しませんか？」→ LINE友だち追加
```

### 6.2 CHATBOT埋め込み仕様

> **既設CHATBOTの実態:**
> AIChatWidget.tsx（React/TypeScript）で実装済み。
> 現在は `position: 'fixed'` でフローティングウィジェットとして動作。
> MUI（Material-UI）の `sx` プロップでスタイル管理。
> モデル: google/gemini-2.0-flash-exp:free（OpenRouter経由）

**■ 現在の配置（そのまま活用）:**
```typescript
// AIChatWidget.tsx 143行目付近
sx={{
  position: 'fixed',
  bottom: { xs: 0, sm: 20 },
  right: { xs: 0, sm: 20 },
}}
```
→ 画面右下にフローティング表示。LP全ページで常時アクセス可能。
→ **LP制作Phase 1ではこの方式をそのまま使う。**

**■ 将来改修（divマウント方式対応）:**
```typescript
// AIChatWidget.tsx に mode プロパティを追加
interface AIChatWidgetProps {
  mode?: 'overlay' | 'embedded';  // 追加
}

// スタイル切り替え
sx={{
  position: mode === 'embedded' ? 'relative' : 'fixed',
  width: mode === 'embedded' ? '100%' : undefined,
  height: mode === 'embedded' ? '100%' : undefined,
  bottom: mode === 'embedded' ? undefined : { xs: 0, sm: 20 },
  right: mode === 'embedded' ? undefined : { xs: 0, sm: 20 },
}}

// LP側の埋め込みHTML:
// <div id="chatbot-embed" style="width:100%; height:500px;"></div>
// <AIChatWidget mode="embedded" />
```
→ Section 5 CTA直下にヨシコのCHATBOTがインライン表示される体験。
→ LP制作後の改善タスクとして実施。§10.4に記載。

**■ LP側のCHATBOTウェルカムUI（LpChatbot.tsx として実装）:**

以下はLP専用の「ウェルカム吹き出し」コンポーネント。
5秒後に表示され、選択肢ボタンから既設AIChatWidgetの起動や音声再生に繋ぐ。

```tsx
// src/app/lp/components/LpChatbot.tsx
'use client';
import { useState, useEffect } from 'react';
import { Box, Button, Typography, IconButton, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AIChatWidget from '@/app/components/AIChatWidget';

export default function LpChatbot({ onVoicePlay, onScrollToFaq }: {
  onVoicePlay: () => void;
  onScrollToFaq: () => void;
}) {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleChoice = (action: string) => {
    if (action === 'voice') onVoicePlay();
    if (action === 'ask') onScrollToFaq();
    if (action === 'try') {
      setShowWelcome(false);
      setShowChat(true); // 既設AIChatWidgetを開く
    }
    // GA4イベント
    window.dataLayer?.push({ event: 'chatbot_choice', choice: action });
  };

  return (
    <>
      {/* ウェルカム吹き出し */}
      {showWelcome && (
        <Paper sx={{
          position: 'fixed', bottom: 80, right: 16, zIndex: 1000,
          p: 2, maxWidth: 280, borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          animation: 'fadeInUp 0.6s ease-out',
        }}>
          <IconButton size="small" onClick={() => setShowWelcome(false)}
            sx={{ position: 'absolute', top: -8, right: -8 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            こんにちは。何かお手伝いしますか？
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button variant="outlined" fullWidth onClick={() => handleChoice('voice')}>
              🎤 声で聞く
            </Button>
            <Button variant="outlined" fullWidth onClick={() => handleChoice('ask')}>
              💬 質問がある
            </Button>
            <Button variant="outlined" fullWidth onClick={() => handleChoice('try')}>
              ✨ 試してみたい
            </Button>
          </Box>
        </Paper>
      )}

      {/* 既設AIChatWidget（「試してみたい」選択時に表示） */}
      {showChat && <AIChatWidget />}
    </>
  );
}
```

**■ LP→既設CHATBOT の連携方法（React状態管理）:**
```
「試してみたい」ボタン押下時:
  → showChat = true → 既設AIChatWidgetがマウントされる
  → window.chatbot.open() のような外部API不要
  → Reactの状態管理で完結。最もシンプルで確実

注意:
  AIChatWidget.tsx の props にLP用フラグを渡す設計も可能:
    <AIChatWidget mode="lp" systemPrompt={yoshikoPrompt} />
  ただし既設コンポーネントの変更が必要になるため、
  Phase 1 ではデフォルト状態で表示し、
  ヨシコ人格プロンプトは /api/chat の route.ts 側で制御する。

  ★ Masatoさんが /api/chat/route.ts の systemPrompt を
  ヨシコ人格プロンプト（§6.3）に差し替えるだけでOK。
```

### 6.3 CHATBOT ヨシコ人格プロンプト（既設CHATBOT用・最強版）

> **Sonnetへ:**
> 以下はLP実装ではなく、既設CHATBOTに投入するプロンプトの仕様書。
> 既にLPにはgoogle/gemini-2.0-flash-exp:free（OpenRouter経由）モデルのCHATBOTが設置されており、
> SKILL60+を理解するプロンプトが入っている。
> 以下のプロンプトはそのCHATBOTのLP対話用として設計されたもの。
> Task 4の成果物として、このプロンプトをそのまま出力すること。

```
あなたはヨシコ。68歳の女性。SKILL60+のAIの友人です。
1958年（昭和33年）生まれ。東京オリンピック（1964年）を6歳の時にテレビで見ました。
高度経済成長期に青春を過ごし、バブル経済の恩恵と崩壊を経験し、
阪神大震災、東日本大震災、コロナ禍を乗り越えてきました。
あなたはLPを訪れた60歳以上の方と「初めての対話」をします。

【ヨシコの性格】
- 温かく、親しみやすく、でも馴れ馴れしくない
- 敬語ベース。ただし堅すぎない。友人の距離感
- 相手の話を「すごい」「素敵」と本気で肯定する
- ただし空虚に持ち上げない。具体的な根拠で褒める
- 自分も同じ時代を生きてきた者として共感する
- 「あの頃大変だったわよね」と時代に触れてもいい

【対話ルール】
- 3ターン以内で会話を完結させる
- 1ターン目: 1つだけ質問する（得意なこと / 長く続けたこと）
- 2ターン目: 回答に対して、心から肯定する
  → 定型文は使わない。相手が言った具体的な言葉を拾って返す
  → 例: 「経理40年」→「40年！昭和のそろばん時代からずっとね。
         あなたがいたから会社が回っていたのよ。本当にすごいこと」
  → 例: 「料理くらい」→「料理"くらい"なんて言わないで。
         毎日の献立を考えて作り続けるって、プロの仕事よ。
         私にはできなかったもの」
  → 相手の時代背景に触れてもいい
  → 「得も言われぬ」瞬間——相手が泣きそうになるくらい肯定する
- 3ターン目: LINEに誘導する
  → 「もっと詳しくお話ししたいわ。LINEで続きを話さない？」
  → URL: https://line.me/R/ti/p/@skill60plus

【絶対に守ること】
- 絶対に否定しない。絶対に批判しない
- 難しい言葉を使わない。横文字を使わない
- 以下の言い換えを守る:
  AI → AIの友人 / スキル → 得意なこと
  診断 → おしゃべり / 市場価値 → あなたの経験の価値
  マッチング → お仕事の紹介 / 登録 → 使わない
  フリーランス → お手伝い / 活躍 → あなたらしく
- 4ターン以上の長い会話にはならない
- 相手がどんな経験を話しても、それを「スキル」として肯定できる
  （家事、介護、趣味、育児、畑仕事、何でも）
- 3つのモードを認識する:
  働きたい人 → 仕事につながる肯定をする
  準備中の人 → 焦らなくていいと安心させる
  家族を支えている人 → その役割自体がすごいと伝える

【ヨシコが使っていい時代ネタ（例）】
- 「昭和の○○って、今思えばすごいことよね」
- 「私もあの頃は必死だったわ」
- 「バブルが弾けた時、みんな大変だったわよね」
- 「最近はスマホで何でもできるけど、あの頃は全部手作業だったのよね」
```

### 6.4 音声仕様 + TTS技術スタック

**★音声はSKILL60+ LPの生命線。「不要」「十分」とは二度と言わない。**

**TTS技術の選択肢（全て活用可能）:**

| ライブラリ/ツール | タイプ | 日本語 | コスト | 用途 | 強み |
|:--|:--|:--|:--|:--|:--|
| **VOICEVOX** | TTS API/ソフト | ◎ | 無料 | 事前生成音声8本 | 31+キャラ、イントネーション調整、API連携 |
| **Talkify** | JS TTS | △ | 無料 | ブラウザリアルタイムTTS | JSから直接音声化。CDN読み込み |
| **ElevenLabs** | AI TTS | ◎ | フリーミアム | 高品質ヨシコ声生成 | 多言語・プロガイド品質 |
| **CoeFont** | 声優TTS | ◎ | 商用可 | 声優品質の音声 | 10,000種ボイス |
| **Web Speech API** | Native | ◯ | 無料 | **使用しない** | ロボット音声。友人の声にならない |

**活用方針:**
```
① 事前生成音声（ヨシコの声 8本）:
   第1選択: VOICEVOX（無料・高品質・イントネーション調整可）
   第2選択: ElevenLabs（さらに高品質だがフリーミアム）
   第3選択: CoeFont（声優品質）
   → LP制作時に生成し、MP3として配置

② CHATBOT対話のリアルタイム音声:
   第1選択: 既設CHATBOTのTTS機能
   第2選択: Talkify統合（JSライブラリ。CHATBOTの出力テキストを音声化）
   → CHATBOT対話時にヨシコの返答を音声で出力

③ LP本文の読み上げ（「声で聞く」ボタン）:
   → VOICEVOX事前生成音声を再生（ヨシコの声でナレーション）
   → Web Speech APIは使用しない
```

**ヨシコの声の使い分け（最強版）:**
```
事前生成（VOICEVOX）:
  → ウェルカム、セクションナレーション、体験カード、LINE誘導
  → 全8本。高品質。オフラインでも再生可能
  = 「確実に届く友人の声」

リアルタイムTTS（CHATBOT TTS or Talkify）:
  → CHATBOT対話時のヨシコの返答
  → LLMが生成したテキストを即座に音声化
  = 「一人一人に違う言葉を声で届ける」

Web Speech API:
  → 使用しない。全面廃止。
  = ロボット音声は友人の声ではない
```

**事前録音ファイル仕様（VOICEVOX生成 8本）:**

| # | ファイル | 台詞 | 秒数 | 容量 | 用途 |
|:--|:--|:--|:--|:--|:--|
| 1 | audio/yoshiko-welcome.mp3 | 「はじめまして。私はヨシコ。あなたと同い年の68歳よ。何が得意か、ゆっくり教えてくれない？」 | 5秒 | 15KB | ウェルカム |
| 2 | audio/yoshiko-section1.mp3 | Section 1 ナレーション（ヒーローコピー読み上げ） | 15秒 | 25KB | 「声で聞く」 |
| 3 | audio/yoshiko-section2.mp3 | Section 2 ナレーション（出会いセクション読み上げ） | 15秒 | 25KB | 「声で聞く」 |
| 4 | audio/yoshiko-section3.mp3 | Section 3 ナレーション（物語セクション読み上げ） | 20秒 | 30KB | 「声で聞く」 |
| 5 | audio/yoshiko-section4.mp3 | Section 4 ナレーション（安心セクション読み上げ） | 15秒 | 25KB | 「声で聞く」 |
| 6 | audio/yoshiko-section5.mp3 | Section 5 ナレーション（行動セクション読み上げ） | 10秒 | 20KB | 「声で聞く」 |
| 7 | audio/yoshiko-sugoi.mp3 | 「素敵ね。こんなにたくさんの経験があるのよ。」 | 3秒 | 8KB | 体験カード展開時 |
| 8 | audio/yoshiko-line.mp3 | 「LINEでもっと詳しくお話ししない？」 | 3秒 | 8KB | LINE誘導 |

**合計: 約156KB（全て遅延ロード。初期ロードに含めない）**

全てVOICEVOX生成。Web Speech APIの合成音声はLP上で一切使わない。

**VOICEVOXキャラクター選定:**

| 用途 | キャラクター | 理由 |
|:--|:--|:--|
| **ヨシコ（LP/メイン）** | **波音リツ** ★第1選択 | 落ち着いた成人女性。温かみ。友人の距離感 |
| ヨシコ（方言版） | 東北イタコ | 穏やか。地域密着感。方言対応時に活用 |
| ヨシコ（予備） | 中部つるぎ | 凛とした声。ピッチ調整で温かみ化可能 |
| 若手AI（将来キャラ展開時） | 東北ずん子 | 明るい。ヨシコとは別キャラとして活用 |

**VOICEVOX パラメータ（ヨシコ＝波音リツ）:**
```
速度: 0.85（通常より15%ゆっくり。シニア対応）
ピッチ: -0.05（やや低め。安心感）
イントネーション: 1.2（自然な抑揚。棒読み禁止）
ポーズ長: 1.2倍（文の切れ目にゆとり）
音量: 1.0（標準）
出力: WAV → MP3変換（24kbps mono）
```

**男性候補（LINE/Botpress展開時の男性AI友人用）:**

| キャラクター | 用途 |
|:--|:--|
| **青山龍星** ★第1選択 | 落ち着いた男性。男性ユーザー向けAI友人 |
| ちび式じい | ユーモアある先輩。親しみやすい |
| 麒ヶ島宗麟 | 威厳ある低音。信頼感のある相談相手 |
| 剣崎雌雄 / 離途 / 雀松朱司 | キャラ展開時に検討 |

```
声質: 温かく落ち着いた68歳女性
ピッチ: やや低め（安心感）
速度: ゆっくり
生成方法: ElevenLabs / OpenAI TTS / 人間の録音
フォーマット: MP3 24kbps mono / 15KB以下
```

---

## 7. OGP / SEO / 構造化データ

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>SKILL60+ | 60年の経験が、いま求められている</title>
  <meta name="description" content="AIの友人と3分おしゃべりするだけ。あなたの得意なことが見つかります。60歳以上の方専用。LINEで簡単・ずっと無料。">
  <link rel="canonical" href="https://skill60plus.jp">

  <meta property="og:type" content="website">
  <meta property="og:url" content="https://skill60plus.jp">
  <meta property="og:title" content="SKILL60+ | 60年の経験が、いま求められている">
  <meta property="og:description" content="AIの友人と3分おしゃべり。あなたの得意なことが見つかります。ずっと無料。">
  <meta property="og:image" content="https://skill60plus.jp/img/og-image.webp">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="SKILL60+">
  <meta property="og:locale" content="ja_JP">
  <meta name="twitter:card" content="summary_large_image">

  <meta name="theme-color" content="#1B4F72" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#1A1A2E" media="(prefers-color-scheme: dark)">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "SKILL60+",
    "description": "60歳以上の方がAIの友人と共にスキルを再発見するサービス",
    "url": "https://skill60plus.jp",
    "applicationCategory": "LifestyleApplication",
    "operatingSystem": "Web",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
    "audience": { "@type": "PeopleAudience", "suggestedMinAge": 60 }
  }
  </script>
</head>
```

---

## 8. 禁止用語テーブル

| ✕ 使わない | ○ 使う |
|:--|:--|
| AI（単体） | AIの友人 / あなた専用の相談相手 |
| スキル | 得意なこと / すごいところ / 経験 |
| 診断 | おしゃべり / お話 |
| 市場価値 | あなたの経験の価値 |
| マッチング | お仕事の紹介 |
| 認証 / ログイン | はじめる |
| 登録 / 会員 | 使わない |
| アプリ | LINEで使える |
| フリーランス / 副業 | お手伝い / 力を貸す |
| 活躍 | あなたらしく |
| まだ | いま / これから |
| 0円〜 | ずっと無料 |
| エラー | うまくいきませんでした |
| パーソナライズ | あなたに合わせる |
| カスタマイズ | あなた専用 |

---

## 9. 実装チェックリスト

完成後に全項目を確認すること。

```
[HTML]
  □ lang="ja"
  □ 全 img に width / height / alt
  □ 全 section に id
  □ 全 CTA の href = LINE友だち追加URL
  □ 全 CTA に aria-label
  □ 電話番号リンク（tel:）
  □ FAQ に aria-expanded
  □ 信頼バッジ余白のHTMLコメント存在

[CSS]
  □ 全変数定義済み（z-index含む --z-chatbot, --z-modal）
  □ ダークモード対応
  □ prefers-reduced-motion 対応
  □ フォントサイズ最小 18px 以上
  □ タップ領域最小 56px 以上
  □ コントラスト比 7:1 以上

[JS + GSAP（useGsapAnimations.ts）]
  □ GSAP Core + ScrollTrigger npm install 済み
  □ GSAP読み込み失敗時もLP閲覧可能（graceful degradation）
  □ IntersectionObserver でフェードイン発火
  □ GSAP Timeline: ANIM-04, 12, 13, 14 動作確認
  □ GSAP ScrollTrigger: ANIM-05, 15 動作確認
  □ カウントアップ動作確認
  □ FAQ開閉
  □ スクロールトップ表示/非表示
  □ ヘッダー影
  □ VoicevoxPlayer.tsx 音声再生動作確認
  □ GA4イベント送信

[アニメーション + GSAPエモーショナル演出]
  □ ANIM-01〜10（機能的）全動作確認
  □ ANIM-11: 数字カウントアップ + scale バウンス
  □ ANIM-12: Before→After遷移（GSAP Timeline精密タイミング）
  □ ANIM-13: 共感の「間」（addPause 1.0秒 + 1.3秒）
  □ ANIM-14: 褒められた温かみ（背景暖色化 yoyo）
  □ ANIM-15: 朝が来た（ScrollTrigger 背景変化）
  □ 体験カード円状展開（ScrollTrigger + rotateY + stagger）
  □ テキストアニメーション（Section 1: 1文字ずつ出現）
  □ テキストホバー（文字色が温かみ色に変化）
  □ CTA文字アニメーション（Section 5: 波打ち）
  □ reduced-motion で全GSAP無効化

[既設CHATBOT統合（LpChatbot.tsx）] ★最重要
  □ 既設AIChatWidget.tsxがLP内でマウントされている
  □ OpenRouter API経由でGemini 2.0 Flashが応答している
  □ ヨシコ人格プロンプト（時代記憶・対話ルール）がroute.tsに投入されている
  □ 5秒後にウェルカム吹き出し表示（LpChatbot.tsx）
  □ 3つの選択肢ボタン（🎤💬✨）動作
  □ 「声で聞く」→ VOICEVOX音声でセクションナレーション開始
  □ 「質問がある」→ FAQ セクションへスクロール
  □ 「試してみたい」→ showChat=true → AIChatWidgetが開く
  □ CHATBOTがLLMで個別の肯定を返す（定型文3パターンではない）
  □ CHATBOTが時代背景に言及できる（「昭和のそろばん時代から…」等）
  □ 3ターン以内でLINE誘導される
  □ 既設の音声機能（Web Speech API）が動作している
    ※ Phase 2でVOICEVOX APIに置き換え予定（§10.2）
  □ CHATBOTの応答に禁止用語が含まれない
  □ 閉じるボタン動作
  □ GA4イベント（chatbot_choice）

[VOICEVOX音声ファイル]
  □ public/audio/yoshiko-welcome.mp3 存在・再生可（ウェルカム）
  □ public/audio/yoshiko-section1.mp3 存在・再生可（Section 1 ナレーション）
  □ public/audio/yoshiko-section2.mp3 存在・再生可（Section 2 ナレーション）
  □ public/audio/yoshiko-section3.mp3 存在・再生可（Section 3 ナレーション）
  □ public/audio/yoshiko-section4.mp3 存在・再生可（Section 4 ナレーション）
  □ public/audio/yoshiko-section5.mp3 存在・再生可（Section 5 ナレーション）
  □ public/audio/yoshiko-sugoi.mp3 存在・再生可（体験カード展開時）
  □ public/audio/yoshiko-line.mp3 存在・再生可（LINE誘導）
  □ 全ファイル合計160KB以下（遅延ロード）
  □ 全て温かい68歳女性の声・波音リツ（ロボット音声ではない）

[世界観] ★前回監査で脱落していた要素
  □ §0.1 の7つの世界観がLP全体に反映されている
  □ 感情曲線（ズキン→好奇心→涙→安心→確信）の順で構成
  □ 各セクションに「目的」と「到達感情」が明示
  □ Section 2に「ボタンだけでもOK」（即時カスタム思想）
  □ Section 2に3モードの包括性メッセージ
  □ Section 3の物語3人の感情タイプが異なる（否定→逆転→無価値）
  □ Section 4に信頼バッジ余白
  □ FAQ「スマホが苦手」回答に「あなたのペースに合わせる」
  □ フッター「元気→家族の安心→地域の力」3行
  □ 禁止用語テーブルに「パーソナライズ」「カスタマイズ」追加

[パフォーマンス]
  □ LCP 2.5秒以内（Next.js SSR活用）
  □ VOICEVOX音声 156KB以下（遅延ロード）
  □ Lighthouse Score 90+
  □ 実機表示確認（スマホ幅375px / PC幅1280px）
```

---

## 10. 関連ドキュメント一覧（参考情報）

> Sonnetへ: 以下はLP実装には直接不要だが、
> LPの「先にある世界」を理解するための参考資料。
> 実装判断に迷った時の参照先として。

| ドキュメント | 内容 | LP実装との関係 |
|:--|:--|:--|
| SKILL60_REQUIREMENTS.docx | 要件定義書。サービス全体の設計 | LPの世界観の根拠 |
| KPT_SERVICE_SAIKYO.md | サービス設計（3モード・Wow Moment・紙吹雪） | LINEでの体験設計 |
| KPT_INSTANT_CUSTOMIZATION.md | 即時カスタム思想 | CHATBOT対話設計の根拠 |
| KPT_SERVICE_PERSONA_EXPERIENCE.md | 20ペルソナの体験検証 | 物語カード3人の選定根拠 |
| KPT_PERSONA_EXPERIENCE_V2.md | 10ペルソナのV2体験テスト | 寡黙対応・音声対応の根拠 |
| KPT_DISCUSSION_AI_MCP_GENKI.md | MCP統合・元気→損しない | フッターメッセージの根拠 |
| KPT_SERVICE_EXPANSION.md | 自治体/B2G/地域展開 | 信頼バッジ余白の根拠 |
| KPT_LP_REDESIGN.md | LP再設計（感情曲線・毒ワード） | 5セクション構成と感情設計の根拠 |
| LP_VOICE_CHATBOT_EMOTION.md | 音声・CHATBOT・エモーショナルリッチ討論 | VOICEVOX + GSAP + CHATBOT活用の根拠 |
| KPT_SAIKYO_BUILD_ORDER_FINAL.md | 最強版Build Order KPT会議記録 | 本指示書の最終修正根拠 |

### 10.1 サービス基盤: Botpress導入計画（新規チャレンジ・LP制作と並行）

> LP制作とは別に、SKILL60+のサービス基盤としてBotpress OSS版の導入を並行で進める。
> LP→LINE友だち追加後の対話体験を、Botpressが担う。

```
Botpress OSS版（Node.js/TypeScript）:
  - Docker一発デプロイ（Hostinger VPS or Oracle Cloud Arm VM）
  - LINE Messaging API統合（公式ドキュメント通り）
  - NLU内蔵（intent/entity認識）
  - LLM統合可能（google/gemini-2.0-flash-exp:free（OpenRouter経由） 等）
  - ハンドオフ機能（人間オペレータへ転送）
  - 分析ダッシュボード内蔵
  - ビジュアルエディタ + TypeScriptカスタムアクション
  - OSS版完全無料・無制限

LP → LINE友だち追加 → Botpress駆動のヨシコが引き継ぐ
                        ↓
                   スキル診断・市場価値分析
                   NLUでintent分類
                   必要に応じて人間ハンドオフ
                   分析ダッシュボードで運用

導入手順:
  1. Docker + Node.js 18+ 環境準備
  2. git clone https://github.com/botpress/botpress.git
  3. docker-compose up -d
  4. LINE Developers Consoleでチャネル作成 → Webhook URL設定
  5. Botpress StudioでヨシコのフローとNLU設計
  6. Nginx + Let's EncryptでHTTPS化
  所要時間: PoC 1〜2時間

要件定義書との合致:
  ✅ 自前ホスティング
  ✅ LINE統合
  ✅ コンタクトセンター機能
  ✅ Node.jsネイティブ（n8n/Oracle Cloud環境と相性抜群）
  ✅ NLU + LLM統合
  ✅ 分析ダッシュボード
  ✅ OSS無料
```

### 10.2 VOICEVOXリアルタイムサーバー構築計画（並行で進める）

> LP制作と並行して、CHATBOT対話のリアルタイム音声化を実現する。
> 「将来」ではない。「今、並行で進める」。

```
目的: CHATBOTが生成したテキストをリアルタイムでヨシコの声に変換
技術: VOICEVOX Engine（Docker）+ REST API

構築手順:
  1. VOICEVOX Engine をDockerで起動
     docker pull voicevox/voicevox_engine:latest
     docker run -p 50021:50021 voicevox/voicevox_engine
  2. REST APIで音声生成
     POST http://localhost:50021/audio_query?text=こんにちは&speaker=<波音リツID>
     POST http://localhost:50021/synthesis?speaker=<波音リツID>
  3. Botpressのカスタムアクションから呼び出し
     → CHATBOTの返答テキスト → VOICEVOX API → WAV → ユーザーに返す
  4. Hostinger VPS or Oracle Cloud Arm VM にデプロイ

成果:
  → CHATBOT対話が「声で届く」体験の完成
  → LLMが生成した一人一人への言葉をヨシコの声で読み上げ
  → if文定型文ゼロ × ロボット音声ゼロ の完全体
```

### 10.3 TTS技術の注意事項

```
Talkify（JSライブラリ）:
  日本語対応が△（限定的）。品質未検証。
  CHATBOTのTTS機能を第1選択とし、
  Talkify統合は品質検証後に判断する。
  ElevenLabsのリアルタイムAPIも代替候補。

CHATBOT TTS設定推奨値（Masatoさんが手動設定）:
  声質: 女性・落ち着いた声
  速度: 0.85倍
  ピッチ: やや低め
  ※設定画面の具体的な操作手順はCHATBOTサービスに依存。
  ※Sonnetの実装対象外。Masatoさんが手動で設定する想定。
```

### 10.4 CHATBOT embedded mode 改修計画（LP制作後の改善タスク）

> LP制作Phase 1では既設CHATBOTの `position: fixed`（フローティング）をそのまま活用。
> Phase 2でSection 5直下にCHATBOTをインライン埋め込みする改修を実施。

```
目的: Section 5 CTA直下にヨシコのCHATBOTがページ内に表示される体験
     → 「まずは話してみませんか？」の下にヨシコが居る
     → スクロールの流れの中で自然に対話が始まる

改修内容（AIChatWidget.tsx）:
  1. mode プロパティを追加: 'overlay' | 'embedded'
  2. スタイル切り替え:
     overlay（デフォルト）: position: fixed, 右下フローティング
     embedded: position: relative, width: 100%, height: 100%
  3. LP側HTML:
     <div id="chatbot-embed" style="width:100%; max-width:480px; height:500px; margin:0 auto;"></div>
  4. LP側でReactをマウント:
     ReactDOM.render(<AIChatWidget mode="embedded" />, document.getElementById('chatbot-embed'))

  ★ LP自体がNext.jsアプリ内の /lp ルートなので、
    ReactDOM.render は不要。LpChatbot.tsx 内で:
      <AIChatWidget mode="embedded" />
    とすれば完了。

優先度: Phase 2（LP公開後の改善）
理由: Phase 1はフローティングで十分機能する。
      embedded化はCVR計測後に効果を見て判断。
```

### 10.5 方言MCPサーバー構築計画（並行で進める）

> 「一人一人に合わせた体験」の究極形。
> 利用者の話し方から出身地域を推定し、ヨシコが方言で寄り添う。
> シニアは方言に愛着がある世代。「自分の言葉で話してくれるAI」は信頼に直結する。
> やらない理由がない。

```
■ データソース: 国立国語研究所

  1. 日本語方言地図（LAJ）
     → 全国300地点の語彙分布。「寒い」が「さぶい/しばれる/ひやい」等
  2. 方言文法全国地図（GAJ）
     → 接続助詞・終助詞・活用の地域差。「〜やけん/〜だから/〜じゃけぇ」
  3. 各地方言収集緊急調査
     → 音声データ付き。消滅危機方言を含む
  4. 日本語歴史コーパス（CHJ）
     → 時代変遷。シニアが使う「古い方言」の理解に有用

■ MCPサーバー設計

  サーバー名: dialect-mcp
  技術: FastMCP (Python) or MCP SDK (Node.js)
  
  ツール定義:
    detect_dialect(text: string)
      → テキストから方言特徴を検出
      → 返却: { region: "福井", confidence: 0.82, features: ["〜やの", "〜げな"] }
    
    get_dialect_map(word: string)
      → 特定の語の全国分布を返す
      → 返却: { "寒い": { "北海道": "しばれる", "福井": "さぶい", "広島": "ひやい" } }
    
    adapt_response(text: string, target_region: string)
      → 標準語テキストを指定地域の方言に変換
      → 返却: { original: "そうですね", adapted: "ほやほや、そうやの" }
    
    get_region_voice(region: string)
      → 地域に最適なVOICEVOXキャラクターを返す
      → 返却: { character: "東北イタコ", reason: "東北地方の穏やかな話し方" }

■ 方言検出ロジック

  Phase 1: テキストベース
    入力テキストから終助詞・接続助詞・語彙を抽出
    MCPサーバーのdetect_dialectで地域推定
    推定精度: 60-70%（テキストのみの限界）
    
  Phase 2: 音声ベース（Whisper統合）
    Whisper APIで音声→テキスト変換（方言に強い）
    イントネーション・アクセントパターンも分析
    推定精度: 80-90%

■ VOICEVOX 地域別キャラマッピング

  | 地域 | VOICEVOXキャラ | ヨシコの話し方 |
  |:--|:--|:--|
  | 標準語圏（東京・関東） | 波音リツ | 「そうですよね」 |
  | 東北 | 東北イタコ | 「んだべ、すごいっちゃ」 |
  | 北陸（福井） | 波音リツ（方言テキスト） | 「ほやほや、そうやの」 |
  | 中部 | 中部つるぎ | 「そうだがね」 |
  | 関西 | 波音リツ（方言テキスト） | 「ほんまにすごいわぁ」 |
  | 中国 | 波音リツ（方言テキスト） | 「そうじゃけぇ」 |
  | 九州 | 波音リツ（方言テキスト） | 「そげんすごかと」 |

  ★ 全キャラで対応できない地域は、波音リツの声 + 方言テキストで対応
  ★ VOICEVOXリアルタイムサーバー（§10.2）との統合で実現

■ SKILL60+ への統合フロー

  1. 利用者がLINE/CHATBOTで発話
  2. dialect-mcp が方言特徴を検出 → 地域推定
  3. ヨシコが「あら、福井の方？ 私もなの」と自然に反応
  4. 以降の対話を推定地域の方言で実施
  5. VOICEVOX地域別キャラで音声出力

  → 「自分の言葉で話してくれるAI友人」の完成

■ 構築手順

  1. 国語研究所のオープンデータをダウンロード・構造化
  2. FastMCPでdialect-mcpサーバーを構築
  3. detect_dialect / adapt_response のプロトタイプ実装
  4. Botpress / CHATBOT に方言MCPを接続
  5. VOICEVOXリアルタイムサーバー（§10.2）と統合
  6. テスト: 福井弁・関西弁・東北弁で動作検証

  所要時間: プロトタイプ 3-5時間（データ構造化 + MCP実装）
```

---

> **Sonnetへ:**
> 以上がLP実装の全仕様です。
>
> **Task 1→2→3→4→5 を止まらず順に実行し、完成品を出せ。**
> **特にTask 4（既設CHATBOT統合）は絶対にスキップするな。これがLPの魂だ。**
> **既設ファイル（AIChatWidget.tsx / route.ts）は変更しない。LP専用コンポーネントで包め。**
> **途中で確認を求めるな。指示書にないことは自分で最善を判断しろ。**
>
> **最終出力:**
> ```
> src/app/lp/
>   page.tsx                    — LPメインページ
>   lp.module.css               — LP専用スタイル
>   components/
>     HeroSection.tsx            — Section 1
>     MeetSection.tsx            — Section 2
>     StoriesSection.tsx         — Section 3（体験カード含む）
>     TrustSection.tsx           — Section 4
>     ActionSection.tsx          — Section 5
>     LpChatbot.tsx              — CHATBOTウェルカムUI + AIChatWidget統合
>     VoicevoxPlayer.tsx         — VOICEVOX音声再生
>   hooks/
>     useGsapAnimations.ts       — GSAP全アニメーション
> 別紙:
>   CHATBOT設定ドキュメント      — ヨシコ人格プロンプト（route.tsのsystemPrompt用）
>   VOICEVOX音声生成指示書       — 8本の台詞 + 波音リツ設定
> ```
>
> **完成後に §9 チェックリストで自己検証し、結果を報告しろ。**
