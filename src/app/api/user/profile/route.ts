import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db()
    const user = await db
      .collection("users")
      .findOne({ email: session.user.email })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      name: user.name ?? "",
      email: user.email ?? "",
      image: user.image ?? "",
      createdAt: user.createdAt ?? null,
    })
  } catch (err) {
    console.error("[Profile GET] Error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name } = body as { name?: string }

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "名前は必須です" },
        { status: 400 }
      )
    }

    if (name.trim().length > 50) {
      return NextResponse.json(
        { error: "名前は50文字以内で入力してください" },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db()

    const result = await db.collection("users").findOneAndUpdate(
      { email: session.user.email },
      { $set: { name: name.trim(), updatedAt: new Date() } },
      { returnDocument: "after" }
    )

    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      name: result.name ?? "",
      email: result.email ?? "",
      image: result.image ?? "",
      createdAt: result.createdAt ?? null,
    })
  } catch (err) {
    console.error("[Profile PUT] Error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
