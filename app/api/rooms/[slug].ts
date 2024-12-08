import { NextResponse } from "next/server";
import { getRoom } from "@/libs/apis";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const room = await getRoom(params.slug);

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  return NextResponse.json(room);
}
