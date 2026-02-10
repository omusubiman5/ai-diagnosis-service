# SKILL60+ - プロジェクト成果物サマリー

## 📋 プロジェクト概要

**SKILL60+** は、60歳以上のシニア層が長年培ってきた経験やスキルを活かして、新しいキャリアを見つけることを支援するAIキャリア診断サービスのランディングページおよびAIチャット機能を実装したWebアプリケーションです。

### ターゲットユーザー
- **年齢層**: 60-74歳のシニア層（定年退職前後）
- **ニーズ**: 「まだ働ける」「社会とつながっていたい」「自分の経験が通用するか不安」
- **特性**: スマホ操作に慣れているが、視認性とアクセシビリティへの配慮が必要

---

## 🛠️ 技術スタック

### フロントエンド
- **フレームワーク**: Next.js 16.1.6 (App Router)
- **言語**: TypeScript 5.x
- **UIライブラリ**: Material-UI (MUI) v7.3.7
- **状態管理**: React Hooks (useState, useCallback, useRef, useEffect)
- **アニメーション**:
  - Framer Motion 12.33.0
  - GSAP 3.14.2 (@gsap/react 2.1.2)
  - Lottie React 2.4.1
- **スタイリング**:
  - Tailwind CSS 4.x
  - Emotion (MUIの依存関係)

### バックエンド & API
- **API Route**: Next.js API Routes (App Router)
- **AI統合**: OpenRouter API
  - デフォルトモデル: Google Gemini 2.0 Flash (Free)
- **ランタイム**: Node.js 20.x

### 音声機能
- **音声認識**: Web Speech API (SpeechRecognition)
- **音声合成**: Web Speech Synthesis API
- **対応言語**: 日本語 (ja-JP)

### テスト & 品質管理
- **テストフレームワーク**: Jest 30.2.0
- **テストユーティリティ**:
  - @testing-library/react 16.3.2
  - @testing-library/jest-dom 6.9.1
  - @testing-library/user-event 14.6.1
- **Linter**: ESLint 9.x (Next.js設定)

### デプロイ & インフラ
- **ホスティング**: Vercel
- **環境変数管理**: .env.local (開発), Vercel Environment Variables (本番)
- **CI/CD**: Vercel自動デプロイ (Git連携)

---

## ✨ 主な機能

### 1. レスポンシブランディングページ
8つのセクションで構成された、シニア層に特化したLP設計：

#### セクション構成
1. **HeroSection** - ファーストビュー、メインCTA
2. **EmpathySection** - ターゲットの課題に共感
3. **SolutionSection** - サービスによる解決策提示
4. **FeaturesSection** - サービスの3つの特徴
5. **StepsSection** - 利用の流れ（3ステップ）
6. **TrustSection** - 信頼性・権威付け
7. **CTASection** - クロージングCTA
8. **Footer** - サイト情報、リンク

### 2. AIチャットウィジェット (AIChatWidget)

#### 機能詳細
- **AIキャリア相談**: OpenRouter API経由でAIキャリアコンサルタントと対話
- **音声入力**: Web Speech APIによる音声認識
- **音声読み上げ**: 自動音声読み上げ機能（AI応答を自動再生）
- **会話履歴管理**: ユーザーとAIの会話履歴を保持
- **レスポンシブUI**: モバイル/タブレット/デスクトップ対応

#### UX特徴
- マイク録音中のビジュアルフィードバック
- 音声読み上げ中のアニメーション表示
- 暫定認識結果のリアルタイム表示
- エラーハンドリングとユーザーフレンドリーなメッセージ

### 3. 音声ガイド機能 (useVoiceGuide)

#### 実装詳細
- **自動発話準備**: 初回クリックレスポンスの高速化
- **音声プライミング**: ユーザー操作前に音声エンジンをウォームアップ
- **再生状態管理**: 音声再生中の状態追跡と制御
- **エラーリカバリー**: 音声再生失敗時の自動再試行

