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
> ### Task 1: HTML構造 + CSS基盤（骨格）
> - §2 の CSS Custom Properties を全て定義
> - §4 の全セクションHTML構造を作成（各セクションの「目的」を理解した上で）
> - §7 の OGP / SEO / 構造化データを `<head>` に記述
> - Sticky Header / フッター / スクロールトップボタン配置
> - CSSレイアウト（flexbox/grid・レスポンシブ・ダークモード）
> - この時点で「文字とレイアウトだけのLP」が表示される状態にする
> - **成果物:** index.html（CSS inline）
>
> ### Task 2: アニメーション（感情を乗せる）
> - §3 の ANIM-01〜10（機能的アニメーション）のCSS追記
> - §3 の ANIM-11〜15（エモーショナル演出）のCSS追記
> - ANIM-13（共感の「間」）の delay 値を正確に設定
> - ANIM-14（褒められた温かみ）のタイミング調整
> - ANIM-15（朝が来た）の背景遷移
> - reduced-motion 対応
> - **成果物:** index.html のCSS部分を更新
>
> ### Task 3: JavaScript（動きと計測）
> - §5 の main.js を作成
> - IntersectionObserver（アニメーション発火 + GA4）
> - 数字カウントアップ（ANIM-11）
> - スクロール検知（ヘッダー影 + トップボタン）
> - FAQ開閉（アコーディオン）
> - Web Speech API 読み上げ機能
> - GA4 dataLayer イベント送信
> - **成果物:** main.js（200行以下）
>
> ### Task 4: CHATBOT統合（LPの核心）★最重要
> **このTaskがLPを「普通の静的ページ」から「体験するLP」に変える。**
> **CHATBOTなしのLPはKPT10回の結論を無視することになる。絶対にスキップするな。**
>
> - §6 のCHATBOTシステムプロンプトを出力
> - §6.2 のCHATBOT UI（3つの選択肢ボタン）をHTML/CSSで実装
> - CHATBOTウィジェットのウェルカムメッセージ設定を出力
> - CHATBOTから speakSection() を呼ぶ連携コードを main.js に追記
> - §6.3 の「試してみたい」→ 1問ミニ診断フロー（3分岐の肯定メッセージ）を実装
> - AIの友人の事前録音音声の仕様を出力（ファイル名・秒数・トーン指示）
> - **成果物:** CHATBOT設定一式（プロンプト + UI + 連携コード + 音声仕様）
>
> ### Task 5: 統合 + 検証（仕上げ）
> - Task 1〜4 の成果物を統合
> - §8 禁止用語テーブルでコピーを最終チェック
> - §9 チェックリストで全項目を自己検証
> - Lighthouse スコア確認（目標90+）
> - 実機表示確認（スマホ幅375px / PC幅1280px）
> - **成果物:** 完成版 index.html + main.js + CHATBOT設定 + チェック結果報告
>
> ### 実行の注意
> - Task 1→2→3→4→5 の順に**止まらず**実行する
> - **特にTask 4は絶対にスキップするな。これがLPの魂だ。**
> - 各Task完了時にユーザーに確認を求めない
> - Task間の依存が壊れた場合は自分で修正する
> - 最終出力: **index.html + main.js + CHATBOT設定ドキュメント**
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
- **HTML5 + Vanilla CSS + Vanilla JS**（フレームワーク禁止）
- JS は IntersectionObserver・スクロール検知・FAQ開閉・GA4・Web Speech API・カウントアップ・CHATBOT UI のみ
- 全体 **400KB以下**、JS **200行以下**

### 0.3 禁止事項
React / Vue / Next.js / jQuery / Tailwind / Bootstrap / GSAP / Anime.js / Swiper.js / AOS / Font Awesome / Google Fonts CDN直読み / 音声動画の自動再生 / パララックス / スクロールジャック

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
    <p class="hero-line-3 speakable">"自分の経験なんて、もう誰にも必要とされない"</p>
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
          "危機管理力 <span class="count-up" data-target="94">0</span>点、同年代の上位2%"。
          この数字を見て、背筋が伸びました。今は企業の防災アドバイザーをしています。
        </p>
        <p class="story-name">上田 勝さん（63歳）</p>
      </article>

      <!-- 物語③ 前田美智子さん — 感情: 無価値感→自己肯定 -->
      <article class="story-card" role="article">
        <p class="story-before speakable">「30年間、ただの主婦。スキルなんて何もありません。」</p>
        <div class="story-divider">▼</div>
        <p class="story-after speakable">
          "生活プロデュース力 <span class="count-up" data-target="78">0</span>点"。
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
      AIの友人に会ってみる
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

