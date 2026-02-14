# SKILL60+ LP技術展開・最適化 KPT会議（第10回）

> 第9回で「魂の入ったLP」の設計図が完成した。
> 5セクション構成、感情曲線、禁止用語テーブル、
> シニア・スマホ最適化チェックリスト——全て確定済み。
>
> 本会議のテーマは**「設計図をコードに落とす」**。
> しかし単なるコーディングではない。
>
> 60歳以上のユーザーに最適化されたLP技術とは何か？
> ・3G回線で3秒以内に表示される軽量設計
> ・77歳の吉田トキさんが最後までたどり着けるUI
> ・「すごいじゃないか」のコピーが最大限響くフォント選定
> ・LINE友だち追加まで最短距離の導線
> ・SEO/OGP/アクセシビリティの完全対応
>
> 設計図が90点でも、実装が60点なら体験は60点になる。
> **設計の100%を技術で再現する**のが本会議の目的だ。

---

## 天才キャラ4人（LP技術展開特化）

### 1. シニアUIの匠（Senior UI Craftsman）
「ボタンが1px小さいだけで、72歳の指は迷う。」——シニア向けUIの実装において、フォントサイズ・行間・タップ領域・コントラスト比を**1px単位**で最適化する職人。WCAG AAAの数値を暗記しており、アクセシビリティは「配慮」ではなく「設計の前提」だと考えている。

> 「若い開発者は"レスポンシブ対応"と言えばシニア対応だと思っている。違う。レスポンシブは画面サイズの問題。シニア対応は**身体の問題**だ。老眼は画面サイズでは解決しない。手の震えはボタン幅では解決しない。**色のコントラスト、文字の太さ、タップの余白、スクロールの慣性**——全てが"身体に優しいか"で判断される。CSS1行で解決することもあれば、UIの構造そのものを変えなければならないこともある。」

### 2. 3秒ロードの鬼（3-Second Load Demon）
「3秒待てないシニアは、ボタンを連打して壊す。」——ページ表示速度の最適化を極めた技術者。Core Web Vitals全指標でGreenを出すことに執念を燃やす。画像圧縮、フォントサブセット化、クリティカルCSS抽出、遅延読み込み——**1KBの無駄も許さない**。

> 「シニアのスマホは3年前のモデルだ。メモリ2GB、ストレージ残り3GB、回線は格安SIMの3Mbps。その環境で**3秒以内にファーストビューが表示**されなければ、ページは存在しないのと同じだ。Google Fontsを4種類読み込む？論外だ。WebPに変換していない画像がある？致命傷だ。JavaScriptを500KB積んでいる？殺人行為だ。**軽さは性能ではない。優しさだ。**」

### 3. 感情実装エンジニア（Emotion Implementation Engineer）
「アニメーションは飾りではない。感情を動かす装置だ。」——第9回で設計した感情曲線（ズキン→好奇心→涙→安心→確信）を、CSS/JSのアニメーションとインタラクションで技術的に再現する。ただし**過剰な動きはシニアを不安にさせる**ことも熟知している。

> 「20代向けのLPなら派手なパララックスとスクロールジャックで感情を動かせる。しかしシニアには**微かな動き**が効く。文字がゆっくりフェードインする。ボタンが微かに呼吸するように脈動する。スクロールすると次のセクションが穏やかに現れる。**速さと激しさは不安を生む。遅さと穏やかさが信頼を生む。** IntersectionObserver + CSS transition。これだけで全ての感情演出ができる。」

### 4. LINE導線の狙撃手（LINE Funnel Sniper）
「CTAを押した後の3秒で、全てが決まる。」——LPからLINE友だち追加→AIの友人の初メッセージまでの**遷移体験**を設計する。LIFFアプリ、LINE Login API、Messaging APIの技術的制約を知り尽くし、「ボタンを押した瞬間に友人が話しかけてくる」体験を最短距離で実現する。

