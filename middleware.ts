import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/auth"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value

  // const protectedPaths = ["/add-product", "/my-listings", "/cart", "/orders"]
  // const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  // if (isProtectedPath && (!token || !verifyToken(token))) {
  //   return NextResponse.redirect(new URL("/login", request.url))
  // }

  // Redirect authenticated users away from auth pages
  const authPaths = ["/login", "/signup"]
  const isAuthPath = authPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  if (isAuthPath && token && verifyToken(token)) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/login", "/signup"],
}
