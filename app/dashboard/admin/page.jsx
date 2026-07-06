import { redirect } from 'next/navigation';
import { getAdminStats, getAllUsers } from '../../../lib/actions/admin';
import AdminDashboardClient from './AdminDashboardClient';
import { createClient } from '../../../lib/supabase/server';

export const metadata = {
  title: 'Global Admin Override | hirrd',
  description: 'System control center for hirrd platform administrators.',
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  // Verify Role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (profile?.role !== 'admin') {
    if (profile?.role === 'employer') redirect('/dashboard/employer');
    if (profile?.role === 'student') redirect('/dashboard/student');
    redirect('/login'); // Fallback
  }

  const [stats, users] = await Promise.all([
    getAdminStats(),
    getAllUsers()
  ]);

  return (
    <AdminDashboardClient 
      user={user} 
      initialStats={stats} 
      initialUsers={users} 
    />
  );
}
