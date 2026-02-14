# SKILL60+ v3.2 Botpress設計・セットアップ指示書

> バージョン: v3.2（MCP v3.1対応）
> Botpress Cloud = 全体のハブ（LLM処理・スケジュール・LINE配信・ナレッジ・分析）
> MCPサーバー v3.1 = 情報取得API（データ専用版）
> N8N = 不要

---

## 全体構成

```
ユーザー（シニア）
  ↕ LINE
Botpress Cloud（全処理のハブ）
  ├─ NLU: 意図分類（ニュース/年金/助成金/仕事/健康/天気/方言）
  ├─ AIカード: LLM処理（ヨシコの声、方言変換、スキル評価、健康アドバイス）
  ├─ Knowledge Agent: FAQ・マニュアル自動応答
  ├─ Cronスケジュール: 朝7時自動配信
  ├─ Summary Agent: 会話要約
  ├─ 分析ダッシュボード: 解決率・エスカレーション率
  └─ Execute Code → HTTP → MCP v3.1（データ取得のみ）
                              ├─ skill60_fetch_news
                              ├─ skill60_nenkin_news
                              ├─ skill60_search_jgrants
                              ├─ skill60_market_value
                              ├─ skill60_health_info
                              ├─ skill60_weather
                              ├─ skill60_dialect_data
                              ├─ skill60_text_to_speech
                              └─ その他
```

**重要**: MCP v3.1は**データ専用版**。LLM処理（方言変換、ヨシコの声等）は全てBotpress AIカードで実行。

---

## STEP 1: Botpress Cloud アカウント・ボット作成

1. https://botpress.com → 「Get Started Free」→ サインアップ
2. ダッシュボード → 「Create Bot」
3. ボット名: `SKILL60-Yoshiko`
4. 「Open in Studio」

---

## STEP 2: LINE Integration

### LINE Developers側
1. https://developers.line.biz/ → プロバイダー作成
2. チャネル作成（Messaging API）
3. チャネル名: `SKILL60+ ヨシコ`
4. メモ: Channel ID / Channel Secret / Channel Access Token

### Botpress Studio側
1. 左メニュー → Integrations → 「LINE」検索 → Install
2. Channel ID / Channel Secret / Channel Access Token を入力
3. Save → 発行されたWebhook URLをLINE Developers側に貼る
4. LINE Developers: 「Webhookの利用」ON、「応答メッセージ」OFF

---

## STEP 3: ヨシコの人格設定（Personality Agent）

Studio → Bot Settings → Personality:

```
あなたは「ヨシコ」という60代の女性です。
最初は標準語で話します。
相手との会話を通じて、相手の出身地を推測していきます。
出身地が特定できたら確認し、一致したらその方言で話します。
温かく親しみやすい口調で、「あんた」「〇〇さん」と呼びます。
難しい制度や手続きを噛み砕いて伝えます。
押し付けがましくなく、相手の体調も気にかけます。
```

---

## STEP 4: ナレッジベース（Knowledge Agent）

Studio → Knowledge Bases → Add Knowledge:

| ナレッジ | 内容 | ソース |
|---------|------|--------|
| 年金基本情報 | 年金の種類・受給条件・手続き | テキスト追加 |
| 助成金ガイド | シニア向け助成金の探し方 | テキスト追加 |
| JRジパング | ジパング倶楽部の概要・割引率 | テキスト追加 |
| 航空シニア割 | 各社シニア割引の概要 | テキスト追加 |
| 健康管理基本 | シニアの健康管理・予防のポイント | テキスト追加 |

→ Knowledge Agentが「よくある質問」ルートを自動応答。

---

## STEP 5: メインフロー設計

### 5-1: エントリーフロー

```
[Start: ユーザーメッセージ受信]
  ↓
[NLU: 意図分類]
  ├─ ニュース → MCP: skill60_fetch_news → AIカード: ヨシコ変換 → 返答
  ├─ 年金 → MCP: skill60_nenkin_news → AIカード: ヨシコ変換 → 返答
  ├─ 助成金 → MCP: skill60_search_jgrants → AIカード: ヨシコ変換 → 返答
  ├─ 仕事 → MCP: skill60_market_value → AIカード: ヨシコ変換 → 返答
  ├─ 健康 → MCP: skill60_health_info → AIカード: 健康アドバイス生成 → 返答
  ├─ 天気 → MCP: skill60_weather → AIカード: 天気+健康アドバイス → 返答
  ├─ 方言 → MCP: skill60_dialect_data → AIカード: 方言学習 → 返答
  ├─ FAQ系 → Knowledge Agent → 返答
  └─ その他 → AIカード: ヨシコとして自由会話 → 返答
```