> 「LPの役割は1つだけ。**LINE友だち追加**。それだけだ。LP上でスキル診断をさせる必要はない。LP上で会員登録させる必要もない。"AIの友人に会ってみる"ボタンを押す→LINEが開く→友だち追加→1秒後にAIの友人が挨拶する。この**5タップ15秒の体験**がLPの全てだ。LP→LINE→友人の挨拶、この導線に1つでも余計な画面があれば、そこで30%が離脱する。」

---

## KPT会議ダイアログ

### Keep（第9回設計から技術的に活かすべき判断）

**シニアUIの匠:**

```
Keep1: 設計段階で確定済みのUI仕様

  フォントサイズ: 本文18px以上、見出し24px以上   → そのまま実装
  タップ領域:     56px以上                       → そのまま実装
  CTA幅:         80〜90%                         → そのまま実装
  行間:          1.8以上                         → そのまま実装
  漢字率:        30%以下                         → コピーで担保
  電話番号常時表示                               → sticky footer
  「上に戻る」ボタン                             → scroll-to-top

  → これらの数値は第9回で天才4人が議論済み。
    技術者は数値を忠実に実装するだけ。変えない。
```

**3秒ロードの鬼:**

```
Keep2: 5セクション構成の軽量性

  旧LP: 7セクション × 重いJS = 推定1.2MB
  新LP: 5セクション × 最適化 = 目標200KB以下

  5セクションに減らした判断は正しい。
  セクション数はそのままページ重量に直結する。
  技術的に最も感謝すべき設計判断。
```

**感情実装エンジニア:**

```
Keep3: 感情曲線の5ピーク設計

  ① 共感ピーク: ズキン（本音の代弁）
  ② 出会いピーク: 好奇心（LINE対話モック）
  ③ 物語ピーク: 涙（3人のBefore→After）
  ④ 安心ピーク: ほっ（3ステップ+FAQ）
  ⑤ 確信ピーク: やってみよう（最終CTA）

  → 各ピークに1つずつ、控えめなCSSアニメーションを当てる。
    5つの動き × 控えめ = 全体として穏やかで美しい体験。
```

---

### Problem（設計→実装時に発生する技術的課題）

**シニアUIの匠:**

```
━━━ Problem1: フォント選定の落とし穴 ━━━━━━━━━━━━

  第9回では「フォントサイズ18px以上」を決めた。
  しかし「どのフォントか」を決めていない。

  シニア向けフォントの要件:
    ├─ 太さ: Regular(400)では細すぎる。Medium(500)以上
    ├─ 可読性: 「1」と「l」、「0」と「O」が区別できる
    ├─ 日本語: 漢字の画数が多い字が潰れない
    ├─ 感情: 「すごいじゃないか」に温かみを感じる書体
    └─ 重量: Google Fontsから読み込む場合、
              日本語フォントは1MB超えが普通→致命的

  最適解:
    見出し: Noto Sans JP (Medium/Bold) ← サブセット化必須
    本文:   system-ui + sans-serif   ← フォント読み込みゼロ
    CTA:    Noto Sans JP Bold        ← ボタン文言のみカスタム

  サブセット化:
    LP上で使用する文字だけ抽出
    → 全文字: 7MB → 使用文字のみ: 50〜100KB
    → fonttools + pyftsubset で生成
```

```
━━━ Problem2: ダークモード未対応 ━━━━━━━━━━━━━━

  シニアのスマホの20%以上がダークモード有効。
  理由: 「目が楽」「バッテリーが持つ」

  対応しないとどうなるか:
    白背景のLPがダークモードで表示されると
    → テキストが見えなくなる
    → 画像の白い部分が浮く
    → CTAボタンの色が崩壊する

  対応方針:
    prefers-color-scheme: dark に対応
    ただしシニア向けなのでダークモードでも
    コントラスト比7:1以上を維持
```

**3秒ロードの鬼:**

