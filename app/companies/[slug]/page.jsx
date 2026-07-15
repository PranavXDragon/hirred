import { getCompanyBySlug } from '../../../lib/actions/companies';
import { notFound } from 'next/navigation';
import CompanyProfileClient from './CompanyProfileClient';

export const revalidate = 0;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);
  if (!company) return { title: 'Company Not Found' };
  
  return {
    title: `${company.name} | hirrd`,
    description: `Explore open jobs, culture, and perks at ${company.name} on hirrd.`,
  };
}

export default async function CompanyProfilePage({ params }) {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);

  if (!company) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen">
      <CompanyProfileClient company={company} />
    </div>
  );
}
