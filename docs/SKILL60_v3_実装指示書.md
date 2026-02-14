# SKILL60+ 実装指示書 v2.1 → v3.0
## サブエージェント5体制 並列開発計画

> 作成: 2026-02-14
> リポジトリ: https://github.com/omusubiman5/skill60-mcp-server
> 現状: v2.1（9ツール完成・GitHub push済）
> 目標: v3.0（全MCP + Botpress + VOICEVOX統合）

---

## 現状の完成状況

### ✅ 完了（v2.1 — 9ツール）

| # | ツール | 方式 | 状態 |
|---|--------|------|------|
| 1 | skill60_fetch_news | NHK/Yahoo RSS | ✅ push済 |
| 2 | skill60_search_jgrants | jGrants API | ✅ push済 |
| 3 | skill60_jgrants_detail | jGrants API | ✅ push済 |
| 4 | skill60_nenkin_news | 年金機構スクレイピング | ✅ push済 |
| 5 | skill60_nenkin_page | 年金機構ページ取得 | ✅ push済 |
| 6 | skill60_fetch_senior_sites | JR/JAL/ANA一括 | ✅ push済 |
| 7 | skill60_scrape_url | 汎用スクレイパー | ✅ push済 |
| 8 | skill60_dialect_convert | 方言変換（Claude API） | ✅ push済 |
| 9 | skill60_yoshiko_voice | ヨシコの声 | ✅ push済 |

### ❌ 未実装（v3.0で追加）

| # | ツール | KPT設計 | 備考 |
|---|--------|---------|------|
| 10 | skill60_market_value | MCP-5: 市場価値・求人 | ハロワ/シルバー人材/Indeed |
| 11 | skill60_health_check | MCP-6: 健康・生活 | 厚労省/天気/自治体健診 |
| 12 | Botpress連携 | ボットUI層 | LINE/Web対話フロント |
| 13 | VOICEVOX連携 | 音声合成 | ヨシコの声を音声化 |

---

## サブエージェント5体制

### 🔴 Agent-1: 市場価値MCPツール
**ファイル:** `src/tools/market.ts`
**担当:** skill60_market_value + skill60_skill_assess

#### ツール設計

**skill60_market_value（市場価値検索）**
```
入力: { skills: string[], region: string, age_range: string }
出力: マッチする求人・案件の一覧
```

情報源（スクレイピング/API）:
- ハローワークインターネットサービス: https://www.hellowork.mhlw.go.jp/
  - 検索ページをスクレイピング（公開API なし）
  - パラメータ: 職種キーワード + 地域 + 年齢
- シルバー人材センター: https://www.zsjc.or.jp/
  - 全国シルバー人材センター事業協会
  - 地域別の仕事情報ページ
- Indeed Japan: https://jp.indeed.com/
  - RSS フィード: `https://jp.indeed.com/rss?q=シニア+{keyword}&l={region}`
  - 公開RSSなので取得可能

**skill60_skill_assess（スキル市場評価）**
```
入力: { skill_description: string, years_experience: number, region: string }
出力: そのスキルの市場需要度・想定時給レンジ・類似求人数
```
- Claude APIで分析（dialect.tsのcallClaude関数を共有）
- Indeed/ハロワの検索結果件数から需要度を算出

#### 実装ルール
- `fetchSite`/`fetchJson` は既存 `services/fetcher.ts` を使用
- Claude API呼び出しは `dialect.ts` の `callClaude` をリファクタして共通化
  → `services/claude.ts` に抽出
- エラーハンドリング: try-catch + フォールバックメッセージ

---

### 🟢 Agent-2: 健康MCPツール
**ファイル:** `src/tools/health.ts`
**担当:** skill60_health_info + skill60_weather_advice

#### ツール設計

**skill60_health_info（健康情報取得）**
```
入力: { category: "checkup"|"exercise"|"nutrition"|"mental", region: string }
出力: 関連する健康情報・自治体の健診案内
```

情報源:
- 厚労省 健康情報: https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/index.html
  - 新着情報スクレイピング
- e-ヘルスネット: https://www.e-healthnet.mhlw.go.jp/
  - 健康用語・トピック検索
