import { redirect } from 'next/navigation';
import { getEmployerData, getEmployerJobApplicants } from '../../../../../lib/actions/employer';
import JobApplicantsClient from './JobApplicantsClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Job Applicants | HIRRD',
  description: 'Review applicants for your job listing.',
};

export default async function JobApplicantsPage({ params }) {
  const employerData = await getEmployerData();

  if (!employerData.user) {
    redirect('/login');
  }

  if (employerData.user.role !== 'employer') {
    redirect('/dashboard/student');
  }

  const { jobId } = await params;
  const data = await getEmployerJobApplicants(jobId);

  if (!data.job) {
    redirect('/dashboard/employer/manage-jobs');
  }

  return <JobApplicantsClient job={data.job} applications={data.applications} />;
}
