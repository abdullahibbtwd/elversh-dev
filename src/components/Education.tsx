/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTheme } from '@/app/context/ThemeContext';
import { ChevronDown, ChevronUp, GraduationCap, Award, ExternalLink, X, ZoomIn, MoveLeft, MoveRight } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/../convex/_generated/api';

const EducationSection = () => {
  const sectionRef = useRef(null);
  const { isDark } = useTheme();
  const [expandedEducation, setExpandedEducation] = useState<number | null>(null);
  const [expandedCert, setExpandedCert] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxCert, setLightboxCert] = useState<any>(null);

  // Fetch data from Convex
  const educationData = useQuery(api.homePage.getEducation) || [];
  const certificates = useQuery(api.homePage.getCertificates) || [];

  // Animation setup
  useEffect(() => {
    const currentSectionRef = sectionRef.current;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const elements = entry.target.querySelectorAll('.section-heading, .section-subtitle, .education-card, .cert-card');
          elements.forEach((el, index) => {
            setTimeout(() => {
              el.classList.add('animate-fade-in-up');
            }, index * 100);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '50px' });
    
    if (currentSectionRef) {
      observer.observe(currentSectionRef);
    }
    
    return () => {
      if (currentSectionRef) {
        observer.unobserve(currentSectionRef);
      }
    };
  }, []);

  const toggleEducation = (index: number) => {
    if (expandedEducation === index) {
      setExpandedEducation(null);
    } else {
      setExpandedEducation(index);
    }
  };

  const toggleCert = (index: number) => {
    if (expandedCert === index) {
      setExpandedCert(null);
    } else {
      setExpandedCert(index);
    }
  };

  const openLightbox = (cert: any) => {
    setLightboxCert(cert);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    const currentIndex = certificates.findIndex(c => c._id === lightboxCert._id);
    let newIndex = 0;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % certificates.length;
    } else {
      newIndex = (currentIndex - 1 + certificates.length) % certificates.length;
    }
    
    setLightboxCert(certificates[newIndex]);
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Helper function to get proper image URL
  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null;
    
    // If it's already an absolute URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // If it's a relative path, add leading slash for public folder
    if (!imagePath.startsWith('/')) {
      return `/${imagePath}`;
    }
    
    return imagePath;
  };

  return (
    <div 
      ref={sectionRef}
      id="education"
      className={`py-24 transition-colors duration-300 ${
        isDark 
          ? "bg-[#0e0e0e] text-gray-100" 
          : "bg-gradient-to-br from-indigo-50 to-teal-50 text-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="section-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Education & <span className="text-blue-500">Certificates</span>
          </h2>
          <p className="section-subtitle text-lg max-w-2xl mx-auto">
            My academic background and professional certifications
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full mt-6"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Education Column */}
          <div>
            <div className="flex items-center mb-8">
              <GraduationCap className="text-blue-500 mr-3" size={28} />
              <h3 className="text-2xl font-bold">Education</h3>
            </div>

            <div className="space-y-8">
              {educationData.length === 0 ? (
                <div className={`text-center py-12 rounded-2xl ${
                  isDark ? "bg-gray-900 border border-gray-800" : "bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-800"
                }`}>
                  <GraduationCap className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    No education records available
                  </p>
                </div>
              ) : (
                educationData.map((edu, index) => (
                  <div 
                    key={edu._id}
                    className={`education-card rounded-2xl overflow-hidden transition-all duration-300 ${
                      isDark 
                        ? "bg-gray-900 border border-gray-800" 
                        : "bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-800"
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex items-start">
                        <div className="mr-4 mt-1">
                          {edu.logo && getImageUrl(edu.logo) ? (
                            <div className="w-12 h-12 bg-white rounded-xl p-1">
                              <Image 
                                src={getImageUrl(edu.logo)!} 
                                alt={edu.institution} 
                                width={48}
                                height={48}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          ) : (
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-xl font-bold">{edu.degree} In {edu.field}</h4>
                              <p className={`font-medium ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                                {edu.institution}
                              </p>
                            </div>
                            {edu.gpa && (
                              <div className={`text-sm px-3 py-1 rounded-full ${
                                isDark ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-800"
                              }`}>
                                GPA: {edu.gpa}
                              </div>
                            )}
                          </div>
                          
                          <div className={`mt-3 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                            <span className="mr-4">📅 {formatDate(edu.startDate)} - {formatDate(edu.endDate)}</span>
                          </div>
                          
                          {edu.description && (
                            <p className={`mt-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                              {edu.description}
                            </p>
                          )}
                          
                          <button 
                            onClick={() => toggleEducation(index)}
                            className={`flex items-center mt-4 text-blue-500 font-medium ${
                              isDark ? "hover:text-blue-400" : "hover:text-blue-600"
                            } transition-colors`}
                          >
                            {expandedEducation === index ? (
                              <>
                                Show less <ChevronUp className="ml-1" size={18} />
                              </>
                            ) : (
                              <>
                                View details <ChevronDown className="ml-1" size={18} />
                              </>
                            )}
                          </button>
                          
                          {expandedEducation === index && (
                            <div className="mt-6 space-y-6">
                              {edu.achievements.length > 0 && (
                                <div>
                                  <h5 className={`font-semibold mb-2 ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                                    Key Achievements
                                  </h5>
                                  <ul className={`space-y-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                                    {edu.achievements.map((achievement, idx) => (
                                      <li key={idx} className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>{achievement}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {edu.courses.length > 0 && (
                                <div>
                                  <h5 className={`font-semibold mb-2 ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                                    Relevant Courses
                                  </h5>
                                  <div className="flex flex-wrap gap-2">
                                    {edu.courses.map((course, idx) => (
                                      <span
                                        key={idx}
                                        className={`px-3 py-1 rounded-full text-sm ${
                                          isDark
                                            ? "bg-gray-800 text-gray-300"
                                            : "bg-blue-100 text-blue-800"
                                        }`}
                                      >
                                        {course}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Certificates Column */}
          <div>
            <div className="flex items-center mb-8">
              <Award className="text-blue-500 mr-3" size={28} />
              <h3 className="text-2xl font-bold">Certificates</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.length === 0 ? (
                <div className={`col-span-2 text-center py-12 rounded-2xl ${
                  isDark ? "bg-gray-900 border border-gray-800" : "bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-800"
                }`}>
                  <Award className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    No certificates available
                  </p>
                </div>
              ) : (
                certificates.map((cert, index) => (
                  <div 
                    key={cert._id}
                    className={`cert-card rounded-2xl h-max overflow-hidden transition-all duration-300 ${
                      isDark 
                        ? "bg-gray-900 border border-gray-800 hover:border-blue-500/30" 
                        : "bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-800 hover:border-blue-500"
                    } group`}
                  >
                    <div className="p-5">
                      <div className="flex items-start mb-4">
                        <div className="mr-4">
                          {cert.image && getImageUrl(cert.image) ? (
                            <div className="w-10 h-10 bg-white rounded-xl p-1">
                              <Image 
                                src={getImageUrl(cert.image)!} 
                                alt={cert.title} 
                                width={40}
                                height={40}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          ) : (
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold">{cert.title}</h4>
                          <p className={`text-sm ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                            {cert.issuer}
                          </p>
                        </div>
                      </div>
                      
                      {cert.description && (
                        <p className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                          {cert.description}
                        </p>
                      )}
                      
                      {cert.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {cert.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className={`px-2 py-1 rounded text-xs ${
                                isDark
                                  ? "bg-blue-900/30 text-blue-400"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center mt-4">
                        <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}>
                          🗓️ {formatDate(cert.issueDate)}
                        </span>
                        
                        <div className="flex space-x-2">
                          {cert.image && (
                            <button 
                              onClick={() => openLightbox(cert)}
                              className={`p-2 rounded-full ${
                                isDark 
                                  ? "bg-gray-800 hover:bg-gray-700" 
                                  : "bg-blue-100 hover:bg-blue-200"
                              } transition-colors`}
                              aria-label="View certificate"
                            >
                              <ZoomIn size={18} />
                            </button>
                          )}
                          
                          {cert.credentialLink && (
                            <a 
                              href={cert.credentialLink} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`p-2 rounded-full ${
                                isDark 
                                  ? "bg-gray-800 hover:bg-gray-700" 
                                  : "bg-blue-100 hover:bg-blue-200"
                              } transition-colors`}
                              aria-label="Verify credential"
                            >
                              <ExternalLink size={18} />
                            </a>
                          )}
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => toggleCert(index)}
                        className={`w-full mt-4 flex items-center justify-center text-blue-500 font-medium text-sm ${
                          isDark ? "hover:text-blue-400" : "hover:text-blue-600"
                        } transition-colors`}
                      >
                        {expandedCert === index ? (
                          <>
                            Show less <ChevronUp className="ml-1" size={16} />
                          </>
                        ) : (
                          <>
                            View details <ChevronDown className="ml-1" size={16} />
                          </>
                        )}
                      </button>
                      
                      {expandedCert === index && (
                        <div className={`mt-4 pt-4 border-t ${
                          isDark ? "border-gray-800" : "border-gray-200"
                        }`}>
                          <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                            This certification demonstrates expertise in {cert.skills.join(', ')}. 
                            It was earned after completing rigorous training and passing a comprehensive exam.
                          </p>
                          {cert.expiryDate && (
                            <p className={`text-sm mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                              Expires: {formatDate(cert.expiryDate)}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
      {lightboxOpen && lightboxCert && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div 
            className="max-w-4xl w-full max-h-[90vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white p-2 rounded-full hover:bg-white/10 transition-colors z-10"
              aria-label="Close lightbox"
            >
              <X size={32} />
            </button>
            
            <div className="relative bg-gray-800 rounded-xl overflow-hidden">
              {lightboxCert.image && getImageUrl(lightboxCert.image) ? (
                <Image 
                  src={getImageUrl(lightboxCert.image)!} 
                  alt={lightboxCert.title}
                  width={800}
                  height={600}
                  className="w-full h-[70vh] object-contain"
                />
              ) : (
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-[70vh]" />
              )}
              
              {certificates.length > 1 && (
                <>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateLightbox('prev');
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    aria-label="Previous certificate"
                  >
                    <MoveLeft size={28} />
                  </button>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateLightbox('next');
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    aria-label="Next certificate"
                  >
                    <MoveRight size={28} />
                  </button>
                  
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
                    {certificates.findIndex(c => c._id === lightboxCert._id) + 1} / {certificates.length}
                  </div>
                </>
              )}
            </div>
            
            <div className="mt-6 text-center">
              <h3 className="text-xl font-bold text-white">{lightboxCert.title}</h3>
              <p className="text-blue-400">{lightboxCert.issuer}</p>
              <p className="text-gray-400 mt-2">{lightboxCert.description}</p>
              
              {lightboxCert.credentialLink && (
                <a 
                  href={lightboxCert.credentialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-4 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Verify credential <ExternalLink className="ml-1" size={18} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationSection;