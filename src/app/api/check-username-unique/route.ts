import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernamevalidation } from "@/schemas/signUpSchema";
import { z } from "zod";

// Define the schema for the username query parameter
const usernameQuerySchema = z.object({
    username: usernamevalidation
});

export async function GET(request: Request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const username = searchParams.get("username") || ""; // Get the username from query parameters

        // Validate the username using the schema
        const result = usernameQuerySchema.safeParse({ username });

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json({
                success: false,
                message: usernameErrors.length > 0 ? usernameErrors.join(', ') : "Invalid query parameter",
            }, { status: 400 });
        }

        const { username: validatedUsername } = result.data; // Extract the validated username

        // Check if the username already exists in the database
        const existingUser = await UserModel.findOne({ username: validatedUsername });

        if (existingUser) {
            return Response.json({
                success: false,
                message: "Username already taken",
            }, { status: 400 });
        }

        return Response.json({
            success: true,
            message: 'Username is available',
        }, { status: 200 });

    } catch (error) {
        console.error("Error checking username", error);
        return Response.json({
            success: false,
            message: "Error checking username",
        }, { status: 500 });
    }
}
