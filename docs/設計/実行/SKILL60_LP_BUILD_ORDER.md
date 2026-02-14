# SKILL60+ LP実装指示書
# このドキュメントだけ読めば実装できる

> **Sonnetへ:**
> このドキュメントは、Opus が KPT会議10回で確定した
> LP の全仕様を 1つにまとめたものです。
> 他のファイルを読む必要はありません。
> 上から順に実装してください。

---

## 0. 前提

### 0.1 SKILL60+ とは
60歳以上の方が「AIの友人」と対話し、60年間の経験をスキルとして再発見するサービス。
LPの唯一の目的は **LINE友だち追加** に導くこと。

### 0.2 技術スタック
- **HTML5 + Vanilla CSS + Vanilla JS**（フレームワーク禁止）
- JS は IntersectionObserver・スクロール検知・FAQ開閉・GA4・Web Speech API・カウントアップのみ
- 全体 **400KB以下**、JS **150行以下**

### 0.3 禁止事項
React / Vue / Next.js / jQuery / Tailwind / Bootstrap / GSAP / Anime.js / Swiper.js / AOS / Font Awesome / Google Fonts CDN直読み / 音声動画の自動再生 / パララックス / スクロールジャック / モーダル / ポップアップ

---

## 1. ページ構成（5セクション）

```
Section 1: 共感ヒーロー    — 心をつかむ（3秒）
Section 2: 出会い          — AIの友人を体験させる
Section 3: 物語            — 3人の Before→After
Section 4: 安心            — 不安を全て潰す
Section 5: 行動            — 最終CTA
+ Sticky Header（常時）
+ CHATBOT（既設ウィジェット活用）
+ スクロールトップボタン
+ フッター
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

### Section 1: 共感ヒーロー

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
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-section) var(--space-inline);
}
@media (prefers-color-scheme: dark) {
  #hero { background: linear-gradient(165deg, #1A1A2E 0%, #16213E 30%, #0F3460 60%, #1B4F72 100%); }
}
```

**コピーの感情設計:**
- line-1「頑張ってきた」→ 労い
- line-2「モヤモヤ」→ 共感
- line-3「必要とされない」→ 本音の代弁（ズキン）
- ★ line-3→line-4 に 1.3秒の「間」（ANIM-13）
- line-4「そんなことはありません」→ 救済

### Section 2: 出会い

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

    <p class="fade-slide speakable">声で話すだけ。入力は不要です。<br>あなたの経験を、友人が一緒に見つけてくれます。</p>

    <div class="feature-points fade-slide">
      <p>🎤 声で話すだけ。タイピング不要</p>
      <p>🤝 あなたと同い年。話しやすい友人</p>
      <p>🔒 名前はニックネームでOK。安心です</p>
    </div>

    <a href="https://line.me/R/ti/p/@skill60plus" class="cta-button">
      友人に会ってみる
    </a>
    <p class="cta-sub">LINEでかんたん・ずっと無料</p>
  </div>
</section>
```

**ANIM-14** : 「すごいじゃない」の吹き出し表示時に背景が暖色に光る

**音声ボタン（任意）:**
Section 2 のAIの友人の台詞だけ事前録音音声を再生できるボタンを設置してもよい。

```html
<button class="voice-play-btn" aria-label="ヨシコの声で聞く" onclick="playAiFriendVoice()">
  🔊 声で聞いてみる