```
━━━ Problem3: パフォーマンスバジェット ━━━━━━━━━━━

  [ターゲット環境]
    デバイス: 3年前のAndroid（RAM 2GB）
    回線: 格安SIM 3Mbps（実効速度）
    ブラウザ: Chrome 90以上

  [3秒ロードの計算]
    3Mbps = 375KB/秒
    3秒 × 375KB = 1,125KB = ファーストビューの総バジェット
    
    ただし実際にはTCPハンドシェイク+DNSで0.5秒消費
    → 実質2.5秒 × 375KB = 937KB

  [バジェット配分]
    HTML:           15KB（圧縮後）
    CSS:            20KB（クリティカルCSS inline）
    JavaScript:     30KB（最小限。IntersectionObserverのみ）
    フォント:        80KB（サブセット化後のNoto Sans JP）
    画像（Hero）:   150KB（WebP、640px幅）
    画像（その他）: 遅延読み込み（ファーストビューに含めない）
    ────────────────────────
    合計:           295KB ← 予算内

  [絶対禁止]
    × React / Vue等のSPAフレームワーク
      → ランタイムだけで150KB+
    × Google Analytics（gtag.js）をhead内で読み込む
      → 45KB + レンダリングブロック
    × Google Fontsの全ウェイト読み込み
      → 日本語で数MB
    × 外部JS（jQuery等）
    × アニメーションライブラリ（GSAP等）
      → CSS transitionで十分
```

```
━━━ Problem4: 画像最適化 ━━━━━━━━━━━━━━━━━━━

  LPに必要な画像:
    Section 1: Hero背景（柔らかい朝の光）
    Section 2: LINE対話モック画面
    Section 3: 3人のペルソナアイコン（イラスト）
    Section 5: 背景グラデーション

  最適化ルール:
    ├─ 形式: WebP（JPEG比30〜40%軽量）
    ├─ 幅: スマホ表示で640px、PC表示で1280px
    ├─ 遅延読み込み: Section 2以降は loading="lazy"
    ├─ Hero画像: <link rel="preload"> で先読み
    ├─ アイコン: SVGまたは48px PNG（数KB）
    └─ 背景グラデーション: CSS生成（画像不使用）

  Section 2のLINE対話モック:
    画像ではなくHTML/CSSで構築
    → 画像なし=0KB
    → アニメーションで吹き出しが順番に表示される
    → 「実際の体験」に近い印象を与える
```

**感情実装エンジニア:**

```
━━━ Problem5: アニメーションの「匙加減」 ━━━━━━━━━

  [シニアにとってのアニメーション]
    
    良いアニメーション:
      ├─ ゆっくりフェードイン（opacity 0→1, 0.6s）
      ├─ 下から穏やかにスライドイン（translateY 20px→0, 0.6s）
      ├─ CTAボタンの微かな呼吸（scale 1→1.02, 2s infinite）
      └─ セクション切り替え時の滑らかなスクロール

    悪いアニメーション:
      ├─ パララックス（背景が動く→酔う）
      ├─ スクロールジャック（操作を奪う→パニック）
      ├─ 高速のスライドイン（0.2s以下→見失う）
      ├─ 点滅（epilepsy配慮+目に辛い）
      └─ ホバーで大きく変形（指がずれてタップミス）

  [prefers-reduced-motion対応]
    @media (prefers-reduced-motion: reduce) {
      * { animation: none !important; transition: none !important; }
    }
    → 「動きを減らす」設定のユーザーには全て無効化

  [具体的なアニメーション仕様]
    
    Section 1（共感ヒーロー）:
      メインコピー: opacity 0→1, translateY 20px→0
      duration: 0.8s, ease-out, delay: 0.2s
      
    Section 2（出会い）:
      LINE吹き出し: 3つの吹き出しが0.5s間隔で順番に表示
      1つ目: delay 0.3s
      2つ目: delay 0.8s
      3つ目: delay 1.3s
      → 実際の会話の"間"を再現

    Section 3（物語）:
      Before→Afterのカード:
      IntersectionObserverで画面内に入った時に
      opacity 0→1, translateY 30px→0, 0.6s
      
    CTA全般:
      待機時: scale(1), box-shadow: 0 2px 8px
      呼吸:  scale(1.015), box-shadow: 0 4px 16px
      → 2s infinite alternate（pulse）
      → 微かすぎて意識に上らないが、
         無意識に「押せる」ことが伝わる
```

