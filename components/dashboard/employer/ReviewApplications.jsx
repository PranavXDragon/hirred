"use client";

import React, { useState } from 'react';
import { updateApplicationStatus } from '../../../lib/actions/employer';
import { FileText, ExternalLink, Mail, CheckCircle2, XCircle } from 'lucide-react';

const ReviewApplications = ({ initialApplications = [] }) => {
  const [applications, setApplications] = useState(initialApplications);
  const [loadingId, setLoadingId] = useState(null);

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

  if (applications.length === 0) {
    return (
      <div className="bg-slate-50 border-[4px] border-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <FileText size={48} className="mx-auto text-slate-300 mb-4" />
        <h3 className="text-xl font-black uppercase tracking-tighter mb-2">No Applications Yet</h3>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Your transmissions are awaiting response.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-black uppercase tracking-tighter border-b-4 border-black pb-4">
        Incoming Protocols <span className="text-emerald-500">({applications.length})</span>
      </h3>

      <div className="space-y-4">
        {applications.map((app) => (
          <div key={app.id} className="bg-white border-[3px] border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row gap-6 md:items-center justify-between">
            
            {/* Candidate Info */}
            <div className="space-y-2">
              <h4 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                {app.student?.full_name || 'Unknown Candidate'}
              </h4>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                Target: <span className="text-sky-500">{app.job?.title}</span>
              </p>
              
              <div className="flex flex-wrap gap-4 pt-2">
                {app.student?.email && (
                  <a href={`mailto:${app.student.email}`} className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1 text-slate-500 hover:text-black">
                    <Mail size={12} /> Email
                  </a>
                )}
                {app.student?.resume_url && (
                  <a href={app.student.resume_url} target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1 text-emerald-600 hover:text-black border-b-2 border-emerald-200">
                    <ExternalLink size={12} /> View Resume
                  </a>
                )}
                {app.student?.github_url && (
                  <a href={app.student.github_url} target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1 text-slate-500 hover:text-black">
                    <ExternalLink size={12} /> GitHub
                  </a>
                )}
              </div>
            </div>

            {/* Status & Actions */}
            <div className="flex flex-col items-end gap-3 min-w-[200px]">
               <div className="text-[10px] font-black uppercase tracking-widest bg-slate-100 px-3 py-1 border-2 border-black inline-block">
                 Status: <span className={`
                    ${app.status === 'pending' ? 'text-amber-500' : ''}
                    ${app.status === 'reviewing' ? 'text-sky-500' : ''}
                    ${app.status === 'interview' ? 'text-indigo-500' : ''}
                    ${app.status === 'rejected' ? 'text-rose-500' : ''}
                    ${app.status === 'hired' ? 'text-emerald-500' : ''}
                 `}>{app.status}</span>
               </div>

               <div className="flex flex-wrap gap-2 justify-end w-full">
                  <select 
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    disabled={loadingId === app.id}
                    className="border-2 border-black text-[10px] font-black uppercase tracking-widest p-2 bg-white focus:outline-none cursor-pointer hover:bg-slate-50"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="interview">Interview</option>
                    <option value="hired">Hired</option>
                    <option value="rejected">Rejected</option>
                  </select>
               </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewApplications;
