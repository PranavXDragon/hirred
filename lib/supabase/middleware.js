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
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Fetch the current user session
  const { data: { user } } = await supabase.auth.getUser()

  // Route Protection Logic
  const pathname = request.nextUrl.pathname
  
  // Protect /dashboard routes
  if (pathname.startsWith('/dashboard') && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    return NextResponse.redirect(loginUrl)
  }

  // Prevent logged-in users from seeing login/register pages
  if ((pathname.startsWith('/login') || pathname.startsWith('/register')) && user) {
    const role = user.user_metadata?.role || 'student'
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = `/dashboard/${role}`
    return NextResponse.redirect(dashboardUrl)
  }

  return supabaseResponse
}
