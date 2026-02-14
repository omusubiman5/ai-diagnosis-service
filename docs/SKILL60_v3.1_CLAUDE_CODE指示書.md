# SKILL60+ v3.1 実装指示書（Claude Code用）

> リポジトリ: https://github.com/omusubiman5/skill60-mcp-server
> 現状: v2.1（9ツール稼働中・mainブランチ）
> 目標: v3.1（v2.1に追加。12ツール + MongoDB + ヘルスチェック強化）
> ブランチ: `feat/v3.1` で作業し、完了後mainにマージ

---

## 設計思想

1. **MCPサーバー = 情報取得のみ。LLMプロンプトは置かない。**
2. **全エラーをMongoDB Atlasに記録。**
3. **`GET /health` で全ツール生死+直近エラー表示。**
4. **v2.1の既存ツールは壊さない。追加のみ。**

---

## Claude Code 初期設定

実装前に `/permissions` で以下を追加（承認なし実行）:
```
Bash(*)
Write(*)
Edit(*)
Read(*)
```

---

## サブエージェント構成

| Agent | 担当 | ファイル | 依存 |
|-------|------|----------|------|
| A1 | MongoDB接続 + エラーログ基盤 | services/db.ts | なし（最初に着手）|
| A2 | 市場価値ツール | tools/market.ts | fetcher.ts |
| A3 | 健康・天気ツール | tools/health.ts | fetcher.ts |
| A4 | 方言データツール（NINJAL） | tools/dialect.ts | fetcher.ts |
| A5 | Botpress + VOICEVOX + 統合 | integrations/* + index.ts | A1〜A4完了後 |

**実行順序: A1 → A2,A3,A4（並列）→ A5（統合）**

---

## 手順

```bash
git clone https://github.com/omusubiman5/skill60-mcp-server.git
cd skill60-mcp-server
git checkout -b feat/v3.1
npm install
npm install mongodb
```

---

## 削除するもの

- `src/services/claude.ts` — 存在すれば削除
- `src/tools/dialect.ts` — 現行版を削除 → A4で新版に置き換え

---

## A1: src/services/db.ts（MongoDB + エラーログ）

### 接続
```typescript
// 環境変数: MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/skill60
// DB名: skill60
// コレクション: error_logs

export async function connectDB(): Promise<void>
export async function logError(tool: string, message: string, details?: unknown): Promise<void>
export async function getRecentErrors(limit?: number): Promise<ErrorLog[]>
export async function getToolStatus(): Promise<ToolStatus[]>
```

### error_logs スキーマ
```json
{
  "tool": "skill60_fetch_news",
  "message": "Timeout after 20s",
  "details": {},
  "timestamp": "2026-02-14T07:00:00Z",
  "level": "error | warn | info"
}
```

### ツール状態集計（getToolStatus）
- 全ツール名を定数配列で保持
- 各ツールの直近エラー・最終成功時刻・24時間以内のエラー数を返す

### 既存ツールへの組み込み
- `services/fetcher.ts` の fetchSite で catch 時に `logError()` を呼ぶ
- 各ツールの catch 節にも `logError()` を追加

---

## A2: src/tools/market.ts（1ツール）

**skill60_market_value（求人検索）**
```
入力: { skills: string[]（1-5件）, region: string（デフォルト"福井"）}
出力: 求人情報テキスト（生データ）
```
- Indeed Japan RSS: `https://jp.indeed.com/rss?q=シニア+{keyword}&l={region}&sort=date&limit=20`
  - fetchSite → parseRssItems、skills配列をPromise.allで並列
- ハローワーク: `https://www.hellowork.mhlw.go.jp/` スクレイピング
  - 失敗時は「直接検索してください」+URL
- シルバー人材センター: `https://www.zsjc.or.jp/`
- エラー時: `logError("skill60_market_value", ...)` を呼ぶ

依存: `services/fetcher.ts`, `services/db.ts`
エクスポート: `registerMarketTools(server: McpServer): void`

---

## A3: src/tools/health.ts（2ツール）

**skill60_health_info（健康情報取得）**
```
入力: { category: "checkup"|"exercise"|"nutrition"|"mental"|"general", keyword: string, region: string }
出力: 健康情報テキスト（生データ）
```
- 厚労省: `https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/index.html`
- e-ヘルスネット: `https://www.e-healthnet.mhlw.go.jp/information/search_result?q={keyword}`
- エラー時: `logError()` 呼ぶ

**skill60_weather（天気取得）**
```
入力: { region: string（デフォルト"福井"）}
出力: 天気予報テキスト（生データ）
```
- 気象庁API: `https://www.jma.go.jp/bosai/forecast/data/forecast/{area_code}.json`
- 47都道府県コード定義（福井=180000, 東京=130000, 大阪=270000 等）
- エラー時: `logError()` 呼ぶ

依存: `services/fetcher.ts`, `services/db.ts`
エクスポート: `registerHealthTools(server: McpServer): void`

---

## A4: src/tools/dialect.ts（1ツール — 新規作り直し）

旧dialect.ts（LLMプロンプトハードコード）を削除し、データ提供のみのツールに作り直す。

**skill60_dialect_data（方言データ取得）**
```
入力: { region?: string, keyword?: string }
出力: 方言データ（語彙・表現・音声特徴）のテキスト
```

情報源:
- 国立国語研究所（NINJAL）: `https://www.ninjal.ac.jp/database/`
  - 全国方言談話データベース関連ページをスクレイピング
  - 地域別の方言特徴・語彙・表現を抽出
- 補助: 各都道府県の方言紹介ページ（自治体サイト等）

**このツールはデータを返すだけ。**
プロンプトは入れない。LLM側が会話の中で方言データを使って出身地を特定し、方言で話す。

- エラー時: `logError()` 呼ぶ

依存: `services/fetcher.ts`, `services/db.ts`
エクスポート: `registerDialectTools(server: McpServer): void`

---

## A5: 統合（A1〜A4完了後）

### src/integrations/botpress.ts

Botpress CloudからのPOSTでMCPツール呼び出し。

- `POST /bot`
  - 認証: `x-bot-secret`（BOTPRESS_WEBHOOK_SECRET、未設定時スキップ）
  - リクエスト: `{ intent, params?, userId?, region? }`
  - レスポンス: `{ ok, intent, tool, result?, error? }`
- `GET /bot/intents` — 一覧

マッピング:
```
ask_news → skill60_fetch_news
ask_pension → skill60_nenkin_news
find_grants → skill60_search_jgrants
find_jobs → skill60_market_value
health_check → skill60_health_info
weather → skill60_weather
dialect → skill60_dialect_data
senior_sites → skill60_fetch_senior_sites
scrape → skill60_scrape_url
tts → skill60_text_to_speech
```

### src/integrations/voicevox.ts（1ツール）

VOICEVOX Engine（音声合成、LLMではない）。

**skill60_text_to_speech**
```
入力: { text（max 3000）, speaker（デフォルト8）, speed（デフォルト0.9）}
出力: WAVのBase64
```
1. `POST /audio_query?text={text}&speaker={id}` → JSON
2. speedScale変更
3. `POST /synthesis?speaker={id}` → WAV → Base64

話者: 2=四国めたん, 3=ずんだもん, 8=春日部つむぎ★, 14=冥鳴ひまり
タイムアウト: 60秒
エラー時: `logError()` 呼ぶ
環境変数: `VOICEVOX_URL`（デフォルト http://localhost:50021）
エクスポート: `registerVoicevoxTools(server: McpServer): void`

### src/index.ts 修正

- version: "3.1.0"
- import追加: db, market, health, dialect(新), botpress, voicevox
- 起動時に `connectDB()` 呼ぶ（失敗してもサーバーは起動する。ログに警告出す）
- 旧dialect削除 → 新dialect登録
- market, health, botpress, voicevox 登録
- `GET /health` 強化:
  ```json
  {
    "status": "ok",
    "version": "3.1.0",
    "tools": 12,
    "db": "connected | disconnected",
    "toolStatus": [
      { "tool": "skill60_fetch_news", "status": "ok", "lastError": null, "errors24h": 0 },
      { "tool": "skill60_weather", "status": "error", "lastError": "Timeout", "errors24h": 3 }
    ]
  }
  ```
- HTTP mode時に `registerBotpressRoutes` 呼ぶ

### package.json
- version: "3.1.0"
- dependencies に `mongodb` 追加

### README.md
- 全12ツール一覧
- 設計思想「MCPは情報取得のみ、プロンプトは置かない」
- MongoDB Atlas接続手順
- ヘルスチェック仕様
- 環境変数一覧
- ANTHROPIC_API_KEY は不要と明記

---

## 完成形

```
skill60-mcp-server/
├── package.json           (v3.1.0)
├── tsconfig.json
├── README.md
└── src/
    ├── index.ts           (v3.1)
    ├── services/
    │   ├── fetcher.ts     (logError追加)
    │   └── db.ts          ★新規
    ├── tools/
    │   ├── news.ts        (logError追加)
    │   ├── jgrants.ts     (logError追加)
    │   ├── pension.ts     (logError追加)
    │   ├── benefits.ts    (logError追加)
    │   ├── dialect.ts     ★新規（NINJALデータ取得のみ）
    │   ├── market.ts      ★新規
    │   └── health.ts      ★新規
    └── integrations/
        ├── botpress.ts    ★新規
        └── voicevox.ts    ★新規
```

---

## ビルド・push

```bash
npx tsc   # エラー0
git add -A
git commit -m "feat: v3.1 market+health+dialect+botpress+voicevox+mongodb"
git push origin feat/v3.1
```

mainへのマージは動作確認後。

---

## 環境変数

```bash
TRANSPORT=http
PORT=3100
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/skill60
VOICEVOX_URL=http://localhost:50021    # オプション
BOTPRESS_WEBHOOK_SECRET=xxx            # オプション
```

LLM関連のAPI KEYは不要。

---

## 品質基準

- TypeScript strict mode
- 全ツールに try-catch + logError()
- フェッチタイムアウト: 20秒、VOICEVOX: 60秒
- Zod バリデーション必須
- MCP SDK annotations 必須
- MCP内にプロンプト・LLM呼び出しゼロ
- MongoDB接続失敗でもサーバーは落ちない
