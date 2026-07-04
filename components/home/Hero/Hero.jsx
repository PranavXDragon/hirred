import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, Sparkles } from 'lucide-react';
// Removed image import, using absolute path in img tag

const Banner = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="relative min-h-screen bg-white flex items-center pt-20 overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-[50%] h-full bg-sky-50/50 -skew-x-12 translate-x-20 -z-10" />

      <div className="max-w-[1150px] mx-auto px-6 w-full py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }}
            className="lg:col-span-6"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <Sparkles size={12} className="text-sky-400" />
              Empowering 5M+ Professionals
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl lg:text-[75px] font-black text-black leading-[0.95] tracking-tighter mb-6 uppercase">
              ELEVATE YOUR <br />
              <span className="text-sky-500 italic">CAREER PATH.</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-lg text-slate-600 max-w-md font-medium leading-relaxed">
              Stop searching, start discovering. Connect with top-tier global 
              opportunities and let your talent define your future.
            </motion.p>
          </motion.div>

          {/* Right Content - Person Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="lg:col-span-5 relative"
          >
            <motion.img 
              src="/images/pic1-removebg-preview.png" 
              alt="Professional" 
              className="w-full h-auto relative z-10 grayscale hover:grayscale-0 transition-all duration-700"
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            />
            
            {/* Minimal Success Card */}
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute top-1/2 -right-6 bg-white border-2 border-black p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] z-20"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-sky-500 rounded-full" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-tighter">New Placement</p>
                  <p className="text-xs font-bold text-slate-500">Sr. Designer at Apple</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
