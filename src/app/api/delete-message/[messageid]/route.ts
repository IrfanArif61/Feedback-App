import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from "next-auth"

export async function DELETE(request: Request, {params}: { params: {messageid: string}}){
    const messageId = params.messageid
    await dbConnect()

    //getting user from session because we already attached the data from token to session
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User;
    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Unauthenticated session",
        },
    {status: 401})
    }
   
    try {
         const updatedResult = await UserModel.updateOne({_id: user._id},
            {$pull: {messages: {_id: messageId}}}
         )

         if(updatedResult.modifiedCount == 0){
            return Response.json({
                success: false,
                message: "Message not found or already deleted",
            },
        {status: 401})
         }

         return Response.json({
            success: true,
            message: "Message Deleted Successfully",
        },
    {status: 200})
    } catch (error) {
        console.log("error in delete message route", error)
        return Response.json({
            success: false,
            message: "Error deleting message",
        },
    {status: 500})
    }

}