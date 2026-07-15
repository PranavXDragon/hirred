'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import SectionWrapper from '../SectionWrapper/SectionWrapper';
import AnimatedCounter from '../../ui/AnimatedCounter';
import Button from '../../ui/Button';

const stats = [
  { end: 10000, label: 'Active Jobs' },
  { end: 500, label: 'Partner Companies' },
  { end: 50000, label: 'Successful Placements' },
  { end: 95, suffix: '%', label: 'Satisfaction Rate' },
];

export default function StatsAndCTA() {
  return (
    <SectionWrapper isDark id="stats-cta">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-16 md:mb-20">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <AnimatedCounter
              end={stat.end}
              suffix={stat.suffix || ''}
              label={stat.label}
            />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto text-center"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-6">
          <Sparkles size={12} className="text-sky-400" />
          Ready to Begin?
        </div>
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">
          Your Next Opportunity <span className="text-sky-400 italic">Awaits</span>
        </h2>
        <p className="text-sm text-white/60 max-w-lg mx-auto mb-8 leading-relaxed">
          Join thousands of professionals who have already found their dream careers through Hirrd.
          No spam. No noise. Just quality opportunities matched to your skills.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            href="/register"
            variant="primary"
            size="lg"
            className="!shadow-[6px_6px_0px_0px_rgba(14,165,233,1)]"
          >
            Get Started Free <ArrowRight size={16} />
          </Button>
          <Button
            href="/jobs"
            variant="secondary"
            size="lg"
          >
            Browse Jobs
          </Button>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
