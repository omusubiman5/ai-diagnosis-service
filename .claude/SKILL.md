# AIコーディング標準ガイドライン v2.1

このファイルは**AI（Claude、ChatGPT、GitHub Copilot等）**がコード生成する際に参照する標準ガイドラインです。

**重要**: コード生成時は以下のドキュメントを必ず参照してください：
- `07_System/Settings/ai-coding-guidelines.md` - 詳細なコーディングガイドライン
- `07_System/Settings/ai-agent-code-quality-rules.md` - AIエージェントコード品質標準化ルール（**必須**）
- `docs/要件定義/MVP機能一覧と優先順位.md` - プロジェクト要件定義

---

## 🔍 AI自己検証ルール（最重要・絶対必須）

### **AIは生成したコードを必ず自分で実行して確認する**

```markdown
⚠️ 超重要ルール

コード生成 → AI自身が実行検証 → 動作確認 → 人間に提供

検証なしでコードを提供することは絶対禁止
推測で「動くはず」は禁止
```

### 検証方法（必須手順）

#### **HTMLファイルの検証**

```bash
1. HTMLファイルを生成
2. ブラウザツールで開く（シークレットモード推奨）
3. 全画面表示で確認
4. 必須チェック項目:
   ✅ レイアウトが崩れていないか
   ✅ 日本語・絵文字が正しく表示されるか（UTF-8確認）
   ✅ コンソールにエラーが出ていないか
   ✅ すべてのボタンが動作するか
   ✅ レスポンシブデザインが機能するか
```

**ブラウザコンソールでの確認コマンド:**
```javascript
// UTF-8エンコーディング確認
console.log('Encoding:', document.characterSet); // 必ず "UTF-8"

// 日本語・絵文字確認
console.log('Test:', '日本語🎉');

// エラー確認
console.error('Error check');
```

#### **TypeScript/JavaScriptの検証**

```bash
# 1. 型チェック（TypeScript）
npx tsc --noEmit ファイル名.ts

# 2. ESLintチェック
npx eslint ファイル名.ts

# 3. 実際に実行
node ファイル名.js
# または
npx tsx ファイル名.ts

# 4. 結果確認
✅ 型エラー: 0件
✅ ESLintエラー: 0件
✅ 実行エラー: なし
✅ 期待通りの出力
```

#### **APIエンドポイントの検証**

```bash
# 1. 開発サーバー起動
npm run dev

# 2. curlでテスト
curl -X GET http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json"

# 3. 確認項目
✅ ステータスコード: 200 OK
✅ レスポンス形式: { "data": [...] }
✅ エラーハンドリング: 適切
```

#### **データベーススキーマの検証**

```bash
# Prismaの場合
npx prisma validate
npx prisma format
npx prisma generate
npx prisma migrate dev --name test

# MongoDBの場合
# スキーマバリデーション実行
# インデックス確認
```

### 検証できない場合の対応

```markdown
⚠️ 以下の場合は「わかりません」と明示

1. 環境が不明
   → "Node.jsバージョンが不明です"
   → "データベース接続情報が不明です"

2. 依存関係が不足
   → "以下のパッケージインストールが必要です: [リスト]"
   → "推定インストール時間: 約XX秒"

3. 設定ファイルが不足
   → ".env ファイルが必要です"
   → "DATABASE_URL の設定が必要です"
```

### 検証結果の報告形式

```markdown
✅ 検証完了レポート

【実行環境】
- Node.js: v20.x
- ブラウザ: Chrome 120

【検証項目】
✅ 型チェック: エラーなし
✅ ESLint: 違反なし
✅ ブラウザ表示: 正常
✅ UTF-8表示: 正常
✅ 機能動作: 全て正常

【確認内容】
- シークレットモードで全画面表示を確認
- コンソールエラー: 0件
- 全てのボタンをクリックして動作確認
```

---

## ⚠️ 既存設定の保護（絶対禁止事項）

### ESLint/Prettier/tsconfig.json の変更禁止

```javascript
// ❌ FORBIDDEN: 既存設定ファイルの削除・変更
// - .eslintrc.* の削除・変更
// - .prettierrc の削除・変更
// - tsconfig.json の削除・変更
// - 既存ルールの無効化・緩和

// ✅ ALLOWED: 既存設定に従ったコード生成のみ
```

**AI Agent への厳格な指示**:
1. **既存の設定ファイルを絶対に削除しない**
2. **既存のルールを絶対に変更しない**
3. **新規ルール追加は事前確認必須**
4. **設定変更が必要な場合は理由を明示して人間に確認を求める**

---

## 🚫 時間遅延の防止（厳守）

### インストール・待機処理の禁止

```javascript
// ❌ FORBIDDEN: 勝手にパッケージをインストール
// npm install some-package
// yarn add some-package

// ✅ REQUIRED: 既存の依存関係のみ使用
// package.json に記載されているパッケージのみ使用可能

// ✅ REQUIRED: 新規依存が必要な場合
console.log("⚠️ 新規パッケージが必要です:");
console.log("- パッケージ名: react-query");
console.log("- 理由: データフェッチングの最適化");
console.log("- インストールコマンド: npm install react-query");
console.log("- 推定時間: 約30秒");
console.log("承認されますか？");
```

### 不明事項の即座報告（推測禁止）

```javascript
// ❌ FORBIDDEN: 推測で実装
// "おそらく〇〇だと思うので、××します"

// ✅ REQUIRED: 不明な場合は明示
/**
 * ⚠️ わからない事項
 * 
 * - 認証方式が不明（JWT? Session? OAuth?）
 * - データベーススキーマが不明（Prismaモデル未定義）
 * - API仕様が不明（レスポンス形式が未確認）
 * 
 * 上記が不明なため、実装を進められません。
 * 以下の情報を提供してください：
 * 1. 認証方式の確認
 * 2. データベーススキーマの確認または作成
 * 3. API仕様書の参照
 */
```

---

## 📄 文字エンコーディング規則（絶対厳守）

### UTF-8（BOMなし）必須

```javascript
// ✅ REQUIRED: すべてのファイルはUTF-8（BOMなし）で保存

// ✅ 文字列リテラルは常にUTF-8
const message = "日本語文字列もUTF-8で保存";
const emoji = "絵文字🎉もUTF-8";

// ❌ FORBIDDEN: Shift_JIS、EUC-JP、その他のエンコーディング
```

**エディタ設定（VSCode）:**
```json
// .vscode/settings.json
{
  "files.encoding": "utf8",
  "files.eol": "\n",
  "files.insertFinalNewline": true,
  "files.trimTrailingWhitespace": true
}
```

---

## 基本原則

- **可読性 > 簡潔性**: コードは書くより読む時間の方が長い
- **一貫性**: プロジェクト全体で同じスタイルを維持
- **明確性**: 意図が明確に伝わる命名と構造
- **保守性**: 将来の変更に耐えられる設計

---

## JavaScript/TypeScript

### スタイルガイド準拠

- **Airbnb JavaScript Style Guide** に準拠
- **Google JavaScript Style Guide** に準拠

### 命名規則

