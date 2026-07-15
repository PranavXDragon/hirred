"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, ArrowLeft, Briefcase, MapPin, IndianRupee, Trash2 } from 'lucide-react';
import { toggleSavedJob } from '../../../../lib/actions/student';
import Link from 'next/link';

export default function SavedJobsClient({ savedJobs: initialSaved }) {
  const [savedJobs, setSavedJobs] = useState(initialSaved);
  const [toast, setToast] = useState('');

  const handleRemove = async (bookmarkId, jobId) => {
    setSavedJobs(prev => prev.filter(b => b.id !== bookmarkId));
    setToast('Bookmark removed.');
    setTimeout(() => setToast(''), 3000);

    try {
      await toggleSavedJob(jobId);
    } catch (err) {
      setSavedJobs(initialSaved);
      setToast('Error removing bookmark.');
    }
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
              Saved <span className="text-emerald-500 italic">Bookmarks.</span>
            </h1>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1">
              Positions you've flagged for later review.
            </p>
          </div>
        </div>

        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-emerald-50 border-2 border-emerald-500 text-emerald-700 text-xs font-black uppercase tracking-wider flex items-center gap-2"
          >
            <Bookmark size={16} /> {toast}
          </motion.div>
        )}

        {savedJobs.length === 0 ? (
          <div className="border-[4px] border-dashed border-slate-300 p-16 text-center bg-slate-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <Bookmark size={56} className="mx-auto text-slate-300 mb-6" />
            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-400 mb-3">No Bookmarks Yet</h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-8">
              Save jobs you're interested in to review them later.
            </p>
            <Link 
              href="/jobs"
              className="inline-block bg-black text-white px-8 py-4 font-black uppercase text-xs tracking-widest border-2 border-black hover:bg-emerald-500 hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(16,185,129,1)] active:translate-y-1 active:shadow-none"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {savedJobs.map((bookmark, idx) => (
              <motion.div
                key={bookmark.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border-[3px] border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-[6px_6px_0px_0px_rgba(16,185,129,1)] transition-shadow"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <Briefcase size={16} className="text-emerald-500 shrink-0" />
                    <h3 className="text-lg font-black uppercase tracking-tight text-black">
                      {bookmark.job?.title || 'Unknown Position'}
                    </h3>
                  </div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {bookmark.job?.company?.name || 'Unknown Company'}
                  </p>
                  <div className="flex flex-wrap gap-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {bookmark.job?.location || 'Remote'}
                    </span>
                    <span className="flex items-center gap-1">
                      <IndianRupee size={12} /> {bookmark.job?.salary_range || 'Not specified'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <Link
                    href={`/jobs`}
                    className="px-4 py-2 border-2 border-black text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all"
                  >
                    View Job
                  </Link>
                  <button
                    onClick={() => handleRemove(bookmark.id, bookmark.job_id)}
                    className="p-2 border-2 border-red-300 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all cursor-pointer"
                    title="Remove Bookmark"
                  >
                    <Trash2 size={16} />
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
