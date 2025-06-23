"use client"
import React, { useEffect } from 'react';
import gsap from 'gsap';
import { FaFacebook,FaWhatsappSquare,FaLinkedin,FaGithubSquare  } from "react-icons/fa";
import { useTheme } from '@/app/context/ThemeContext';

const Footer = () => {
  const { isDark,router } = useTheme();

  useEffect(() => {
    // Animate elements on load
    gsap.from(".footer-item", {
      duration: 0.8,
      y: 20,
      opacity: 0,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "footer",
        start: "top 90%"
      }
    });
    
    
    gsap.to(".footer-blob", {
      y: 10,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, []);

  return (
    <footer className={`relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
      isDark 
        ? "bg-[#0d0d0d] text-gray-300" 
        : "bg-gradient-to-br from-blue-50 to-purple-50 text-gray-700"
    }`}>
      {/* Floating Blobs */}
      <div className="footer-blob absolute -top-20 -left-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10" />
      <div className="footer-blob absolute -bottom-20 -right-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="footer-item">
            <h2 className="text-2xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                elversh
              </span>
              <span className="font-light">_dev</span>
            </h2>
            <p className={`mb-6 max-w-xs ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}>
              Creating innovative web solutions with modern technologies and user-centric design.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/abdullahibbtwd" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`p-2 rounded-full transition-all ${
                  isDark 
                    ? "bg-gray-800 hover:bg-gray-700" 
                    : "bg-gradient-to-br from-blue-50 to-purple-50 hover:bg-gray-100"
                } shadow-md hover:shadow-lg transform hover:-translate-y-1`}
              >
                <FaGithubSquare size={20} />
              </a>
              <a 
                href="https://linkedin.com/in/elversh" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`p-2 rounded-full transition-all ${
                  isDark 
                    ? "bg-gray-800 hover:bg-gray-700" 
                    : "bg-gradient-to-br from-blue-50 to-purple-50 hover:bg-gray-100"
                } shadow-md hover:shadow-lg transform hover:-translate-y-1`}
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="footer-item">
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-3">
              {['Home', 'About', 'Projects', 'Contact'].map((item) => (
                <li key={item}>
                  <a 
                    href={`#${item.toLowerCase()}`} 
                    className={`transition-colors hover:text-blue-500 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-item">
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className={`mr-3 ${isDark ? "text-blue-400" : "text-blue-600"}`}>↳</span>
                <span>elvershdev@gmail.com</span>
              </li>
              <li className="flex items-start">
                <span className={`mr-3 ${isDark ? "text-blue-400" : "text-blue-600"}`}>↳</span>
                <span>+2348160192779</span>
              </li>
              <li className="flex items-start">
                <span className={`mr-3 ${isDark ? "text-blue-400" : "text-blue-600"}`}>↳</span>
                <span>Kano,Nigeria.</span>
              </li>
            </ul>
          </div>

          {/* Live Chat */}
          <div className="footer-item"> 
            <div className="mt-4">
              <p className="mb-3">Social Media:</p>
              <div className="flex space-x-3">
                <a 
                  href="https://wa.me/+2348160192779" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`p-2 rounded-full ${
                    isDark 
                      ? "bg-gray-800 hover:bg-green-900/20" 
                      : "bg-gradient-to-br from-blue-50 to-purple-50 hover:bg-green-100"
                  } shadow-md transition-colors`}
                >
                  <FaWhatsappSquare className="text-green-500" size={20} />
                </a>
                <a 
                  href="https://web.facebook.com/Abdullahibbtwd/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`p-2 rounded-full ${
                    isDark 
                      ? "bg-gray-800 hover:bg-blue-900/20" 
                      : "bg-gradient-to-br from-blue-50 to-purple-50 hover:bg-blue-100"
                  } shadow-md transition-colors`}
                >
                  <FaFacebook className="text-blue-600" size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-item mt-16 pt-8 border-t border-gray-800 dark:border-gray-700 text-center">
          <p className={`${isDark ? "text-gray-500" : "text-gray-500"} text-sm`}>
            © {new Date().getFullYear()} elversh_dev. All rights reserved.
          </p>
          <p
          onClick={()=> router.push("/admin")}
          className={`mt-2 ${isDark ? "text-gray-600" : "text-gray-500"} text-xs`}>
            Crafted with passion and React
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;