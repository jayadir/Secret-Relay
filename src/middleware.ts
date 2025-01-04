import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.JWT_SECRET });
    const url = req.nextUrl
    if (token && (
        url.pathname.startsWith("/signin") ||
        url.pathname.startsWith("/signup") ||
        url.pathname.startsWith("/verify") ||
        url.pathname.startsWith("/dashboard") ||
        url.pathname.startsWith("/")
    )) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }
}

export const config = {
    matcher: [
        "/signin",
        "/signup",
        "/",
        "/dashboard/:paht*",
        "/verify/:path*",
    ]
}