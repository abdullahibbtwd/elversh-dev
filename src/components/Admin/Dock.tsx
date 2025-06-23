// components/Admin/Dock.tsx
"use client";
import React from "react";
import { useTheme } from "@/app/context/ThemeContext";
import { useRouter } from "next/navigation";
import { IoMoonSharp, IoSunnySharp } from "react-icons/io5";

interface DockItem {
  name: string;
  icon: React.ElementType;
  href: string;
}

interface DockProps {
  items: DockItem[];
  activeItem: string;
}

const Dock = ({ items, activeItem}: DockProps) => {
  const { toggleTheme,isDark } = useTheme();
  const router = useRouter();

  return (
    <div className="fixed px-4 w-full bottom-0 left-0 right-0 z-50 flex items-center justify-center p-2 bg-gradient-to-br from-indigo-50 to-teal-50 border-t border-gray-300 dark:border-gray-700 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950">
      <div className="flex items-center justify-center gap-1">
        {items.map((item) => (
          <button
            key={item.name}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
              activeItem === item.name
                ? "bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
            onClick={() => {
              router.push(item.href);
            }}
          >
            <item.icon className="h-6 w-6" />
          </button>
        ))}
         <button
               onClick={toggleTheme} 
               className="bg-primary text-primary-foreground rounded-lg cursor-pointer"
             >
               {isDark ?
                 <IoSunnySharp className="text-2xl text-[#E0E0E0] " /> :
                 <IoMoonSharp className="text-2xl text-[#121212]" />}
             </button>
      </div>
    </div>
  );
};

export default Dock;