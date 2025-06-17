// // components/ThemeButton.tsx
// "use client";
// import { useEffect, useState } from "react";

// import { IoMoonSharp } from "react-icons/io5";
// import { IoSunnySharp } from "react-icons/io5";

// export const ThemeButton = () => {
//   const [isDark, setIsDark] = useState(false);

//   useEffect(() => {
//     setIsDark(document.documentElement.classList.contains("dark"));
//   }, []);

//   const toggleTheme = () => {
//     if (isDark) {
//       document.documentElement.classList.remove("dark");
//     } else {
//       document.documentElement.classList.add("dark");
//     }
//     setIsDark(!isDark);
//   };

//   return (
//     <div className="flex items-center justify-center w-full ">
//     <button
//       onClick={toggleTheme}
//       className="bg-primary text-primary-foreground px-4 py-2 rounded-lg cursor-pointer"
//     >
//       {isDark ? <IoSunnySharp 
//       className="text-2xl text-[#E0E0E0] "
//       /> :<IoMoonSharp className="text-2xl text-[#121212]"/>}
//     </button>
//     </div>
 
//   );
// };
// components/ThemeButton.tsx
"use client";
// No more useState or useEffect here for theme logic

import { IoMoonSharp } from "react-icons/io5";
import { IoSunnySharp } from "react-icons/io5";
import { useTheme } from '../app/context/ThemeContext'; // ADD THIS IMPORT

export const ThemeButton = () => {
  const { isDark, toggleTheme } = useTheme(); // Use the custom hook to get theme state and toggle function

  return (
    <div className="flex items-center justify-center w-full ">
      <button
        onClick={toggleTheme} 
        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg cursor-pointer"
      >
        {isDark ?
          <IoSunnySharp className="text-2xl text-[#E0E0E0] " /> :
          <IoMoonSharp className="text-2xl text-[#121212]" />}
      </button>
    </div>
  );
};