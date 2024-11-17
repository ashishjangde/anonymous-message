import prisma from "@/lib/dbConfig"; // Assuming prisma instance is configured here
import bcryptjs from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendverificationEmail";
import { NextRequest } from "next/server";
import { console } from "inspector";
import z from "zod";
import { signupSchema } from "@/schemas/signUpSchema";

const signUpQuerySchema = z.object({
    username: signupSchema.shape.username,
    email: signupSchema.shape.email,
    password: signupSchema.shape.password,
});

export async function POST(request: NextRequest) {
    try {
        const { email, username, password } = await request.json();

        // Validate with Zod
        const result = signUpQuerySchema.safeParse({ email, username, password });
        if (!result.success) {
            const errorMessages = result.error.errors.map((err) =>
                `${err.path.join(".")} : { ${err.message} }`
            );
            return Response.json(
                {
                    message: errorMessages,
                    success: false,
                    data: null,
                },
                {
                    status: 400,
                }
            );
        }

        // Check if a verified user with the same username exists
        const existingUserVerifiedByUsername = await prisma.user.findUnique({
            where: { username },
            select: { isVerified: true },
        });

        if (existingUserVerifiedByUsername?.isVerified) {
            return Response.json(
                {
                    message: "User with this Username already exists",
                    success: false,
                    data: null,
                },
                {
                    status: 400,
                }
            );
        }

        // Check if a verified user with the same email exists
        const existingUserByEmail = await prisma.user.findUnique({
            where: { email },
        });

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        message: "User with this Email already exists",
                        success: false,
                        data: null,
                    },
                    {
                        status: 400,
                    }
                );
            } else {
                const hashedPassword = await bcryptjs.hash(password, 10);
                const verifyCodeExpiry = new Date();
                verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1);

                // Update the existing user's details
                await prisma.user.update({
                    where: { email },
                    data: {
                        password: hashedPassword,
                        verifyCode,
                        verifyCodeExpiry,
                    },
                });
            }
        } else {
            const hashedPassword = await bcryptjs.hash(password, 10);
            const verifyCodeExpiry = new Date();
            verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1);

            // Create a new user in the database
            await prisma.user.create({
                data: {
                    username,
                    email,
                    password: hashedPassword,
                    verifyCode,
                    verifyCodeExpiry,
                    isVerified: false,
                    isAcceptingMessages: true,
                },
            });
        }


        const existingUser = await prisma.user.findUnique({
            where: { email },
            select: {
                username: true,
                email: true,
                isVerified: true,
                isAcceptingMessages: true,
            },
        });

        const emailResponse = await sendVerificationEmail({
            email,
            username,
            verificationCode: verifyCode,
        });

        if (emailResponse.success) {
            return Response.json(
                {
                    message: "Sign up successful",
                    success: true,
                    data: existingUser,
                },
                {
                    status: 201,
                }
            );
        } else {
            return Response.json(
                {
                    message: "Something went wrong in sending verification email",
                    success: false,
                    data: null,
                },
                {
                    status: 500,
                }
            );
        }
    } catch (error: unknown) {
        console.log(error);
        return Response.json(
            {
                message: "Something went wrong in signing up",
                success: false,
                data: null,
            },
            {
                status: 500,
            }
        );
    }
}