```javascript
// ✅ 変数・関数: camelCase
const userName = 'John';
function calculateTotal() { }

// ✅ クラス・コンポーネント: PascalCase
class UserAccount { }
function UserProfile() { }

// ✅ 定数: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';

// ❌ snake_case（定数以外では使用禁止）
const user_name = 'John'; // NG
```

### TypeScript型定義

```typescript
// ✅ REQUIRED: 明示的な型定義
function calculateAge(birthDate: Date): number {
  const today = new Date();
  return today.getFullYear() - birthDate.getFullYear();
}

// ❌ FORBIDDEN: any型の使用
const data: any = fetchData(); // NG

// ✅ REQUIRED: 適切な型定義
interface User {
  id: string;
  email: string;
  name: string;
}
const user: User = await fetchUser();
```

### async/await優先

```javascript
// ✅ GOOD: async/await
async function fetchUserData(userId) {
  const user = await getUser(userId);
  const orders = await getOrders(user.id);
  return { user, orders };
}

// ❌ BAD: コールバック地獄
getUserData(userId, (user) => {
  getOrders(user.id, (orders) => {
    // ...
  });
});
```

---

## React/Next.js

### コンポーネント設計

```typescript
// ✅ GOOD: 関数コンポーネント + Hooks
import { memo, useCallback, useMemo } from 'react';

interface Props {
  users: User[];
  onDelete: (id: string) => void;
}

const UserList = memo(function UserList({ users, onDelete }: Props) {
  const sortedUsers = useMemo(
    () => [...users].sort((a, b) => a.name.localeCompare(b.name)),
    [users]
  );
  
  const handleDelete = useCallback((id: string) => {
    onDelete(id);
  }, [onDelete]);
  
  return (
    <div>
      {sortedUsers.map(user => (
        <UserCard key={user.id} user={user} onDelete={handleDelete} />
      ))}
    </div>
  );
});

// ❌ BAD: クラスコンポーネント（避ける）
class UserList extends React.Component {
  // ...
}
```

### カスタムフック

```typescript
// ✅ GOOD: ロジックをカスタムフックに分離
function useUserData(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    fetchUser(userId)
      .then(setUser)
      .finally(() => setLoading(false));
  }, [userId]);
  
  return { user, loading };
}
```

### パフォーマンス最適化

```typescript
// ✅ React.memo、useMemo、useCallback を適切に使用
- React.memo: コンポーネントの再レンダリング防止
- useMemo: 高コストな計算結果のメモ化
- useCallback: 関数参照の安定化
```

---

## バックエンドAPI設計

### Google Cloud API Design Guide 準拠

#### URL設計ルール

```typescript
// ✅ Good: 名詞を使用、複数形、小文字とハイフン
GET    /api/v1/users
GET    /api/v1/users/:id
POST   /api/v1/users
PUT    /api/v1/users/:id
PATCH  /api/v1/users/:id
DELETE /api/v1/users/:id

// ネストは最大2段階まで
GET    /api/v1/users/:userId/orders
POST   /api/v1/users/:userId/orders

// ❌ Bad: 動詞をURLに含める
GET    /api/v1/getUsers
POST   /api/v1/createUser
PUT    /api/v1/updateUser/:id
```

**ルール:**
- URLは名詞のみ（動詞はHTTPメソッドで表現）
- リソース名は複数形を使用（`/users`, `/orders`）
- 小文字とハイフンで区切る（`/user-profiles`, `/order-items`）
- ネストは最大2段階まで（`/users/:id/orders`）
- APIバージョニング: `/api/v1/`, `/api/v2/` 形式

#### HTTPステータスコード

```typescript
const HTTP_STATUS = {
  // 成功系
  OK: 200,              // GET, PUT, PATCH の成功
  CREATED: 201,         // POST の成功（リソース作成）
  NO_CONTENT: 204,      // DELETE の成功
  
  // クライアントエラー系
  BAD_REQUEST: 400,     // バリデーションエラー
  UNAUTHORIZED: 401,    // 認証が必要
  FORBIDDEN: 403,       // 認可なし（権限不足）
  NOT_FOUND: 404,       // リソース存在しない
  CONFLICT: 409,        // リソース競合（例: 重複作成）
  TOO_MANY: 429,        // レート制限超過
  
  // サーバーエラー系
  INTERNAL_ERROR: 500,  // サーバー側のエラー
} as const;
```

#### エラーレスポンス形式

```typescript
// ✅ Good: 統一されたエラーレスポンス形式
interface ErrorResponse {
  error: {
    code: string;        // エラーコード（例: "USER_NOT_FOUND"）
    message: string;     // 人間が読めるエラーメッセージ
    details?: unknown;   // 追加のエラー詳細（任意）
  };
}

// 例
{
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User with ID 123 not found",
    "details": {
      "userId": "123"
    }
  }
}
```

#### ページネーション

```typescript
// ✅ Good: 標準的なページネーション
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;        // 現在のページ番号
    pageSize: number;    // 1ページあたりの件数
    total: number;       // 総件数
    totalPages: number;  // 総ページ数
  };
}

// クエリパラメータ
GET /api/v1/users?page=1&pageSize=20&sort=createdAt&order=desc
```

#### フィルタリング・ソート

```typescript
// ✅ Good: クエリパラメータでフィルタリング・ソート
GET /api/v1/users?filter=status:ACTIVE&sort=createdAt&order=desc
GET /api/v1/users?filter=age:gte:18&filter=age:lte:65
GET /api/v1/users?search=john&limit=10
```

#### APIバージョニング

```typescript
// ✅ Good: URLパスでバージョニング
/api/v1/users
/api/v2/users

// ❌ Bad: クエリパラメータやヘッダーでバージョニング
/api/users?version=1
```

---

## データベース設計

### SQL（PostgreSQL + Prisma）

**スタイルガイド**: SQL Style Guide by Simon Holywell に準拠

```prisma
// ✅ Prismaモデル定義
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  posts     Post[]   @relation("UserPosts")
  
  @@index([email])
  @@map("users") // テーブル名: 複数形、snake_case
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  author    User     @relation("UserPosts", fields: [authorId], references: [id], onDelete: Cascade)
  
  @@index([authorId])
  @@index([createdAt])
  @@map("posts")
}
```

**命名規則:**
- テーブル名: 複数形、小文字、snake_case（例: `users`, `order_items`）
- カラム名: 小文字、snake_case（例: `user_id`, `created_at`）
- 主キー: `{table_name}_id` 形式（例: `user_id`）

**必須事項:**
- 最低3NF正規化を達成
- 外部キー制約を必ず使用
- よくクエリされる列にインデックスを作成

### MongoDB

```javascript
// ✅ Embedding: 1対1、1対多、頻繁にアクセスするデータ
{
  _id: ObjectId("..."),
  name: "John Doe",
  address: {  // Embedded
    street: "123 Main St",
    city: "Tokyo"
  }
}

// ✅ Referencing: 多対多、独立したドキュメント
{
  _id: ObjectId("..."),
  name: "John Doe",
  order_ids: [  // Referenced
    ObjectId("..."),
    ObjectId("...")
  ]
}
```

**命名規則:**
- フィールド名は snake_case で統一
- Schema Versioning パターンでマイグレーション対応

---

## エラーハンドリング

### エラークラス定義

