import { NextRequest, NextResponse } from "next/server";
import { getReviews, addReview, type Review } from "@/lib/db";

export async function GET() {
  const reviews = await getReviews();
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const review: Review = {
    id: `REV-${Date.now()}`,
    name: body.name,
    rating: body.rating,
    text: body.text,
    createdAt: new Date().toISOString(),
  };
  await addReview(review);
  return NextResponse.json({ success: true });
}
