"use client";
import React, { useEffect, useRef } from 'react';
import gsap from "gsap";
import { useTheme } from '@/app/context/ThemeContext';
import { 
  Code, 
  ServerCog, 
  Smartphone,
  Database, 
  Zap,
  Cpu
} from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

const iconMap: Record<string, React.ReactNode> = {
  Code: <Code className="text-blue-500" size={32} />,
  ServerCog: <ServerCog className="text-blue-500" size={32} />,
  Smartphone: <Smartphone className="text-blue-500" size={32} />,
  Database: <Database className="text-blue-500" size={32} />,
  Zap: <Zap className="text-blue-500" size={32} />,
  Cpu: <Cpu className="text-blue-500" size={32} />,
};

const ServicesSection = () => {
  const servicesRef = useRef(null);
  const { isDark } = useTheme();
  const services = useQuery(api.homePage.getServices);
   useEffect(() => {
   
    gsap.set(".services-heading, .services-subtitle, .service-card", {
      opacity: 0,
      y: 30
    });

    // Animation for when section comes into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.to(".services-heading", {
            duration: 0.8,
            y: 0,
            opacity: 1,
            ease: "power3.out"
          });
          
          gsap.to(".services-subtitle", {
            duration: 0.8,
            y: 0,
            opacity: 1,
            delay: 0.2,
            ease: "power3.out"
          });
          
          gsap.to(".service-card", {
            duration: 0.7,
            y: 0,
            opacity: 1,
            stagger: 0.1,
            delay: 0.4,
            ease: "power3.out"
          });
        } else {
          // Reset to hidden state when not in view
          gsap.set(".services-heading, .services-subtitle, .service-card", {
            opacity: 0,
            y: 30
          });
        }
      });
    }, { threshold: 0.1 });
    
    if (servicesRef.current) {
      observer.observe(servicesRef.current);
    }
    
    return () => {
      if (servicesRef.current) {
        observer.unobserve(servicesRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={servicesRef}
      id="services"
     className={`py-24 transition-colors duration-300 ${
        isDark 
          ? "bg-[#0e0e0e] text-gray-100" 
          : "bg-gradient-to-br from-indigo-50 to-teal-50 text-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="services-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            My <span className="text-blue-500">Services</span>
          </h2>
          <p className="services-subtitle text-lg max-w-2xl mx-auto">
            Comprehensive solutions tailored to meet your business needs and technical requirements
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full mt-6"></div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services?.map((service, index) => (
            <div 
              key={index}
              className={`service-card group p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 ${
                isDark 
                  ? "bg-gray-900 border border-gray-800 hover:border-blue-500/50" 
                  : "bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${
                isDark ? "bg-blue-900/30" : "bg-blue-100"
              }`}>
                {iconMap[service.icon] || <Code className="text-blue-500" size={32} />}
              </div>
              
              <h3 className="text-xl font-bold mb-4 group-hover:text-blue-500 transition-colors">
                {service.title}
              </h3>
              
              <p className={`mb-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                {service.description}
              </p>
              
              <div className="mt-6">
                <h4 className="font-medium mb-3 text-sm uppercase tracking-wider text-blue-500">
                  Key Features
                </h4>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-3 ${
                        isDark ? "bg-gradient-to-r from-blue-500 to-purple-600" : "bg-blue-400"
                      }`}></span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Expertise */}
        <div className={`mt-24 p-8 rounded-2xl ${
          isDark 
            ? "bg-gray-900/50 border border-gray-800" 
            : "bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200"
        }`}>
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-center">
              Additional Expertise
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: "Performance Optimization", icon: <Zap className="text-blue-500" size={24} /> },
                { name: "Technical Consulting", icon: <Cpu className="text-blue-500" size={24} /> },
                { name: "API Integration", icon: <ServerCog className="text-blue-500" size={24} /> },
                { name: "Progressive Web Apps", icon: <Smartphone className="text-blue-500" size={24} /> },
              ].map((item, index) => (
                <div 
                  key={index}
                  className={`flex items-center p-3 rounded-lg ${
                    isDark 
                      ? "bg-gray-800/50 hover:bg-gray-800" 
                      : "bg-gradient-to-br from-blue-50 to-purple-50 hover:bg-blue-100"
                  } transition-colors`}
                >
                  <div className="mr-3">{item.icon}</div>
                  <span className="font-medium text-[12px] md:text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;