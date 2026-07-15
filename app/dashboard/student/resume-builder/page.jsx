'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Sparkles, Plus, Trash2, Printer, RefreshCw, 
  MapPin, Mail, Phone, Globe, Linkedin, Github, Check, AlertCircle, ArrowLeft,
  FileUp, X, UploadCloud, Layers, Cpu
} from 'lucide-react';
import { createClient } from '../../../../lib/supabase/client';

const ResumeBuilderPage = () => {
  const [user, setUser] = useState(null);
  const [isSyncMode, setIsSyncMode] = useState(true);
  
  // Design settings
  const [template, setTemplate] = useState('brutalist'); // brutalist | minimalist | corporate | monotech
  const [font, setFont] = useState('sans'); // sans | serif | mono
  const [accent, setAccent] = useState('#0ea5e9'); // sky blue (#0ea5e9) | emerald (#10b981) | amber (#f59e0b) | violet (#8b5cf6)

  // Resume Importer States
  const [showImportModal, setShowImportModal] = useState(false);
  const [importingFile, setImportingFile] = useState(null);
  const [importStep, setImportStep] = useState('idle'); // 'idle' | 'uploading' | 'parsing' | 'extracting' | 'done'
  const [parsedData, setParsedData] = useState(null);

  // Resume form state
  const [resumeData, setResumeData] = useState({
    fullName: '',
    profilePicture: '',
    jobTitle: 'Full Stack Engineer',
    email: 'jobseeker@example.com',
    phone: '',
    location: '',
    portfolio: 'https://portfolio.dev',
    linkedin: 'linkedin.com/in/job-seeker',
    github: 'github.com/job-seeker',
    summary: 'Elite job seeker seeking premium opportunities...',
    skillsString: '',
    experiences: [
      {
        id: 1,
        title: 'Senior Software Engineer',
        company: 'Cloudflare',
        dates: '2024 - Present',
        description: 'Led development of low-latency edge caching APIs. Managed distributed cluster state configuration handling 1M+ req/sec.'
      },
      {
        id: 2,
        title: 'Frontend Developer',
        company: 'Vercel',
        dates: '2022 - 2024',
        description: 'Optimized serverless rendering layers for Next.js deployments. Improved Core Web Vitals metrics across high-traffic node deployments.'
      }
    ],
    educations: [
      {
        id: 1,
        degree: 'Bachelor of Technology in Computer Science',
        school: 'Indian Institute of Technology',
        dates: '2018 - 2022',
        details: 'GPA: 9.4/10. Active member of open source development forum.'
      }
    ],
    projects: [
      {
        id: 1,
        title: 'Neuron-Gate Router',
        tech: 'Rust, WebAssembly, WebRTC',
        link: 'github.com/engine/neuron-gate',
        description: 'High-performance signaling router for peer-to-peer data mesh synchronization, resolving edge node handshakes in under 4ms.'
      }
    ]
  });

  const [toastMessage, setToastMessage] = useState('');

  // Load user profile & sync initially
  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      const parsedUser = { ...user, ...profile, name: profile?.full_name || '' };
      setUser(parsedUser);
      
      // Auto-populate from profile
      setResumeData(prev => ({
        ...prev,
        fullName: parsedUser.full_name || 'Anonymous Job Seeker',
        profilePicture: parsedUser.profile_photo || '',
        email: parsedUser.email || '',
        phone: parsedUser.phone || '',
        location: parsedUser.location || 'Nagpur, India',
        summary: parsedUser.bio || 'Elite job seeker seeking premium opportunities.',
        skillsString: (parsedUser.skills || []).join(', '),
        educations: [
          {
            id: 1,
            degree: 'Bachelor of Technology in Computer Science',
            school: parsedUser.college || 'Indian Institute of Technology',
            dates: '2018 - 2022',
            details: 'GPA: 9.4/10. Active member of open source development forum.'
          }
        ]
      }));
    };
    fetchUser();
  }, []);

  // Handle Sync vs Manual toggling
  const handleSyncToggle = (sync) => {
    setIsSyncMode(sync);
    if (sync && user) {
      // Reload profile data
      setResumeData(prev => ({
        ...prev,
        fullName: user.name || '',
        profilePicture: user.profilePicture || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || 'Nagpur, India',
        summary: user.bio || 'Elite job seeker seeking premium opportunities.',
        skillsString: (user.skills || []).join(', '),
        educations: [
          {
            id: 1,
            degree: 'Bachelor of Technology in Computer Science',
            school: user.college || 'Indian Institute of Technology',
            dates: '2018 - 2022',
            details: 'GPA: 9.4/10. Active member of open source development forum.'
          }
        ]
      }));
      showToast('Profile databases synchronized successfully!');
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Trigger API-based PDF Parse Sequence
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImportingFile(file);
    setImportStep('uploading');
    setParsedData(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      setImportStep('parsing');
      
      const res = await fetch('/api/extract-resume', {
        method: 'POST',
        body: formData,
      });
      
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Extraction failed');
      
      setImportStep('extracting');
      
      // Map AI keys to local state format with minor delays for UI smoothness
      setTimeout(() => {
        const data = json.data || {};
        
        // Add random IDs to array elements if missing
        const processArray = (arr) => (arr || []).map((item, idx) => ({ ...item, id: Date.now() + idx }));
        
        setParsedData({
          fullName: data.fullName || data.name || "Parsed Candidate",
          jobTitle: data.jobTitle || "Job Seeker",
          email: data.email || user?.email || "email@example.com",
          phone: data.phone || "",
          location: data.location || "Nagpur, India",
          portfolio: data.portfolio || "",
          linkedin: data.linkedin || "",
          github: data.github || "",
          summary: data.bio || "",
          skillsString: data.skillsString || "",
          experiences: processArray(data.experiences),
          educations: processArray(data.educations),
          projects: processArray(data.projects)
        });
        
        setImportStep('done');
      }, 800);
      
    } catch (err) {
      console.error("Resume Extraction Error:", err);
      setImportStep('idle');
      alert("Failed to parse PDF: " + err.message);
    }
  };

  const applyParsedData = () => {
    if (!parsedData) return;
    setResumeData({
      ...resumeData,
      fullName: parsedData.fullName,
      jobTitle: parsedData.jobTitle,
      email: parsedData.email,
      phone: parsedData.phone,
      location: parsedData.location,
      portfolio: parsedData.portfolio,
      linkedin: parsedData.linkedin,
      github: parsedData.github,
      summary: parsedData.summary,
      skillsString: parsedData.skillsString,
      experiences: parsedData.experiences,
      educations: parsedData.educations,
      projects: parsedData.projects
    });
    
    // Switch off Sync Mode so user can manually edit the imported details
    setIsSyncMode(false);
    
    setShowImportModal(false);
    setImportingFile(null);
    setImportStep('idle');
    setParsedData(null);
    showToast('Resume PDF details successfully parsed and populated!');
  };


  // Add/Remove handlers
  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          id: Date.now(),
          title: 'Software Developer',
          company: 'Tech Solutions Inc',
          dates: '2020 - 2022',
          description: 'Designed responsive modular dashboard features and synced real-time data nodes.'
        }
      ]
    }));
  };

  const removeExperience = (id) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(exp => exp.id !== id)
    }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      educations: [
        ...prev.educations,
        {
          id: Date.now(),
          degree: 'Master of Science',
          school: 'University of Technology',
          dates: '2022 - 2024',
          details: 'Specialization in Data Structures & Systems Programming.'
        }
      ]
    }));
  };

  const removeEducation = (id) => {
    setResumeData(prev => ({
      ...prev,
      educations: prev.educations.filter(edu => edu.id !== id)
    }));
  };

  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: Date.now(),
          title: 'Distributed Log Hub',
          tech: 'Go, Kafka, gRPC',
          link: 'github.com/engine/loghub',
          description: 'A message streaming node handling microservice logger dumps via persistent ring buffer streams.'
        }
      ]
    }));
  };

  const removeProject = (id) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }));
  };

  // Handle dynamic field changes
  const updateField = (field, val) => {
    setResumeData(prev => ({
      ...prev,
      [field]: val
    }));
  };

  const updateNestedField = (listName, id, field, val) => {
    setResumeData(prev => ({
      ...prev,
      [listName]: prev[listName].map(item => item.id === id ? { ...item, [field]: val } : item)
    }));
  };

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white pt-24 flex items-center justify-center">
        <div className="font-black uppercase tracking-[0.2em] text-slate-400">Loading CV Generator...</div>
      </div>
    );
  }

  // Accent combinations
  const accentColors = [
    { value: '#0ea5e9', name: 'Sky Blue' },
    { value: '#10b981', name: 'Emerald Green' },
    { value: '#f59e0b', name: 'Amber Gold' },
    { value: '#8b5cf6', name: 'Violet Pulse' }
  ];

  // Font class mapping
  const fontClass = font === 'serif' ? 'font-serif' : font === 'mono' ? 'font-mono' : 'font-sans';

  return (
    <>
    <div className="bg-white min-h-screen pt-24 pb-16 relative overflow-hidden">
      {/* Print-specific style tag injection */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
            background: #fff !important;
          }
          #cv-print-area, #cv-print-area * {
            visibility: visible;
          }
          #cv-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }
          header, nav, footer, button, .no-print {
            display: none !important;
          }
        }
      `}} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b-4 border-black pb-4 no-print gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <a href="/dashboard/student/profile" className="p-1 hover:bg-slate-100 border border-black cursor-pointer mr-2">
                <ArrowLeft size={16} />
              </a>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em]">
                <Sparkles size={12} className="text-yellow-400" fill="currentColor" /> CV Node Builder
              </div>
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tight">
              CV Compiler <span className="text-sky-500 italic">Console.</span>
            </h1>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-2 bg-sky-500 text-black border-[3px] border-black px-6 py-3 text-[10px] font-black uppercase tracking-wider hover:bg-black hover:text-sky-400 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none cursor-pointer"
            >
              Import Resume PDF <FileUp size={14} />
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-black text-white border-[3px] border-black px-6 py-3 text-[10px] font-black uppercase tracking-wider hover:bg-sky-500 hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(14,165,233,1)] active:translate-y-0.5 active:shadow-none cursor-pointer"
            >
              Export PDF / Print <Printer size={14} />
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="mb-6 p-4 bg-sky-50 border-2 border-sky-500 text-sky-700 text-xs font-black uppercase tracking-wider flex items-center gap-2 no-print">
            <Check size={16} /> {toastMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ────────────────── LEFT COLUMN: CONTROLS & FORM ────────────────── */}
          <div className="lg:col-span-5 space-y-6 no-print">
            
            {/* Control Dashboard */}
            <div className="bg-white border-[4px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-sm font-black uppercase tracking-widest mb-4 border-b-2 border-black pb-2 flex items-center justify-between">
                <span>System Sync</span>
                <span className="text-[10px] px-2 py-0.5 bg-sky-100 text-sky-700 font-bold tracking-widest rounded">Status</span>
              </h3>

              {/* Sync Toggles */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 border-2 border-black mb-6">
                <button
                  onClick={() => handleSyncToggle(true)}
                  className={`py-2 text-[9px] font-black uppercase tracking-widest cursor-pointer transition-colors
                    ${isSyncMode ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(14,165,233,1)]' : 'text-slate-500 hover:text-black bg-white'}`}
                >
                  Sync Profile
                </button>
                <button
                  onClick={() => handleSyncToggle(false)}
                  className={`py-2 text-[9px] font-black uppercase tracking-widest cursor-pointer transition-colors
                    ${!isSyncMode ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(14,165,233,1)]' : 'text-slate-500 hover:text-black bg-white'}`}
                >
                  Manual Overrides
                </button>
              </div>

              {isSyncMode && (
                <div className="p-3 bg-sky-50 border-2 border-sky-300 text-[10px] font-semibold text-sky-800 uppercase tracking-wide leading-relaxed mb-4 flex gap-2">
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-sky-600" />
                  <span>Profile Sync Mode is active. Contact Details, Bio Summary, Location, and Skills are synchronized in real-time with your core Profile database.</span>
                </div>
              )}

              {/* Design Customizations */}
              <h3 className="text-sm font-black uppercase tracking-widest mb-4 border-b-2 border-black pb-2">Design Settings</h3>
              
              {/* Layout Templates */}
              <div className="space-y-3 mb-6">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Style Template</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ['brutalist', 'Neo-Brutalist'],
                    ['minimalist', 'Modern Mini'],
                    ['corporate', 'Corporate Slate'],
                    ['monotech', 'Mono Tech']
                  ].map(([id, label]) => (
                    <button
                      key={id}
                      onClick={() => setTemplate(id)}
                      className={`py-2 text-[9px] font-black uppercase tracking-widest border-2 border-black cursor-pointer transition-colors
                        ${template === id ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(14,165,233,1)]' : 'bg-white hover:bg-slate-50'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent & Font selection */}
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Accent Tone</label>
                  <div className="flex gap-2">
                    {accentColors.map(c => (
                      <button
                        key={c.value}
                        onClick={() => setAccent(c.value)}
                        title={c.name}
                        className={`w-6 h-6 border-2 border-black transition-all hover:scale-110 cursor-pointer
                          ${accent === c.value ? 'ring-2 ring-sky-300 ring-offset-1 scale-110' : ''}`}
                        style={{ backgroundColor: c.value }}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Font Family</label>
                  <select
                    value={font}
                    onChange={e => setFont(e.target.value)}
                    className="w-full bg-white border-2 border-black px-2 py-1.5 text-[10px] font-black uppercase tracking-wider focus:outline-none"
                  >
                    <option value="sans">SANS (Inter)</option>
                    <option value="serif">SERIF (Playfair)</option>
                    <option value="mono">MONO (JetBrains)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Editing Sections Form */}
            <div className="bg-white border-[4px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6">
              <h3 className="text-sm font-black uppercase tracking-widest border-b-2 border-black pb-2">CV Parameters</h3>

              {/* Personal Details */}
              <div className="space-y-4">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">Personal & Contact</h4>
                
                <div className="flex items-center gap-4 bg-slate-50 border-2 border-black p-3 mb-2">
                  <div className="w-14 h-14 bg-white border-2 border-black flex items-center justify-center relative overflow-hidden group shrink-0">
                    {resumeData.profilePicture ? (
                      <img src={resumeData.profilePicture} alt="CV Photo" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] font-black text-slate-400 text-center uppercase leading-none">No Photo</span>
                    )}
                    {!isSyncMode && (
                      <>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={e => {
                            const file = e.target.files[0];
                            if (file) {
                              const r = new FileReader();
                              r.onloadend = () => updateField('profilePicture', r.result);
                              r.readAsDataURL(file);
                            }
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer z-20"
                        />
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 text-white text-[8px] font-black uppercase">
                          Upload
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase text-slate-800">CV Avatar Image</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wide leading-relaxed">
                      {isSyncMode 
                        ? "Synchronized with your profile picture. Toggle Manual Overrides to change." 
                        : "Upload a custom profile picture specifically for this resume."}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase">Full Name</label>
                    <input
                      type="text"
                      disabled={isSyncMode}
                      value={resumeData.fullName}
                      onChange={e => updateField('fullName', e.target.value)}
                      className="w-full bg-slate-50 disabled:bg-slate-100 disabled:cursor-not-allowed border-2 border-black p-2 text-xs font-bold focus:outline-none focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase">Job Title</label>
                    <input
                      type="text"
                      value={resumeData.jobTitle}
                      onChange={e => updateField('jobTitle', e.target.value)}
                      className="w-full bg-slate-50 border-2 border-black p-2 text-xs font-bold focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase">Email</label>
                    <input
                      type="email"
                      disabled={isSyncMode}
                      value={resumeData.email}
                      onChange={e => updateField('email', e.target.value)}
                      className="w-full bg-slate-50 disabled:bg-slate-100 disabled:cursor-not-allowed border-2 border-black p-2 text-xs font-bold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase">Phone</label>
                    <input
                      type="text"
                      value={resumeData.phone}
                      onChange={e => updateField('phone', e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full bg-slate-50 border-2 border-black p-2 text-xs font-bold focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase">Location</label>
                    <input
                      type="text"
                      disabled={isSyncMode}
                      value={resumeData.location}
                      onChange={e => updateField('location', e.target.value)}
                      className="w-full bg-slate-50 disabled:bg-slate-100 disabled:cursor-not-allowed border-2 border-black p-2 text-xs font-bold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase">Portfolio Website</label>
                    <input
                      type="text"
                      value={resumeData.portfolio}
                      onChange={e => updateField('portfolio', e.target.value)}
                      className="w-full bg-slate-50 border-2 border-black p-2 text-xs font-bold focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase">LinkedIn Handler</label>
                    <input
                      type="text"
                      value={resumeData.linkedin}
                      onChange={e => updateField('linkedin', e.target.value)}
                      className="w-full bg-slate-50 border-2 border-black p-2 text-xs font-bold focus:outline-none focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase">GitHub Profile</label>
                    <input
                      type="text"
                      value={resumeData.github}
                      onChange={e => updateField('github', e.target.value)}
                      className="w-full bg-slate-50 border-2 border-black p-2 text-xs font-bold focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Bio Summary & Skills */}
              <div className="space-y-4 pt-2">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">Summary &amp; Tech Stack</h4>
                
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase">Professional Summary</label>
                  <textarea
                    rows="3"
                    disabled={isSyncMode}
                    value={resumeData.summary}
                    onChange={e => updateField('summary', e.target.value)}
                    className="w-full bg-slate-50 disabled:bg-slate-100 disabled:cursor-not-allowed border-2 border-black p-2 text-xs font-bold focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase">Skills (Comma-separated)</label>
                  <input
                    type="text"
                    disabled={isSyncMode}
                    value={resumeData.skillsString}
                    onChange={e => updateField('skillsString', e.target.value)}
                    className="w-full bg-slate-50 disabled:bg-slate-100 disabled:cursor-not-allowed border-2 border-black p-2 text-xs font-bold focus:outline-none"
                  />
                </div>
              </div>

              {/* Experience History */}
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Work History</h4>
                  <button
                    onClick={addExperience}
                    className="flex items-center gap-1 border border-black px-2 py-0.5 text-[8px] font-black uppercase hover:bg-slate-50 cursor-pointer"
                  >
                    Add <Plus size={10} />
                  </button>
                </div>

                {resumeData.experiences.map((exp, i) => (
                  <div key={exp.id} className="p-3 bg-slate-50 border-2 border-black space-y-2 relative">
                    <button
                      onClick={() => removeExperience(exp.id)}
                      className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 border border-transparent hover:border-red-500 cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[8px] font-black text-slate-400 uppercase">Role Title</label>
                        <input
                          type="text"
                          value={exp.title}
                          onChange={e => updateNestedField('experiences', exp.id, 'title', e.target.value)}
                          className="w-full bg-white border border-black p-1 text-[11px] font-bold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[8px] font-black text-slate-400 uppercase">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={e => updateNestedField('experiences', exp.id, 'company', e.target.value)}
                          className="w-full bg-white border border-black p-1 text-[11px] font-bold focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[8px] font-black text-slate-400 uppercase">Dates Range</label>
                        <input
                          type="text"
                          value={exp.dates}
                          onChange={e => updateNestedField('experiences', exp.id, 'dates', e.target.value)}
                          className="w-full bg-white border border-black p-1 text-[11px] font-bold focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[8px] font-black text-slate-400 uppercase">Description / Bullet</label>
                      <textarea
                        rows="2"
                        value={exp.description}
                        onChange={e => updateNestedField('experiences', exp.id, 'description', e.target.value)}
                        className="w-full bg-white border border-black p-1.5 text-[10px] font-bold focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Education List */}
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Education</h4>
                  <button
                    onClick={addEducation}
                    className="flex items-center gap-1 border border-black px-2 py-0.5 text-[8px] font-black uppercase hover:bg-slate-50 cursor-pointer"
                  >
                    Add <Plus size={10} />
                  </button>
                </div>

                {resumeData.educations.map((edu) => (
                  <div key={edu.id} className="p-3 bg-slate-50 border-2 border-black space-y-2 relative">
                    <button
                      onClick={() => removeEducation(edu.id)}
                      className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 border border-transparent hover:border-red-500 cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[8px] font-black text-slate-400 uppercase">Degree/Study</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={e => updateNestedField('educations', edu.id, 'degree', e.target.value)}
                          className="w-full bg-white border border-black p-1 text-[11px] font-bold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[8px] font-black text-slate-400 uppercase">Institution</label>
                        <input
                          type="text"
                          value={edu.school}
                          onChange={e => updateNestedField('educations', edu.id, 'school', e.target.value)}
                          className="w-full bg-white border border-black p-1 text-[11px] font-bold focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[8px] font-black text-slate-400 uppercase">Dates Range</label>
                        <input
                          type="text"
                          value={edu.dates}
                          onChange={e => updateNestedField('educations', edu.id, 'dates', e.target.value)}
                          className="w-full bg-white border border-black p-1 text-[11px] font-bold focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[8px] font-black text-slate-400 uppercase">Additional details</label>
                      <input
                        type="text"
                        value={edu.details}
                        onChange={e => updateNestedField('educations', edu.id, 'details', e.target.value)}
                        className="w-full bg-white border border-black p-1 text-[10px] font-bold focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Projects List */}
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Projects</h4>
                  <button
                    onClick={addProject}
                    className="flex items-center gap-1 border border-black px-2 py-0.5 text-[8px] font-black uppercase hover:bg-slate-50 cursor-pointer"
                  >
                    Add <Plus size={10} />
                  </button>
                </div>

                {resumeData.projects.map((proj) => (
                  <div key={proj.id} className="p-3 bg-slate-50 border-2 border-black space-y-2 relative">
                    <button
                      onClick={() => removeProject(proj.id)}
                      className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 border border-transparent hover:border-red-500 cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[8px] font-black text-slate-400 uppercase">Project Title</label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={e => updateNestedField('projects', proj.id, 'title', e.target.value)}
                          className="w-full bg-white border border-black p-1 text-[11px] font-bold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[8px] font-black text-slate-400 uppercase">Tech Stack</label>
                        <input
                          type="text"
                          value={proj.tech}
                          onChange={e => updateNestedField('projects', proj.id, 'tech', e.target.value)}
                          className="w-full bg-white border border-black p-1 text-[11px] font-bold focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[8px] font-black text-slate-400 uppercase">Project Link</label>
                        <input
                          type="text"
                          value={proj.link}
                          onChange={e => updateNestedField('projects', proj.id, 'link', e.target.value)}
                          className="w-full bg-white border border-black p-1 text-[11px] font-bold focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[8px] font-black text-slate-400 uppercase">Description</label>
                      <textarea
                        rows="2"
                        value={proj.description}
                        onChange={e => updateNestedField('projects', proj.id, 'description', e.target.value)}
                        className="w-full bg-white border border-black p-1.5 text-[10px] font-bold focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>

          {/* ────────────────── RIGHT COLUMN: A4 SHEET PREVIEW ────────────────── */}
          <div className="lg:col-span-7 flex justify-center sticky top-24">
            
            {/* A4 Sheet Container */}
            <div 
              id="cv-print-area"
              className={`w-full max-w-[210mm] min-h-[297mm] bg-white border-[4px] border-black p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] ${fontClass} text-slate-800 transition-all duration-300 relative`}
            >
              {/* Template accent bar for corporate and mono */}
              {template === 'corporate' && (
                <div className="absolute top-0 left-0 right-0 h-4" style={{ backgroundColor: accent }} />
              )}

              {/* CV HEADER */}
              <div className={`border-b-4 border-black pb-6 mb-6 ${template === 'brutalist' ? 'bg-slate-50 -mx-12 -mt-12 p-12 border-t-0' : ''}`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                  <div className="flex items-center gap-4">
                    {/* CV Photo in Preview */}
                    {resumeData.profilePicture && (
                      <div className={`shrink-0 overflow-hidden border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                        ${template === 'minimalist' ? 'rounded-full w-32 h-32 shadow-none' : 'w-32 h-32'}`}>
                        <img src={resumeData.profilePicture} alt="CV Avatar" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-slate-900 leading-none">
                        {resumeData.fullName || 'Candidate Identity'}
                      </h2>
                      <p className="text-xs uppercase tracking-widest font-black mt-2" style={{ color: accent }}>
                        {resumeData.jobTitle}
                      </p>
                    </div>
                  </div>
                  
                  {/* Contact Nodes */}
                  <div className="space-y-1 text-[10px] font-bold uppercase tracking-wide text-slate-600 text-left md:text-right">
                    <div className="flex items-center md:justify-end gap-1.5">
                      <MapPin size={11} className="text-black" />
                      <span>{resumeData.location}</span>
                    </div>
                    {resumeData.email && (
                      <div className="flex items-center md:justify-end gap-1.5">
                        <Mail size={11} className="text-black" />
                        <span className="lowercase">{resumeData.email}</span>
                      </div>
                    )}
                    {resumeData.phone && (
                      <div className="flex items-center md:justify-end gap-1.5">
                        <Phone size={11} className="text-black" />
                        <span>{resumeData.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Social Links Row */}
                <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t-2 border-dashed border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500">
                  {resumeData.portfolio && (
                    <div className="flex items-center gap-1">
                      <Globe size={11} /> <span>{resumeData.portfolio}</span>
                    </div>
                  )}
                  {resumeData.linkedin && (
                    <div className="flex items-center gap-1">
                      <Linkedin size={11} /> <span>{resumeData.linkedin}</span>
                    </div>
                  )}
                  {resumeData.github && (
                    <div className="flex items-center gap-1">
                      <Github size={11} /> <span>{resumeData.github}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* CV BODY */}
              <div className="space-y-6">
                
                {/* Summary / Bio */}
                {resumeData.summary && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] border-b-2 border-black pb-1 mb-2.5 flex items-center gap-2">
                      <span className="w-2 h-2" style={{ backgroundColor: accent }} />
                      Professional Summary
                    </h3>
                    <p className="text-xs font-medium leading-relaxed text-slate-700 uppercase">
                      {resumeData.summary}
                    </p>
                  </div>
                )}

                {/* Skills Matrix */}
                {resumeData.skillsString && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] border-b-2 border-black pb-1 mb-2.5 flex items-center gap-2">
                      <span className="w-2 h-2" style={{ backgroundColor: accent }} />
                      Skills Matrix
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {resumeData.skillsString.split(',').map((skill, i) => {
                        const trimmed = skill.trim();
                        if (!trimmed) return null;
                        return (
                          <span 
                            key={i}
                            className={`text-[9px] font-black uppercase tracking-wider border-2 border-black px-2 py-0.5
                              ${template === 'brutalist' ? 'bg-sky-50' : template === 'monotech' ? 'bg-amber-50 font-mono' : 'bg-slate-50'}`}
                            style={template === 'brutalist' ? { backgroundColor: `${accent}15` } : {}}
                          >
                            {trimmed}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Work Experience */}
                {resumeData.experiences.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] border-b-2 border-black pb-1 mb-3.5 flex items-center gap-2">
                      <span className="w-2 h-2" style={{ backgroundColor: accent }} />
                      Employment Experience
                    </h3>
                    <div className="space-y-4">
                      {resumeData.experiences.map((exp) => (
                        <div key={exp.id} className="space-y-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">{exp.title}</h4>
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{exp.company}</p>
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5">{exp.dates}</span>
                          </div>
                          <p className="text-[11px] font-medium leading-relaxed text-slate-600 uppercase pt-0.5">
                            {exp.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project Pipeline */}
                {resumeData.projects.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] border-b-2 border-black pb-1 mb-3.5 flex items-center gap-2">
                      <span className="w-2 h-2" style={{ backgroundColor: accent }} />
                      Project Deployments
                    </h3>
                    <div className="space-y-4">
                      {resumeData.projects.map((proj) => (
                        <div key={proj.id} className="space-y-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">
                                {proj.title} <span className="text-[9px] font-medium text-slate-400 normal-case ml-2">({proj.link})</span>
                              </h4>
                              <p className="text-[9px] font-bold uppercase tracking-wider mt-0.5" style={{ color: accent }}>{proj.tech}</p>
                            </div>
                          </div>
                          <p className="text-[11px] font-medium leading-relaxed text-slate-600 uppercase pt-0.5">
                            {proj.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education Log */}
                {resumeData.educations.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] border-b-2 border-black pb-1 mb-3.5 flex items-center gap-2">
                      <span className="w-2 h-2" style={{ backgroundColor: accent }} />
                      Academic Records
                    </h3>
                    <div className="space-y-3">
                      {resumeData.educations.map((edu) => (
                        <div key={edu.id} className="space-y-0.5">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">{edu.degree}</h4>
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{edu.school}</p>
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5">{edu.dates}</span>
                          </div>
                          {edu.details && (
                            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-600">
                              {edu.details}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
              
              {/* Brutalist design badge */}
              {template === 'brutalist' && (
                <div className="absolute bottom-4 right-4 text-[8px] font-black uppercase tracking-widest text-slate-300">
                  hirrd cv-node system v1.0
                </div>
              )}
            </div>

        </div>

      </div>
    </div>
    </div>

    {/* --- RESUME PDF IMPORTER MODAL --- */}
    <AnimatePresence>
      {showImportModal && (
        <motion.div key="import-modal-wrapper" className="fixed inset-0 z-[150] no-print flex items-center justify-center">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => importStep === 'idle' || importStep === 'done' ? (setShowImportModal(false), setImportStep('idle'), setImportingFile(null)) : null}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            className="relative w-full max-w-2xl bg-white border-[4px] border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] z-[160] max-h-[90vh] overflow-y-auto mx-4"
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
                  Upload your CV in PDF format. Our parsing engine will analyze structural layers, extract work history, education, projects, and map them to your CV form inputs.
                </p>

                <div className="border-[3px] border-dashed border-black p-10 bg-slate-50 text-center hover:bg-sky-50 transition-colors relative group">
                  <input 
                    type="file" 
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <UploadCloud size={40} className="mx-auto text-slate-400 group-hover:text-sky-500 transition-colors mb-4" />
                  <p className="text-xs font-black uppercase tracking-wider text-black mb-1">Drag and Drop CV PDF here</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">or click to browse local folders</p>
                </div>
              </div>
            )}

            {/* Step 2: Processing */}
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

            {/* Step 3: Done */}
            {importStep === 'done' && parsedData && (
              <div className="space-y-6">
                <div className="bg-emerald-50 border-2 border-emerald-500 p-4 flex items-center gap-3">
                  <Check size={20} className="text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="font-black text-xs uppercase text-emerald-800">Extraction Complete</h4>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">Fully parsed work experience and projects.</p>
                  </div>
                </div>

                <div className="border-2 border-black divide-y-2 divide-black max-h-[40vh] overflow-y-auto">
                  <div className="grid grid-cols-3 bg-black text-white p-3 text-[10px] font-black uppercase tracking-wider sticky top-0">
                    <span>Section</span>
                    <span className="col-span-2">Extracted Details</span>
                  </div>

                  <div className="grid grid-cols-3 p-3 text-xs font-bold items-start hover:bg-slate-50 transition-colors">
                    <span className="text-slate-400 uppercase text-[9px] tracking-wide">Identity</span>
                    <span className="col-span-2 uppercase text-slate-800 font-black">{parsedData.fullName} — {parsedData.jobTitle}</span>
                  </div>

                  <div className="grid grid-cols-3 p-3 text-xs font-bold items-start hover:bg-slate-50 transition-colors">
                    <span className="text-slate-400 uppercase text-[9px] tracking-wide">Skills</span>
                    <span className="col-span-2 uppercase text-slate-800 font-black">{parsedData.skillsString}</span>
                  </div>

                  <div className="grid grid-cols-3 p-3 text-xs font-bold items-start hover:bg-slate-50 transition-colors">
                    <span className="text-slate-400 uppercase text-[9px] tracking-wide">Work History</span>
                    <div className="col-span-2 space-y-2">
                      {parsedData.experiences.map((exp, i) => (
                        <div key={i} className="border-l-2 border-black pl-2">
                          <p className="font-black text-[10px] uppercase text-black">{exp.title} at {exp.company} ({exp.dates})</p>
                          <p className="text-[9px] text-slate-500 leading-relaxed uppercase">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 p-3 text-xs font-bold items-start hover:bg-slate-50 transition-colors">
                    <span className="text-slate-400 uppercase text-[9px] tracking-wide">Projects</span>
                    <div className="col-span-2 space-y-2">
                      {parsedData.projects.map((proj, i) => (
                        <div key={i} className="border-l-2 border-black pl-2">
                          <p className="font-black text-[10px] uppercase text-black">{proj.title} ({proj.tech})</p>
                          <p className="text-[9px] text-slate-500 leading-relaxed uppercase">{proj.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={applyParsedData}
                    className="flex-1 bg-sky-500 text-black hover:bg-black hover:text-sky-400 py-3.5 text-[10px] font-black uppercase tracking-widest transition-all border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none cursor-pointer flex items-center justify-center gap-2"
                  >
                    Apply Parsed Data to CV <Check size={14} />
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
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};

export default ResumeBuilderPage;
