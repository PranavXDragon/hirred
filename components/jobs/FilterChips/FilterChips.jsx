'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';

const filters = [
  { key: 'pay', label: 'Pay' },
  { key: 'remote', label: 'Remote' },
  { key: 'type', label: 'Job Type' },
  { key: 'experience', label: 'Experience' },
];

const options = {
  pay: ['₹0 - ₹10L', '₹10L - ₹20L', '₹20L - ₹30L', '₹30L+'],
  remote: ['Remote', 'Hybrid', 'On-site'],
  type: ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Freelance'],
  experience: ['Fresher', '1-3 Years', '3-5 Years', '5-8 Years', '8+ Years'],
};

export default function FilterChips({ activeFilters, setActiveFilters }) {
  const [openDropdown, setOpenDropdown] = React.useState(null);

  const toggleFilter = (key, value) => {
    const current = activeFilters[key] || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    setActiveFilters({ ...activeFilters, [key]: updated });
  };

  const totalActive = Object.values(activeFilters).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      {filters.map(({ key, label }) => {
        const selected = activeFilters[key] || [];
        const isActive = selected.length > 0;
        return (
          <div key={key} className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === key ? null : key)}
              className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest border-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(14,165,233,1)]'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-black hover:text-black'
              }`}
            >
              {label}
              {isActive && <span className="bg-sky-500 text-black text-[8px] px-1.5 py-0.5 font-black">{selected.length}</span>}
              <ChevronDown size={14} className={`transition-transform ${openDropdown === key ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {openDropdown === key && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute top-full left-0 mt-1 w-52 bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-50 p-2"
                >
                  {options[key].map((opt) => {
                    const isChecked = selected.includes(opt);
                    return (
                      <label
                        key={opt}
                        className={`flex items-center gap-3 px-3 py-2 text-xs font-bold cursor-pointer transition-all ${
                          isChecked ? 'bg-sky-50 text-black' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleFilter(key, opt)}
                          className="w-4 h-4 border-2 border-black accent-black"
                        />
                        {opt}
                      </label>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {totalActive > 0 && (
        <button
          onClick={() => setActiveFilters({ pay: [], remote: [], type: [], experience: [] })}
          className="flex items-center gap-1 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 transition-all cursor-pointer"
        >
          <X size={14} /> Clear ({totalActive})
        </button>
      )}
    </div>
  );
}
