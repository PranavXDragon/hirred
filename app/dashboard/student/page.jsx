import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import StudentDashboardClient from './StudentDashboardClient'
import { getStudentApplications, getSavedJobs } from '../../../lib/actions/student'
import { getJobs } from '../../../lib/actions/jobs'

export default async function StudentDashboard() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch the user's profile from the public.profiles table
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (error) {
    console.error("Profile fetch error:", error);
  }

  const liveApplications = await getStudentApplications();
  const liveBookmarks = await getSavedJobs();
  const liveJobs = await getJobs();

  // If profile was deleted (e.g. from table resets), pass a default object so the UI still works
  const initialUser = profile || { id: user.id, role: 'student', full_name: user.email?.split('@')[0] || 'User' };

  return <StudentDashboardClient initialUser={initialUser} liveApplications={liveApplications} liveBookmarks={liveBookmarks} liveJobs={liveJobs} />
}
