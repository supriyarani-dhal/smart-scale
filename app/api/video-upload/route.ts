import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// Configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

interface CloudinaryUploadResult {
  public_id: string;
  bytes: number;
  duration?: number;
  [key: string]: unknown; //this is a dynamic key means we have more stuff in this object
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "You are not authorized to upload videos" },
        { status: 401 }
      );
    }

    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        { error: "Missing Cloudinary credentials" },
        { status: 500 }
      );
    }

    // Get the file from the request
    const formData = await request.formData();
    const file = (formData.get("file") as File) || null;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const originalSize = formData.get("originalSize") as string;

    if (!file) {
      return NextResponse.json({ error: "No file found" }, { status: 400 });
    }

    // Upload the file to Cloudinary is a 3-step process:
    // 1. convert the file to an array buffer
    const bytes = await file.arrayBuffer();
    //2. convert the array buffer to a buffer
    const buffer = Buffer.from(bytes);

    //3. upload the buffer to Cloudinary and along with an error callback handling
    const result = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "video",
              folder: "video-uploads",
              transformation: [{ quality: "auto", fetch_format: "auto" }],
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result as CloudinaryUploadResult);
              }
            }
          )
          .end(buffer);
      }
    );

    // Save the video to the database(prisma)
    const video = await prisma.video.create({
      data: {
        title,
        description,
        originalSize,
        publicId: result.public_id,
        compressedSize: String(result.bytes),
        duration: result.duration || 0,
      },
    });

    return NextResponse.json(video);
  } catch (error) {
    console.log("Error uploading video", error);
    return NextResponse.json(
      { error: "Error uploading video" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
