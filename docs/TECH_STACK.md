# SKILL60+ - 技術スタック一覧

## 🎯 プロジェクト概要

**プロジェクト名**: SKILL60+
**目的**: シニア層向けAIキャリア診断サービスのランディングページ + AIチャット機能
**デプロイURL**: Vercel
**開発期間**: 3週間

---

## 📦 コア技術スタック

| カテゴリ | 技術 | バージョン | 用途 |
|---------|------|-----------|------|
| **Framework** | Next.js | 16.1.6 | フルスタックReactフレームワーク |
| **Language** | TypeScript | 5.x | 型安全な開発 |
| **UI Library** | Material-UI (MUI) | 7.3.7 | コンポーネントライブラリ |
| **Styling** | Tailwind CSS | 4.x | ユーティリティファーストCSS |
| **Runtime** | Node.js | 20.x | サーバーサイド実行環境 |

---

## 🎨 フロントエンド

### UIフレームワーク
- **Material-UI (MUI)**: v7.3.7
  - `@mui/material`: コアコンポーネント
  - `@mui/icons-material`: アイコンセット
  - `@mui/material-nextjs`: Next.js統合
- **Emotion**: v11.14.0
  - `@emotion/react`: CSS-in-JS
  - `@emotion/styled`: スタイルコンポーネント

### アニメーション
- **Framer Motion**: v12.33.0 - UIマイクロインタラクション
- **GSAP**: v3.14.2 - 高度なアニメーション
- **Lottie React**: v2.4.1 - After Effectsアニメーション

### 状態管理
- **React Hooks**: useState, useCallback, useRef, useEffect
- **カスタムフック**:
  - `useAIChat`: チャット管理
  - `useSpeechToText`: 音声認識
  - `useVoiceGuide`: 音声合成
  - `useReducedMotion`: アクセシビリティ

---

## 🔧 バックエンド & API

### API構成
- **Next.js API Routes**: App Router方式
- **エンドポイント**: `/api/chat`
- **外部API**: OpenRouter API
  - デフォルトモデル: `google/gemini-2.0-flash-exp:free`

### 環境変数
```bash
OPENROUTER_API_KEY=sk-or-v1-xxxxx...
OPENROUTER_MODEL=google/gemini-2.0-flash-exp:free
```

---

## 🎙️ 音声機能

### Web Speech API
- **音声認識**: SpeechRecognition API
  - 対応言語: 日本語 (ja-JP)
  - モード: continuous + interimResults
- **音声合成**: SpeechSynthesis API
  - 自動読み上げ機能
  - プライミング機能（初回遅延解消）

---

## 🧪 テスト & 品質

### テストフレームワーク
- **Jest**: v30.2.0
  - `jest-environment-jsdom`: ブラウザ環境シミュレーション
- **Testing Library**:
  - `@testing-library/react`: v16.3.2
  - `@testing-library/jest-dom`: v6.9.1
  - `@testing-library/user-event`: v14.6.1

### Linter & Formatter
- **ESLint**: v9.x
  - `eslint-config-next`: Next.js公式設定

---

## 🚀 デプロイ & インフラ

| 項目 | 内容 |
|------|------|
| **ホスティング** | Vercel |
| **CI/CD** | Vercel自動デプロイ（Git連携） |
| **環境変数** | Vercel Environment Variables |
| **ドメイン** | Vercel提供ドメイン |
| **SSR/SSG** | App Router (SSR/CSR混在) |
| **Edge Runtime** | 利用可能 |

---

## 📱 対応環境

### ブラウザ
- **推奨**: Google Chrome (最新版)
- **対応**: Firefox, Safari, Edge (最新版)
- **音声機能**: Chrome/Edge推奨（Web Speech API対応）

### デバイス
- **PC**: Windows, macOS, Linux
- **タブレット**: iPad, Android tablet
- **スマートフォン**: iOS, Android

