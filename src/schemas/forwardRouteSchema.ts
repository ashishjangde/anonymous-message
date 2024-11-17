'use client'
import { z } from "zod";

export const forwardRouteSchema = z.object({
  route: z.string().url({ message: "Please enter a valid URL." })
});

export const validateRouteUrl = (url: string) => {
  if (typeof window === 'undefined') return true; 
  
  const baseUrl = `${window.location.protocol}//${window.location.host}/u/`;
  return url.startsWith(baseUrl);
};
