'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function Card({
  children,
  className = '',
  hover = true,
  onClick,
  selected = false,
}) {
  return (
    <motion.div
      whileHover={hover && onClick ? { y: -2 } : undefined}
      onClick={onClick}
      className={`bg-white border-[3px] border-black p-6 transition-all ${
        selected
          ? 'shadow-[10px_10px_0px_0px_rgba(14,165,233,1)] border-sky-500 bg-sky-50'
          : hover
          ? 'hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]'
          : 'shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}
