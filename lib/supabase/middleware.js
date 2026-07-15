import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            options.maxAge = 3600; // 1 hour session limit
            request.cookies.set(name, value)
          })
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            options.maxAge = 3600; // 1 hour session limit
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Fetch the current user session
  const { data: { user } } = await supabase.auth.getUser()

  // Route Protection Logic
  const pathname = request.nextUrl.pathname
  
  // Protect /dashboard routes (ensure user is logged in)
  if (pathname.startsWith('/dashboard') && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    return NextResponse.redirect(loginUrl)
  }

  // Get user role, default to student
  const role = user?.user_metadata?.role || 'student'

  // Strict RBAC: Prevent cross-dashboard access
  if (pathname.startsWith('/dashboard')) {
    // If employer tries to access student or admin dashboard
    if (role === 'employer' && !pathname.startsWith('/dashboard/employer') && !pathname.startsWith('/dashboard/settings')) {
      const employerUrl = request.nextUrl.clone()
      employerUrl.pathname = '/dashboard/employer'
      return NextResponse.redirect(employerUrl)
    }
    // If student tries to access employer or admin dashboard
    if (role === 'student' && !pathname.startsWith('/dashboard/student') && !pathname.startsWith('/dashboard/settings')) {
      const studentUrl = request.nextUrl.clone()
      studentUrl.pathname = '/dashboard/student'
      return NextResponse.redirect(studentUrl)
    }
    // If admin tries to access student or employer or mentor dashboard
    if (role === 'admin' && !pathname.startsWith('/dashboard/admin') && !pathname.startsWith('/dashboard/settings')) {
      const adminUrl = request.nextUrl.clone()
      adminUrl.pathname = '/dashboard/admin'
      return NextResponse.redirect(adminUrl)
    }
    // If mentor tries to access student, employer, or admin dashboard
    if (role === 'mentor' && !pathname.startsWith('/dashboard/mentor') && !pathname.startsWith('/dashboard/settings')) {
      const mentorUrl = request.nextUrl.clone()
      mentorUrl.pathname = '/dashboard/mentor'
      return NextResponse.redirect(mentorUrl)
    }
  }

  // Prevent logged-in users from seeing login/register pages
  if ((pathname.startsWith('/login') || pathname.startsWith('/register')) && user) {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = `/dashboard/${role}`
    return NextResponse.redirect(dashboardUrl)
  }

  return supabaseResponse
}
