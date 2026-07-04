import CompaniesClient from './CompaniesClient';
import { getCompanies } from '../../lib/actions/companies';

export const metadata = {
  title: 'Companies Directory | hirrd',
  description: 'Research top tech employers, compare culture ratings, and find your next engineering home.',
};

export const revalidate = 0; // Disable caching for live data feed

export default async function CompaniesPage() {
  const initialCompanies = await getCompanies();
  return <CompaniesClient initialCompanies={initialCompanies} />;
}
