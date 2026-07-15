import React from 'react';
import { 
  BarChart3, 
  ArrowRight, 
  Target, 
  Zap, 
  TrendingUp, 
  Globe, 
  Database,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

// Fetch daily tech/career articles from Dev.to API
async function getCaseStudies() {
  try {
    const res = await fetch('https://dev.to/api/articles?tag=career&top=30&per_page=4', {
      next: { revalidate: 86400 } // Revalidate every 24 hours
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Error fetching case studies:", error);
    return [];
  }
}

export default async function CaseStudiesPage() {
  const articles = await getCaseStudies();

  return (
    <div className="bg-white pt-20 relative min-h-screen">
      
      {/* --- Background Square Grid --- */}
      <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none" 
           style={{ 
             backgroundImage: `linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)`, 
             backgroundSize: '40px 40px' 
           }}>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* --- Header: High-Impact Typography --- */}
        <header className="py-16 md:py-28 border-b-4 border-black mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-black text-sky-500 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(14,165,233,1)]">
              <BarChart3 size={24} />
            </div>
            <span className="font-black uppercase tracking-[0.4em] text-[10px] md:text-xs text-slate-400">Execution Archives (Live Feed)</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase leading-[0.85]">
            Proven <br />
            <span className="text-sky-500 italic">Results.</span>
          </h1>
        </header>

        {/* --- Stats Banner: Neubrutalist Metrics --- */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-24">
          {[
            { label: "Success Rate", val: "98%", icon: <CheckCircle2 className="text-sky-500" /> },
            { label: "Global Clients", val: "50+", icon: <Globe className="text-sky-500" /> },
            { label: "Data Points", val: "1M+", icon: <Database className="text-sky-500" /> },
            { label: "ROI Average", val: "3.5x", icon: <TrendingUp className="text-sky-500" /> }
          ].map((stat, i) => (
            <div key={i} className="border-[3px] border-black p-6 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(14,165,233,1)] transition-all">
              <div className="mb-2">{stat.icon}</div>
              <h3 className="text-3xl font-black italic">{stat.val}</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* --- Case Studies List --- */}
        <section className="space-y-16 mb-24">
          {articles.length === 0 && (
            <div className="text-center font-black uppercase tracking-widest text-slate-400 py-12">
              Loading latest global case studies...
            </div>
          )}
          
          {articles.map((item, index) => {
            const fallbackImage = `https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800&random=${index}`;
            const tagsList = item.tag_list || ["Startup", "Tech", "Business"];
            
            return (
              <div 
                key={item.id}
                className={`flex flex-col ${index % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} border-[4px] border-black bg-white group hover:shadow-[20px_20px_0px_0px_rgba(14,165,233,1)] transition-all duration-500`}
              >
                {/* Image Side */}
                <div className="w-full lg:w-1/2 h-[250px] sm:h-[350px] lg:h-[450px] overflow-hidden relative border-b-4 lg:border-b-0 lg:border-r-4 border-black bg-neutral-900 flex items-center justify-center">
                  <img src={item.cover_image || fallbackImage} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute top-6 left-6 bg-sky-500 text-black px-4 py-2 font-black italic text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    {item.public_reactions_count} Engagements
                  </div>
                </div>

                {/* Content Side */}
                <div className="w-full lg:w-1/2 p-8 md:p-14 flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="text-sky-600 font-black text-xs uppercase tracking-[0.2em]">{item.user?.name || "hirrd Network"}</span>
                    <span className="w-1 h-1 bg-black rounded-full"></span>
                    <span className="font-black text-xs uppercase tracking-[0.2em]">{new Date(item.published_at).toLocaleDateString()}</span>
                  </div>
                  
                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-8 group-hover:text-sky-500 transition-colors">
                    {item.title}
                  </h2>

                  <div className="flex flex-wrap gap-2 mb-10">
                    {tagsList.slice(0, 4).map(tag => (
                      <span key={tag} className="border-2 border-black px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-slate-50">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link href={`/insights/case-studies/${item.id}`} className="flex items-center gap-4 bg-black text-white px-10 py-5 font-black uppercase text-xs tracking-[0.3em] hover:bg-sky-500 transition-all w-fit shadow-[6px_6px_0px_0px_rgba(14,165,233,0.3)]">
                    View Full Protocol <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            );
          })}
        </section>

        {/* --- Strategic CTA Section --- */}
        <section className="py-20 mb-24 relative">
          <div className="bg-sky-500 border-[4px] border-black p-10 md:p-20 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center hover:-translate-y-2 hover:shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
             <Target size={60} className="mb-8 text-black" />
             <h2 className="text-4xl md:text-7xl font-black text-black tracking-tighter uppercase mb-8 leading-none">
               Want to See <br /> These Numbers <br /> For Your Business?
             </h2>
             <p className="text-black font-bold text-lg max-w-2xl mb-12">
               Let's run a technical audit on your current infrastructure and marketing operations to find the growth gaps.
             </p>
             <div className="flex flex-col sm:flex-row gap-6">
                 <Link href="/contact" className="bg-black text-white px-12 py-5 font-black uppercase tracking-widest text-sm hover:translate-x-1 hover:-translate-y-1 transition-transform shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] inline-block">
                    Schedule Audit
                 </Link>
             </div>
          </div>
        </section>

      </div>
    </div>
  );
}
