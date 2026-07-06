import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Linkedin,
  Instagram,
  Facebook,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Briefcase,
  Users,
  Send,
  Check
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const XIcon = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
  </svg>
);

const Footer = () => {
  const { profile } = useAuth();
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailInput) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmailInput("");
    }, 3000);
  };

  return (
    <footer className="bg-black text-white pt-24 pb-12 border-t-[4px] border-black relative overflow-hidden">
      {/* Background Micro Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ 
             backgroundImage: `linear-gradient(#fff 1.5px, transparent 1.5px), linear-gradient(90deg, #fff 1.5px, transparent 1.5px)`, 
             backgroundSize: '30px 30px' 
           }}>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* --- TOP CTA CARD (Neo-Brutalist Glassmorphism) --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#111] border-[4px] border-white p-8 md:p-12 lg:p-16 mb-16 shadow-[10px_10px_0px_0px_rgba(14,165,233,1)] flex flex-col lg:flex-row items-center justify-between gap-10"
        >
          <div className="text-center lg:text-left flex-1 w-full">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none mb-4">
              Hire better, <br />
              <span className="text-sky-400 italic">Hired faster.</span>
            </h2>
            <p className="text-slate-400 font-bold text-sm md:text-md uppercase tracking-widest">
              hirrd: Next-gen talent matching matching engine.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto shrink-0">
            <button 
              onClick={() => {
                if (profile && profile.role !== 'employer') {
                  alert("This feature is only for Employers.");
                  return;
                }
                window.location.href = profile ? '/dashboard/employer' : '/register?role=employer';
              }}
              className="bg-sky-400 text-black border-2 border-black hover:bg-white hover:text-black px-8 py-4 font-black uppercase text-xs tracking-widest transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2 cursor-pointer"
            >
              <Briefcase size={16} /> Post a Job
            </button>
            <button 
              onClick={() => {
                if (profile && profile.role !== 'employer') {
                  alert("This feature is only for Employers.");
                  return;
                }
                window.location.href = profile ? '/dashboard/employer' : '/register?role=employee';
              }}
              className="bg-white text-black border-2 border-black hover:bg-sky-400 hover:text-black px-8 py-4 font-black uppercase text-xs tracking-widest transition-all shadow-[4px_4px_0px_0px_rgba(14,165,233,1)] active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2 cursor-pointer"
            >
              <Users size={16} /> Find Talent
            </button>
          </div>
        </motion.div>

        {/* --- MAIN GRID (Premium 4-Column Layout) --- */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16"
        >
          {/* Column 1: Brand & Newsletter */}
          <motion.div variants={item} className="flex flex-col space-y-6">
            <div>
              <img src="/logo.png" alt="HIRRD Logo" className="h-12 w-auto object-contain mb-4" style={{ filter: 'brightness(0) invert(1)' }} />
              <p className="text-slate-400 font-bold text-xs uppercase tracking-wider leading-relaxed">
                India&apos;s premium intelligence-led career ecosystem for tech elite.
              </p>
            </div>
            
            {/* Newsletter Subscription */}
            <form onSubmit={handleSubscribe} className="space-y-2 pt-2">
              <label className="text-[9px] font-black uppercase tracking-wider text-slate-500">Subscribe to Pipeline alerts</label>
              <div className="flex border-2 border-white overflow-hidden shadow-[2px_2px_0px_0px_rgba(14,165,233,1)]">
                <input 
                  type="email" 
                  required
                  placeholder="SUPPORT@HIRRD.TECH"
                  className="bg-neutral-900 text-white placeholder-slate-600 px-3 py-2 text-xs font-black uppercase w-full focus:outline-none"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                />
                <button 
                  type="submit"
                  className="bg-white text-black px-4 py-2 hover:bg-sky-400 hover:text-black transition-colors flex items-center justify-center"
                >
                  {subscribed ? <Check size={14} className="text-emerald-600" /> : <Send size={14} />}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Column 2: Jobseekers */}
          <motion.div variants={item}>
            <h4 className="text-sm font-black uppercase text-white mb-6 tracking-widest border-b border-neutral-800 pb-2">For Candidates</h4>
            <ul className="space-y-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              {[
                { name: "Explore Jobs", path: "/jobs" },
                { name: "AI Resume Builder", path: "/dashboard/student/resume-builder" },
                { name: "Salary Insights", path: "/jobs" },
                { name: "Skill Assessment", path: "/dashboard/student" }
              ].map((linkItem) => (
                <li key={linkItem.name} className="hover:text-sky-400 flex items-center group transition-colors">
                  <ChevronRight size={14} className="mr-0 opacity-0 group-hover:mr-1.5 group-hover:opacity-100 transition-all text-sky-400 shrink-0" />
                  <a href={linkItem.path} className="w-full">{linkItem.name}</a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Employers */}
          <motion.div variants={item}>
            <h4 className="text-sm font-black uppercase text-white mb-6 tracking-widest border-b border-neutral-800 pb-2">For Employers</h4>
            <ul className="space-y-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              {[
                { name: "Post Vacancy", path: "/dashboard/employer" },
                { name: "Talent Sourcing", path: "/dashboard/employer" },
                { name: "Screening Tools", path: "/dashboard/employer" },
                { name: "Enterprise Suite", path: "/pro" }
              ].map((linkItem) => (
                <li key={linkItem.name} className="hover:text-sky-400 flex items-center group transition-colors">
                  <ChevronRight size={14} className="mr-0 opacity-0 group-hover:mr-1.5 group-hover:opacity-100 transition-all text-sky-400 shrink-0" />
                  <a href={linkItem.path} className="w-full">{linkItem.name}</a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Contact */}
          <motion.div variants={item} className="space-y-6">
            <h4 className="text-sm font-black uppercase text-white tracking-widest border-b border-neutral-800 pb-2">hirrd HQ</h4>
            <div className="space-y-4 text-xs font-bold uppercase tracking-wider text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="text-sky-400 shrink-0 mt-0.5" size={16} />
                <p className="leading-relaxed">Dharampeth, Nagpur, MH 440010</p>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="text-sky-400 shrink-0" size={16} />
                <p className="font-black text-white">9356671329</p>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="text-sky-400 shrink-0" size={16} />
                <a href="mailto:Support@hirrd.tech" className="font-black text-sky-400 hover:underline break-all">
                  Support@hirrd.tech
                </a>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex gap-4 pt-2">
              {[
                { Icon: Linkedin, url: 'https://www.linkedin.com/company/hirrdtech' },
                { Icon: XIcon, url: 'https://x.com/hirrdhq' },
                { Icon: Instagram, url: 'https://www.instagram.com/hirrdhq/' },
                { Icon: Facebook, url: '#' }
              ].map((social, i) => (
                <a href={social.url} target="_blank" rel="noopener noreferrer" key={i} className="border border-neutral-800 hover:border-sky-400 p-2 transition-colors cursor-pointer bg-neutral-950 block">
                  <social.Icon size={16} className="text-slate-400 hover:text-sky-400" />
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* --- BOTTOM BAR (Clean & Premium) --- */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">
            © 2026 hirrd. All rights reserved.
          </p>
          <div className="flex gap-8 text-xs font-black text-slate-500 uppercase tracking-wider">
            <a href="/privacy" className="hover:text-sky-400 cursor-pointer transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-sky-400 cursor-pointer transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
