import React, { use } from 'react';
import { ArrowLeft, Clock, User, Share2 } from 'lucide-react';
import Link from 'next/link';

async function getBlog(id) {
  try {
    const res = await fetch(`https://dev.to/api/articles/${id}`, {
      next: { revalidate: 86400 } // Cache for 24 hours
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

export default async function BlogArticle({ params }) {
  // Unwrap params using React.use()
  const unwrappedParams = await params;
  
  // Extract Dev.to integer ID from end of our custom slug (e.g. some-article-slug-123456)
  const idMatch = unwrappedParams.slug.match(/-(\d+)$/);
  const articleId = idMatch ? idMatch[1] : unwrappedParams.slug;
  
  const blog = await getBlog(articleId);

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-20">
        <div className="text-center">
          <h1 className="text-4xl font-black uppercase text-slate-800 mb-6">Article Not Found.</h1>
          <Link href="/insights/blogs" className="bg-sky-500 text-black px-6 py-3 font-black uppercase tracking-widest text-xs">
            Return to Journal
          </Link>
        </div>
      </div>
    );
  }

  const fallbackImage = `https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200`;
  const tagsList = blog.tags || ["Technology", "Software", "Engineering"];

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
        <div className="flex justify-between items-center mb-12 border-b-4 border-black pb-4">
          <Link href="/insights/blogs" className="inline-flex items-center gap-2 font-black uppercase tracking-widest text-xs text-slate-400 hover:text-sky-500 transition-colors">
            <ArrowLeft size={16} /> Back to Journal
          </Link>
          
          {blog.url && (
            <a href={blog.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-black uppercase tracking-widest text-xs text-black hover:text-sky-500 transition-colors">
              <Share2 size={16} /> Original Post
            </a>
          )}
        </div>

        {/* Header Section */}
        <header className="mb-16 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-8">
            <span className="bg-black text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(14,165,233,1)]">
              {tagsList[0] || "Blog"}
            </span>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500">
              <User size={14} className="text-sky-500" /> {blog.user?.name || "Author"}
            </div>
            <span className="w-1 h-1 bg-black rounded-full hidden md:block"></span>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500">
              <Clock size={14} className="text-sky-500" /> {blog.reading_time_minutes} Min Read
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-8">
            {blog.title}
          </h1>
          
          <p className="text-xl md:text-2xl font-bold text-slate-500 leading-snug">
             {blog.description}
          </p>
        </header>

        {/* Hero Image */}
        <div className="w-full h-[300px] md:h-[500px] border-[4px] border-black mb-16 shadow-[15px_15px_0px_0px_rgba(14,165,233,1)] relative overflow-hidden group bg-neutral-900 flex items-center justify-center">
          <img src={blog.cover_image || fallbackImage} alt={blog.title} className="w-full h-full object-contain group-hover:scale-105 transition-all duration-700" />
        </div>

        {/* Article Body using Dangerously Set Inner HTML */}
        <article className="prose prose-lg max-w-none text-slate-800 space-y-8 prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-a:text-sky-600 prose-a:font-bold prose-img:border-[4px] prose-img:border-black prose-img:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] prose-pre:border-[3px] prose-pre:border-black prose-pre:rounded-none prose-blockquote:border-l-8 prose-blockquote:border-black prose-blockquote:bg-slate-50 prose-blockquote:p-6 prose-blockquote:font-medium prose-blockquote:not-italic">
          
          <div 
            dangerouslySetInnerHTML={{ __html: blog.body_html }}
          />

        </article>

        <section className="bg-sky-500 text-black p-8 md:p-12 border-[4px] border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] text-center mt-24">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-4 leading-none">
              Stay Ahead of the Curve
            </h2>
            <p className="text-lg font-bold mb-8">Subscribe to get the latest engineering and tech insights sent directly to you.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input 
                type="email" 
                placeholder="YOUR EMAIL" 
                className="bg-white border-[3px] border-black py-4 px-6 w-full sm:w-80 font-black uppercase text-xs focus:outline-none focus:border-sky-700 placeholder:text-slate-400"
              />
              <button className="bg-black text-white px-10 py-4 font-black uppercase tracking-widest text-sm hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                 Subscribe
              </button>
            </div>
        </section>

      </div>
    </div>
  );
}