### 4. カスタムフック設計

#### useAIChat
- チャットメッセージ管理
- API通信と状態管理
- エラーハンドリング
- 会話履歴のクリア機能

#### useSpeechToText
- Web Speech APIのラッパー
- 音声認識の開始/停止制御
- 最終結果と暫定結果の分離管理
- ブラウザ対応チェック
- **重要**: transcript クリア機能（無限ループ対策）

#### useVoiceGuide
- 音声合成の管理
- プライミング機能（初回レスポンス高速化）
- 再生キャンセル制御
- 音声設定管理（速度、ピッチ、ボリューム）

#### useReducedMotion
- アクセシビリティ対応
- ユーザーの動きの設定を検出
- アニメーション制御の自動調整

---

## 🏗️ アーキテクチャと設計思想

### コンポーネント設計
- **Atomic Design的アプローチ**: セクション単位でコンポーネント分割
- **関心の分離**: UI/ロジック/状態管理を明確に分離
- **再利用性**: カスタムフックによるロジックの共通化

### 状態管理戦略
- **ローカル状態**: useState/useReducer
- **グローバル状態**: 不要（各コンポーネントで完結）
- **サーバー状態**: fetch + useEffect パターン

### パフォーマンス最適化
- **useCallback**: 関数メモ化による再レンダリング抑制
- **useRef**: 不要な再レンダリングの回避（前回値の追跡など）
- **条件付きレンダリング**: 不要なコンポーネントの非表示

### エラーハンドリング
- **多層防御**:
  1. クライアント側バリデーション
  2. API Routeでの検証
  3. 外部API呼び出しのエラーハンドリング
- **ユーザーフレンドリーなメッセージ**: 技術的なエラーを平易な日本語に変換

---

## ♿ アクセシビリティ対応

### WCAG 2.1準拠
- **AAレベル達成目標**、一部AAAレベル対応

### 実装内容

#### 視覚的アクセシビリティ
- **コントラスト比**: 7:1以上（AAA相当）
- **フォントサイズ**: 基本18px、見出し24px以上
- **行間**: 1.6以上で読みやすさ確保
- **カラーパレット**: 色覚特性に配慮した配色

#### インタラクションアクセシビリティ
- **タップターゲット**: 最小44px、推奨56px
- **キーボード操作**: Enterキーでの送信対応
- **フォーカス管理**: 適切なフォーカス順序とスタイル

#### アニメーションアクセシビリティ
- **prefers-reduced-motion**: 動きの設定を検出
- **useReducedMotion フック**: アニメーション無効化対応
- **控えめなアニメーション**: フェードイン、穏やかなスライド中心

#### ARIA属性
- **aria-label**: アイコンボタンに適切なラベル
- **ロール設定**: セマンティックなHTML要素の使用

---

## 🔧 実装のハイライト

### 1. 音声入力無限ループバグの修正 ⭐

#### 問題
音声認識で入力した内容が無限に繰り返し送信される重大なバグが発生

#### 原因分析
```typescript
// 問題のあったコード (AIChatWidget.tsx:94-101)
useEffect(() => {
  if (transcript) {
    queueMicrotask(() => {
      handleSend(transcript);
    });
  }
}, [transcript, handleSend]); // ❌ handleSendが依存配列に含まれる
```

**問題点**:
1. `transcript` を送信しても、transcript stateがクリアされない
2. `handleSend` が再作成されるたびにuseEffectが再実行
3. `inputValue` が変わる → `handleSend` 再作成 → useEffect再実行 → 無限ループ

#### 解決策
```typescript
// 修正後のコード
const lastProcessedTranscriptRef = useRef('');

useEffect(() => {
  if (transcript && transcript !== lastProcessedTranscriptRef.current) {
    lastProcessedTranscriptRef.current = transcript;
    queueMicrotask(() => {
      handleSend(transcript);
      clearTranscript(); // ✅ 送信後にクリア
    });
  }
}, [transcript, clearTranscript]); // ✅ handleSendを削除
```

