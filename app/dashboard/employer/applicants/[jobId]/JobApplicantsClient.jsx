"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, FileText, ExternalLink, Mail, Phone, MapPin } from 'lucide-react';
import { updateApplicationStatus } from '../../../../../lib/actions/employer';
import Link from 'next/link';

const statusColors = {
  pending: 'bg-amber-100 text-amber-800',
  reviewing: 'bg-sky-100 text-sky-800',
  assessment: 'bg-purple-100 text-purple-800',
  interview: 'bg-indigo-100 text-indigo-800',
  rejected: 'bg-red-100 text-red-800',
  hired: 'bg-emerald-100 text-emerald-800',
};

export default function JobApplicantsClient({ job, applications: initialApps }) {
  const [applications, setApplications] = useState(initialApps);
  const [loadingId, setLoadingId] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);

  const handleStatusChange = async (appId, newStatus) => {
    setLoadingId(appId);
    try {
      await updateApplicationStatus(appId, newStatus);
      setApplications(apps => apps.map(app =>
        app.id === appId ? { ...app, status: newStatus } : app
      ));
    } catch (err) {
      alert(err.message);
    }
    setLoadingId(null);
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
          <Link href="/dashboard/employer/manage-jobs" className="p-2 border-2 border-black hover:bg-slate-50 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users size={20} className="text-emerald-500" />
              <h1 className="text-4xl font-black uppercase tracking-tight leading-none">
                Applicants: <span className="text-emerald-500 italic">{job.title}</span>
              </h1>
            </div>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
              Review and manage candidates for this position.
            </p>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="border-[4px] border-dashed border-slate-300 p-16 text-center bg-slate-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <Users size={56} className="mx-auto text-slate-300 mb-6" />
            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-400 mb-3">No Applicants Yet</h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Your transmission is awaiting response from the talent network.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app, idx) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border-[3px] border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(16,185,129,1)] transition-shadow"
              >
                <div className="flex flex-col md:flex-row gap-6 justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 border-2 border-black flex items-center justify-center font-black text-sm">
                        {(app.student?.full_name || '?').charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-black uppercase tracking-tight text-black">
                          {app.student?.full_name || 'Unknown Candidate'}
                        </h3>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Applied {new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      {app.student?.email && (
                        <a href={`mailto:${app.student.email}`} className="flex items-center gap-1 hover:text-black">
                          <Mail size={12} /> {app.student.email}
                        </a>
                      )}
                      {app.student?.phone && (
                        <span className="flex items-center gap-1">
                          <Phone size={12} /> {app.student.phone}
                        </span>
                      )}
                      {app.student?.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={12} /> {app.student.location}
                        </span>
                      )}
                      {app.student?.resume_url && (
                        <button
                          onClick={() => {
                            const url = app.student.resume_url;
                            if (url.startsWith('http')) setSelectedResume(url);
                            else alert('Resume URL is not accessible.');
                          }}
                          className="flex items-center gap-1 text-emerald-600 hover:text-black cursor-pointer"
                        >
                          <FileText size={12} /> View Resume
                        </button>
                      )}
                      {app.student?.github_url && (
                        <a href={app.student.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-black">
                          <ExternalLink size={12} /> GitHub
                        </a>
                      )}
                    </div>

                    {app.student?.skills && app.student.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {app.student.skills.map((skill, i) => (
                          <span key={i} className="px-2 py-0.5 border border-black text-[8px] font-black uppercase bg-slate-50">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <span className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border-2 border-black ${statusColors[app.status] || 'bg-slate-100 text-slate-600'}`}>
                      {app.status}
                    </span>
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      disabled={loadingId === app.id}
                      className="border-2 border-black text-[9px] font-black uppercase tracking-widest p-2 bg-white focus:outline-none cursor-pointer hover:bg-slate-50"
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewing">Reviewing</option>
                      <option value="assessment">Assessment</option>
                      <option value="interview">Interview</option>
                      <option value="hired">Hired</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {selectedResume && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white border-[4px] border-black w-full max-w-4xl h-[85vh] flex flex-col shadow-[16px_16px_0px_0px_rgba(16,185,129,1)]">
              <div className="flex items-center justify-between p-4 border-b-4 border-black bg-slate-50">
                <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <FileText size={16} /> Resume Viewer
                </h3>
                <button
                  onClick={() => setSelectedResume(null)}
                  className="p-1 hover:bg-red-500 hover:text-white transition-colors border-2 border-transparent hover:border-black cursor-pointer"
                >
                  <span className="text-lg font-black">X</span>
                </button>
              </div>
              <div className="flex-1 bg-slate-200 relative overflow-hidden">
                <iframe
                  src={`${selectedResume}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                  className="absolute inset-0 w-full h-full border-none"
                  title="Resume Preview"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
