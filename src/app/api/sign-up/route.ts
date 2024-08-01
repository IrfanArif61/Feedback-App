// import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
// import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/model/User";
// import bcrypt from "bcryptjs";
// import { NextResponse } from "next/server";

// export async function POST(request: Request) {
//   await dbConnect();

//   try {
//     const { username, email, password } = await request.json();
    
//     const existingUserVerifiedByUsername = await UserModel.findOne({ username, isVerified: true });
//     // If user exists with the same username
//     if (existingUserVerifiedByUsername) {
//       return NextResponse.json({
//         success: false,
//         message: "Username already taken!",
//       }, {
//         status: 400,
//       });
//     }

//     const existingUserByEmail = await UserModel.findOne({ email });
//     const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

//     // If user exists with the same email
//     if (existingUserByEmail) {
//       // If user exists with the same email and is also verified
//       if (existingUserByEmail.isVerified) {
//         // Returning response so email does not go again to the user because it is already verified
//         return NextResponse.json({
//           success: false,
//           message: "User already exists with the email!",
//         }, {
//           status: 400,
//         });
//       } else {
//         // If user exists with the same email but is not verified or forgot the password, then we can again set new properties
//         const hashedPassword = await bcrypt.hash(password, 10);
//         existingUserByEmail.password = hashedPassword;
//         existingUserByEmail.verifyCode = verifyCode;
//         existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour expiry
//         await existingUserByEmail.save();
//       }
//     } else {
//       // If user does not exist with the same email, create a new user and save it
//       const hashedPassword = await bcrypt.hash(password, 10);

//       const expiryDate = new Date();
//       expiryDate.setHours(expiryDate.getHours() + 1); // 1 hour expiry

//       const newUser = new UserModel({
//         username,
//         email,
//         password: hashedPassword,
//         verifyCode,
//         verifyCodeExpiry: expiryDate,
//         isVerified: false,
//         isAcceptingMessage: true,
//         messages: []
//       });

//       await newUser.save();
//     }

//     // Email verification
//     const emailResponse = await sendVerificationEmail({email, username, verifyCode});

//     if (!emailResponse.success) {
//       return NextResponse.json({
//         success: false,
//         message: emailResponse.message,
//       }, {
//         status: 500,
//       });
//     }

//     return NextResponse.json({
//       success: true,
//       message: "User registered successfully",
//     }, {
//       status: 201,
//     });
//   } catch (error) {
//     console.error("Error while registering user", error);
//     return NextResponse.json({
//       success: false,
//       message: "Error while registering user",
//     }, {
//       status: 500,
//     });
//   }
// }


import { sendVerificationEmail } from "@/helpers/sendVerificationEmail"; 
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();
    
    const existingUserVerifiedByUsername = await UserModel.findOne({ username, isVerified: true });
    // If user exists with the same username
    if (existingUserVerifiedByUsername) {
      return NextResponse.json({
        success: false,
        message: "Username already taken!",
      }, {
        status: 400,
      });
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    // If user exists with the same email
    if (existingUserByEmail) {
      // If user exists with the same email and is also verified
      if (existingUserByEmail.isVerified) {
        // Returning response so email does not go again to the user because it is already verified
        return NextResponse.json({
          success: false,
          message: "User already exists with the email!",
        }, {
          status: 400,
        });
      } else {
        // If user exists with the same email but is not verified or forgot the password, then we can again set new properties
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour expiry
        await existingUserByEmail.save();
      }
    } else {
      // If user does not exist with the same email, create a new user and save it
      const hashedPassword = await bcrypt.hash(password, 10);

      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1); // 1 hour expiry

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: []
      });

      await newUser.save();
    }

    // Email verification
    const emailResponse = await sendVerificationEmail({
      email,
      username,
      verifyCode,
    });

    if (!emailResponse.success) {
      return NextResponse.json({
        success: false,
        message: emailResponse.message,
      }, {
        status: 500,
      });
    }

    return NextResponse.json({
      success: true,
      message: "User registered successfully",
    }, {
      status: 201,
    });
  } catch (error) {
    console.error("Error while registering user", error);
    return NextResponse.json({
      success: false,
      message: "Error while registering user",
    }, {
      status: 500,
    });
  }
}
