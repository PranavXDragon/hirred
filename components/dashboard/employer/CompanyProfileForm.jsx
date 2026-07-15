"use client";

import React, { useState } from 'react';
import { saveCompanyProfile } from '../../../lib/actions/employer';
import { Building, Globe, MapPin, Users, CheckCircle2, AlignLeft, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const availablePerks = [
  { iconName: 'Rocket', title: 'Hyper-Growth', desc: 'Join a scaling team working on high-impact products.' },
  { iconName: 'ShieldCheck', title: 'Elite Benefits', desc: 'Top-tier health, dental, and wellness stipends.' },
  { iconName: 'Coffee', title: 'Flexible Culture', desc: 'Remote-first or hybrid. You choose where you do your best work.' },
  { iconName: 'Code', title: 'Modern Stack', desc: 'Work with Next.js, Rust, Go, and the latest AI models.' },
  { iconName: 'Zap', title: 'Fast Execution', desc: 'Zero red tape. Ship code to production on day one.' },
  { iconName: 'HeartHandshake', title: 'Equity Grants', desc: 'Own a piece of the architecture you build.' },
];

const CompanyProfileForm = ({ initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    industry: initialData?.industry || '',
    location: initialData?.location || '',
    size: initialData?.size || '',
    remote: initialData?.remote ? 'true' : 'false',
    website: initialData?.website || '',
    about: initialData?.about || '',
    perks: initialData?.perks || [],
    workLife: initialData?.culture_ratings?.workLife || 0,
    compensation: initialData?.culture_ratings?.compensation || 0,
    culture: initialData?.culture_ratings?.culture || 0,
    growth: initialData?.culture_ratings?.growth || 0,
    diversity: initialData?.culture_ratings?.diversity || 0
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePerk = (perk) => {
    const exists = formData.perks.find(p => p.title === perk.title);
    if (exists) {
      setFormData({ ...formData, perks: formData.perks.filter(p => p.title !== perk.title) });
    } else {
      setFormData({ ...formData, perks: [...formData.perks, perk] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      await saveCompanyProfile(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      
      {/* Basic Info */}
      <div className="bg-white border-[4px] border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-xl font-black uppercase tracking-tighter mb-6 border-b-4 border-black pb-4 flex items-center gap-2">
          <Building className="text-sky-500" /> Core Organization Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Company Name</label>
            <input 
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border-[3px] border-black p-4 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(14,165,233,1)] transition-all bg-slate-50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Industry Domain</label>
            <input 
              required
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              placeholder="e.g. Enterprise SaaS, FinTech"
              className="w-full border-[3px] border-black p-4 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(14,165,233,1)] transition-all bg-slate-50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Headquarters / Location</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                required
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border-[3px] border-black p-4 pl-12 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(14,165,233,1)] transition-all bg-slate-50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Website</label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full border-[3px] border-black p-4 pl-12 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(14,165,233,1)] transition-all bg-slate-50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Headcount (Size)</label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select 
                required
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="w-full border-[3px] border-black p-4 pl-12 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(14,165,233,1)] transition-all bg-slate-50 appearance-none"
              >
                <option value="">Select Size</option>
                <option value="1-10">1-10 Employees</option>
                <option value="10-50">10-50 Employees</option>
                <option value="50-200">50-200 Employees</option>
                <option value="200-500">200-500 Employees</option>
                <option value="500-1000">500-1000 Employees</option>
                <option value="1000+">1000+ Employees</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Remote Policy</label>
            <select 
              name="remote"
              value={formData.remote}
              onChange={handleChange}
              className="w-full border-[3px] border-black p-4 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(14,165,233,1)] transition-all bg-slate-50 appearance-none"
            >
              <option value="true">Remote Friendly</option>
              <option value="false">On-Site / Hybrid Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white border-[4px] border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-xl font-black uppercase tracking-tighter mb-6 border-b-4 border-black pb-4 flex items-center gap-2">
          <AlignLeft className="text-sky-500" /> About Organization
        </h3>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Company Overview</label>
          <textarea 
            name="about"
            value={formData.about}
            onChange={handleChange}
            placeholder="Tell job seekers about your mission, vision, and what makes your company unique..."
            rows={6}
            className="w-full border-[3px] border-black p-4 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(14,165,233,1)] transition-all bg-slate-50 resize-none"
          />
        </div>
      </div>

      {/* Perks Selector */}
      <div className="bg-white border-[4px] border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-xl font-black uppercase tracking-tighter mb-2 flex items-center gap-2">
          <Award className="text-emerald-500" /> Perks & Benefits
        </h3>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 border-b-4 border-black pb-4">
          Select the benefits you offer to showcase on your profile.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availablePerks.map(perk => {
            const isSelected = !!formData.perks.find(p => p.title === perk.title);
            return (
              <button
                key={perk.title}
                type="button"
                onClick={() => togglePerk(perk)}
                className={`text-left p-4 border-[3px] transition-all flex flex-col gap-1 ${
                  isSelected 
                    ? 'border-black bg-emerald-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                    : 'border-slate-200 bg-white hover:border-black'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-black text-xs uppercase tracking-widest text-black">{perk.title}</span>
                  {isSelected && <CheckCircle2 size={16} className="text-emerald-600" />}
                </div>
                <span className="text-[10px] font-bold text-slate-500 leading-tight">{perk.desc}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Culture Ratings */}
      <div className="bg-slate-50 border-[4px] border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
         <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Culture Metrics</h3>
         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 pb-4 border-b-2 border-black">Rate your company out of 5.0 to display on the Companies Directory.</p>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['workLife', 'compensation', 'culture', 'growth', 'diversity'].map(metric => (
              <div key={metric} className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex justify-between">
                  {metric} <span className="text-sky-500">{formData[metric]} / 5</span>
                </label>
                <input 
                  type="range"
                  name={metric}
                  min="0" max="5" step="0.1"
                  value={formData[metric]}
                  onChange={handleChange}
                  className="w-full accent-black cursor-pointer"
                />
              </div>
            ))}
         </div>
      </div>

      <button 
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white font-black uppercase tracking-widest text-sm py-5 border-[4px] border-black hover:bg-sky-500 hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(14,165,233,1)] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2"
      >
        {loading ? 'Saving Protocol...' : 'Save Organization Profile'}
        {success && <CheckCircle2 className="text-emerald-500" size={18} />}
      </button>

    </form>
  );
};

export default CompanyProfileForm;
