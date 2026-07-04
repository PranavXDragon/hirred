"use client";

import React, { useState } from 'react';
import { Search, Filter, Layers, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CompanyCard from '../../components/companies/CompanyCard';
import CompanyCompare from '../../components/companies/CompanyCompare';
import WhyJoinUsShowcase from '../../components/companies/WhyJoinUsShowcase';

export default function CompaniesClient({ initialCompanies = [] }) {
  const [searchVal, setSearchVal] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [showCompare, setShowCompare] = useState(false);

  const industries = ["All", "Enterprise SaaS", "AI & Machine Learning", "E-Commerce", "Data Analytics", "Cyber Security", "Cloud Infrastructure"];

  const filteredCompanies = initialCompanies.filter(c => {
    const matchesIndustry = selectedIndustry === 'All' || c.industry === selectedIndustry;
    const matchesSearch = c.name.toLowerCase().includes(searchVal.toLowerCase()) || c.industry.toLowerCase().includes(searchVal.toLowerCase());
    return matchesIndustry && matchesSearch;
  });

  const handleCardClick = (company) => {
    if (selectedCompanies.find(c => c.id === company.id)) {
      setSelectedCompanies(selectedCompanies.filter(c => c.id !== company.id));
    } else {
      if (selectedCompanies.length < 2) {
        setSelectedCompanies([...selectedCompanies, company]);
      } else {
        // Replace the second one if 2 are already selected and we click a third
        setSelectedCompanies([selectedCompanies[0], company]);
      }
    }
  };

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
                <Layers size={16} className="text-white" />
              </div>
              <span className="font-black uppercase tracking-[0.3em] text-[10px]">Employer Registry</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4">
              Companies <br /><span className="text-sky-500 italic">Directory.</span>
            </h1>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest max-w-lg leading-relaxed">
              Explore elite engineering cultures, evaluate compensation metrics, and compare protocols side-by-side.
            </p>
          </div>

          <div className="w-full md:w-96 flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search companies..." 
                className="w-full bg-slate-50 border-[3px] border-black p-4 pl-12 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(14,165,233,1)] transition-all uppercase text-sm"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
              />
            </div>
            
            {/* Compare CTA Action Bar */}
            <AnimatePresence>
              {selectedCompanies.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-sky-50 border-2 border-black p-3 flex justify-between items-center overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest text-sky-700">
                    {selectedCompanies.length}/2 Selected
                  </span>
                  <button 
                    onClick={() => {
                      if (selectedCompanies.length === 2) setShowCompare(true);
                    }}
                    disabled={selectedCompanies.length < 2}
                    className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all border-2 border-black
                      ${selectedCompanies.length === 2 
                        ? 'bg-black text-white hover:bg-sky-500 hover:text-black cursor-pointer shadow-[2px_2px_0px_0px_rgba(14,165,233,1)]' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-50'
                      }`}
                  >
                    Compare Now
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Industry Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-10 hide-scrollbar">
          {industries.map(ind => (
            <button 
              key={ind}
              onClick={() => setSelectedIndustry(ind)}
              className={`flex-shrink-0 px-5 py-3 font-black text-[10px] uppercase tracking-widest border-2 transition-all
                ${selectedIndustry === ind 
                  ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(14,165,233,1)]' 
                  : 'bg-white text-slate-500 border-slate-200 hover:border-black hover:text-black'}
              `}
            >
              {ind}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <AnimatePresence mode="popLayout">
            {filteredCompanies.map((company) => (
              <motion.div 
                key={company.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <CompanyCard 
                  company={company} 
                  isSelected={!!selectedCompanies.find(c => c.id === company.id)}
                  onClick={() => handleCardClick(company)}
                />
              </motion.div>
            ))}
            {filteredCompanies.length === 0 && (
              <div className="col-span-full py-20 text-center border-4 border-black bg-slate-50">
                <Zap size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="font-black uppercase tracking-widest text-slate-400">No organizations found.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic Showcase for Selected Company */}
        <AnimatePresence>
          {selectedCompanies.length === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
            >
              <WhyJoinUsShowcase company={selectedCompanies[0]} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Compare Modal */}
      <AnimatePresence>
        {showCompare && selectedCompanies.length === 2 && (
          <CompanyCompare 
            companyA={selectedCompanies[0]} 
            companyB={selectedCompanies[1]} 
            onClose={() => setShowCompare(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
