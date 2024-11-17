import z from "zod";

export const messageSchema = z.object({
    message: z.string()
        .max(300, {message: "Message must be at most 300 characters long"})
        .min(5, {message: "Message must be at least 5 characters long"}),
})