'use client';

import { useToast } from "@/hooks/use-toast";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import ApiResponse from "@/types/ApiResponse";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";

const Page = () => {
    const { toast } = useToast();
    const router = useRouter();
    const params = useParams<{username: string}>();
    const [otp, setOtp] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            verifyCode: "",
        },
    });

    const fetchOtp = useCallback(async () => {
        try {
            const response = await axios.get<ApiResponse>(`/api/get-otp/${params.username}`);
            if (response.status === 200) {
                setOtp(response.data.data);
            }
        } catch (error) {
            console.error(`Error in getting otp of ${params.username}:`, error);
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Error in getting OTP",
                description: axiosError.response?.data.message ?? "Something went wrong while getting OTP",
                variant: "destructive",
            });
        }
    }, [params.username, toast]);

    useEffect(() => {
        fetchOtp();
    }, [fetchOtp]);

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            setIsLoading(true);
            const response = await axios.post<ApiResponse>('/api/verify-code', {
                username: params.username,
                code: data.verifyCode,
            });
            
            if (response.status === 200) {
                toast({
                    title: "Account verified",
                    description: "Your account has been verified. Please log in.",
                    variant: "default",
                });
                router.push('/sign-in');
            }
        } catch (error) {
            console.error(`Error in verification of ${params.username}:`, error);
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Error in Verification",
                description: axiosError.response?.data.message ?? "Something went wrong while verifying your account",
                variant: "destructive",
            });
            form.reset();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex justify-center items-center min-h-screen">
            <div className="absolute inset-0 backdrop-blur-sm -z-10" /> 

            <div className="w-full max-w-md p-8 space-y-4 dark:bg-black/70 border backdrop-blur-sm rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify Your Account
                    </h1>
                    <p className="mb-4">Enter the verification code sent to your email</p>
                    <p className="text-sm text-muted-foreground">
                        {otp ? `Your OTP: ${otp}` : "User already verified"}
                    </p>
                </div>
                
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center">
                        <FormField
                            control={form.control}
                            name="verifyCode"
                            render={({ field }) => (
                                <FormItem>
                                    <InputOTP 
                                        maxLength={6} 
                                        {...field}
                                        className="flex justify-center space-x-2"
                                        disabled={isLoading}
                                    >
                                        {[...Array(6)].map((_, i) => (
                                            <InputOTPSlot key={i} index={i} />
                                        ))}
                                    </InputOTP>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button 
                            type="submit" 
                            className="w-full mt-4"
                            disabled={isLoading}
                        >
                            {isLoading ? "Verifying..." : "Submit"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}

export default Page;