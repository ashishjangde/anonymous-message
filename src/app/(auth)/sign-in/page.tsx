'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
import { Suspense } from "react";

export default function Page() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);

    try {
      const result = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: "Authentication Failed",
          description: "Please check your credentials",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome Back",
          description: "Successfully logged in",
          variant: "default",
        });
        router.push("/");
        router.refresh(); // Refresh to update authentication state
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      toast({
        title: "Error",
        description: "An error occurred while signing in",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen dark:bg-gray-900">
      <div className="absolute inset-0 dark:bg-black opacity-85 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-md p-8 space-y-8 dark:bg-black/70 rounded-lg shadow-md backdrop-blur-md">
        <div className="text-center text-white">
          <h1 className="text-3xl font-extrabold tracking-tight dark:text-white text-black lg:text-5xl mb-6">
            Anonymous
          </h1>
          <p className="mb-4 dark:text-white text-black">
            Have fun with friends and get to know them anonymously.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    placeholder="email"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    placeholder="password"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              variant="custom" 
              className="w-full"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Don't have an account?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
