"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, ChevronDown, Settings as SettingsIcon, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';

const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const { user, profile } = useAuth();

  const currentUser = user ? {
    name: profile?.full_name || user.user_metadata?.full_name || '',
    email: profile?.email || user.email,
    role: profile?.role || 'employee',
    profilePicture: profile?.profile_photo || null,
    isPro: false
  } : null;

  // Nav Items with their respective Page Slugs
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Jobs", path: "/jobs" },
    { name: "Companies", path: "#" }, // This has a dropdown
    { name: "About Us", path: "/about" },
    { name: "Services", path: "#" }, // This has a dropdown
    { name: "Insights", path: "#" }, // This has a dropdown
    { name: "Contact", path: "/contact" }
  ];

  const insightLinks = [
    { name: "Blogs", path: "/insights/blogs" },
    { name: "Case Studies", path: "/insights/case-studies" }
  ];

  const servicesLinks = [
    { name: "Our Services", path: "/services" },
    { name: "Mentors", path: "/mentorship" }
  ];

  const companyLinks = [
    { name: "Top Companies", path: "/companies" },
    { name: "Industries", path: "/industries" }
  ];

  const getDropdownData = (name) => {
    switch(name) {
      case "Insights": return { isOpen: isInsightsOpen, setIsOpen: setIsInsightsOpen, links: insightLinks };
      case "Services": return { isOpen: isServicesOpen, setIsOpen: setIsServicesOpen, links: servicesLinks };
      case "Companies": return { isOpen: isCompanyOpen, setIsOpen: setIsCompanyOpen, links: companyLinks };
      default: return null;
    }
  };

  const { signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-[100] bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-20">
            {/* Logo - Redirects to Home */}
            <Link href="/" className="flex items-center gap-2 group cursor-pointer shrink-0">
              <img src="/logo.png" alt="HIRRD Logo" className="h-14 w-auto object-contain" style={{ filter: 'brightness(0)' }} />
            </Link>

            {/* Desktop Nav Links (Centered) */}
            <div className="hidden xl:flex flex-1 justify-center items-center gap-6 2xl:gap-10 whitespace-nowrap px-4">
              {navItems.map((item) => {
                const dd = getDropdownData(item.name);
                return dd ? (
                  <div 
                    key={item.name} 
                    className="relative py-2 group cursor-pointer"
                    onMouseEnter={() => dd.setIsOpen(true)}
                    onMouseLeave={() => dd.setIsOpen(false)}
                  >
                    <button className="flex items-center gap-1 text-[13px] font-bold text-slate-500 hover:text-black uppercase tracking-widest transition-all">
                      {item.name} <ChevronDown size={14} className={`transition-transform ${dd.isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {dd.isOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 w-48 bg-white border border-slate-100 shadow-xl py-4 z-[110]"
                        >
                          {dd.links.map((subItem) => (
                            <Link 
                              key={subItem.name} 
                              href={subItem.path} 
                              className="block px-6 py-2 text-[12px] font-bold text-slate-500 hover:text-sky-500 hover:bg-slate-50 uppercase tracking-widest"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link 
                    key={item.name} 
                    href={item.path} 
                    className="text-[13px] font-bold text-slate-500 hover:text-black uppercase tracking-widest transition-colors"
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* CTA / Auth (Right Aligned) */}
            <div className="hidden xl:flex items-center justify-end shrink-0">
              {currentUser ? (
                <div className="flex items-center gap-6">
                  <button 
                    onClick={handleSignOut}
                    className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-none font-bold text-xs uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all shadow-lg cursor-pointer"
                  >
                    Sign Out
                  </button>
                  <Link 
                    href="/dashboard/settings"
                    className="text-slate-500 hover:text-black hover:scale-110 transition-all p-1 flex items-center justify-center shrink-0"
                    title="Account Settings"
                  >
                    <SettingsIcon size={20} />
                  </Link>
                  <Link 
                    href={currentUser.role === 'student' || currentUser.role === 'employee' ? '/dashboard/student' : currentUser.role === 'employer' ? '/dashboard/employer' : '/dashboard/admin'}
                    className="flex items-center shrink-0 relative"
                  >
                    {currentUser.profilePicture ? (
                      <img 
                        src={currentUser.profilePicture} 
                        alt="User Profile" 
                        className="w-10 h-10 rounded-full object-cover border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-105 transition-transform" 
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full border-2 border-black bg-sky-100 flex items-center justify-center font-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase hover:scale-105 transition-transform text-xs">
                        {currentUser.name ? currentUser.name.charAt(0) : currentUser.email.charAt(0)}
                      </div>
                    )}
                    {currentUser.isPro && (
                      <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[7px] font-black px-1.5 py-0.5 border border-black uppercase tracking-wider shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] rounded-none">
                        PRO
                      </span>
                    )}
                  </Link>
                </div>
              ) : (
                <button 
                  onClick={() => router.push('/register')}
                  className="flex items-center gap-2 bg-black text-white px-8 py-3 rounded-none font-bold text-xs uppercase tracking-[0.2em] hover:bg-sky-500 hover:text-black transition-all shadow-lg"
                >
                  Get Started <ArrowRight size={14} />
                </button>
              )}
            </div>

            {/* Mobile Toggle */}
            <button onClick={() => setIsOpen(true)} className="xl:hidden p-2 text-black">
              <Menu size={28} />
            </button>
          </div>
        </div>
      </nav>

      {/* Creative Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setIsOpen(false); setIsInsightsOpen(false); }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
            />
            <motion.div 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white z-[120] p-10 shadow-2xl overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-12">
                <span className="text-xl font-black uppercase">Menu</span>
                <button onClick={() => { setIsOpen(false); setIsInsightsOpen(false); setIsServicesOpen(false); setIsCompanyOpen(false); }} className="p-2 bg-slate-100 rounded-full">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex flex-col gap-6">
                {navItems.map((item, i) => {
                  const dd = getDropdownData(item.name);
                  return (
                  <div key={item.name}>
                    {dd ? (
                      <div className="flex flex-col">
                        <button 
                          onClick={() => dd.setIsOpen(!dd.isOpen)}
                          className="text-3xl font-bold text-black flex items-center justify-between"
                        >
                          {item.name} <ChevronDown className={`transition-transform ${dd.isOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {dd.isOpen && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden flex flex-col gap-4 mt-4 ml-4 border-l-2 border-sky-500 pl-4"
                            >
                              {dd.links.map((sub) => (
                                <Link 
                                  key={sub.name} 
                                  href={sub.path} 
                                  className="text-xl font-bold text-slate-500 hover:text-sky-500"
                                >
                                  {sub.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <motion.a 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        href={item.path} 
                        className="text-3xl font-bold text-black hover:text-sky-500 transition-colors block"
                      >
                        {item.name}
                      </motion.a>
                    )}
                  </div>
                )})}
              </div>

              <div className="mt-16 flex flex-col gap-4">
                {currentUser ? (
                  <>
                    <button 
                      onClick={() => router.push(currentUser.role === 'employee' || currentUser.role === 'student' ? '/dashboard/student' : currentUser.role === 'employer' ? '/dashboard/employer' : '/dashboard/admin')}
                      className="w-full border-2 border-black py-4 font-bold uppercase tracking-widest shadow-md hover:bg-sky-500 hover:text-black transition-colors cursor-pointer"
                    >
                      {currentUser.role === 'employee' || currentUser.role === 'student' ? 'Profile' : 'Dashboard'}
                    </button>
                     <button 
                      onClick={() => router.push('/dashboard/settings')}
                      className="w-full border-2 border-black py-4 font-bold uppercase tracking-widest shadow-md hover:bg-sky-500 hover:text-black transition-colors cursor-pointer"
                    >
                      Settings
                    </button>
                    <button 
                      onClick={handleSignOut}
                      className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest shadow-xl active:bg-red-500 active:text-white transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => router.push('/register')}
                    className="w-full bg-black text-white py-5 font-bold uppercase tracking-widest shadow-xl active:bg-sky-500 hover:bg-sky-500 hover:text-black transition-colors"
                  >
                    Join Now
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
