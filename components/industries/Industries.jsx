import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, Building2, Stethoscope, BarChart4, GraduationCap, Plus, Zap 
} from 'lucide-react';

const Industries = () => {
  const [hoveredIndex, setHoveredIndex] = useState(0);

  const industries = [
    {
      id: "01",
      title: "Technology & IT",
      desc: "Architecting the future with elite talent in AI, Cloud, and Software Engineering for global tech giants.",
      icon: <Cpu size={28} />,
    },
    {
      id: "02",
      title: "Real Estate",
      desc: "Connecting visionary developers with experts in project management, sales, and urban planning.",
      icon: <Building2 size={28} />,
    },
    {
      id: "03",
      title: "Healthcare",
      desc: "Empowering medical institutions with verified professionals in specialized care and hospital management.",
      icon: <Stethoscope size={28} />,
    },
    {
      id: "04",
      title: "FinTech",
      desc: "Bridging the gap in the financial sector with experts in risk management, trading, and digital banking.",
      icon: <BarChart4 size={28} />,
    },
    {
      id: "05",
      title: "Education",
      desc: "Transforming the learning landscape by connecting institutions with innovative educators and trainers.",
      icon: <GraduationCap size={28} />,
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden border-t-2 border-black">
      
      {/* Background Grid Pattern (New Sharp Grid) */}
      <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none" 
           style={{ 
             backgroundImage: `linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)`, 
             backgroundSize: '40px 40px' 
           }}>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] mb-6"
            >
              <Zap size={12} className="text-sky-400" fill="currentColor" />
              Industry Verticals
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-7xl font-black text-black tracking-tighter leading-[0.9]"
            >
              GLOBAL SECTORS. <br />
              <span className="text-sky-500 italic font-black">UNLIMITED REACH.</span>
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="hidden md:block text-slate-500 font-bold uppercase text-[11px] tracking-[0.3em] border-b-2 border-black pb-2"
          >
            Protocol-driven recruitment
          </motion.p>
        </div>

        {/* --- Interactive Accordion --- */}
        <div className="flex flex-col lg:flex-row h-auto lg:h-[550px] gap-4">
          {industries.map((item, index) => (
            <motion.div
              key={item.id}
              // Mobile Logic: Scroll par activate hoga
              onViewportEnter={() => {
                if (window.innerWidth < 1024) setHoveredIndex(index);
              }}
              viewport={{ amount: 0.6 }} // Jab card 60% dikhne lage tab trigger ho
              
              // Desktop Logic: Hover par activate hoga
              onMouseEnter={() => setHoveredIndex(index)}
              
              className={`relative transition-all duration-700 ease-[0.23, 1, 0.32, 1] border-[3px] border-black overflow-hidden
                ${hoveredIndex === index 
                  ? 'lg:flex-[4] bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]' 
                  : 'lg:flex-1 bg-slate-50 lg:opacity-60 lg:grayscale'
                }
                min-h-[140px] lg:min-h-full p-6 lg:p-10 flex flex-col justify-between`}
            >
              
              {/* Card Top: ID & Icon */}
              <div className="flex items-center justify-between lg:mb-0 mb-4">
                <span className={`text-xl lg:text-2xl font-black transition-colors ${hoveredIndex === index ? 'text-sky-500' : 'text-black/20'}`}>
                  {item.id}
                </span>
                <div className={`w-12 h-12 lg:w-14 lg:h-14 border-2 border-black flex items-center justify-center transition-all duration-500 
                  ${hoveredIndex === index ? 'bg-black text-white scale-110 shadow-[4px_4px_0px_0px_rgba(14,165,233,1)]' : 'bg-white text-black'}
                `}>
                  {item.icon}
                </div>
              </div>

              {/* Card Body */}
              <div className="relative">
                <h3 className={`font-black uppercase tracking-tighter transition-all duration-500 
                  ${hoveredIndex === index 
                    ? 'text-2xl md:text-4xl text-black mb-4' 
                    : 'text-xl text-black lg:rotate-[-90deg] lg:absolute lg:bottom-16 lg:left-[-80px] lg:w-[350px] lg:text-center'}
                `}>
                  {item.title}
                </h3>

                <AnimatePresence mode="wait">
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
                      <Link href="/industries" className="flex items-center gap-3 bg-black text-white px-6 py-3 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-sky-500 hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(14,165,233,1)] inline-flex w-fit">
                        Explore <Plus size={14} />
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Top Accent */}
              {hoveredIndex === index && (
                <div className="absolute top-0 left-0 w-full h-[6px] bg-sky-500"></div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Industries;
