"use client";

import React from 'react';
import { CheckCircle2, Circle, ArrowDown } from 'lucide-react';

const RecruitmentTimeline = () => {
  const stages = [
    { title: "Application Review", status: "completed", desc: "Initial automated screening" },
    { title: "Technical Assessment", status: "active", desc: "Take-home coding challenge" },
    { title: "Architecture Interview", status: "pending", desc: "System design with Core Team" },
    { title: "Final Protocol", status: "pending", desc: "Offer & Onboarding" }
  ];

  return (
    <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
      <h3 className="text-sm font-black uppercase tracking-widest border-b-2 border-black pb-2 mb-6">
        Recruitment Protocol Stages
      </h3>
      
      <div className="space-y-0">
        {stages.map((stage, index) => (
          <div key={index} className="flex gap-4">
            {/* Timeline Line/Icon */}
            <div className="flex flex-col items-center">
              {stage.status === 'completed' ? (
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center z-10 border-2 border-black">
                  <CheckCircle2 size={12} />
                </div>
              ) : stage.status === 'active' ? (
                <div className="w-6 h-6 rounded-full bg-sky-500 text-black flex items-center justify-center z-10 border-2 border-black animate-pulse">
                  <Circle size={10} fill="currentColor" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-white text-slate-300 flex items-center justify-center z-10 border-2 border-slate-300">
                  <Circle size={10} />
                </div>
              )}
              
              {index < stages.length - 1 && (
                <div className={`w-0.5 h-12 ${stage.status === 'completed' ? 'bg-black' : 'bg-slate-200'}`}></div>
              )}
            </div>
            
            {/* Content */}
            <div className={`pb-8 ${stage.status === 'pending' ? 'opacity-50' : ''}`}>
              <h4 className="font-black text-xs uppercase tracking-widest">{stage.title}</h4>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mt-1">{stage.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecruitmentTimeline;
