import { z } from "zod"

export const messageSchema = z.object({
    content: z.string().min(10, {message: "Message must have atlest 10 characters"}).max(300, {message: "Message must not exceeds 300 characters"}),
})