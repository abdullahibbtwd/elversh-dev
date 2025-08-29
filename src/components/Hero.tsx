"use client";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@/app/context/ThemeContext";
import { LaptopMinimal, ServerCog } from "lucide-react";
import { usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {FaGithubSquare  } from "react-icons/fa";
import Image from 'next/image';

const Hero = () => {
  const heroRef = useRef(null);
  const { isDark, router, isLoading } = useTheme();
  const pathname = usePathname();
  const [animationsLoaded, setAnimationsLoaded] = useState(false);

  const Hompage = useQuery(api.homePage.getHomePageContent);

  const cvUrl = useQuery(
    api.files.getFileUrl, 
    Hompage?.cvFile ? { storageId: Hompage.cvFile } : "skip"
  );

  const handleDownloadCV = async () => {
    if (!Hompage?.cvFile) return;
    if (!cvUrl) return;
    const link = document.createElement('a');
    link.href = cvUrl;
    link.download = 'CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (isLoading || animationsLoaded) return;

    // Lazy load GSAP only when needed
    const loadAnimations = async () => {
      const { gsap } = await import('gsap');
      
      const tl = gsap.timeline();
      tl.from(".navbar", {
        duration: 0.6,
        y: -30,
        opacity: 0,
        ease: "power2.out",
      })
        .fromTo(".hero-heading", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, 0.2)
        .fromTo(".hero-subtitle", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, 0.4)
        .fromTo(".hero-buttons button", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }, 0.6)
        .fromTo(".stats-grid > div", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "power2.out" }, 0.8);

      // Simplified floating animation
      gsap.to(".developer-illustration", {
        y: 8,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Reduced blob animations
      gsap.to(".blob-purple", {
        x: 15,
        y: -15,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".blob-blue", {
        x: -10,
        y: 10,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      setAnimationsLoaded(true);
    };

    // Delay animation loading to prioritize content rendering
    const timer = setTimeout(loadAnimations, 100);
    return () => clearTimeout(timer);
  }, [isLoading, animationsLoaded]);

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
        const element = document.getElementById(hash.substring(1));
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

  const handleProjectClick = () => {
    const targetHash = "#projects";
    if (pathname === "/") {
      scrollToHash(targetHash);
    } else {
      router.push(`/${targetHash}`);
    }
  };

  return (
    <div
      ref={heroRef}
      id="home"
      className={`w-full min-h-screen flex items-center justify-center transition-colors duration-300 ${
        isDark
          ? "bg-[#121212] text-gray-100"
          : "bg-gradient-to-br from-blue-50 to-purple-50 text-gray-800"
      }`}
    >
      {!isLoading && (
        <div className="w-full flex justify-center">
          <div className="w-full max-w-7xl mt-10 md:mt-0 px-4 sm:px-6 lg:px-8 py-12 md:py-24 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div>
                <h1 className="hero-heading opacity-0 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Building <span className="text-blue-500">Impactful</span>
                  <br />
                  Digital Experience
                  <br />
                  for the web.
                </h1>

                <p className="hero-subtitle opacity-0 mt-6 text-lg max-w-2xl">
                  From concept to deployment, I bring together innovation, strategy, and technology to create impactful web applications that solve real-world problems.
                </p>

                <div className="hero-buttons mt-8 flex flex-wrap gap-4">
                  <button
                    onClick={handleProjectClick}
                    className="px-6 py-3 cursor-pointer hover:scale-105 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 opacity-0"
                  >
                    View Projects
                  </button>
                  <button
                    onClick={handleDownloadCV}
                    className={`px-6 py-3 cursor-pointer font-medium rounded-lg ${
                      isDark
                        ? "bg-gray-800 border border-gray-700 hover:bg-gray-700"
                        : "bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-300 hover:bg-gray-40"
                    } opacity-0`}
                  >
                    Download CV
                  </button>
                  <a 
                    href="https://github.com/abdullahibbtwd" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`p-2 rounded-full transition-all ${
                      isDark 
                        ? "bg-gray-800 hover:bg-gray-700" 
                        : "bg-gradient-to-br from-blue-50 to-purple-50 hover:bg-gray-100"
                    } shadow-md hover:shadow-lg items-center justify-center flex transform hover:-translate-y-1`}
                  >
                    <FaGithubSquare size={25} />
                  </a>
                </div>

                <div className="stats-grid mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div
                    className={`p-4 rounded-lg shadow-sm ${
                      isDark
                        ? "bg-gray-800 border border-gray-700"
                        : "bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200"
                    }`}
                  >
                    <div className="text-2xl font-bold text-blue-500">{Hompage?.projectsCount}</div>
                    <div className="text-sm">Projects</div>
                  </div>
                  <div
                    className={`p-4 rounded-lg shadow-sm ${
                      isDark
                        ? "bg-gray-800 border border-gray-700"
                        : "bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200"
                    }`}
                  >
                    <div className="text-2xl font-bold text-">{Hompage?.yearsExperience}</div>
                    <div className="text-sm">Years</div>
                  </div>
                  <div
                    className={`p-4 rounded-lg shadow-sm ${
                      isDark
                        ? "bg-gray-800 border border-gray-700"
                        : "bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200"
                    }`}
                  >
                    <div className="text-2xl font-bold text-blue-500">{Hompage?.satisfaction}</div>
                    <div className="text-sm">Satisfaction</div>
                  </div>
                  <div
                    className={`p-4 rounded-lg shadow-sm ${
                      isDark
                        ? "bg-gray-800 border border-gray-700"
                        : "bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200"
                    }`}
                  >
                    <div className="text-2xl font-bold text-blue-500">{Hompage?.support}</div>
                    <div className="text-sm">Support</div>
                  </div>
                </div>
              </div>

              {/* Right Content - Developer Illustration */}
              <div className="relative">
                <div className="relative w-full max-w-lg mx-auto">
                  {/* Animated Blobs */}
                  <div className="blob-purple absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-15" />
                  <div className="blob-blue absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-15" />

                  {/* Developer Illustration */}
                  <div className="developer-illustration relative rounded-2xl overflow-hidden border-8 border-white dark:border-gray-800 shadow-2xl">
                    <div
                      className={`h-96 flex items-center justify-center ${
                        isDark
                          ? "bg-gray-800 border-2 border-dashed border-gray-700"
                          : "bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-dashed border-gray-300"
                      } rounded-xl`}
                    >
                      <div className="text-center p-8">
                        <div
                          className={`w-32 h-32 md:w-52 md:h-52 rounded-full mx-auto mb-6 flex items-center justify-center ${
                            isDark ? "bg-gray-700" : "bg-gray-300"
                          }`}
                        >
                          <div className="text-blue-500 text-5xl">
                            {Hompage?.heroImageUrl && (
                              <Image
                                src={Hompage?.heroImageUrl || ""}
                                alt="pic"
                                className="rounded-full w-full h-full object-cover"
                                width={200}
                                height={200}
                                priority
                                placeholder="blur"
                                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                              />
                            )}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                          {Hompage?.role}
                        </h3>
                        <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                          {Hompage?.roleDescription}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`p-4 rounded-lg shadow-sm transition-transform hover:-translate-y-1 ${
                      isDark
                        ? "bg-gray-800 border border-gray-700"
                        : "bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200"
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full mr-3 flex items-center justify-center ${
                          isDark ? "bg-blue-900" : "bg-blue-100"
                        }`}
                      >
                        <ServerCog className="text-blue-500" />
                      </div>
                      <div>
                        <div className="font-medium">Backend</div>
                        <div className="text-sm">{Hompage?.backendSkills}</div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`p-4 rounded-lg shadow-sm transition-transform hover:-translate-y-1 ${
                      isDark
                        ? "bg-gray-800 border border-gray-700"
                        : "bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200"
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full mr-3 flex items-center justify-center ${
                          isDark ? "bg-blue-900" : "bg-blue-100"
                        }`}
                      >
                        <LaptopMinimal className="text-blue-500" />
                      </div>
                      <div>
                        <div className="font-medium">Frontend</div>
                        <div className="text-sm">{Hompage?.frontendSkills}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
