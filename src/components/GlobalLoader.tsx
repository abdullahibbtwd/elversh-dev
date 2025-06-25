"use client";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Image from "next/image";
import React, { useEffect } from "react";
import gsap from "gsap";

export default function GlobalLoader({ children }: { children: React.ReactNode }) {
  const Hompage = useQuery(api.homePage.getHomePageContent);
  const isLoading = Hompage === undefined;

  useEffect(() => {
    gsap.fromTo(
      ".global-loader-logo",
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, delay: 0.1, ease: "power3.out" }
    );
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-[#121212]/80">
        <Image
          src="/ev.png"
          alt="Logo"
          width={200}
          height={200}
          className="global-loader-logo opacity-0 translate-y-16 w-[50px] h-[50px] lg:w-[100px] lg:h-[100px] mb-2"
          priority
        />
        <svg className="animate-spin h-10 w-10" viewBox="0 0 50 50">
          <defs>
            <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#a21caf" />
            </linearGradient>
          </defs>
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="url(#spinner-gradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="90 150"
            strokeDashoffset="0"
          />
        </svg>
      </div>
    );
  }

  return children;
}