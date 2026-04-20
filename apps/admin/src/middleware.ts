import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

const SESSION_SECRET = process.env.SESSION_SECRET ?? "khao-piyo-secret-change-in-prod";
const COOKIE_NAME = "kp_admin_session";
const LOGIN_PATH = "/login";

function verifySessionToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const lastColon = decoded.lastIndexOf(":");
    const payload = decoded.slice(0, lastColon);
    const sig = decoded.slice(lastColon + 1);
    const expected = createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
    return sig === expected;
  } catch {
    return false;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow: the login page and auth API routes
  if (
    pathname === LOGIN_PATH ||
    pathname.startsWith("/api/auth/") ||
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;

  if (!token || !verifySessionToken(token)) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = LOGIN_PATH;
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
