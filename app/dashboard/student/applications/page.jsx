import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getStudentApplications } from '../../../../lib/actions/student'
import ApplicationsClient from './ApplicationsClient'

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'My Applications | HIRRD',
  description: 'Track all your job applications in one place.',
}

export default async function ApplicationsPage() {
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

  const applications = await getStudentApplications()

  return <ApplicationsClient applications={applications} />
}
