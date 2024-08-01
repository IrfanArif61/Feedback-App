"use client";

import { useToast } from "@/components/ui/use-toast";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// import { useDebounceCallback } from "usehooks-ts";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { verifySchema } from "@/schemas/verifySchema";
import axios, { AxiosError } from "axios";

const verifyAccountPage = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post("/api/verify-code", {
        username: params.username,
        code: data.code,
      });

      toast({
        title: "Success",
        description: response.data.message,
      });

      router.replace("/sign-in");
    } catch (error) {
      console.error("Error in verifying code", error);

      const axiosError = error as AxiosError<ApiResponse>;

      // Default error message
      let errorMessage = axiosError.response?.data.message;
      ("There was a problem with your sign-up. Please try again.");

      toast({
        title: "Please enter correct code",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Verify</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default verifyAccountPage;

// "use client";

// import { useToast } from "@/components/ui/use-toast";
// import { useParams } from "next/navigation";
// import { useRouter } from "next/router";
// import { ApiResponse } from "@/types/ApiResponse";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { useState, useEffect } from "react";
// import axios, { AxiosError } from "axios";

// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { verifySchema } from "@/schemas/verifySchema";
// import UserModel from "@/model/User";
// import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

// const verifyAccountPage = () => {
//   const router = useRouter();
//   const { username } = useParams<{ username: string }>();
//   const { toast } = useToast();
//   const [resendCountdown, setResendCountdown] = useState(30);
//   const [isResendDisabled, setIsResendDisabled] = useState(true);

//   const form = useForm<z.infer<typeof verifySchema>>({
//     resolver: zodResolver(verifySchema),
//   });

//   useEffect(() => {
//     if (resendCountdown > 0) {
//       const timer = setTimeout(() => {
//         setResendCountdown(resendCountdown - 1);
//       }, 1000);

//       return () => clearTimeout(timer);
//     } else {
//       setIsResendDisabled(false);
//     }
//   }, [resendCountdown]);

//   const onSubmit = async (data: z.infer<typeof verifySchema>) => {
//     try {
//       const response = await axios.post("/api/verify-code", {
//         username,
//         code: data.code,
//       });

//       toast({
//         title: "Success",
//         description: response.data.message,
//       });

//       router.replace("sign-in");
//     } catch (error) {
//       console.error("Error in verifying code", error);

//       const axiosError = error as AxiosError<ApiResponse>;
//       let errorMessage =
//         axiosError.response?.data.message ??
//         "There was a problem with your sign-up. Please try again.";

//       toast({
//         title: "Please enter correct code",
//         description: errorMessage,
//         variant: "destructive",
//       });
//     }
//   };

//   const handleResendCode = async () => {
//     try {
//       // Fetch the user by username
//       const user = await UserModel.findOne({ username });

//       if (!user) {
//         throw new Error("User not found");
//       }

//       // Generate a new verification code
//       const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

//       // Update user with new verification code and expiry
//       user.verifyCode = verifyCode;
//       user.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour expiry
//       await user.save();

//       // Send verification email
//       const emailResponse = await sendVerificationEmail({
//         email: user.email,
//         username: user.username,
//         verifyCode,
//       });

//       if (!emailResponse.success) {
//         throw new Error(emailResponse.message);
//       }

//       toast({
//         title: "Success",
//         description: "A new verification code has been sent to your email.",
//       });

//       setIsResendDisabled(true);
//       setResendCountdown(30);
//     } catch (error) {
//       console.error("Error in resending code", error);

//       let errorMessage =
//         (error as Error).message ??
//         "Failed to resend verification code. Please try again.";

//       toast({
//         title: "Error",
//         description: errorMessage,
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
//         <div className="text-center">
//           <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
//             Verify Your Account
//           </h1>
//           <p className="mb-4">Enter the verification code sent to your email</p>
//         </div>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             <FormField
//               name="code"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Verification Code</FormLabel>
//                   <Input {...field} />
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <Button type="submit">Verify</Button>
//           </form>
//         </Form>
//         <div className="flex justify-center mt-4">
//           <Button onClick={handleResendCode} disabled={isResendDisabled}>
//             {isResendDisabled
//               ? `Resend Code (${resendCountdown})`
//               : "Resend Code"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default verifyAccountPage;

// **************{3}**************
// "use client";

// import { useToast } from "@/components/ui/use-toast";
// import { useParams, useRouter } from "next/navigation";
// import { ApiResponse } from "@/types/ApiResponse";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { useState, useEffect } from "react";
// import axios, { AxiosError } from "axios";

// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { verifySchema } from "@/schemas/verifySchema";

// const VerifyAccountPage = () => {
//   const router = useRouter();
//   const params = useParams();
//   const { toast } = useToast();
//   const [resendCountdown, setResendCountdown] = useState(30);
//   const [isResendDisabled, setIsResendDisabled] = useState(true);

//   const form = useForm<z.infer<typeof verifySchema>>({
//     resolver: zodResolver(verifySchema),
//   });

//   useEffect(() => {
//     if (resendCountdown > 0) {
//       const timer = setTimeout(() => {
//         setResendCountdown(resendCountdown - 1);
//       }, 1000);

//       return () => clearTimeout(timer);
//     } else {
//       setIsResendDisabled(false);
//     }
//   }, [resendCountdown]);

//   const onSubmit = async (data: z.infer<typeof verifySchema>) => {
//     try {
//       const response = await axios.post("/api/verify-code", {
//         username: params.username,
//         code: data.code,
//       });

//       toast({
//         title: "Success",
//         description: response.data.message,
//       });

//       router.replace("/sign-in");
//     } catch (error) {
//       console.error("Error in verifying code", error);

//       const axiosError = error as AxiosError<ApiResponse>;
//       let errorMessage =
//         axiosError.response?.data.message ??
//         "There was a problem with your sign-up. Please try again.";

//       toast({
//         title: "Please enter correct code",
//         description: errorMessage,
//         variant: "destructive",
//       });
//     }
//   };

//   const handleResendCode = async () => {
//     try {
//       // Make a request to the server to resend the code
//       const response = await axios.post("/api/resend-code", {
//         username: params.username,
//       });

//       if (response.data.success) {
//         toast({
//           title: "Success",
//           description: "A new verification code has been sent to your email.",
//         });

//         setIsResendDisabled(true);
//         setResendCountdown(30);
//       } else {
//         throw new Error(response.data.message);
//       }
//     } catch (error) {
//       console.error("Error in resending code", error);

//       let errorMessage =
//         (error as Error).message ??
//         "Failed to resend verification code. Please try again.";

//       toast({
//         title: "Error",
//         description: errorMessage,
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
//         <div className="text-center">
//           <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
//             Verify Your Account
//           </h1>
//           <p className="mb-4">Enter the verification code sent to your email</p>
//         </div>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             <FormField
//               name="code"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Verification Code</FormLabel>
//                   <Input {...field} />
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <Button type="submit">Verify</Button>
//           </form>
//         </Form>
//         <div className="flex justify-center mt-4">
//           <Button onClick={handleResendCode} disabled={isResendDisabled}>
//             {isResendDisabled
//               ? `Resend Code (${resendCountdown})`
//               : "Resend Code"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VerifyAccountPage;

// ***********{4}************

// "use client";

// import { useToast } from "@/components/ui/use-toast";
// import { useParams, useRouter } from "next/navigation";
// import { ApiResponse } from "@/types/ApiResponse";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { useState, useEffect } from "react";
// import axios, { AxiosError } from "axios";

// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { verifySchema } from "@/schemas/verifySchema";

// const VerifyAccountPage = () => {
//   const router = useRouter();
//   const params = useParams();
//   const { toast } = useToast();
//   const [resendCountdown, setResendCountdown] = useState(30);
//   const [isResendDisabled, setIsResendDisabled] = useState(false);

//   const form = useForm<z.infer<typeof verifySchema>>({
//     resolver: zodResolver(verifySchema),
//   });

//   useEffect(() => {
//     if (resendCountdown > 0) {
//       const timer = setTimeout(() => {
//         setResendCountdown(resendCountdown - 1);
//       }, 1000);

//       return () => clearTimeout(timer);
//     } else {
//       setIsResendDisabled(false);
//     }
//   }, [resendCountdown]);

//   const onSubmit = async (data: z.infer<typeof verifySchema>) => {
//     try {
//       const response = await axios.post("/api/verify-code", {
//         username: params.username,
//         code: data.code,
//       });

//       toast({
//         title: "Success",
//         description: response.data.message,
//       });

//       router.replace("/sign-in");
//     } catch (error) {
//       console.error("Error in verifying code", error);

//       const axiosError = error as AxiosError<ApiResponse>;
//       let errorMessage =
//         axiosError.response?.data.message ??
//         "There was a problem with your sign-up. Please try again.";

//       toast({
//         title: "Please enter correct code",
//         description: errorMessage,
//         variant: "destructive",
//       });
//     }
//   };

//   const handleResendCode = async () => {
//     try {
//       // const userResponse = await axios.post("/api/get-user-detail", {
//       //   username: params.username,
//       // });

//       // const user = userResponse.data.user;

//       // if (!user) {
//       //   return Response.json({
//       //     success: false,
//       //     message: "user does not exist",
//       // }, {status: 400})
//       // }

//       // Generate a new verification code
//       const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

//       // Set the expiry date to 1 hour from now
//       const expiryDate = new Date();
//       expiryDate.setHours(expiryDate.getHours() + 1);

//       const updateUserResponse = await axios.post("/api/update-user-detail", {
//         username: params.username,
//         verifyCode,
//         expiryDate: expiryDate.toISOString(),
//       });

//       const user = updateUserResponse.data.user;

//       if (!user) {
//         return Response.json(
//           {
//             success: false,
//             message: "user does not exist",
//           },
//           { status: 400 }
//         );
//       }
//       console.log(user);

//       const response = await axios.post("/api/resend-code", {
//         email: user.email,
//         username: params.username,
//         verifyCode: user.verifyCode,
//       });

//       if (response.data.success) {
//         toast({
//           title: "Success",
//           description: "A new verification code has been sent to your email.",
//         });

//         setIsResendDisabled(true);
//         setResendCountdown(30);
//       } else {
//         throw new Error(response.data.message);
//       }
//     } catch (error) {
//       console.error("Error in resending code", error);

//       let errorMessage =
//         (error as Error).message ??
//         "Failed to resend verification code. Please try again.";

//       toast({
//         title: "Error",
//         description: errorMessage,
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
//         <div className="text-center">
//           <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
//             Verify Your Account
//           </h1>
//           <p className="mb-4">Enter the verification code sent to your email</p>
//         </div>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             <FormField
//               name="code"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Verification Code</FormLabel>
//                   <Input {...field} />
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <Button type="submit">Verify</Button>
//           </form>
//         </Form>
//         <div className="flex justify-center mt-4">
//           <Button onClick={handleResendCode} disabled={isResendDisabled}>
//             {isResendDisabled
//               ? `Resend Code (${resendCountdown})`
//               : "Resend Code"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VerifyAccountPage;

// const handleResendCode = async () => {
//       try {
//         // const userResponse = await axios.post("/api/get-user-detail", {
//         //   username: params.username,
//         // });

//         // const user = userResponse.data.user;

//         // if (!user) {
//         //   return Response.json({
//         //     success: false,
//         //     message: "user does not exist",
//         // }, {status: 400})
//         // }

//         // Generate a new verification code
//         const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

//         // Set the expiry date to 1 hour from now
//         const expiryDate = new Date();
//         expiryDate.setHours(expiryDate.getHours() + 1);

//         const updateUserResponse = await axios.post("/api/update-user-detail", {
//           username: params.username,
//           verifyCode,
//           expiryDate: expiryDate.toISOString(),
//         });

//         const user = updateUserResponse.data.user;

//         if (!user) {
//           return Response.json(
//             {
//               success: false,
//               message: "user does not exist",
//             },
//             { status: 400 }
//           );
//         }
//         console.log(user);

//         const response = await axios.post("/api/resend-code", {
//           email: user.email,
//           username: params.username,
//           verifyCode: user.verifyCode,
//         });

//         if (response.data.success) {
//           toast({
//             title: "Success",
//             description: "A new verification code has been sent to your email.",
//           });

//           setIsResendDisabled(true);
//           setResendCountdown(30);
//         } else {
//           throw new Error(response.data.message);
//         }
//       } catch (error) {
//         console.error("Error in resending code", error);

//         let errorMessage =
//           (error as Error).message ??
//           "Failed to resend verification code. Please try again.";

//         toast({
//           title: "Error",
//           description: errorMessage,
//           variant: "destructive",
//         });
//       }
//     };
