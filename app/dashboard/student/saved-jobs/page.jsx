import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getSavedJobs } from '../../../../lib/actions/student'
import SavedJobsClient from './SavedJobsClient'

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Saved Jobs | HIRRD',
  description: 'View your bookmarked jobs and saved search alerts.',
}

export default async function SavedJobsPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (profile?.role !== 'student') {
    if (profile?.role === 'employer') redirect('/dashboard/employer')
    if (profile?.role === 'admin') redirect('/dashboard/admin')
    redirect('/login')
  }

  const savedJobs = await getSavedJobs()

  return <SavedJobsClient savedJobs={savedJobs} />
}
