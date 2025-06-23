"use client";
import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  User,
  Briefcase,
  Code,
  Folder,
  GraduationCap,
  Clock,
  LogOut,
  MessageCircle
} from "lucide-react";
import { ThemeButton } from "../ThemeButton";
import Image from "next/image";
import { useTheme } from "@/app/context/ThemeContext";
import Dock from "./Dock";
import { useMediaQuery } from "react-responsive";
import { usePathname } from "next/navigation"; // Added for route detection

interface NavItem {
  name: string;
  icon: React.ElementType;
  href: string;
}

const navItems: NavItem[] = [
  { name: "Chats", icon: MessageCircle, href: "/admin" },
  { name: "Hero Section", icon: LayoutDashboard, href: "/admin/hero" },
  { name: "About", icon: User, href: "/admin/about" },
  { name: "Services", icon: Briefcase, href: "/admin/services" },
  { name: "Skills", icon: Code, href: "/admin/skills" },
  { name: "Project", icon: Folder, href: "/admin/project" },
  { name: "Education & Certificate", icon: GraduationCap, href: "/admin/education" },
  { name: "Working Experience", icon: Clock, href: "/admin/exprience" },
];

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { isDark, router } = useTheme();
  const pathname = usePathname(); // Get current route
  
  // Check if screen is small (mobile)
  const isMobile = useMediaQuery({ maxWidth: 768 });

  // Get active item based on current route
  const activeItem = navItems.find(item => item.href === pathname)?.name || "Hero Section";

  const startTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsExpanded(false), 10000);
  };

  const resetTimer = () => {
    startTimeout();
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Set up event listeners
  useEffect(() => {
    startTimeout();
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("touchstart", resetTimer);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("touchstart", resetTimer);
    };
  }, []);

  // Render Dock on mobile
  if (isMobile) {
    return (
      <Dock
        items={navItems}
        activeItem={activeItem}
      />
    );
  }

  
  return (
    <div
      ref={sidebarRef}
      className={`h-full rounded-xl shadow-xl transition-all duration-300 ease-in-out ${
        isExpanded ? "w-68" : "w-20"
      } bg-gradient-to-br from-indigo-50 to-teal-50 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950 flex-shrink-0`}
    >
      <div className="h-full flex flex-col">
        <div className="p-6 pb-2 flex flex-col items-center">
          <Image
            alt="logo"
            src={`${isDark ? "/elversh.png" : "/darklogo.png"}`}
            width={180}
            height={100}
          />
        </div>

        <nav className="flex flex-col px-4">
          {navItems.map((item) => (
            <button
              key={item.name}
              className={`flex items-center  ${
                isExpanded
                  ? "px-4 py-2 "
                  : "p-1 flex items-center justify-center"
              } rounded-xl mb-2 transition-all group ${
                activeItem === item.name
                  ? "bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              onClick={() => {
                setIsExpanded(true);
                resetTimer();
                router.push(item.href);
              }}
            >
              <div className={``}>
                <item.icon
                  className={` ${
                    !isExpanded
                      ? "h-6 w-6 flex items-center justify-center"
                      : "h-6 w-6 "
                  }`}
                />
              </div>
              <div className={`${!isExpanded ? "hidden " : "flex"}`}>
                <span
                  className={`ml-4 transition-opacity ${
                    !isExpanded ? "opacity-0 w-0" : "opacity-100"
                  }`}
                >
                  {item.name}
                </span>
              </div>

              {!isExpanded && (
                <div className="absolute left-20 ml-4 px-3 py-2 rounded-md bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm invisible group-hover:visible transition-opacity opacity-0 group-hover:opacity-100 z-10">
                  {item.name}
                </div>
              )}
            </button>
          ))}
        </nav>

        <div className="flex flex-col border-t px-4 border-gray-300 gap-3 items-center w-full dark:border-gray-700">
          <div className="mt-3">
            <ThemeButton />
          </div>
          <button
          onClick={()=> router.push("/")}
            className={`flex w-full p-3 cursor-pointer  items-center rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700`}
          >
            <div
              className={`${!isExpanded ? "w-full flex items-center justify-center" : ""}`}
            >
              <LogOut
                className={` ${!isExpanded ? "h-6 w-6 flex items-center " : "h-6 w-6 "}`}
              />
            </div>
            <div className={`${!isExpanded ? "hidden " : "flex"}`}>
              <span
                className={`ml-4 transition-opacity ${
                  !isExpanded ? "opacity-0 w-0" : "opacity-100"
                }`}
              >
                Logout
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}