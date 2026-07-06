"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';
import { 
  User, 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Check, 
  Trash2, 
  Upload, 
  Moon, 
  Sun, 
  Smartphone,
  Save,
  Zap,
  FileText,
  ArrowRight,
  Building,
  Briefcase
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../../context/ThemeContext';

export default function SettingsClient({ initialUser, initialCompany }) {
  const router = useRouter();
  const [user, setUser] = useState(initialUser);
  const [company, setCompany] = useState(initialCompany);
  const [activeTab, setActiveTab] = useState('account');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // Job Seeker State
  const [studentForm, setStudentForm] = useState({
    name: initialUser?.full_name || '',
    email: initialUser?.email || '',
    bio: initialUser?.bio || '',
    phone: initialUser?.phone || '',
    college: initialUser?.college || '',
    location: initialUser?.location || '',
    experience: initialUser?.experience || '',
    linkedin_url: initialUser?.linkedin_url || '',
    visibility: 'public',
    resumeName: initialUser?.resume_url || 'Resume_Technical_Draft.pdf'
  });

  // Employer State
  const [employerForm, setEmployerForm] = useState({
    name: initialUser?.full_name || '',
    email: initialUser?.email || '',
    companyName: initialCompany?.name || '',
    industry: initialCompany?.industry || '',
    location: initialCompany?.location || '',
    size: initialCompany?.size || '',
    website: initialCompany?.website || '',
  });

  const { theme, setTheme, accent: accentColor, setAccent: setAccentColor, density, setDensity } = useTheme();

  const [notifications, setNotifications] = useState(initialUser?.preferences?.notifications || {
    emailJobs: true,
    emailApplications: true,
    emailMessages: false,
    frequency: 'instant'
  });

  const [security, setSecurity] = useState(initialUser?.preferences?.security || {
    twoFactor: false,
    sessionTimeout: '30'
  });

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSaveAccount = async (e) => {
    e.preventDefault();
    
    let updates = {};
    if (user.role === 'employer') {
      updates = { full_name: employerForm.name };
      
      const companyPayload = {
        name: employerForm.companyName,
        industry: employerForm.industry,
        location: employerForm.location,
        size: employerForm.size,
        website: employerForm.website,
      };

      if (company?.id) {
        await supabase.from('companies').update(companyPayload).eq('id', company.id);
      } else {
        await supabase.from('companies').insert({ ...companyPayload, employer_id: user.id });
      }
    } else {
      updates = { 
        full_name: studentForm.name,
        bio: studentForm.bio,
        phone: studentForm.phone,
        college: studentForm.college,
        location: studentForm.location,
        experience: studentForm.experience,
        linkedin_url: studentForm.linkedin_url,
      };
    }

    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);

    if (error) {
      triggerToast('Error: Failed to synchronize profile.');
    } else {
      triggerToast('Profile registry synchronized successfully.');
      setUser({ ...user, full_name: updates.full_name });
    }
  };

  // Auto-save Theme/Accent to DB immediately when clicked
  const updatePreference = async (key, value) => {
    const newPreferences = {
      ...user?.preferences,
      theme: key === 'theme' ? value : theme,
      accentColor: key === 'accentColor' ? value : accentColor,
      density: key === 'density' ? value : density,
      notifications,
      security
    };

    if (key === 'theme') setTheme(value);
    if (key === 'accentColor') setAccentColor(value);
    if (key === 'density') setDensity(value);

    if (user?.id) {
      await supabase.from('profiles').update({ preferences: newPreferences }).eq('id', user.id);
      setUser({ ...user, preferences: newPreferences });
    }
    triggerToast('Personalization preferences synced.');
  };

  const handleSaveNotifications = async () => {
    const newPreferences = { ...user?.preferences, theme, accentColor, density, notifications, security };
    if (user?.id) {
      await supabase.from('profiles').update({ preferences: newPreferences }).eq('id', user.id);
    }
    triggerToast('Alert signals preferences committed.');
  };

  const handleSaveSecurity = async () => {
    const newPreferences = { ...user?.preferences, theme, accentColor, density, notifications, security };
    if (user?.id) {
      await supabase.from('profiles').update({ preferences: newPreferences }).eq('id', user.id);
    }
    triggerToast('Cryptographic security settings saved.');
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('WARNING: Are you sure you want to permanently purge your account? This action is irreversible.')) {
      return;
    }
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="bg-white min-h-screen pt-28 pb-20 relative">
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ 
             backgroundImage: `linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)`, 
             backgroundSize: '40px 40px' 
           }}>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        <header className="mb-12 border-b-4 border-black pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4">
              System <br /><span className="text-sky-500 italic">Settings.</span>
            </h1>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Configure profile nodes, alerts, and platform layouts.</p>
          </div>
          
          <div className="bg-slate-50 border-[3px] border-black p-4 inline-flex items-center gap-3 self-start md:self-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-black animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Active: {user.full_name} ({user.role})
            </span>
          </div>
        </header>

        <AnimatePresence>
          {showToast && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-black border-[3px] border-emerald-500 text-white px-6 py-4 shadow-[6px_6px_0px_0px_rgba(16,185,129,1)] flex items-center gap-3 font-black uppercase tracking-wider text-xs"
            >
              <Check className="text-emerald-500" size={16} />
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <aside className="lg:col-span-3 flex flex-col gap-2">
            {[
              { id: 'account', name: 'Profile & Account', icon: User, show: true },
              { id: 'preferences', name: 'Preferences & Themes', icon: SettingsIcon, show: true },
              { id: 'notifications', name: 'Alerts & Signals', icon: Bell, show: true },
              { id: 'security', name: 'Security & Privacy', icon: Shield, show: true },
              { id: 'cv-builder', name: 'AI Resume Builder 📝', icon: FileText, show: user.role !== 'employer' },
              { id: 'pro', name: 'Get hirrd Pro ⚡', icon: Zap, show: true }
            ].filter(t => t.show).map(tab => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-left px-5 py-4 font-black uppercase text-[11px] tracking-widest border-3 transition-all flex items-center gap-3 cursor-pointer
                    ${activeTab === tab.id 
                      ? 'bg-black text-white border-black translate-x-1 shadow-[4px_4px_0px_0px_rgba(14,165,233,1)]' 
                      : 'bg-white text-slate-400 border-slate-100 hover:border-black hover:text-black'}
                  `}
                >
                  <IconComp size={16} />
                  {tab.name}
                </button>
              );
            })}
          </aside>

          <main className="lg:col-span-9">
            
            {activeTab === 'account' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white border-[3px] border-black p-8 md:p-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] space-y-8"
              >
                <h3 className="text-2xl font-black uppercase tracking-tight border-b-2 border-black pb-4">
                  Account Details
                </h3>

                <form onSubmit={handleSaveAccount} className="space-y-6">
                  {/* Common Contact Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Full Name</label>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-slate-50 border-[3px] border-black p-3 font-bold focus:outline-none focus:bg-white transition-colors"
                        value={user.role === 'employer' ? employerForm.name : studentForm.name}
                        onChange={(e) => user.role === 'employer' ? setEmployerForm({ ...employerForm, name: e.target.value }) : setStudentForm({ ...studentForm, name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Email Address</label>
                      <input 
                        type="email" 
                        disabled
                        className="w-full bg-slate-100 border-[3px] border-slate-300 text-slate-500 p-3 font-bold focus:outline-none"
                        value={user.role === 'employer' ? employerForm.email : studentForm.email}
                      />
                      <p className="text-[9px] font-bold text-slate-400 uppercase">Contact support to change email</p>
                    </div>
                  </div>

                  {/* Job Seeker Only Fields */}
                  {user.role !== 'employer' && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Professional Bio</label>
                          <textarea 
                            className="w-full bg-slate-50 border-[3px] border-black p-3 font-bold focus:outline-none focus:bg-white transition-colors h-24"
                            value={studentForm.bio}
                            onChange={(e) => setStudentForm({ ...studentForm, bio: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Experience (Years)</label>
                          <input 
                            type="text" 
                            className="w-full bg-slate-50 border-[3px] border-black p-3 font-bold focus:outline-none focus:bg-white transition-colors"
                            value={studentForm.experience}
                            onChange={(e) => setStudentForm({ ...studentForm, experience: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">College / University</label>
                          <input 
                            type="text" 
                            className="w-full bg-slate-50 border-[3px] border-black p-3 font-bold focus:outline-none focus:bg-white transition-colors"
                            value={studentForm.college}
                            onChange={(e) => setStudentForm({ ...studentForm, college: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Location</label>
                          <input 
                            type="text" 
                            className="w-full bg-slate-50 border-[3px] border-black p-3 font-bold focus:outline-none focus:bg-white transition-colors"
                            value={studentForm.location}
                            onChange={(e) => setStudentForm({ ...studentForm, location: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">LinkedIn URL</label>
                          <input 
                            type="text" 
                            className="w-full bg-slate-50 border-[3px] border-black p-3 font-bold focus:outline-none focus:bg-white transition-colors"
                            value={studentForm.linkedin_url}
                            onChange={(e) => setStudentForm({ ...studentForm, linkedin_url: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Phone</label>
                          <input 
                            type="text" 
                            className="w-full bg-slate-50 border-[3px] border-black p-3 font-bold focus:outline-none focus:bg-white transition-colors"
                            value={studentForm.phone}
                            onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Registry Visibility</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {[
                            { id: 'public', label: 'Public (All Recruiters)' },
                            { id: 'recruiter', label: 'Protected (Recruiter Verification Only)' },
                            { id: 'private', label: 'Hidden (Private Node)' }
                          ].map(opt => (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setStudentForm({ ...studentForm, visibility: opt.id })}
                              className={`p-4 border-2 font-black uppercase text-[9px] tracking-wider transition-all
                                ${studentForm.visibility === opt.id 
                                  ? 'bg-black border-black text-white shadow-[4px_4px_0px_0px_rgba(14,165,233,1)]' 
                                  : 'bg-slate-50 border-slate-100 hover:border-black text-slate-500 hover:text-black'}
                              `}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-300 rounded-none space-y-4">
                        <div className="flex justify-between items-center flex-wrap gap-4">
                          <div>
                            <h4 className="text-xs font-black uppercase mb-1">Attached CV Documentation</h4>
                            <p className="text-[10px] font-bold text-slate-400 tracking-tight">{studentForm.resumeName}</p>
                          </div>
                          <button 
                            type="button"
                            onClick={() => {
                              const customName = prompt('Enter mock file name to attach:', 'Resume_Draft_Final_2026.pdf');
                              if (customName) setStudentForm({ ...studentForm, resumeName: customName });
                            }}
                            className="bg-black text-white hover:bg-sky-500 hover:text-black px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2 cursor-pointer"
                          >
                            <Upload size={12} /> Replace
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Employer Only Fields */}
                  {user.role === 'employer' && (
                    <>
                      <div className="bg-slate-100 p-6 border-[3px] border-black space-y-6">
                        <h4 className="text-sm font-black uppercase flex items-center gap-2">
                          <Building className="text-sky-500" /> Corporate Entity Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Company Name</label>
                            <input 
                              type="text" 
                              required
                              className="w-full bg-white border-[3px] border-black p-3 font-bold focus:outline-none transition-colors"
                              value={employerForm.companyName}
                              onChange={(e) => setEmployerForm({ ...employerForm, companyName: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Industry</label>
                            <input 
                              type="text" 
                              required
                              className="w-full bg-white border-[3px] border-black p-3 font-bold focus:outline-none transition-colors"
                              value={employerForm.industry}
                              onChange={(e) => setEmployerForm({ ...employerForm, industry: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Headquarters Location</label>
                            <input 
                              type="text" 
                              required
                              className="w-full bg-white border-[3px] border-black p-3 font-bold focus:outline-none transition-colors"
                              value={employerForm.location}
                              onChange={(e) => setEmployerForm({ ...employerForm, location: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Company Size</label>
                            <select 
                              className="w-full bg-white border-[3px] border-black p-3.5 font-bold focus:outline-none transition-colors"
                              value={employerForm.size}
                              onChange={(e) => setEmployerForm({ ...employerForm, size: e.target.value })}
                            >
                              <option value="">Select Size...</option>
                              <option value="1-10">1-10 Employees</option>
                              <option value="11-50">11-50 Employees</option>
                              <option value="51-200">51-200 Employees</option>
                              <option value="201-500">201-500 Employees</option>
                              <option value="500+">500+ Employees</option>
                            </select>
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Corporate Website</label>
                            <input 
                              type="url" 
                              className="w-full bg-white border-[3px] border-black p-3 font-bold focus:outline-none transition-colors"
                              value={employerForm.website}
                              onChange={(e) => setEmployerForm({ ...employerForm, website: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="pt-6 border-t-2 border-slate-100 flex justify-between items-center gap-4 flex-wrap">
                    <button 
                      type="submit"
                      className="bg-black text-white hover:bg-sky-500 hover:text-black px-8 py-4 font-black uppercase text-xs tracking-[0.2em] transition-all shadow-[6px_6px_0px_0px_rgba(14,165,233,1)] active:translate-y-1 active:shadow-none flex items-center gap-2 cursor-pointer"
                    >
                      <Save size={14} /> Synchronize Profile
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {activeTab === 'preferences' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white border-[3px] border-black p-8 md:p-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] space-y-8"
              >
                <h3 className="text-2xl font-black uppercase tracking-tight border-b-2 border-black pb-4">
                  Layout & Design Settings
                </h3>
                <p className="text-xs font-bold text-slate-500 mb-6 uppercase">These settings are instantly saved to your profile and follow you across devices.</p>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Theme Scheme</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => updatePreference('theme', 'light')}
                        className={`p-6 border-[3px] flex items-center justify-center gap-3 font-black uppercase text-xs tracking-wider transition-all cursor-pointer
                          ${theme === 'light' 
                            ? 'bg-white border-black text-black shadow-[6px_6px_0px_0px_rgba(14,165,233,1)]' 
                            : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-black hover:text-black'}
                        `}
                      >
                        <Sun size={18} className="text-amber-500" fill="currentColor" /> Light Mode
                      </button>

                      <button
                        onClick={() => updatePreference('theme', 'dark')}
                        className={`p-6 border-[3px] flex items-center justify-center gap-3 font-black uppercase text-xs tracking-wider transition-all cursor-pointer
                          ${theme === 'dark' 
                            ? 'bg-black border-black text-white shadow-[6px_6px_0px_0px_rgba(14,165,233,1)]' 
                            : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-black hover:text-black'}
                        `}
                      >
                        <Moon size={18} className="text-sky-400" fill="currentColor" /> Dark Mode
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">System Accent Color</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { id: 'sky', label: 'Sky Blue', color: 'bg-[#0ea5e9]' },
                        { id: 'emerald', label: 'Emerald Green', color: 'bg-[#10b981]' },
                        { id: 'pink', label: 'Hot Pink', color: 'bg-[#ec4899]' },
                        { id: 'amber', label: 'Amber Gold', color: 'bg-[#f59e0b]' }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => updatePreference('accentColor', opt.id)}
                          className={`p-4 border-2 font-black uppercase text-[10px] tracking-wider transition-all flex items-center gap-2 cursor-pointer
                            ${accentColor === opt.id 
                              ? 'bg-black border-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                              : 'bg-slate-50 border-slate-100 hover:border-black text-slate-500 hover:text-black'}
                          `}
                        >
                          <span className={`w-3.5 h-3.5 border border-black rounded-full ${opt.color}`}></span>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Layout Spacing Density</label>
                    <div className="flex gap-4">
                      {['cozy', 'comfortable', 'spacious'].map(opt => (
                        <button
                          key={opt}
                          onClick={() => updatePreference('density', opt)}
                          className={`flex-1 p-3 border-2 font-black uppercase text-[10px] tracking-widest transition-all cursor-pointer
                            ${density === opt 
                              ? 'bg-black border-black text-white' 
                              : 'bg-slate-50 border-slate-100 hover:border-black hover:text-black text-slate-400'}
                          `}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white border-[3px] border-black p-8 md:p-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] space-y-8"
              >
                <h3 className="text-2xl font-black uppercase tracking-tight border-b-2 border-black pb-4">
                  Signal Alerts Preferences
                </h3>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                      <div>
                        <h4 className="text-xs font-black uppercase mb-1">New Vacancy Alert Signals</h4>
                        <p className="text-[10px] font-bold text-slate-400">Receive dispatch emails when matching positions go live.</p>
                      </div>
                      <input 
                        type="checkbox"
                        className="w-5 h-5 accent-sky-500 cursor-pointer"
                        checked={notifications.emailJobs}
                        onChange={(e) => setNotifications({ ...notifications, emailJobs: e.target.checked })}
                      />
                    </div>

                    <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                      <div>
                        <h4 className="text-xs font-black uppercase mb-1">Application Dispatches Updates</h4>
                        <p className="text-[10px] font-bold text-slate-400">Alert me when a recruiter updates an application pipeline node.</p>
                      </div>
                      <input 
                        type="checkbox"
                        className="w-5 h-5 accent-sky-500 cursor-pointer"
                        checked={notifications.emailApplications}
                        onChange={(e) => setNotifications({ ...notifications, emailApplications: e.target.checked })}
                      />
                    </div>

                    <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                      <div>
                        <h4 className="text-xs font-black uppercase mb-1">Direct Chat Messages</h4>
                        <p className="text-[10px] font-bold text-slate-400">Receive instant alerts for recruiter chat transcripts.</p>
                      </div>
                      <input 
                        type="checkbox"
                        className="w-5 h-5 accent-sky-500 cursor-pointer"
                        checked={notifications.emailMessages}
                        onChange={(e) => setNotifications({ ...notifications, emailMessages: e.target.checked })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Dispatch Interval Frequency</label>
                    <select
                      className="w-full bg-slate-50 border-[3px] border-black p-3.5 font-bold focus:outline-none uppercase text-xs tracking-wider cursor-pointer"
                      value={notifications.frequency}
                      onChange={(e) => setNotifications({ ...notifications, frequency: e.target.value })}
                    >
                      <option value="instant">Instant Signals Dispatch</option>
                      <option value="daily">Daily Digest Dispatches</option>
                      <option value="weekly">Weekly Compilation Node</option>
                    </select>
                  </div>

                  <div className="pt-6 border-t-2 border-slate-100">
                    <button 
                      onClick={handleSaveNotifications}
                      className="bg-black text-white hover:bg-sky-500 hover:text-black px-8 py-4 font-black uppercase text-xs tracking-[0.2em] transition-all shadow-[6px_6px_0px_0px_rgba(14,165,233,1)] active:translate-y-1 active:shadow-none cursor-pointer"
                    >
                      Save Dispatch Rules
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="bg-white border-[3px] border-black p-8 md:p-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] space-y-6">
                  <h3 className="text-2xl font-black uppercase tracking-tight border-b-2 border-black pb-4">
                    Cryptographic Controls
                  </h3>

                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <div>
                      <h4 className="text-xs font-black uppercase mb-1">Two-Factor Authenticator (2FA)</h4>
                      <p className="text-[10px] font-bold text-slate-400">Require an MFA token signature on session verification requests.</p>
                    </div>
                    <input 
                      type="checkbox"
                      className="w-5 h-5 accent-sky-500 cursor-pointer"
                      checked={security.twoFactor}
                      onChange={(e) => setSecurity({ ...security, twoFactor: e.target.checked })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Session Idle Timeout</label>
                    <select
                      className="w-full bg-slate-50 border-[3px] border-black p-3.5 font-bold focus:outline-none uppercase text-xs tracking-wider cursor-pointer"
                      value={security.sessionTimeout}
                      onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
                    >
                      <option value="15">15 Minutes Idle</option>
                      <option value="30">30 Minutes Idle</option>
                      <option value="60">1 Hour Idle</option>
                      <option value="never">Never Terminal Terminate</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Registered Session Nodes</label>
                    <div className="bg-slate-50 border-2 border-black p-4 space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-600">
                        <span className="flex items-center gap-1.5"><Smartphone size={12} /> Chrome (Windows NT)</span>
                        <span className="text-emerald-600 uppercase font-black tracking-widest">Active Node</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 border-t border-slate-200 pt-2">
                        <span className="flex items-center gap-1.5"><Smartphone size={12} /> Safari (iOS Mobile)</span>
                        <span>Logged out 2 hours ago</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <button 
                      onClick={handleSaveSecurity}
                      className="bg-black text-white hover:bg-sky-500 hover:text-black px-8 py-4 font-black uppercase text-xs tracking-[0.2em] transition-all shadow-[6px_6px_0px_0px_rgba(14,165,233,1)] active:translate-y-1 active:shadow-none cursor-pointer"
                    >
                      Save Security Rules
                    </button>
                  </div>
                </div>

                <div className="bg-red-50 border-[3px] border-red-500 p-8 shadow-[10px_10px_0px_0px_rgba(239,68,68,1)] space-y-6">
                  <h3 className="text-2xl font-black uppercase tracking-tight border-b-2 border-red-500 text-red-700 pb-4">
                    Danger Zone Purge
                  </h3>
                  <p className="text-xs font-black uppercase tracking-tight text-red-600">
                    Purging your account will destroy your registry profile and credentials. All job pipelines and records will be deleted immediately.
                  </p>
                  <button 
                    onClick={handleDeleteAccount}
                    className="bg-red-600 text-white hover:bg-black hover:text-red-500 border-2 border-black px-6 py-4 font-black uppercase text-xs tracking-[0.2em] transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Trash2 size={14} /> Purge Account Node
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'cv-builder' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white border-[3px] border-black p-8 md:p-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] space-y-6"
              >
                <h3 className="text-2xl font-black uppercase tracking-tight border-b-2 border-black pb-4 flex items-center gap-2">
                  <FileText className="text-sky-500" /> Resume Builder Engine
                </h3>
                <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase">
                  Compile a professional developer resume from your saved profile details, or create one manually with our step-by-step editor.
                </p>
                <div className="bg-sky-50 border-2 border-black p-6 space-y-4">
                  <h4 className="font-black text-xs uppercase tracking-wider text-black">Available Templates</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    {['Brutalist Dark', 'Mono Developer', 'Modern Light'].map(temp => (
                      <div key={temp} className="border border-black p-3 bg-white text-[9px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        {temp}
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => window.location.href = '#'}
                  className="bg-black text-white hover:bg-sky-500 hover:text-black py-4 px-8 font-black uppercase text-xs tracking-widest transition-all border-2 border-black shadow-[4px_4px_0px_0px_rgba(14,165,233,1)] active:translate-y-0.5 active:shadow-none cursor-pointer flex items-center gap-2"
                >
                  Launch Editor <ArrowRight size={14} />
                </button>
              </motion.div>
            )}

            {activeTab === 'pro' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-black text-white border-[3px] border-black p-8 md:p-10 shadow-[10px_10px_0px_0px_rgba(14,165,233,1)] space-y-8"
              >
                <div className="flex items-center gap-3">
                  <Zap className="text-yellow-400 animate-bounce" size={32} fill="currentColor" />
                  <h3 className="text-3xl font-black uppercase tracking-tight italic">
                    Upgrade to hirrd Pro
                  </h3>
                </div>
                <p className="text-sm font-bold text-slate-300 uppercase tracking-wide leading-relaxed">
                  Unlock priority pipelines, direct recruiter access bypass, and deep analytics indexes. Join the upper tier of technical professionals.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-xs font-bold uppercase tracking-wider text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check className="text-emerald-500" size={16} /> ⚡ Queue Bypass Protocol
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="text-emerald-500" size={16} /> 📊 Priority Rank Boost
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="text-emerald-500" size={16} /> 🔐 Multi-Session Security
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="text-emerald-500" size={16} /> 📁 Infinite Portfolio Storage
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-800">
                  <button 
                    onClick={() => router.push('/pro')}
                    className="bg-sky-500 text-black hover:bg-white hover:text-black px-8 py-4 font-black uppercase text-xs tracking-[0.2em] transition-all shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] active:translate-y-1 active:shadow-none cursor-pointer"
                  >
                    Launch Upgrade Protocol
                  </button>
                </div>
              </motion.div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}
