import { redirect } from 'next/navigation';
import { getEmployerData, getEmployerApplications } from '../../../lib/actions/employer';
import EmployerDashboardClient from './EmployerDashboardClient';

export const metadata = {
  title: 'Employer Operations | Hirrd.',
  description: 'Manage your organization, post jobs, and review job seekers.',
};

export default async function EmployerDashboardPage() {
  const employerData = await getEmployerData();
  
  if (!employerData.user) {
    redirect('/login');
  }

  if (employerData.user.role !== 'employer') {
    // If a student tries to access the employer dashboard
    redirect('/dashboard/student');
  }

  const applications = await getEmployerApplications();

  return (
    <EmployerDashboardClient 
      initialData={employerData} 
      applications={applications} 
    />
  );
}
