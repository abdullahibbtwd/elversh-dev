/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useRef, useMemo } from 'react';
import gsap from "gsap";
import { useTheme } from '@/app/context/ThemeContext';
import { 
  LayoutDashboard, 
  ServerCog, 
  Database, 
  Cpu, 
  Cloud, 
  Code2,
  GitBranch,
  TestTube2,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/../convex/_generated/api';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "Frontend": <LayoutDashboard className="text-blue-500" size={32} />,
  "Backend": <ServerCog className="text-blue-500" size={32} />,
  "Database": <Database className="text-blue-500" size={32} />,
  "Tools/Technologies": <Cpu className="text-blue-500" size={32} />,
  "DevOps/Deployment": <Cloud className="text-blue-500" size={32} />,
  "Testing": <TestTube2 className="text-blue-500" size={32} />,
  "Other": <Code2 className="text-blue-500" size={32} />,
};

const CATEGORY_ORDER = [
  "Frontend",
  "Backend",
  "Database",
  "Tools/Technologies",
  "DevOps/Deployment",
  "Testing",
  "Other"
];

const SkillsSection = () => {
  const skillsRef = useRef(null);
  const { isDark } = useTheme();
  const skillsRaw = useQuery(api.homePage.getSkills);

  useEffect(() => {
    gsap.set(".skills-heading, .skills-subtitle, .skill-category", {
      opacity: 0,
      y: 30
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.to(".skills-heading", {
            duration: 0.8,
            y: 0,
            opacity: 1,
            ease: "power3.out"
          });
          gsap.to(".skills-subtitle", {
            duration: 0.8,
            y: 0,
            opacity: 1,
            delay: 0.2,
            ease: "power3.out"
          });
          gsap.to(".skill-category", {
            duration: 0.7,
            y: 0,
            opacity: 1,
            stagger: 0.1,
            delay: 0.4,
            ease: "power3.out"
          });
        } else {
          gsap.set(".skills-heading, .skills-subtitle, .skill-category", {
            opacity: 0,
            y: 30
          });
        }
      });
    }, { threshold: 0.1 });
    if (skillsRef.current) {
      observer.observe(skillsRef.current);
    }
    return () => {
      if (skillsRef.current) {
        observer.unobserve(skillsRef.current);
      }
    };
  }, []);

  // Group skills by category
  const groupedSkills = useMemo(() => {
    const skills = skillsRaw || [];
    const groups: Record<string, typeof skills> = {};
    for (const skill of skills) {
      if (!groups[skill.category]) groups[skill.category] = [];
      groups[skill.category].push(skill);
    }
    return groups;
  }, [skillsRaw]);

  return (
    <div 
      ref={skillsRef}
      id="skills"
      className={`py-24 transition-colors duration-300 ${
        isDark 
          ? "bg-[#000000] text-gray-100" 
          : "bg-gradient-to-br from-blue-50 to-purple-50 text-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="skills-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Technical <span className="text-blue-500">Skills</span>
          </h2>
          <p className="skills-subtitle text-lg max-w-2xl mx-auto">
            Expertise across the full development stack with years of hands-on experience
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full mt-6"></div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {CATEGORY_ORDER.map((category) => (
            groupedSkills[category] && groupedSkills[category].length > 0 && (
              <div 
                key={category}
                className={`skill-category group p-6 rounded-2xl transition-all duration-300 hover:-translate-y-2 ${
                  isDark 
                    ? "bg-gray-900 border border-gray-800 hover:border-blue-500/50" 
                    : "bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200 hover:border-blue-300"
                }`}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                  isDark ? "bg-blue-900/30" : "bg-blue-100"
                }`}>
                  {CATEGORY_ICONS[category]}
                </div>
                <h3 className="text-xl font-bold mb-5 group-hover:text-blue-500 transition-colors">
                  {category}
                </h3>
                <ul className="space-y-3">
                  {groupedSkills[category].map((skill) => (
                    <li 
                      key={skill._id} 
                      className="flex justify-between items-center py-1 border-b border-gray-700/30"
                    >
                      <div className="flex items-center gap-2">
                        {skill.image && (
                          <img 
                            src={skill.image} 
                            alt={skill.name} 
                            className="w-6 h-6 object-contain"
                          />
                        )}
                        <span className="font-medium">{skill.name}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        isDark 
                          ? "bg-blue-900/40 text-blue-300" 
                          : "bg-blue-100 text-blue-700"
                      } opacity-0 group-hover:opacity-100 transition-opacity`}>
                        {skill.years}+ {skill.years === 1 ? "year" : "years"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          ))}
        </div>

        {/* Complementary Skills */}
        <div className={`mt-16 p-8 rounded-2xl ${
          isDark 
            ? "bg-gray-900/50 border border-gray-800" 
            : "bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200"
        }`}>
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-center">
              Complementary Skills
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { name: "Responsive Design", icon: <LayoutDashboard className="text-blue-500" size={20} /> },
                { name: "API Integration", icon: <ServerCog className="text-blue-500" size={20} /> },
                { name: "Performance Optimization", icon: <Zap className="text-blue-500" size={20} /> },
                { name: "Version Control", icon: <GitBranch className="text-blue-500" size={20} /> },
                { name: "Security Best Practices", icon: <ShieldCheck className="text-blue-500" size={20} /> }
              ].map((item, index) => (
                <div 
                  key={index}
                  className={`flex items-center px-4 py-2 rounded-full ${
                    isDark 
                      ? "bg-gray-800/50 hover:bg-gray-800" 
                      : "bg-gradient-to-br from-blue-50 to-purple-50 hover:bg-blue-100"
                  } transition-colors`}
                >
                  <div className="mr-2">{item.icon}</div>
                  <span className="font-medium text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsSection;