"use client";

import React, { useState } from 'react';
import { postJob } from '../../../lib/actions/employer';
import { Briefcase, MapPin, IndianRupee, Rocket, Calendar, CheckCircle2 } from 'lucide-react';

const PostJobForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Full-Time',
    location: '',
    salary_range: '',
    category: 'Engineering',
    description: '',
    stack: '',
    responsibilities: '',
    deadline: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');
    
    try {
      await postJob(formData);
      setSuccess(true);
      // Reset form on success
      setFormData({
        title: '',
        type: 'Full-Time',
        location: '',
        salary_range: '',
        category: 'Engineering',
        description: '',
        stack: '',
        responsibilities: '',
        deadline: ''
      });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white border-[4px] border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      
      <div className="border-b-4 border-black pb-4 mb-6">
        <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
          <Rocket className="text-rose-500" /> Transmit Job Protocol
        </h3>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2">Publish an open role to the global network.</p>
      </div>

      {error && (
        <div className="bg-rose-100 border-2 border-rose-500 text-rose-700 font-bold p-4 text-sm">
          ERROR: {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Job Title</label>
          <input 
            required name="title" value={formData.title} onChange={handleChange}
            placeholder="e.g. Senior Backend Engineer"
            className="w-full border-[3px] border-black p-4 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(244,63,94,1)] transition-all bg-slate-50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Employment Type</label>
          <select 
            required name="type" value={formData.type} onChange={handleChange}
            className="w-full border-[3px] border-black p-4 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(244,63,94,1)] transition-all bg-slate-50 appearance-none"
          >
            <option value="Full-Time">Full-Time</option>
            <option value="Contract">Contract</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Location</label>
          <div className="relative">
             <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input 
                required name="location" value={formData.location} onChange={handleChange}
                placeholder="Remote, Hybrid, or City"
                className="w-full border-[3px] border-black p-4 pl-12 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(244,63,94,1)] transition-all bg-slate-50"
             />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Salary Range</label>
          <div className="relative">
             <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input 
                required name="salary_range" value={formData.salary_range} onChange={handleChange}
                placeholder="e.g. ₹18L - ₹24L"
                className="w-full border-[3px] border-black p-4 pl-12 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(244,63,94,1)] transition-all bg-slate-50"
             />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Category</label>
          <select 
            required name="category" value={formData.category} onChange={handleChange}
            className="w-full border-[3px] border-black p-4 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(244,63,94,1)] transition-all bg-slate-50 appearance-none"
          >
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="AI/ML">AI/ML</option>
            <option value="DevOps/Cloud">DevOps/Cloud</option>
            <option value="Cyber Security">Cyber Security</option>
            <option value="Data Science">Data Science</option>
            <option value="Management">Management</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tech Stack (Comma Separated)</label>
          <input 
            required name="stack" value={formData.stack} onChange={handleChange}
            placeholder="React, Node.js, AWS, PostgreSQL"
            className="w-full border-[3px] border-black p-4 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(244,63,94,1)] transition-all bg-slate-50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Job Description</label>
        <textarea 
          required name="description" value={formData.description} onChange={handleChange}
          rows="4"
          placeholder="Detailed description of the role and impact..."
          className="w-full border-[3px] border-black p-4 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(244,63,94,1)] transition-all bg-slate-50"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Key Responsibilities (One per line)</label>
        <textarea 
          required name="responsibilities" value={formData.responsibilities} onChange={handleChange}
          rows="4"
          placeholder="- Architect scalable systems&#10;- Mentor junior developers"
          className="w-full border-[3px] border-black p-4 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(244,63,94,1)] transition-all bg-slate-50"
        />
      </div>

      <div className="space-y-2 md:w-1/2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
           <Calendar size={14} /> Application Deadline
        </label>
        <input 
          type="datetime-local"
          name="deadline" value={formData.deadline} onChange={handleChange}
          className="w-full border-[3px] border-black p-4 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(244,63,94,1)] transition-all bg-slate-50"
        />
      </div>

      <button 
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white font-black uppercase tracking-widest text-sm py-5 border-[4px] border-black hover:bg-rose-500 hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(244,63,94,1)] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2"
      >
        {loading ? 'Transmitting...' : 'Post Job'}
        {success && <CheckCircle2 className="text-black" size={18} />}
      </button>

      {success && (
         <div className="text-center font-bold text-rose-600 mt-4 uppercase tracking-widest text-xs">
            Job Protocol Transmitted Successfully!
         </div>
      )}

    </form>
  );
};

export default PostJobForm;