**改善点**:
1. `lastProcessedTranscriptRef` で前回処理済みtranscriptを追跡
2. 同じtranscriptを2回処理しないようにチェック
3. 送信後すぐに `clearTranscript()` を呼び出し
4. 依存配列から `handleSend` を削除

**useSpeechToText.ts への追加機能**:
```typescript
const clearTranscript = useCallback(() => {
  setTranscript('');
  setInterimTranscript('');
}, []);
```

### 2. 音声プライミング機能

#### 概要
Web Speech Synthesis APIの初回遅延を解消するための実装

#### 実装 (useVoiceGuide.tsx)
```typescript
const prime = useCallback(() => {
  if (!isPrimed.current && typeof window !== 'undefined') {
    const utterance = new SpeechSynthesisUtterance('');
    utterance.volume = 0;
    window.speechSynthesis.speak(utterance);
    isPrimed.current = true;
  }
}, []);
```

**効果**: 初回音声再生の遅延を最小化

### 3. レスポンシブUI設計

#### MUIのブレークポイント活用
```typescript
sx={{
  width: { xs: '100%', sm: 400 },  // モバイル: 全幅, タブレット以上: 400px
  height: { xs: '100dvh', sm: 500 }, // モバイル: 全画面, タブレット以上: 500px
  borderRadius: { xs: 0, sm: 3 },    // モバイル: 角なし, タブレット以上: 丸み
}}
```

#### dvh単位の活用
- モバイルブラウザのアドレスバー対応
- 正確なビューポート高さの取得

### 4. エラーハンドリングの階層化

#### API Route (route.ts)
```typescript
// 環境変数の検証
if (!apiKey) {
  return NextResponse.json(
    { error: 'APIキーが設定されていません。管理者にお問い合わせください。' },
    { status: 500 }
  );
}

// HTTPステータスコード別のエラーメッセージ
if (response.status === 401) {
  userMessage = 'APIキーが無効です。.env.localのOPENROUTER_API_KEYを確認してください。';
} else if (response.status === 403) {
  userMessage = 'このモデルへのアクセス権限がありません。環境設定をご確認ください。';
}
```

#### クライアント側
```typescript
// 音声認識エラー
switch (event.error) {
  case 'not-allowed':
    setError('マイクの使用が許可されていません。アドレスバーの「鍵マーク」から設定を確認してください。');
    break;
  case 'no-speech':
    setError('声が聞き取れませんでした。もう少し近づいて話してみてください。');
    break;
}
```

---

## 📊 プロジェクト構成

