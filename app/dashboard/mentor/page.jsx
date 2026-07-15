import { redirect } from 'next/navigation';
import { createClient } from '../../../lib/supabase/server';
import { getMentorStats, getMentorBookings } from '../../../lib/actions/mentors';
import MentorDashboardClient from './MentorDashboardClient';

export const metadata = {
  title: 'Mentor HQ | hirrd',
  description: 'Manage your mentorship sessions and profile.',
};

export default async function MentorDashboardPage() {
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

  if (profile?.role !== 'mentor') {
    if (profile?.role === 'employer') redirect('/dashboard/employer');
    if (profile?.role === 'student') redirect('/dashboard/student');
    if (profile?.role === 'admin') redirect('/dashboard/admin');
    redirect('/login'); // Fallback
  }

  const [stats, bookings] = await Promise.all([
    getMentorStats(user.id),
    getMentorBookings(user.id)
  ]);

  return (
    <MentorDashboardClient 
      user={user} 
      initialStats={stats} 
      initialBookings={bookings} 
    />
  );
}
