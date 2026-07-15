'use client';
import React from 'react';
import { motion } from 'framer-motion';

const stages = [
  {
    title: 'APPLICATION REVIEW',
    subtitle: 'INITIAL AUTOMATED SCREENING',
  },
  {
    title: 'TECHNICAL ASSESSMENT',
    subtitle: 'TAKE-HOME CODING CHALLENGE',
  },
  {
    title: 'ARCHITECTURE INTERVIEW',
    subtitle: 'SYSTEM DESIGN WITH CORE TEAM',
  },
  {
    title: 'FINAL PROTOCOL',
    subtitle: 'OFFER & ONBOARDING',
  },
];

export default function RecruitmentProtocolStages() {
  return (
    <div className="flex items-center justify-center p-4 md:p-8 w-full font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-4xl bg-white border-2 border-black p-10 md:p-16"
        style={{
          boxShadow: '12px 12px 0px 0px rgba(0,0,0,1)'
        }}
      >
        <h2 className="text-xl md:text-2xl font-black tracking-widest text-[#0f172a] mb-6">
          RECRUITMENT PROTOCOL STAGES
        </h2>
        <div className="h-0.5 w-full bg-black mb-12"></div>
        
        <div className="relative pl-2 md:pl-4">
          {stages.map((stage, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 + 0.2, ease: "easeOut" }}
              className="relative mb-16 last:mb-0 group cursor-default"
            >
              {/* Vertical Line connecting the circles */}
              {index !== stages.length - 1 && (
                <div className="absolute left-[11px] top-8 bottom-[-64px] w-[2px] bg-slate-200 group-hover:bg-blue-600 transition-colors duration-300"></div>
              )}
              
              <div className="flex items-start gap-8 md:gap-10">
                {/* Circle Indicator */}
                <div className="relative z-10 flex items-center justify-center w-[24px] h-[24px] rounded-full border-[2.5px] border-slate-300 bg-white shrink-0 mt-1 group-hover:border-blue-600 group-hover:scale-110 transition-all duration-300">
                  <div className="w-[8px] h-[8px] rounded-full border-[2px] border-slate-300 group-hover:border-blue-600 group-hover:bg-blue-600 transition-all duration-300"></div>
                </div>
                
                {/* Content */}
                <div className="flex flex-col">
                  <h3 className="text-lg md:text-xl font-bold text-slate-500 tracking-[0.15em] mb-1 group-hover:text-slate-900 transition-colors duration-300">
                    {stage.title}
                  </h3>
                  <p className="text-sm md:text-base font-bold text-slate-400 tracking-wider group-hover:text-slate-600 transition-colors duration-300">
                    {stage.subtitle}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
