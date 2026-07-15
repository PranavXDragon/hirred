"use client";

import React, { useState, useEffect } from 'react';
import { Settings, Save, Loader2 } from 'lucide-react';
import { getMentorProfile, updateMentorProfile } from '../../../lib/actions/mentors';

export default function MentorSettingsPanel({ user, setAlertMessage }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    location: '',
    rate: '',
    domain: '',
    expertise: ''
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getMentorProfile(user.id);
        if (data) {
          setFormData({
            company: data.company || '',
            role: data.role || '',
            location: data.location || '',
            rate: data.rate || '',
            domain: data.domain || '',
            expertise: data.expertise ? data.expertise.join(', ') : ''
          });
        }
      } catch (error) {
        console.error("Error fetching mentor profile:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [user.id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        expertise: formData.expertise.split(',').map(s => s.trim()).filter(Boolean),
        rate: parseFloat(formData.rate) || 0
      };
      await updateMentorProfile(payload);
      setAlertMessage('Settings Saved Successfully');
    } catch (error) {
      setAlertMessage(`Error: ${error.message}`);
    }
    setSaving(false);
    setTimeout(() => setAlertMessage(''), 3000);
  };

  if (loading) {
    return (
      <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-12 flex justify-center">
        <Loader2 className="animate-spin text-purple-500" size={48} />
      </div>
    );
  }

  return (
    <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
      <div className="p-6 border-b-4 border-black bg-slate-50 flex items-center justify-between">
        <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
          <Settings size={24} className="text-purple-500" /> Mentor Settings
        </h3>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative group">
            <input 
              type="text" 
              name="company"
              required
              placeholder=" "
              className="w-full bg-transparent border-b-[3px] border-black py-3 font-black uppercase text-sm focus:outline-none focus:border-purple-500 transition-colors peer"
              value={formData.company}
              onChange={handleChange}
            />
            <label className="absolute left-0 top-3 text-slate-300 font-black uppercase text-xs tracking-widest transition-all pointer-events-none peer-focus:-top-4 peer-focus:text-purple-500 peer-[:not(:placeholder-shown)]:-top-4">
              Current Company
            </label>
          </div>
          
          <div className="relative group">
            <input 
              type="text" 
              name="role"
              required
              placeholder=" "
              className="w-full bg-transparent border-b-[3px] border-black py-3 font-black uppercase text-sm focus:outline-none focus:border-purple-500 transition-colors peer"
              value={formData.role}
              onChange={handleChange}
            />
            <label className="absolute left-0 top-3 text-slate-300 font-black uppercase text-xs tracking-widest transition-all pointer-events-none peer-focus:-top-4 peer-focus:text-purple-500 peer-[:not(:placeholder-shown)]:-top-4">
              Job Role / Title
            </label>
          </div>

          <div className="relative group">
            <input 
              type="text" 
              name="location"
              required
              placeholder=" "
              className="w-full bg-transparent border-b-[3px] border-black py-3 font-black uppercase text-sm focus:outline-none focus:border-purple-500 transition-colors peer"
              value={formData.location}
              onChange={handleChange}
            />
            <label className="absolute left-0 top-3 text-slate-300 font-black uppercase text-xs tracking-widest transition-all pointer-events-none peer-focus:-top-4 peer-focus:text-purple-500 peer-[:not(:placeholder-shown)]:-top-4">
              Location
            </label>
          </div>

          <div className="relative group">
            <input 
              type="number" 
              name="rate"
              required
              placeholder=" "
              className="w-full bg-transparent border-b-[3px] border-black py-3 font-black uppercase text-sm focus:outline-none focus:border-purple-500 transition-colors peer"
              value={formData.rate}
              onChange={handleChange}
            />
            <label className="absolute left-0 top-3 text-slate-300 font-black uppercase text-xs tracking-widest transition-all pointer-events-none peer-focus:-top-4 peer-focus:text-purple-500 peer-[:not(:placeholder-shown)]:-top-4">
              Session Rate (₹)
            </label>
          </div>
          
          <div className="relative group">
            <input 
              type="text" 
              name="domain"
              required
              placeholder=" "
              className="w-full bg-transparent border-b-[3px] border-black py-3 font-black uppercase text-sm focus:outline-none focus:border-purple-500 transition-colors peer"
              value={formData.domain}
              onChange={handleChange}
            />
            <label className="absolute left-0 top-3 text-slate-300 font-black uppercase text-xs tracking-widest transition-all pointer-events-none peer-focus:-top-4 peer-focus:text-purple-500 peer-[:not(:placeholder-shown)]:-top-4">
              Primary Domain (e.g. Frontend)
            </label>
          </div>

          <div className="relative group">
            <input 
              type="text" 
              name="expertise"
              required
              placeholder=" "
              className="w-full bg-transparent border-b-[3px] border-black py-3 font-black uppercase text-sm focus:outline-none focus:border-purple-500 transition-colors peer"
              value={formData.expertise}
              onChange={handleChange}
            />
            <label className="absolute left-0 top-3 text-slate-300 font-black uppercase text-xs tracking-widest transition-all pointer-events-none peer-focus:-top-4 peer-focus:text-purple-500 peer-[:not(:placeholder-shown)]:-top-4">
              Expertise (Comma separated)
            </label>
          </div>
        </div>

        <div className="pt-6 border-t-2 border-slate-200 flex justify-end">
          <button 
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-purple-500 text-white px-8 py-3 font-black uppercase tracking-widest text-[10px] border-2 border-black hover:bg-black transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} 
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
