"use client";
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useTheme } from '@/app/context/ThemeContext';
import { ChevronDown, ChevronUp, Briefcase, Calendar, ExternalLink } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/../convex/_generated/api';

const URL_REGEX = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

function Text({ content, className = "" }: { content: string, className?: string }) {
  const words = content.split(" ");
  return (
    <span className={`whitespace-pre-line break-words text-xs md:text-md  tracking-tight ${className}`}>
      {words.map((word: string, index: number) => {
        return word.match(URL_REGEX) ? (
          <a key={index} className="text-blue-900" href={word}>
            {word}
          </a>
        ) : (
          word + " "
        );
      })}
    </span>
  );
}
const ExperienceSection = () => {
  const experienceRef = useRef(null);
  const { isDark } = useTheme();
  const [expandedExperience, setExpandedExperience] = useState<number | null>(null);

  // Fetch data from Convex
  const workExperiences = useQuery(api.homePage.getWorkExperience) || [];
  const skills = useQuery(api.homePage.getSkills) || [];

  // Get skill image by name
  const getSkillImage = (skillName: string) => {
    const skill = skills.find(s => s.name === skillName);
    return skill?.image || null;
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };


  const calculateDuration = (start: string, end: string | null) => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    
    let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    months -= startDate.getMonth();
    months += endDate.getMonth();
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    return `${years > 0 ? `${years} yr${years > 1 ? 's' : ''} ` : ''}${remainingMonths > 0 ? `${remainingMonths} mo${remainingMonths > 1 ? 's' : ''}` : ''}`;
  };

  // Animation setup
  useEffect(() => {
    gsap.set(".experience-heading, .experience-subtitle, .experience-card", {
      opacity: 0,
      y: 40
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.to(".experience-heading", {
            duration: 0.8,
            y: 0,
            opacity: 1,
            ease: "power3.out"
          });
          
          gsap.to(".experience-subtitle", {
            duration: 0.8,
            y: 0,
            opacity: 1,
            delay: 0.2,
            ease: "power3.out"
          });
          
          gsap.to(".experience-card", {
            duration: 0.7,
            y: 0,
            opacity: 1,
            stagger: 0.15,
            delay: 0.4,
            ease: "power3.out"
          });
        } else {
          gsap.set(".experience-heading, .experience-subtitle, .experience-card", {
            opacity: 0,
            y: 40
          });
        }
      });
    }, { threshold: 0.1 });
    
    if (experienceRef.current) {
      observer.observe(experienceRef.current);
    }
    
    return () => {
      if (experienceRef.current) {
        observer.unobserve(experienceRef.current);
      }
    };
  }, []);

  const toggleExpand = (index: number) => {
    if (expandedExperience === index) {
      setExpandedExperience(null);
    } else {
      setExpandedExperience(index);
    }
  };

  return (
    <div 
      ref={experienceRef}
      id="experience"
      className={`py-24 transition-colors duration-300 ${
        isDark 
          ? "bg-[#000000] text-gray-100" 
          : "bg-gradient-to-br from-blue-50 to-purple-50 text-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="experience-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Work <span className="text-blue-500">Experience</span>
          </h2>
          <p className="experience-subtitle text-lg max-w-2xl mx-auto">
            My professional journey and career milestones
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full mt-6"></div>
        </div>

        {/* Experience Timeline */}
        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className={`absolute left-5 md:left-1/2 top-0 h-full w-0.5 transform md:-translate-x-1/2 ${
            isDark ? "bg-gray-700" : "bg-blue-200"
          }`}></div>

          <div className="space-y-12 w-full flex justify-center flex-col items-center ml-4 md:ml-0">
            {workExperiences.length === 0 ? (
              <div className="text-center py-12 ">
                <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No work experience yet
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Work experience will appear here once added
                </p>
              </div>
            ) : (
              workExperiences.map((experience, index) => (
                <>
             
                <div 
                  key={index}
                  className={`experience-card w-9/10 md:w-7/10 rounded-2xl overflow-hidden transition-all duration-300 ${ 
                    isDark 
                      ? "bg-gray-900 border border-gray-800" 
                      : "bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200"
                  }`}
                >
                  {/* Timeline Dot */}
                  
                  <div className={`absolute -left-[30px] top-6 w-6 h-6 rounded-full flex items-center justify-center ${
                    isDark ? "bg-gray-900 border-2 border-blue-500" : "bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-500"
                  } z-10`}>
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                  </div>

                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start">
                      <div className="md:w-1/3 mb-4 md:mb-0">
                        <div className="flex items-center mb-2">
                          <Briefcase className="mr-2 text-blue-500" size={20} />
                          <h3 className="text-xl font-bold">{experience.position}</h3>
                        </div>
                        
                        <div className="flex items-center mb-3">
                          <Calendar className="mr-2 text-blue-500" size={18} />
                          <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                            {formatDate(experience.startDate)} - {formatDate(experience.endDate ?? null)}
                            <span className="mx-2">•</span>
                            <span>{calculateDuration(experience.startDate, experience.endDate ?? null)}</span>
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          {experience.companyLink && (
                            <a 
                              href={experience.companyLink ?? ""}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-center text-sm font-medium ${
                                isDark 
                                  ? "text-blue-400 hover:text-blue-300" 
                                  : "text-blue-600 hover:text-blue-700"
                              } transition-colors`}
                            >
                              {experience.company}
                              <ExternalLink className="ml-1" size={16} />
                            </a>
                          )}
                          {!experience.companyLink && (
                            <span className="text-sm font-medium">
                              {experience.company}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="md:w-2/3 md:pl-8">
                        <Text
                          content={expandedExperience === index ? experience.longDescription : experience.shortDescription}
                          className={`whitespace-pre-line break-words text-[16px] leading-tight font-normal ${isDark ? "text-gray-300" : "text-gray-600"}`}
                        />
                        
                        {expandedExperience === index && experience.achievements && (
                          <div className="mb-6">
                            <h4 className="font-semibold mb-2 text-blue-500">Key Achievements:</h4>
                            <ul className="list-disc pl-5 space-y-1">
                              {experience.achievements.map((achievement, idx) => (
                                <li 
                                  key={idx} 
                                  className={`${isDark ? "text-gray-300" : "text-gray-700"}`}
                                >
                                  {achievement}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <button 
                          onClick={() => toggleExpand(index)}
                          className={`flex items-center text-blue-500 font-medium mb-6 ${
                            isDark ? "hover:text-blue-400" : "hover:text-blue-600"
                          } transition-colors`}
                        >
                          {expandedExperience === index ? (
                            <>
                              Show less <ChevronUp className="ml-1" size={18} />
                            </>
                          ) : (
                            <>
                              Read more <ChevronDown className="ml-1" size={18} />
                            </>
                          )}
                        </button>
                        
                        {/* Technologies */}
                        <div className="mt-4">
                          <h4 className="font-medium mb-3 text-sm uppercase tracking-wider text-blue-500">
                            Technologies Used
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {experience.technologies.map((tech, idx) => {
                              const skillImage = getSkillImage(tech);
                              return (
                                <div
                                  key={idx}
                                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                                    isDark
                                      ? "bg-gray-800 text-gray-300"
                                      : "bg-gradient-to-br from-blue-50 to-purple-50 text-blue-800"
                                  }`}
                                >
                                  {skillImage && (
                                    <img 
                                      src={skillImage} 
                                      alt={tech} 
                                      className="w-4 h-4 object-contain"
                                    />
                                  )}
                                  <span>{tech}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                </>
                  
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceSection;