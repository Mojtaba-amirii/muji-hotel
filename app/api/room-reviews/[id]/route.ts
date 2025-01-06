import { getRoomReviews } from "@/libs/apis";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: roomId } = await params;

  try {
    const roomReviews = await getRoomReviews(roomId);
    return NextResponse.json(roomReviews, {
      status: 200,
      statusText: "Successfully Got Reviews",
    });
  } catch (error) {
    console.error("Failed To Getting Reviews", error);
    return new NextResponse("Failed To Getting Reviews", { status: 400 });
  }
}
