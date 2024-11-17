import z from "zod";    

export const signInSchema = z.object({
    email: z.string().email({ message: "please enter a valid email"}),
    password: z.string().min(6,{message: "Password must be at least 6 characters long"}),
})