```typescript
// ✅ GOOD: 明確なエラークラス
class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

class ValidationError extends Error {
  constructor(message: string, public details?: unknown) {
    super(message);
    this.name = 'ValidationError';
  }
}

// 使用例
if (!user) {
  throw new NotFoundError(`User with ID ${userId} not found`);
}
```

### 統一されたエラーレスポンス

```typescript
// ✅ APIエンドポイントでの使用
export async function GET(request: Request) {
  try {
    const user = await getUser(userId);
    return Response.json({ data: user });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return Response.json(
        {
          error: {
            code: 'USER_NOT_FOUND',
            message: error.message,
          }
        },
        { status: 404 }
      );
    }
    throw error; // その他のエラーは再スロー
  }
}
```

---

## 🔒 セキュリティ（Project CodeGuard + OWASP + CWE準拠）

### Project CodeGuard概要

**Project CodeGuardとは**: CiscoがOWASP/CWE基準に基づいて開発した、AI駆動開発向けのセキュリティフレームワーク。AI coding agentsがコード生成する前・最中・後の全段階でsecure-by-defaultプラクティスを埋め込む。

**対策する主要脆弱性**:
- ハードコードされた認証情報
- 入力検証の欠如
- 弱い暗号化アルゴリズム
- 安全でない関数の使用
- 認証・認可チェックの欠如

---

### CodeGuard-1: ハードコード認証情報の禁止（必須）

```typescript
// ❌ FORBIDDEN: ハードコードされた認証情報（Project CodeGuard違反）
const API_KEY = "sk-1234567890abcdef"; // 絶対禁止
const DATABASE_URL = "postgresql://user:password@localhost/db"; // 絶対禁止
const AWS_SECRET = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"; // 絶対禁止

// ❌ FORBIDDEN: コード内の認証情報
export const config = {
  apiKey: "sk-1234567890abcdef",
  dbPassword: "mypassword123",
  jwtSecret: "super-secret-key"
};

// ✅ REQUIRED: 環境変数から読み込む
const API_KEY = process.env.API_KEY;
const DATABASE_URL = process.env.DATABASE_URL;
const AWS_SECRET = process.env.AWS_SECRET_ACCESS_KEY;

if (!API_KEY) {
  throw new Error('API_KEY environment variable is not set');
}

// ✅ REQUIRED: .envファイル使用（.gitignoreに追加必須）
// .env
API_KEY=your-api-key-here
DATABASE_URL=postgresql://localhost/mydb
AWS_SECRET_ACCESS_KEY=your-secret-here

// ✅ REQUIRED: シークレット管理サービス使用
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

async function getSecret(secretName: string) {
  const client = new SecretsManagerClient({ region: "us-east-1" });
  const response = await client.send(
    new GetSecretValueCommand({ SecretId: secretName })
  );
  return JSON.parse(response.SecretString);
}
```

### CodeGuard-2: 入力検証（必須）

```typescript
// ❌ FORBIDDEN: 入力検証なし（Project CodeGuard違反）
app.post('/api/users', async (req, res) => {
  const { email, age } = req.body;
  const user = await createUser({ email, age }); // 危険！
  res.json(user);
});

// ❌ FORBIDDEN: 単純な型チェックのみ
if (typeof email === 'string') {
  // これだけでは不十分
}

// ✅ REQUIRED: Zodによる厳格な検証
import { z } from 'zod';

const UserSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .max(254, 'Email too long'), // RFC 5321準拠
  age: z.number()
    .int('Age must be an integer')
    .min(0, 'Age cannot be negative')
    .max(150, 'Age is unrealistic'),
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .regex(/^[\p{L}\p{N}\s-]+$/u, 'Invalid characters in name'), // Unicode対応
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number') // E.164形式
    .optional(),
});

app.post('/api/users', async (req, res) => {
  // 検証
  const result = UserSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: result.error.format(),
      }
    });
  }
  
  // 検証済みデータのみ使用
  const user = await createUser(result.data);
  res.json({ data: user });
});

// ✅ ADDITIONAL: ファイルアップロードの検証
const FileUploadSchema = z.object({
  filename: z.string()
    .regex(/^[a-zA-Z0-9_-]+\.(jpg|jpeg|png|pdf)$/, 'Invalid filename'),
  size: z.number()
    .max(5 * 1024 * 1024, 'File too large (max 5MB)'),
  mimetype: z.enum(['image/jpeg', 'image/png', 'application/pdf']),
});
```

### CodeGuard-3: SQLインジェクション対策（必須）

```typescript
// ❌ FORBIDDEN: 文字列連結によるSQL構築（Project CodeGuard違反）
const userId = req.params.id;
const query = `SELECT * FROM users WHERE id = ${userId}`; // 危険！
const users = await db.query(query);

const searchTerm = req.query.search;
const query = `SELECT * FROM posts WHERE title LIKE '%${searchTerm}%'`; // 危険！

// ❌ FORBIDDEN: 動的SQL構築
const orderBy = req.query.sort;
const query = `SELECT * FROM users ORDER BY ${orderBy}`; // 危険！

// ✅ REQUIRED: Prisma ORM使用（自動パラメータ化）
const user = await prisma.user.findUnique({
  where: { id: userId }
});

const posts = await prisma.post.findMany({
  where: {
    title: {
      contains: searchTerm,
      mode: 'insensitive'
    }
  }
});

// ✅ REQUIRED: ソート項目のホワイトリスト
const ALLOWED_SORT_FIELDS = ['createdAt', 'updatedAt', 'name'] as const;
const sortField = ALLOWED_SORT_FIELDS.includes(orderBy) ? orderBy : 'createdAt';

const users = await prisma.user.findMany({
  orderBy: { [sortField]: 'desc' }
});

// ✅ ALTERNATIVE: 生SQLが必須の場合はパラメータ化必須
const users = await prisma.$queryRaw`
  SELECT * FROM users WHERE id = ${userId}
`;

// ✅ PostgreSQLのprepared statements
const result = await pool.query(
  'SELECT * FROM users WHERE email = $1 AND age > $2',
  [email, minAge]
);
```

### CodeGuard-4: XSS（クロスサイトスクリプティング）対策（必須）

```typescript
// ❌ FORBIDDEN: innerHTML への直接代入（Project CodeGuard違反）
const userComment = getUserComment();
element.innerHTML = userComment; // 危険！
element.innerHTML = `<div>${userComment}</div>`; // 危険！

// ❌ FORBIDDEN: dangerouslySetInnerHTML without sanitization
<div dangerouslySetInnerHTML={{ __html: userComment }} /> // 危険！

// ✅ REQUIRED: textContent 使用（自動エスケープ）
element.textContent = userComment;

// ✅ REQUIRED: React（自動エスケープ）
return <div>{userComment}</div>;

// ✅ REQUIRED: サニタイズが必須の場合のみDOMPurify使用
import DOMPurify from 'isomorphic-dompurify';

const cleanHTML = DOMPurify.sanitize(userComment, {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em'],
  ALLOWED_ATTR: []
});
element.innerHTML = cleanHTML;

// ✅ REQUIRED: URLのサニタイズ
function sanitizeURL(url: string): string {
  try {
    const parsed = new URL(url);
    // HTTPSのみ許可
    if (parsed.protocol !== 'https:') {
      throw new Error('Only HTTPS URLs allowed');
    }
    return parsed.href;
  } catch {
    return '#';
  }
}
```

