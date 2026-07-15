"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Cpu, Building2, Stethoscope, BarChart4, GraduationCap, 
  ArrowRight, Briefcase, Building, Newspaper, ArrowLeft
} from 'lucide-react';
import CompanyCard from '../../../components/companies/CompanyCard';
import JobCard from '../../../components/jobs/JobCard';

const iconMap = {
  Cpu: <Cpu size={48} />,
  Building2: <Building2 size={48} />,
  Stethoscope: <Stethoscope size={48} />,
  BarChart4: <BarChart4 size={48} />,
  GraduationCap: <GraduationCap size={48} />
};

export default function IndustryClient({ industryMeta, companies, jobs, news = [] }) {
  const router = useRouter();

  return (
    <div className="bg-white min-h-screen pt-24 pb-20 relative">
      
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ 
             backgroundImage: `linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)`, 
             backgroundSize: '40px 40px' 
           }}>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 space-y-24">
        
        {/* --- 1. HERO HEADER --- */}
        <header className="border-b-4 border-black pb-12 flex flex-col gap-8 mt-4">
          
          {/* Back Button */}
          <button 
            onClick={() => router.push('/industries')}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-black transition-colors w-fit group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Hubs
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mt-4">
            <div>
              <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-sky-500 text-black flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                {iconMap[industryMeta.iconName] || <Cpu size={48} />}
              </div>
              <div>
                <span className="font-black uppercase tracking-[0.3em] text-[10px] text-slate-500">Industry Vertical Hub</span>
                <div className="mt-2 inline-block bg-black text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(14,165,233,1)]">
                  {industryMeta.stats}
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
              {industryMeta.title.split(' ')[0]} <br />
              <span className="text-sky-500 italic">{industryMeta.title.split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className="text-slate-600 text-sm md:text-lg font-bold max-w-2xl leading-relaxed">
              {industryMeta.desc}
            </p>
          </div>
          </div>
        </header>

        {/* --- 2. TOP COMPANIES --- */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-2">
              <Building size={28} className="text-sky-500" /> Leading Organizations
            </h2>
            <div className="h-1 flex-grow bg-black"></div>
          </div>
          
          {companies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map(company => (
                <CompanyCard key={company.id} company={company} onClick={() => window.location.href = `/companies/${company.slug}`} />
              ))}
            </div>
          ) : (
             <div className="bg-slate-50 border-[4px] border-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
               <Building className="mx-auto text-slate-300 mb-4" size={48} />
               <h3 className="text-xl font-black uppercase tracking-widest text-slate-400">No Organizations Listed Yet</h3>
             </div>
          )}
        </section>

        {/* --- 3. LATEST ROLES --- */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-2">
              <Briefcase size={28} className="text-emerald-500" /> Open Protocols
            </h2>
            <div className="h-1 flex-grow bg-black"></div>
          </div>
          
          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map(job => (
                <JobCard key={job.id} job={job} onClick={() => window.location.href = `/jobs/${job.id}`} />
              ))}
            </div>
          ) : (
             <div className="bg-slate-50 border-[4px] border-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
               <Briefcase className="mx-auto text-slate-300 mb-4" size={48} />
               <h3 className="text-xl font-black uppercase tracking-widest text-slate-400">No Open Roles Available</h3>
             </div>
          )}
        </section>

        {/* --- 4. NEWS & INSIGHTS --- */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-2">
              <Newspaper size={28} className="text-rose-500" /> Intelligence Feed
            </h2>
            <div className="h-1 flex-grow bg-black"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {news.map((item, index) => (
              <motion.article 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group border-[4px] border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(244,63,94,1)] hover:-translate-y-2 transition-all duration-300 flex flex-col h-full overflow-hidden"
              >
                <div className="h-48 border-b-[4px] border-black overflow-hidden relative">
                   <div className="absolute top-4 left-4 z-10 bg-rose-500 text-black px-3 py-1 font-black text-[10px] uppercase tracking-widest border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                     {item.tag}
                   </div>
                   <img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                    <span>{item.date}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>{item.author}</span>
                  </div>
                  
                  <h3 className="text-2xl font-black uppercase tracking-tighter leading-tight mb-4 group-hover:text-rose-600 transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-sm font-bold text-slate-600 leading-relaxed flex-grow line-clamp-3">
                    {item.desc}
                  </p>
                  
                  <Link href={item.link} target="_blank" rel="noopener noreferrer" className="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-black group-hover:text-rose-600 w-fit">
                    Read Intelligence <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