```
survibe-ai-season3/
├── src/
│   └── app/
│       ├── api/
│       │   └── chat/
│       │       └── route.ts              # ChatGPT API Route
│       ├── components/
│       │   ├── AIChatWidget.tsx          # AIチャットウィジェット
│       │   ├── VoiceControl.tsx          # 音声コントロールボタン
│       │   ├── HeroSection.tsx           # ヒーローセクション
│       │   ├── EmpathySection.tsx        # 共感セクション
│       │   ├── SolutionSection.tsx       # 解決策セクション
│       │   ├── FeaturesSection.tsx       # 特徴セクション
│       │   ├── StepsSection.tsx          # ステップセクション
│       │   ├── TrustSection.tsx          # 信頼セクション
│       │   ├── CTASection.tsx            # CTAセクション
│       │   └── Footer.tsx                # フッター
│       ├── hooks/
│       │   ├── useAIChat.ts              # AIチャット管理フック
│       │   ├── useSpeechToText.ts        # 音声認識フック
│       │   ├── useVoiceGuide.ts          # 音声ガイドフック
│       │   └── useReducedMotion.ts       # アニメーション制御フック
│       ├── types/
│       │   └── chat.ts                   # チャット型定義
│       ├── globals.css                   # グローバルスタイル
│       ├── layout.tsx                    # ルートレイアウト
│       └── page.tsx                      # メインページ
├── docs/
│   ├── 設計/
│   │   └── LP設計書.md                   # LP設計書
│   ├── テスト/
│   │   └── LP動作確認チェックリスト.md   # テストチェックリスト
│   └── PROJECT_SUMMARY.md                # 本ドキュメント
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

---

## 🚀 デプロイ情報

### プラットフォーム
- **Vercel**: https://vercel.com/
- **自動デプロイ**: Gitプッシュで自動的にビルド＆デプロイ

### 環境変数
以下の環境変数が必要：

```bash
OPENROUTER_API_KEY=sk-or-v1-xxxxx...
OPENROUTER_MODEL=google/gemini-2.0-flash-exp:free  # オプション
```

### ビルド設定
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Node.js Version**: 20.x

---

## 🎯 達成した主要目標

### ✅ 機能要件
- [x] レスポンシブLP（8セクション）
- [x] AIチャット機能（OpenRouter API統合）
- [x] 音声入力機能（Web Speech API）
- [x] 音声読み上げ機能（自動再生）
- [x] エラーハンドリング
- [x] 会話履歴管理

### ✅ 非機能要件
- [x] アクセシビリティ（WCAG 2.1 AA準拠）
- [x] レスポンシブデザイン（モバイルファースト）
- [x] パフォーマンス最適化
- [x] TypeScript完全対応
- [x] テスト環境構築（Jest）

### ✅ 品質要件
- [x] 音声入力無限ループバグの修正
- [x] エラーメッセージの日本語化
- [x] ユーザーフレンドリーなUX
- [x] コードの可読性と保守性

---

## 🔮 今後の拡張可能性

### 短期的な改善
1. **キャリア診断機能の実装**: 5問3分の診断フロー
2. **LINE統合**: LINE Messaging APIでの対話機能
3. **会話履歴の永続化**: LocalStorageまたはDBへの保存
4. **音声認識精度向上**: カスタム辞書の追加

### 中期的な拡張
1. **マルチモーダル対応**: 画像アップロード、PDF解析
2. **パーソナライゼーション**: ユーザープロファイル管理
3. **A/Bテスト**: CTA最適化、コピーテスト
4. **分析ダッシュボード**: ユーザー行動分析

### 長期的なビジョン
1. **マッチングプラットフォーム**: シニアと企業のマッチング
2. **コミュニティ機能**: ユーザー間の交流
3. **教育コンテンツ**: スキルアップ講座
4. **モバイルアプリ**: ネイティブアプリ開発

---

## 📝 開発履歴

### Phase 1: LP実装 (Week 1)
- 基本LP構造の実装
- 8セクションのコンポーネント化
- レスポンシブデザイン対応

### Phase 2: AIチャット実装 (Week 2-3)
- OpenRouter API統合
- チャットUI実装
- 音声入力・読み上げ機能追加

### Phase 3: バグ修正・最適化 (Week 3)
- **音声入力無限ループバグの修正** ⭐
- パフォーマンス最適化
- アクセシビリティ改善

### Phase 4: デプロイ (Week 3)
- Vercelへのデプロイ
- 環境変数設定
- 本番環境テスト

---

## 👥 開発チーム

- **プロジェクト**: SKILL60+ (survibe-ai-season3)
- **開発環境**: Next.js 16 + TypeScript + MUI
- **開発期間**: 3週間
- **デプロイ**: Vercel

---

## 📄 ライセンス

Private Project

---

## 🙏 謝辞

このプロジェクトは、シニア層の豊かなキャリアを支援するという社会的使命を持って開発されました。
AI技術とアクセシビリティを組み合わせることで、年齢に関係なく誰もが活躍できる社会の実現に貢献します。

---

**最終更新日**: 2026-02-08
**バージョン**: 1.0.0
**ステータス**: 本番環境デプロイ済み
