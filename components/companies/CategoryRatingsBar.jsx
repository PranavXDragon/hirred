"use client";

import React from 'react';

const CategoryRatingsBar = ({ ratings = {} }) => {
  // ratings is an object like { workLife: 4.5, compensation: 4.8, culture: 4.2, growth: 4.0, diversity: 4.6 }
  const maxScore = 5.0;

  const categories = [
    { key: 'workLife', label: 'Work/Life Balance', color: 'bg-emerald-500' },
    { key: 'compensation', label: 'Compensation & Benefits', color: 'bg-amber-400' },
    { key: 'culture', label: 'Engineering Culture', color: 'bg-sky-500' },
    { key: 'growth', label: 'Career Growth', color: 'bg-indigo-500' },
    { key: 'diversity', label: 'Diversity & Inclusion', color: 'bg-rose-500' }
  ];

  return (
    <div className="space-y-3">
      {categories.map((cat) => {
        const score = ratings[cat.key] || 0;
        const percentage = (score / maxScore) * 100;
        
        return (
          <div key={cat.key} className="flex items-center gap-4">
            <div className="w-32 flex-shrink-0">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 block leading-tight">
                {cat.label}
              </span>
            </div>
            <div className="flex-grow h-3 bg-slate-100 border-2 border-black flex items-center relative overflow-hidden">
              <div 
                className={`h-full border-r-2 border-black ${cat.color} transition-all duration-1000 ease-out`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <div className="w-8 flex-shrink-0 text-right">
              <span className="text-xs font-black">{score.toFixed(1)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryRatingsBar;
