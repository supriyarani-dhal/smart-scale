import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  { params }: { params: { videoId: string } }
) {
  console.log(params);
  try {
    const { videoId } = params;

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "You are not authorized to delete videos" },
        { status: 401 }
      );
    }

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
