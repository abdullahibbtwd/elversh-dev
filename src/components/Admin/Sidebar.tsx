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
} from "lucide-react";
import { ThemeButton } from "../ThemeButton";
import Image from "next/image";
const navItems = [
  { name: "Hero Section", icon: LayoutDashboard },
  { name: "About", icon: User },
  { name: "Services", icon: Briefcase },
  { name: "Skills", icon: Code },
  { name: "Project", icon: Folder },
  { name: "Education and Certificate", icon: GraduationCap },
  { name: "Working Experience", icon: Clock },
];

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [activeItem, setActiveItem] = useState("Hero Section");
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Toggle dark mode

  // Collapse sidebar after 10 seconds of inactivity
  const startTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsExpanded(false), 10000);
  };

  // Reset timer on user interaction
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

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-4 left-4 z-50 h-[calc(100vh-2rem)] rounded-xl shadow-xl transition-all duration-300 ease-in-out ${
        isExpanded ? "w-72" : "w-20"
      } bg-[#E0E0E0] dark:bg-[#121212]`}
    >
      <div className="h-full flex flex-col">
        <div className="p-6 pb-2 flex flex-col items-center">
          {/* <h1
            className={`text-2xl font-bold text-gray-800 dark:text-gray-200 mb-8 transition-opacity ${
              !isExpanded ? "opacity-0 h-0 mb-0" : "opacity-100 h-auto"
            }`}
          >
            Configuple
          </h1> */}
          <Image alt="logo" src="/elversh.png" width={200} height={100}/>
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
                setActiveItem(item.name);
                setIsExpanded(true);
                resetTimer();
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

        <div
          className="flex flex-col  border-t px-4 border-gray-300 gap-3 items-center w-full  dark:border-gray-700"
          //className={`p-1   border-t border-gray-300  ${isExpanded?" flex flex-col px-7 py-2":"p-1"} dark:border-gray-700`}
        >
          <div className="mt-3">
              <ThemeButton />
          </div>
        
          
      
        

          <button
            className={`flex  w-full p-3 items-center  rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700`}
          >
            <div className={`${!isExpanded?"w-full flex items-center justify-center":""}`}>
              <LogOut
                className={` ${
                  !isExpanded
                    ? "h-6 w-6 flex items-center "
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
                Logout
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}