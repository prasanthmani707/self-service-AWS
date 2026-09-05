import { NextResponse, type NextRequest } from "next/server";
export function middleware(request: NextRequest) { if (request.nextUrl.pathname.startsWith("/api/") && request.method !== "GET") return NextResponse.next(); return NextResponse.next(); }
export const config = { matcher: ["/api/:path*"] };
