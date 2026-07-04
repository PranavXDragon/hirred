import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-sky-500 transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8">Terms of Service</h1>
        
        <div className="space-y-8 text-slate-600 font-medium leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-black uppercase tracking-widest mb-4 border-b-2 border-black pb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the hirrd platform, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black uppercase tracking-widest mb-4 border-b-2 border-black pb-2">2. Description of Service</h2>
            <p>
              hirrd provides a modern job portal and talent matching platform connecting elite candidates with forward-thinking companies. The service includes job listings, company profiles, mentorship booking, and resume building tools.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black uppercase tracking-widest mb-4 border-b-2 border-black pb-2">3. User Conduct</h2>
            <p className="mb-4">You agree not to use the platform to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Upload or transmit any content that is unlawful, harmful, or abusive.</li>
              <li>Impersonate any person or entity or falsely state your affiliation.</li>
              <li>Provide false, inaccurate, or misleading information in your profile or job listings.</li>
              <li>Attempt to gain unauthorized access to our systems or other users' accounts.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black uppercase tracking-widest mb-4 border-b-2 border-black pb-2">4. Employer Obligations</h2>
            <p>
              Employers must provide accurate representations of job openings and comply with all applicable labor and employment laws. hirrd reserves the right to remove job postings that violate our community standards or are deemed deceptive.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black uppercase tracking-widest mb-4 border-b-2 border-black pb-2">5. Modifications to Service</h2>
            <p>
              hirrd reserves the right at any time and from time to time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black uppercase tracking-widest mb-4 border-b-2 border-black pb-2">6. Contact Us</h2>
            <p>
              For questions regarding these Terms, please contact us at <a href="mailto:legal@hirrd.com" className="text-sky-500 hover:underline font-bold">legal@hirrd.com</a>.
            </p>
          </section>

          <div className="pt-8 text-xs font-bold uppercase tracking-widest text-slate-400">
            Last Updated: July 2, 2026
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
