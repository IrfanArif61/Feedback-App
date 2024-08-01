import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username } = await request.json();
        if (!username) {
            return new Response(
                JSON.stringify({ success: false, message: "Username does not exist" }),
                { status: 400 }
            );
        }

    

        const user = await UserModel.findOne({ username });
        console.log("USER:", user);

        if (!user) {
            return new Response(
                JSON.stringify({ success: false, message: "User not found" }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ success: true, user }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching user:", error);
        return new Response(
            JSON.stringify({ success: false, message: "Failed to fetch user" }),
            { status: 500 }
        );
    }
}
