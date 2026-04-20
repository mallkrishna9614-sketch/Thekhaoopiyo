import { NextRequest, NextResponse } from "next/server";
import { updateOrder } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const updated = await updateOrder(id, body);
  if (!updated) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  return NextResponse.json(updated);
}
