import Stripe from "stripe";
import { NextResponse, NextRequest } from "next/server";

import { createBooking, updateHotelRoom } from "@/libs/apis";

const checkout_session_completed = "checkout.session.completed";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-04-30.basil",
});

export async function POST(req: NextRequest) {
  const reqBody = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return new NextResponse("Webhook signature or secret missing", {
      status: 400,
    });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(reqBody, sig, webhookSecret);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error constructing Stripe event: ${error.message}`);
    } else {
      console.error(`Error constructing Stripe event: ${String(error)}`);
    }
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new NextResponse(`Webhook Error: ${errorMessage}`, { status: 500 });
  }

  // load our event
  switch (event.type) {
    case checkout_session_completed:
      const session = event.data.object;

      // Check if metadata exists
      if (session.metadata) {
        const {
          adults,
          checkinDate,
          checkoutDate,
          children,
          hotelRoom,
          numberOfDays,
          user,
          discount,
          totalPrice,
        } = session.metadata;

        try {
          // Create Booking
          await createBooking({
            adults: Number(adults),
            checkinDate,
            checkoutDate,
            children: Number(children),
            hotelRoom,
            numberOfDays: Number(numberOfDays),
            discount: Number(discount),
            totalPrice: Number(totalPrice),
            user,
          });

          // Update hotel room
          await updateHotelRoom(hotelRoom);
        } catch (error) {
          console.error("Failed to create booking:", error);
          return new NextResponse("Booking Failed", { status: 500 });
        }

        return NextResponse.json("Booking successful", {
          status: 200,
          statusText: "Booking Successful",
        });
      } else {
        return new NextResponse("Metadata missing in session", {
          status: 400,
          statusText: "Bad Request",
        });
      }

    default:
      console.log(`Unhandled event type ${event.type}`);
      return NextResponse.json(
        { message: "Unhandled event type" },
        { status: 200 }
      );
  }
}