### 5-2: MCP呼び出し（Execute Code カード）

**重要**: MCP v3.1は標準MCPプロトコルを使用。`/mcp`エンドポイントに直接ツール呼び出しリクエストを送る。

各ルートに配置するExecute Codeの共通パターン:

```javascript
// MCP v3.1 標準プロトコル呼び出し
const MCP_URL = 'https://{VPS_IP}:3100/mcp';

const mcpRequest = {
  jsonrpc: '2.0',
  id: Date.now(),
  method: 'tools/call',
  params: {
    name: 'skill60_fetch_news',  // ← ツール名
    arguments: {
      source: 'nhk',
      category: 'all',
      keyword: event.preview || 'シニア',
      limit: 10
    }
  }
};

try {
  const response = await axios.post(MCP_URL, mcpRequest, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000
  });

  // MCPレスポンスからテキストコンテンツを抽出
  const content = response.data.result?.content || [];
  const textContent = content.find(c => c.type === 'text');
  workflow.mcpResult = textContent?.text || '情報を取得できませんでした';

} catch (error) {
  workflow.mcpResult = `エラー: ${error.message}`;
  console.error('MCP呼び出しエラー:', error);
}
```

### 5-3: 各MCPツール呼び出し例

#### ニュース取得
```javascript
const mcpRequest = {
  jsonrpc: '2.0',
  id: Date.now(),
  method: 'tools/call',
  params: {
    name: 'skill60_fetch_news',
    arguments: {
      source: 'both',  // nhk / yahoo / both
      category: 'all', // top / society / life / business / local / all
      keyword: event.preview || 'シニア 年金',
      limit: 10
    }
  }
};
```

#### 年金情報取得
```javascript
const mcpRequest = {
  jsonrpc: '2.0',
  id: Date.now(),
  method: 'tools/call',
  params: {
    name: 'skill60_nenkin_news',
    arguments: {
      limit: 10
    }
  }
};
```

#### 助成金検索
```javascript
const mcpRequest = {
  jsonrpc: '2.0',
  id: Date.now(),
  method: 'tools/call',
  params: {
    name: 'skill60_search_jgrants',
    arguments: {
      keyword: '高齢者 創業',
      area: user.region || '',
      limit: 10
    }
  }
};
```

#### 求人検索
```javascript
const mcpRequest = {
  jsonrpc: '2.0',
  id: Date.now(),
  method: 'tools/call',
  params: {
    name: 'skill60_market_value',
    arguments: {
      skills: ['経理', '事務'],
      region: user.region || '福井'
    }
  }
};
```

#### 健康情報取得
```javascript
const mcpRequest = {
  jsonrpc: '2.0',
  id: Date.now(),
  method: 'tools/call',
  params: {
    name: 'skill60_health_info',
    arguments: {
      category: 'checkup',  // checkup / exercise / nutrition / mental / general
      keyword: '健康診断',
      region: user.region || '全国'
    }
  }
};
```

#### 天気予報取得
```javascript
const mcpRequest = {
  jsonrpc: '2.0',
  id: Date.now(),
  method: 'tools/call',
  params: {
    name: 'skill60_weather',
    arguments: {
      region: user.region || '福井'
    }
  }
};
```

#### 方言データ取得
```javascript
const mcpRequest = {
  jsonrpc: '2.0',
  id: Date.now(),
  method: 'tools/call',
  params: {
    name: 'skill60_dialect_data',
    arguments: {
      region: user.detectedRegion || '福井',
      keyword: ''
    }
  }
};
```

#### 音声合成（VOICEVOX）
```javascript
const mcpRequest = {
  jsonrpc: '2.0',
  id: Date.now(),
  method: 'tools/call',
  params: {
    name: 'skill60_text_to_speech',
    arguments: {
      text: workflow.yoshikoMessage,
      speaker: 8,  // 春日部つむぎ
      speedScale: 0.9,
      pitchScale: 0.0,
      intonationScale: 1.0
    }
  }
};
```

