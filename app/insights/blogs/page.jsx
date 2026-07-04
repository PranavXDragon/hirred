'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Clock, User, ChevronRight, Zap } from 'lucide-react';

const BlogPage = () => {
  const blogs = [
    {
      id: 1,
      category: "Automation",
      title: "How AI is Redefining Recruitment in 2026",
      excerpt: "Deep dive into the algorithmic shifts that are making traditional headhunting obsolete.",
      author: "Pranav navghare",
      date: "March 10, 2026",
      readTime: "5 min",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 2,
      category: "Career",
      title: "The Rise of Remote-First Tech Hubs in India",
      excerpt: "Why Tier-2 cities are becoming the new silicon valleys for elite developers.",
      author: "Team Labelz",
      date: "March 08, 2026",
      readTime: "8 min",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 3,
      category: "Engineering",
      title: "Scaling MERN Stack for Enterprise Applications",
      excerpt: "Best practices for building robust, scalable infrastructure using modern protocols.",
      author: "Pranav navghare",
      date: "March 05, 2026",
      readTime: "12 min",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
    }
  ];

  return (
    <div className="bg-white pt-20 relative min-h-screen">
      
      {/* --- Background Grid --- */}
      <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none" 
           style={{ 
             backgroundImage: `linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)`, 
             backgroundSize: '40px 40px' 
           }}>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* --- Header Section --- */}
        <header className="py-16 md:py-24 border-b-4 border-black mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-6"
          >
            <div className="w-10 h-10 bg-sky-500 flex items-center justify-center text-black">
              <Zap size={20} fill="currentColor" />
            </div>
            <span className="font-black uppercase tracking-[0.3em] text-xs">Insights & Intelligence</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9]"
          >
            The <span className="text-sky-500 italic">Labelz</span> <br /> Journal.
          </motion.h1>
        </header>

        {/* --- Featured Post (Hero Blog) --- */}
        <section className="mb-24">
          <motion.div 
            whileHover={{ y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-2 border-[4px] border-black bg-white shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <div className="h-[300px] lg:h-full overflow-hidden border-b-4 lg:border-b-0 lg:border-r-4 border-black">
              <img 
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200" 
                alt="Featured" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <span className="bg-black text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest self-start mb-6">
                Featured Article
              </span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-6">
                Beyond Algorithms: The Future of Human-Centric Tech
              </h2>
              <p className="text-slate-600 font-bold mb-8 text-lg">
                Exploring why personal branding and technical validation are the two pillars of the next digital era.
              </p>
              <div className="flex items-center gap-6 mb-8 text-xs font-black uppercase tracking-widest text-slate-400">
                <span className="flex items-center gap-2"><User size={14}/> Pranav navghare</span>
                <span className="flex items-center gap-2"><Clock size={14}/> 15 Min Read</span>
              </div>
              <button className="flex items-center gap-2 bg-sky-500 text-black px-8 py-4 font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-all w-fit shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                Read Full Entry <ArrowUpRight size={16} />
              </button>
            </div>
          </motion.div>
        </section>

        {/* --- Blog Grid --- */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-24">
          {blogs.map((blog, index) => (
            <motion.article 
              key={blog.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group flex flex-col border-[3px] border-black bg-white hover:shadow-[10px_10px_0px_0px_rgba(14,165,233,1)] transition-all cursor-pointer"
            >
              <div className="h-56 overflow-hidden border-b-[3px] border-black relative">
                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 left-4 bg-white border-2 border-black px-3 py-1 text-[10px] font-black uppercase">
                  {blog.category}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-4 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span>{blog.date}</span>
                  <span className="w-1 h-1 bg-sky-500 rounded-full"></span>
                  <span>{blog.readTime}</span>
                </div>
                
                <h3 className="text-xl font-black uppercase tracking-tighter leading-tight mb-4 group-hover:text-sky-600 transition-colors">
                  {blog.title}
                </h3>
                
                <p className="text-slate-600 font-bold text-sm mb-6 flex-grow">
                  {blog.excerpt}
                </p>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest">By {blog.author}</span>
                  <div className="w-10 h-10 border-2 border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                    <ChevronRight size={18} />
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </section>

        {/* --- Newsletter / Footer CTA --- */}
        <section className="py-20 border-t-4 border-black mb-24">
          <div className="bg-black text-white p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-xl">
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Subscribe to Intel.</h2>
              <p className="text-slate-400 font-bold tracking-tight">Weekly deep-dives into AI, MERN stack, and high-performance career growth.</p>
            </div>
            <div className="flex w-full lg:w-auto gap-4">
              <input 
                type="email" 
                placeholder="EMAIL_ADDRESS" 
                className="bg-transparent border-b-2 border-white py-4 px-2 w-full lg:w-80 font-black uppercase text-xs focus:outline-none focus:border-sky-500 transition-colors"
              />
              <button className="bg-sky-500 text-black px-8 py-4 font-black uppercase text-xs tracking-widest hover:bg-white transition-all">
                Join
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default BlogPage;
