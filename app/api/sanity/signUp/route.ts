import sanityClient from "@/libs/sanity";
import { signUpHandler } from "next-auth-sanity";
import { NextRequest, NextResponse } from "next/server";

const baseHandler = signUpHandler(sanityClient);

export const POST = async (request: NextRequest): Promise<Response> => {
  try {
    const result = await baseHandler(request, {});

    // Ensure we always return a Response
    if (!result) {
      return NextResponse.json({ error: "Sign up failed" }, { status: 500 });
    }

    return result;
  } catch (error) {
    console.error("Sign up error:", error);
    return NextResponse.json({ error: "Sign up failed" }, { status: 500 });
  }
};
