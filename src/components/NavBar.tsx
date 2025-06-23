/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import { useTheme } from "@/app/context/ThemeContext";

import { usePathname } from "next/navigation";

const Navbar = () => {
  const { isDark, toggleTheme, router } = useTheme();
  const navRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About Me", href: "#aboutme" },
    { name: "Services", href: "#services" },
    { name: "Skills", href: "#skills" },
    { name: "Project", href: "#projects" },
    { name: "Experience", href: "#experience" }, // Corrected typo
    { name: "Education", href: "#education" },
  ];

  useEffect(() => {
    // Navbar entrance animation
    gsap.from(navRef.current, {
      duration: 0.8,
      y: 0,
      opacity: 1,
      ease: "power3.out",
    });

    // Link animations
    // gsap.from(".nav-link", {
    //   duration: 0.6,
    //   y: 0,
    //   opacity: 1,
    //   stagger: 0.1,
    //   delay: 0.3,
    //   ease: "power3.out",
    // });

    // Theme button animation
    gsap.from(".theme-btn", {
      duration: 0.7,
      opacity: 1,
      scale: 0.8,
      delay: 0.8,
      ease: "elastic.out(1, 0.8)",
    });

    // Contact button animation
    gsap.from(".contact-btn", {
      duration: 0.7,
      opacity: 1,
      x: 0,
      delay: 0.9,
      ease: "power3.out",
    });
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.getElementById(hash.substring(1)); // Remove '#'
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    // Listen for hash changes (e.g., when router.push('/#contact') is called)
    window.addEventListener("hashchange", handleHashChange);

    // Also run on initial mount if a hash is present in the URL
    handleHashChange();

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [pathname]);
  useEffect(() => {
    if (isMenuOpen) {
      // Mobile menu animation
      gsap.from(".mobile-menu-item", {
        duration: 0.5,
        x: -3,
        opacity: 1,
        stagger: 0.1,
        ease: "power2.out",
      });
    }
  }, [isMenuOpen]);

  const handleHover = (e: any) => {
    gsap.to(e.target, {
      duration: 0.3,
      scale: 1.05,

      ease: "power2.out",
    });
  };

  const handleHoverOut = (e: any) => {
    gsap.to(e.target, {
      duration: 0.3,
      scale: 1,

      ease: "power2.out",
    });
  };
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
      const handleHashChange = () => {
        const hash = window.location.hash;
        if (hash) {
          const element = document.getElementById(hash.substring(1)); // Remove '#'
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }
      };
  
      window.addEventListener("hashchange", handleHashChange);
  
      handleHashChange();
  
      return () => {
        window.removeEventListener("hashchange", handleHashChange);
      };
    }, [pathname]);
 

  return (
    <>
      {/* Desktop Navbar */}
      <nav
        ref={navRef}
        className={`navbar fixed top-0 w-full z-50 backdrop-blur-sm transition-all duration-300 ${
          isDark
            ? "bg-[#121212] border-gray-800"
            : "bg-gradient-to-br from-blue-50 to-purple-50 border-gray-200"
        } border-b py-4 px-4 sm:px-6 lg:px-8`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
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

          <div className="hidden md:flex space-x-8 items-center">
            {navItems.map((item, index) => (
              <a
                key={index}
                //href={item.href}
                className={`nav-link cursor-pointer font-medium transition-all ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
                onMouseEnter={handleHover}
                onMouseLeave={handleHoverOut}
                onClick={()=> {if(pathname === "/"){scrollToHash(item.href)}else{router.push(`/$`)}}}
              >
                {item.name}
              </a>
            ))}
          </div>

          <div className="flex items-center space-x-4">
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
              onMouseEnter={(e) =>
                gsap.to(e.target, {
                  duration: 0.3,
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)",
                  ease: "power2.out",
                })
              }
              onMouseLeave={(e) =>
                gsap.to(e.target, {
                  duration: 0.3,
                  scale: 1,
                  boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.2)",
                  ease: "power2.out",
                })
              }
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
