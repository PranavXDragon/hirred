"use client";

import React, { useState, useEffect } from 'react';
import { Eye, Users, UserCheck } from 'lucide-react';

const RecruiterActivity = () => {
  const [views, setViews] = useState(0);
  const [applications, setApplications] = useState(0);

  useEffect(() => {
    const v = Math.floor(Math.random() * 500) + 50;
    setViews(v);
    setApplications(Math.floor(v * 0.2));
  }, []);

  const activeStatus = "Active 2 hours ago";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-center items-center text-center group hover:bg-sky-50 transition-colors">
        <Eye className="text-sky-500 mb-2 group-hover:scale-110 transition-transform" size={24} />
        <h4 className="font-black text-2xl uppercase tracking-tighter">{views}</h4>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Views Today</span>
      </div>

      <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-center items-center text-center group hover:bg-emerald-50 transition-colors">
        <Users className="text-emerald-500 mb-2 group-hover:scale-110 transition-transform" size={24} />
        <h4 className="font-black text-2xl uppercase tracking-tighter">{applications}</h4>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Applicants</span>
      </div>

      <div className="bg-black text-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(14,165,233,1)] flex flex-col justify-center items-center text-center">
        <UserCheck className="text-yellow-400 mb-2" size={24} />
        <h4 className="font-black text-sm uppercase tracking-tighter mb-1 leading-tight">{activeStatus}</h4>
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Recruiter Status</span>
      </div>
    </div>
  );
};

export default RecruiterActivity;