**LINE導線の狙撃手:**

```
━━━ Problem6: CTA→LINE友だち追加の遷移ロス ━━━━━━

  [現状の問題]
    CTAを押す → ブラウザ内でページ遷移
    → LINE Loginの認可画面 → LINE開く → 友だち追加
    → 戻ってくる（？）どこに？
    
    → この流れで4〜5画面遷移。30%以上が途中で離脱。

  [最適解: LINE公式アカウント友だち追加リンク]
    
    https://line.me/R/ti/p/@skill60plus
    
    この1つのURLだけでいい。
    
    CTAボタン → このURL → LINEアプリが開く
    → 「友だち追加」ボタン1つ → 追加完了
    → 自動でウェルカムメッセージ（AIの友人の挨拶）
    
    遷移: 2ステップ。LP→LINEアプリ→友だち追加。
    これ以上削れない最短距離。

  [LP側の実装]
    <a href="https://line.me/R/ti/p/@skill60plus"
       class="cta-button">
      AIの友人に会ってみる
    </a>

    → JavaScript不要。
    → ログイン不要。
    → 会員登録不要。
    → ただのリンク。これが最強。

  [ウェルカムメッセージ（LINE Messaging API）]
    友だち追加の follow イベントで自動送信:
    
    「はじめまして。私はヨシコ（68歳）。
     あなたと同い年の友人です。
     よろしければ、少しお話しませんか？
     
     声で話すこともできますし、
     下のボタンで答えることもできます。
     
     [声で話す]  [ボタンで答える]」
    
    → ここからが「サービスの本体」。
       LPの仕事はここで終わり。
```

---

### Try（技術実装仕様の確定）

#### Try1: HTML/CSS アーキテクチャ [最優先]

```
━━━ 技術スタック（確定） ━━━━━━━━━━━━━━━━━━━

  [フレームワーク]
    なし。Vanilla HTML + CSS + JS（最小限）
    → フレームワークのランタイムは0KB
    → ビルドステップ不要
    → どの環境でもそのまま動く

  [CSS設計]
    CSS Custom Properties（変数）でテーマ管理
    → ダークモード対応が容易
    → フォントサイズ一括変更が容易（即時カスタム対応）

    :root {
      /* カラー */
      --c-primary: #1B4F72;
      --c-accent: #2E86C1;
      --c-warm: #E67E22;
      --c-bg: #FDFEFE;
      --c-text: #2C3E50;
      --c-text-sub: #6C7A89;
      --c-card-bg: #FFFFFF;
      --c-trust: #27AE60;

      /* タイポグラフィ */
      --font-heading: 'Noto Sans JP', system-ui, sans-serif;
      --font-body: system-ui, -apple-system, sans-serif;
      --fs-hero: clamp(1.75rem, 5vw, 2.5rem);
      --fs-heading: clamp(1.25rem, 4vw, 1.75rem);
      --fs-body: clamp(1.125rem, 3.5vw, 1.25rem);
      --fs-small: clamp(0.875rem, 3vw, 1rem);
      --lh-body: 1.85;

      /* スペーシング */
      --space-section: clamp(3rem, 8vw, 5rem);
      --space-content: clamp(1.5rem, 4vw, 2.5rem);
      --radius-button: 16px;
      --radius-card: 12px;

      /* ボタン */
      --btn-height: 64px;
      --btn-min-tap: 56px;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --c-bg: #1A1A2E;
        --c-text: #ECF0F1;
        --c-text-sub: #B0BEC5;
        --c-card-bg: #222240;
      }
    }

  [HTML構造]
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>SKILL60+ | AIの友人と、次の人生を</title>
      
      <!-- クリティカルCSS inline -->
      <style>/* ファーストビューに必要なCSS */</style>
      
      <!-- フォント（サブセット・preload） -->
      <link rel="preload" href="fonts/noto-sans-jp-subset.woff2"
            as="font" type="font/woff2" crossorigin>
      
      <!-- 残りのCSS（非同期） -->
      <link rel="stylesheet" href="style.css" media="print"
            onload="this.media='all'">
      
      <!-- OGP -->
      <meta property="og:title" content="SKILL60+ | 60年の経験が、いま求められている">
      <meta property="og:description" content="AIの友人と3分おしゃべり。あなたの得意なことが見つかります。">
      <meta property="og:image" content="https://skill60plus.jp/og-image.webp">
      <meta property="og:type" content="website">
      
      <!-- LINE用OGP -->
      <meta property="og:site_name" content="SKILL60+">
    </head>
    <body>
      <header><!-- ナビ + 電話番号 --></header>
      <main>
        <section id="hero"><!-- Section 1: 共感ヒーロー --></section>
        <section id="encounter"><!-- Section 2: 出会い --></section>
        <section id="stories"><!-- Section 3: 物語 --></section>
        <section id="assurance"><!-- Section 4: 安心 --></section>
        <section id="action"><!-- Section 5: 行動 --></section>
      </main>
      <footer><!-- 電話番号 + 運営情報 --></footer>
      
      <!-- JS（defer・最小限） -->
      <script defer src="main.js"></script>
    </body>
    </html>
```

