/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useTheme } from "@/app/context/ThemeContext";
import { LaptopMinimal, ServerCog } from "lucide-react";
import { usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const Hero = () => {
  const heroRef = useRef(null);
  const { isDark, router } = useTheme();
  const pathname = usePathname();

  const Hompage = useQuery(api.homePage.getHomePageContent)
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

    const tl = gsap.timeline();
    tl.from(".navbar", {
      duration: 0.8,
      y: -50,
      opacity: 0,
      ease: "power3.out",
    })
      .from(
        ".hero-heading",
        { duration: 1, y: 30, opacity: 0, ease: "power3.out" },
        0.3
      )
      .from(
        ".hero-subtitle",
        { duration: 1, y: 30, opacity: 0, ease: "power3.out" },
        0.5
      )
      .from(
        ".hero-buttons button",
        {
          duration: 1,
          y: 30,
          opacity: 0,
          stagger: 0.1,
          ease: "power3.out",
        },
        0.7
      )
      .from(
        ".stats-grid > div",
        {
          duration: 1,
          y: 30,
          opacity: 0,
          stagger: 0.1,
          ease: "power3.out",
        },
        0.9
      )
      .to(
        ".developer-illustration",
        {
          y: 10,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        },
        0.5
      );

    // Floating blob animations
    gsap.to(".blob-purple", {
      x: 20,
      y: -20,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to(".blob-blue", {
      x: -15,
      y: 15,
      duration: 7,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to(".blob-pink", {
      x: 10,
      y: -15,
      duration: 9,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

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
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-[#121212] text-gray-100"
          : "bg-gradient-to-br from-blue-50 to-purple-50 text-gray-800"
      }`}
    >
      {/* Hero Section */}
      <div className="max-w-7xl mt-10 md:mt-0 px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="hero-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Building <span className="text-blue-500">Impactful</span>
              <br />
              Digital Experience
              <br />
              for the web.
            </h1>

            <p className="hero-subtitle mt-6 text-lg max-w-2xl">
            From concept to deployment, I bring together innovation, strategy, and technology to create impactful web applications that solve real-world problems.
            </p>

            <div className="hero-buttons  mt-8 flex flex-wrap gap-4">
              <button
                onClick={handleProjectClick}
                className="px-6 py-3 cursor-pointer hover:scale-105  bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
              >
                View Projects
              </button>
              <button
              onClick={handleDownloadCV}
                className={`px-6 py-3 cursor-pointer font-medium rounded-lg  ${
                  isDark
                    ? "bg-gray-800 border border-gray-700 hover:bg-gray-700"
                    : "bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-300 hover:bg-gray-40"
                }`}
              >
                Download CV
              </button>
            </div>

            <div className="stats-grid mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <div className="blob-purple absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 dark:opacity-20" />
              <div className="blob-blue absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 dark:opacity-20" />
              <div className="blob-pink absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 dark:opacity-20" />

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
                         <img
                          src={Hompage?.heroImageUrl || ""}
                          alt="pic"
                          className="rounded-full w-full h-full"
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

                    <i />
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
  );
};

export default Hero;
