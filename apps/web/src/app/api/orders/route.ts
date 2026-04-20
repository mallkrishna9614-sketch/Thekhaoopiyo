import { NextRequest, NextResponse } from "next/server";
import { getOrders, addOrder, type Order } from "@/lib/db";

export async function GET() {
  const orders = await getOrders();
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const id = `KP-${Date.now().toString().slice(-6)}`;
  const order: Order = {
    id,
    items: body.items,
    subtotal: body.subtotal,
    gst: body.gst,
    discount: body.discount ?? 0,
    total: body.total,
    promoCode: body.promoCode ?? "",
    address: body.address,
    customerName: body.customerName,
    phone: body.phone ?? "",
    status: "pending",
    createdAt: new Date().toISOString(),
    adminNote: "",
  };
  await addOrder(order);
  return NextResponse.json({ id });
}
