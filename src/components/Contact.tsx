"use client"
import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { MessageCircle } from 'lucide-react';
import { FaFacebook,FaWhatsappSquare,FaLinkedin  } from "react-icons/fa";
import emailjs from '@emailjs/browser';
import { useUser, SignIn, useClerk } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import Image from "next/image";

import { useTheme } from '@/app/context/ThemeContext';

// Add this interface above the Contact component
interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  fromName?: string;
  fromImage?: string;
  timestamp?: number;
}

const Contact = () => {
  const contactRef = useRef(null);
  const formRef = useRef<HTMLFormElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [justSentMessage, setJustSentMessage] = useState(false);
  const { isSignedIn, user, isLoaded } = useUser();
  const [showSignIn, setShowSignIn] = useState(false);
  const { signOut } = useClerk();

  // EmailJS configuration from environment variables
  const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;
  const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
  const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
  const EMAILJS_AUTO_REPLY_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_AUTO_REPLY_TEMPLATE_ID!;

  // Convex chat logic
  const sendMessageMutation = useMutation(api.chat.sendMessage);
  const [chatUserId, setChatUserId] = useState<string | null>(null);
  const [chatLoading, setChatLoading] = useState(false);

  // Fetch chat history when chat modal opens and user is loaded
  const chatHistory = useQuery(
    api.chat.getChat,
    chatUserId ? { userId: chatUserId } : "skip"
  );

  useEffect(() => {
    if (isChatOpen && isLoaded && user) {
      setChatUserId(user.id);
    }
  }, [isChatOpen, isLoaded, user]);

  // Update chatMessages when chatHistory changes
  useEffect(() => {
    if (chatHistory) {
      setChatMessages(
        chatHistory.map((msg: {
          from: string;
          message: string;
          fromName?: string;
          fromImage?: string;
          timestamp?: number;
        }): ChatMessage => ({
          sender: msg.from === "admin" ? "bot" : "user",
          text: msg.message,
          fromName: msg.fromName,
          fromImage: msg.fromImage,
          timestamp: msg.timestamp,
        }))
      );
    }
  }, [chatHistory]);

  // Scroll to bottom only after user sends a message
  useEffect(() => {
    if (justSentMessage && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      setJustSentMessage(false);
    }
  }, [chatMessages, justSentMessage]);

  useEffect(() => {
    // Initialize EmailJS
    emailjs.init(EMAILJS_PUBLIC_KEY);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: contactRef.current,
        start: "top 80%",
      }
    });

    tl.from(".contact-heading", { 
      duration: 0.8, 
      y: 30, 
      opacity: 0, 
      ease: "power3.out" 
    })
    .from(".contact-subtitle", { 
      duration: 0.8, 
      y: 30, 
      opacity: 0, 
      ease: "power3.out" 
    }, "-=0.5")
    .from(".contact-form", { 
      duration: 1, 
      y: 30, 
      opacity: 0, 
      ease: "power3.out" 
    }, "-=0.3")
    .from(".social-card", { 
      duration: 0.8, 
      y: 30, 
      opacity: 0, 
      stagger: 0.1, 
      ease: "power3.out" 
    }, "-=0.5");

    // Floating blob animations
    gsap.to(".contact-blob-purple", {
      x: 15,
      y: -15,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    
    gsap.to(".contact-blob-blue", {
      x: -10,
      y: 10,
      duration: 7,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, [EMAILJS_PUBLIC_KEY]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
   
    const fieldMap: { [key: string]: string } = {
      'from_name': 'name',
      'from_email': 'email',
      'message': 'message'
    };
    
    const stateField = fieldMap[name] || name;
    setFormData({ ...formData, [stateField]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formRef.current) return;
    
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 30000)
      );

      const emailPromise = emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      );

      const result = await Promise.race([emailPromise, timeoutPromise]) as { status: number };

      if (result.status === 200) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
        
        // Manual auto-reply using dedicated template
        try {
          await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_AUTO_REPLY_TEMPLATE_ID, 
            {
              from_email: formData.email, 
              from_name: formData.name,   
            },
            EMAILJS_PUBLIC_KEY
          );
        } catch (autoReplyError: unknown) {
          console.error('Auto-reply failed with details:', autoReplyError);
          if (autoReplyError instanceof Error) {
            console.error('Error message:', autoReplyError.message);
          }
        }
        
        setTimeout(() => {
          setSubmitStatus('idle');
        }, 3000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('EmailJS Error:', error);
      
    
      try {
        const result = await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            from_name: formData.name,
            from_email: formData.email,
            message: formData.message,
            reply_to: formData.email,
          },
          EMAILJS_PUBLIC_KEY
        );

        if (result.status === 200) {
          setSubmitStatus('success');
          setFormData({ name: '', email: '', message: '' });
          
          setTimeout(() => {
            setSubmitStatus('idle');
          }, 3000);
        } else {
          setSubmitStatus('error');
        }
      } catch (secondError) {
        console.error('Second attempt failed:', secondError);
        setSubmitStatus('error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChatSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !user) return;
    setChatLoading(true);
    try {
      await sendMessageMutation({
        from: user.id,
        to: "admin",
        message: chatInput,
        fromName: user.fullName || user.firstName || "User",
        fromImage: user.imageUrl || undefined,
      });
      setChatInput("");
      setJustSentMessage(true);
    } catch (err) {
      console.error("Failed to send message", err);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div 
      ref={contactRef}
      id="contact"
      className={`relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-300 ${
        isDark 
          ? "bg-[#121212] text-gray-100" 
          : "bg-gradient-to-br from-blue-50 to-purple-50 text-gray-800"
      }`}
    >
      {/* Floating Blobs */}
      <div className="contact-blob-purple absolute -top-20 -right-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 dark:opacity-10" />
      <div className="contact-blob-blue absolute -bottom-20 -left-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 dark:opacity-10" />

      {/* Clerk SignIn Modal */}
      {showSignIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 flex flex-col">
            <SignIn routing="hash" afterSignInUrl="/" />
            <button
              onClick={() => setShowSignIn(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Chat Modal Overlay */}
      {isChatOpen && isSignedIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className={`relative w-full max-w-md mx-auto bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950 shadow-2xl p-6 flex flex-col ${isDark ? 'text-gray-100' : 'text-gray-800'}`}> 
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Live Chat</h2>
              <button onClick={() => setIsChatOpen(false)} className="text-gray-400 hover:text-red-500 text-2xl font-bold">×</button>
            </div>
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto mb-4 p-2 bg-gradient-to-br from-blue-50 to-purple-50 dark:bg-gradient-to-br dark:from-[#121212] dark:to-[#121212] rounded-lg min-h-[200px] max-h-64">
              { chatMessages.length === 0 ? (
                <div className="text-center text-gray-400 mt-8">Start chatting...</div>
              ) : (
                <div className="flex flex-col gap-2">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`max-w-[80%] px-4 py-2 rounded-lg text-sm
                        ${msg.sender === 'user'
                          ? 'self-end bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                          : 'self-start bg-gradient-to-br from-blue-50 to-purple-50 text-gray-800 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950 dark:text-gray-100'}`}
                    >
                      <div className="flex items-center gap-2">
                        {msg.sender === 'bot' && msg.fromImage && (
                          <Image src={msg.fromImage} alt="admin" width={24} height={24} className="w-6 h-6 rounded-full" />
                        )}
                        <span>{msg.text}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {msg.fromName && <span>{msg.fromName}</span>}
                        {msg.timestamp && (
                          <span> • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <form className="flex gap-2 mb-4" onSubmit={handleChatSend}>
              <input
                type="text"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gradient-to-br from-blue-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950 focus:outline-none"
                placeholder="Type a message..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                autoFocus
              />
              <button type="submit" className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold" disabled={chatInput.trim() === "" || chatLoading}>Send</button>
            </form>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => signOut()}
                className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold"
              >
                Logout
              </button>
              <button onClick={() => setIsChatOpen(false)} className="px-4 py-2 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950 text-gray-800 dark:text-gray-100 font-semibold">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="contact-heading text-4xl md:text-5xl font-bold mb-4">
            Get In <span className="text-blue-500">Touch</span>
          </h2>
          <p className="contact-subtitle max-w-2xl mx-auto text-lg">
            Have a project in mind or want to discuss opportunities? Feel free to reach out!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Contact Form */}
          <div className={`contact-form p-8 rounded-2xl shadow-xl ${
            isDark 
              ? "bg-gray-900 border border-gray-800" 
              : "bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200"
          }`}>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block mb-2 font-medium">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="from_name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${
                    isDark 
                      ? "bg-gray-800 border border-gray-700" 
                      : "bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-300"
                  }`}
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block mb-2 font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="from_email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${
                    isDark 
                      ? "bg-gray-800 border border-gray-700" 
                      : "bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-300"
                  }`}
                  placeholder="john@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block mb-2 font-medium">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${
                    isDark 
                      ? "bg-gray-800 border border-gray-700" 
                      : "bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-300"
                  }`}
                  placeholder="Let's build something amazing together..."
                />
              </div>
              
              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  ✅ Message sent successfully! I&apos;ll get back to you soon.
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  ❌ Failed to send message. Please try again or contact me directly.
                </div>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-6 py-3 font-medium rounded-lg transition-all shadow-lg ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 shadow-blue-500/20"
                } text-white`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>

          {/* Contact Info & Social */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              <a 
                 href="https://wa.me/+2348160192779"  
                target="_blank" 
                rel="noopener noreferrer"
                className="social-card"
              >
                <div className={`flex flex-col items-center p-6 rounded-xl transition-transform hover:-translate-y-1 ${
                  isDark 
                    ? "bg-gray-900 border border-gray-800 hover:bg-gray-800" 
                    : "bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200 hover:bg-gray-50"
                }`}>
                  <div className={`w-14 h-14 rounded-full mb-4 flex items-center justify-center ${
                    isDark ? "bg-green-900/20" : "bg-green-100"
                  }`}>
                    <FaWhatsappSquare className="text-green-500 w-7 h-7" />
                  </div>
                  <span className="font-medium">WhatsApp</span>
                </div>
              </a>
              
              <a 
                href="https://web.facebook.com/Abdullahibbtwd/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-card"
              >
                <div className={`flex flex-col items-center p-6 rounded-xl transition-transform hover:-translate-y-1 ${
                  isDark 
                    ? "bg-gray-900 border border-gray-800 hover:bg-gray-800" 
                    : "bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200 hover:bg-gray-50"
                }`}>
                  <div className={`w-14 h-14 rounded-full mb-4 flex items-center justify-center ${
                    isDark ? "bg-blue-900/20" : "bg-blue-100"
                  }`}>
                    <FaFacebook className="text-blue-500 w-7 h-7" />
                  </div>
                  <span className="font-medium">Facebook</span>
                </div>
              </a>
              
              <a 
                href="https://linkedin.com/in/elversh" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-card"
              >
                <div className={`flex flex-col items-center p-6 rounded-xl transition-transform hover:-translate-y-1 ${
                  isDark 
                    ? "bg-gray-900 border border-gray-800 hover:bg-gray-800" 
                    : "bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200 hover:bg-gray-50"
                }`}>
                  <div className={`w-14 h-14 rounded-full mb-4 flex items-center justify-center ${
                    isDark ? "bg-blue-700/20" : "bg-blue-100"
                  }`}>
                    <FaLinkedin className="text-blue-700 w-7 h-7" />
                  
                  </div>
                  <span className="font-medium">LinkedIn</span>
                </div>
              </a>
            </div>

            {/* Live Chat Card */}
            <button
              type="button"
              onClick={() => {
                if (!isSignedIn) setShowSignIn(true);
                else setIsChatOpen(true);
              }}
              className="social-card block w-full text-left"
            >
              <div className={`p-6 rounded-xl transition-transform hover:-translate-y-1 ${
                isDark 
                  ? "bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-gray-800" 
                  : "bg-gradient-to-r from-purple-100 to-blue-100 border border-gray-200"
              }`}>
                <div className="flex items-center">
                  <div className={`w-16 h-16 rounded-full mr-5 flex items-center justify-center ${
                    isDark ? "bg-purple-800/20" : "bg-purple-200"
                  }`}>
                    <MessageCircle className="text-purple-500 w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Live Chat</h3>
                    <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                      Chat with me in real-time
                    </p>
                  </div>
                </div>
              </div>
            </button>

            <div className={`mt-10 p-6 rounded-xl ${
              isDark 
                ? "bg-gray-900/50 border border-gray-800" 
                : "bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200"
            }`}>
              <h3 className="font-bold text-lg mb-3">Direct Contact</h3>
              <p className={isDark ? "text-gray-400 mb-4" : "text-gray-600 mb-4"}>
                Prefer traditional methods? Reach me directly:
              </p>
              <ul className="space-y-2">
                <li className="flex">
                  <span className={isDark ? "text-blue-400 font-medium" : "text-blue-600 font-medium"}>
                    Email:&nbsp;
                  </span>
                  <span>elvershdev@gmail.com</span>
                </li>
                <li className="flex">
                  <span className={isDark ? "text-blue-400 font-medium" : "text-blue-600 font-medium"}>
                    Phone:&nbsp;
                  </span>
                  <span>+2348160192779</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;