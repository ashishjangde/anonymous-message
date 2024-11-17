import z from "zod";

export const usernameValidationSchema = z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .regex(/^[a-zA-Z0-9]+$/, "Username can only contain letters, numbers and underscores");


    export const signupSchema = z.object({
        username: usernameValidationSchema,
        email: z.string().email({ message: "Invalid email"}),
        password: z.string().min(6,{message: "Password must be at least 6 characters long"}),
    });