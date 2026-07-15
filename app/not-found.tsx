import Link from 'next/link';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '404 — Node Not Found | HIRRD',
};

export default function NotFound() {
  return (
    <div className="bg-white min-h-screen pt-28 pb-20 relative overflow-hidden flex items-center">
      <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none"
           style={{
             backgroundImage: `linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)`,
             backgroundSize: '40px 40px'
           }}>
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <div className="inline-block mb-8">
          <div className="w-28 h-28 bg-rose-500 border-[4px] border-black flex items-center justify-center shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] mx-auto rotate-3 hover:rotate-0 transition-transform">
            <span className="text-6xl font-black text-white">404</span>
          </div>
        </div>

        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
          Node Not <span className="text-rose-500 italic">Found.</span>
        </h1>

        <p className="text-slate-400 text-xs font-black uppercase tracking-widest max-w-lg mx-auto mb-4 leading-relaxed">
          The page you are looking for has been disconnected from the network. It may have been moved, deleted, or never existed.
        </p>

        <div className="w-16 h-1 bg-black mx-auto mb-10" />

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-black text-white border-2 border-black px-8 py-4 font-black uppercase tracking-widest text-xs hover:bg-sky-500 hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(14,165,233,1)] active:translate-y-1 active:shadow-none"
          >
            Return to Base
          </Link>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 bg-white text-black border-2 border-black px-8 py-4 font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
          >
            Browse Careers
          </Link>
        </div>

        <div className="mt-16 border-t-2 border-slate-200 pt-8">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
            Error Code: ERR_NODE_NOT_FOUND · If you believe this is a system fault, contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
