import { redirect } from 'next/navigation';
import { getEmployerData, getEmployerJobs } from '../../../../lib/actions/employer';
import ManageJobsClient from './ManageJobsClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Manage Jobs | HIRRD',
  description: 'View and manage your published job listings.',
};

export default async function ManageJobsPage() {
  const employerData = await getEmployerData();

  if (!employerData.user) {
    redirect('/login');
  }

  if (employerData.user.role !== 'employer') {
    redirect('/dashboard/student');
  }

  const jobs = await getEmployerJobs();

  return <ManageJobsClient jobs={jobs} />;
}
