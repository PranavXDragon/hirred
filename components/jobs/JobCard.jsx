"use client";

import React from 'react';
import { Clock, MapPin, DollarSign, Code, ChevronRight, ShieldCheck } from 'lucide-react';

const JobCard = ({ job, isSelected, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`group relative bg-white border-[3px] border-black p-6 cursor-pointer transition-all ${
        isSelected 
          ? 'shadow-[10px_10px_0px_0px_rgba(14,165,233,1)] translate-x-1 border-sky-500 bg-sky-50' 
          : 'hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1'
      }`}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-sky-500 text-black px-2 py-1 text-[9px] font-black uppercase tracking-tighter border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {job.type}
          </span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <Clock size={12}/> {job.posted}
          </span>
        </div>
        
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter group-hover:text-sky-600 transition-colors">
            {job.role}
          </h2>
          <p className="text-xs font-black text-sky-500 uppercase tracking-wider italic">{job.company}</p>
        </div>

        <div className="flex flex-wrap gap-3 text-xs font-bold text-slate-500">
          <div className="flex items-center gap-1"><MapPin size={14} className="text-black" /> {job.location}</div>
          <div className="flex items-center gap-1"><DollarSign size={14} className="text-black" /> {job.salary}</div>
        </div>
        
        <div className="pt-2 flex flex-wrap gap-2">
          {job.stack.slice(0, 4).map(s => (
            <span key={s} className="bg-slate-100 text-slate-600 border border-slate-300 px-2 py-1 text-[9px] font-black uppercase tracking-widest">
              {s}
            </span>
          ))}
          {job.stack.length > 4 && (
            <span className="bg-slate-100 text-slate-600 border border-slate-300 px-2 py-1 text-[9px] font-black uppercase tracking-widest">
              +{job.stack.length - 4}
            </span>
          )}
        </div>
      </div>

      {isSelected && (
        <div className="absolute top-0 right-0 p-4">
            <ShieldCheck className="text-sky-500 animate-pulse" size={30} />
        </div>
      )}
    </div>
  );
};

export default JobCard;
