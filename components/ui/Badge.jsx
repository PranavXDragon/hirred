import React from 'react';

const colors = {
  default: 'bg-slate-100 text-slate-600 border-slate-300',
  primary: 'bg-sky-500 text-black border-sky-600',
  dark: 'bg-black text-white border-black',
  success: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  warning: 'bg-amber-100 text-amber-700 border-amber-300',
  danger: 'bg-red-100 text-red-700 border-red-300',
};

export default function Badge({
  children,
  color = 'default',
  className = '',
}) {
  return (
    <span
      className={`inline-block border px-2 py-1 text-[9px] font-black uppercase tracking-widest ${colors[color]} ${className}`}
    >
      {children}
    </span>
  );
}
