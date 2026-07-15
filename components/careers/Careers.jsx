import React, { useState, useEffect } from 'react';

import { 
  Briefcase, 
  MapPin, 
  Clock, 
  IndianRupee, 
  Filter, 
  ChevronRight, 
  Search,
  Zap,
  ArrowRight,
  ShieldCheck,
  Code
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

// Synonym dictionary to expand search keywords and handle typos/abbreviations
const getSearchKeywords = (query) => {
  const clean = query.toLowerCase().trim();
  if (!clean) return [];
  
  const synonyms = {
    'react': ['react', 'reactjs', 'rect', 'reac', 'frontend', 'front-end'],
    'javascript': ['javascript', 'js', 'javascrit', 'javscript', 'ecmascript'],
    'python': ['python', 'pyton', 'py', 'pyt'],
    'devops': ['devops', 'devop', 'aws', 'cloud', 'docker', 'kubernetes', 'k8s', 'terraform', 'infra'],
    'design': ['design', 'ui', 'ux', 'uiux', 'figma', 'desiner', 'designer', 'web design'],
    'frontend': ['frontend', 'front-end', 'front end', 'frntend'],
    'backend': ['backend', 'back-end', 'back end', 'bckend', 'node', 'nodejs'],
    'node': ['node', 'nodejs', 'node.js', 'backend'],
    'typescript': ['typescript', 'ts', 'tyscript'],
    'ml': ['ml', 'machine learning', 'ai', 'artificial intelligence', 'deep learning', 'nlp', 'pytorch', 'python'],
    'ai': ['ai', 'ml', 'machine learning', 'artificial intelligence', 'deep learning', 'nlp', 'pytorch'],
    'security': ['security', 'cyber', 'cybersecurity', 'cyber security', 'pentest', 'hacker', 'owasp', 'firewall'],
    'data': ['data', 'datascience', 'data science', 'sql', 'analytics', 'pandas', 'numpy']
  };
  
  const keywords = [clean];
  for (const [key, aliases] of Object.entries(synonyms)) {
    if (key.includes(clean) || aliases.some(a => a.includes(clean) || clean.includes(a))) {
      keywords.push(key, ...aliases);
    }
  }
  return [...new Set(keywords)];
};

import { useRouter } from 'next/navigation';

const Careers = ({ liveJobs = [], searchQuery, setSearchQuery, searchLocation, setSearchLocation }) => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [allJobs, setAllJobs] = useState([]);

  useEffect(() => {
    try {
      const posted = JSON.parse(localStorage.getItem('postedJobs') || '[]');
      const transformedPosted = posted.map(j => ({
        id: j.id,
        role: j.title,
        company: j.companyName || 'Recruiter Partner',
        type: j.type,
        location: j.location,
        salary: j.salary,
        stack: j.description.includes(',') 
          ? j.description.split(',').map(s => s.trim()) 
          : [j.department || 'Tech'],
        category: j.department || 'Engineering',
        posted: j.datePosted || 'Just now'
      }));
      setAllJobs([...liveJobs, ...transformedPosted]);
    } catch {
      setAllJobs(liveJobs);
    }
  }, [liveJobs]);

  const categories = ["All", "Engineering", "Design", "AI/ML", "DevOps/Cloud", "Cyber Security", "Data Science", "Management"];

  const filteredJobs = allJobs.filter(job => {
    // 1. Category Filter
    const matchesCategory = selectedCategory === "All" || job.category.toLowerCase() === selectedCategory.toLowerCase();
    
    // 2. Search Query Filter with Synonym/Fuzzy match mapping
    const keywords = getSearchKeywords(searchQuery);
    const matchesQuery = keywords.length === 0 || keywords.some(keyword => 
      job.role.toLowerCase().includes(keyword) ||
      job.company.toLowerCase().includes(keyword) ||
      job.stack.some(s => s.toLowerCase().includes(keyword)) ||
      job.category.toLowerCase().includes(keyword)
    );
       
    // 3. Location Filter
    const loc = searchLocation.toLowerCase().trim();
    const matchesLoc = !loc || job.location.toLowerCase().includes(loc);

    return matchesCategory && matchesQuery && matchesLoc;
  });

  return (
    <div id="jobs-section" className="bg-white py-24 relative min-h-screen border-t-4 border-black">
      
      {/* --- Background Square Grid --- */}
      <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none" 
           style={{ 
             backgroundImage: `linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)`, 
             backgroundSize: '40px 40px' 
           }}>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* --- Header Section --- */}
        <header className="mb-16 border-b-4 border-black pb-12">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 mb-6"
          >
            <div className="w-8 h-8 bg-sky-500 flex items-center justify-center border-2 border-black">
              <Briefcase size={16} fill="currentColor" />
            </div>
            <span className="font-black uppercase tracking-[0.3em] text-[10px]">Technical Registry</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.85] mb-8"
          >
            Browse <br />
            <span className="text-sky-500 italic">Technical Openings.</span>
          </motion.h2>

          <div className="flex flex-col md:flex-row gap-4 max-w-4xl w-full">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by role or tech stack..." 
                className="w-full bg-slate-50 border-[3px] border-black p-4 pl-12 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(14,165,233,1)] transition-all uppercase text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative flex-grow md:max-w-xs">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500" size={18} />
              <input 
                type="text" 
                placeholder="Location..." 
                className="w-full bg-slate-50 border-[3px] border-black p-4 pl-12 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(14,165,233,1)] transition-all uppercase text-sm"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* --- Main Portal Body --- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-24">
          
          {/* Sidebar: Filters */}
          <aside className="lg:col-span-1 space-y-8">
            <div>
              <h3 className="flex items-center gap-2 font-black uppercase text-xs tracking-widest mb-6 border-b-2 border-black pb-2">
                <Filter size={14} /> Categories
              </h3>
              <div className="flex flex-col gap-2">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-left px-4 py-3 font-black text-[11px] uppercase tracking-widest border-2 transition-all
                      ${selectedCategory === cat 
                        ? 'bg-black text-white border-black translate-x-1 shadow-[4px_4px_0px_0px_rgba(14,165,233,1)]' 
                        : 'bg-white text-slate-400 border-slate-100 hover:border-black hover:text-black'}
                    `}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 bg-sky-50 border-2 border-sky-200">
               <Zap className="text-sky-500 mb-4" size={24} fill="currentColor" />
               <h4 className="font-black text-xs uppercase mb-2">Priority Alerts</h4>
               <p className="text-[10px] font-bold text-slate-600 mb-4 uppercase tracking-tighter">Get zero-latency notifications for elite job openings.</p>
               <button className="w-full bg-black text-white py-3 text-[10px] font-black uppercase tracking-widest">Enable Signals</button>
            </div>
          </aside>

          {/* Main List: Job Cards */}
          <main className="lg:col-span-3 space-y-6 max-h-[900px] overflow-y-auto pr-2">
            <AnimatePresence mode="popLayout">
              {filteredJobs.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-[3px] border-black p-12 text-center bg-slate-50"
                >
                  <Briefcase className="mx-auto text-slate-300 mb-4" size={40} />
                  <p className="text-xs font-black uppercase text-slate-400 tracking-wider">No job transmissions found matching search parameters.</p>
                </motion.div>
              ) : (
                filteredJobs.map((job) => (
                  <motion.div 
                    key={job.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group relative bg-white border-[3px] border-black p-6 md:p-8 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="bg-sky-500 text-black px-2 py-1 text-[9px] font-black uppercase tracking-tighter border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            {job.type}
                          </span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            <Clock size={12}/> {job.posted}
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter group-hover:text-sky-600 transition-colors">
                            {job.role}
                          </h2>
                          <p className="text-xs font-black text-sky-500 uppercase tracking-wider italic">{job.company}</p>
                        </div>

                        <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500">
                          <div className="flex items-center gap-1"><MapPin size={14} className="text-black" /> {job.location}</div>
                          <div className="flex items-center gap-1"><IndianRupee size={14} className="text-black" /> {job.salary}</div>
                          <div className="flex items-center gap-1"><Code size={14} className="text-black" /> {job.stack.join(", ")}</div>
                        </div>
                      </div>

                      <button 
                        onClick={() => router.push(`/jobs/${job.slug}`)}
                        className="flex items-center gap-3 bg-black text-white px-8 py-4 font-black uppercase text-[10px] tracking-widest hover:bg-sky-500 hover:text-black transition-all border-2 border-black shrink-0">
                        Apply Now <ChevronRight size={16} />
                      </button>
                    </div>
                    
                    {/* Hover Decoration */}
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                       <ShieldCheck className="text-sky-500" size={30} />
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </main>
        </div>



        {/* --- Protocol Section (Why Join Us) --- */}
        <section className="py-20 border-t-4 border-black mb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6 leading-none">
              The <span className="text-sky-500 italic">Hiring</span> <br /> Protocol.
            </h2>
            <div className="space-y-8">
               {[
                 { title: "Direct Pipeline", desc: "Skip the recruiters. Talk directly to the technical architects leading the projects." },
                 { title: "Nagpur Tech Hub", desc: "Be part of the growing ecosystem in Central India's cleanest and smartest city." },
                 { title: "Equity & Ownership", desc: "Elite roles come with skin in the game. We value long-term technical contributions." }
               ].map((item, i) => (
                 <div key={i} className="flex gap-6 items-start">
                    <div className="w-12 h-12 border-2 border-black flex-shrink-0 flex items-center justify-center font-black text-lg bg-slate-50">0{i+1}</div>
                    <div>
                       <h4 className="font-black uppercase text-sm mb-1 tracking-widest">{item.title}</h4>
                       <p className="text-slate-500 text-sm font-bold tracking-tight">{item.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
          <div className="bg-sky-500 border-4 border-black p-12 md:p-20 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] text-center relative overflow-hidden">
             <Zap className="absolute -right-10 -bottom-10 opacity-20 text-black" size={300} />
             <h3 className="text-3xl font-black uppercase mb-6 text-black relative z-10 italic">Can't find a role?</h3>
             <p className="text-black font-bold mb-10 relative z-10">Send us your technical portfolio. We are always looking for rogue talent in the MERN stack and AI space.</p>
             <button 
                type="button"
                onClick={() => router.push('/dashboard/student')}
                className="bg-black text-white px-12 py-5 font-black uppercase tracking-widest text-sm relative z-10 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] cursor-pointer hover:bg-sky-500 hover:text-black transition-colors"
             >
                General Application <ArrowRight size={18} className="inline ml-2" />
             </button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Careers;
