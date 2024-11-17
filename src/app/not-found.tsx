'use client';

import errorLottie from "@/public/lottie/customError.json";
import Navbar from "@/components/navbar/Navbar";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamically import the Lottie Player to avoid SSR issues
const Player = dynamic(() =>
  import('@lottiefiles/react-lottie-player').then((mod) => mod.Player),
  { ssr: false, loading: () => <p>Loading animation...</p> }  
);

export default function NotFound() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex flex-col justify-center items-center text-center p-4">
        {isMounted && (
          <Player
            autoplay
            loop
            src={errorLottie}
            style={{ height: '300px', width: '300px' }}
          />
        )}
        <h1 className="text-5xl font-bold text-red-700 mt-4">
          Oops! Page Not Found
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mt-2">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
    </div>
  );
}
