import prisma from '@/lib/dbConfig';
import z from 'zod';
import { usernameValidationSchema } from '@/schemas/signUpSchema';

// Indicate this is a dynamic route
export const dynamic = 'force-dynamic';

// Zod schema for validating query params
const usernameQuerySchema = z.object({
    username: usernameValidationSchema,
});

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const username = searchParams.get('username');

        // Validate query parameters with Zod schema
        const result = usernameQuerySchema.safeParse({ username });

        if (!result.success) {
            return Response.json({
                message: result.error.format().username?._errors[0],
                success: false,
            }, { status: 400 });
        }

        const { username: validatedUsername } = result.data;

        // Check if username exists in the database
        const existingUser = await prisma.user.findUnique({
            where: {
                username: validatedUsername,
            },
            select: {
                id: true,
                isVerified: true,
            },
        });

        // Handle logic based on username availability
        if (existingUser) {
            const message = existingUser.isVerified
                ? 'Username already exists'
                : 'Username exists but is not verified';

            return Response.json({
                message,
                success: false,
            }, { status: 400 });
        }

        // If no existing user is found
        return Response.json({
            message: 'Username Available',
            success: true,
        }, { status: 200 });

    } catch (error) {
        console.error('Error in check-username-unique:', error);
        
        return Response.json({
            message: 'Something went wrong in Checking Username Unique',
            success: false,
        }, { status: 500 });
    }
}