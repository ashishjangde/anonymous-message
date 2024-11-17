import prisma from "@/lib/dbConfig";  // Assuming this is your Prisma client
import z from 'zod';

const verifyQuerySchema = z.object({
    username: z.string(),
    code: z.string(),
});

export async function POST(request: Request) {
    try {
        const { username, code } = await request.json();


        const result = verifyQuerySchema.safeParse({ username, code });
        if (!result.success) {
            return new Response(JSON.stringify({
                message: result.error.format().code?._errors[0] || "Invalid data",
                success: false
            }), {
                status: 400
            });
        }

        const { username: parsedUsername, code: parsedCode } = result.data;


        const existingUser = await prisma.user.findUnique({
            where: { username: parsedUsername }
        });

        if (!existingUser) {
            return new Response(JSON.stringify({
                message: "User not found",
                success: false
            }), {
                status: 404
            });
        }

  
        if (existingUser.isVerified) {
            return new Response(JSON.stringify({
                message: "User already verified",
                success: false
            }), {
                status: 400
            });
        }


        if (existingUser.verifyCode !== parsedCode) {
            return new Response(JSON.stringify({
                message: "Invalid verification code",
                success: false
            }), {
                status: 400
            });
        }

        const isCodeNotExpired = existingUser.verifyCodeExpiry && new Date(existingUser.verifyCodeExpiry) > new Date();
        if (!isCodeNotExpired) {
            return new Response(JSON.stringify({
                message: "Verification code expired",
                success: false
            }), {
                status: 400
            });
        }


        // Mark the user as verified by updating the user record
        await prisma.user.update({
            where: { username: parsedUsername },
            data: {
                isVerified: true,
                verifyCode: "",  
                verifyCodeExpiry: null  
            }
        });

        return new Response(JSON.stringify({
            message: "User verified",
            success: true
        }), {
            status: 200
        });

    } catch (error) {
        console.error("Error in verifying code:", error);

        return new Response(JSON.stringify({
            message: "Something went wrong in verifying code",
            success: false
        }), {
            status: 500
        });
    }
}