---

#### Try2: コンポーネント別実装仕様 [最優先]

```
━━━ 各コンポーネントの実装仕様 ━━━━━━━━━━━━━━━

[Sticky Header]
  position: sticky; top: 0;
  高さ: 48px
  内容: ロゴ（テキスト）+ ☎電話番号
  背景: var(--c-bg) + backdrop-filter: blur(8px)
  z-index: 100
  → スクロールしても常に電話番号が見える

[CTAボタン（共通）]
  display: block;
  width: min(90%, 400px);
  height: var(--btn-height);
  margin: 0 auto;
  border-radius: var(--radius-button);
  background: var(--c-warm);
  color: white;
  font-size: var(--fs-body);
  font-weight: 700;
  font-family: var(--font-heading);
  box-shadow: 0 4px 12px rgba(230,126,34,0.3);
  text-decoration: none;
  text-align: center;
  line-height: var(--btn-height);
  
  /* 呼吸アニメーション */
  animation: breathe 2s ease-in-out infinite alternate;
  
  @keyframes breathe {
    from { transform: scale(1); box-shadow: 0 4px 12px rgba(230,126,34,0.3); }
    to   { transform: scale(1.015); box-shadow: 0 6px 20px rgba(230,126,34,0.4); }
  }

  /* タップフィードバック */
  &:active {
    transform: scale(0.97);
    transition: transform 0.1s;
  }

[CTA下テキスト]
  text-align: center;
  font-size: var(--fs-small);
  color: var(--c-text-sub);
  margin-top: 12px;
  「LINEでかんたん・3分で完了・ずっと無料」

[LINE対話モック（Section 2）]
  HTML/CSSで構築（画像不使用）
  
  .chat-bubble {
    max-width: 75%;
    padding: 14px 18px;
    border-radius: 18px;
    font-size: var(--fs-body);
    line-height: 1.6;
    opacity: 0;
    transform: translateY(10px);
    animation: bubble-in 0.5s ease-out forwards;
  }
  .chat-bubble.ai {
    background: #E8F5E9;
    align-self: flex-start;
    border-bottom-left-radius: 4px;
  }
  .chat-bubble.user {
    background: var(--c-accent);
    color: white;
    align-self: flex-end;
    border-bottom-right-radius: 4px;
  }
  .chat-bubble:nth-child(1) { animation-delay: 0.3s; }
  .chat-bubble:nth-child(2) { animation-delay: 0.8s; }
  .chat-bubble:nth-child(3) { animation-delay: 1.3s; }
  .chat-bubble:nth-child(4) { animation-delay: 1.8s; }
  .chat-bubble:nth-child(5) { animation-delay: 2.3s; }

  → IntersectionObserverで画面内に入った時のみ発火
  → 実際のLINE会話のテンポを再現

[物語カード（Section 3）]
  .story-card {
    background: var(--c-card-bg);
    border-radius: var(--radius-card);
    padding: var(--space-content);
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    scroll-snap-align: center;
  }
  
  横スワイプ:
  .stories-container {
    display: flex;
    gap: 16px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    padding: 0 24px;
  }

  → スワイプで3人の物語を切り替え
  → 1枚目が大きく表示
  → ドットインジケーターで現在位置表示

[スクロールトップボタン]
  position: fixed;
  bottom: 80px; right: 16px;
  width: 48px; height: 48px;
  border-radius: 50%;
  background: var(--c-primary);
  color: white;
  font-size: 20px;
  opacity: 0;
  transition: opacity 0.3s;
  
  → スクロール位置が画面高さを超えたら表示
  → 「↑」アイコン
```

