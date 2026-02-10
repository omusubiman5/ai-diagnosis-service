# SKILL60+ - クイックリファレンス（1ページサマリー）

## 📌 プロジェクト基本情報

| 項目 | 内容 |
|------|------|
| **プロジェクト名** | SKILL60+ |
| **説明** | シニア層向けAIキャリア診断サービス |
| **ターゲット** | 60-74歳のシニア層（定年前後） |
| **主要機能** | LP + AIチャット + 音声入力/読み上げ |
| **デプロイ先** | Vercel（本番環境稼働中） |
| **開発期間** | 3週間 |
| **最終更新** | 2026-02-08 |

---

## 🛠️ 技術スタック（主要）

```
Framework:  Next.js 16.1.6 (App Router)
Language:   TypeScript 5.x
UI:         Material-UI 7.3.7 + Tailwind CSS 4.x
Animation:  Framer Motion 12.33.0 + GSAP 3.14.2
API:        OpenRouter API (Google Gemini 2.0 Flash)
Voice:      Web Speech API (Recognition + Synthesis)
Testing:    Jest 30.2.0 + Testing Library
Deploy:     Vercel (Auto CI/CD)
```

---

## ✨ 主要機能

### 1. レスポンシブLP（8セクション）
Hero → Empathy → Solution → Features → Steps → Trust → CTA → Footer

### 2. AIチャット機能
- OpenRouter API経由でAIキャリアコンサルタントと対話
- 会話履歴管理、エラーハンドリング

### 3. 音声機能
- **音声入力**: Web Speech API（日本語対応）
- **音声読み上げ**: 自動再生、プライミング機能

### 4. アクセシビリティ
- WCAG 2.1 AAレベル準拠
- コントラスト比7:1以上、フォント18px以上、prefers-reduced-motion対応

---

## 🎯 主要成果

### ✅ 実装完了項目
- [x] 完全レスポンシブLP
- [x] AIチャット統合
- [x] 音声入力/読み上げ機能
- [x] アクセシビリティ対応
- [x] TypeScript完全対応
- [x] Vercelデプロイ

### ⭐ 重要な修正
**音声入力無限ループバグの修正**
- 問題: 音声入力メッセージが無限に繰り返される
- 原因: useEffectの依存配列と状態管理の問題
- 解決: refによる前回値追跡 + clearTranscript機能実装

---

## 📂 プロジェクト構造（簡略版）

```
src/app/
├── api/chat/route.ts              # AI API Route
├── components/
│   ├── AIChatWidget.tsx           # チャットUI
│   ├── VoiceControl.tsx           # 音声制御
│   └── [LP sections].tsx          # LP各セクション
├── hooks/
│   ├── useAIChat.ts               # チャット管理
│   ├── useSpeechToText.ts         # 音声認識
│   ├── useVoiceGuide.ts           # 音声合成
│   └── useReducedMotion.ts        # アニメーション制御
├── types/chat.ts                  # 型定義
└── page.tsx                       # メインページ
```

---

## 🚀 デプロイ手順

### 環境変数設定（Vercel）
```bash
OPENROUTER_API_KEY=sk-or-v1-xxxxx...
OPENROUTER_MODEL=google/gemini-2.0-flash-exp:free
```

### ビルド & デプロイ
```bash
npm install
npm run build
npm start
```

Vercel自動デプロイ: `git push` で自動的にビルド＆デプロイ

---

## 📊 技術ハイライト

### パフォーマンス最適化
- React Hooks（useCallback, useRef）による再レンダリング抑制
- Next.js自動コード分割、画像最適化
- GPU加速アニメーション

### エラーハンドリング
- 3層防御（クライアント → サーバー → 外部API）
- ユーザーフレンドリーな日本語エラーメッセージ

### コードの品質
- TypeScript 100%使用
- カスタムフック4つで関心の分離
- コンポーネント10+で責務分離

---

## 📱 対応環境

| 項目 | 対応 |
|------|------|
| **ブラウザ** | Chrome, Firefox, Safari, Edge（最新版） |
| **デバイス** | PC, タブレット, スマートフォン |
| **音声機能** | Chrome/Edge推奨（Web Speech API対応） |
| **アクセシビリティ** | WCAG 2.1 AAレベル |

---

## 🔮 今後の展望

### 短期（1-3ヶ月）
- キャリア診断フローの実装
- LINE統合
- 会話履歴の永続化

### 中期（3-6ヶ月）
- マルチモーダル対応（画像、PDF）
- パーソナライゼーション
- A/Bテスト

### 長期（6ヶ月以上）
- マッチングプラットフォーム
- コミュニティ機能
- ネイティブアプリ

---

## 📝 ドキュメント

| ドキュメント | 内容 |
|-------------|------|
| `PROJECT_SUMMARY.md` | 詳細な成果物サマリー（技術スタック、実装詳細、バグ修正） |
| `TECH_STACK.md` | 技術スタック一覧（提出用） |
| `QUICK_REFERENCE.md` | 本ドキュメント（1ページサマリー） |
| `docs/設計/LP設計書.md` | LP設計書（デザイン、セクション構成） |
| `docs/テスト/LP動作確認チェックリスト.md` | テストチェックリスト |

---

## 🎓 必要スキル

- React.js / Next.js（App Router）
- TypeScript
- Material-UI
- Web Speech API
- OpenRouter API

---

## 📞 サポート情報

**GitHub**: survibe-ai-season3
**デプロイ**: Vercel
**ステータス**: ✅ 本番稼働中

---

**作成日**: 2026-02-08 | **バージョン**: 1.0.0 | **用途**: プレゼン・提出資料
