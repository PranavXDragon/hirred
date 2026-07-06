import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const About = () => {
  const { scrollYProgress } = useScroll();
  
  // Parallax effect for CTA - subtle for mobile
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  return (
    <section className="relative bg-white text-[#000000] py-16 md:py-32 overflow-hidden">
      
      {/* --- Sharp Grid Background --- */}
      <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" 
           style={{ 
             backgroundImage: `linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)`, 
             backgroundSize: '40px 40px' 
           }}>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">
        
        {/* --- Section 01: Hero Content --- */}
        <motion.div 
          style={{ opacity }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 md:mb-40"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="h-[2px] w-10 md:w-16 bg-sky-500"></span>
            <span className="text-sky-600 font-bold text-[10px] md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase">
              Protocol 01: Strategic Core
            </span>
          </div>
          
          <h2 className="text-4xl sm:text-6xl md:text-[100px] font-black tracking-tighter leading-[1.1] md:leading-[0.9] mb-8 md:mb-12 text-black break-words">
            WE BUILD THE <br />
            <span className="text-sky-500 italic">INFRASTRUCTURE</span> <br className="hidden md:block" />
            FOR ELITE TALENT.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            <p className="text-lg md:text-2xl text-black font-medium leading-tight">
              Traditional hiring is broken. We operate with **absolute precision**, 
              connecting high-growth companies with the world's most resilient professionals.
            </p>
            <div className="flex flex-col justify-end">
               <div className="h-[2px] bg-black w-full mb-4 md:mb-6"></div>
               <p className="text-xs md:text-sm font-bold text-black uppercase tracking-widest">
                 Optimizing human capital through high-performance algorithms.
               </p>
            </div>
          </div>
        </motion.div>

        {/* --- Section 02: Value Props (Stacked on Mobile, Grid on Desktop) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 bg-black border-2 border-black overflow-hidden">
          {[
            { title: "Scalable Infrastructure", desc: "Built to handle enterprise-level recruitment cycles with zero latency." },
            { title: "Verifiable Data", desc: "Every candidate profile is cross-referenced through a 12-point validation check." },
            { title: "Privacy First", desc: "Military-grade encryption for all corporate and candidate interactions." }
          ].map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white p-6 md:p-14 hover:bg-sky-500 hover:text-white transition-all duration-500 group border-b-2 md:border-b-0 md:border-r-2 border-black last:border-b-0 last:border-r-0"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 border-2 border-black flex items-center justify-center text-[10px] font-black mb-12 md:mb-24 group-hover:bg-black group-hover:text-white group-hover:border-black transition-all">
                0{index + 1}
              </div>
              <h4 className="text-xl md:text-2xl font-black uppercase mb-3 tracking-tighter">{item.title}</h4>
              <p className="text-sm md:text-lg font-medium opacity-80 leading-snug">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* --- Section 03: The CTA Box --- */}
        <motion.div 
          style={{ y: y1 }}
          className="mt-24 md:mt-48 bg-black p-8 sm:p-10 md:p-20 text-center relative overflow-hidden"
        >
          {/* Sky Blue Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-sky-500/10 blur-[80px] md:blur-[150px]"></div>
          
          <h3 className="text-2xl md:text-6xl text-white font-bold tracking-tighter mb-8 md:mb-12 relative z-10 leading-tight">
            READY TO ACCESS THE <br /> 
            <span className="text-sky-400 italic font-black">NEXT GENERATION?</span>
          </h3>
          
          <motion.button 
            onClick={() => window.location.href = '/register'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative z-10 w-full md:w-auto px-10 md:px-16 py-4 md:py-5 bg-white text-black font-black tracking-[0.2em] uppercase text-[10px] md:text-sm border-2 border-white hover:bg-sky-500 hover:text-black transition-all"
          >
            Get Started
          </motion.button>
        </motion.div>

      </div>
    </section>
  );
};

export default About;
