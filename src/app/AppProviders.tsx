"use client";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ThumbsUp, InfoIcon, OctagonAlert, CircleX, Loader } from "lucide-react";
import { ThemeProvider } from "./context/ThemeContext";
import React from "react";
import { usePathname } from 'next/navigation';
import Navbar from "@/components/NavBar";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');
  return (
    <ClerkProvider>
      <ConvexClientProvider>
        <Toaster
          icons={{
            success: <ThumbsUp />,
            info: <InfoIcon />,
            warning: <OctagonAlert />,
            error: <CircleX />,
            loading: <Loader />,
          }}
        />
        <ThemeProvider>
        {!isAdminRoute && <Navbar />}
          {children}</ThemeProvider>
      </ConvexClientProvider>
    </ClerkProvider>
  );
} 