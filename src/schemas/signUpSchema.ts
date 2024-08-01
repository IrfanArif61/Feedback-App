import {z} from "zod"

export const usernamevalidation  = z.string().min(2, "Username must be at least 2 characters").max(20, "Username must be maximum 20 characters").regex(/^[a-zA-Z0-9_]+$/, "Username must not contain speical characters") 

export const signUpSchema = z.object({
    username: usernamevalidation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(6, {message: " password must be atlest 6 characters"}),
})