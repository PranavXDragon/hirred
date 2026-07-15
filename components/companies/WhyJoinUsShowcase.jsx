"use client";

import React from 'react';
import { ShieldCheck, Rocket, Zap, Coffee, Code, HeartHandshake } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap = {
  Rocket: <Rocket size={24} />,
  ShieldCheck: <ShieldCheck size={24} />,
  Coffee: <Coffee size={24} />,
  Code: <Code size={24} />,
  Zap: <Zap size={24} />,
  HeartHandshake: <HeartHandshake size={24} />
};

const WhyJoinUsShowcase = ({ company }) => {
  const perks = company.perks && company.perks.length > 0 ? company.perks : [
    { iconName: 'Rocket', title: 'Hyper-Growth', desc: 'Join a scaling team working on high-impact products.' },
    { iconName: 'ShieldCheck', title: 'Elite Benefits', desc: 'Top-tier health, dental, and wellness stipends.' },
    { iconName: 'Coffee', title: 'Flexible Culture', desc: 'Remote-first or hybrid. You choose where you do your best work.' },
    { iconName: 'Code', title: 'Modern Stack', desc: 'Work with Next.js, Rust, Go, and the latest AI models.' },
    { iconName: 'Zap', title: 'Fast Execution', desc: 'Zero red tape. Ship code to production on day one.' },
    { iconName: 'HeartHandshake', title: 'Equity Grants', desc: 'Own a piece of the architecture you build.' },
  ];

  return (
    <div className="bg-slate-50 border-[4px] border-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] mt-12">
      <div className="flex items-center gap-4 mb-10 border-b-4 border-black pb-6">
        <div className="w-16 h-16 bg-sky-500 flex items-center justify-center border-4 border-black shrink-0">
          <Zap size={32} className="text-black" />
        </div>
        <div>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">
            Why Join <span className="text-sky-500 italic">{company.name}?</span>
          </h2>
          <p className="text-xs font-black uppercase tracking-widest text-slate-500 mt-2">
            The employer brand showcase
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {perks.map((perk, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(14,165,233,1)] transition-all group"
          >
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4 group-hover:bg-sky-500 group-hover:text-black transition-colors">
              {perk.icon || iconMap[perk.iconName] || <Zap size={24} />}
            </div>
            <h4 className="font-black text-sm uppercase tracking-widest mb-2">{perk.title}</h4>
            <p className="text-xs font-bold text-slate-600 leading-relaxed">{perk.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WhyJoinUsShowcase;
