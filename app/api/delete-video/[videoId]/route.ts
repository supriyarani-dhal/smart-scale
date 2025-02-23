import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// interface RouteParams {
//   params: { videoId: string };
// }

export async function DELETE(
  request: NextRequest,
  context: { params: { videoId: string } }
) {
  const { params } = context; // ✅ Extract params correctly
  const videoId = params.videoId;

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "You are not authorized to delete videos" },
      { status: 401 }
    );
  }

  try {
    const deleteVideo = await prisma.video.delete({
      where: {
        id: videoId,
      },
    });

    console.log(deleteVideo);

    return NextResponse.json(
      {
        message: "Video deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error || "Error in deleting video" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
