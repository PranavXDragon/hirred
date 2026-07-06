'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function login(formData) {
  const supabase = await createClient()

  const data = {
    email: formData.email,
    password: formData.password,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  // Determine user role and redirect to correct dashboard
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    let role = user.user_metadata?.role || 'student'
    if (role === 'employee') role = 'student' // Legacy fallback
    redirect(`/dashboard/${role}`)
  }
}

export async function register(formData) {
  const supabase = await createClient()
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = headersList.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https')
  const origin = `${protocol}://${host}`

  const data = {
    email: formData.email,
    password: formData.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: formData.full_name,
        role: formData.role || 'student', // student or employer
      }
    }
  }

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from('profiles')
    .select('email')
    .eq('email', formData.email)
    .maybeSingle()

  if (existingUser) {
    return { error: 'An account with this email already exists. Please log in.' }
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    let errorMessage = error.message;
    if (typeof errorMessage === 'object' || !errorMessage || errorMessage === '{}') {
      errorMessage = error.error_description || error.name || 'Registration failed. Please check your credentials or try again later.';
    }
    return { error: errorMessage }
  }

  redirect('/login?registered=true')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function resetPassword(email) {
  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/auth/callback?next=/dashboard/settings/password-reset`,
  })
  
  if (error) {
    return { error: error.message }
  }
  return { success: true }
}
