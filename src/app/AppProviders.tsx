"use client";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ThumbsUp, InfoIcon, OctagonAlert, CircleX, Loader } from "lucide-react";
import { ThemeProvider } from "./context/ThemeContext";
import React, { ReactNode } from "react";
import { usePathname } from 'next/navigation';
import Navbar from "@/components/NavBar";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function AppProviders({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <ConvexProvider client={convex}>
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
    </ConvexProvider>
  );
} 