import { NextRequest, NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "9305196173";
const SESSION_SECRET = process.env.SESSION_SECRET ?? "khao-piyo-secret-change-in-prod";
const COOKIE_NAME = "kp_admin_session";
const SESSION_DURATION = 60 * 60 * 24; // 24 hours in seconds

async function createSessionToken(): Promise<string> {
  const payload = `admin:${Date.now()}`;
  
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const sigBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload)
  );
  
  const sigHex = Array.from(new Uint8Array(sigBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
    
  return Buffer.from(`${payload}:${sigHex}`).toString("base64url");
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { password } = body as { password?: string };

  if (!password || password !== ADMIN_PASSWORD) {
    // Slow down brute-force attempts
    await new Promise((r) => setTimeout(r, 500));
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = await createSessionToken();
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
