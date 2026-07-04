import React from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Search, 
  LineChart, 
  ShieldCheck, 
  UserCircle, 
  BellRing,
  ArrowUpRight,
  Zap
} from 'lucide-react';

const Services = () => {
  const serviceList = [
    {
      title: "Direct Recruitment",
      desc: "Connect directly with verified hiring managers from top global enterprises.",
      icon: <Briefcase size={22} />,
    },
    {
      title: "Advanced Search",
      desc: "Precision filters for salary, tech-stack, and remote-first environments.",
      icon: <Search size={22} />,
    },
    {
      title: "Career Insights",
      desc: "Real-time data on industry salary benchmarks and emerging skill demands.",
      icon: <LineChart size={22} />,
    },
    {
      title: "Identity Protocol",
      desc: "Verified badges increase profile visibility by 300% for premium recruiters.",
      icon: <ShieldCheck size={22} />,
    },
    {
      title: "Expert Consulting",
      desc: "Strategic resume optimization and mock sessions with industry veterans.",
      icon: <UserCircle size={22} />,
    },
    {
      title: "Smart Job Alerts",
      desc: "Zero-latency notifications for opportunities that match your precise DNA.",
      icon: <BellRing size={22} />,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
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
    <section className="py-24 bg-white border-t-2 border-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-20">
          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500 text-black text-[10px] font-black uppercase tracking-[0.2em] mb-6"
            >
              <Zap size={12} fill="currentColor" />
              Core Capabilities
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl lg:text-7xl font-black text-black tracking-tighter leading-[0.95]"
            >
              ENGINEERED FOR <br />
              <span className="text-sky-500 italic">PROFESSIONAL EXCELLENCE.</span>
            </motion.h2>
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-slate-500 font-medium max-w-sm text-lg leading-snug lg:mb-2"
          >
            We don&apos;t just list jobs; we provide the technical ecosystem required to navigate the modern career landscape.
          </motion.p>
        </div>

        {/* Services Grid with High-Contrast UI */}
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
                <div className="text-slate-300 font-black text-4xl group-hover:text-sky-100 transition-colors">
                  0{index + 1}
                </div>
              </div>

              <h3 className="text-2xl font-black text-black uppercase tracking-tighter mb-4 group-hover:text-sky-600">
                {service.title}
              </h3>
              
              <p className="text-slate-600 font-medium leading-relaxed mb-8">
                {service.desc}
              </p>

              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/40 group-hover:text-sky-500 transition-colors">
                Explore Protocol <ArrowUpRight size={14} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Dynamic Footer */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-24 border-t-2 border-slate-100 pt-12 flex flex-col md:flex-row justify-between items-center gap-8"
        >
          <div className="flex items-center gap-6">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Trusted By</span>
            <div className="flex gap-8 items-center grayscale opacity-60 font-black text-xl italic tracking-tighter text-black">
              <span>FORBES</span>
              <span>TECHCRUNCH</span>
              <span>WIRED</span>
            </div>
          </div>
          
          <button className="px-8 py-4 bg-black text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-sky-500 transition-all shadow-[6px_6px_0px_0px_rgba(14,165,233,1)]">
            View All Services
          </button>
        </motion.div>

      </div>
    </section>
  );
};

export default Services;
