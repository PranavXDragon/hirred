"use client";

import React from 'react';
import { X, Check, Minus } from 'lucide-react';
import CategoryRatingsBar from './CategoryRatingsBar';

const CompanyCompare = ({ companyA, companyB, onClose }) => {
  if (!companyA || !companyB) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-12 overflow-y-auto">
      <div className="bg-white border-[4px] border-black w-full max-w-6xl shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] flex flex-col max-h-full">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 md:p-8 border-b-[4px] border-black bg-sky-50 sticky top-0 z-10">
          <h2 className="text-3xl font-black uppercase tracking-tighter">
            Protocol <span className="text-sky-500 italic">Compare.</span>
          </h2>
          <button 
            onClick={onClose}
            className="w-12 h-12 bg-black text-white flex items-center justify-center hover:bg-rose-500 transition-colors border-2 border-black"
          >
            <X size={24} />
          </button>
        </div>

        {/* Comparison Body */}
        <div className="flex-grow overflow-y-auto p-6 md:p-10">
          <div className="grid grid-cols-3 gap-0 border-4 border-black bg-slate-50">
            
            {/* Headers Row */}
            <div className="p-6 border-b-4 border-r-4 border-black flex items-center justify-center bg-black text-white">
              <span className="font-black uppercase tracking-widest text-xs">Metric</span>
            </div>
            <div className="p-6 border-b-4 border-r-4 border-black text-center bg-white flex flex-col items-center">
              <div className="w-16 h-16 bg-black flex items-center justify-center border-2 border-black text-sky-500 font-black text-2xl uppercase mb-2">
                {companyA.logoText || companyA.name.charAt(0)}
              </div>
              <h3 className="font-black uppercase tracking-tighter text-xl">{companyA.name}</h3>
            </div>
            <div className="p-6 border-b-4 border-black text-center bg-white flex flex-col items-center">
              <div className="w-16 h-16 bg-black flex items-center justify-center border-2 border-black text-emerald-500 font-black text-2xl uppercase mb-2">
                {companyB.logoText || companyB.name.charAt(0)}
              </div>
              <h3 className="font-black uppercase tracking-tighter text-xl">{companyB.name}</h3>
            </div>

            {/* Industry Row */}
            <div className="p-4 border-b-2 border-r-4 border-black flex items-center font-black uppercase text-xs tracking-widest text-slate-500">
              Industry Domain
            </div>
            <div className="p-4 border-b-2 border-r-4 border-black text-center font-bold text-sm bg-white">
              {companyA.industry}
            </div>
            <div className="p-4 border-b-2 border-black text-center font-bold text-sm bg-white">
              {companyB.industry}
            </div>

            {/* Size Row */}
            <div className="p-4 border-b-4 border-r-4 border-black flex items-center font-black uppercase text-xs tracking-widest text-slate-500">
              Headcount
            </div>
            <div className="p-4 border-b-4 border-r-4 border-black text-center font-bold text-sm bg-white">
              {companyA.size}
            </div>
            <div className="p-4 border-b-4 border-black text-center font-bold text-sm bg-white">
              {companyB.size}
            </div>

            {/* Culture Ratings (Takes full width per cell for the bars) */}
            <div className="p-6 border-b-4 border-r-4 border-black font-black uppercase text-xs tracking-widest text-slate-500 flex items-center">
              Culture Metrics
            </div>
            <div className="p-6 border-b-4 border-r-4 border-black bg-white">
               <CategoryRatingsBar ratings={companyA.culture_ratings} />
            </div>
            <div className="p-6 border-b-4 border-black bg-white">
               <CategoryRatingsBar ratings={companyB.culture_ratings} />
            </div>

            {/* Remote Work */}
            <div className="p-4 border-b-2 border-r-4 border-black flex items-center font-black uppercase text-xs tracking-widest text-slate-500">
              Remote Friendly
            </div>
            <div className="p-4 border-b-2 border-r-4 border-black text-center bg-white flex justify-center">
              {companyA.remote ? <Check className="text-emerald-500" /> : <Minus className="text-slate-300" />}
            </div>
            <div className="p-4 border-b-2 border-black text-center bg-white flex justify-center">
              {companyB.remote ? <Check className="text-emerald-500" /> : <Minus className="text-slate-300" />}
            </div>

            {/* Open Roles */}
            <div className="p-4 border-r-4 border-black flex items-center font-black uppercase text-xs tracking-widest text-slate-500">
              Active Transmissions (Jobs)
            </div>
            <div className="p-4 border-r-4 border-black text-center font-black text-2xl bg-white text-sky-500">
              {companyA.openJobs}
            </div>
            <div className="p-4 border-black text-center font-black text-2xl bg-white text-sky-500">
              {companyB.openJobs}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCompare;
