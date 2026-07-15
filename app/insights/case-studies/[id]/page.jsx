import React, { use } from 'react';
import { ArrowLeft, Target, BarChart3, Clock, Zap, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

async function getArticle(id) {
  try {
    const res = await fetch(`https://dev.to/api/articles/${id}`, {
      next: { revalidate: 86400 } // Cache for 24 hours
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

export default async function CaseStudyArticle({ params }) {
  // Unwrap params using React.use()
  const unwrappedParams = await params;
  const article = await getArticle(unwrappedParams.id);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-20">
        <div className="text-center">
          <h1 className="text-4xl font-black uppercase text-slate-800 mb-6">Protocol Not Found.</h1>
          <Link href="/insights/case-studies" className="bg-sky-500 text-black px-6 py-3 font-black uppercase tracking-widest text-xs">
            Return to Archives
          </Link>
        </div>
      </div>
    );
  }

  const fallbackImage = `https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200`;
  const tagsList = article.tags || ["Startup", "Technology", "Business"];

  return (
    <div className="bg-white pt-24 pb-24 relative selection:bg-sky-500 selection:text-white min-h-screen">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none" 
           style={{ 
             backgroundImage: `linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)`, 
             backgroundSize: '40px 40px' 
           }}>
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <Link href="/insights/case-studies" className="inline-flex items-center gap-2 font-black uppercase tracking-widest text-xs text-slate-400 hover:text-sky-500 transition-colors mb-12">
          <ArrowLeft size={16} /> Back to Archives
        </Link>

        {/* Header Section */}
        <header className="mb-16">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="bg-black text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest">{article.user?.name || "hirrd Network"}</span>
            <span className="w-1 h-1 bg-sky-500 rounded-full"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{new Date(article.published_at).toLocaleDateString()}</span>
            <span className="w-1 h-1 bg-sky-500 rounded-full"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{article.reading_time_minutes} min read</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-8">
            {article.title}
          </h1>

          <div className="flex flex-wrap gap-4 mb-12">
            {tagsList.map(tag => (
              <span key={tag} className="border-2 border-black px-4 py-2 text-xs font-black uppercase tracking-widest bg-sky-50">
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Hero Image */}
        <div className="w-full h-[300px] md:h-[500px] border-[4px] border-black mb-16 shadow-[15px_15px_0px_0px_rgba(14,165,233,1)] relative overflow-hidden group bg-neutral-900 flex items-center justify-center">
          <img src={article.cover_image || fallbackImage} alt={article.title} className="w-full h-full object-contain group-hover:scale-105 transition-all duration-700" />
          <div className="absolute top-6 left-6 bg-black text-white px-6 py-3 font-black text-xl md:text-2xl tracking-tighter border-2 border-white">
            {article.public_reactions_count} Reactions
          </div>
        </div>

        {/* Article Body using Dangerously Set Inner HTML */}
        <article className="prose prose-lg max-w-none text-slate-800 space-y-16">
          
          <div className="bg-slate-50 border-[3px] border-black p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
             <h2 className="flex items-center gap-3 text-3xl font-black uppercase tracking-tighter mb-6">
                <Target className="text-sky-500" size={32} /> Executive Summary
             </h2>
             <p className="text-lg leading-relaxed font-bold">
                {article.description}
             </p>
          </div>

          <section>
            <h2 className="flex items-center gap-3 text-3xl font-black uppercase tracking-tighter border-b-4 border-black pb-4 mb-6">
              <BarChart3 className="text-emerald-500" size={32} /> The Full Protocol
            </h2>
            <div 
              className="text-lg leading-relaxed font-medium prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-a:text-sky-600 prose-a:font-bold prose-img:border-[3px] prose-img:border-black"
              dangerouslySetInnerHTML={{ __html: article.body_html }}
            />
          </section>

          <section className="bg-sky-500 text-black p-8 md:p-12 border-[4px] border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] text-center mt-20">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-8 leading-none">
              Apply these learnings to your business
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/contact" className="bg-black text-white px-12 py-5 font-black uppercase tracking-widest text-sm hover:translate-x-1 hover:-translate-y-1 transition-transform shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] inline-block">
                 Schedule Architecture Audit
              </Link>
              {article.url && (
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="border-[3px] border-black bg-white text-black px-12 py-5 font-black uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-all inline-block">
                  View Original Source
                </a>
              )}
            </div>
          </section>

        </article>
      </div>
    </div>
  );
}
