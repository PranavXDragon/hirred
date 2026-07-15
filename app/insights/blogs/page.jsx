import React from 'react';
import { ArrowUpRight, Clock, User, ChevronRight, Zap } from 'lucide-react';
import Link from 'next/link';

// Fetch daily programming/tech articles from Dev.to API
async function getBlogs() {
  try {
    const res = await fetch('https://dev.to/api/articles?tag=programming&top=7&per_page=10', {
      next: { revalidate: 86400 } // Revalidate every 24 hours
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export default async function BlogPage() {
  const articles = await getBlogs();
  const featured = articles[0];
  const gridBlogs = articles.slice(1);

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
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-sky-500 flex items-center justify-center text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Zap size={20} fill="currentColor" />
            </div>
            <span className="font-black uppercase tracking-[0.3em] text-xs">Insights & Intelligence</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9]">
            The <span className="text-sky-500 italic">Labelz</span> <br /> Journal.
          </h1>
        </header>

        {/* --- Featured Post (Hero Blog) --- */}
        {featured && (
          <section className="mb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 border-[4px] border-black bg-white shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[20px_20px_0px_0px_rgba(14,165,233,1)] transition-all duration-300 group">
              <div className="h-[300px] lg:h-[500px] overflow-hidden border-b-4 lg:border-b-0 lg:border-r-4 border-black bg-neutral-900 flex items-center justify-center relative">
                <img 
                  src={featured.cover_image || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200"} 
                  alt={featured.title} 
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <span className="bg-black text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest self-start mb-6">
                  Featured Article
                </span>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-6 group-hover:text-sky-600 transition-colors">
                  {featured.title}
                </h2>
                <p className="text-slate-600 font-bold mb-8 text-lg">
                  {featured.description}
                </p>
                <div className="flex flex-wrap items-center gap-6 mb-8 text-xs font-black uppercase tracking-widest text-slate-400">
                  <span className="flex items-center gap-2"><User size={14}/> {featured.user?.name || "hirrd Network"}</span>
                  <span className="flex items-center gap-2"><Clock size={14}/> {new Date(featured.published_at).toLocaleDateString()}</span>
                </div>
                <Link href={`/insights/blogs/${featured.slug}-${featured.id}`} className="flex items-center gap-2 bg-sky-500 text-black px-8 py-4 font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-all w-fit shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  Read Full Entry <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* --- Blog Grid --- */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-24">
          {gridBlogs.map((blog, index) => {
             const fallbackImage = `https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800&random=${index}`;
             const tagsList = blog.tag_list || ["Tech", "Engineering"];

             return (
              <Link href={`/insights/blogs/${blog.slug}-${blog.id}`} key={blog.id} className="group flex flex-col border-[3px] border-black bg-white hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(14,165,233,1)] transition-all cursor-pointer">
                <div className="h-56 overflow-hidden border-b-[3px] border-black relative bg-neutral-900 flex items-center justify-center">
                  <img src={blog.cover_image || fallbackImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-white border-2 border-black px-3 py-1 text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    {tagsList[0] || "Blog"}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>{new Date(blog.published_at).toLocaleDateString()}</span>
                    <span className="w-1 h-1 bg-sky-500 rounded-full"></span>
                    <span>{blog.public_reactions_count} Reactions</span>
                  </div>
                  
                  <h3 className="text-xl font-black uppercase tracking-tighter leading-tight mb-4 group-hover:text-sky-600 transition-colors line-clamp-3">
                    {blog.title}
                  </h3>
                  
                  <p className="text-slate-600 font-bold text-sm mb-6 flex-grow line-clamp-3">
                    {blog.description}
                  </p>

                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[70%]">By {blog.user?.name || "Author"}</span>
                    <div className="w-10 h-10 border-2 border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none">
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </section>

        {/* --- Newsletter / Footer CTA --- */}
        <section className="py-20 border-t-4 border-black mb-24">
          <div className="bg-black text-white p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-xl">
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Subscribe to Intel.</h2>
              <p className="text-slate-400 font-bold tracking-tight">Weekly deep-dives into AI, tech stacks, and high-performance engineering.</p>
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
}
