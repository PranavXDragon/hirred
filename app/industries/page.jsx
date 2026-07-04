'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, Building2, Stethoscope, BarChart4, GraduationCap, Plus, Zap 
} from 'lucide-react';

const IndustriesPage = () => {
  const [hoveredIndex, setHoveredIndex] = useState(0);

  const industries = [
    {
      id: "01",
      title: "Technology & IT",
      desc: "Architecting the future with elite talent in AI, Cloud, and Software Engineering for global tech giants.",
      icon: <Cpu size={24} />,
      stats: "12k+ Placements",
    },
    {
      id: "02",
      title: "Real Estate",
      desc: "Connecting visionary developers with experts in project management, sales, and urban planning.",
      icon: <Building2 size={24} />,
      stats: "450+ Projects",
    },
    {
      id: "03",
      title: "Healthcare",
      desc: "Empowering medical institutions with verified professionals in specialized care and hospital management.",
      icon: <Stethoscope size={24} />,
      stats: "85+ Clinics",
    },
    {
      id: "04",
      title: "FinTech",
      desc: "Bridging the gap in the financial sector with experts in risk management, trading, and digital banking.",
      icon: <BarChart4 size={24} />,
      stats: "30+ Partners",
    },
    {
      id: "05",
      title: "Education",
      desc: "Transforming the learning landscape by connecting institutions with innovative educators and trainers.",
      icon: <GraduationCap size={24} />,
      stats: "200+ Institutions",
    }
  ];

  return (
    <div className="bg-white pt-20 relative">
      
      {/* --- Global Square Grid Background --- */}
      <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none" 
           style={{ 
             backgroundImage: `linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)`, 
             backgroundSize: '40px 40px' 
           }}>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative py-16 md:py-24 border-b-2 border-black z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] mb-6"
          >
            <Zap size={12} className="text-sky-400" fill="currentColor" />
            Industry Verticals
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tight leading-[0.9] uppercase mb-8"
          >
            Global Sectors. <br />
            <span className="text-sky-500 italic">Unlimited Reach.</span>
          </motion.h1>

          <p className="text-slate-500 font-bold uppercase text-[10px] md:text-xs tracking-[0.3em] border-b-2 border-black pb-4 inline-block">
            Protocol-driven recruitment infrastructure
          </p>
        </div>
      </section>

      {/* --- INTERACTIVE ACCORDION --- */}
      <section className="py-12 md:py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-12">
          
          <div className="flex flex-col lg:flex-row h-auto lg:h-[550px] gap-4">
            {industries.map((item, index) => (
              <motion.div
                key={item.id}
                // Desktop: Hover triggers it
                onMouseEnter={() => setHoveredIndex(index)}
                // Mobile: Jab scroll hokar card center mein aaye (amount: 0.6 means 60% card dikhne par)
                onViewportEnter={() => {
                  if (window.innerWidth < 1024) setHoveredIndex(index);
                }}
                viewport={{ amount: 0.6 }}
                className={`relative cursor-pointer transition-all duration-700 ease-[0.23, 1, 0.32, 1] border-[3px] border-black overflow-hidden
                  ${hoveredIndex === index 
                    ? 'lg:flex-[4] bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]' 
                    : 'lg:flex-1 bg-slate-50 lg:opacity-60 lg:grayscale'
                  }
                  min-h-[120px] lg:min-h-full p-6 md:p-10 flex flex-col justify-between`}
              >
                
                {/* ID & Icon Row */}
                <div className="flex items-center justify-between mb-4 lg:mb-0">
                  <span className={`text-xl font-black transition-colors ${hoveredIndex === index ? 'text-sky-500' : 'text-black/20'}`}>
                    {item.id}
                  </span>
                  <div className={`w-12 h-12 md:w-14 md:h-14 border-2 border-black flex items-center justify-center transition-all duration-500 
                    ${hoveredIndex === index ? 'bg-black text-white scale-110 shadow-[4px_4px_0px_0px_rgba(14,165,233,1)]' : 'bg-white text-black'}
                  `}>
                    {item.icon}
                  </div>
                </div>

                {/* Content Area */}
                <div className="relative">
                  <h3 className={`font-black uppercase tracking-tighter transition-all duration-500 
                    ${hoveredIndex === index 
                      ? 'text-2xl md:text-4xl text-black mb-4' 
                      : 'text-xl text-black lg:rotate-[-90deg] lg:absolute lg:bottom-16 lg:left-[-80px] lg:w-[350px] lg:text-center'}
                  `}>
                    {item.title}
                  </h3>

                  <AnimatePresence>
                    {hoveredIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-slate-600 font-bold leading-tight max-w-sm mb-6 text-sm md:text-lg">
                          {item.desc}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <button className="flex items-center gap-3 bg-black text-white px-6 py-3 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-sky-500 transition-all shadow-[4px_4px_0px_0px_rgba(14,165,233,1)]">
                            Explore <Plus size={14} />
                          </button>
                          <span className="text-[10px] font-black uppercase text-sky-600 bg-sky-50 px-2 py-1">
                             {item.stats}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Top Sky-Blue Bar (Active only) */}
                {hoveredIndex === index && (
                  <div className="absolute top-0 left-0 w-full h-[6px] bg-sky-500"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="py-16 md:py-24 bg-black text-white relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase mb-8">Ready to Scale?</h2>
          <button className="bg-sky-500 text-black px-10 py-4 font-black uppercase tracking-widest text-xs hover:bg-white transition-all shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
            Contact Industry Expert
          </button>
        </div>
      </section>

    </div>
  );
};

export default IndustriesPage;
