import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  console.log('middleware')

  // Get the pathname of the request (e.g. /, /admin, /protected)
  const path = req.nextUrl.pathname
  console.log('middleware path =>', path)

  // Get session from cookie
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })
  console.log('middleware session =>', session)

  // Check if the path is an admin route
  if (path.startsWith("/admin")) {
    // If no session or user is not admin, redirect to signin
    if (!session || session.role !== "admin") {
      const url = new URL("/auth/signin", req.url)
      url.searchParams.set("callbackUrl", req.url)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
