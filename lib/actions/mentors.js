"use server";

import { createClient } from '../supabase/server';
import { revalidatePath } from 'next/cache';

export async function getMentors() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('mentors')
    .select(`
      *,
      profile:profiles(full_name)
    `)
    .order('rating', { ascending: false });

  if (error) {
    console.error('Error fetching mentors:', error);
    return [];
  }

  const mappedData = data.map(mentor => ({
    id: mentor.id,
    name: mentor.profile?.full_name || 'Unknown Mentor',
    role: mentor.role,
    company: mentor.company,
    location: mentor.location,
    rating: mentor.rating,
    rate: `₹${mentor.rate}`,
    expertise: mentor.expertise || [],
    domain: mentor.domain
  }));

  const dummyMentors = [
    {
      id: 'dummy-1',
      name: 'Sarah Chen',
      role: 'Staff Engineer',
      company: 'Google',
      location: 'San Francisco, CA',
      rating: 4.9,
      rate: '₹4000',
      expertise: ['System Design', 'React', 'Node.js'],
      domain: 'Frontend'
    },
    {
      id: 'dummy-2',
      name: 'Rahul Sharma',
      role: 'Senior Backend Engineer',
      company: 'Amazon',
      location: 'Bengaluru, KA',
      rating: 4.8,
      rate: '₹3500',
      expertise: ['AWS', 'Microservices', 'Java'],
      domain: 'Backend'
    },
    {
      id: 'dummy-3',
      name: 'Priya Patel',
      role: 'Engineering Manager',
      company: 'Netflix',
      location: 'Remote',
      rating: 5.0,
      rate: '₹5000',
      expertise: ['Career Advice', 'Leadership', 'System Design'],
      domain: 'Career Advice'
    },
    {
      id: 'dummy-4',
      name: 'David Kim',
      role: 'DevOps Lead',
      company: 'Microsoft',
      location: 'Seattle, WA',
      rating: 4.7,
      rate: '₹3000',
      expertise: ['Kubernetes', 'CI/CD', 'Azure'],
      domain: 'DevOps'
    },
    {
      id: 'dummy-5',
      name: 'Elena Rodriguez',
      role: 'AI Researcher',
      company: 'OpenAI',
      location: 'San Francisco, CA',
      rating: 4.9,
      rate: '₹6000',
      expertise: ['Machine Learning', 'Python', 'PyTorch'],
      domain: 'AI/ML'
    },
    {
      id: 'dummy-6',
      name: 'Alex Johnson',
      role: 'Security Architect',
      company: 'CrowdStrike',
      location: 'Austin, TX',
      rating: 4.9,
      rate: '₹4500',
      expertise: ['Penetration Testing', 'Cloud Security', 'Cryptography'],
      domain: 'Cyber Security'
    }
  ];

  return [...mappedData, ...dummyMentors];
}

export async function bookMentorSession(mentorId, dateStr, timeStr) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Unauthorized. Please log in.");

  // For this mock, just generate a dummy meet link and save it
  const meetLink = `meet.google.com/${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}`;
  
  // Combine date and time into a timestamp (mock parsing for this demo)
  const bookingDate = new Date(`${dateStr} ${timeStr}`).toISOString();

  const { error } = await supabase
    .from('bookings')
    .insert([{
      mentor_id: mentorId,
      student_id: user.id,
      booking_date: bookingDate,
      status: 'confirmed',
      meet_link: meetLink
    }]);

  if (error) {
    console.error("Booking error:", error);
    return { error: error.message };
  }

  revalidatePath('/mentorship');
  return { success: true, meetLink };
}
