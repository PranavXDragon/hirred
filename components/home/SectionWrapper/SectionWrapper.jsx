'use client';
import React from 'react';
import { motion } from 'framer-motion';

const SectionWrapper = ({ 
  children, 
  isDark = false, 
  id = '', 
  className = '', 
  noPadding = false 
}) => {
  return (
    <section 
      id={id}
      className={`
        relative overflow-hidden w-full
        ${isDark ? 'bg-navy text-white' : 'bg-offwhite text-slate'}
        ${noPadding ? '' : 'py-24 md:py-32'}
        ${className}
      `}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
};

export default SectionWrapper;