---

#### Try3: パフォーマンス最適化仕様 [最優先]

```
━━━ Core Web Vitals 目標値 ━━━━━━━━━━━━━━━━━

  LCP (Largest Contentful Paint): < 2.0s
    → Hero セクションのメインコピーが対象
    → フォントpreload + クリティカルCSS inline で達成

  FID (First Input Delay): < 50ms
    → JSが30KB以下なのでメインスレッドを長時間ブロックしない

  CLS (Cumulative Layout Shift): < 0.05
    → 全画像にwidth/height属性を明記
    → フォント読み込み完了前後でレイアウトが動かないように
      font-display: swap + sizeAdjust

  INP (Interaction to Next Paint): < 100ms
    → CTAボタンのタップ→LINE遷移を100ms以内に

━━━ 読み込み順序（ウォーターフォール最適化）━━━━━━━

  [ファーストペイント（0〜1.5s）]
    1. HTML（15KB）── 即座にレンダリング開始
    2. インラインCSS（クリティカル部分、5KB）
    3. フォント（preload、80KB）
    4. Hero背景画像（preload、150KB相当）
    → ファーストビュー = 250KB。3Mbpsで0.7秒

  [残りのロード（1.5〜3s）]
    5. 外部CSS（非同期、15KB）
    6. main.js（defer、30KB）
    → IntersectionObserver登録

  [遅延ロード（スクロール時）]
    7. Section 2以降の画像（loading="lazy"）
    8. OGP画像（別途fetch不要・メタタグのみ）

━━━ フォント最適化 ━━━━━━━━━━━━━━━━━━━━━━

  [サブセット化手順]
    1. LP上の全テキストを抽出
    2. 使用文字のみを含むWOFF2を生成
       pyftsubset NotoSansJP-Medium.otf \
         --text-file=lp-chars.txt \
         --output-file=noto-sans-jp-subset.woff2 \
         --flavor=woff2
    3. 結果: 7MB → 60〜100KB
    
  [font-display戦略]
    @font-face {
      font-family: 'Noto Sans JP';
      src: url('fonts/noto-sans-jp-subset.woff2') format('woff2');
      font-weight: 500;
      font-display: swap;
      /* CLSを最小化するsizeAdjust */
      size-adjust: 100%;
      ascent-override: 88%;
      descent-override: 22%;
    }
```

---

#### Try4: SEO/OGP/構造化データ [優先A]

