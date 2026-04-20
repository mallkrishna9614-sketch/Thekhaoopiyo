import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "9305196173";
const SESSION_SECRET = process.env.SESSION_SECRET ?? "khao-piyo-secret-change-in-prod";
const COOKIE_NAME = "kp_admin_session";
const SESSION_DURATION = 60 * 60 * 24; // 24 hours in seconds

function createSessionToken(): string {
  const payload = `admin:${Date.now()}`;
  const sig = createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

export function verifySessionToken(token: string): boolean {
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

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { password } = body as { password?: string };

  if (!password || password !== ADMIN_PASSWORD) {
    // Slow down brute-force attempts
    await new Promise((r) => setTimeout(r, 500));
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = createSessionToken();
  const response = NextResponse.json({ ok: true });

  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,          // Not accessible via JS
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",      // CSRF protection
    maxAge: SESSION_DURATION,
    path: "/",
  });

  return response;
}
