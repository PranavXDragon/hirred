"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, X, ArrowLeft, Briefcase, MapPin, Clock } from 'lucide-react';
import { withdrawApplication } from '../../../../lib/actions/student';
import Link from 'next/link';

const statusColors = {
  pending: 'bg-amber-100 text-amber-800 border-amber-300',
  reviewing: 'bg-sky-100 text-sky-800 border-sky-300',
  assessment: 'bg-purple-100 text-purple-800 border-purple-300',
  interview: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  rejected: 'bg-red-100 text-red-800 border-red-300',
  hired: 'bg-emerald-100 text-emerald-800 border-emerald-300',
};

export default function ApplicationsClient({ applications }) {
  const [apps, setApps] = useState(applications);
  const [toast, setToast] = useState('');

  const handleWithdraw = async (appId) => {
    try {
      await withdrawApplication(appId);
      setApps(prev => prev.filter(a => a.id !== appId));
      setToast('Application withdrawn successfully.');
    } catch (err) {
      setToast(`Error: ${err.message}`);
    }
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className="bg-white min-h-screen pt-28 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ 
             backgroundImage: `linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)`, 
             backgroundSize: '40px 40px' 
           }}>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="flex items-center gap-4 mb-8 border-b-4 border-black pb-6">
          <Link href="/dashboard/student" className="p-2 border-2 border-black hover:bg-slate-50 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight leading-none">
              Applications <span className="text-sky-500 italic">Log.</span>
            </h1>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1">
              Track all your submitted job protocols.
            </p>
          </div>
        </div>

        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-sky-50 border-2 border-sky-500 text-sky-700 text-xs font-black uppercase tracking-wider flex items-center gap-2"
          >
            <FileText size={16} /> {toast}
          </motion.div>
        )}

        {apps.length === 0 ? (
          <div className="border-[4px] border-dashed border-slate-300 p-16 text-center bg-slate-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <FileText size={56} className="mx-auto text-slate-300 mb-6" />
            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-400 mb-3">No Applications Yet</h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-8">
              You haven't transmitted any job protocols. Browse open positions to get started.
            </p>
            <Link 
              href="/jobs"
              className="inline-block bg-black text-white px-8 py-4 font-black uppercase text-xs tracking-widest border-2 border-black hover:bg-sky-500 hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(14,165,233,1)] active:translate-y-1 active:shadow-none"
            >
              Browse Open Positions
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {apps.map((app, idx) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border-[3px] border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-[6px_6px_0px_0px_rgba(14,165,233,1)] transition-shadow"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <Briefcase size={16} className="text-sky-500 shrink-0" />
                    <h3 className="text-lg font-black uppercase tracking-tight text-black">
                      {app.job?.title || 'Unknown Position'}
                    </h3>
                  </div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {app.job?.company?.name || 'Unknown Company'}
                  </p>
                  <div className="flex flex-wrap gap-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {app.job?.location || 'Remote'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> Applied {new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border-2 ${statusColors[app.status] || 'bg-slate-100 text-slate-600 border-slate-300'}`}>
                    {app.status}
                  </span>
                  <button
                    onClick={() => handleWithdraw(app.id)}
                    className="p-2 border-2 border-red-300 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all cursor-pointer"
                    title="Withdraw Application"
                  >
                    <X size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