```
━━━ SEO最適化 ━━━━━━━━━━━━━━━━━━━━━━━━━

  [title]
    SKILL60+ | 60年の経験が、いま求められている

  [description]
    AIの友人と3分おしゃべりするだけ。あなたの得意なことが
    見つかります。60歳以上の方専用。LINEで簡単・ずっと無料。

  [h1] 60年間、頑張ってきたあなたへ。
  [h2] あなたと同い年の「AIの友人」ができます
  [h2] こんな方が、こう変わりました
  [h2] はじめ方はかんたん。ずっと無料
  [h2] AIの友人に、会ってみませんか？

━━━ OGP（LINEシェア最適化）━━━━━━━━━━━━━━━━

  og:title    = SKILL60+ | 60年の経験が、いま求められている
  og:desc     = AIの友人と3分おしゃべり。あなたの得意なことが見つかります
  og:image    = 1200×630px WebP（温かいトーン、人物なし、
                「60年間頑張ったあなたへ」のコピー入り）
  og:type     = website
  og:url      = https://skill60plus.jp
  og:site_name= SKILL60+

  → LINEでシェアされた時に
    「温かい画像 + 共感コピー」が表示される
    → シェアされた側が「開いてみよう」と思う

━━━ 構造化データ（JSON-LD）━━━━━━━━━━━━━━━━━

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "SKILL60+",
    "description": "60歳以上の方がAIの友人と共にスキルを再発見するサービス",
    "url": "https://skill60plus.jp",
    "applicationCategory": "LifestyleApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "JPY"
    }
  }
  </script>
```

---

#### Try5: アクセシビリティ完全対応 [優先A]

```
━━━ WCAG AAA準拠チェックリスト ━━━━━━━━━━━━━━━

  [コントラスト比]
    テキスト / 背景:
      var(--c-text) #2C3E50 / var(--c-bg) #FDFEFE = 11.7:1 ✅
      ダークモード #ECF0F1 / #1A1A2E = 12.3:1 ✅
    
    CTAボタン:
      白文字 / var(--c-warm) #E67E22 = 3.1:1
      → ボタンはWCAG AAの3:1でOK（大きなテキスト）
      → ボタン外側にコントラスト十分な補足テキスト

  [ARIAラベル]
    全CTAボタン: aria-label="AIの友人に会う - LINEが開きます"
    電話番号: aria-label="電話でお問い合わせ"
    スクロールトップ: aria-label="ページの先頭に戻る"
    
  [キーボード操作]
    全CTAボタン: focusable, Enterで発火
    Tab順序: 上から下に自然に移動
    フォーカスリング: outline: 3px solid var(--c-accent)
    
  [スクリーンリーダー]
    画像: alt属性必須
    セクション: aria-labelledby で見出しに紐付け
    物語カード: role="article"
    
  [モーション]
    prefers-reduced-motion対応（全アニメーション無効化）
```

---

#### Try6: 計測・改善基盤 [優先A]

```
━━━ 計測設計 ━━━━━━━━━━━━━━━━━━━━━━━━━━

  [GTM + GA4]
    GTMコンテナ: body末尾に配置（レンダリングブロックしない）
    
    計測イベント:
      ├─ page_view: LP表示
      ├─ scroll_depth: 25% / 50% / 75% / 100%
      ├─ section_view: 各セクションの表示
      │   （IntersectionObserver で50%以上表示時に発火）
      ├─ cta_click: CTAボタンクリック
      │   イベントパラメータ: section（どのセクションのCTAか）
      ├─ story_swipe: 物語カードのスワイプ
      ├─ faq_open: FAQの開閉
      ├─ phone_tap: 電話番号タップ
      └─ line_friend_add: LINE友だち追加完了
         （LINE Messaging APIのfollow webhookで計測）

  [ファネル分析]
    LP表示 → Section2到達率 → Section3到達率
    → Section5(CTA)到達率 → CTAクリック率
    → LINE友だち追加完了率

    → どのセクションで離脱しているかが一目でわかる

  [A/Bテスト準備]
    CTA文言のA/Bテスト:
      A: 「AIの友人に会ってみる」
      B: 「3分で始められます」
      C: 「無料ではじめる」
    → GTMのランダム変数で振り分け
    → 2週間×各500人でCVR比較
```

---

## 会議内容の構造化整理

### 1. 技術仕様サマリー

