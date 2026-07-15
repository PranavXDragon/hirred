import { redirect } from 'next/navigation';
import { getEmployerData } from '../../../../lib/actions/employer';
import PostJobForm from '../../../../components/dashboard/employer/PostJobForm';
import Link from 'next/link';
import { ArrowLeft, Rocket } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Post a Job | HIRRD',
  description: 'Create and publish a new job listing.',
};

export default async function PostJobPage() {
  const employerData = await getEmployerData();

  if (!employerData.user) {
    redirect('/login');
  }

  if (employerData.user.role !== 'employer') {
    redirect('/dashboard/student');
  }

  return (
    <div className="bg-white min-h-screen pt-28 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ 
             backgroundImage: `linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)`, 
             backgroundSize: '40px 40px' 
           }}>
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="flex items-center gap-4 mb-8 border-b-4 border-black pb-6">
          <Link href="/dashboard/employer" className="p-2 border-2 border-black hover:bg-slate-50 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Rocket size={20} className="text-rose-500" />
              <h1 className="text-4xl font-black uppercase tracking-tight leading-none">
                Transmit <span className="text-rose-500 italic">Job.</span>
              </h1>
            </div>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
              Publish a new open role to the global talent network.
            </p>
          </div>
        </div>

        {!employerData.company ? (
          <div className="bg-rose-50 border-[4px] border-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-xl font-black uppercase tracking-tighter text-rose-600 mb-3">Configuration Required</h3>
            <p className="text-xs font-black uppercase tracking-widest text-slate-700 mb-6">
              You must configure your Organization Profile before transmitting job protocols.
            </p>
            <Link
              href="/dashboard/employer/company"
              className="inline-block bg-black text-white px-8 py-4 font-black uppercase text-xs tracking-widest border-2 border-black hover:bg-sky-500 hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(14,165,233,1)] active:translate-y-1 active:shadow-none"
            >
              Configure Organization
            </Link>
          </div>
        ) : (
          <PostJobForm />
        )}
      </div>
    </div>
  );
}
