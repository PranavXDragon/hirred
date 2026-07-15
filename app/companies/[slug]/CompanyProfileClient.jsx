"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, Users, TrendingUp, Globe, ChevronLeft, ArrowUpRight, Zap, AlignLeft } from 'lucide-react';
import WhyJoinUsShowcase from '../../../components/companies/WhyJoinUsShowcase';
import CategoryRatingsBar from '../../../components/companies/CategoryRatingsBar';

const CompanyProfileClient = ({ company }) => {
  return (
    <div className="bg-white min-h-screen pt-24 pb-20 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ 
             backgroundImage: `linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)`, 
             backgroundSize: '40px 40px' 
           }}>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Back navigation */}
        <Link 
          href="/companies"
          className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-sky-500 hover:text-black transition-colors mb-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
        >
          <ChevronLeft size={14} /> Back to Directory
        </Link>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row gap-8 md:items-end mb-16 border-b-4 border-black pb-12">
          <div className="w-32 h-32 md:w-48 md:h-48 bg-black flex flex-shrink-0 items-center justify-center border-4 border-black shadow-[8px_8px_0px_0px_rgba(14,165,233,1)] text-sky-500 font-black text-6xl md:text-8xl uppercase relative group overflow-hidden">
            <span className="relative z-10 group-hover:scale-110 transition-transform duration-500">
              {company.logoUrl ? <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" /> : company.name.charAt(0)}
            </span>
            <div className="absolute inset-0 bg-sky-500 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-0"></div>
            <span className="absolute inset-0 flex items-center justify-center text-black font-black opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
              {company.name.charAt(0)}
            </span>
          </div>

          <div className="flex-grow">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-emerald-100 border-2 border-black px-3 py-1 flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-[10px] font-black uppercase text-emerald-700 tracking-widest">
                <Briefcase size={12} className="text-emerald-600" />
                {company.openJobs} Active Roles
              </span>
              {company.remote && (
                <span className="bg-sky-100 border-2 border-black px-3 py-1 flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-[10px] font-black uppercase text-sky-700 tracking-widest">
                  <Globe size={12} className="text-sky-600" /> Remote Ready
                </span>
              )}
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4">
              {company.name}
            </h1>
            
            <div className="flex flex-wrap gap-6 text-sm font-bold text-slate-600 uppercase tracking-widest">
              <div className="flex items-center gap-2"><MapPin size={16} className="text-black" /> {company.location}</div>
              <div className="flex items-center gap-2"><TrendingUp size={16} className="text-black" /> {company.industry}</div>
              <div className="flex items-center gap-2"><Users size={16} className="text-black" /> {company.size}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {company.about && (
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-2">
                    <AlignLeft size={28} className="text-sky-500" /> Organization Overview
                  </h2>
                  <div className="h-1 flex-grow bg-black"></div>
                </div>
                <div className="bg-slate-50 border-[4px] border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <p className="whitespace-pre-wrap text-slate-700 font-medium leading-relaxed">
                    {company.about}
                  </p>
                </div>
              </div>
            )}

            <WhyJoinUsShowcase company={company} />

            {/* Open Jobs */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-2">
                  <Zap size={28} className="text-emerald-500" /> Open Protocols
                </h2>
                <div className="h-1 flex-grow bg-black"></div>
              </div>

              {company.jobs && company.jobs.length > 0 ? (
                <div className="space-y-4">
                  {company.jobs.map((job) => (
                    <Link key={job.id} href={`/jobs/${job.slug}`} className="block">
                      <div className="group bg-white border-4 border-black p-6 hover:bg-black transition-colors shadow-[6px_6px_0px_0px_rgba(14,165,233,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                        <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
                          <div>
                            <h3 className="text-xl font-black uppercase tracking-tighter group-hover:text-white transition-colors">{job.title}</h3>
                            <div className="text-xs font-bold text-slate-500 group-hover:text-slate-400 mt-1 uppercase tracking-widest flex flex-wrap gap-4">
                              <span>{job.location}</span>
                              <span className="text-sky-500">{job.salary_range}</span>
                            </div>
                          </div>
                          <div className="bg-sky-500 text-black px-4 py-2 font-black text-[10px] uppercase tracking-widest border-2 border-black flex items-center gap-2 group-hover:bg-white transition-colors shrink-0">
                            View Protocol <ArrowUpRight size={14} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-50 border-4 border-black p-12 text-center">
                  <Briefcase size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="font-black uppercase tracking-widest text-slate-400">No active protocols at this time.</p>
                </div>
              )}
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-slate-50 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sticky top-24">
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 border-b-4 border-black pb-4">
                Culture Metrics
              </h3>
              {Object.keys(company.culture_ratings).length > 0 ? (
                <CategoryRatingsBar ratings={company.culture_ratings} />
              ) : (
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center py-4">Data insufficient for analysis.</p>
              )}
              
              {company.website && (
                 <a href={company.website} target="_blank" rel="noopener noreferrer" className="mt-8 block w-full bg-black text-white text-center py-4 border-2 border-black font-black uppercase tracking-widest text-[10px] hover:bg-sky-500 hover:text-black transition-colors flex items-center justify-center gap-2">
                   Visit Command Center <ArrowUpRight size={14} />
                 </a>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CompanyProfileClient;
