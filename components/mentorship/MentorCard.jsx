"use client";

import React from 'react';
import { Star, MapPin, Briefcase, Zap, CalendarDays, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const MentorCard = ({ mentor, onBook }) => {
  return (
    <div className="bg-white border-[4px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(14,165,233,1)] transition-all flex flex-col h-full relative group">
      
      {/* Top Section */}
      <div className="flex gap-4 items-start mb-6">
        <div className="w-20 h-20 bg-black flex-shrink-0 border-2 border-black shadow-[4px_4px_0px_0px_rgba(14,165,233,1)] flex items-center justify-center text-sky-500 font-black text-3xl uppercase overflow-hidden relative">
          {mentor.name.charAt(0)}
          {/* Subtle glitch effect overlay on hover */}
          <div className="absolute inset-0 bg-sky-500 opacity-0 group-hover:opacity-20 mix-blend-overlay transition-opacity"></div>
        </div>
        
        <div className="flex-grow">
          <h2 className="text-2xl font-black uppercase tracking-tighter leading-none mb-1 group-hover:text-sky-500 transition-colors">
            {mentor.name}
          </h2>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{mentor.role}</p>
          <div className="flex items-center gap-1.5 text-black font-black bg-yellow-200 border-2 border-black px-2 py-0.5 inline-flex text-[10px] uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Star size={10} className="fill-black" /> {mentor.rating} / 5.0
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3 mb-8 flex-grow">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
          <Briefcase size={14} className="text-black shrink-0" />
          <span className="truncate">{mentor.company}</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
          <MapPin size={14} className="text-black shrink-0" />
          <span className="truncate">{mentor.location}</span>
        </div>
      </div>

      {/* Expertise Tags */}
      <div className="mb-8">
        <h3 className="text-[9px] font-black uppercase tracking-widest mb-3 border-b-2 border-slate-200 pb-1 text-slate-400">Core Expertise</h3>
        <div className="flex flex-wrap gap-2">
          {mentor.expertise.map((skill, i) => (
            <span key={i} className="bg-slate-50 border-2 border-black px-3 py-1 text-[9px] font-black uppercase tracking-widest">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Action */}
      <div className="mt-auto">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-black uppercase tracking-widest text-slate-500">Session Rate</span>
          <span className="text-xl font-black text-emerald-600">{mentor.rate}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => window.location.href = `/mentorship/chat/${mentor.id}`}
            className="w-full bg-white text-black hover:bg-slate-100 transition-all border-2 border-black py-4 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none"
          >
            <MessageSquare size={14} /> Chat
          </button>
          
          <button 
            onClick={() => onBook(mentor)}
            className="w-full bg-black text-white hover:bg-sky-500 hover:text-black transition-all border-2 border-black py-4 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(14,165,233,1)] active:translate-y-1 active:shadow-none"
          >
            <CalendarDays size={14} /> Book
          </button>
        </div>
      </div>

    </div>
  );
};

export default MentorCard;
