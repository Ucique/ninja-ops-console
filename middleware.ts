import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const mustChange = request.cookies.get("must_change_password")?.value === "1";
  const { pathname } = request.nextUrl;

  if (
    mustChange &&
    !pathname.startsWith("/settings/account") &&
    !pathname.startsWith("/api/auth/login") &&
    !pathname.startsWith("/api/auth/logout") &&
    !pathname.startsWith("/login")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/settings/account";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/(.*)"],
};