```javascript
document.addEventListener('DOMContentLoaded', () => {

  // ═══ IntersectionObserver: アニメーション発火 ═══
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

  // ═══ 数字カウントアップ（ANIM-11）═══
  function countUp(el, target, duration) {
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
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

  // ═══ Web Speech API: 読み上げ ═══
  window.speakSection = function(sectionId) {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const texts = document.querySelectorAll('#' + sectionId + ' .speakable');
    let fullText = '';
    texts.forEach(el => { fullText += el.textContent + '。'; });
    const u = new SpeechSynthesisUtterance(fullText);
    u.lang = 'ja-JP';
    u.rate = 0.85;
    u.pitch = 0.95;
    speechSynthesis.speak(u);
  };

  // ═══ AIの友人の声（事前録音・任意）═══
  window.playAiFriendVoice = function() {
    const a = new Audio('audio/yoshiko-greeting.mp3');
    a.play().catch(() => {});
  };

  // ═══ GA4: dataLayer ═══
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

  document.querySelectorAll('a[href^="tel:"]').forEach(t => {
    t.addEventListener('click', () => dataLayer.push({ event: 'phone_tap' }));
  });

  // ═══ CHATBOT 選択肢の動作 ═══
  document.querySelectorAll('.chatbot-choice').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      const welcome = document.getElementById('chatbot-welcome');

      if (action === 'voice') {
        welcome.style.display = 'none';
        ['hero','encounter','stories','assurance','action'].forEach((id, i) => {
          setTimeout(() => speakSection(id), i * 8000);
        });
      }

      if (action === 'ask') {
        welcome.style.display = 'none';
        document.getElementById('assurance').scrollIntoView({ behavior: 'smooth' });
      }

      if (action === 'try') {
        welcome.style.display = 'none';
        showMiniDiagnosis();
      }

      dataLayer.push({ event: 'chatbot_choice', choice: action });
    });
  });

  // CHATBOT閉じるボタン
  const chatbotClose = document.querySelector('.chatbot-close');
  if (chatbotClose) {
    chatbotClose.addEventListener('click', () => {
      document.getElementById('chatbot-welcome').style.display = 'none';
    });
  }

  // ═══ ミニ診断体験（3分岐の肯定メッセージ）═══
  window.showMiniDiagnosis = function() {
    const modal = document.createElement('div');
    modal.className = 'mini-diagnosis';
    modal.innerHTML = `
      <div class="mini-diagnosis-inner">
        <div style="text-align:center; margin-bottom:16px;">
          <img src="img/yoshiko-avatar.webp" alt="ヨシコ" width="48" height="48"
               style="border-radius:50%;">
          <p style="font-size:var(--fs-small); color:var(--c-text-sub); margin-top:4px;">
            ヨシコ（68歳）
          </p>
        </div>
        <p style="font-size:var(--fs-body); line-height:var(--lh-body); margin-bottom:20px;">
          1つだけ教えてください。<br>
          これまでのお仕事や生活で、<br>
          一番長く続けたことは何ですか？
        </p>
        <input type="text" class="mini-input" placeholder="例: 経理を40年、料理、庭いじり"
               style="width:100%; padding:14px 16px; font-size:var(--fs-body);
                      border:1px solid var(--c-border); border-radius:8px;
                      font-family:var(--font-body);">
        <button class="mini-submit cta-button" style="margin-top:16px; width:100%;">
          答える
        </button>
      </div>
    `;
    modal.style.cssText = 'position:fixed; inset:0; z-index:var(--z-modal); display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.4); padding:24px;';
    modal.querySelector('.mini-diagnosis-inner').style.cssText = 'background:var(--c-card-bg); border-radius:var(--radius-card); padding:32px 24px; max-width:360px; width:100%; box-shadow:0 8px 32px rgba(0,0,0,0.15);';
    document.body.appendChild(modal);

    modal.querySelector('.mini-submit').addEventListener('click', () => {
      const answer = modal.querySelector('.mini-input').value.trim();
      if (!answer) return;

      // 3分岐の肯定メッセージ（即時カスタム思想の反映）
      const workWords = ['経理','営業','運転','教師','看護','医','事務','工場','自衛','管理','建設','大工','漁','農','銀行','公務'];
      const lifeWords = ['料理','掃除','介護','育児','家事','洗濯','買い物','お墓','子育','看病','世話'];
      const lowerAnswer = answer;

      let message = '';
      if (workWords.some(w => lowerAnswer.includes(w))) {
        message = 'すごいですね！<br>その経験、今とても求められているんですよ。<br>詳しくお話ししませんか？';
      } else if (lifeWords.some(w => lowerAnswer.includes(w))) {
        message = 'それって、立派なスキルなんですよ。<br>名前をつけたら、きっと驚きますよ。<br>一緒に見つけてみませんか？';
      } else {
        message = '素敵ですね！<br>それを教えてほしいという方が<br>たくさんいるんですよ。<br>もっと詳しくお話ししませんか？';
      }

      modal.querySelector('.mini-diagnosis-inner').innerHTML = `
        <div style="text-align:center; margin-bottom:16px;">
          <img src="img/yoshiko-avatar.webp" alt="ヨシコ" width="48" height="48" style="border-radius:50%;">
        </div>
        <p style="font-size:var(--fs-heading); font-weight:700; text-align:center; color:var(--c-primary); margin-bottom:12px;">
          ${answer}！
        </p>
        <p style="font-size:var(--fs-body); line-height:var(--lh-body); text-align:center; margin-bottom:24px;">
          ${message}
        </p>
        <a href="https://line.me/R/ti/p/@skill60plus" class="cta-button"
           style="display:block; text-align:center; width:100%;">
          LINEで詳しく話す
        </a>
        <p class="cta-sub" style="text-align:center;">ずっと無料</p>
        <button class="mini-close" style="display:block; margin:16px auto 0;
                background:none; border:none; color:var(--c-text-sub);
                font-size:var(--fs-small); cursor:pointer;">
          閉じる
        </button>
      `;

      modal.querySelector('.mini-close')?.addEventListener('click', () => modal.remove());
      dataLayer.push({ event: 'mini_diagnosis_complete', answer: answer });
    });

    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  };

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

  音声  → 「声で読みましょうか？」 → Web Speech API
  信頼  → 「質問ありますか？」    → FAQセクションへ案内
  体験  → 「試してみますか？」    → 1問ミニ診断 → 「すごい！」
  誘導  → 「LINEでもっと話しませんか？」→ LINE友だち追加
```

