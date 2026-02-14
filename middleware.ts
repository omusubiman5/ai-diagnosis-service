import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isAuthenticated = !!req.auth
  const { pathname } = req.nextUrl

  // Routes that require authentication
  const protectedPaths = ["/dashboard", "/profile"]
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p))

  // Redirect unauthenticated users away from protected routes
  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL("/auth/signin", req.url))
  }

  // Redirect already-authenticated users away from sign-in page
  if (pathname.startsWith("/auth/signin") && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }
})

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/auth/signin"],
}
