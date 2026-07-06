import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  TrendingUp, CheckCircle2, ArrowRight, Building2, 
  Calendar, User, ArrowUpRight, Zap 
} from 'lucide-react';

const Insights = () => {
  const cases = [
    {
      title: "Scaling Engineering Excellence",
      client: "TechFlow Systems",
      impact: "Reduced Time-to-Hire by 60%",
      desc: "How we helped a leading SaaS startup find 50+ senior developers within 3 months using our AI-matching engine.",
      color: "from-blue-600 to-sky-500",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Global Talent Acquisition",
      client: "Global Logistics Ltd",
      impact: "95% Candidate Retention",
      desc: "Streamlining the recruitment process for a Fortune 500 company across 5 different countries.",
      color: "from-slate-900 to-slate-700",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
    }
  ];

  const posts = [
    {
      tag: "Career Growth",
      title: "10 Skills That Will Dominate the 2026 Job Market",
      author: "Admin",
      date: "March 10, 2026",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600",
      desc: "As AI evolves, these human-centric skills are becoming more valuable than ever."
    },
    {
      tag: "Recruitment",
      title: "How to Build a High-Performance Remote Culture",
      author: "Digital India Biz",
      date: "March 05, 2026",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=600",
      desc: "A guide for recruiters and founders on managing talent across different time zones."
    },
    {
      tag: "Interview Tips",
      title: "The Art of Negotiating Your Salary in Tech",
      author: "Career Coach",
      date: "Feb 28, 2026",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600",
      desc: "Don't settle for less. Learn the proven strategies to get the compensation you deserve."
    }
  ];

  return (
    <div className="bg-white">
      
      {/* --- CASE STUDIES SECTION --- */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="mb-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-sky-600 font-bold uppercase tracking-[0.3em] text-xs mb-4"
            >
              Case Studies
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-4xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight"
            >
              Proven <span className="text-sky-600 italic">Success Stories.</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {cases.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                className="group relative overflow-hidden rounded-[40px] bg-slate-50 border border-slate-100 flex flex-col hover:shadow-2xl transition-all duration-500"
              >
                {/* Image Overlay Header */}
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-8 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg`}>
                      <Building2 size={20} />
                    </div>
                    <span className="text-white font-bold tracking-wide">{item.client}</span>
                  </div>
                </div>

                <div className="p-8 lg:p-10">
                  <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-sky-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-[16px] leading-relaxed mb-6 line-clamp-2">
                    {item.desc}
                  </p>
                  <div className="flex items-center gap-2 bg-white border border-slate-100 w-fit px-4 py-1.5 rounded-full shadow-sm mb-8">
                    <Zap size={16} className="text-amber-500" />
                    <span className="text-xs font-black text-slate-700 uppercase">{item.impact}</span>
                  </div>
                  <Link href="/insights/case-studies" className="flex items-center gap-2 font-black text-xs uppercase tracking-[0.1em] text-slate-900 group-hover:text-sky-600 transition-all">
                    Read Case Study <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- BLOGS SECTION --- */}
      <section className="py-24 bg-[#fcfdfe] border-t border-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="text-center mb-20">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-sky-600 font-bold uppercase tracking-[0.4em] text-xs"
            >
              Knowledge Hub
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl lg:text-5xl font-black text-slate-900 mt-4 tracking-tight"
            >
              Latest from the <span className="text-slate-400 font-medium">Blog.</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <Link href="/insights/blogs" key={index} className="block h-full">
                <motion.article
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group cursor-pointer bg-white border border-slate-100 p-2 rounded-[36px] hover:border-sky-200 hover:shadow-xl transition-all duration-500"
              >
                {/* Blog Image */}
                <div className="h-52 bg-slate-100 rounded-[30px] overflow-hidden relative">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-sky-900/10 group-hover:bg-transparent transition-colors"></div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-sky-600 shadow-sm">
                      {post.tag}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-4 text-slate-400 text-[11px] font-bold mb-4 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5"><Calendar size={14} className="text-sky-500" /> {post.date}</div>
                    <div className="flex items-center gap-1.5"><User size={14} className="text-sky-500" /> {post.author}</div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-sky-600 transition-colors leading-snug">
                    {post.title}
                  </h3>
                  
                  <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-2">
                    {post.desc}
                  </p>

                  <div className="flex items-center justify-between pt-5 border-t border-slate-50 group-hover:border-sky-50">
                    <span className="text-sm font-black text-slate-800 uppercase tracking-tighter">Read More</span>
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-sky-600 group-hover:text-white transition-all duration-300">
                      <ArrowUpRight size={20} />
                    </div>
                  </div>
                </div>
              </motion.article>
              </Link>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link href="/insights/blogs" className="text-slate-900 font-black border-b-[3px] border-sky-600 pb-1 hover:text-sky-600 transition-all text-sm uppercase tracking-widest inline-block">
              View All Insights
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Insights;