- 自治体健診情報: 汎用スクレイパー（`scrape_url`）で対応

**skill60_weather_advice（天気ベース健康アドバイス）**
```
入力: { region: string }
出力: 天気情報 + シニア向け健康アドバイス
```

情報源:
- 気象庁天気予報: https://www.jma.go.jp/bosai/forecast/
  - JSON API: `https://www.jma.go.jp/bosai/forecast/data/forecast/{area_code}.json`
  - 福井 = 180000, 東京 = 130000 等
- Claude APIでアドバイス生成:
  「今日は最高気温35度。水分補給をこまめに。外出は午前中に」

#### 地域コード対応表（主要）
```typescript
const AREA_CODES: Record<string, string> = {
  "北海道": "016000", "青森": "020000", "秋田": "050000",
  "東京": "130000", "大阪": "270000", "福井": "180000",
  "石川": "170000", "富山": "160000", "愛知": "230000",
  "広島": "340000", "福岡": "400000", "沖縄": "471000",
};
```

---

### 🔵 Agent-3: Botpress連携層
**ファイル:** `src/integrations/botpress.ts` + 設定ドキュメント
**担当:** BotpressからMCPツールを呼べるようにするブリッジ

#### 設計

Botpress Cloud（無料枠あり）を使用し、LINE/Web UIのフロントを提供。

**構成:**
```
ユーザー → LINE/Web → Botpress Cloud → HTTP → SKILL60+ MCP (Hostinger VPS)
                                          ↓
                                   MCP ツール実行
                                          ↓
                                   結果を Botpress に返却
                                          ↓
                                   ユーザーに表示
```

**MCP側の実装:**
- Express `/bot` エンドポイント追加（index.ts）
- Botpressのwebhookから受けるリクエストを処理
- MCPツールを直接呼び出して結果を返す

```typescript
// src/integrations/botpress.ts
app.post("/bot", async (req, res) => {
  const { intent, params, userId } = req.body;
  // intent → MCPツール名にマッピング
  // 例: "ask_pension" → skill60_nenkin_news
  // 例: "find_jobs" → skill60_market_value
  // 結果をBotpress形式で返却
});
```

**Botpress側の設定ドキュメント:**
- Botpress Cloud のセットアップ手順
- LINE Messaging API連携手順
- Webhook URL設定: `https://{VPS_IP}:3100/bot`
- インテント定義:
  - `greet` → 挨拶（ヨシコの声で返答）
  - `ask_news` → ニュース取得
  - `ask_pension` → 年金情報
  - `find_grants` → 助成金検索
  - `find_jobs` → 求人検索
  - `health_check` → 健康情報
  - `weather` → 天気アドバイス

---

### 🟡 Agent-4: VOICEVOX音声合成連携
**ファイル:** `src/integrations/voicevox.ts`
**担当:** テキストを音声ファイルに変換するツール

#### 設計

VOICEVOX Engine（Docker / ローカル起動）のHTTP APIを叩く。

**VOICEVOX API:**
```
# 1. 音声合成クエリ生成
POST http://localhost:50021/audio_query?text={text}&speaker={id}

# 2. 音声合成
POST http://localhost:50021/synthesis?speaker={id}
Content-Type: application/json
Body: (audio_queryのレスポンス)
→ WAVファイルが返る
```

**ツール設計:**

**skill60_text_to_speech（テキスト音声化）**
```
入力: { text: string, speaker: number, speed: number }
出力: WAVファイルのBase64 or ファイルパス
```

- speaker ID: ヨシコに合う声を選定
  - ずんだもん(3): 親しみやすい
  - 春日部つむぎ(8): 落ち着いた女性
  - 四国めたん(2): はっきりした女性
  - ※実際にテストして最適な声を選定
- speed: 0.8〜1.0（シニア向けにゆっくり）

**VPS設定:**
```bash
# VOICEVOX Engine Docker起動（Hostinger VPS）
docker run -d -p 50021:50021 voicevox/voicevox_engine:latest

# 環境変数
VOICEVOX_URL=http://localhost:50021
```

**N8Nワークフロー連携:**
```
ニュース取得 → ヨシコ変換 → VOICEVOX音声化 → LINE音声メッセージ送信
```

