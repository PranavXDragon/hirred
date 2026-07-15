"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Briefcase, MapPin, Search, Filter, Zap, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import JobCard from '../../components/jobs/JobCard';
import JobDetailPane from '../../components/jobs/JobDetailPane';

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

export default function JobsClient({ initialJobs = [], initialSlug = null }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Search state
  const [searchVal, setSearchVal] = useState(searchParams?.get('title') || '');
  const [locVal, setLocVal] = useState(searchParams?.get('location') || '');

  const [activeQuery, setActiveQuery] = useState(searchParams?.get('title') || '');
  const [activeLoc, setActiveLoc] = useState(searchParams?.get('location') || '');

  // Split-pane selection
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const titleParam = searchParams?.get('title') || '';
    const locParam = searchParams?.get('location') || '';
    setSearchVal(titleParam);
    setLocVal(locParam);
    setActiveQuery(titleParam);
    setActiveLoc(locParam);
  }, [searchParams]);

  const categories = ["All", "Engineering", "Design", "AI/ML", "DevOps/Cloud", "Cyber Security", "Data Science", "Management"];

  const filteredJobs = initialJobs.filter(job => {
    const matchesCategory = selectedCategory === "All" || job.category.toLowerCase() === selectedCategory.toLowerCase();
    
    const keywords = getSearchKeywords(activeQuery);
    const matchesQuery = keywords.length === 0 || keywords.some(keyword => 
      job.role.toLowerCase().includes(keyword) ||
      job.company.toLowerCase().includes(keyword) ||
      job.stack.some(s => s.toLowerCase().includes(keyword)) ||
      job.category.toLowerCase().includes(keyword)
    );
       
    const loc = activeLoc.toLowerCase().trim();
    const matchesLoc = !loc || job.location.toLowerCase().includes(loc);

    return matchesCategory && matchesQuery && matchesLoc;
  });

  // Default select first job if none selected, or select by slug from URL
  useEffect(() => {
    if (filteredJobs.length > 0 && !selectedJob) {
      const idParam = searchParams?.get('id');
      if (initialSlug || idParam) {
        // Find job in all initial jobs by slug or id
        const found = initialJobs.find(j => j.slug === initialSlug || j.id === idParam);
        if (found) {
          setSelectedJob(found);
          return;
        }
      }
      setSelectedJob(filteredJobs[0]);
    } else if (filteredJobs.length === 0) {
      setSelectedJob(null);
    }
  }, [filteredJobs, selectedJob, searchParams, initialJobs, initialSlug]);

  // Update URL silently when job is selected
  useEffect(() => {
    if (selectedJob && typeof window !== 'undefined') {
      window.history.replaceState({}, '', `/jobs/${selectedJob.slug}`);
    }
  }, [selectedJob]);

  const handleSearch = () => {
    setActiveQuery(searchVal);
    setActiveLoc(locVal);
    // Optionally update URL params here
    router.push(`/jobs?title=${encodeURIComponent(searchVal)}&location=${encodeURIComponent(locVal)}`, { scroll: false });
  };

  return (
    <div className="bg-white pt-24 pb-12 relative min-h-screen">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none" 
           style={{ 
             backgroundImage: `linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)`, 
             backgroundSize: '40px 40px' 
           }}>
      </div>

      <div 
        className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 flex flex-col"
        style={{ height: 'max(800px, calc(100vh - 6rem))' }}
      >
        
        {/* Header / Search */}
        <header className="mb-6 flex-shrink-0">
          <div className="flex flex-col md:flex-row gap-4 max-w-5xl w-full mx-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by role or tech stack..." 
                className="w-full bg-slate-50 border-[3px] border-black p-4 pl-12 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(14,165,233,1)] transition-all uppercase text-sm"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
              />
            </div>
            <div className="relative flex-grow md:max-w-xs">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500" size={18} />
              <input 
                type="text" 
                placeholder="Location..." 
                className="w-full bg-slate-50 border-[3px] border-black p-4 pl-12 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(14,165,233,1)] transition-all uppercase text-sm"
                value={locVal}
                onChange={(e) => setLocVal(e.target.value)}
              />
            </div>
            <button 
              onClick={handleSearch}
              className="bg-black text-white px-8 py-4 font-black uppercase text-xs tracking-widest hover:bg-sky-500 hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(14,165,233,1)] cursor-pointer"
            >
              Search
            </button>
          </div>

          {/* Categories Tab Bar */}
          <div className="flex gap-2 overflow-x-auto pb-4 mt-6 max-w-5xl mx-auto hide-scrollbar">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 font-black text-[10px] uppercase tracking-widest border-2 transition-all
                  ${selectedCategory === cat 
                    ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(14,165,233,1)]' 
                    : 'bg-white text-slate-500 border-slate-200 hover:border-black hover:text-black'}
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        {/* Split Pane View */}
        <div className="flex-grow flex flex-col md:flex-row gap-6 overflow-hidden -mx-4 px-4 pb-4">
          
          {/* Left Pane: Job List */}
          <div className="w-full md:w-5/12 lg:w-4/12 overflow-y-auto space-y-6 pr-4 pb-12 hide-scrollbar">
            <AnimatePresence>
              {filteredJobs.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-[3px] border-black p-8 text-center bg-slate-50"
                >
                  <Briefcase className="mx-auto text-slate-300 mb-4" size={32} />
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">No transmissions match criteria.</p>
                </motion.div>
              ) : (
                filteredJobs.map((job) => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    isSelected={selectedJob?.id === job.id} 
                    onClick={() => setSelectedJob(job)} 
                  />
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Right Pane: Details */}
          <div className="hidden md:block w-full md:w-7/12 lg:w-8/12 flex flex-col h-full min-h-0 pb-12 pr-4">
            <JobDetailPane job={selectedJob} />
          </div>

        </div>
      </div>
    </div>
  );
}
