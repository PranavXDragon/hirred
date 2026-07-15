'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from 'lucide-react';
import SectionWrapper from '../SectionWrapper/SectionWrapper';

const stories = [
  {
    name: 'Priya Sharma',
    role: 'Senior Frontend Engineer',
    company: 'Google',
    quote: 'Hirrd transformed how I approached my job search. The AI resume builder helped me highlight exactly what top tech companies look for. I had three offers within two weeks.',
    initials: 'PS',
  },
  {
    name: 'Rahul Verma',
    role: 'Product Designer',
    company: 'Figma',
    quote: 'The mentorship sessions were a game-changer. My mentor helped me build a portfolio that landed me my dream role. The platform\'s focus on quality over quantity made all the difference.',
    initials: 'RV',
  },
  {
    name: 'Ananya Patel',
    role: 'ML Engineer',
    company: 'Microsoft',
    quote: 'I was skeptical about yet another job platform, but Hirrd felt different from day one. The personalized job matches and real-time application tracking made the process transparent and stress-free.',
    initials: 'AP',
  },
  {
    name: 'Arjun Nair',
    role: 'DevOps Lead',
    company: 'Stripe',
    quote: 'What sets Hirrd apart is the genuine care for candidates. The instant notifications, streamlined applications, and honest company reviews helped me make the right career move.',
    initials: 'AN',
  },
];

export default function SuccessStories() {
  const [current, setCurrent] = useState(0);

  const story = stories[current];

  return (
    <SectionWrapper id="success-stories">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] mb-6"
        >
          Success Stories
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-black uppercase tracking-tight"
        >
          Real People, Real <span className="text-sky-500 italic">Impact</span>
        </motion.h2>
      </div>

      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="border-[3px] border-black p-8 md:p-12 bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <Quote size={48} className="text-sky-500 mb-6" />
              <blockquote className="text-lg md:text-xl font-medium leading-relaxed mb-8 text-slate-700">
                &ldquo;{story.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-black border-2 border-black flex items-center justify-center text-white font-black text-sm">
                  {story.initials}
                </div>
                <div>
                  <p className="font-black uppercase tracking-tight">{story.name}</p>
                  <p className="text-xs text-slate-500 font-bold">
                    {story.role} at <span className="text-sky-600">{story.company}</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-3 mt-8">
          {stories.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-10 h-10 border-2 font-black text-xs transition-all cursor-pointer ${
                i === current
                  ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(14,165,233,1)]'
                  : 'bg-white text-slate-400 border-slate-200 hover:border-black hover:text-black'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
