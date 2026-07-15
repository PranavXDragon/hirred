"use client";

import React, { useState, useEffect } from 'react';
import { Clock, MapPin, IndianRupee, Code, Zap, Briefcase, Building, ChevronRight, Share2, Heart, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RecruiterActivity from './RecruiterActivity';
import DeadlineTimer from './DeadlineTimer';
import RecruitmentTimeline from './RecruitmentTimeline';
import HRContactButtons from './HRContactButtons';
import { submitApplication, toggleSavedJob, incrementJobViews } from '../../lib/actions/student';
import { createClient } from '../../lib/supabase/client';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

const JobDetailPane = ({ job }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [applicantCount, setApplicantCount] = useState(0);
  const [views, setViews] = useState(0);
  
  const { profile } = useAuth();
  const isEmployer = profile?.role === 'employer';
  const router = useRouter();

  const supabase = createClient();

  useEffect(() => {
    if (!job) return;
    const fetchData = async () => {
      const countRes = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('job_id', job.id);
      
      if (countRes.count !== null) {
        setApplicantCount(countRes.count);
      }

      // Increment and fetch live views
      const updatedViews = await incrementJobViews(job.id);
      setViews(updatedViews);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const [savedRes, appRes] = await Promise.all([
        supabase.from('saved_jobs').select('id').eq('job_id', job.id).eq('student_id', user.id).maybeSingle(),
        supabase.from('applications').select('status').eq('job_id', job.id).eq('student_id', user.id).maybeSingle()
      ]);
        
      setIsSaved(!!savedRes.data);
      if (appRes.data) {
        setApplicationStatus(appRes.data.status);
        setSuccess(true);
        
        // Subscribe to real-time updates for this specific application
        const channel = supabase
          .channel(`public:applications:${job.id}-${user.id}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'applications',
              filter: `job_id=eq.${job.id}`
            },
            (payload) => {
              // Ensure it's for the current user
              if (payload.new.student_id === user.id) {
                setApplicationStatus(payload.new.status);
              }
            }
          )
          .subscribe();

        // Cleanup function for the subscription
        return () => {
          supabase.removeChannel(channel);
        };
      } else {
        setApplicationStatus(null);
        setSuccess(false);
      }
    };
    
    let cleanupFunc;
    fetchData().then(cleanup => {
      if (cleanup) cleanupFunc = cleanup;
    });

    return () => {
      if (cleanupFunc) cleanupFunc();
    };
  }, [job]);

  const handleApply = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      await submitApplication(job.id);
      setSuccess(true);
      setApplicationStatus('pending');
    } catch (err) {
      setError(err.message);
      if (err.message.toLowerCase().includes('unauthorized') || err.message.toLowerCase().includes('log in')) {
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      }
    }
    setLoading(false);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/jobs/${job.slug}`;
      navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleSave = async () => {
    // Optimistic UI update
    const previousSaved = isSaved;
    setIsSaved(!isSaved);

    try {
      await toggleSavedJob(job.id);
    } catch (err) {
      console.error("Failed to save job:", err);
      // Revert if error
      setIsSaved(previousSaved);
    }
  };

  if (!job) {
    return (
      <div className="h-full min-h-[600px] bg-slate-50 border-[4px] border-black p-12 flex flex-col items-center justify-center text-center">
        <Zap className="text-slate-200 mb-6" size={60} fill="currentColor" />
        <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 text-slate-400">No Job Selected</h3>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest max-w-sm">
          Select a role from the feed to view full transmission details and requirements.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border-[4px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full w-full relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-sky-50 rounded-full blur-3xl opacity-50 pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto min-h-0 relative hide-scrollbar">
        {/* Header Section */}
        <div className="p-8 md:p-10 border-b-4 border-black relative bg-white">
          <div className="flex justify-between items-start mb-6">
            <div className="w-16 h-16 bg-black flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_0px_rgba(14,165,233,1)] text-sky-500 font-black text-2xl uppercase">
              {job.company.charAt(0)}
            </div>
            <div className="flex gap-2 relative">
              <button 
                onClick={handleShare}
                className="w-10 h-10 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer relative"
                title="Share Protocol"
              >
                <Share2 size={16} />
                <AnimatePresence>
                  {isCopied && (
                    <motion.span 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-black px-2 py-1 uppercase whitespace-nowrap shadow-[2px_2px_0px_0px_rgba(14,165,233,1)] border border-black"
                    >
                      Link Copied
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
              <button 
                onClick={handleSave}
                className={`w-10 h-10 border-2 border-black flex items-center justify-center transition-colors cursor-pointer ${
                  isSaved ? 'bg-rose-500 text-white border-rose-500' : 'hover:bg-rose-500 hover:text-white hover:border-rose-500'
                }`}
                title="Save Protocol"
              >
                <Heart size={16} fill={isSaved ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-3">
            {job.role}
          </h1>
          <p className="text-lg font-black text-sky-500 uppercase tracking-wider italic mb-6">
            {job.company}
          </p>

          <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-600 mb-2">
            <div className="flex items-center gap-1.5"><MapPin size={16} className="text-black" /> {job.location}</div>
            <div className="flex items-center gap-1.5"><IndianRupee size={16} className="text-black" /> {job.salary}</div>
            <div className="flex items-center gap-1.5"><Briefcase size={16} className="text-black" /> {job.type}</div>
            <div className="flex items-center gap-1.5"><Clock size={16} className="text-black" /> {job.posted}</div>
          </div>
        </div>

        {/* Body Section */}
        <div className="p-8 md:p-10 space-y-12 bg-slate-50 relative">
          
          <div className="space-y-0">
            <DeadlineTimer />
            <RecruiterActivity liveApplicants={applicantCount} lastActive={job.created_at} liveViews={views} />
          </div>

          {/* Core Stack */}
          <section>
            <h3 className="text-sm font-black uppercase tracking-widest border-b-2 border-black pb-2 mb-6 flex items-center gap-2">
              <Code size={18} className="text-sky-500" /> Required Tech Stack
            </h3>
            <div className="flex flex-wrap gap-3">
              {job.stack.map(s => (
                <span key={s} className="bg-white border-2 border-black px-4 py-2 text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {s}
                </span>
              ))}
            </div>
          </section>

          {/* Description */}
          <section>
            <h3 className="text-sm font-black uppercase tracking-widest border-b-2 border-black pb-2 mb-6 flex items-center gap-2">
              <Building size={18} className="text-sky-500" /> Transmission Details
            </h3>
            <div className="prose prose-sm prose-slate font-bold leading-relaxed max-w-none text-slate-700">
              <p>
                We are seeking an elite <span className="text-black bg-yellow-200 px-1">{job.role}</span> to join our core architecture team. 
                You will be responsible for designing, building, and optimizing high-performance systems that scale globally.
              </p>
              <p className="mt-4">
                At {job.company}, we operate on a strict meritocracy. We don&apos;t care where you went to school; we care about the quality of the code you ship and the problems you can solve.
              </p>
            </div>
          </section>

          {/* Responsibilities */}
          <section>
            <h3 className="text-sm font-black uppercase tracking-widest border-b-2 border-black pb-2 mb-6 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-sky-500" /> Core Directives
            </h3>
            <ul className="space-y-4">
              {[
                "Architect and deploy scalable microservices.",
                "Optimize database queries for sub-millisecond response times.",
                "Collaborate with cross-functional elite pods.",
                "Maintain zero-downtime CI/CD pipelines."
              ].map((resp, i) => (
                <li key={i} className="flex items-start gap-3 text-xs font-bold text-slate-700">
                  <Zap className="text-sky-500 shrink-0 mt-0.5" size={14} fill="currentColor" />
                  {resp}
                </li>
              ))}
            </ul>
          </section>

          {/* Recruitment Timeline */}
          <section>
            <RecruitmentTimeline currentStatus={applicationStatus} />
          </section>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="p-6 border-t-4 border-black relative bg-white flex-shrink-0 z-10">
        {isEmployer ? (
          <button disabled className="w-full bg-slate-100 text-slate-400 py-4 text-sm font-black uppercase tracking-[0.2em] border-[3px] border-slate-300 flex items-center justify-center cursor-not-allowed">
            Employers Cannot Apply
          </button>
        ) : (
          <>
            {error && (
              <div className="mb-4 bg-rose-100 border-2 border-rose-500 text-rose-700 font-bold p-4 text-xs uppercase tracking-widest text-center">
                {error}
              </div>
            )}
            {success ? (
              applicationStatus === 'hired' || applicationStatus === 'accepted' ? (
                <button disabled className="w-full bg-emerald-500 text-black py-4 text-sm font-black uppercase tracking-[0.2em] transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-[3px] border-black flex items-center justify-center gap-2 animate-pulse">
                  <CheckCircle2 size={18} /> Protocol Secured
                </button>
              ) : applicationStatus === 'rejected' ? (
                <button disabled className="w-full bg-red-500 text-white py-4 text-sm font-black uppercase tracking-[0.2em] transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-[3px] border-black flex items-center justify-center gap-2">
                  <XCircle size={18} /> Protocol Terminated
                </button>
              ) : (
                <button disabled className="w-full bg-emerald-500 text-black py-4 text-sm font-black uppercase tracking-[0.2em] transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-[3px] border-black flex items-center justify-center gap-2">
                  <CheckCircle2 size={18} /> Protocol Submitted
                </button>
              )
            ) : (
              <button 
                onClick={handleApply}
                disabled={loading}
                className="w-full bg-black text-white py-4 text-sm font-black uppercase tracking-[0.2em] hover:bg-sky-500 hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(14,165,233,1)] active:translate-y-1 active:shadow-none cursor-pointer flex items-center justify-center gap-2 border-[3px] border-black disabled:opacity-50"
              >
                {loading ? 'Transmitting...' : 'Apply Protocol'} {!loading && <ChevronRight size={18} />}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JobDetailPane;
