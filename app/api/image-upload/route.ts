import { auth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

// Configuration
cloudinary.config({
  cloud_name: "process.env.NEXT_CLOUDINARY_CLOUD_NAME",
  api_key: "process.env.CLOUDINARY_API_KEY",
  api_secret: "process.env.CLOUDINARY_API_SECRET", // Click 'View API Keys' above to copy your API secret
});

interface CloudinaryUploadResult {
  public_id: string;
  [key: string]: any; //this is a dynamic key means we have more stuff in this object
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "You are not authorized to upload images" },
      { status: 401 }
    );
  }
}