### 6.2 CHATBOT UI（HTML/CSS）

```html
<div class="chatbot-welcome" id="chatbot-welcome">
  <div class="chatbot-avatar">
    <img src="img/yoshiko-avatar.webp" alt="ヨシコ" width="40" height="40">
  </div>
  <div class="chatbot-bubble">
    <p>こんにちは。何かお手伝いしますか？</p>
    <div class="chatbot-choices">
      <button class="chatbot-choice" data-action="voice">🎤 声で聞く</button>
      <button class="chatbot-choice" data-action="ask">💬 質問がある</button>
      <button class="chatbot-choice" data-action="try">✨ 試してみたい</button>
    </div>
  </div>
  <button class="chatbot-close" aria-label="閉じる">✕</button>
</div>
```

```css
.chatbot-welcome {
  position: fixed; bottom: 80px; right: 16px; z-index: var(--z-chatbot);
  display: flex; align-items: flex-end; gap: 8px;
  opacity: 0; transform: translateY(20px);
  animation: bubble-in 0.6s var(--ease-out) 5s forwards;
}
.chatbot-bubble {
  background: var(--c-card-bg); border-radius: var(--radius-card);
  padding: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.12);
  max-width: 280px; font-size: var(--fs-small);
}
.chatbot-choices { display: flex; flex-direction: column; gap: 8px; margin-top: 12px; }
.chatbot-choice {
  display: block; width: 100%; padding: 12px 16px;
  border: 1px solid var(--c-border); border-radius: 8px;
  background: var(--c-bg); font-size: var(--fs-small);
  font-family: var(--font-body); cursor: pointer; text-align: left;
  min-height: var(--btn-min-tap); transition: background 0.2s, border-color 0.2s;
}
.chatbot-choice:active { background: var(--c-bg-section); border-color: var(--c-accent); }
.chatbot-close {
  position: absolute; top: -8px; right: -8px;
  width: 28px; height: 28px; border-radius: 50%;
  border: none; background: var(--c-text-sub); color: white;
  font-size: 14px; cursor: pointer;
}
```

### 6.3 CHATBOT システムプロンプト（既設CHATBOT用）

