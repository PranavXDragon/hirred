import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const roleOverride = requestUrl.searchParams.get('role');

  if (code) {
    const supabase = await createClient();
    
    // Exchange the code for a session
    const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && sessionData?.session?.user) {
      const user = sessionData.session.user;
      let role = user.user_metadata?.role || 'student';
      if (role === 'employee') role = 'student'; // Handle legacy users

      if (roleOverride && roleOverride !== role) {
        role = roleOverride === 'employee' ? 'student' : roleOverride;
        // Update auth metadata
        await supabase.auth.updateUser({ data: { role } });
        // Update public profiles table
        await supabase.from('profiles').update({ role }).eq('id', user.id);
      }
      
      // If no specific 'next' param was provided, route them based on their role
      const actualNext = requestUrl.searchParams.get('next') ?? `/dashboard/${role}`;
      
      return NextResponse.redirect(new URL(actualNext, request.url));
    } else {
      console.error('Callback error:', error);
    }
  }

  // Return the user to an error page with some instructions
  return NextResponse.redirect(new URL('/login?error=OAuth failed', request.url));
}
