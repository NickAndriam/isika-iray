import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/profile", "/post", "/messages"];

// Routes that should redirect to home if already authenticated
const authRoutes = ["/login", "/onboarding"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // For protected routes, we'll let the component handle auth check
  // since we need to check localStorage which is only available client-side

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
