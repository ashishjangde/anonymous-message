import { auth } from "@/auth";
import prisma from "@/lib/dbConfig";  
import { User } from "next-auth";  

export async function GET(request: Request) {
    const session = await auth();

    if (!session) {
        return Response.json(
            {
                message: "Not authenticated",
                success: false,
                data: null
            },
            { status: 401 }
        );
    }

    const user: User = session.user;
    const userId = user.id;

    if (!userId) {
        return Response.json(
            {
                message: "User ID not found",
                success: false,
                data: null
            },
            { status: 401 }
        );
    }

    try {
        // Fetch the user and include related messages, sorted by createdAt
        const userWithMessages = await prisma.user.findUnique({
            where: {
                id: userId, 
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: 'desc'  
                    }
                }
            }
        });

        if (!userWithMessages) {
            return Response.json(
                {
                    message: "User not found",
                    success: false,
                    data: null
                },
                { status: 404 }
            );
        }

        return Response.json(
            {
                message: "User found",
                success: true,
                data: userWithMessages.messages 
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in GET request:", error);
        return Response.json(
            {
                message: "Something went wrong while fetching messages",
                success: false,
                data: null
            },
            { status: 500 }
        );
    }
}
