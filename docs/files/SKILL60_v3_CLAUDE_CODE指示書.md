# SKILL60+ v3.0 実装指示書（Claude Code用）

> リポジトリ: https://github.com/omusubiman5/skill60-mcp-server
> 現状: v2.1（9ツール、Anthropic API使用）
> 目標: v3.0（13ツール、OpenRouter API使用）

## 変更の核心

**Anthropic API → OpenRouter APIに変えるだけ。**
それ以外のLLM呼び出しロジック（方言変換、ヨシコの声、スキル評価等）はそのまま。

OpenRouter APIはOpenAI互換フォーマット:
- エンドポイント: `https://openrouter.ai/api/v1/chat/completions`
- 認証: `Authorization: Bearer {OPENROUTER_API_KEY}`
- モデル: 環境変数 `OPENROUTER_MODEL` で指定（デフォルト: `anthropic/claude-sonnet-4`）

---

## 手順

```bash
git clone https://github.com/omusubiman5/skill60-mcp-server.git
cd skill60-mcp-server
npm install
```

---

## 修正: src/services/claude.ts → src/services/llm.ts にリネーム

Anthropic API呼び出しをOpenRouter API呼び出しに変更。

変更前（Anthropic）:
```
URL: https://api.anthropic.com/v1/messages
Header: x-api-key, anthropic-version
Body: { model, max_tokens, system, messages }
```

変更後（OpenRouter）:
```
URL: https://openrouter.ai/api/v1/chat/completions
Header: Authorization: Bearer {key}
Body: { model, max_tokens, messages: [{ role: "system", content }, { role: "user", content }] }
```

環境変数:
- `ANTHROPIC_API_KEY` → `OPENROUTER_API_KEY`
- 新規追加: `OPENROUTER_MODEL`（デフォルト `anthropic/claude-sonnet-4`）

レスポンス解析:
- `data.content[0].text` → `data.choices[0].message.content`

エクスポート: `callLLM(systemPrompt, userText, options?)` （関数名も変更）

---

## 修正: src/tools/dialect.ts

- `import { callClaude }` → `import { callLLM } from "../services/llm.js"`
- `callClaude(system, text)` → `callLLM(system, text)`
- それ以外のロジック変更なし（方言変換・ヨシコの声はそのまま）

---

## 新規: src/tools/market.ts（2ツール）

**skill60_market_value（求人検索）**
```
入力: { skills: string[]（1-5件）, region: string（デフォルト"福井"）}
出力: 求人情報テキスト
```
- Indeed Japan RSS: `https://jp.indeed.com/rss?q=シニア+{keyword}&l={region}&sort=date&limit=20`
- ハローワーク: `https://www.hellowork.mhlw.go.jp/` スクレイピング
- シルバー人材センター: `https://www.zsjc.or.jp/`
- 依存: `services/fetcher.ts`

**skill60_skill_assess（スキル市場評価）**
```
入力: { skill_description: string, years_experience: number, region: string }
出力: 需要度★5段階、想定時給、活かせる職種等
```
- callLLMでシニア就労コンサルとして分析
- 依存: `services/llm.ts`

エクスポート: `registerMarketTools(server: McpServer): void`

---

## 新規: src/tools/health.ts（2ツール）

**skill60_health_info（健康情報取得）**
```
入力: { category, keyword, region }
出力: 厚労省 + e-ヘルスネットの情報
```
- 厚労省: `https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/index.html`
- e-ヘルスネット: `https://www.e-healthnet.mhlw.go.jp/information/search_result?q={keyword}`

**skill60_weather_advice（天気+健康アドバイス）**
```
入力: { region: string }
出力: 気象庁天気 + LLMシニア向けアドバイス
```
- 気象庁API: `https://www.jma.go.jp/bosai/forecast/data/forecast/{area_code}.json`
- 47都道府県コード定義
- callLLMでアドバイス生成
- 依存: `services/fetcher.ts`, `services/llm.ts`

エクスポート: `registerHealthTools(server: McpServer): void`

---

## 新規: src/integrations/botpress.ts

Botpress CloudからのPOSTでMCPツール呼び出し。

- `POST /bot` — intent→ツール実行
  - 認証: `x-bot-secret`（BOTPRESS_WEBHOOK_SECRET）
  - リクエスト: `{ intent, params?, userId?, region? }`
  - レスポンス: `{ ok, intent, tool, result?, error? }`
- `GET /bot/intents` — 一覧

マッピング:
```
ask_news → skill60_fetch_news
ask_pension → skill60_nenkin_news
find_grants → skill60_search_jgrants
find_jobs → skill60_market_value
assess_skill → skill60_skill_assess
health_check → skill60_health_info
weather → skill60_weather_advice
dialect → skill60_dialect_convert
yoshiko_voice → skill60_yoshiko_voice
senior_sites → skill60_fetch_senior_sites
scrape → skill60_scrape_url
tts → skill60_text_to_speech
```

エクスポート: `registerBotpressRoutes(app, handleTool): void`

---

## 新規: src/integrations/voicevox.ts（1ツール）

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
環境変数: `VOICEVOX_URL`（デフォルト http://localhost:50021）

エクスポート: `registerVoicevoxTools(server: McpServer): void`

---

## 修正: src/index.ts → v3.0

- market, health, botpress, voicevox の import・register追加
- version "3.0.0"
- HTTP mode時に registerBotpressRoutes 呼ぶ
- handleTool関数実装

## 修正: package.json → version "3.0.0"

## 修正: README.md → v3.0
- 全13ツール一覧
- OpenRouter API使用を明記
- 環境変数更新

---

## 完成形

```
skill60-mcp-server/
├── package.json           (v3.0.0)
├── tsconfig.json
├── README.md
└── src/
    ├── index.ts
    ├── services/
    │   ├── fetcher.ts
    │   └── llm.ts         ★claude.tsをリネーム+OpenRouter化
    ├── tools/
    │   ├── news.ts
    │   ├── jgrants.ts
    │   ├── pension.ts
    │   ├── benefits.ts
    │   ├── dialect.ts     ★import先変更のみ
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
git commit -m "feat: v3.0 OpenRouter+market+health+botpress+voicevox"
git push origin main
```

---

## 環境変数

```bash
OPENROUTER_API_KEY=sk-or-...           # 必須
OPENROUTER_MODEL=anthropic/claude-sonnet-4  # オプション
TRANSPORT=http
PORT=3100
VOICEVOX_URL=http://localhost:50021    # オプション
BOTPRESS_WEBHOOK_SECRET=xxx            # オプション
```

---

## 品質基準

- TypeScript strict mode
- 全ツールに try-catch
- フェッチタイムアウト: 20秒（fetcher）、30秒（LLM）、60秒（VOICEVOX）
- Zod バリデーション必須
- MCP SDK annotations 必須
