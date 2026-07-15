'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Runtime error caught:', error);
  }, [error]);

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
          <div className="w-28 h-28 bg-rose-500 border-[4px] border-black flex items-center justify-center shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] mx-auto -rotate-3 hover:rotate-0 transition-transform">
            <span className="text-6xl font-black text-white">500</span>
          </div>
        </div>

        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
          System <span className="text-rose-500 italic">Fault.</span>
        </h1>

        <p className="text-slate-400 text-xs font-black uppercase tracking-widest max-w-lg mx-auto mb-4 leading-relaxed">
          A critical error occurred while processing your request. Our engineering team has been notified.
        </p>

        <div className="w-16 h-1 bg-black mx-auto mb-10" />

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-black text-white border-2 border-black px-8 py-4 font-black uppercase tracking-widest text-xs hover:bg-emerald-500 hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(16,185,129,1)] active:translate-y-1 active:shadow-none cursor-pointer"
          >
            Retry Operation
          </button>
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-white text-black border-2 border-black px-8 py-4 font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
          >
            Return to Base
          </a>
        </div>

        <div className="mt-16 border-t-2 border-slate-200 pt-8">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
            Error Code: ERR_SYSTEM_FAULT · Digest: {error.digest || 'N/A'} · If this persists, contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
