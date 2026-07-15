import React from 'react';

export default function SectionDivider({
  label,
  className = '',
}) {
  return (
    <div className={`flex items-center gap-4 my-4 ${className}`}>
      <div className="flex-1 h-[3px] bg-black" />
      {label && (
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex-shrink-0">
          {label}
        </span>
      )}
      <div className="flex-1 h-[3px] bg-black" />
    </div>
  );
}
