import { NextRequest, NextResponse } from "next/server";
import { getChatSessions, saveChatSession, type ChatSession } from "@/lib/db";

export async function GET() {
  const sessions = await getChatSessions();
  return NextResponse.json(sessions);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const session: ChatSession = {
    id: body.id ?? `CHAT-${body.sessionId}`,
    sessionId: body.sessionId,
    customerName: body.customerName ?? "Guest",
    messages: body.messages ?? [],
    status: "open",
    createdAt: body.createdAt ?? new Date().toISOString(),
  };
  await saveChatSession(session);
  return NextResponse.json({ success: true });
}
