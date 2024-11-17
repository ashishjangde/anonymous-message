import { NextResponse } from "next/server";
import prisma from "@/lib/dbConfig";  
import { auth } from "@/auth";  

export async function DELETE(request: Request, { params }: { params: { messageId: string } }) {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json(
      {
        message: "Not authenticated",
        success: false,
        data: null,
      },
      { status: 401 }
    );
  }

  const { user } = session;
  const userId = user?.id;

  if (!userId) {
    return NextResponse.json(
      {
        message: "User ID not found",
        success: false,
        data: null,
      },
      { status: 401 }
    );
  }

  const { messageId } = params;

  if (!messageId) {
    return NextResponse.json(
      {
        message: "Invalid request payload",
        success: false,
        data: null,
      },
      { status: 400 }
    );
  }

  try {
    // Query the user from the database using Prisma
    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,  
      },
      select: {
        id: true,
        username: true,
        isVerified: true,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          message: "User not found",
          success: false,
          data: null,
        },
        { status: 404 }
      );
    }

 
    const existingMessage = await prisma.message.findUnique({
      where: {
        id: messageId,
      },
    });

    if (!existingMessage) {
      return NextResponse.json(
        {
          message: "Message not found",
          success: false,
          data: null,
        },
        { status: 404 }
      );
    }

    await prisma.message.delete({
      where: {
        id: messageId,
      },
    });

    return NextResponse.json(
      {
        message: "Message deleted successfully",
        success: true,
        data: null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      {
        message: "Something went wrong",
        success: false,
        data: null,
      },
      { status: 500 }
    );
  }
}
