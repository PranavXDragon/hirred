"use client";

import React, { useState } from 'react';
import { Building, Rocket, Users, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../../../lib/actions/auth';
import CompanyProfileForm from '../../../components/dashboard/employer/CompanyProfileForm';
import PostJobForm from '../../../components/dashboard/employer/PostJobForm';
import ReviewApplications from '../../../components/dashboard/employer/ReviewApplications';

const EmployerDashboardClient = ({ initialData, applications }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const user = initialData.user;
  const company = initialData.company;

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
        <header className="mb-12 border-b-4 border-black pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-2">
              Command <span className="text-sky-500 italic">Center.</span>
            </h1>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest max-w-lg">
              Welcome back, {user?.full_name || 'Commander'}. Manage your organization.
            </p>
          </div>
          <button 
            onClick={() => logout()}
            className="bg-black text-white px-6 py-3 font-black uppercase tracking-widest text-[10px] hover:bg-rose-500 hover:text-black transition-all border-2 border-black flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(244,63,94,1)] active:translate-y-1 active:shadow-none self-start md:self-end"
          >
            <LogOut size={14} /> Disconnect
          </button>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="flex flex-col gap-4">
              <button
                onClick={() => setActiveTab('profile')}
                className={`text-left p-4 font-black uppercase tracking-widest text-xs border-[3px] flex items-center gap-3 transition-all ${
                  activeTab === 'profile' 
                    ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(14,165,233,1)] scale-105'
                    : 'bg-white border-black text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Building size={16} className={activeTab === 'profile' ? 'text-sky-500' : ''} />
                Organization
              </button>

              <button
                onClick={() => setActiveTab('post')}
                className={`text-left p-4 font-black uppercase tracking-widest text-xs border-[3px] flex items-center gap-3 transition-all ${
                  activeTab === 'post' 
                    ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(244,63,94,1)] scale-105'
                    : 'bg-white border-black text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Rocket size={16} className={activeTab === 'post' ? 'text-rose-500' : ''} />
                Transmit Job
              </button>

              <button
                onClick={() => setActiveTab('applications')}
                className={`text-left p-4 font-black uppercase tracking-widest text-xs border-[3px] flex items-center gap-3 transition-all ${
                  activeTab === 'applications' 
                    ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(16,185,129,1)] scale-105'
                    : 'bg-white border-black text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Users size={16} className={activeTab === 'applications' ? 'text-emerald-500' : ''} />
                Review Apps
              </button>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-grow">
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <CompanyProfileForm initialData={company} />
                </motion.div>
              )}
              {activeTab === 'post' && (
                <motion.div key="post" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  {!company ? (
                    <div className="bg-rose-50 border-[4px] border-black p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                       <h3 className="text-xl font-black uppercase tracking-tighter text-rose-600 mb-2">Configuration Required</h3>
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-700">You must configure your Organization Profile before transmitting job protocols.</p>
                       <button onClick={() => setActiveTab('profile')} className="mt-6 bg-black text-white px-6 py-3 font-black uppercase text-xs border-2 border-black hover:bg-sky-500 hover:text-black">Configure Now</button>
                    </div>
                  ) : (
                    <PostJobForm />
                  )}
                </motion.div>
              )}
              {activeTab === 'applications' && (
                <motion.div key="applications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <ReviewApplications initialApplications={applications} />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

        </div>
      </div>
    </div>
  );
};

export default EmployerDashboardClient;
