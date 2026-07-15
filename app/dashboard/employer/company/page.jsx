import { redirect } from 'next/navigation';
import { getEmployerData } from '../../../../lib/actions/employer';
import CompanyProfileForm from '../../../../components/dashboard/employer/CompanyProfileForm';
import Link from 'next/link';
import { ArrowLeft, Building } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Organization Profile | HIRRD',
  description: 'Manage your company profile and culture settings.',
};

export default async function CompanyPage() {
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
              <Building size={20} className="text-sky-500" />
              <h1 className="text-4xl font-black uppercase tracking-tight leading-none">
                Organization <span className="text-sky-500 italic">Profile.</span>
              </h1>
            </div>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
              Configure your company details, culture metrics, and perks.
            </p>
          </div>
        </div>

        <CompanyProfileForm initialData={employerData.company} />
      </div>
    </div>
  );
}