### 5-4: AIカード（LLM処理）

Execute Code → AI Task カード の順に配置。

**AI Task カード設定例（ヨシコ変換）:**
```
以下のニュース情報をヨシコ（60代女性）の口調で伝えてください。
相手の出身地が判明している場合はその方言を使ってください。
出身地: {{user.detectedRegion || '不明'}}

ニュース情報:
{{workflow.mcpResult}}

ポイント:
- 温かく親しみやすい口調
- 難しい言葉は噛み砕く
- 「あんた」「〇〇さん」と呼びかける
- 相手の体調も気にかける
```

**AI Task カード設定例（健康アドバイス）:**
```
以下の天気情報をもとに、シニア向けの健康アドバイスを生成してください。
熱中症、脱水、転倒、血圧変動に注意。ヨシコ（60代女性）の柔らかい口調で。

天気情報:
{{workflow.mcpResult}}

アドバイス例:
- 暑い日 → 水分補給、外出は朝夕に
- 寒い日 → 暖かい服装、血圧注意
- 雨の日 → 転倒注意、室内運動
```

**AI Task カード設定例（方言学習・推定）:**
```
以下の方言データを参考に、ユーザーの出身地を推定してください。

会話履歴:
{{conversation.messages}}

方言データ:
{{workflow.mcpResult}}

推定方法:
1. 会話から方言の手がかりを探す
2. 地域名の言及、方言的な語彙・表現を確認
3. 確信度が高ければ「もしかして〇〇出身？」と確認
4. 確信度が低ければ会話を続けて情報蓄積
```

### 5-5: 方言会話フロー

```
[ユーザーメッセージ]
  ↓
[AI Transition: 方言の手がかりがあるか判定]
  ├─ 手がかりあり → [Execute Code: MCP skill60_dialect_data で地域データ取得]
  │                → [AI Task: 取得した方言データを参考に地域推定]
  │                → [条件分岐: 確信度が高い？]
  │                    ├─ はい → 「もしかして〇〇出身？」と確認
  │                    │         → ユーザー承認 → user.detectedRegion = 地域名
  │                    └─ いいえ → 会話を続けて情報蓄積
  └─ 手がかりなし → 通常会話を継続
```

---

## STEP 6: Cronスケジュール（朝7時自動配信）

Studio → Workflow → 右クリック → Trigger → Fixed Schedule:

Cron式: `0 7 * * *`（毎朝7時JST）

```
[Cron: 毎朝7時]
  ↓
[Execute Code: MCP skill60_fetch_news（ニュース取得）]
  ↓
[Execute Code: MCP skill60_weather（天気取得）]
  ↓
[AI Task: ニュース+天気をヨシコの口調でまとめる]
  ├─ ユーザーの方言が判明していればその方言で
  └─ 健康アドバイスも含める
  ↓
[Execute Code: MCP skill60_text_to_speech（オプション）]
  ↓
[LINE送信: テキスト（＋音声）]
```

**朝の挨拶AI Taskプロンプト例:**
```
以下のニュースと天気をヨシコ（60代女性）の口調でまとめてください。
出身地が判明していればその方言で話してください。

ニュース:
{{workflow.newsResult}}

天気:
{{workflow.weatherResult}}

形式:
1. 温かい挨拶（「おはようさん」「今日も元気？」等）
2. 天気の説明と健康アドバイス
3. 気になるニュース1-2件を噛み砕いて紹介
4. 励ましの言葉で締める
```

---

## STEP 7: VOICEVOX音声（オプション）

音声合成を追加する場合:

```javascript
// ヨシコメッセージを音声化
const ttsRequest = {
  jsonrpc: '2.0',
  id: Date.now(),
  method: 'tools/call',
  params: {
    name: 'skill60_text_to_speech',
    arguments: {
      text: workflow.yoshikoMessage,
      speaker: 8,  // 春日部つむぎ（落ち着いた女性）
      speedScale: 0.9,  // シニア向けにゆっくり
      pitchScale: 0.0,
      intonationScale: 1.0
    }
  }
};

const ttsResponse = await axios.post(MCP_URL, ttsRequest, {
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000
});

// 注: VOICEVOX Engineが起動している必要がある
```

**注意**: MCP v3.1の`skill60_text_to_speech`はAudioQuery生成のみ。実際の音声合成はVOICEVOX Engineで行う必要があります。

