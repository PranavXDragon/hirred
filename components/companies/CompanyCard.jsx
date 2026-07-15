"use client";

import React from 'react';
import Link from 'next/link';
import { MapPin, Briefcase, ChevronRight, Users, TrendingUp } from 'lucide-react';
import CategoryRatingsBar from './CategoryRatingsBar';

const CompanyCard = ({ company, isSelected, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`group relative bg-white border-[4px] border-black p-6 cursor-pointer transition-all flex flex-col h-full ${
        isSelected 
          ? 'shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] -translate-y-2' 
          : 'hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
      }`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="w-16 h-16 bg-black flex flex-shrink-0 items-center justify-center border-2 border-black shadow-[4px_4px_0px_0px_rgba(14,165,233,1)] text-sky-500 font-black text-2xl uppercase group-hover:scale-105 transition-transform">
          {company.logoText || company.name.charAt(0)}
        </div>
        
        <div className="bg-emerald-100 border-2 border-black px-3 py-1 flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <Briefcase size={12} className="text-emerald-600" />
          <span className="text-[10px] font-black uppercase text-emerald-700 tracking-widest">{company.openJobs} Open Roles</span>
        </div>
      </div>
      
      <div className="space-y-1 mb-6 flex-grow">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter group-hover:text-sky-500 transition-colors">
          {company.name}
        </h2>
        <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500">
          <div className="flex items-center gap-1"><MapPin size={14} className="text-black" /> {company.location}</div>
          <div className="flex items-center gap-1"><TrendingUp size={14} className="text-black" /> {company.industry}</div>
          <div className="flex items-center gap-1"><Users size={14} className="text-black" /> {company.size}</div>
        </div>
      </div>
      
      <div className="mb-8 p-4 bg-slate-50 border-2 border-black">
         <h3 className="text-[10px] font-black uppercase tracking-widest mb-3 border-b-2 border-slate-200 pb-1">Culture Metrics</h3>
         <CategoryRatingsBar ratings={company.culture_ratings} />
      </div>

      <div className="mt-auto">
        <Link 
          href={`/companies/${company.slug}`}
          onClick={(e) => e.stopPropagation()}
          className="w-full bg-black text-white hover:bg-sky-500 hover:text-black transition-all border-2 border-black py-4 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(14,165,233,1)] active:translate-y-1 active:shadow-none"
        >
          Explore Profiles <ChevronRight size={16} />
        </Link>
      </div>
      
      {isSelected && (
        <div className="absolute inset-0 border-4 border-sky-500 pointer-events-none z-10"></div>
      )}
    </div>
  );
};

export default CompanyCard;
