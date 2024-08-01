// // import { resend } from "@/lib/resend";
// // import VerificationEmail from "../../emails/VerificationEmail";
// // import { ApiResponse } from "@/types/ApiResponse";

// // export async function sendVerificationEmail(
// //     email: string,
// //     username: string,
// //     verifyCode: string,
// // ): Promise<ApiResponse> {
// //     try {
// //         console.log(`Sending verification email to ${email} with code ${verifyCode}`);
// //          await resend.emails.send({
// //             from: 'irfanarif331@gmail.com',
// //             to: email,
// //             subject: 'Mystery message | Verification code',
// //             react: VerificationEmail({username,otp: verifyCode}),
// //           });
// //         //   console.log('Email sent result:', result);
// //           return {success: true, message: "Verification email sent successfully"}
// //     } catch (emailError) {
// //         console.error("Error sending verification email", emailError);
// //         return {success: false, message: "Failed to send verification email"}
// //     }
// // }
//---------------------------------------------------------------------------
//------------{2}------------
import Mailgun from "mailgun.js";
import formData from "form-data";

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY!,
  url: "https://api.mailgun.net",
});

interface MailgunEmailProps {
  email: string;
  username: string;
  verifyCode: string;
}

export async function sendVerificationEmail({
  email,
  username,
  verifyCode,
}: MailgunEmailProps): Promise<{ success: boolean; message: string }> {
  try {
    const htmlContent = `
      <html>
        <body>
          <h2>Hello ${username},</h2>
          <p>Thank you for registering. Please use the following verification code to complete your registration:</p>
          <p><strong>${verifyCode}</strong></p>
          <p>If you did not request this code, please ignore this email.</p>
        </body>
      </html>
    `;

    const data = {
      from: "Excited User <mailgun@sandbox9ca270aab24f4595ab4d529c792b71c7.mailgun.org>",
      to: email,
      subject: "Mystery message | Verification code",
      html: htmlContent,
    };

    await mg.messages.create(process.env.MAILGUN_DOMAIN!, data);
    return { success: true, message: "Verification email sent successfully" };
  } catch (error) {
    console.error("Error sending verification email", error);
    return { success: false, message: "Failed to send verification email" };
  }
}
