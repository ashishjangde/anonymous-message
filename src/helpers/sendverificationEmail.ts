import resend from "@/lib/resendConfig";
import ApiResponse from "@/types/ApiResponse";
import VerificationEmail from "../../sending-email-templates/VerificationEmail";


export async function sendVerificationEmail({
    email,
    username,
    verificationCode
}:
    {
        email: string,
        username: string,
        verificationCode: string
    }): Promise<ApiResponse> {
        
    try {
        await resend.emails.send({
            from:"ashish.dev.com",
            to: email,
            subject: "Verify your account",
            react: VerificationEmail({ username, otp: verificationCode }),
        })
        return {
            success: true,
            message: "Verification email sent",
            data: null
        }
    } catch (error) {
        console.error("Error in sending verification email:", error);
        return {
            success: false,
            message: "Error in sending verification email",
            data: null
        }

    }
}


