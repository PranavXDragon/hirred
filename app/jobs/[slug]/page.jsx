import JobsClient from '../JobsClient';
import { getJobs } from '../../../lib/actions/jobs';

export const metadata = {
  title: 'Job Details | hirrd',
  description: 'Search the open protocols and find your technical edge.',
};

export const revalidate = 0; // Disable caching for live data feed

export default async function JobSlugPage({ params }) {
  const { slug } = await params;
  const initialJobs = await getJobs();
  
  return <JobsClient initialJobs={initialJobs} initialSlug={slug} />;
}