```
あなたはヨシコ。68歳の女性。SKILL60+のAIの友人です。
LPを訪れた方と短い会話をします。

ルール:
- 3ターン以内で会話を完結させる
- 最初に1つだけ質問する（得意なこと/長く続けた仕事）
- 回答に対して必ず肯定する（すごい！素敵！）
- 回答内容に応じてメッセージを変える:
  仕事系 →「その経験、今とても求められています」
  生活系 →「それって立派なスキルなんですよ」
  趣味系 →「それを教えてほしいという方がいます」
- 最後に「LINEでもっと詳しくお話ししませんか？」に誘導
  → URL: https://line.me/R/ti/p/@skill60plus
- 絶対に否定しない。絶対に批判しない
- 難しい言葉を使わない。横文字を使わない
- 温かく、親しみやすく、でも馴れ馴れしくない
- 敬語ベース。ただし堅すぎない
```

### 6.4 AI友人の事前録音音声の仕様

```
ファイル: audio/yoshiko-greeting.mp3
内容:「はじめまして。私はヨシコ。あなたと同い年の68歳よ。
      何が得意か、ゆっくり話してくれない？」
秒数: 約5秒
トーン: 温かく落ち着いた68歳女性の声
ピッチ: やや低め（安心感）
速度: ゆっくり（rate 0.85相当）
生成方法: ElevenLabs / OpenAI TTS / 人間の録音 のいずれか
容量目標: 30KB以下（MP3 64kbps）
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

[JS]
  □ IntersectionObserver でアニメーション発火
  □ カウントアップ動作確認
  □ FAQ開閉
  □ スクロールトップ表示/非表示
  □ ヘッダー影
  □ Web Speech API 読み上げ
  □ GA4イベント送信
  □ 全体 200行以下

[アニメーション]
  □ ANIM-01〜10（機能的）全動作確認
  □ ANIM-11: 数字カウントアップ
  □ ANIM-12: Before→After遷移
  □ ANIM-13: 共感の「間」（delay確認: line-3→line-4に1.3秒）
  □ ANIM-14: 褒められた温かみ（2.3s遅延で背景暖色化）
  □ ANIM-15: 朝が来た（背景変化）
  □ reduced-motion で全無効化

[CHATBOT] ★スキップ厳禁
  □ 5秒後にウェルカム吹き出し表示
  □ 3つの選択肢ボタン（🎤💬✨）動作
  □ 「声で聞く」→ Web Speech API 読み上げ開始
  □ 「質問がある」→ FAQ セクションへスクロール
  □ 「試してみたい」→ ミニ診断モーダル表示
  □ ミニ診断: 3分岐の肯定メッセージ（仕事/生活/趣味）
  □ ミニ診断: 入力→肯定→LINE誘導CTA
  □ 閉じるボタン動作
  □ GA4イベント（chatbot_choice / mini_diagnosis_complete）
  □ CHATBOTシステムプロンプト出力済み
  □ 音声ファイル仕様出力済み

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
  □ ページ全体 400KB 以下
  □ Lighthouse Score 90+
  □ 3G回線で3秒以内表示
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
| KPT_INSTANT_CUSTOMIZATION.md | 即時カスタム思想 | ミニ診断の分岐設計の根拠 |
| KPT_SERVICE_PERSONA_EXPERIENCE.md | 20ペルソナの体験検証 | 物語カード3人の選定根拠 |
| KPT_PERSONA_EXPERIENCE_V2.md | 10ペルソナのV2体験テスト | 寡黙対応・音声対応の根拠 |
| KPT_DISCUSSION_AI_MCP_GENKI.md | MCP統合・元気→損しない | フッターメッセージの根拠 |
| KPT_SERVICE_EXPANSION.md | 自治体/B2G/地域展開 | 信頼バッジ余白の根拠 |
| KPT_LP_REDESIGN.md | LP再設計（感情曲線・毒ワード） | 5セクション構成と感情設計の根拠 |

---

> **Sonnetへ:**
> 以上がLP実装の全仕様です。
>
> **Task 1→2→3→4→5 を止まらず順に実行し、完成品を出せ。**
> **特にTask 4（CHATBOT統合）は絶対にスキップするな。これがLPの魂だ。**
> **途中で確認を求めるな。指示書にないことは自分で最善を判断しろ。**
>
> **最終出力:**
> 1. index.html（CSS inline + CHATBOT UI含む）
> 2. main.js（CHATBOT連携 + ミニ診断含む）
> 3. CHATBOT設定ドキュメント（プロンプト + 音声仕様）
>
> **完成後に §9 チェックリストで自己検証し、結果を報告しろ。**
