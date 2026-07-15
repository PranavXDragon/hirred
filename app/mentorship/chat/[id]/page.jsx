import React from 'react';
import ChatClient from './ChatClient';
import { createClient } from '../../../../lib/supabase/server';
import { redirect } from 'next/navigation';
import { getMentors } from '../../../../lib/actions/mentors';

export default async function MentorshipChatPage({ params }) {
  const { id: mentorId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Find mentor
  const mentors = await getMentors();
  const mentor = mentors.find(m => m.id === mentorId);

  if (!mentor) {
    redirect('/mentorship'); // Mentor not found
  }

  return <ChatClient initialUser={profile || user} mentor={mentor} />;
}
