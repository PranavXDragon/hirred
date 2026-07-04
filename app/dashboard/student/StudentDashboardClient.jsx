"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, MapPin, Briefcase, Plus, X, Edit3, Save, LogOut, Check, 
  ShieldCheck, Crown, AlertTriangle, FileText, UploadCloud, Cpu, Layers, FileUp, Sparkles,
  Camera, Phone, GraduationCap, User, Bookmark
} from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

import { toggleSavedJob } from '../../../lib/actions/student';

export default function StudentDashboardClient({ initialUser, liveApplications = [], liveBookmarks = [] }) {
  const [user, setUser] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: initialUser?.full_name || '',
    bio: initialUser?.bio || 'Elite job seeker seeking premium opportunities.',
    location: initialUser?.location || 'Nagpur, India',
    experience: initialUser?.experience || 'Fresher',
    skillsString: (initialUser?.skills || ['React', 'JavaScript', 'Tailwind CSS']).join(', '),
    profilePicture: initialUser?.profile_photo || '',
    phone: initialUser?.phone || '',
    college: initialUser?.college || ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Tab & Dataset States
  const [activeTab, setActiveTab] = useState('overview');
  const [applications, setApplications] = useState(liveApplications);
  const [savedJobs, setSavedJobs] = useState(liveBookmarks);
  const [jobAlerts, setJobAlerts] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);

  // Resume Importer States
  const [showImportModal, setShowImportModal] = useState(false);
  const [importingFile, setImportingFile] = useState(null);
  const [importStep, setImportStep] = useState('idle');
  const [parsedData, setParsedData] = useState(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const calculateProfileStrength = () => {
    let score = 0;
    if (user?.profile_photo || editForm.profilePicture) score += 20;
    if (user?.phone || editForm.phone) score += 20;
    if (user?.college || editForm.college) score += 20;
    if (user?.skills && user.skills.length > 0) score += 20;
    if (user?.bio && user.bio.trim().length > 10) score += 20;
    return score;
  };
  const strength = calculateProfileStrength();

  useEffect(() => {
    // Sync external props (for hot reload stability)
    setApplications(liveApplications);
    setSavedJobs(liveBookmarks);
  }, [liveApplications, liveBookmarks]);

  useEffect(() => {
    const defaultAlerts = [
      { id: 'a1', keyword: 'React Developer', location: 'Remote', experience: 'Fresher', active: true },
      { id: 'a2', keyword: 'DevOps Engineer', location: 'Nagpur', experience: '3-5 Years', active: false }
    ];
    setJobAlerts(defaultAlerts);

    const allJobs = [
      {
        id: 'rec1',
        title: 'React Frontend Developer',
        companyName: 'Cloudflare',
        department: 'Engineering',
        salary: '₹14 - ₹20 LPA',
        location: 'Remote',
        type: 'Full-time',
        description: 'We are seeking an expert Frontend Engineer skilled in React, Tailwind CSS, and edge rendering.',
        applicantsCount: 12,
        datePosted: 'Jun 28, 2026'
      },
      {
        id: 'rec2',
        title: 'DevOps & Cloud Architect',
        companyName: 'HashiCorp',
        department: 'Infrastructure',
        salary: '₹18 - ₹26 LPA',
        location: 'Nagpur, India',
        type: 'Full-time',
        description: 'Scale our cloud orchestration clusters. Experience with Docker, Kubernetes, Terraform, and Go is required.',
        applicantsCount: 8,
        datePosted: 'Jun 29, 2026'
      },
      {
        id: 'rec3',
        title: 'Full Stack Node Developer',
        companyName: 'Vercel',
        department: 'Core Platforms',
        salary: '₹16 - ₹24 LPA',
        location: 'Remote',
        type: 'Full-time',
        description: 'Build backend microservices and serverless infrastructure using Node.js, Express, PostgreSQL, and Redis.',
        applicantsCount: 15,
        datePosted: 'Jun 30, 2026'
      }
    ];
    
    const candidateSkills = initialUser?.skills || ['React', 'JavaScript', 'Tailwind CSS'];
    const matched = allJobs.filter(job => {
      const descText = (job.title + ' ' + job.description + ' ' + job.department).toLowerCase();
      return candidateSkills.some(skill => descText.includes(skill.toLowerCase()));
    });
    setRecommendedJobs(matched.length > 0 ? matched : allJobs);
  }, [initialUser?.skills]);

  const handleQuickApply = (job) => {
    if (applications.some(app => app.jobTitle === job.title && app.companyName === job.companyName)) {
      setToastMessage('Already applied to this role!');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }
    const newApp = {
      id: Date.now().toString(),
      jobTitle: job.title,
      companyName: job.companyName || 'Unknown',
      dateApplied: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      status: 'Pending'
    };
    setApplications([newApp, ...applications]);
    setToastMessage(`Applied successfully to ${job.title}!`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleWithdraw = (appId) => {
    setApplications(applications.filter(app => app.id !== appId));
    setToastMessage('Application withdrawn.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleRemoveBookmark = async (bookmarkId, jobId) => {
    // Optimistic UI update
    setSavedJobs(savedJobs.filter(bookmark => bookmark.id !== bookmarkId));
    setToastMessage('Bookmark removed.');
    setTimeout(() => setToastMessage(''), 3000);

    try {
      await toggleSavedJob(jobId);
    } catch (err) {
      console.error(err);
      // Revert if error
      setSavedJobs(liveBookmarks);
    }
  };

  const handleToggleAlert = (alertId) => {
    setJobAlerts(jobAlerts.map(alert => alert.id === alertId ? { ...alert, active: !alert.active } : alert));
    setToastMessage('Alert preferences updated!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;

    let photoUrl = editForm.profilePicture || user.profile_photo;

    if (avatarFile) {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile, { upsert: true });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        setToastMessage(`Error uploading photo: ${uploadError.message}`);
        setTimeout(() => setToastMessage(''), 5000);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
        
      photoUrl = publicUrl;
    }

    const updatedSkills = editForm.skillsString
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill !== '');

    const updatedUser = {
      ...user,
      full_name: editForm.name,
      bio: editForm.bio,
      location: editForm.location,
      experience: editForm.experience,
      skills: updatedSkills,
      profile_photo: photoUrl,
      phone: editForm.phone,
      college: editForm.college
    };

    // Update in Supabase
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: updatedUser.full_name,
        bio: updatedUser.bio,
        location: updatedUser.location,
        experience: updatedUser.experience,
        skills: updatedUser.skills,
        phone: updatedUser.phone,
        college: updatedUser.college,
        profile_photo: updatedUser.profile_photo
      });

    if (error) {
      console.error("Profile save error:", error);
      setToastMessage(`Error: ${error.message || 'Failed to update profile'}`);
      setTimeout(() => setToastMessage(''), 5000);
      return;
    }

    setUser(updatedUser);
    setIsEditing(false);
    setSaveSuccess(true);
    setAvatarFile(null); // Reset after save
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setAvatarFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditForm(prev => ({
        ...prev,
        profilePicture: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleDeactivatePro = () => {
    // Mock pro deactivation
    setDeactivating(true);
    setTimeout(() => {
      setUser({ ...user, isPro: false });
      setDeactivating(false);
      setShowDeactivateConfirm(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  return (
    <>
    <div className="bg-white min-h-screen pt-24 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none" 
           style={{ 
             backgroundImage: `linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)`, 
             backgroundSize: '40px 40px' 
           }}>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {(saveSuccess || toastMessage) && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 p-4 bg-sky-50 border-2 border-sky-500 text-sky-700 text-xs font-black uppercase tracking-wider flex items-center gap-2"
          >
            <Check size={16} /> {saveSuccess ? "Profile database updated successfully!" : toastMessage}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border-[4px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="flex items-center gap-4 mb-4 border-b-2 border-black pb-4">
                <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="28" cy="28" r="24" className="stroke-slate-100 fill-transparent" strokeWidth="5" />
                    <circle cx="28" cy="28" r="24" className="stroke-sky-500 fill-transparent" strokeWidth="5"
                            strokeDasharray={2 * Math.PI * 24}
                            strokeDashoffset={2 * Math.PI * 24 * (1 - strength / 100)} />
                  </svg>
                  <span className="absolute text-[10px] font-black text-black">{strength}%</span>
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase text-black leading-none mb-1">Profile Strength</h4>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider leading-snug">
                    {strength === 100 ? "Elite credentials locked!" : "Complete actions to hit 100%."}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { label: "Profile Photo (+20%)", checked: !!(user?.profile_photo || editForm.profilePicture) },
                  { label: "Phone Contact (+20%)", checked: !!(user?.phone || editForm.phone) },
                  { label: "Academic Institution (+20%)", checked: !!(user?.college || editForm.college) },
                  { label: "Skills Matrix (+20%)", checked: !!(user?.skills && user.skills.length > 0) },
                  { label: "Bio Definition (+20%)", checked: !!(user?.bio && user.bio.trim().length > 10) }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[9px] font-black uppercase tracking-wider">
                    <span className={item.checked ? "text-slate-400 line-through" : "text-black"}>{item.label}</span>
                    <span className={`px-1.5 py-0.5 border border-black text-[8px] font-black
                      ${item.checked ? "bg-emerald-400 text-black" : "bg-slate-100 text-slate-400"}`}>
                      {item.checked ? "DONE" : "TODO"}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border-[4px] border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                <Zap size={12} className="text-sky-400" fill="currentColor" />
                Active Node
              </div>

              <div className={`w-24 h-24 bg-sky-100 border-[3px] border-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group ${isEditing ? 'cursor-pointer' : ''}`}>
                {editForm.profilePicture ? (
                  <img src={editForm.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                ) : user?.profile_photo ? (
                  <img src={user.profile_photo} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-black uppercase text-black">
                    {user?.full_name ? user.full_name.charAt(0) : user?.email.charAt(0)}
                  </span>
                )}

                {isEditing && (
                  <>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="absolute inset-0 opacity-0 cursor-pointer z-20"
                    />
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 text-white">
                      <Camera size={18} className="mb-1" />
                      <span className="text-[7px] font-black uppercase tracking-wider text-center px-1">Upload Photo</span>
                    </div>
                  </>
                )}

                {!isEditing && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-sky-500 border-2 border-black rounded-full" />
                )}
              </div>

              <h2 className="text-2xl font-black uppercase tracking-tight mb-2 leading-none">{user?.full_name}</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 break-all">{user?.email}</p>

              <div className="space-y-4 border-t-2 border-slate-100 pt-6">
                <div className="flex items-center gap-3 text-slate-600 font-black text-xs uppercase tracking-wider">
                  <MapPin size={16} className="text-sky-500" />
                  <span>{user?.location || 'Nagpur, India'}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 font-black text-xs uppercase tracking-wider">
                  <Briefcase size={16} className="text-sky-500" />
                  <span>{user?.experience || 'Fresher'}</span>
                </div>
                {user?.phone && (
                  <div className="flex items-center gap-3 text-slate-600 font-black text-xs uppercase tracking-wider">
                    <Phone size={16} className="text-sky-500" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user?.college && (
                  <div className="flex items-center gap-3 text-slate-600 font-black text-xs uppercase tracking-wider">
                    <GraduationCap size={16} className="text-sky-500" />
                    <span className="truncate">{user.college}</span>
                  </div>
                )}
              </div>

              <button 
                onClick={handleLogout}
                className="mt-8 w-full flex items-center justify-center gap-2 border-2 border-black py-3 text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 hover:border-red-500 transition-colors cursor-pointer"
              >
                Terminate Session <LogOut size={12} />
              </button>
            </motion.div>

            {/* --- PRO PLAN MANAGEMENT CARD --- */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className={`border-[4px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${
                user?.is_pro ? 'bg-black text-white' : 'bg-white'
              }`}
            >
              {user?.is_pro ? (
                <>
                  {/* Active Pro */}
                  <div className="flex items-center gap-2 mb-4">
                    <Crown className="text-yellow-400" size={18} fill="currentColor" />
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-yellow-400">Pro Plan Active</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide leading-relaxed mb-5">
                    Elite credentials signed. Queue bypasses and priority placements are live.
                  </p>
                  <div className="space-y-2 mb-6">
                    {['⚡ Queue Bypass Protocol', '📊 Priority Rank Boost', '👑 Verified Elite Badge'].map(feat => (
                      <div key={feat} className="flex items-center gap-2 text-[10px] font-bold text-slate-300">
                        <Check size={12} className="text-emerald-400 shrink-0" /> {feat}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowDeactivateConfirm(true)}
                    className="w-full border-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-white py-3 text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <AlertTriangle size={12} /> Deactivate Plan
                  </button>
                </>
              ) : (
                <>
                  {/* No Pro */}
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="text-slate-300" size={18} />
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Membership Plan</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide leading-relaxed mb-5">
                    No active Pro plan. Upgrade to unlock queue bypasses and priority placements.
                  </p>
                  <button
                    onClick={() => window.location.href = '/pro'}
                    className="w-full bg-sky-500 text-black border-[3px] border-black hover:bg-black hover:text-sky-400 py-3 text-[10px] font-black uppercase tracking-widest transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none cursor-pointer"
                  >
                    ⚡ Get hirrd Pro
                  </button>
                </>
              )}
            </motion.div>

            {/* --- RESUME BUILDER LAUNCHER CARD --- */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="border-[4px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-sky-50"
            >
              <div className="flex items-center gap-2 mb-3">
                <FileText className="text-black" size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-black">CV Engine Active</span>
              </div>
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wide leading-relaxed mb-5">
                Compile a professional developer CV directly from your synced profile database, or add custom manual details.
              </p>
              <button
                onClick={() => window.location.href = '/resume-builder'}
                className="w-full bg-black text-white hover:bg-sky-500 hover:text-black py-3 text-[10px] font-black uppercase tracking-widest transition-all border-2 border-black shadow-[4px_4px_0px_0px_rgba(14,165,233,1)] active:translate-y-0.5 active:shadow-none cursor-pointer flex items-center justify-center gap-1.5"
              >
                Launch Builder <Sparkles size={12} className="text-yellow-400" fill="currentColor" />
              </button>
            </motion.div>
          </div>

          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border-[4px] border-black p-8 md:p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
                <div>
                  <h1 className="text-3xl font-black uppercase tracking-tight">
                    Talent <span className="text-sky-500 italic">Profile.</span>
                  </h1>
                </div>
                
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 text-[10px] font-black uppercase tracking-wider hover:bg-sky-500 hover:text-black transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none cursor-pointer border-2 border-black"
                  >
                    Edit Profile <Edit3 size={12} />
                  </button>
                ) : (
                  <button 
                    type="button"
                    onClick={() => setShowImportModal(true)}
                    className="flex items-center gap-2 bg-sky-500 text-black border-[3px] border-black px-4 py-2 text-[10px] font-black uppercase tracking-wider hover:bg-black hover:text-sky-400 transition-colors cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none"
                  >
                    Import Resume PDF <FileUp size={12} />
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-black uppercase text-[10px] tracking-widest block">
                      Full Name / Identity
                    </label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-transparent border-b-[3px] border-black py-2 font-black uppercase text-sm focus:outline-none focus:border-sky-500 transition-colors"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-black uppercase text-[10px] tracking-widest block">
                      Phone Number
                    </label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-transparent border-b-[3px] border-black py-2 font-black uppercase text-sm focus:outline-none focus:border-sky-500 transition-colors"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-black uppercase text-[10px] tracking-widest block">
                      Bio Description
                    </label>
                    <textarea 
                      required
                      rows="3"
                      className="w-full bg-transparent border-b-[3px] border-black py-2 font-black uppercase text-sm focus:outline-none focus:border-sky-500 transition-colors resize-none"
                      value={editForm.bio}
                      onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                    ></textarea>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-black uppercase text-[10px] tracking-widest block">
                      Location / Region
                    </label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-transparent border-b-[3px] border-black py-2 font-black uppercase text-sm focus:outline-none focus:border-sky-500 transition-colors"
                      value={editForm.location}
                      onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-black uppercase text-[10px] tracking-widest block">
                      College / University
                    </label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-transparent border-b-[3px] border-black py-2 font-black uppercase text-sm focus:outline-none focus:border-sky-500 transition-colors"
                      value={editForm.college}
                      onChange={(e) => setEditForm({...editForm, college: e.target.value})}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-black uppercase text-[10px] tracking-widest block">
                      Experience level
                    </label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-transparent border-b-[3px] border-black py-2 font-black uppercase text-sm focus:outline-none focus:border-sky-500 transition-colors"
                      value={editForm.experience}
                      onChange={(e) => setEditForm({...editForm, experience: e.target.value})}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-black uppercase text-[10px] tracking-widest block">
                      Skills (Comma separated)
                    </label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-transparent border-b-[3px] border-black py-2 font-black uppercase text-sm focus:outline-none focus:border-sky-500 transition-colors"
                      value={editForm.skillsString}
                      onChange={(e) => setEditForm({...editForm, skillsString: e.target.value})}
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      type="submit"
                      className="flex items-center gap-2 bg-black text-white border-2 border-black px-6 py-3 text-[10px] font-black uppercase tracking-wider hover:bg-sky-500 hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(14,165,233,1)] active:translate-y-1 active:shadow-none"
                    >
                      Save Configuration <Save size={14} />
                    </button>
                    <button 
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-2 border-2 border-black px-6 py-3 text-[10px] font-black uppercase tracking-wider hover:bg-slate-50 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none"
                    >
                      Cancel <X size={14} />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-8">
                  <div className="flex flex-wrap gap-2 border-b-[3px] border-black pb-4 mb-6">
                    {[
                      { id: 'overview', label: 'Talent Profile', icon: <User size={14} /> },
                      { id: 'applications', label: 'Applications Log', count: applications.length, icon: <FileText size={14} /> },
                      { id: 'recommended', label: 'Recommended Feed', count: recommendedJobs.length, icon: <Sparkles size={14} /> },
                      { id: 'saved', label: 'Bookmarks & Alerts', count: savedJobs.length, icon: <Bookmark size={14} /> }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 border-2 border-black text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none
                          ${activeTab === tab.id ? 'bg-sky-500 text-black' : 'bg-white hover:bg-slate-50'}`}
                      >
                        {tab.icon}
                        {tab.label}
                        {tab.count !== undefined && (
                          <span className="ml-1 bg-black text-white px-1.5 py-0.5 text-[8px] font-black border border-black rounded-none">
                            {tab.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  {activeTab === 'overview' && (
                    <div className="space-y-8 animate-fadeIn">
                      <div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Bio Definition</h3>
                        <p className="text-sm font-bold text-slate-700 leading-relaxed uppercase">
                          {user?.bio || 'Elite job seeker seeking premium opportunities.'}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <div>
                          <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                            <Phone size={12} className="text-sky-500" /> Primary Contact
                          </h3>
                          <p className="text-xs font-black uppercase text-black">
                            {user?.phone || 'Not Specified'}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                            <GraduationCap size={12} className="text-sky-500" /> Academic Institution
                          </h3>
                          <p className="text-xs font-black uppercase text-black truncate">
                            {user?.college || 'Not Specified'}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Skills Matrix</h3>
                        <div className="flex flex-wrap gap-2">
                          {(user?.skills || ['React', 'JavaScript', 'Tailwind CSS']).map((skill, index) => (
                            <div 
                              key={index}
                              className="border-2 border-black px-3 py-1.5 text-[10px] font-black uppercase tracking-wider bg-sky-50 text-black hover:bg-sky-500 transition-colors"
                            >
                              {skill}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'applications' && (
                    <div className="space-y-6 animate-fadeIn">
                      <h3 className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-2">Active Applications</h3>
                      {applications.length === 0 ? (
                        <div className="border-2 border-dashed border-slate-300 p-8 text-center bg-slate-50">
                          <p className="text-xs font-black uppercase text-slate-400 tracking-wider">No active job transmissions found in registry.</p>
                          <a href="/jobs" className="inline-block mt-4 bg-black text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(14,165,233,1)] px-6 py-3 text-[10px] font-black uppercase tracking-wider hover:bg-sky-500 hover:text-black transition-colors">
                            Browse Careers
                          </a>
                        </div>
                      ) : (
                        <div className="border-[3px] border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-black text-white text-[9px] font-black uppercase tracking-wider divide-x-2 divide-slate-800">
                                <th className="p-3">Job Listing</th>
                                <th className="p-3">Company</th>
                                <th className="p-3">Applied Date</th>
                                <th className="p-3 text-center">Status</th>
                                <th className="p-3 text-center">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y-2 divide-black font-bold text-xs uppercase text-slate-700 bg-white">
                              {applications.map(app => (
                                <tr key={app.id} className="hover:bg-slate-50 divide-x-2 divide-black">
                                  <td className="p-3 font-black text-black">{app.job?.title || app.jobTitle}</td>
                                  <td className="p-3">{app.job?.company?.name || app.companyName}</td>
                                  <td className="p-3">{new Date(app.created_at || app.dateApplied).toLocaleDateString()}</td>
                                  <td className="p-3 text-center">
                                    <span className={`px-2 py-1 text-[8px] font-black border border-black
                                      ${app.status === 'hired' ? 'bg-emerald-100 text-emerald-800' : 
                                        app.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                                        'bg-amber-100 text-amber-800'}`}>
                                      {app.status}
                                    </span>
                                  </td>
                                  <td className="p-3 text-center">
                                    <button
                                      type="button"
                                      onClick={() => handleWithdraw(app.id)}
                                      className="text-red-500 hover:text-red-700 font-black text-[9px] tracking-wider uppercase border border-red-500 px-2 py-1 bg-white hover:bg-red-50 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none"
                                    >
                                      Withdraw
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'recommended' && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="flex justify-between items-center border-b-2 border-black pb-2">
                        <h3 className="text-xs font-black uppercase tracking-widest">Recommended Positions</h3>
                        <span className="text-[8px] font-black bg-black text-white px-2 py-0.5 border border-black">Algorithm Matches</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {recommendedJobs.map(job => {
                          const alreadyApplied = applications.some(app => app.jobTitle === job.title && app.companyName === job.companyName);
                          return (
                            <div key={job.id} className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative flex flex-col justify-between hover:shadow-[6px_6px_0px_0px_rgba(14,165,233,1)] transition-all">
                              <div>
                                <div className="flex justify-between items-start mb-3">
                                  <span className="bg-sky-50 border border-sky-300 text-sky-600 px-2 py-0.5 text-[8px] font-black uppercase">{job.type}</span>
                                  <span className="text-[8px] font-bold text-slate-400 uppercase">{job.datePosted}</span>
                                </div>
                                <h4 className="font-black text-sm uppercase text-black leading-tight mb-1">{job.title}</h4>
                                <p className="text-[10px] font-black uppercase text-sky-500 mb-3">{job.companyName}</p>
                                <p className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase mb-4 line-clamp-2">{job.description}</p>
                              </div>

                              <div className="border-t border-slate-100 pt-3 flex justify-between items-center mt-auto">
                                <span className="text-[9px] font-black text-black">{job.salary}</span>
                                <button
                                  type="button"
                                  disabled={alreadyApplied}
                                  onClick={() => handleQuickApply(job)}
                                  className={`px-3 py-1.5 border border-black text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none
                                    ${alreadyApplied ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none active:translate-y-0' : 'bg-sky-400 hover:bg-black hover:text-sky-400 text-black'}`}
                                >
                                  {alreadyApplied ? 'Applied ✓' : 'Quick Apply'}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {activeTab === 'saved' && (
                    <div className="space-y-8 animate-fadeIn">
                      <div className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-2">Bookmarked Jobs</h3>
                        {savedJobs.length === 0 ? (
                          <p className="text-[10px] font-bold text-slate-400 uppercase italic">No bookmarked positions found.</p>
                        ) : (
                          <div className="space-y-4">
                            {savedJobs.map(bookmark => (
                              <div key={bookmark.id} className="bg-white border-2 border-black p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-sky-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <div>
                                  <h4 className="font-black text-xs uppercase text-black">{bookmark.job?.title}</h4>
                                  <p className="text-[9px] font-bold uppercase text-slate-500">{bookmark.job?.company?.name} — {bookmark.job?.location}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-[9px] font-black text-sky-500">{bookmark.job?.salary_range}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveBookmark(bookmark.id, bookmark.job_id)}
                                    className="text-red-500 hover:text-red-700 font-black text-[8px] uppercase tracking-wider border border-red-500 px-2 py-1 bg-white hover:bg-red-50 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="space-y-4 pt-4 border-t-2 border-slate-100">
                        <h3 className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-2">Saved Job Search Alerts</h3>
                        <div className="space-y-3">
                          {jobAlerts.map(alert => (
                            <div key={alert.id} className="bg-slate-50 border-2 border-black p-4 flex justify-between items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                              <div>
                                <h4 className="font-black text-xs uppercase text-black">Alert: "{alert.keyword}"</h4>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                                  Filters: {alert.location} | {alert.experience}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 border border-black
                                  ${alert.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-500'}`}>
                                  {alert.active ? 'Active' : 'Disabled'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleToggleAlert(alert.id)}
                                  className="px-2 py-1 bg-white text-black hover:bg-black hover:text-white border-2 border-black text-[8px] font-black uppercase tracking-wider cursor-pointer transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none"
                                >
                                  Toggle Alert
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>

        </div>
      </div>
    </div>

    {/* --- DEACTIVATE PRO CONFIRMATION MODAL --- */}
    <AnimatePresence>
      {showDeactivateConfirm && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !deactivating && setShowDeactivateConfirm(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]"
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="fixed inset-x-6 top-1/2 -translate-y-1/2 md:inset-auto md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:top-1/2 md:max-w-sm w-full bg-white border-[4px] border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] z-[160]"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 border-2 border-red-500 flex items-center justify-center">
                <AlertTriangle className="text-red-500" size={20} />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight">Deactivate Pro?</h3>
            </div>

            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide leading-relaxed mb-6">
              This will remove your Pro credentials. Queue bypasses, priority placements, and your verified badge will be deactivated immediately. You can re-upgrade at any time.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleDeactivatePro}
                disabled={deactivating}
                className="flex-1 bg-red-500 text-white hover:bg-red-700 py-3 text-[10px] font-black uppercase tracking-widest transition-all border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {deactivating ? (
                  <><span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</>
                ) : (
                  'Yes, Deactivate'
                )}
              </button>
              <button
                onClick={() => setShowDeactivateConfirm(false)}
                disabled={deactivating}
                className="flex-1 border-2 border-black py-3 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-60"
              >
                Keep Plan
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>

    {/* --- RESUME PDF IMPORTER MODAL --- */}
    <AnimatePresence>
      {showImportModal && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => importStep === 'idle' || importStep === 'done' ? (setShowImportModal(false), setImportStep('idle'), setImportingFile(null)) : null}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]"
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-auto md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:top-1/2 md:max-w-2xl w-full bg-white border-[4px] border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] z-[160] max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6 border-b-4 border-black pb-4">
              <div className="flex items-center gap-2">
                <FileText className="text-sky-500" size={24} />
                <h3 className="text-xl font-black uppercase tracking-tight">Resume PDF Import Pipeline</h3>
              </div>
              {importStep !== 'uploading' && importStep !== 'parsing' && importStep !== 'extracting' && (
                <button 
                  onClick={() => {
                    setShowImportModal(false);
                    setImportStep('idle');
                    setImportingFile(null);
                  }}
                  className="p-1 hover:bg-slate-100 border-2 border-black transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Step 1: Idle (Dropzone) */}
            {importStep === 'idle' && (
              <div className="space-y-6">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide leading-relaxed">
                  Upload your CV in PDF format. Our parsing engine will analyze structural layers, extract profile parameters, and map them to your form fields.
                </p>

                <div className="border-[3px] border-dashed border-black p-10 bg-slate-50 text-center hover:bg-sky-50 transition-colors relative group">
                  <input 
                    type="file" 
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      setImportingFile(file);
                      setImportStep('uploading');
                      setTimeout(() => setImportStep('parsing'), 1500);
                      setTimeout(() => setImportStep('extracting'), 3000);
                      setTimeout(() => {
                        setParsedData({
                          name: 'Extracted Name',
                          email: 'extracted@example.com',
                          phone: '+91 9876543210',
                          college: 'Mock University',
                          skillsString: 'React, Node, Next.js',
                          location: 'Remote',
                          experience: '2 Years',
                          bio: 'An extracted bio from the mock PDF parsing engine.'
                        });
                        setImportStep('done');
                      }, 4500);
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <UploadCloud size={40} className="mx-auto text-slate-400 group-hover:text-sky-500 transition-colors mb-4" />
                  <p className="text-xs font-black uppercase tracking-wider text-black mb-1">Drag and Drop CV PDF here</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">or click to browse local folders</p>
                </div>
              </div>
            )}

            {/* Step 2: Processing (Uploading / Parsing / Extracting) */}
            {(importStep === 'uploading' || importStep === 'parsing' || importStep === 'extracting') && (
              <div className="py-10 text-center space-y-6">
                <div className="flex justify-center gap-6">
                  <div className={`w-12 h-12 flex items-center justify-center border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                    ${importStep === 'uploading' ? 'bg-sky-400 animate-bounce' : 'bg-slate-100'}`}>
                    <UploadCloud size={20} />
                  </div>
                  <div className={`w-12 h-12 flex items-center justify-center border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                    ${importStep === 'parsing' ? 'bg-sky-400 animate-spin' : 'bg-slate-100'}`}>
                    <Layers size={20} />
                  </div>
                  <div className={`w-12 h-12 flex items-center justify-center border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                    ${importStep === 'extracting' ? 'bg-sky-400 animate-pulse' : 'bg-slate-100'}`}>
                    <Cpu size={20} />
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-black uppercase tracking-widest text-sm text-black">
                    {importStep === 'uploading' && "Loading document byte buffers..."}
                    {importStep === 'parsing' && "Deconstructing text layer tokens..."}
                    {importStep === 'extracting' && "Mapping parameters via NLP nodes..."}
                  </p>
                  <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Processing: {importingFile?.name}
                  </p>
                </div>

                {/* Simulated progress bar */}
                <div className="max-w-xs mx-auto h-3 bg-slate-100 border-[2px] border-black relative overflow-hidden">
                  <motion.div 
                    initial={{ x: "-100%" }}
                    animate={{ x: "0%" }}
                    transition={{ duration: 3.2, ease: "easeInOut" }}
                    className="absolute top-0 bottom-0 left-0 w-full bg-sky-500"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Done (Preview & Comparison) */}
            {importStep === 'done' && parsedData && (
              <div className="space-y-6">
                <div className="bg-emerald-50 border-2 border-emerald-500 p-4 flex items-center gap-3">
                  <Check size={20} className="text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="font-black text-xs uppercase text-emerald-800">Extraction Complete</h4>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">Ready to populate profile parameters.</p>
                  </div>
                </div>

                <div className="border-2 border-black divide-y-2 divide-black">
                  <div className="grid grid-cols-3 bg-black text-white p-3 text-[10px] font-black uppercase tracking-wider">
                    <span>Field</span>
                    <span className="col-span-2">Parsed Value</span>
                  </div>

                  {[
                    ['Name', parsedData.name],
                    ['Email', parsedData.email],
                    ['Phone', parsedData.phone],
                    ['College/Education', parsedData.college],
                    ['Skills', parsedData.skillsString],
                    ['Location', parsedData.location],
                    ['Experience', parsedData.experience],
                    ['Summary Bio', parsedData.bio]
                  ].map(([label, val]) => (
                    <div key={label} className="grid grid-cols-3 p-3 text-xs font-bold items-start hover:bg-slate-50 transition-colors">
                      <span className="text-slate-400 uppercase text-[10px] tracking-wide">{label}</span>
                      <span className="col-span-2 uppercase text-slate-800 font-black tracking-wide leading-relaxed">{val}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setEditForm(prev => ({ ...prev, ...parsedData }));
                      setShowImportModal(false);
                      setIsEditing(true);
                    }}
                    className="flex-1 bg-sky-500 text-black hover:bg-black hover:text-sky-400 py-3.5 text-[10px] font-black uppercase tracking-widest transition-all border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none cursor-pointer flex items-center justify-center gap-2"
                  >
                    Inject to Profile Form <Check size={14} />
                  </button>
                  <button
                    onClick={() => {
                      setImportStep('idle');
                      setImportingFile(null);
                      setParsedData(null);
                    }}
                    className="border-2 border-black px-6 py-3.5 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Reselect File
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}
