import { NextRequest, NextResponse } from "next/server";
import { getLogins, addLogin, LoginRecord } from "@/lib/db";

// Handle CORS for web app requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  const logins = await getLogins();
  return NextResponse.json(logins, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400, headers: corsHeaders });
    }

    const record: LoginRecord = {
      id: Math.random().toString(36).slice(2, 9),
      email: body.email,
      userAgent: req.headers.get("user-agent") || "Unknown",
      createdAt: new Date().toISOString(),
    };

    await addLogin(record);
    return NextResponse.json({ success: true, record }, { headers: corsHeaders });
  } catch (err) {
    return NextResponse.json({ error: "Failed to record login" }, { status: 500, headers: corsHeaders });
  }
}
