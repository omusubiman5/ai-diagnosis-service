# Botpress Cloud セットアップ指示書
## SKILL60+ MCP連携用

> ⚠ Botpress v12（セルフホスト版）は2025年にサンセット済み
> 新規は Botpress Cloud（クラウド版）のみ利用可能
> 無料枠: 500メッセージ/月

---

## STEP 1: Botpress Cloud アカウント作成

1. https://botpress.com にアクセス
2. 「Get Started Free」をクリック
3. Google or メールでサインアップ
4. ワークスペースが自動作成される

---

## STEP 2: ボット作成

1. ダッシュボードで「Create Bot」をクリック
2. ボット名: `SKILL60-Yoshiko`（ヨシコ）
3. 「Open in Studio」でStudioを開く

---

## STEP 3: Webhook Integration 追加

MCP サーバーと接続するために Webhook を使う。

1. Studio左メニュー → 「Integrations」
2. 「Webhook」を検索 → 「Install to Bot」
3. 設定:
   - **Secret**: 任意の文字列を設定（例: `skill60-secret-xyz`）
     → これが `BOTPRESS_WEBHOOK_SECRET` になる
   - **Allowed Origins**: 空欄（サーバー間通信のため）
4. 「Save」

Webhook URLが発行される（例）:
```
https://webhook.botpress.cloud/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```
→ これをN8Nワークフローで使う

---

## STEP 4: LINE チャネル連携

### 4-1: LINE Developers 設定

1. https://developers.line.biz/ にアクセス
2. プロバイダー作成 → チャネル作成（Messaging API）
3. チャネル名: `SKILL60+ ヨシコ`
4. 以下をメモ:
   - **Channel ID**
   - **Channel Secret**
   - **Channel Access Token**（長期トークンを発行）

### 4-2: Botpress側でLINE設定

1. Studio → 「Integrations」 → 「LINE」検索 → Install
2. 設定画面に入力:
   - Channel ID: （LINE Developersからコピー）
   - Channel Secret: （LINE Developersからコピー）
   - Channel Access Token: （LINE Developersからコピー）
3. 「Save」→ Webhook URLが表示される
4. LINE Developers側の「Webhook URL」にBotpressのURLを貼る
5. 「Webhookの利用」をONにする
6. 「応答メッセージ」をOFFにする

---

## STEP 5: ボットフロー作成（Studio）

### 5-1: ヨシコの人格設定

Studio → 「Bot Settings」 → 「Personality」:
```
あなたは「ヨシコ」という60代の女性です。
福井県出身で、地元の友人のような存在です。
温かく親しみやすい口調で、福井弁を自然に使います。
「あんた」「〇〇さん」と相手を呼びます。
難しい制度や手続きを噛み砕いて伝えます。
押し付けがましくなく、相手の体調も気にかけます。
```

### 5-2: Knowledge Base（知識ベース）設定

Studio → 「Knowledge Bases」 → 「Add Knowledge」:
- 年金の基本情報（テキスト追加）
- 助成金の探し方（テキスト追加）
- JRジパング倶楽部の概要（テキスト追加）

### 5-3: メインフロー

```
[Start]
  ↓
[Trigger: ユーザーメッセージ受信]
  ↓
[Execute Code: MCP APIにPOST]
  ↓
[条件分岐: インテント判定]
  ├→ 「ニュース」→ MCP skill60_fetch_news
  ├→ 「年金」→ MCP skill60_nenkin_news  
  ├→ 「助成金」→ MCP skill60_search_jgrants
  ├→ 「仕事」→ MCP skill60_market_value
  ├→ 「健康」→ MCP skill60_health_info
  ├→ 「天気」→ MCP skill60_weather_advice
  └→ その他 → AI応答（ヨシコの人格で）
  ↓
[返答メッセージ送信]
```

### 5-4: Execute Code（MCP呼び出し）

Studio → ノード → 「Execute Code」カード追加:

```javascript
// SKILL60+ MCPサーバーにリクエスト
const axios = require('axios');

const MCP_URL = 'https://YOUR_VPS_IP:3100/bot';
const SECRET = 'skill60-secret-xyz';

try {
  const response = await axios.post(MCP_URL, {
    intent: 'ask_news',  // ここをインテントに応じて変更
    params: {},
    userId: event.userId
  }, {
    headers: {
      'Content-Type': 'application/json',
      'x-bot-secret': SECRET
    },
    timeout: 30000
  });

  workflow.result = response.data.result || 'すみません、情報を取得できませんでした。';
} catch (error) {
  workflow.result = 'ごめんね、今ちょっと調子悪いみたい。また後で聞いてね。';
}
```

---

## STEP 6: テスト

1. Studio内で `Ctrl+E`（エミュレータ起動）
2. 「おはよう」→ ヨシコの挨拶が返るか確認
3. 「今日のニュース教えて」→ MCP経由でニュースが返るか確認
4. 「年金のこと教えて」→ 年金情報が返るか確認

---

## STEP 7: デプロイ

1. Studio右上の「Publish」ボタンをクリック
2. LINE で SKILL60+ヨシコ を友達追加
3. 実機でテスト

---

## 環境変数（VPS側に設定）

```bash
# .env（Hostinger VPS / SKILL60+ MCP Server）
BOTPRESS_WEBHOOK_SECRET=skill60-secret-xyz
BOTPRESS_WEBHOOK_URL=https://webhook.botpress.cloud/xxxxxxxx-xxxx-...
```

---

## N8N連携（朝7時自動配信）

Botpress Webhook を N8N から叩いて、ヨシコから自動メッセージを送る:

```
[Cron: 毎朝7時]
  ↓
[HTTP Request: SKILL60+ MCP → ニュース取得]
  ↓
[HTTP Request: SKILL60+ MCP → ヨシコ変換]
  ↓
[HTTP Request: Botpress Webhook URL にPOST]
  → ヨシコの口調でLINEに配信
```

---

## 料金

| プラン | メッセージ/月 | 料金 |
|--------|-------------|------|
| Free | 500 | $0 |
| Plus | 使った分だけ | 従量課金 |
| Team | 使った分だけ | $89/月〜 |

> 田中さん1人のテストなら無料枠で十分。
> 10人以上のユーザーで使うならPlusプランを検討。

---

## トラブルシューティング

| 問題 | 対処 |
|------|------|
| LINE で返答が来ない | Webhook URL確認、応答メッセージOFF確認 |
| MCP接続エラー | VPSのファイアウォールでポート3100開放 |
| タイムアウト | Execute Codeのtimeoutを60000に増やす |
| 無料枠超過 | メッセージ数をBotpressダッシュボードで確認 |
