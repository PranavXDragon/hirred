'use client';
import React from 'react';
import { ArrowUpDown } from 'lucide-react';

const options = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'newest', label: 'Newest First' },
  { value: 'salary_desc', label: 'Salary (High to Low)' },
  { value: 'salary_asc', label: 'Salary (Low to High)' },
];

export default function SortDropdown({ sortBy, setSortBy }) {
  const [open, setOpen] = React.useState(false);
  const current = options.find(o => o.value === sortBy) || options[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest border-2 border-slate-200 bg-white text-slate-500 hover:border-black hover:text-black transition-all cursor-pointer"
      >
        <ArrowUpDown size={14} />
        {current.label}
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1 w-48 bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-50 py-1">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { setSortBy(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                sortBy === opt.value
                  ? 'bg-black text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
