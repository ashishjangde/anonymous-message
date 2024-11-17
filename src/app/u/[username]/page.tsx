'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { messageSchema } from "@/schemas/messageSchema";
import axios, { AxiosError } from "axios";
import  ApiResponse  from "@/types/ApiResponse";
import { useState } from "react";

// Additional schema for optional fields

export default function Home() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const [charCount, setCharCount] = useState(0);
  const MAX_CHAR = 250;

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",
    },
  });

  const handleMessageSubmit = async (data: z.infer<typeof messageSchema>) => {
    try {
      await axios.post('/api/send-message', {
        username: params.username,
        content: data.message,
      });
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully.",
        variant: "default",
      });
      form.reset(); 
      setCharCount(0);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error in Sending Message",
        description: axiosError.response?.data.message ?? "Something went wrong while sending your message.",
        variant: "destructive",
      });
    }
  };

  const handleCharCount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const charLength = e.target.value.length;
    setCharCount(charLength);
    form.setValue('message', e.target.value);
  };

  return (
    <div className="my-16 mx-4 md:mx-8 lg:mx-auto p-8 rounded-lg max-w-4xl  dark:text-white">
      <h1 className="text-4xl font-bold mb-4 text-center">Welcome, Anonymous User</h1>
      
      <p className="text-xl text-center mb-8 text-gray-600 dark:text-gray-300">
        Share your thoughts anonymously with {params.username}!
      </p>

      <div className="flex flex-col items-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleMessageSubmit)} className="flex flex-col items-center w-full space-y-6">
            <FormField
              control={form.control}
              name="message"
              render={() => (
                <FormItem className="w-full lg:w-2/3">
                  <Input
                    type="text"
                    name="message"
                    placeholder="Enter your message here"
                    maxLength={MAX_CHAR}
                    onChange={handleCharCount}
                    value={form.watch('message')}
                    className="w-full p-4 rounded-lg border-2 border-gray-300 dark:border-gray-600"
                  />
                  <div className="flex justify-between mt-2">
                    <FormMessage />
                    <p className="text-sm text-gray-500 dark:text-gray-400">{charCount}/{MAX_CHAR} characters</p>
                  </div>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="custom"
              className="w-full lg:w-2/4 rounded-full dark:bg-white dark:text-black bg-gray-950"
            >
              Send Message
            </Button>
          </form>
        </Form>
      </div>

      <Separator className="my-12" />

      <div className="text-center space-y-6">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Send anonymous messages, stay connected, and enjoy a secure and fun messaging experience!
        </p>

        <Button
          onClick={() => router.push(`/`)}
          variant={"custom"}
          className=" lg:w-1/4 rounded-lg"
        >
          Go to Home
        </Button>
      </div>

      <Separator className="my-12" />
      
      <footer className="text-center text-gray-500 dark:text-gray-400 mt-12">
        <p>Built with care for anonymous messaging.</p>
      </footer>
    </div>
  );
}
