"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Briefcase, Trash2, Users, MapPin, Calendar, Eye } from 'lucide-react';
import { deleteJob } from '../../../../lib/actions/employer';
import Link from 'next/link';

export default function ManageJobsClient({ jobs: initialJobs }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [toast, setToast] = useState('');

  const handleDelete = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job listing? This action cannot be undone.')) return;
    try {
      await deleteJob(jobId);
      setJobs(prev => prev.filter(j => j.id !== jobId));
      setToast('Job listing deleted successfully.');
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
          <Link href="/dashboard/employer" className="p-2 border-2 border-black hover:bg-slate-50 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight leading-none">
              Manage <span className="text-amber-500 italic">Jobs.</span>
            </h1>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1">
              Overview of all your published protocols.
            </p>
          </div>
        </div>

        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-amber-50 border-2 border-amber-500 text-amber-700 text-xs font-black uppercase tracking-wider flex items-center gap-2"
          >
            <Briefcase size={16} /> {toast}
          </motion.div>
        )}

        {jobs.length === 0 ? (
          <div className="border-[4px] border-dashed border-slate-300 p-16 text-center bg-slate-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <Briefcase size={56} className="mx-auto text-slate-300 mb-6" />
            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-400 mb-3">No Jobs Posted Yet</h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-8">
              Transmit your first job protocol to start receiving applications.
            </p>
            <Link 
              href="/dashboard/employer/post-job"
              className="inline-block bg-black text-white px-8 py-4 font-black uppercase text-xs tracking-widest border-2 border-black hover:bg-amber-500 hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(245,158,11,1)] active:translate-y-1 active:shadow-none"
            >
              Post a Job
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job, idx) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border-[3px] border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(245,158,11,1)] transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <Briefcase size={16} className="text-amber-500 shrink-0" />
                      <h3 className="text-lg font-black uppercase tracking-tight text-black">
                        {job.title}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} /> {job.location || 'Remote'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> Posted {new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={12} /> {job.views || 0} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={12} /> {job.applicationCount} applicants
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Link
                      href={`/dashboard/employer/applicants/${job.id}`}
                      className="px-4 py-2 border-2 border-black text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all"
                    >
                      View Applicants ({job.applicationCount})
                    </Link>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="p-2 border-2 border-red-300 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all cursor-pointer"
                      title="Delete Job"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
