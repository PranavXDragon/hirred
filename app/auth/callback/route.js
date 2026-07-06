import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  // Read role from cookie instead of query parameter
  const cookieStore = await cookies();
  const oauthRoleCookie = cookieStore.get('oauth_role');
  const roleOverride = oauthRoleCookie ? oauthRoleCookie.value : null;

  if (code) {
    const supabase = await createClient();
    
    // Exchange the code for a session
    const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && sessionData?.session?.user) {
      const user = sessionData.session.user;
      
      // Check if user already has a role (meaning they are an existing user)
      const existingRole = user.user_metadata?.role;
      let finalRole = existingRole;

      if (finalRole === 'employee') finalRole = 'student'; // Handle legacy users

      // ONLY apply the role override if this is a brand new user
      if (!existingRole) {
        finalRole = (roleOverride === 'employee' ? 'student' : roleOverride) || 'student';
        // Update auth metadata
        await supabase.auth.updateUser({ data: { role: finalRole } });
        // Update public profiles table
        await supabase.from('profiles').update({ role: finalRole }).eq('id', user.id);
      }
      
      // If an existing Student accidentally clicks "Employer Sign In", 
      // we ignore the cookie and gracefully route them to their correct Student dashboard!
      const actualNext = requestUrl.searchParams.get('next') ?? `/dashboard/${finalRole}`;
      
      const response = NextResponse.redirect(new URL(actualNext, request.url));
      response.cookies.set('oauth_role', '', { maxAge: 0 }); // Clear the cookie
      return response;
    } else {
      console.error('Callback error:', error);
    }
  }

  // Return the user to an error page with some instructions
  return NextResponse.redirect(new URL('/login?error=OAuth failed', request.url));
}