### CodeGuard-5: 認証・認可（必須）

```typescript
// ❌ FORBIDDEN: 認証チェックなし（Project CodeGuard違反）
export async function DELETE(request: Request) {
  const { id } = await request.json();
  await deleteUser(id); // 誰でも削除可能 - 危険！
  return Response.json({ success: true });
}

// ❌ FORBIDDEN: クライアント側のみの認証チェック
// フロントエンドのチェックは簡単にバイパス可能

// ✅ REQUIRED: サーバー側での認証・認可チェック
import { auth } from '@clerk/nextjs';

export async function DELETE(request: Request) {
  // 1. 認証確認
  const { userId } = auth();
  if (!userId) {
    return Response.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    );
  }
  
  // 2. 認可確認
  const { id } = await request.json();
  const resource = await prisma.resource.findUnique({
    where: { id },
    select: { ownerId: true }
  });
  
  if (!resource) {
    return Response.json(
      { error: { code: 'NOT_FOUND', message: 'Resource not found' } },
      { status: 404 }
    );
  }
  
  if (resource.ownerId !== userId) {
    return Response.json(
      { error: { code: 'FORBIDDEN', message: 'Access denied' } },
      { status: 403 }
    );
  }
  
  // 3. 削除実行
  await deleteUser(id);
  return Response.json({ success: true });
}

// ✅ REQUIRED: ロールベースアクセス制御（RBAC）
async function checkPermission(
  userId: string,
  resource: string,
  action: string
): Promise<boolean> {
  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    include: {
      role: {
        include: {
          permissions: true
        }
      }
    }
  });
  
  return userRoles.some(ur =>
    ur.role.permissions.some(p =>
      p.resource === resource && p.action === action
    )
  );
}

export async function DELETE(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return Response.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 });
  }
  
  // パーミッションチェック
  if (!await checkPermission(userId, 'users', 'delete')) {
    return Response.json({ error: { code: 'FORBIDDEN' } }, { status: 403 });
  }
  
  const { id } = await request.json();
  await deleteUser(id);
  return Response.json({ success: true });
}
```

### CodeGuard-6: 暗号化（必須）

```typescript
// ❌ FORBIDDEN: 弱い暗号化アルゴリズム（Project CodeGuard違反）
import crypto from 'crypto';

// MD5（破られた）
const hash = crypto.createHash('md5').update(password).digest('hex'); // 危険！

// SHA-1（破られた）
const hash = crypto.createHash('sha1').update(password).digest('hex'); // 危険！

// DES / 3DES（脆弱）
const cipher = crypto.createCipher('des', key); // 危険！

// ❌ FORBIDDEN: カスタム暗号化アルゴリズム
function myEncryption(data: string): string {
  // 自作の暗号化 - 絶対に使用禁止！
}

// ✅ REQUIRED: パスワードハッシュ化（bcrypt）
import bcrypt from 'bcrypt';

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12; // 最低10、推奨12以上
  return await bcrypt.hash(password, saltRounds);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// ✅ REQUIRED: 暗号化（AES-256-GCM）
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

function encrypt(plaintext: string, key: Buffer): {
  encrypted: string;
  iv: string;
  tag: string;
} {
  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const tag = cipher.getAuthTag();
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    tag: tag.toString('hex')
  };
}

function decrypt(encrypted: string, key: Buffer, iv: string, tag: string): string {
  const decipher = createDecipheriv(
    'aes-256-gcm',
    key,
    Buffer.from(iv, 'hex')
  );
  
  decipher.setAuthTag(Buffer.from(tag, 'hex'));
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

// ✅ REQUIRED: 安全な乱数生成
// 暗号学的に安全な乱数生成器を使用
const token = randomBytes(32).toString('hex');

// ❌ FORBIDDEN: Math.random()（予測可能）
const unsafeToken = Math.random().toString(36); // 危険！
```

### CodeGuard-7: CSRF（クロスサイトリクエストフォージェリ）対策

```typescript
// ❌ FORBIDDEN: CSRF対策なし
app.post('/api/transfer', async (req, res) => {
  const { to, amount } = req.body;
  await transfer(req.user.id, to, amount); // 危険！
});

// ✅ REQUIRED: CSRFトークン検証
import csrf from 'csurf';

const csrfProtection = csrf({ cookie: true });

app.get('/form', csrfProtection, (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() });
});

app.post('/api/transfer', csrfProtection, async (req, res) => {
  const { to, amount } = req.body;
  await transfer(req.user.id, to, amount);
  res.json({ success: true });
});

// ✅ REQUIRED: SameSite Cookie属性
res.cookie('session', sessionId, {
  httpOnly: true,
  secure: true, // HTTPS必須
  sameSite: 'strict', // CSRF対策
  maxAge: 3600000 // 1時間
});
```

### CodeGuard-8: セッション管理

```typescript
// ❌ FORBIDDEN: 安全でないセッション管理
app.post('/login', async (req, res) => {
  const user = await authenticate(req.body);
  req.session.userId = user.id; // 設定が不十分
});

// ✅ REQUIRED: 安全なセッション設定
import session from 'express-session';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';

const redisClient = createClient();
const redisStore = new RedisStore({ client: redisClient });

app.use(session({
  store: redisStore,
  secret: process.env.SESSION_SECRET!, // 環境変数から
  name: 'sessionId', // デフォルトの'connect.sid'を避ける
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, // HTTPS必須
    httpOnly: true, // JavaScriptからアクセス不可
    maxAge: 1000 * 60 * 60, // 1時間
    sameSite: 'strict'
  }
}));

// ✅ REQUIRED: ログイン時のセッション再生成
app.post('/login', async (req, res) => {
  const user = await authenticate(req.body);
  
  // セッション固定攻撃対策
  req.session.regenerate((err) => {
    if (err) throw err;
    
    req.session.userId = user.id;
    req.session.save((err) => {
      if (err) throw err;
      res.json({ success: true });
    });
  });
});

// ✅ REQUIRED: ログアウト時のセッション破棄
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.clearCookie('sessionId');
    res.json({ success: true });
  });
});
```

### CodeGuard-9: ファイルアップロード

```typescript
// ❌ FORBIDDEN: ファイルアップロード検証なし
app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  fs.writeFileSync(`./uploads/${file.originalname}`, file.buffer); // 危険！
});

// ✅ REQUIRED: ファイルアップロード検証
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const ALLOWED_MIMETYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    // ランダムなファイル名を生成（元のファイル名を使わない）
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    // MIMEタイプ検証
    if (!ALLOWED_MIMETYPES.includes(file.mimetype)) {
      return cb(new Error('Invalid file type'));
    }
    
    // ファイル拡張子検証
    const ext = path.extname(file.originalname).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.pdf'].includes(ext)) {
      return cb(new Error('Invalid file extension'));
    }
    
    cb(null, true);
  }
});

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // ファイル内容の検証（magic bytes）
  const fileBuffer = await fs.promises.readFile(req.file.path);
  const fileType = await import('file-type').then(m => m.fileTypeFromBuffer(fileBuffer));
  
  if (!fileType || !ALLOWED_MIMETYPES.includes(fileType.mime)) {
    await fs.promises.unlink(req.file.path); // 不正ファイルを削除
    return res.status(400).json({ error: 'Invalid file content' });
  }
  
  res.json({ filename: req.file.filename });
});
```

