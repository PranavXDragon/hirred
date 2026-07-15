'use client';
import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-black text-white border-black hover:bg-sky-500 hover:text-black shadow-[6px_6px_0px_0px_rgba(14,165,233,1)]',
  secondary: 'bg-white text-black border-black hover:bg-slate-50 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]',
  ghost: 'bg-transparent text-black border-transparent hover:bg-slate-100',
  danger: 'bg-red-600 text-white border-red-600 hover:bg-red-700 shadow-[6px_6px_0px_0px_rgba(220,38,38,0.3)]',
};

const sizes = {
  sm: 'px-4 py-2 text-[10px]',
  md: 'px-6 py-3 text-xs',
  lg: 'px-8 py-4 text-sm',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  href,
  onClick,
  disabled = false,
  type = 'button',
  ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-black uppercase tracking-widest border-[3px] transition-all active:translate-y-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0';
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <motion.a
        href={href}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cls}
        {...props}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={cls}
      {...props}
    >
      {children}
    </motion.button>
  );
}
