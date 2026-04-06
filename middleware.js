import { NextResponse } from "next/server";

export function middleware(request) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const passThrough = NextResponse.next();
    passThrough.headers.set("x-admin-route", "true");
    return passThrough;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
