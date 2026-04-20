import { NextRequest, NextResponse } from "next/server";
import { getRefunds, addRefund, updateRefund, type RefundRequest } from "@/lib/db";

export async function GET() {
  const refunds = await getRefunds();
  return NextResponse.json(refunds);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const refund: RefundRequest = {
    id: `REF-${Date.now()}`,
    orderId: body.orderId,
    reason: body.reason,
    description: body.description ?? "",
    contact: body.contact,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  await addRefund(refund);
  return NextResponse.json({ id: refund.id });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  await updateRefund(body.id, { status: body.status });
  return NextResponse.json({ success: true });
}
