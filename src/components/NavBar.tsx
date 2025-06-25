/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "@/app/context/ThemeContext";
import { usePathname } from "next/navigation";
import gsap from "gsap";

const Navbar = () => {
  const { isDark, toggleTheme, router, isLoading } = useTheme();
  const navRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About Me", href: "#aboutme" },
    { name: "Services", href: "#services" },
    { name: "Skills", href: "#skills" },
    { name: "Project", href: "#projects" },
    { name: "Experience", href: "#experience" }, 
    { name: "Education", href: "#education" },
  ];

  const handleContactClick = () => {
    setIsMenuOpen(false); // Close the mobile menu

    if (pathname === "/") {
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Navigate to the home page with the hash
      router.push("/#contact");
    }
  };

  const scrollToHash = (hash: string) => {
    if (hash && hash.startsWith("#")) {
      const elementId = hash.substring(1);
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        if (window.history.pushState) {
          window.history.pushState(null, "", hash);
        } else {
          window.location.hash = hash;
        }
      }
    }
  };
 
  useEffect(() => {

    if (isLoading) return;
    gsap.fromTo(
      ".navbar-child",
      { y: -20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
      }
    );
  }, [isLoading]);

  return (
    <>
      {/* Desktop Navbar */}
      <nav
        ref={navRef}
        className={`fixed top-0 w-full z-50 backdrop-blur-sm transition-all duration-300 ${
          isDark
            ? "bg-[#121212] border-gray-800"
            : "bg-gradient-to-br from-blue-50 to-purple-50 border-gray-200"
        } border-b py-4 px-4 sm:px-6 lg:px-8`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center navbar-child">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-2">
              <span className="text-white font-bold text-lg">EV</span>
            </div>
            <Image
              alt="logo"
              src="/elversh.png"
              width={80}
              height={70}
              className={!isDark ? "filter invert" : ""}
            />
          </div>

          <div className="hidden md:flex space-x-8 items-center navbar-child">
            {navItems.map((item, index) => (
              <a
                key={index}
                className={`cursor-pointer font-medium transition-all ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
                onClick={()=> {if(pathname === "/"){scrollToHash(item.href)}else{router.push(`/$`)}}}
              >
                {item.name}
              </a>
            ))}
          </div>

          <div className="flex items-center space-x-4 navbar-child">
            <button
              onClick={toggleTheme}
              className={`theme-btn p-2 rounded-full ${
                isDark ? "bg-gray-700" : "bg-gray-200"
              } hover:opacity-80 transition-opacity`}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg
                  className="w-5 h-5 text-yellow-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-gray-700"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            <button
              className="contact-btn hidden md:block px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20"
              onClick={handleContactClick}
            >
              Contact Me
            </button>

            <button
              className="md:hidden p-2  rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6 text-[#121212] dark:text-[#E0E0E0]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16m-7 6h7"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className={`fixed top-16 left-0 right-0 z-40 transition-all duration-300 ${
            isDark ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 to-purple-50"
          } shadow-xl`}
        >
          <div className="py-4 px-6 space-y-3">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={`mobile-menu-item block py-3 px-4 rounded-lg transition-all ${
                  isDark
                    ? "text-gray-200 hover:bg-gray-800"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="pt-4 flex justify-center">
              <a href="#contact" className="w-full ">
                <button
                  className="mobile-menu-item w-full py-3 px-4 rounded-md bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact Me
                </button>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
