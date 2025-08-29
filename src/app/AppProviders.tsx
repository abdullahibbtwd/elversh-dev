"use client";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ThumbsUp, InfoIcon, OctagonAlert, CircleX, Loader } from "lucide-react";
import { ThemeProvider } from "./context/ThemeContext";
import React, { ReactNode, useEffect, useState } from "react";
import { usePathname } from 'next/navigation';
import Navbar from "@/components/NavBar";

export default function AppProviders({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js').then(function() {
        // Registration successful
      }).catch(function(error) {
        console.error('ServiceWorker registration failed:', error);
      });
    }
    if (window.Notification && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  // Show loading state during SSR/build
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

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
          {children}
        </ThemeProvider>
      </ConvexClientProvider>
    </ClerkProvider>
  );
} 