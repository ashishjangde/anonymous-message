'use client'

import { X } from "lucide-react";
import { Card, CardContent, CardHeader, CardDescription } from "../ui/card";

import { Message as IMessage } from "@prisma/client";

import {
    AlertDialog, AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import  ApiResponse  from "@/types/ApiResponse";
import { useState } from "react";

interface MessageCardProps {
    message: IMessage;
    deleteMessage: (messageId: string) => void;
}

const MessageCard = ({ message, deleteMessage }: MessageCardProps) => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleDeleteMessage = async () => {
        setIsLoading(true);
        try {
            const response = await axios.delete<ApiResponse>(`/api/delete-message/${message.id}`);
            if (response.status === 200) {
                toast({
                    title: "Message Deleted",
                    description: "The message has been successfully deleted.",
                });
                deleteMessage(message.id as string);
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast({
                    title: "Error",
                    description: error.response?.data.message ?? "Failed to delete the message. Please try again.",
                    variant: "destructive",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Format the createdAt date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString(); // Display date and time
    };

    return (
        <Card className="border border-gray-300 rounded-lg p-4 mb-4 relative">
            <CardHeader className="flex justify-between items-start">
                <CardDescription className="text-lg dark:text-white text-black">{message.content || "Message content goes here."}</CardDescription>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <p
                            className="absolute top-0.5 right-2 flex items-center justify-center w-5 h-5 rounded-full bg-red-600"
                        >
                            <X className="w-4 h-4 text-white" />
                        </p>

                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to delete this message?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. The message will be permanently deleted from our records.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDeleteMessage} disabled={isLoading}>
                                {isLoading ? "Deleting..." : "Continue"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardHeader>
            <CardContent className="text-sm  mt-2">
                Sent on: {formatDate(message.createdAt.toString())}
            </CardContent>
        </Card>
    );
}

export default MessageCard;