### CodeGuard-10: レート制限

```typescript
// ❌ FORBIDDEN: レート制限なし
app.post('/api/login', async (req, res) => {
  // ブルートフォース攻撃に脆弱
});

// ✅ REQUIRED: レート制限実装
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';

const redisClient = createClient();

// 一般APIのレート制限
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 100, // 最大100リクエスト
  message: {
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests, please try again later.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ログインAPIのレート制限（厳格）
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 最大5回の試行
  store: new RedisStore({
    client: redisClient,
    prefix: 'rate_limit:login:'
  }),
  skipSuccessfulRequests: true, // 成功した場合はカウントしない
});

app.use('/api/', generalLimiter);
app.post('/api/login', loginLimiter, async (req, res) => {
  // ログイン処理
});
```

---

### 追加のセキュリティベストプラクティス

#### 依存関係の脆弱性チェック

```bash
# ✅ REQUIRED: 定期的な脆弱性スキャン
npm audit
npm audit fix

# ✅ REQUIRED: 依存関係の更新
npm outdated
npm update

# ✅ REQUIRED: Snyk等のツール使用
npx snyk test
```

#### セキュリティヘッダー

```typescript
// ✅ REQUIRED: セキュリティヘッダーの設定
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true,
}));
```

#### ロギング（機密情報を除外）

```typescript
// ❌ FORBIDDEN: パスワードのログ出力
logger.info('Login attempt', { email, password }); // 危険！

// ✅ REQUIRED: 機密情報を除外
logger.info('Login attempt', { email }); // passwordは記録しない

// ✅ REQUIRED: エラーログ（スタックトレースのみ本番環境では記録）
try {
  await riskyOperation();
} catch (error) {
  logger.error('Operation failed', {
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
}
```

---

## パフォーマンス

### N+1問題の回避

```typescript
// ❌ FORBIDDEN: N+1問題
const users = await prisma.user.findMany();
for (const user of users) {
  user.posts = await prisma.post.findMany({ where: { authorId: user.id } });
}

// ✅ REQUIRED: Eager Loading
const users = await prisma.user.findMany({
  include: {
    posts: true, // 1回のクエリで取得
  },
});
```

### キャッシング戦略（Redis）

```typescript
// ✅ Redisキャッシュ使用例
import Redis from 'ioredis';
const redis = new Redis();

async function getUser(userId: string): Promise<User> {
  // キャッシュ確認
  const cached = await redis.get(`user:${userId}`);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // DB取得
  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  // キャッシュ保存（1時間）
  await redis.setex(`user:${userId}`, 3600, JSON.stringify(user));
  
  return user;
}
```

### React最適化

```typescript
// ✅ useMemo、useCallback、React.memo
- 不要な再レンダリングを避ける
- 高コストな計算をメモ化
- コールバック関数を安定化
```

---

## ドキュメンテーション

### JSDocコメント

```typescript
/**
 * ユーザーを作成する
 * 
 * @param data - ユーザー作成データ
 * @returns 作成されたユーザーオブジェクト
 * @throws {ValidationError} データが無効な場合
 * @throws {ConflictError} メールアドレスが既に使用されている場合
 * 
 * @example
 * ```typescript
 * const user = await createUser({
 *   email: 'user@example.com',
 *   name: 'John Doe',
 * });
 * ```
 */
export async function createUser(data: CreateUserInput): Promise<User> {
  // 実装
}
```

### OpenAPI/Swaggerドキュメント化

```typescript
/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: ユーザー一覧を取得
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: ページ番号
 *     responses:
 *       200:
 *         description: 成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
```

---

## コード生成時のチェックリスト

コードを生成する際は以下を確認：

- [ ] 命名規則に従っているか
- [ ] エラーハンドリングが適切か
- [ ] 型定義が明確か（TypeScript）
- [ ] セキュリティ対策が実装されているか
- [ ] パフォーマンスを考慮しているか
- [ ] ドキュメンテーションが十分か
- [ ] テストが書ける構造か
- [ ] 既存のコードスタイルと一貫性があるか
- [ ] プロジェクトの要件定義を確認したか
- [ ] **生成後に自分で実行検証したか**（最重要）

---

## 参考ドキュメント

詳細なガイドラインは以下を参照：
- `07_System/Settings/ai-coding-guidelines.md` - 詳細コーディングガイドライン
- `07_System/Settings/ai-agent-code-quality-rules.md` - コード品質標準化ルール

---

## 📚 AI Agentへの最終指示

### このガイドラインは「推奨」ではなく「強制」

**コード生成時の絶対ルール**:

1. **自己検証**: 生成したコードは**必ず自分で実行して確認**
2. **既存設定保護**: ESLint/Prettier/tsconfig.json を**絶対に変更しない**
3. **時間遅延回避**: インストール・待機が必要な場合は**事前確認必須**
4. **不明事項報告**: 推測せず**即座に「わかりません」と報告**
5. **UTF-8厳守**: すべてのファイルはUTF-8（BOMなし）
6. **セキュリティ**: 入力検証・認証・認可を**必ず実装**
7. **パフォーマンス**: N+1問題を**必ず回避**

**違反するコードは生成を拒否し、理由を明確に説明すること。**

---

**バージョン**: 2.1.0  
**最終更新**: 2025-02-06  
**準拠基準**: Google API Design Guide, Airbnb JavaScript Style Guide, SQL Style Guide by Simon Holywell

## 📚 準拠する公式ガイドライン

### ベースとなる標準規格（変更禁止）

