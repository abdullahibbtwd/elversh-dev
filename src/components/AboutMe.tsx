"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import { useTheme } from "@/app/context/ThemeContext";
import {
  Briefcase,
  Folder,
  Lightbulb,
  MessageCircle,
  RefreshCw,
  Brain,
  Clock,
  Users,
  Palette,
  Search,
  BookOpen,
  Award,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const AboutMeSection = () => {
  const aboutRef = useRef(null);
  const { isDark } = useTheme();
  const [imageError, setImageError] = useState(false);
  
  // Add timeout protection for Convex query
  const aboutData = useQuery(api.homePage.getAboutSection);

  useEffect(() => {
    // Animation for when section comes into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.from(".about-heading", {
              duration: 0.8,
              y: 30,
              opacity: 0,
              ease: "power3.out",
            });

            gsap.from(".about-content", {
              duration: 1,
              y: 30,
              opacity: 0,
              stagger: 0.1,
              delay: 0.3,
              ease: "power3.out",
            });

            gsap.from(".skill-item", {
              duration: 0.7,
              y: 20,
              opacity: 1,
              stagger: 0.1,
              delay: 0.5,
              ease: "power3.out",
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    const currentRef = aboutRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Handle image loading error
  const handleImageError = () => {
    setImageError(true);
  };

  // Show loading state while data is being fetched
  if (aboutData === undefined) {
    return (
      <div
        id="aboutme"
        className={`py-24 transition-colors duration-300 ${
          isDark
            ? "bg-[#0a0a0a] text-gray-100"
            : "bg-gradient-to-br from-blue-50 to-purple-50 text-gray-800"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              About <span className="text-blue-500">Me</span>
            </h2>
            <div className="w-24 h-1  bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={aboutRef}
      id="aboutme"
      className={`py-24 transition-colors duration-300 ${
        isDark
          ? "bg-[#0a0a0a] text-gray-100"
          : "bg-gradient-to-br from-blue-50 to-purple-50 text-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="about-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            About <span className="text-blue-500">Me</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content - Image */}
          <div className="relative">
            <div className="relative w-full max-w-md mx-auto">
              {/* Animated Blobs */}
              <div className="absolute -top-6 -left-6 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10 animate-blob"></div>
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000"></div>

              <div className="relative rounded-2xl overflow-hidden border-8 border-white dark:border-gray-800 shadow-2xl">
                <div
                  className={`h-96 flex items-center justify-center ${
                    isDark ? "bg-gray-800" : "bg-gradient-to-br from-blue-50 to-purple-50"
                  } rounded-xl`}
                >
                  <div className="w-7/10 h-8/10 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg">
                    {aboutData?.profileImageUrl && !imageError ? (
                      <Image
                        src={aboutData.profileImageUrl}
                        alt="Profile picture"
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                        priority
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center ${
                        isDark ? "bg-gray-700" : "bg-gradient-to-br from-blue-50 to-purple-50"
                      }`}>
                        <div className="text-4xl font-bold text-gray-400">
                          {aboutData?.heading?.charAt(0) || "A"}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Experience Cards */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className={`p-6 rounded-xl shadow-lg transition-transform hover:-translate-y-1 ${
                  isDark
                    ? "bg-gray-800 border border-gray-700"
                    : "bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200"
                }`}
              >
                <div className="flex items-start">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                      isDark ? "bg-blue-900/30" : "bg-blue-100"
                    }`}
                  >
                    <Briefcase className="text-blue-500" size={24} />
                  </div>
                  <div>
                    <div className="text-xl font-bold mb-1">
                      {aboutData?.experience || "3"}+ Years
                    </div>
                    <div className="text-sm">Experience</div>
                  </div>
                </div>
              </div>

              <div
                className={`p-6 rounded-xl shadow-lg transition-transform hover:-translate-y-1 ${
                  isDark
                    ? "bg-gray-800 border border-gray-700"
                    : "bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200"
                }`}
              >
                <div className="flex items-start">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                      isDark ? "bg-blue-900/30" : "bg-blue-100"
                    }`}
                  >
                    <Folder className="text-blue-500" size={24} />
                  </div>
                  <div>
                    <div className="text-xl font-bold mb-1">
                      {aboutData?.projects || "50"}+ Projects
                    </div>
                    <div className="text-sm">Completed</div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`p-6 rounded-xl mt-10 ${
                isDark
                  ? "bg-gray-800/50 border border-gray-700"
                  : "bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200"
              }`}
            >
              <h4 className="text-xl font-bold mb-4">Personal Information</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex">
                  <span className="font-medium w-28">Name:</span>
                  <span>Abdullahi Bashir Baba</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-28">Email:</span>
                  <span>elvershdev@gmail.com</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-28">Location:</span>
                  <span>Abuja,Nigeria</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-28">Availability:</span>
                  <span>{aboutData?.available || "Available"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - About Text */}
          <div className="about-content">
            <h3 className="text-2xl md:text-3xl font-bold mb-6">
              {aboutData?.heading || "Passionate Full-Stack Developer"}
            </h3>

            <p
              className={`mb-6 text-lg leading-relaxed ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {aboutData?.description1 || "I'm a dedicated full-stack developer with a passion for creating innovative web solutions. With expertise in modern technologies, I bring ideas to life through clean, efficient code and user-centric design."}
            </p>

            <p
              className={`mb-8 text-lg leading-relaxed ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {aboutData?.description2 || "My journey in web development has equipped me with the skills to build scalable applications that deliver exceptional user experiences. I'm always eager to learn new technologies and take on challenging projects."}
            </p>

            {/* Skills Section */}
            <div className="mb-10">
              <h4 className="text-xl font-bold mb-4">Essential Soft Skills</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    name: "Problem Solving",
                    description:
                      "Analyzing complex issues and developing effective solutions",
                    icon: <Lightbulb className="text-blue-500" size={24} />,
                  },
                  {
                    name: "Communication",
                    description:
                      "Clearly articulating technical concepts to diverse audiences",
                    icon: <MessageCircle className="text-blue-500" size={24} />,
                  },
                  {
                    name: "Adaptability",
                    description:
                      "Quickly learning new technologies and adjusting to changing requirements",
                    icon: <RefreshCw className="text-blue-500" size={24} />,
                  },
                  {
                    name: "Critical Thinking",
                    description:
                      "Evaluating information objectively to make sound decisions",
                    icon: <Brain className="text-blue-500" size={24} />,
                  },
                  {
                    name: "Time Management",
                    description:
                      "Prioritizing tasks and meeting deadlines effectively",
                    icon: <Clock className="text-blue-500" size={24} />,
                  },
                  {
                    name: "Collaboration",
                    description:
                      "Working effectively in team environments and cross-functional groups",
                    icon: <Users className="text-blue-500" size={24} />,
                  },
                  {
                    name: "Creativity",
                    description:
                      "Developing innovative solutions to technical challenges",
                    icon: <Palette className="text-blue-500" size={24} />,
                  },
                  {
                    name: "Attention to Detail",
                    description:
                      "Ensuring precision in code implementation and testing",
                    icon: <Search className="text-blue-500" size={24} />,
                  },
                  {
                    name: "Continuous Learning",
                    description:
                      "Constantly updating skills and knowledge in evolving tech landscape",
                    icon: <BookOpen className="text-blue-500" size={24} />,
                  },
                  {
                    name: "Leadership",
                    description:
                      "Guiding projects and mentoring junior developers",
                    icon: <Award className="text-blue-500" size={24} />,
                  },
                ].map((skill, index) => (
                  <div
                    key={index}
                    className={`skill-item flex items-start p-4 rounded-xl transition-all hover:scale-[1.02] ${
                      isDark
                        ? "bg-gray-800/50 border border-gray-700 hover:border-blue-500/50"
                        : "bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg mr-4 ${
                        isDark ? "bg-blue-900/30" : "bg-blue-100"
                      }`}
                    >
                      {skill.icon}
                    </div>
                    <div>
                      <h5 className="font-bold text-lg mb-1">{skill.name}</h5>
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {skill.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Personal Info */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMeSection;
