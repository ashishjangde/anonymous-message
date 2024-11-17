import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { User } from "next-auth";
import z from 'zod';

const prisma = new PrismaClient();

const acceptQuerySchema = z.object({
    acceptMessages: z.object({
        isAcceptingMessages: z.boolean() // Ensure this matches your expected payload structure
    })
});

export async function POST(request: Request) {
    const session = await auth();
    if (!session) {
        return Response.json(
            {
                message: "Not authenticated",
                success: false,
                data: null
            },
            {
                status: 401
            }
        );
    }

    const user: User = session.user;
    if (!user.id) {
        return Response.json(
            { message: "User ID not found", success: false, data: null },
            { status: 400 }
        );
    }

    try {
        const body = await request.json();
        const result = acceptQuerySchema.safeParse(body);

        if (!result.success) {
            console.error("Zod Validation Error:", result.error.format());
            return Response.json(
                {
                    message: result.error.format().acceptMessages?._errors[0] || "Invalid request payload",
                    success: false,
                    data: null
                },
                {
                    status: 400
                }
            );
        }

        const { isAcceptingMessages } = result.data.acceptMessages;
        console.log(isAcceptingMessages);

        // Update user using Prisma
        const updatedUser = await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                isAcceptingMessages: isAcceptingMessages
            }
        });

        return Response.json(
            {
                message: "User updated successfully",
                success: true,
                data: updatedUser
            },
            {
                status: 200
            }
        );
    } catch (error) {
        console.error("Error processing request:", error);
        return Response.json(
            {
                message: "Something went wrong in Accepting the messages POST",
                success: false,
                data: null
            },
            {
                status: 500
            }
        );
    }
}

export async function GET() {
    const session = await auth();
    if (!session) {
        return Response.json(
            {
                message: "Not authenticated",
                success: false,
                data: null
            },
            {
                status: 401
            }
        );
    }

    const user: User = session.user;
    if (!user.id) {
        return Response.json(
            { message: "User ID not found", success: false, data: null },
            { status: 400 }
        );
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                id: user.id
            },
            select: {
                id: true,
                username: true,
                email: true,
                isAcceptingMessages: true
            }
        });

        if (!existingUser) {
            console.error(`User with ID ${user.id} not found`);
            return Response.json(
                {
                    message: "User not found",
                    success: false,
                    data: null
                },
                {
                    status: 404
                }
            );
        }

        return Response.json(
            {
                message: "User fetched successfully",
                success: true,
                data: existingUser
            },
            {
                status: 200
            }
        );
    } catch (error) {
        console.error("Error processing request:", error);
        return Response.json(
            {
                message: "Something went wrong in Accepting the messages GET",
                success: false,
                data: null
            },
            {
                status: 500
            }
        );
    }
}