---

## STEP 8: 分析・改善

### Botpress側
- 分析ダッシュボード:
  - ボット自動解決率
  - よく聞かれるトピック
  - 方言特定の成功率
  - エスカレーション率

### MCP側（MongoDB）
- エラーログ確認:
  ```bash
  GET https://{VPS_IP}:3100/health
  ```
- ツール別エラー率:
  - skill60_fetch_news
  - skill60_nenkin_news
  - skill60_search_jgrants
  - その他

---

## STEP 9: テスト・デプロイ

1. **Studio エミュレータ（`Ctrl+E`）でテスト**
   - 各MCP呼び出し正常確認
   - AIカードのヨシコ変換確認
   - 方言会話フロー確認

2. **MCPサーバー動作確認**
   ```bash
   # Health Check
   curl https://{VPS_IP}:3100/health

   # ツール一覧確認
   curl -X POST https://{VPS_IP}:3100/mcp \
     -H "Content-Type: application/json" \
     -d '{
       "jsonrpc": "2.0",
       "id": 1,
       "method": "tools/list"
     }'
   ```

3. **Cronスケジュール発火確認**
   - タイムゾーン設定確認（JST）
   - 初回は手動トリガーでテスト

4. **Publish → LINE実機テスト**
   - LINE友達追加
   - 各機能の動作確認
   - 方言会話のテスト

---

## 環境変数（Botpress側）

Bot Settings → Variables:
```
MCP_URL=https://{VPS_IP}:3100/mcp
VOICEVOX_URL=http://{VPS_IP}:50021
DEFAULT_REGION=福井
```

---

## MCP v3.1 アーキテクチャの重要ポイント

### データ専用版の特徴
- **LLM処理なし**: MCPはデータ取得のみ
- **方言変換**: Botpress AIカードで実行
- **ヨシコの声**: Botpress AIカードで実行
- **健康アドバイス**: Botpress AIカードで実行

### MCPツールの役割
| ツール | 返却データ | Botpress側の処理 |
|--------|-----------|-----------------|
| skill60_fetch_news | ニュース生データ | AIカードでヨシコ変換 |
| skill60_dialect_data | 方言辞書データ | AIカードで方言学習・推定 |
| skill60_health_info | 健康情報URL | AIカードでアドバイス生成 |
| skill60_weather | 天気生データ | AIカードで健康アドバイス |
| skill60_market_value | 求人生データ | AIカードでマッチング分析 |

---

## 料金

| プラン | メッセージ/月 | 料金 |
|--------|-------------|------|
| Free | 500 | $0 |
| Plus | 従量課金 | 使った分だけ |
| Team | 従量課金 | $89/月〜 |

**LLM処理コスト**: Botpress AIカードの利用料（従量課金）に含まれる。

---

## トラブルシューティング

| 問題 | 対処 |
|------|------|
| LINEで返答が来ない | Webhook URL確認、応答メッセージOFF確認 |
| MCP接続エラー | VPSファイアウォールでポート3100開放 |
| MCPタイムアウト | Execute Codeのtimeoutを60000に増やす |
| MCP JSONRPCエラー | リクエスト形式確認（method, params） |
| Cron発火しない | タイムゾーン設定確認（JST） |
| 無料枠超過 | ダッシュボードでメッセージ数確認 |
| AIカード応答が不自然 | プロンプト調整、Personality設定見直し |
| 方言データ不足 | NINJALデータソース追加 |
| VOICEVOX接続エラー | VOICEVOX Engine起動確認 |
| MCP全体の状況確認 | GET /health でツール別ステータス確認 |

---

## 参考リンク

- Botpress Documentation: https://botpress.com/docs
- MCP Protocol Specification: https://spec.modelcontextprotocol.io/
- SKILL60+ MCP Server (v3.1): https://github.com/omusubiman5/skill60-mcp-server
- NINJAL 方言データベース: https://www.ninjal.ac.jp/database/
- VOICEVOX Engine: https://voicevox.hiroshiba.jp/

---

## 次のステップ（v3.3以降）

- LINE LIFF統合（Webアプリ連携）
- 画像認識（健康診断結果の読み取り）
- 位置情報活用（近隣施設情報）
- 音声入力対応（シニア向けUI）
- マルチモーダル対応（画像＋テキスト）
