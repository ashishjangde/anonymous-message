import prisma from "@/lib/dbConfig";  // Prisma client
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
     
        const { username, content } = await request.json();

      
        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            return NextResponse.json({ message: "User not found", success: false }, { status: 404 });
        }

      
        if (!user.isAcceptingMessages) {
            return NextResponse.json({ message: "User is not accepting messages", success: false }, { status: 400 });
        }

        
        const message = await prisma.message.create({
            data: {
                content,
                createdAt: new Date(),
                user: { connect: { username } },
            },
        });

     
        await prisma.user.update({
            where: { username },
            data: {
                messages: {
                    connect: { id: message.id }, 
                },
            },
        });

   
        return NextResponse.json({ message: "Message sent successfully", success: true, data: message }, { status: 200 });

    } catch (error) {
        console.error("Error in sending message:", error);
        return NextResponse.json(
            {
                message: "Something went wrong in Sending Message",
                success: false,
                data: null,
            },
            { status: 500 }
        );
    }
}
