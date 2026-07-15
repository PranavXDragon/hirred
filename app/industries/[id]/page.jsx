import { redirect } from 'next/navigation';
import IndustryClient from './IndustryClient';
import { getCompanies } from '../../../lib/actions/companies';
import { getJobs } from '../../../lib/actions/jobs';
import { getLiveNews } from '../../../lib/actions/news';

export const metadata = {
  title: 'Industry Hub | Hirrd.',
  description: 'Explore top companies and protocols in your industry.',
};

export const revalidate = 0; // Disable caching for live data feed

const industryMap = {
  'technology-it': {
    title: 'Technology & IT',
    desc: 'Architecting the future with elite talent in AI, Cloud, and Software Engineering for global tech giants.',
    stats: '12k+ Placements',
    iconName: 'Cpu'
  },
  'real-estate': {
    title: 'Real Estate',
    desc: 'Connecting visionary developers with experts in project management, sales, and urban planning.',
    stats: '450+ Projects',
    iconName: 'Building2'
  },
  'healthcare': {
    title: 'Healthcare',
    desc: 'Empowering medical institutions with verified professionals in specialized care and hospital management.',
    stats: '85+ Clinics',
    iconName: 'Stethoscope'
  },
  'fintech': {
    title: 'FinTech',
    desc: 'Bridging the gap in the financial sector with experts in risk management, trading, and digital banking.',
    stats: '30+ Partners',
    iconName: 'BarChart4'
  },
  'education': {
    title: 'Education',
    desc: 'Transforming the learning landscape by connecting institutions with innovative educators and trainers.',
    stats: '200+ Institutions',
    iconName: 'GraduationCap'
  }
};

export default async function IndustryPage({ params }) {
  const { id } = await params;
  
  const industryMeta = industryMap[id];
  
  if (!industryMeta) {
    redirect('/industries');
  }

  // Fetch all companies, jobs, and live news
  const [allCompanies, allJobs, liveNews] = await Promise.all([
    getCompanies(),
    getJobs(),
    getLiveNews(industryMeta.title)
  ]);

  // Filter companies with flexible matching
  const industryCompanies = allCompanies.filter(c => {
    const cInd = (c.industry || '').toLowerCase();
    const title = industryMeta.title.toLowerCase();
    
    // Exact match or contains
    if (cInd === title || title.includes(cInd) || cInd.includes(title)) return true;
    
    // Specific aliases
    if (id === 'technology-it' && ['it', 'tech', 'software', 'technology', 'saas', 'information technology'].includes(cInd)) return true;
    if (id === 'real-estate' && ['real estate', 'property', 'construction', 'architecture'].includes(cInd)) return true;
    if (id === 'healthcare' && ['health', 'medical', 'hospital', 'biotech', 'pharma'].includes(cInd)) return true;
    if (id === 'fintech' && ['finance', 'fintech', 'banking', 'crypto', 'blockchain'].includes(cInd)) return true;
    if (id === 'education' && ['edu', 'education', 'edtech', 'teaching', 'university'].includes(cInd)) return true;

    return false;
  });

  // Filter jobs whose company belongs to this industry
  const companyIds = industryCompanies.map(c => c.id);
  const industryJobs = allJobs.filter(j => {
    if (companyIds.includes(j.company_id)) return true;
    const jCat = (j.category || '').toLowerCase();
    const title = industryMeta.title.toLowerCase();
    return jCat === title || title.includes(jCat) || jCat.includes(title) || 
           (id === 'technology-it' && ['it', 'tech', 'software', 'technology', 'saas'].includes(jCat));
  });

  return (
    <IndustryClient 
      industryMeta={industryMeta} 
      companies={industryCompanies} 
      jobs={industryJobs}
      news={liveNews}
    />
  );
}
