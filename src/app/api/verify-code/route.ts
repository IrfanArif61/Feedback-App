import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function POST(request: Request){
    await dbConnect();
    try {
        const {username, code} = await request.json();

        //some time we cannot het required thing from url so that we we use below
        const decodedUsername = decodeURIComponent(username);

        // console.log("Name inide verify-code::", decodedUsername)

        


        const user = await UserModel.findOne({
            username: decodedUsername
        });
        // console.log("USER inide verify-code:", user)
        if(!user){
            return Response.json({
                success: false,
                message: "User not found",
            },
        {status: 404})
        }

        const isCodeValid =  user.verifyCode === code;
        const isCodeExpiryValid = new Date(user.verifyCodeExpiry) > new Date();

        if(isCodeValid && isCodeExpiryValid){
            user.isVerified = true;
            await user.save();
            return Response.json({
                success: true,
                message: "User verified successfully",
            },
        {status: 200})
        }else if(!isCodeExpiryValid){
            return Response.json({
                success: false,
                message: "Code has expired, please signup again to get new code",
            },
        {status: 400})
        }else{
            return Response.json({
                success: false,
                message: "Code is incorrect",
            },
        {status: 400})
        }



    } catch (error) {
        console.error("Error checking username", error)
        return Response.json({
            success: false,
            message: "Error checking username",
        },
    {status: 500})
    }
}


// // pages/api/resend-code.ts

// import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/model/User";
// import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

// export async function POST(request: Request) {
//   await dbConnect();
//   console.log("dbbbbbbbbbbbbbbbbbbbbbbbbbbbbb")
//   try {
//     const { username } = await request.json();
//     const decodedUsername = decodeURIComponent(username);
//     console.log("USEERRR: ", decodedUsername)

//     const user = await UserModel.findOne({ username: decodedUsername });

//     console.log("Usr:", user)

//     if (!user) {
//       return new Response(JSON.stringify({
//         success: false,
//         message: "User not found"
//       }), { status: 404 });
//     }

//     console.log("guuuuuserrrrrrrrrrrrrrrr")

//     // Generate a new verification code
//     const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
//     user.verifyCode = verifyCode;
//     user.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour expiry
//     await user.save();

//     // Send the verification email
//     const emailResponse = await sendVerificationEmail({
//       email: user.email,
//       username: user.username,
//       verifyCode,
//     });

//     if (!emailResponse.success) {
//       throw new Error(emailResponse.message);
//     }

//     return new Response(JSON.stringify({
//       success: true,
//       message: "A new verification code has been sent to your email.",
//     }), { status: 200 });
//   } catch (error) {
//     console.error("Error in resending code", error);
//     return new Response(JSON.stringify({
//       success: false,
//       message: "Failed to resend verification code. Please try again."
//     }), { status: 500 });
//   }
// }