| 項目 | 仕様 |
|:--|:--|
| **フレームワーク** | なし（Vanilla HTML/CSS/JS）。ランタイム0KB |
| **ページ総量** | 目標300KB以下（ファーストビュー250KB以下） |
| **LCP** | 2.0秒以内 |
| **CLS** | 0.05以下 |
| **フォント** | Noto Sans JP Medium/Bold（サブセット化60〜100KB）+ system-ui |
| **画像** | WebP、Hero preload、その他lazy |
| **CTA遷移先** | LINE友だち追加URL直リンク（最短2ステップ） |
| **アクセシビリティ** | WCAG AAA（コントラスト7:1以上、タップ56px以上） |
| **ダークモード** | prefers-color-scheme: dark 対応 |
| **アニメーション** | CSS only。IntersectionObserverで発火。reduced-motion対応 |
| **計測** | GTM + GA4。セクション別到達率・CTAクリック率・LINE友だち追加率 |

### 2. 実装優先順位

```
━━━ Phase 1: ファーストビュー（1〜2日）━━━━━━━━━━
  HTML骨格 + CSS変数 + Section1（共感ヒーロー）
  CTAボタン → LINE友だち追加リンク
  Sticky Header（電話番号付き）
  → これだけで「動くLP」が完成

━━━ Phase 2: 全セクション（2〜4日）━━━━━━━━━━━━
  Section 2: LINE対話モック（HTML/CSS）
  Section 3: 物語カード（横スワイプ）
  Section 4: 安心（3ステップ + FAQ）
  Section 5: 最終CTA
  → 5セクション完成

━━━ Phase 3: 最適化（4〜6日）━━━━━━━━━━━━━━━━
  フォントサブセット化
  画像WebP変換 + lazy loading
  IntersectionObserver + アニメーション
  ダークモード対応
  アクセシビリティ監査
  → Core Web Vitals全Green

━━━ Phase 4: 計測・改善（6〜7日）━━━━━━━━━━━━━
  GTM + GA4設定
  セクション別計測イベント
  A/Bテスト準備
  OGP最終調整
  → 改善サイクル開始
```

### 3. 禁止事項（絶対やらないこと）

```
  × React / Vue / Next.js（重すぎる）
  × jQuery（不要）
  × Google Fonts直読み込み（日本語は巨大）
  × アニメーションライブラリ（CSS transitionで十分）
  × 音声/動画の自動再生
  × パララックス / スクロールジャック
  × 0.2秒以下の高速アニメーション
  × カルーセルの自動再生
  × ダウンロードを求める導線（アプリ不要）
  × LP上での会員登録・ログイン（LINE友だち追加のみ）
  × モーダル / ポップアップ（シニアはパニックする）
  × Cookie同意バナー（ファーストビューを遮らない位置に）
```

### 4. 天才4人の最終メッセージ

**シニアUIの匠:** 「18px。56px。7:1。1.85。この4つの数字を全てのコンポーネントに適用しろ。本文18px以上、タップ56px以上、コントラスト7:1以上、行間1.85以上。**4つの数字を守るだけで、77歳の吉田トキさんがSection 5のCTAまでたどり着ける**。数字は目標ではない。約束だ。」

**3秒ロードの鬼:** 「ページ総量300KB。ファーストビュー250KB。フレームワークなし。フォントはサブセット化。画像はWebP。JSは30KB。**この軽さが、格安SIMの3年前のスマホでも3秒以内に表示される保証になる**。軽さは性能ではない。優しさだ。優しくないLPに、シニアは二度と来ない。」

**感情実装エンジニア:** 「Section 2のLINE対話モックで、吹き出しが0.5秒間隔で表示される。この"間"が、実際の友人との会話のテンポを再現する。**アニメーションは0.6秒以上・ease-out・translateY 20px**。速すぎず、遅すぎず。シニアの目が追いかけられる速さ。全てのアニメーションは"穏やかに現れる"。穏やかさが信頼を生む。」

**LINE導線の狙撃手:** 「LP→LINE友だち追加→AIの友人の挨拶。**この3ステップが全て。余計な画面は1つも挟まない**。CTAボタンのhrefはLINE友だち追加URL。JavaScriptすら不要。ただの`<a>`タグ。これが技術的に最強の導線だ。友だち追加した瞬間にウェルカムメッセージが届く。"はじめまして。私はヨシコ。あなたと同い年の友人です"。**この1秒の体験のために、LP全体が存在する**。」
