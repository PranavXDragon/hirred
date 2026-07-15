'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play, ArrowRight, Building2 } from 'lucide-react';
import SectionWrapper from '../SectionWrapper/SectionWrapper';

const companies = [
  {
    name: 'Google',
    tagline: 'Build the future of information',
    description: 'Join the team that organizes the world\'s information and makes it universally accessible and useful. From search to cloud, every project redefines what\'s possible.',
    positions: 24,
    logo: 'G',
    color: 'bg-sky-500',
  },
  {
    name: 'Microsoft',
    tagline: 'Empower every person and organization',
    description: 'Be at the forefront of AI, cloud computing, and productivity. Microsoft is creating the tools and platforms that drive digital transformation worldwide.',
    positions: 18,
    logo: 'M',
    color: 'bg-black',
  },
  {
    name: 'Stripe',
    tagline: 'Build the economic infrastructure',
    description: 'Help build the most powerful payment platform on the internet. Stripe is looking for engineers who want to solve complex problems at massive scale.',
    positions: 12,
    logo: 'S',
    color: 'bg-sky-500',
  },
  {
    name: 'Figma',
    tagline: 'Make design accessible to all',
    description: 'Join the company changing how teams design and build products together. Figma is redefining collaborative design with cutting-edge web technology.',
    positions: 8,
    logo: 'F',
    color: 'bg-black',
  },
];

export default function CompanySpotlights() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const total = companies.length;

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [isPlaying, next]);

  const company = companies[current];

  return (
    <SectionWrapper isDark id="company-spotlights">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block px-3 py-1 bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-6"
        >
          Featured Companies
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white"
        >
          Where Top Talent <span className="text-sky-400 italic">Thrives</span>
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 border-[3px] border-white/20 bg-white/5">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2 p-8 md:p-12 flex flex-col justify-center"
          >
            <div className={`w-16 h-16 ${company.color} border-2 border-white flex items-center justify-center text-2xl font-black text-white mb-6`}>
              {company.logo}
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-2">
              {company.name}
            </h3>
            <p className="text-sm text-sky-400 font-bold uppercase tracking-widest mb-4">
              {company.tagline}
            </p>
            <p className="text-sm text-white/70 leading-relaxed mb-6">
              {company.description}
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs font-black text-white uppercase tracking-widest bg-white/10 px-3 py-1">
                {company.positions} Open Positions
              </span>
              <button className="flex items-center gap-1 text-xs font-black text-sky-400 uppercase tracking-widest hover:text-white transition-colors cursor-pointer">
                View Jobs <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="lg:col-span-3 bg-white/5 min-h-[300px] flex items-center justify-center border-t lg:border-t-0 lg:border-l border-white/10">
          <div className="text-center p-8">
            <Building2 size={64} className="mx-auto text-white/20 mb-4" />
            <p className="text-white/40 text-xs font-black uppercase tracking-widest">
              Company Branding
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={prev}
          className="p-3 bg-white/10 border border-white/20 text-white hover:bg-white hover:text-black transition-all cursor-pointer"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-3 bg-white/10 border border-white/20 text-white hover:bg-white hover:text-black transition-all cursor-pointer"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>

        <span className="text-xs font-black text-white/50 uppercase tracking-widest">
          {current + 1} / {total}
        </span>

        <div className="flex gap-2 ml-2">
          {companies.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 border transition-all cursor-pointer ${
                i === current ? 'bg-sky-400 border-sky-400' : 'bg-white/20 border-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="p-3 bg-white/10 border border-white/20 text-white hover:bg-white hover:text-black transition-all cursor-pointer"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </SectionWrapper>

  );
}
