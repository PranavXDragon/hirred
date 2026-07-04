import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-sky-500 transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8">Privacy Policy</h1>
        
        <div className="space-y-8 text-slate-600 font-medium leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-black uppercase tracking-widest mb-4 border-b-2 border-black pb-2">1. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us, including your name, email address, phone number, resume data, and any other information you choose to provide when creating an account or building your profile.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black uppercase tracking-widest mb-4 border-b-2 border-black pb-2">2. How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our services.</li>
              <li>Match you with potential employers and job opportunities.</li>
              <li>Communicate with you about products, services, offers, and events.</li>
              <li>Monitor and analyze trends, usage, and activities.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black uppercase tracking-widest mb-4 border-b-2 border-black pb-2">3. Information Sharing</h2>
            <p>
              Your profile information may be shared with employers when you apply for a job or when you opt into our talent pool. We do not sell your personal data to third parties. We may share anonymized, aggregated data for analytical purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black uppercase tracking-widest mb-4 border-b-2 border-black pb-2">4. Data Security</h2>
            <p>
              We implement military-grade encryption and strict access controls to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black uppercase tracking-widest mb-4 border-b-2 border-black pb-2">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@hirrd.com" className="text-sky-500 hover:underline font-bold">privacy@hirrd.com</a>.
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

export default PrivacyPolicy;
