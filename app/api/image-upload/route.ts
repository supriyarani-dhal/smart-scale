import { auth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

// Configuration
cloudinary.config({
  cloud_name: "process.env.NEXT_CLOUDINARY_CLOUD_NAME",
  api_key: "process.env.CLOUDINARY_API_KEY",
  api_secret: "process.env.CLOUDINARY_API_SECRET", // Click 'View API Keys' above to copy your API secret
});

interface CloudinaryUploadResult {
  public_id: string;
  [key: string]: unknown; //this is a dynamic key means we have more stuff in this object
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "You are not authorized to upload images" },
      { status: 401 }
    );
  }

  try {
    // Get the file from the request
    const formData = request.formData();
    const file = ((await formData).get("file") as File) || null;

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
              folder: "nextjs-image-upload",
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

    console.log(result);

    return NextResponse.json({ publicId: result.public_id }, { status: 200 });
  } catch (error) {
    console.log("Error uploading image", error);
    return NextResponse.json(
      { error: "Error uploading image" },
      { status: 500 }
    );
  }
}
