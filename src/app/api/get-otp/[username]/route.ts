import prisma from "@/lib/dbConfig";  // Prisma client
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
    try {
        // Fetch the user based on the username using Prisma
        const { username } = params;

        const user = await prisma.user.findUnique({
            where: {
                username: username // Assuming `username` is a unique field
            }
        });

        if (!user) {
            return NextResponse.json({ message: "User not found", success: false }, { status: 404 });
        }

        const verifyCode = user.verifyCode;

        return NextResponse.json({ data: verifyCode, success: true }, { status: 200 });
    } catch (error) {
        console.error("Error in fetching user verification code:", error);
        return NextResponse.json({ message: "Something went wrong", success: false }, { status: 500 });
    }
}
