'use client';
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShieldCheck, Zap, Globe, Cpu, Users, BarChart } from 'lucide-react';
import Link from 'next/link';

const AboutPage = () => {
  const { scrollYProgress } = useScroll();
  
  // Parallax animations for sections
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  const stats = [
    { label: "Active Professionals", value: "25k+", icon: <Users size={20}/> },
    { label: "AI Matching Accuracy", value: "98.8%", icon: <Zap size={20}/> },
    { label: "Enterprise Partners", value: "150+", icon: <Globe size={20}/> },
    { label: "Deployment Speed", value: "2.4x", icon: <BarChart size={20}/> }
  ];

  return (
    <div className="bg-white">
      <section className="relative text-[#000000] py-20 md:py-40 overflow-hidden">
        
        {/* --- Sharp Grid Background --- */}
        <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" 
             style={{ 
               backgroundImage: `linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)`, 
               backgroundSize: '40px 40px' 
             }}>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          
          {/* --- HERO SECTION --- */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-32"
          >
            <div className="flex items-center gap-3 mb-8">
              <span className="h-[2px] w-12 bg-sky-500"></span>
              <span className="text-sky-600 font-bold text-xs md:text-sm tracking-[0.3em] uppercase">
                Protocol 01: Strategic Core
              </span>
            </div>
            
            <h1 className="text-5xl md:text-[120px] font-black tracking-tighter leading-[0.9] text-black mb-12">
              BEYOND THE <br />
              <span className="text-sky-500 italic">STANDARD.</span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
              <p className="text-xl md:text-3xl text-black font-semibold leading-tight max-w-xl">
                hirrd is not a recruitment agency. 
                We are a <span className="underline decoration-sky-500 decoration-4">talent infrastructure</span> company. 
              </p>
              <div className="border-l-4 border-black pl-8">
                <p className="text-sm md:text-lg font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                  Headquartered in Nagpur, operating globally. We solve the latency between demand and high-caliber talent.
                </p>
              </div>
            </div>
          </motion.div>

          {/* --- STATS GRID --- */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 border-2 border-black bg-black mb-32">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                whileHover={{ backgroundColor: "#0ea5e9", color: "#fff" }}
                className="bg-white p-10 transition-all duration-300 group"
              >
                <div className="text-sky-500 group-hover:text-white mb-4 transition-colors">
                  {stat.icon}
                </div>
                <h3 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">{stat.value}</h3>
                <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-sky-100 transition-colors">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* --- THE MANIFESTO (Visual Grid) --- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-32 items-center">
            <div className="lg:col-span-7">
               <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-10">
                 The AI-Driven <br /> <span className="text-sky-500">Validation Layer.</span>
               </h2>
               <div className="space-y-8">
                  {[
                    { title: "Quantum Matching", desc: "Our algorithms analyze 400+ data points per job seeker to ensure cultural and technical synchronization." },
                    { title: "Vetted Ecosystem", desc: "Every professional in our network has passed a 12-point verifiable data validation protocol." },
                    { title: "Scalable Operations", desc: "From seed-stage startups to Fortune 500, our infrastructure scales with your hiring velocity." }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-6 group">
                      <div className="text-xl font-black text-sky-500">0{idx+1}/</div>
                      <div>
                        <h4 className="text-xl font-bold uppercase mb-2 group-hover:text-sky-500 transition-colors">{item.title}</h4>
                        <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
            
            <motion.div 
              style={{ scale }}
              className="lg:col-span-5 bg-slate-100 aspect-square rounded-[40px] relative overflow-hidden flex items-center justify-center border-2 border-black shadow-[20px_20px_0px_0px_rgba(14,165,233,1)]"
            >
               <Cpu size={200} className="text-black opacity-10 absolute animate-pulse" />
               <div className="text-center p-12 relative z-10">
                 <ShieldCheck size={80} className="mx-auto mb-6 text-sky-500" />
                 <p className="text-2xl font-black uppercase tracking-tighter">Verified Protocol <br /> Active</p>
               </div>
            </motion.div>
          </div>

          {/* --- VISION BLOCK --- */}
          <motion.div 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             className="bg-sky-500 p-12 md:p-24 rounded-[50px] text-white flex flex-col md:flex-row justify-between items-center gap-12 mb-32"
          >
             <h2 className="text-4xl md:text-6xl font-black tracking-tighter max-w-2xl leading-tight">
               DEFINING THE NEW <span className="text-black italic">Hiring Standard</span> FOR 2026.
             </h2>
             <div className="w-full md:w-auto">
                <Link href="/services" className="bg-black text-white px-12 py-6 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all w-full md:w-auto inline-block text-center">
                  View Our Services
                </Link>
             </div>
          </motion.div>

          {/* --- CONTACT / CTA --- */}
          <div className="text-center max-w-4xl mx-auto py-20">
            <h3 className="text-2xl md:text-4xl font-bold mb-8 uppercase tracking-widest">Let’s optimize your growth.</h3>
            <p className="text-slate-500 text-lg mb-12 font-medium">
              Join the elite network of companies building with hirrd. 
              Our Nagpur headquarters is ready to facilitate your next expansion.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/contact" className="border-2 border-black px-12 py-5 font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all inline-block text-center">
                Work with us
              </Link>
              <Link href="/dashboard/employer" className="bg-sky-500 text-white px-12 py-5 font-black uppercase tracking-widest shadow-xl shadow-sky-100 hover:bg-sky-600 transition-all inline-block text-center">
                Find Talent
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default AboutPage;
