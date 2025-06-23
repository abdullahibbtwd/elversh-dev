/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useTheme } from '@/app/context/ThemeContext';
import { 
  ExternalLink, 
  Github, 
  ChevronDown, 
  ChevronUp,
  X,
  ZoomIn,
  MoveLeft,
  MoveRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/../convex/_generated/api';
import type { Id } from '@/../convex/_generated/dataModel';
import Image from 'next/image';

// ProjectImage component for handling Convex storage images
type ProjectImageProps = {
  storageId: Id<'_storage'>;
  alt?: string;
  className?: string;
};

const ProjectImage = ({ storageId, alt, className }: ProjectImageProps) => {
  const url = useQuery(api.files.getFileUrl, storageId ? { storageId } : 'skip');
  if (!url) return <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full" />;
  return <Image src={url} alt={alt} className={className} width={200} height={200} />;
};

const ProjectsSection = () => {
  const projectsRef = useRef(null);
  const { isDark } = useTheme();
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [currentProject, setCurrentProject] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  
  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Fetch data from Convex
  const projects = useQuery(api.homePage.getProjects) || [];
  const skills = useQuery(api.homePage.getSkills) || [];

  // Animation setup
  useEffect(() => {
    gsap.set(".projects-heading, .projects-subtitle, .project-card", {
      opacity: 0,
      y: 40
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.to(".projects-heading", {
            duration: 0.8,
            y: 0,
            opacity: 1,
            ease: "power3.out"
          });
          
          gsap.to(".projects-subtitle", {
            duration: 0.8,
            y: 0,
            opacity: 1,
            delay: 0.2,
            ease: "power3.out"
          });
          
          gsap.to(".project-card", {
            duration: 0.7,
            y: 0,
            opacity: 1,
            stagger: 0.15,
            delay: 0.4,
            ease: "power3.out"
          });
        } else {
          gsap.set(".projects-heading, .projects-subtitle, .project-card", {
            opacity: 0,
            y: 40
          });
        }
      });
    }, { threshold: 0.1 });
    
    if (projectsRef.current) {
      observer.observe(projectsRef.current);
    }
    
    return () => {
      if (projectsRef.current) {
        observer.unobserve(projectsRef.current);
      }
    };
  }, []);

  // Carousel navigation functions
  const nextSlide = () => {
    if (isTransitioning || projects.length === 0) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % projects.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevSlide = () => {
    if (isTransitioning || projects.length === 0) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + projects.length) % projects.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (projects.length <= 1) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          prevSlide();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextSlide();
          break;
        case 'Home':
          e.preventDefault();
          goToSlide(0);
          break;
        case 'End':
          e.preventDefault();
          goToSlide(projects.length - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [projects.length, isTransitioning]);

  // Auto-play functionality (optional - can be disabled)
  useEffect(() => {
    if (projects.length <= 1) return;
    
    const autoPlayInterval = setInterval(() => {
      if (!isTransitioning) {
        nextSlide();
      }
    }, 8000); // Change slide every 8 seconds

    return () => clearInterval(autoPlayInterval);
  }, [projects.length, isTransitioning]);

  // Touch/swipe support for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const toggleExpand = (index: number) => {
    if (expandedProject === index) {
      setExpandedProject(null);
    } else {
      setExpandedProject(index);
    }
  };

  const openLightbox = (projectIndex: number, imageIndex: number = 0) => {
    setCurrentProject(projectIndex);
    setLightboxIndex(imageIndex);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    const projectImages = projects[currentProject].images;
    if (direction === 'next') {
      setLightboxIndex((prev) => (prev + 1) % projectImages.length);
    } else {
      setLightboxIndex((prev) => (prev - 1 + projectImages.length) % projectImages.length);
    }
  };

  // Set active image
  const handleThumbnailClick = (index: number, projectIndex: number) => {
    setActiveImage(index);
  };

  return (
    <div 
      ref={projectsRef}
      id="projects"
       className={`py-24 transition-colors duration-300 ${
        isDark 
          ? "bg-[#0e0e0e] text-gray-100" 
          : "bg-gradient-to-br from-indigo-50 to-teal-50 text-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="projects-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Featured <span className="text-blue-500">Projects</span>
          </h2>
          <p className="projects-subtitle text-lg max-w-2xl mx-auto">
            Explore my recent work showcasing full-stack development expertise
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full mt-6"></div>
        </div>

        {/* Projects Carousel */}
        {projects.length > 0 && (
          <div className="relative flex justify-center items-center flex-col ">
            {/* Carousel Container */}
            <div 
              ref={carouselRef}
              className="relative overflow-hidden md:w-7/10 w-8/10  rounded-2xl"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div 
                className="flex transition-transform duration-500 ease-in-out "
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`,
                }}
              >
                {projects.map((project, index) => (
                  <div 
                    key={index}
                    className="w-full  flex-shrink-0 px-4"
                  >
                    <div 
                      className={`project-card w-full group rounded-xl overflow-hidden transition-all duration-300 ${
                        isDark 
                          ? "bg-gray-900 border border-gray-800" 
                          : "bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200"
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row">
                        {/* Project Images - Primary + Thumbnails */}
                        <div className={`lg:w-1/2 p-4 ${isDark ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 to-purple-50"}`}>
                          {/* Primary Image */}
                          <div 
                            className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer mb-3 transition-all duration-300 transform hover:scale-[1.02] ${
                              isDark ? "border border-gray-800" : "border border-gray-200"
                            }`}
                            onClick={() => openLightbox(index, activeImage)}
                          >
                            <ProjectImage
                              storageId={project.images[activeImage]}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="bg-black/40 p-2 rounded-full">
                                <ZoomIn className="text-white" size={20} />
                              </div>
                            </div>
                          </div>
                          
                          {/* Thumbnail Gallery */}
                          <div className="mt-3">
                            <h4 className="font-medium mb-2 text-xs text-gray-500">More project images:</h4>
                            <div className="flex gap-2 overflow-x-auto py-1">
                              {project.images.map((img, imgIndex) => (
                                <div 
                                  key={imgIndex}
                                  className={`relative w-16 h-12 ml-1 rounded-md overflow-hidden cursor-pointer transition-all duration-300 ${
                                    imgIndex === activeImage 
                                      ? "ring-2 ring-blue-500 scale-105" 
                                      : "opacity-80 hover:opacity-100"
                                  }`}
                                  onClick={() => handleThumbnailClick(imgIndex, index)}
                                >
                                  <ProjectImage
                                    storageId={img}
                                    alt={project.title}
                                    className="w-full h-full object-cover"
                                  />
                                  {imgIndex === activeImage && (
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-1.5 h-1.5 rounded-full"></div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* Project Details */}
                        <div className="lg:w-1/2 p-4">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl font-bold group-hover:text-blue-500 transition-colors">
                              {project.title}
                            </h3>
                            <div className="flex space-x-2">
                              {project.githubLink && (
                                <a 
                                  href={project.githubLink} 
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`p-1.5 rounded-full ${
                                    isDark 
                                      ? "bg-gray-800 hover:bg-gray-700" 
                                      : "bg-gradient-to-br from-blue-50 to-purple-50 hover:bg-gradient-to-br from-blue-600 to-purple-600"
                                  } transition-colors`}
                                  aria-label="View on GitHub"
                                >
                                  <Github size={22} />
                                </a>
                              )}
                              {project.liveLink && (
                                <a 
                                  href={project.liveLink} 
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`p-1.5 rounded-full ${
                                    isDark 
                                      ? "bg-gray-800 hover:bg-gray-700" 
                                      : "bg-gradient-to-br from-blue-50 to-purple-50 hover:bg-gradient-to-br from-blue-600 to-purple-600"
                                  } transition-colors`}
                                  aria-label="View live project"
                                >
                                  <ExternalLink size={22} />
                                </a>
                              )}
                            </div>
                          </div>
                          
                          <p className={`mb-3 text-base ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                            {expandedProject === index ? project.longDescription : project.shortDescription}
                          </p>
                          
                          <button 
                            onClick={() => toggleExpand(index)}
                            className={`flex items-center text-blue-500 font-medium mb-4 text-base ${
                              isDark ? "hover:text-blue-400" : "hover:text-blue-600"
                            } transition-colors`}
                          >
                            {expandedProject === index ? (
                              <>
                                Show less <ChevronUp className="ml-1" size={22} />
                              </>
                            ) : (
                              <>
                                Read more <ChevronDown className="ml-1" size={22} />
                              </>
                            )}
                          </button>
                          
                          {/* Tech Stack Icons */}
                          <div className="mt-4">
                            <h4 className="font-medium mb-2 text-xs uppercase tracking-wider text-blue-500">
                              Technologies Used
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {project.techIcons.map((techName, idx) => {
                                const skill = skills.find(s => s.name === techName);
                                return (
                                  <div 
                                    key={idx}
                                    className={`w-12 h-12 rounded-md flex items-center justify-center p-1.5 ${
                                      isDark ? "bg-gray-800" : "bg-gradient-to-br from-blue-50 to-purple-50"
                                    }`}
                                    title={techName}
                                  >
                                    {skill && skill.image ? (
                                      <Image 
                                        src={skill.image} 
                                        alt={techName}
                                        className="w-9 h-9 object-contain"
                                        width={36}
                                        height={36}
                                      />
                                    ) : (
                                      <div className="bg-gray-200 border-2 border-dashed rounded-md w-5 h-5" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Controls */}
            {projects.length > 1 && (
              <>
                {/* Previous Button */}
                <button
                  onClick={prevSlide}
                  disabled={isTransitioning}
                  className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full transition-all duration-300 ${
                    isDark 
                      ? "bg-gray-800/80 hover:bg-gray-700/90 text-white" 
                      : "bg-gradient-to-br from-blue-50 to-purple-50/80 hover:bg-gradient-to-br from-blue-600 to-purple-600/90 text-gray-800"
                  } shadow-lg backdrop-blur-sm ${
                    isTransitioning ? "opacity-50 cursor-not-allowed" : "hover:scale-110"
                  }`}
                  aria-label="Previous project"
                >
                  <ChevronLeft size={24} />
                </button>

                {/* Next Button */}
                <button
                  onClick={nextSlide}
                  disabled={isTransitioning}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full transition-all duration-300 ${
                    isDark 
                      ? "bg-gray-800/80 hover:bg-gray-700/90 text-white" 
                      : "bg-gradient-to-br from-blue-50 to-purple-50/80 hover:bg-gradient-to-br from-blue-600 to-purple-600/90 text-gray-800"
                  } shadow-lg backdrop-blur-sm ${
                    isTransitioning ? "opacity-50 cursor-not-allowed" : "hover:scale-110"
                  }`}
                  aria-label="Next project"
                >
                  <ChevronRight size={24} />
                </button>

                {/* Dots Indicator */}
                <div className="flex justify-center mt-6 space-x-2">
                  {projects.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      disabled={isTransitioning}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 scale-125"
                          : isDark 
                            ? "bg-gray-600 hover:bg-gray-500" 
                            : "bg-gradient-to-br from-blue-50 to-purple-50 hover:bg-gradient-to-br from-blue-600 to-purple-600"
                      } ${
                        isTransitioning ? "cursor-not-allowed" : "hover:scale-110"
                      }`}
                      aria-label={`Go to project ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Project Counter */}
                <div className="text-center mt-4">
                  <span className={`text-sm font-medium ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    {currentSlide + 1} of {projects.length}
                  </span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="text-center py-16">
            <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
              isDark ? "bg-gray-800" : "bg-gradient-to-br from-blue-50 to-purple-50"
            }`}>
              <div className={`w-12 h-12 rounded-full ${
                isDark ? "bg-gray-700" : "bg-gradient-to-br from-blue-50 to-purple-50"
              }`} />
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}>
              No projects yet
            </h3>
            <p className={`text-base ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}>
              Projects will appear here once they&apos;re added through the admin dashboard.
            </p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div 
            className="max-w-6xl w-full max-h-[90vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white p-2 rounded-full hover:bg-white/10 transition-colors z-10"
              aria-label="Close lightbox"
            >
              <X size={32} />
            </button>
            
            <div className="relative aspect-video bg-gray-800 rounded-xl overflow-hidden">
              <ProjectImage
                storageId={projects[currentProject].images[lightboxIndex]}
                alt={projects[currentProject].title}
                className="w-full h-full object-contain"
              />
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('prev');
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                aria-label="Previous image"
              >
                <MoveLeft size={28} />
              </button>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('next');
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                aria-label="Next image"
              >
                <MoveRight size={28} />
              </button>
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
                {lightboxIndex + 1} / {projects[currentProject].images.length}
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex gap-2 justify-center overflow-x-auto py-2 max-w-full">
                {projects[currentProject].images.map((img, idx) => (
                  <div 
                    key={idx}
                    className={`relative w-20 h-16 rounded cursor-pointer transition-all ${
                      lightboxIndex === idx ? "ring-2 ring-blue-500 scale-105" : "opacity-70"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex(idx);
                    }}
                  >
                    <ProjectImage
                      storageId={img}
                      alt={projects[currentProject].title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsSection;