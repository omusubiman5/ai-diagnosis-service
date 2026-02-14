import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Twitter from "next-auth/providers/twitter"
import Line from "next-auth/providers/line"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Twitter({
      clientId: process.env.X_CLIENT_ID,
      clientSecret: process.env.X_CLIENT_SECRET,
    }),
    Line({
      clientId: process.env.LINE_CLIENT_ID,
      clientSecret: process.env.LINE_CLIENT_SECRET,
    }),
  ],
  // JWT セッション（MongoDBAdapter互換性問題を回避）
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account }) {
      // 初回ログイン時にMongoDBへユーザー情報を保存
      // 動的importでEdgeランタイム（middleware）との互換性を確保
      if (user && account) {
        token.id = user.id
        try {
          const { default: clientPromise } = await import("@/lib/mongodb")
          const client = await clientPromise
          const db = client.db()
          await db.collection("users").updateOne(
            { email: user.email },
            {
              $set: {
                name: user.name,
                email: user.email,
                image: user.image,
                provider: account.provider,
                updatedAt: new Date(),
              },
              $setOnInsert: {
                createdAt: new Date(),
              },
            },
            { upsert: true }
          )
        } catch (err) {
          console.error("[Auth] MongoDB save error:", err)
          // MongoDB保存失敗でも認証自体は続行
        }
      }
      return token
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
  },
})