### レスポンシブブレークポイント
- **xs**: 0px - 600px (モバイル)
- **sm**: 600px - 900px (タブレット)
- **md**: 900px - 1200px (小型デスクトップ)
- **lg**: 1200px - 1536px (デスクトップ)
- **xl**: 1536px+ (大型デスクトップ)

---

## ♿ アクセシビリティ

### 準拠基準
- **WCAG 2.1**: AAレベル準拠（一部AAA対応）

### 実装機能
- ✅ コントラスト比 7:1以上
- ✅ フォントサイズ 18px以上
- ✅ タップターゲット 44px以上
- ✅ キーボード操作対応
- ✅ prefers-reduced-motion対応
- ✅ ARIA属性適用
- ✅ セマンティックHTML

---

## 🔐 セキュリティ

### 実装済み対策
- 環境変数によるAPIキー管理
- Next.js API Routeでのサーバーサイド処理
- クライアント側でのAPIキー非公開
- HTTPSによる通信暗号化（Vercel標準）

---

## 📊 パフォーマンス

### 最適化手法
- **React最適化**:
  - useCallback: 関数メモ化
  - useRef: 不要な再レンダリング回避
  - 条件付きレンダリング
- **Next.js最適化**:
  - 画像最適化（next/image）
  - フォント最適化（next/font）
  - 自動コード分割
- **アニメーション最適化**:
  - GPU加速アニメーション
  - prefers-reduced-motion対応

---

## 📂 主要ファイル構成

```
src/app/
├── api/chat/route.ts           # ChatGPT API Route
├── components/
│   ├── AIChatWidget.tsx        # メインチャット機能 ⭐
│   ├── VoiceControl.tsx        # 音声コントロール
│   └── [8 LP sections].tsx     # LP各セクション
├── hooks/
│   ├── useAIChat.ts            # チャット管理 ⭐
│   ├── useSpeechToText.ts      # 音声認識 ⭐
│   ├── useVoiceGuide.ts        # 音声合成 ⭐
│   └── useReducedMotion.ts     # アニメーション制御
├── types/chat.ts               # 型定義
├── globals.css                 # グローバルスタイル
├── layout.tsx                  # ルートレイアウト
└── page.tsx                    # メインページ
```

---

## 🎁 特筆すべき実装

### 1. 音声入力無限ループバグの修正 🐛→✅
**問題**: 音声認識でメッセージが無限に送信される
**原因**: useEffectの依存配列と状態管理の問題
**解決**: refによる前回値追跡 + clearTranscript機能追加

### 2. 音声プライミング機能 🎤
Web Speech Synthesis APIの初回遅延を解消する実装

### 3. レスポンシブUI設計 📱
MUIのsx propとブレークポイントシステムを活用した完全レスポンシブ対応

### 4. エラーハンドリングの階層化 🛡️
クライアント・サーバー・外部APIの3層でエラーハンドリング

---

## 📈 開発メトリクス

| 項目 | 数値 |
|------|------|
| **コンポーネント数** | 10+ |
| **カスタムフック数** | 4 |
| **TypeScript使用率** | 100% |
| **テストカバレッジ目標** | 70%+ |
| **ページロード時間目標** | < 3秒 |
| **Lighthouse Performance** | 90+ |

---

## 🔄 バージョン情報

- **プロジェクトバージョン**: 1.0.0
- **最終更新日**: 2026-02-08
- **ステータス**: ✅ 本番環境デプロイ済み

---

## 📞 技術サポート

### 必要な知識
- React.js / Next.js (App Router)
- TypeScript
- Material-UI (MUI)
- Web Speech API
- OpenRouter API

### 参考ドキュメント
- [Next.js Documentation](https://nextjs.org/docs)
- [Material-UI Documentation](https://mui.com/)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [OpenRouter API](https://openrouter.ai/docs)

---

**作成日**: 2026-02-08
**目的**: 技術提出資料・プロジェクト引き継ぎ資料
