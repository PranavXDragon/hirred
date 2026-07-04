"use client";

import React, { useState } from 'react';
import { Search, Zap, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MentorCard from '../../components/mentorship/MentorCard';
import MentorshipScheduler from '../../components/mentorship/MentorshipScheduler';

export default function MentorshipClient({ initialMentors = [] }) {
  const [searchVal, setSearchVal] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedMentor, setSelectedMentor] = useState(null);

  const domains = ["All", "Frontend", "Backend", "Career Advice", "DevOps", "AI/ML", "Cyber Security"];

  const filteredMentors = initialMentors.filter(m => {
    const matchesDomain = selectedDomain === 'All' || m.domain === selectedDomain;
    const matchesSearch = m.name.toLowerCase().includes(searchVal.toLowerCase()) || 
                          m.company.toLowerCase().includes(searchVal.toLowerCase()) ||
                          m.expertise.some(e => e.toLowerCase().includes(searchVal.toLowerCase()));
    return matchesDomain && matchesSearch;
  });

  return (
    <div className="bg-white min-h-screen pt-24 pb-20 relative">
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ 
             backgroundImage: `linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)`, 
             backgroundSize: '40px 40px' 
           }}>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <header className="mb-12 border-b-4 border-black pb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-black flex items-center justify-center border-2 border-black">
                <Compass size={16} className="text-white" />
              </div>
              <span className="font-black uppercase tracking-[0.3em] text-[10px]">1-on-1 Guidance</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4">
              Elite <span className="text-sky-500 italic">Mentors.</span>
            </h1>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest max-w-lg leading-relaxed">
              Book mock interviews, system design reviews, or career strategy sessions with engineers from top tech companies.
            </p>
          </div>

          <div className="w-full md:w-96">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by name, company, or skill..." 
                className="w-full bg-slate-50 border-[3px] border-black p-4 pl-12 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(14,165,233,1)] transition-all uppercase text-sm"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* Domain Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-10 hide-scrollbar">
          {domains.map(dom => (
            <button 
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`flex-shrink-0 px-5 py-3 font-black text-[10px] uppercase tracking-widest border-2 transition-all
                ${selectedDomain === dom 
                  ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(14,165,233,1)]' 
                  : 'bg-white text-slate-500 border-slate-200 hover:border-black hover:text-black'}
              `}
            >
              {dom}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <AnimatePresence mode="popLayout">
            {filteredMentors.map((mentor) => (
              <motion.div 
                key={mentor.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <MentorCard 
                  mentor={mentor} 
                  onBook={(m) => setSelectedMentor(m)}
                />
              </motion.div>
            ))}
            {filteredMentors.length === 0 && (
              <div className="col-span-full py-20 text-center border-4 border-black bg-slate-50">
                <Zap size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="font-black uppercase tracking-widest text-slate-400">No mentors found for this protocol.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Scheduler Modal */}
      <AnimatePresence>
        {selectedMentor && (
          <MentorshipScheduler 
            mentor={selectedMentor} 
            onClose={() => setSelectedMentor(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
