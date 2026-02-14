# AUTH-001: Google認証会員機能 設計書

作成日: 2026-02-15

---

## 1. ユーザーニーズ

### 対象ユーザー
SKILL60+のサービス利用者（60歳以上のシニア層）

### ニーズ
- パスワード不要でかんたんにログインしたい（AUTH-004準拠: 「認証」等の硬い用語禁止）
- 自分の情報を安全に管理したい
- ログイン後に自分専用の画面を見たい
- プロフィール情報を編集したい

### ユーザーストーリー
1. ユーザーはGoogleアカウントで1タップログインできる
2. ログイン後、自分の名前とアバターが表示されるダッシュボードを見る
3. プロフィールページで自分の情報を確認・編集できる
4. 未ログイン状態で会員ページにアクセスするとログインページに誘導される

---

## 2. 仕様要件

### 2.1 認証基盤
| 項目 | 仕様 |
|------|------|
| 認証方式 | Google OAuth 2.0（NextAuth.js v5 / Auth.js） |
| セッション管理 | JWT方式 |
| DBアダプター | MongoDB Adapter |
| セッション有効期限 | 30日 |

### 2.2 環境変数
```
AUTH_SECRET=<ランダム生成>
GOOGLE_CLIENT_ID=<GCP OAuth Client ID>
GOOGLE_CLIENT_SECRET=<GCP OAuth Client Secret>
MONGODB_URI=<MongoDB接続文字列>
```

### 2.3 画面一覧
| パス | 画面名 | 認証 | 説明 |
|------|--------|------|------|
| `/auth/signin` | ログインページ | 不要 | Googleログインボタン表示 |
| `/dashboard` | ダッシュボード | 必須 | 会員トップページ |
| `/profile` | プロフィール | 必須 | ユーザー情報表示・編集 |

### 2.4 API一覧
| メソッド | パス | 認証 | 説明 |
|----------|------|------|------|
| GET/POST | `/api/auth/[...nextauth]` | - | NextAuth.js認証エンドポイント |
| GET | `/api/user/profile` | 必須 | ユーザー情報取得 |
| PUT | `/api/user/profile` | 必須 | プロフィール更新 |

### 2.5 データモデル
```
User {
  _id: ObjectId          // MongoDB自動生成
  name: string           // 表示名
  email: string          // メールアドレス（Google）
  image: string          // Googleアバター画像URL
  emailVerified: Date    // メール認証日時
  createdAt: Date        // 作成日時
  updatedAt: Date        // 更新日時
}
```

### 2.6 ミドルウェアルール
- `/dashboard`、`/profile` は認証必須
- 未ログインユーザーは `/auth/signin` にリダイレクト
- ログイン済みユーザーが `/auth/signin` にアクセスすると `/dashboard` にリダイレクト

### 2.7 UI要件
- MUIコンポーネント使用: Button, Card, Avatar, TextField, Typography, Box, Container
- 既存テーマ（`src/theme.ts`）を踏襲
- レスポンシブ対応

---

## 3. 処理手順設計

### 3.1 ファイル構成
```
src/
├── auth.ts                              # Auth.js設定（Google Provider + MongoDB Adapter）
├── middleware.ts                         # 認証ミドルウェア（保護ルート）
├── app/
│   ├── layout.tsx                        # SessionProvider追加
│   ├── providers.tsx                     # クライアント用Providers
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts   # Auth.jsルートハンドラ
│   │   └── user/profile/route.ts         # プロフィールAPI
│   ├── auth/signin/page.tsx              # ログインページ
│   ├── dashboard/
│   │   ├── layout.tsx                    # ダッシュボードレイアウト
│   │   └── page.tsx                      # ダッシュボードページ
│   └── profile/page.tsx                  # プロフィールページ
└── lib/
    └── mongodb.ts                        # MongoDB接続ユーティリティ
```

### 3.2 処理フロー

#### ログインフロー
```
[/auth/signin] → Googleログインボタン押下
  → signIn("google") 呼び出し
  → Google OAuth画面 → 認証成功
  → NextAuth callback → MongoDB Userコレクション upsert
  → JWTセッション生成
  → /dashboard にリダイレクト
```

#### 認証チェックフロー
```
[保護ルートアクセス] → middleware.ts でセッション確認
  → セッションあり → ページ表示
  → セッションなし → /auth/signin にリダイレクト
```

#### プロフィール更新フロー
```
[/profile] → フォーム入力 → 保存ボタン
  → PUT /api/user/profile { name }
  → MongoDB User更新
  → セッション更新
  → 成功メッセージ表示
```

### 3.3 実装分担（5エージェント）
| Agent | 担当 | 作成ファイル |
|-------|------|-------------|
| Agent 1 | Auth Core | `src/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts` |
| Agent 2 | MongoDB + Middleware | `src/lib/mongodb.ts`, `middleware.ts` |
| Agent 3 | SessionProvider + ログインページ | `src/app/providers.tsx`, layout更新, `src/app/auth/signin/page.tsx` |
| Agent 4 | ダッシュボード | `src/app/dashboard/layout.tsx`, `src/app/dashboard/page.tsx` |
| Agent 5 | プロフィール + API | `src/app/profile/page.tsx`, `src/app/api/user/profile/route.ts` |

### 3.4 依存パッケージ
```
next-auth@beta        # Auth.js v5
@auth/mongodb-adapter # MongoDB Adapter
mongodb               # MongoDB Driver
```
