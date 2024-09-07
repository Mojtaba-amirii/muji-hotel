import {
  checkReviewExists,
  createReview,
  getUserData,
  updateReview,
} from "@/libs/apis";
import { authOptions } from "@/libs/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Authentication Required", { status: 500 });
  }

  const userId = session.user.id;

  try {
    const data = await getUserData(userId);
    return NextResponse.json(data, {
      status: 200,
      statusText: "Success fetching user data",
    });
  } catch (err) {
    return new NextResponse("Fetching user failed", { status: 400 });
  }
}

export async function POST(req: Request, res: Response) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Authentication Required", { status: 500 });
  }

  const { roomId, reviewText, ratingValue } = await req.json();
  if (!roomId || !reviewText || !ratingValue) {
    return new NextResponse("All fields are required", { status: 400 });
  }

  const userId = session.user.id;

  try {
    const alreadyExists = await checkReviewExists(userId, roomId);

    let data;
    if (alreadyExists) {
      data = await updateReview({
        reviewId: alreadyExists._id,
        reviewText,
        userRating: ratingValue,
      });
    } else {
      data = await createReview({
        hotelRoomId: roomId,
        reviewText,
        userId,
        userRating: ratingValue,
      });
    }
    return NextResponse.json(data, {
      status: 200,
      statusText: "Review Successfully Created",
    });
  } catch (err) {
    console.error("Error Creating Review", err);
    return new NextResponse("Error Creating Review", { status: 400 });
  }
}