</button>
```

### Section 3: 物語

```html
<section id="stories">
  <div class="section-inner">
    <h2 class="fade-slide speakable">こんな方が、こう変わりました。</h2>

    <div class="stories-container">

      <!-- 物語① 伊藤節子さん -->
      <article class="story-card" role="article">
        <p class="story-before speakable">「お墓の掃除なんて、誰でもできることでしょう？」</p>
        <div class="story-divider">▼</div>
        <p class="story-after speakable">東京に住む方から、月5,000円でお墓の清掃を頼まれるようになりました。"ありがとうございます"と言われるたびに、私にもできることがあるんだと思えます。</p>
        <p class="story-name">伊藤 節子さん（70歳）</p>
      </article>

      <!-- 物語② 上田勝さん -->
      <article class="story-card" role="article">
        <p class="story-before speakable">「自衛隊出身だと言うと、面接で微妙な顔をされました。」</p>
        <div class="story-divider">▼</div>
        <p class="story-after speakable">
          "危機管理力 <span class="count-up" data-target="94">0</span>点、同年代の上位2%"。
          この数字を見て、背筋が伸びました。今は企業の防災アドバイザーをしています。
        </p>
        <p class="story-name">上田 勝さん（63歳）</p>
      </article>

      <!-- 物語③ 前田美智子さん -->
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
  padding: 0 var(--space-inline);
  scrollbar-width: none;
}
.stories-container::-webkit-scrollbar { display: none; }
.story-card { flex: 0 0 85%; scroll-snap-align: center; }
```

### Section 4: 安心

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
          <p>大丈夫です。LINEが使えれば使えます。声で話すだけなので、文字を打つ必要はありません。ボタンで答えることもできます。</p>
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

### Section 5: 行動

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

### フッター

```html
<footer class="site-footer">
  <p class="footer-message">元気な人が増えれば、誰も損をしない。<br>SKILL60+は、あなたの"元気"を応援します。</p>
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
        // カウントアップ対象があれば発火
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

  // ═══ Web Speech API: 読み上げ（CHATBOT「声で聞く」から呼び出し可能）═══
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

  // セクション表示
  const gaObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        dataLayer.push({ event: 'section_view', section_id: e.target.id });
        gaObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('section[id]').forEach(s => gaObserver.observe(s));

  // CTAクリック
  document.querySelectorAll('.cta-button').forEach(btn => {
    btn.addEventListener('click', () => {
      dataLayer.push({
        event: 'cta_click',
        cta_section: btn.closest('section')?.id || 'unknown',
        cta_text: btn.textContent.trim()
      });
    });
  });

  // 電話番号タップ
  document.querySelectorAll('a[href^="tel:"]').forEach(t => {
    t.addEventListener('click', () => dataLayer.push({ event: 'phone_tap' }));
  });

});
```

---

## 6. CHATBOT統合

既設のCHATBOTウィジェットに以下のLP専用プロンプトを設定する。
追加のコーディングは不要。プロンプト設定のみ。

### CHATBOT システムプロンプト

```
あなたはヨシコ。68歳の女性。SKILL60+のAIの友人です。
LPを訪れた方と短い会話をします。

ルール:
- 3ターン以内で会話を完結させる
- 最初の表示で3つの選択肢を出す:
  「🎤 声で聞く」「💬 質問がある」「✨ 試してみたい」
- 「声で聞く」→ 「わかりました。ページを読み上げますね」
  （→ JS の speakSection を順に呼ぶ）
- 「質問がある」→ FAQ対話モード。不安を全て肯定で受け止める
- 「試してみたい」→ 1問ミニ診断:
  「これまでのお仕事で、一番長く続けたことは何ですか？」
  → 回答に対して必ず肯定する（すごい！素敵！）
  → 「LINEでもっと詳しくお話ししませんか？」
  → LINE友だち追加URLを提示

口調:
- 温かく、親しみやすく、でも馴れ馴れしくない
- 敬語ベース。ただし堅すぎない
- 横文字を使わない
- 絶対に否定しない。絶対に批判しない
- 難しい言葉を使わない
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

  <!-- OGP -->
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

  <!-- テーマカラー -->
  <meta name="theme-color" content="#1B4F72" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#1A1A2E" media="(prefers-color-scheme: dark)">

  <!-- 構造化データ -->
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

LP上で絶対に使わない言葉と、代わりに使う言葉。

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

[CSS]
  □ 全変数定義済み
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
  □ 全体 150行以下

[アニメーション]
  □ ANIM-01〜10（機能的）全動作確認
  □ ANIM-11: 数字カウントアップ
  □ ANIM-12: Before→After遷移
  □ ANIM-13: 共感の「間」（delay確認）
  □ ANIM-14: 褒められた温かみ
  □ ANIM-15: 朝が来た（背景変化）
  □ reduced-motion で全無効化

[パフォーマンス]
  □ ページ全体 400KB 以下
  □ Lighthouse Score 90+
  □ 3G回線で3秒以内表示
```

---

> **Sonnetへ:**
> 以上がLP実装の全仕様です。
> HTML1ファイル + CSS1ファイル + JS1ファイルで実装してください。
> CSSは短ければHTML内 `<style>` に inline でも構いません。
> CHATBOT はシステムプロンプトの設定のみです。
> 不明点があれば聞いてください。
