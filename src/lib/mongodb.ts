import { MongoClient } from "mongodb"

// DNS設定は instrumentation.ts で実行済み（Node.jsランタイムのみ）

const uri = process.env.MONGODB_URI

let clientPromise: Promise<MongoClient>

if (uri) {
  const options = {}

  if (process.env.NODE_ENV === "development") {
    // In development, cache the client on globalThis to prevent
    // multiple connections during Next.js hot module reload.
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
      const client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect()
    }

    clientPromise = globalWithMongo._mongoClientPromise
  } else {
    const client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }
} else {
  // During build or when MONGODB_URI is not set, provide a
  // deferred promise that will fail at runtime if actually used.
  clientPromise = new Promise(() => {
    // This promise intentionally never resolves during build.
    // At runtime, MONGODB_URI must be set.
  })
}

export default clientPromise