---

### 🟣 Agent-5: GitHub統合 + index.ts更新 + ビルド + README
**ファイル:** 全体統合・ビルド・push
**担当:** 全Agentの成果物をまとめてGitHubにpush

#### 作業内容

1. **共通化リファクタ:**
   - `services/claude.ts` 新規作成（callClaude関数を dialect.ts から抽出）
   - `dialect.ts` を `services/claude.ts` を使うように修正

2. **index.ts 更新:**
   - v3.0に更新
   - 全新ツール登録（market, health, botpress, voicevox）
   - ヘルスチェックの tools 数更新

3. **package.json 更新:**
   - version: "3.0.0"

4. **README.md 更新:**
   - 全13ツール一覧
   - Botpress セットアップ手順
   - VOICEVOX Docker 起動手順
   - 環境変数一覧
   - バージョン履歴 v3.0追加

5. **TypeScript ビルド確認:**
   - `npx tsc` エラー0確認

6. **GitHub push:**
   - 全ファイルを `main` ブランチにpush
   - コミットメッセージ: `feat: v3.0 market+health+botpress+voicevox`

---

## 環境変数一覧（v3.0）

```bash
# 必須
ANTHROPIC_API_KEY=sk-ant-...     # Claude API（方言変換・スキル評価）

# HTTP起動
TRANSPORT=http                    # stdio or http
PORT=3100                         # HTTPポート

# オプション
VOICEVOX_URL=http://localhost:50021  # VOICEVOX Engine
BOTPRESS_WEBHOOK_SECRET=xxx          # Botpress認証トークン
```

---

## ファイル構成（v3.0 完成形）

```
skill60-mcp-server/
├── package.json           (v3.0.0)
├── tsconfig.json
├── README.md              (全13ツール + セットアップガイド)
├── .gitignore
└── src/
    ├── index.ts           (v3.0 エントリポイント)
    ├── services/
    │   ├── fetcher.ts     (共通フェッチャー)
    │   └── claude.ts      (★新規: Claude API共通)
    ├── tools/
    │   ├── news.ts        (NHK/Yahoo RSS)
    │   ├── jgrants.ts     (助成金API)
    │   ├── pension.ts     (年金機構)
    │   ├── benefits.ts    (JR/航空特典)
    │   ├── dialect.ts     (方言変換)
    │   ├── market.ts      (★新規: 市場価値・求人)
    │   └── health.ts      (★新規: 健康・天気)
    └── integrations/
        ├── botpress.ts    (★新規: Botpress連携)
        └── voicevox.ts    (★新規: VOICEVOX音声)
```

---

## 実行順序

```
Agent-5: services/claude.ts 共通化（他Agent の前提）
   ↓
Agent-1 〜 Agent-4: 並列開発
   ↓
Agent-5: index.ts統合 + ビルド + GitHub push
```

---

## N8Nワークフロー統合（デプロイ後）

```
[朝7時 cronトリガー]
  ↓
[SKILL60+ MCP /mcp エンドポイント]
  ├→ skill60_fetch_news(keyword="年金 シニア 健康")
  ├→ skill60_nenkin_news()
  ├→ skill60_weather_advice(region="福井")
  └→ skill60_market_value(skills=["経理"], region="福井")
  ↓
[情報統合ノード]
  ↓
[skill60_yoshiko_voice(text=統合テキスト, region="福井")]
  ↓
[skill60_text_to_speech(text=ヨシコテキスト)]  ※オプション
  ↓
[LINE Messaging API送信]
  ├→ テキストメッセージ（ヨシコの声）
  └→ 音声メッセージ（VOICEVOXのWAV）
```

---

## 品質基準

- TypeScript strict mode（tsconfig.json に strict: true）
- 全ツールに try-catch + エラーメッセージ返却
- フェッチタイムアウト: 20秒（既存fetcher.ts準拠）
- Claude API タイムアウト: 30秒
- VOICEVOX タイムアウト: 60秒（音声生成は重い）
- Zod バリデーション必須（全入力パラメータ）
- MCP SDK annotations 必須（readOnlyHint等）
