'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Search, 
  LineChart, 
  ShieldCheck, 
  UserCircle, 
  BellRing,
  ArrowUpRight,
  Zap,
  Globe,
  Settings,
  Database
} from 'lucide-react';

const ServicesPage = () => {
  const serviceList = [
    {
      title: "Direct Recruitment",
      desc: "Connect directly with verified hiring managers from top global enterprises without middlemen.",
      icon: <Briefcase size={22} />,
    },
    {
      title: "Advanced Search",
      desc: "Precision filters for salary, tech-stack, and remote-first environments engineered for high performance.",
      icon: <Search size={22} />,
    },
    {
      title: "Career Insights",
      desc: "Real-time data on industry salary benchmarks and emerging skill demands powered by AI.",
      icon: <LineChart size={22} />,
    },
    {
      title: "Identity Protocol",
      desc: "Verified badges increase profile visibility by 300% for premium recruiters through data validation.",
      icon: <ShieldCheck size={22} />,
    },
    {
      title: "Expert Consulting",
      desc: "Strategic resume optimization and mock sessions with industry veterans for elite positioning.",
      icon: <UserCircle size={22} />,
    },
    {
      title: "Smart Job Alerts",
      desc: "Zero-latency notifications for opportunities that match your precise professional DNA.",
      icon: <BellRing size={22} />,
    },
  ];

  const processSteps = [
    { name: "Analysis", icon: <Database /> },
    { name: "Validation", icon: <ShieldCheck /> },
    { name: "Optimization", icon: <Settings /> },
    { name: "Deployment", icon: <Globe /> }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <div className="bg-white pt-20">
      {/* --- HERO SECTION --- */}
      <section className="py-24 border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] mb-8"
          >
            Service Catalog 2026
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl lg:text-[120px] font-black tracking-tighter leading-[0.85] mb-12 uppercase"
          >
            Capabilities <br />
            <span className="text-sky-500 italic">& Solutions.</span>
          </motion.h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t-2 border-black pt-12">
            <p className="text-xl md:text-2xl font-bold leading-tight">
              We provide the high-performance infrastructure required to scale careers and corporate teams with absolute precision.
            </p>
            <div className="flex flex-col justify-end items-start md:items-end">
               <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Protocol Status</div>
               <div className="flex items-center gap-2 text-sky-500 font-black uppercase italic">
                 <div className="w-2 h-2 bg-sky-500 animate-ping rounded-full"></div>
                 Active System Online
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- MAIN SERVICES GRID --- */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-20">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500 text-black text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Zap size={12} fill="currentColor" />
                Core Capabilities
              </div>
              <h2 className="text-5xl lg:text-7xl font-black text-black tracking-tighter leading-[0.95] uppercase">
                Engineered for <br />
                Professional Excellence.
              </h2>
            </div>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {serviceList.map((service, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -10 }}
                className="group relative bg-white border-[3px] border-black p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(14,165,233,1)] transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-12">
                  <div className="w-14 h-14 bg-black text-white flex items-center justify-center group-hover:bg-sky-500 transition-colors duration-500">
                    {service.icon}
                  </div>
                  <div className="text-slate-200 font-black text-4xl group-hover:text-sky-100 transition-colors">
                    0{index + 1}
                  </div>
                </div>

                <h3 className="text-2xl font-black text-black uppercase tracking-tighter mb-4 group-hover:text-sky-600">
                  {service.title}
                </h3>
                
                <p className="text-slate-600 font-medium leading-relaxed mb-8">
                  {service.desc}
                </p>

                <Link href="/register" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/40 group-hover:text-sky-500 transition-colors">
                  Explore Protocol <ArrowUpRight size={14} />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- PROCESS WORKFLOW SECTION --- */}
      <section className="py-24 bg-black text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6">Our Operational Flow</h2>
            <p className="text-sky-400 font-bold tracking-[0.3em] uppercase text-xs">From Data to Deployment</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {processSteps.map((step, i) => (
              <div key={i} className="relative text-center group">
                <div className="w-20 h-20 bg-sky-500 mx-auto flex items-center justify-center text-black mb-6 relative z-10 group-hover:rotate-12 transition-transform duration-500">
                  {step.icon}
                </div>
                {i !== 3 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-full h-[2px] bg-slate-800 z-0"></div>
                )}
                <h4 className="text-xl font-black uppercase tracking-tighter">{step.name}</h4>
                <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest">Stage 0{i+1}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA SECTION --- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="bg-sky-500 p-12 md:p-24 border-[4px] border-black shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center">
             <h2 className="text-4xl md:text-7xl font-black text-black tracking-tighter uppercase mb-8 leading-none">
               Custom Solutions <br /> For Enterprises.
             </h2>
             <p className="text-black font-bold text-lg max-w-2xl mb-12 opacity-80">
               Need a custom integration or large-scale recruitment infrastructure? Our hirrd technical team can build it.
             </p>
             <Link href="/contact" className="inline-block bg-black text-white px-12 py-5 font-black uppercase tracking-widest text-sm hover:translate-x-2 hover:-translate-y-2 transition-transform shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
               Request Corporate Demo
             </Link>
          </div>
        </div>
      </section>

      {/* --- TRUST FOOTER --- */}
      <footer className="py-12 bg-white border-t-2 border-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Backbone Infrastructure</span>
            <div className="flex gap-8 items-center grayscale opacity-60 font-black text-xl italic tracking-tighter text-black">
              <span>FORBES</span>
              <span>TECHCRUNCH</span>
              <span>WIRED</span>
            </div>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">© 2026 hirrd. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ServicesPage;
