'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, SubmitHandler } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useDebounceCallback } from 'usehooks-ts'
import { use, useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import axios, { AxiosError } from "axios"
import ApiResponse from "@/types/ApiResponse"
import { signupSchema } from "@/schemas/signUpSchema"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2} from "lucide-react" 


export default function Page () {
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debouncedUsername = useDebounceCallback(setUsername, 1000);
  const router = useRouter();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    }
  })

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username && username !== "") {
        setIsCheckingUsername(true);
        setUsernameMessage('');
        try {
          const response = await axios.get(`/api/check-username-unique`, {
            params: { username: username }
          });
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message || 'Something went wrong');
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit: SubmitHandler<z.infer<typeof signupSchema>> = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);
      if(response.status == 201) {
        toast({
          title: "Account created",
          description: "We've created your account for you. Please verify your email.",
          variant:"default",
        });
          router.replace(`/verify/${data.username}`);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log(axiosError.response?.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen dark:bg-gray-900">
    <div className="absolute inset-0 dark:bg-black opacity-85 backdrop-blur-sm" />
    <div className="relative z-10 w-full max-w-md p-8 space-y-8 dark:bg-black/70 rounded-lg shadow-md backdrop-blur-md">
      <div className="text-center text-white">
        <h1 className="text-3xl font-extrabold tracking-tight dark:text-white text-black lg:text-5xl mb-6">Anonymous</h1>
        <p className="mb-4 dark:text-white text-black">Have fun with friends and get to know them anonymously.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Username</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter username"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setUsername(e.target.value);
                  }}
                />
                {isCheckingUsername && <Loader2 className="animate-spin h-4 w-4 mt-2 text-gray-400" />}
                {!isCheckingUsername && usernameMessage && (
                  <p
                    className={`text-sm ${
                      usernameMessage === 'Username Available'
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {usernameMessage}
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Email</FormLabel>
                <Input
                  type="email"
                  placeholder="Enter email"
                  {...field}
                />
                <p className="text-gray-400 text-sm mt-2">We will send you a verification code.</p>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Enter password"
                  {...field}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting} variant={"custom"} className="w-full">
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              'Sign Up'
            )}
          </Button>
        </form>
      </Form>
      <div className="text-center mt-4 text-gray-400">
        <p>
          Already a member?{' '}
          <Link href="/sign-in" className="text-blue-500 hover:text-blue-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  </div>
  )
}

