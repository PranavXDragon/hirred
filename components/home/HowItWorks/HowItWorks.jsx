'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Search, UserCheck, Briefcase } from 'lucide-react';
import SectionWrapper from '../SectionWrapper/SectionWrapper';

const steps = [
  {
    icon: Search,
    title: 'Discover',
    description: 'Browse thousands of vetted opportunities from top-tier companies across every industry vertical.',
    color: 'bg-sky-500',
  },
  {
    icon: UserCheck,
    title: 'Apply Smartly',
    description: 'Use AI-powered resume builder and one-click apply to put your best foot forward instantly.',
    color: 'bg-black',
  },
  {
    icon: Briefcase,
    title: 'Land Your Role',
    description: 'Get real-time updates, schedule interviews, and receive offers — all within one platform.',
    color: 'bg-sky-500',
  },
];

export default function HowItWorks() {
  return (
    <SectionWrapper id="how-it-works">
      <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] mb-6"
        >
          How It Works
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-black uppercase tracking-tight"
        >
          From Discovery to <span className="text-sky-500 italic">Hire</span>
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="relative text-center group"
          >
            <div className="relative inline-flex mb-8">
              <div className={`w-20 h-20 ${step.color} border-[3px] border-black flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[4px_4px_0px_0px_rgba(14,165,233,1)] transition-all`}>
                <step.icon size={32} className="text-white" />
              </div>
              <span className="absolute -top-3 -right-3 w-8 h-8 bg-white border-2 border-black flex items-center justify-center text-xs font-black">
                {i + 1}
              </span>
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight mb-3">{step.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
            {i < steps.length - 1 && (
              <div className="hidden md:block absolute top-10 -right-6 text-slate-300 text-2xl font-black">→</div>
            )}
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