1. **セキュリティ**: [Cisco Project CodeGuard](https://github.com/cisco/codeguard) - セキュアコーディング基準
2. **JavaScript**: [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html) - コーディングスタイル
3. **JavaScript補完**: [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) - 実践的パターン

### 文字エンコーディング規則（絶対厳守）

```javascript
// ✅ REQUIRED: すべてのファイルはUTF-8（BOMなし）で保存
// ファイル先頭に以下を明記（必須）
// -*- coding: utf-8 -*-

// ✅ 文字列リテラルは常にUTF-8
const message = "日本語文字列もUTF-8で保存";
const emoji = "絵文字🎉もUTF-8";

// ❌ FORBIDDEN: Shift_JIS、EUC-JP、その他のエンコーディング
```

**エディタ設定強制**:
```json
// VSCode: .vscode/settings.json（必須設定）
{
  "files.encoding": "utf8",
  "files.eol": "\n",
  "files.insertFinalNewline": true,
  "files.trimTrailingWhitespace": true
}
```

## 📋 ドキュメント参照の強制

### 必須確認フロー（違反=即却下）

```markdown
1. **開始前チェック**
   - [ ] `docs/ai-agent-coding-guidelines.md` を読んだ
   - [ ] `docs/gpt-instructions.md` を確認した
   - [ ] `docs/要件定義/MVP機能一覧と優先順位.md` で要件を理解した
   
2. **コード生成前の質問**
   - この変更は要件定義のどの項目に該当するか？
   - 既存のアーキテクチャパターンに従っているか？
   - セキュリティチェックリストを満たしているか？
   - **不明な点はないか？（不明な場合は即座に報告）**
```

**AI Agent への指示**: 
- 上記チェックが完了していない場合、コード生成を**拒否**
- **不明な点がある場合は推測せず「わかりません」と明示**
- **待ち時間が発生する処理（インストール等）は提案前に明示**

---

## ⚠️ 既存設定の保護（絶対禁止事項）

### ESLint/Prettier設定の変更禁止

```javascript
// ❌ FORBIDDEN: .eslintrc.*, .prettierrc.*, tsconfig.json の削除
// ❌ FORBIDDEN: 既存ルールの無効化・緩和
// ❌ FORBIDDEN: 勝手な設定の追加・変更

// ✅ ALLOWED: 既存設定に従ったコード生成のみ
```

**AI Agent への厳格な指示**:
1. **既存の設定ファイルを絶対に削除しない**
2. **既存のルールを絶対に変更しない**
3. **新規ルール追加は事前確認必須**
4. **設定変更が必要な場合は理由を明示して人間に確認を求める**

### 既存プロジェクト設定の尊重

```bash
# プロジェクト開始時に必ず確認（自動実行）
- .eslintrc.js / .eslintrc.json の存在確認
- .prettierrc の存在確認  
- tsconfig.json の設定確認
- package.json の scripts 確認

# 既存設定に従う（変更不可）
```

---

## 🔍 生成コードの自己検証（最重要・絶対必須）

### **AI自身がコードを実行して確認する（必須）**

```markdown
⚠️ 超重要ルール

コード生成 → AI自身が実行検証 → 動作確認 → 人間に提供

検証なしでコードを提供することは絶対禁止
推測で「動くはず」は禁止
```

### 検証方法の裏技

#### **HTMLファイルの検証**

```bash
1. HTMLファイルを生成
2. ブラウザツールで開く（シークレットモード推奨）
3. 全画面表示で確認
4. 以下を必ずチェック:
   ✅ レイアウトが崩れていないか
   ✅ 日本語・絵文字が正しく表示されるか  
   ✅ コンソールにエラーが出ていないか
   ✅ すべてのボタンが動作するか
   ✅ レスポンシブデザインが機能するか
```

**検証コマンド（ブラウザコンソール）:**
```javascript
// UTF-8確認
console.log('Encoding:', document.characterSet); // 必ず "UTF-8"

// 日本語・絵文字確認
console.log('Test:', '日本語🎉'); // 正しく表示されるか

// エラー確認
console.error('Error check'); // エラーがないか確認
```

#### **TypeScript/JavaScriptの検証**

```bash
# 1. 型チェック（TypeScript）
npx tsc --noEmit ファイル名.ts

# 2. ESLintチェック
npx eslint ファイル名.ts

# 3. 実際に実行
node ファイル名.js
# または
npx tsx ファイル名.ts

# 4. 結果確認
✅ 型エラーなし
✅ ESLintエラーなし  
✅ 実行エラーなし
✅ 期待通りの出力
```

#### **APIエンドポイントの検証**

```bash
# 1. 開発サーバー起動
npm run dev

# 2. 別ターミナルでcurlテスト
curl -X GET http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json"

# 3. 確認項目
✅ ステータスコード: 200 OK
✅ レスポンス形式: { "data": [...] }
✅ エラーなし
```

#### **データベーススキーマの検証**

```bash
# 1. Prismaスキーマ検証
npx prisma validate

# 2. フォーマット確認
npx prisma format

# 3. クライアント生成テスト
npx prisma generate

# 4. マイグレーション（開発環境のみ）
npx prisma migrate dev --name test
```

### 検証できない場合の対応

```markdown
⚠️ 以下の場合は「わかりません」と明示

1. 環境が不明
   → "Node.jsバージョンが不明です"
   → "データベース接続情報が不明です"

2. 依存関係が不足
   → "以下のパッケージインストールが必要です: [リスト]"
   → "推定インストール時間: 約XX秒"

3. 設定ファイルが不足
   → ".env ファイルが必要です"
   → "DATABASE_URL の設定が必要です"
```

### 検証結果の報告形式

```markdown
✅ 検証完了レポート

【実行環境】
- Node.js: v20.x
- ブラウザ: Chrome 120

【検証項目】
✅ 型チェック: エラーなし
✅ ESLint: 違反なし
✅ ブラウザ表示: 正常
✅ 日本語表示: 正常
✅ 機能動作: 全て正常

【確認したこと】
- シークレットモードで全画面表示を確認
- コンソールエラー: 0件
- 全てのボタンをクリックして動作確認
```

---

## 🚫 時間遅延の防止（厳守）

### インストール・待機処理の禁止

```javascript
// ❌ FORBIDDEN: 勝手にパッケージをインストール
// npm install some-package
// yarn add some-package

// ❌ FORBIDDEN: 不明なツールの提案
// "XXXをインストールしてください"（不明な場合）

// ✅ REQUIRED: 既存の依存関係のみ使用
// package.json に記載されているパッケージのみ使用可能

// ✅ REQUIRED: 新規依存が必要な場合
console.log("⚠️ 新規パッケージが必要です:");
console.log("- パッケージ名: react-query");
console.log("- 理由: データフェッチングの最適化");
console.log("- インストールコマンド: npm install react-query");
console.log("- 推定時間: 約30秒");
console.log("承認されますか？");
```

### 不明事項の即座報告（推測禁止）

```javascript
// ❌ FORBIDDEN: 推測で実装
// "おそらく〇〇だと思うので、××します"

// ✅ REQUIRED: 不明な場合は明示
/**
 * ⚠️ わからない事項
 * 
 * - 認証方式が不明（JWT? Session? OAuth?）
 * - データベーススキーマが不明（Prismaモデル未定義）
 * - API仕様が不明（レスポンス形式が未確認）
 * 
 * 上記が不明なため、実装を進められません。
 * 以下の情報を提供してください：
 * 1. 認証方式の確認
 * 2. Prismaスキーマの確認または作成
 * 3. API仕様書の参照
 */
```

---

## 🔒 セキュリティ規則（Cisco CodeGuard準拠）

### 入力検証（強制）

```javascript
// ✅ REQUIRED: すべてのユーザー入力を検証（Cisco CodeGuard準拠）
import { z } from 'zod';

// 入力スキーマ定義（必須）
const UserInputSchema = z.object({
  email: z.string().email().max(254), // RFC 5321準拠
  password: z.string().min(12).max(128), // NIST推奨
  name: z.string().min(1).max(100).regex(/^[\p{L}\p{N}\s-]+$/u), // Unicode対応
});

export async function POST(request: Request) {
  const rawInput = await request.json();
  
  // バリデーション（必須）
  const result = UserInputSchema.safeParse(rawInput);
  if (!result.success) {
    return Response.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: result.error.format(),
        }
      },
      { status: 400 }
    );
  }
  
  // 検証済みデータのみ使用
  const validData = result.data;
  // ... 処理継続
}
```

### SQLインジェクション対策（強制）

```javascript
// ❌ FORBIDDEN: 生SQLクエリ（Cisco CodeGuard違反）
const users = await db.query(`SELECT * FROM users WHERE id = ${userId}`);
const search = await db.query(`SELECT * FROM posts WHERE title LIKE '%${term}%'`);

// ✅ REQUIRED: Prisma ORM使用（パラメータ化自動）
const users = await prisma.user.findUnique({ 
  where: { id: userId } 
});

const search = await prisma.post.findMany({
  where: { 
    title: { contains: term, mode: 'insensitive' } 
  }
});

// ✅ ALTERNATIVE: 生SQLが必須の場合はパラメータ化必須
const users = await prisma.$queryRaw`
  SELECT * FROM users WHERE id = ${userId}
`;
```

### XSS対策（強制）

```javascript
// ❌ FORBIDDEN: innerHTML への直接代入
element.innerHTML = userInput;
element.innerHTML = `<div>${userComment}</div>`;

// ✅ REQUIRED: textContent 使用またはサニタイズ
element.textContent = userInput;

// ✅ React の場合（自動エスケープ）
return <div>{userComment}</div>;

// ✅ サニタイズが必須の場合
import DOMPurify from 'isomorphic-dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);
```

### 認証・認可（強制）

```javascript
// ✅ REQUIRED: すべてのAPIエンドポイントで認証チェック
import { auth } from '@clerk/nextjs';

export async function GET(request: Request) {
  // 1. 認証確認（必須）
  const { userId } = auth();
  if (!userId) {
    return Response.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    );
  }
  
  // 2. 認可確認（リソースアクセス時は必須）
  const resource = await getResource(resourceId);
  if (resource.ownerId !== userId) {
    return Response.json(
      { error: { code: 'FORBIDDEN', message: 'Access denied' } },
      { status: 403 }
    );
  }
  
  // 3. ビジネスロジック
  return Response.json({ data: resource });
}
```

---

## 📐 JavaScript規則（Google Style Guide準拠）

### 命名規則（Google準拠）

```javascript
// ✅ 変数・関数: lowerCamelCase
const userName = 'John';
function calculateTotal() { }

// ✅ クラス・コンポーネント: UpperCamelCase
class UserAccount { }
function UserProfile() { }

// ✅ 定数: CONSTANT_CASE
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';

// ✅ プライベートフィールド: _prefix または #private
class Example {
  _privateField = 'private';
  #reallyPrivate = 'truly private';
}

// ❌ FORBIDDEN: snake_case（定数以外）
const user_name = 'John'; // NG
function calculate_total() { } // NG
```

### 関数定義（Google準拠）

```javascript
// ✅ PREFERRED: アロー関数（短い関数）
const add = (a, b) => a + b;
const users = data.map(item => item.user);

// ✅ PREFERRED: 通常の関数（複雑なロジック）
function processUserData(userData) {
  // 複数行の処理
  const validated = validate(userData);
  const transformed = transform(validated);
  return save(transformed);
}

// ✅ REQUIRED: JSDoc コメント（public関数は必須）
/**
 * ユーザーデータを処理して保存する
 * @param {Object} userData - 処理対象のユーザーデータ
 * @param {string} userData.email - メールアドレス
 * @param {string} userData.name - ユーザー名
 * @returns {Promise<User>} 保存されたユーザーオブジェクト
 * @throws {ValidationError} データが無効な場合
 */
async function processUserData(userData) {
  // 実装
}
```

### 型定義（Google + TypeScript準拠）

```typescript
// ✅ REQUIRED: 明示的な型定義
function calculateAge(birthDate: Date): number {
  const today = new Date();
  return today.getFullYear() - birthDate.getFullYear();
}

// ✅ REQUIRED: インターフェース定義
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

// ❌ FORBIDDEN: any型の使用
const data: any = fetchData(); // NG

// ✅ REQUIRED: 適切な型定義
interface ApiResponse {
  data: User[];
  total: number;
}
const response: ApiResponse = await fetchData();

// ✅ ALTERNATIVE: unknown型 + 型ガード
const data: unknown = await fetchData();
if (isUserArray(data)) {
  // data は User[] として扱える
}
```

---

## 🎯 API設計（Google API Design Guide準拠）

### URL設計規則

```typescript
// ✅ GOOD: Google API Design Guide準拠
GET    /api/v1/users              // コレクション取得
GET    /api/v1/users/:id          // 単一リソース取得
POST   /api/v1/users              // リソース作成
PUT    /api/v1/users/:id          // リソース完全更新
PATCH  /api/v1/users/:id          // リソース部分更新
DELETE /api/v1/users/:id          // リソース削除

// ネスト（最大2階層）
GET    /api/v1/users/:userId/orders
POST   /api/v1/users/:userId/orders

// ❌ BAD: 動詞を含むURL
GET    /api/v1/getUsers            // NG
POST   /api/v1/createUser          // NG
DELETE /api/v1/deleteUser/:id     // NG
```

### レスポンス形式（統一必須）

```typescript
// ✅ 成功レスポンス
interface SuccessResponse<T> {
  data: T;
  meta?: {
    requestId: string;
    timestamp: string;
  };
}

// ✅ エラーレスポンス
interface ErrorResponse {
  error: {
    code: string;        // 機械可読コード（例: "USER_NOT_FOUND"）
    message: string;     // 人間可読メッセージ
    details?: unknown;   // 追加情報（オプション）
  };
}

// ✅ ページネーションレスポンス
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// 実装例
export async function GET(request: Request) {
  try {
    const users = await prisma.user.findMany();
    return Response.json({ data: users }, { status: 200 });
  } catch (error) {
    return Response.json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch users',
      }
    }, { status: 500 });
  }
}
```

### HTTPステータスコード（厳格使用）

```typescript
const HTTP_STATUS = {
  // 成功系
  OK: 200,              // GET, PUT, PATCH の成功
  CREATED: 201,         // POST の成功（リソース作成）
  NO_CONTENT: 204,      // DELETE の成功
  
  // リダイレクト系
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  
  // クライアントエラー系
  BAD_REQUEST: 400,     // バリデーションエラー
  UNAUTHORIZED: 401,    // 認証失敗
  FORBIDDEN: 403,       // 認可失敗
  NOT_FOUND: 404,       // リソース不存在
  CONFLICT: 409,        // リソース競合
  TOO_MANY: 429,        // レート制限
  
  // サーバーエラー系
  INTERNAL_ERROR: 500,  // 内部エラー
  NOT_IMPLEMENTED: 501, // 未実装
  BAD_GATEWAY: 502,     // 外部サービスエラー
  UNAVAILABLE: 503,     // サービス停止
} as const;

// ✅ 正しい使用例
export async function POST(request: Request) {
  const user = await createUser(data);
  return Response.json({ data: user }, { status: HTTP_STATUS.CREATED });
}

export async function DELETE(request: Request) {
  await deleteUser(userId);
  return new Response(null, { status: HTTP_STATUS.NO_CONTENT });
}
```

---

## 🗄️ データベース設計（3NF正規化必須）

## 🗄️ データベース設計（3NF正規化必須）

### Prisma スキーマ規則

```prisma
// ✅ GOOD: 第三正規形（3NF）準拠
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // リレーション
  posts     Post[]   @relation("UserPosts")
  orders    Order[]  @relation("UserOrders")
  
  @@index([email])
  @@map("users") // テーブル名は複数形
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // 外部キー制約（必須）
  author    User     @relation("UserPosts", fields: [authorId], references: [id], onDelete: Cascade)
  
  @@index([authorId])
  @@index([createdAt])
  @@map("posts")
}

// ❌ BAD: 正規化不足
model User {
  id       String   @id @default(cuid())
  name     String
  orderIds String[] // 非正規化 - 禁止
}

// ❌ BAD: 外部キー制約なし
model Post {
  id       String @id
  authorId String // リレーションなし - 禁止
}
```

### インデックス設計規則

```prisma
// ✅ REQUIRED: 以下のカラムには必ずインデックス
// 1. 外部キー
// 2. WHERE句で頻繁に使用するカラム
// 3. ORDER BY で使用するカラム
// 4. UNIQUE制約のあるカラム

model Order {
  id         String   @id @default(cuid())
  userId     String   
  status     String
  totalPrice Int
  createdAt  DateTime @default(now())
  
  user       User     @relation(fields: [userId], references: [id])
  
  @@index([userId])       // 外部キー - 必須
  @@index([status])       // WHERE句で使用 - 必須
  @@index([createdAt])    // ORDER BY で使用 - 必須
  @@index([userId, status]) // 複合検索用
}
```

---

## ⚡ パフォーマンス最適化（必須）

### N+1問題の防止

```typescript
// ❌ FORBIDDEN: N+1問題
async function getBlogPosts() {
  const posts = await prisma.post.findMany();
  
  // N回のクエリが発生 - 禁止
  for (const post of posts) {
    post.author = await prisma.user.findUnique({
      where: { id: post.authorId }
    });
  }
  
  return posts;
}

// ✅ REQUIRED: Eager Loading
async function getBlogPosts() {
  return await prisma.post.findMany({
    include: {
      author: true, // 1回のクエリで取得
    },
  });
}

// ✅ ALTERNATIVE: select で必要なフィールドのみ
async function getBlogPosts() {
  return await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}
```

### React パフォーマンス最適化

```typescript
// ✅ REQUIRED: メモ化（React.memo、useMemo、useCallback）
import { memo, useCallback, useMemo } from 'react';

// コンポーネントのメモ化
const UserCard = memo(function UserCard({ user, onDelete }: Props) {
  return (
    <div>
      <h3>{user.name}</h3>
      <button onClick={onDelete}>削除</button>
    </div>
  );
});

function UserList({ users }: Props) {
  // コールバックのメモ化
  const handleDelete = useCallback((userId: string) => {
    deleteUser(userId);
  }, []);
  
  // 計算結果のメモ化
  const sortedUsers = useMemo(
    () => [...users].sort((a, b) => a.name.localeCompare(b.name)),
    [users]
  );
  
  return (
    <div>
      {sortedUsers.map(user => (
        <UserCard
          key={user.id}
          user={user}
          onDelete={() => handleDelete(user.id)}
        />
      ))}
    </div>
  );
}

// ❌ FORBIDDEN: 無駄な再レンダリング
function UserList({ users }) {
  // 毎回新しい関数が生成される - 禁止
  return users.map(user => (
    <UserCard user={user} onDelete={() => deleteUser(user.id)} />
  ));
}
```

---

## ✅ コード生成前後のチェックリスト

### 生成前（Pre-Generation）

```markdown
**AI Agent は以下を自動確認（1つでも満たさない場合は生成拒否）**

- [ ] 要件定義ドキュメントで該当機能を確認済み
- [ ] 既存のファイル構造・命名規則を調査済み
- [ ] 類似機能の実装パターンを検索済み
- [ ] 必要な環境変数・設定ファイルを確認済み
- [ ] **不明な点がない（ある場合は明示して確認を求める）**
- [ ] **新規依存関係が不要（必要な場合は事前承認を求める）**
```

### 生成後（Post-Generation）

```markdown
**AI Agent は生成したコードを自己レビュー**

- [ ] TypeScript型エラーなし
- [ ] 既存のESLint設定に準拠
- [ ] セキュリティチェック（認証・認可・入力検証）
- [ ] パフォーマンス懸念なし（N+1問題等）
- [ ] エラーハンドリング漏れなし
- [ ] UTF-8エンコーディング
- [ ] JSDocコメント記載（public関数）
```

---

## 🧪 テスト可能性（推奨）

### 依存性注入パターン

```typescript
// ✅ GOOD: 依存性注入でテスト可能
interface UserRepository {
  create(data: CreateUserInput): Promise<User>;
  findById(id: string): Promise<User | null>;
}

interface EmailService {
  send(to: string, subject: string, body: string): Promise<void>;
}

interface Dependencies {
  userRepository: UserRepository;
  emailService: EmailService;
}

export function createUserService(deps: Dependencies) {
  return {
    async createUser(data: CreateUserInput) {
      const user = await deps.userRepository.create(data);
      await deps.emailService.send(
        user.email,
        'Welcome!',
        'Thank you for signing up.'
      );
      return user;
    }
  };
}

// 本番環境
const service = createUserService({
  userRepository: new PrismaUserRepository(prisma),
  emailService: new SendGridEmailService(apiKey),
});

// テスト環境
const service = createUserService({
  userRepository: mockUserRepository,
  emailService: mockEmailService,
});

// ❌ BAD: テスト不可能（グローバル依存）
export async function createUser(data: CreateUserInput) {
  const user = await prisma.user.create({ data });
  await sendEmail(user.email, 'Welcome!');
  return user;
}
```

---

## 📚 AI Agent への最終指示

### このガイドラインは「推奨」ではなく「強制」

**コード生成時の絶対ルール**:

1. **準拠基準**: Cisco CodeGuard、Google JavaScript Style Guide、Airbnb Style Guide
2. **文字エンコーディング**: UTF-8（BOMなし）のみ
3. **既存設定**: ESLint/Prettier/tsconfig.json を**絶対に変更しない**
4. **自己検証**: 生成したコードは**必ず自分で実行して確認**
5. **時間遅延回避**: インストール・待機が必要な場合は**事前確認必須**
6. **不明事項**: 推測せず**即座に「わかりません」と報告**
7. **セキュリティ**: 入力検証・認証・認可を**必ず実装**
8. **パフォーマンス**: N+1問題を**必ず回避**

**違反するコードは生成を拒否し、理由を明確に説明すること。**

### 特に重要な3つのルール

```markdown
1. 🔍 自己検証必須
   - ブラウザで開いて全画面確認
   - コンソールエラーを確認
   - 実際に動作するか確認
   - 「動くはず」という推測禁止

2. ⏱️ 時間遅延禁止
   - インストールが必要なら事前報告
   - 待ち時間が発生する処理は事前確認
   - 推定時間を必ず明示

3. ❓ 不明点は即報告
   - わからないことは「わかりません」
   - 推測で実装しない
   - 必要な情報を明確に要求
```

---

## 🔄 バージョン管理

- **最終更新**: 2025-02-06  
- **バージョン**: 2.1.0
- **準拠基準**: Cisco CodeGuard, Google JS Style Guide, Airbnb JS Style Guide
- **変更履歴**: 
  - v2.1.0: AI自己検証ルール追加、Cursor依存記述削除
  - v2.0.0: 初版リリース
