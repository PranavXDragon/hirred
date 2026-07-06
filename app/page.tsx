import LandingPage from '../components/home/LandingPage';
import { getJobs } from '../lib/actions/jobs';

export const revalidate = 0; // Disable caching so live jobs are fresh

export default async function Page() {
  const liveJobs = await getJobs();
  return <LandingPage liveJobs={liveJobs} />;
}
