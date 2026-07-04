import JobsClient from './JobsClient';
import { getJobs } from '../../lib/actions/jobs';

export const metadata = {
  title: 'Jobs | hirrd',
  description: 'Search the open protocols and find your technical edge.',
};

export const revalidate = 0; // Disable caching for live data feed

export default async function JobsPage() {
  const initialJobs = await getJobs();
  return <JobsClient initialJobs={initialJobs} />;
}
