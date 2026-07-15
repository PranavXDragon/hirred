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

export async function bookMentorSession(mentorId, dateStr, timeStr, location = 'meet') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Unauthorized. Please log in.");

  // For this mock, generate a dummy meet link or native session link
  const sessionId = Math.random().toString(36).substring(2, 10);
  const meetLink = location === 'native' 
    ? `/mentorship/session/${sessionId}` 
    : `meet.google.com/${sessionId.substring(0, 3)}-${sessionId.substring(3, 7)}`;
  
  // Combine date and time into a timestamp (mock parsing for this demo)
  const bookingDate = new Date(`${dateStr} ${timeStr}`).toISOString();

  // If this is a mock mentor, skip DB insertion to avoid UUID/foreign key errors
  if (mentorId.startsWith('dummy-')) {
    revalidatePath('/mentorship');
    return { success: true, meetLink };
  }

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

export async function getMentorStats(mentorId) {
  const supabase = await createClient();
  const { count: totalBookings } = await supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('mentor_id', mentorId);
  const { count: pendingBookings } = await supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('mentor_id', mentorId).eq('status', 'pending');
  
  const { data: mentor } = await supabase.from('mentors').select('rating, rate').eq('id', mentorId).maybeSingle();

  return {
    totalSessions: totalBookings || 0,
    pendingRequests: pendingBookings || 0,
    rating: mentor?.rating || 5.0,
    rate: mentor?.rate || 0
  };
}

export async function getMentorBookings(mentorId) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      student:profiles!student_id(full_name, email)
    `)
    .eq('mentor_id', mentorId)
    .order('booking_date', { ascending: true });

  if (error) {
    console.error('Error fetching mentor bookings:', error);
    return [];
  }
  return data;
}

export async function updateBookingStatus(bookingId, status, meetLink = null) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const updateData = { status };
  if (meetLink) updateData.meet_link = meetLink;

  const { error } = await supabase
    .from('bookings')
    .update(updateData)
    .eq('id', bookingId)
    .eq('mentor_id', user.id); // Security check

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/mentor');
  return true;
}

export async function getMentorProfile(mentorId) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('mentors')
    .select('*')
    .eq('id', mentorId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateMentorProfile(profileData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('mentors')
    .upsert({
      id: user.id,
      ...profileData,
    });

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/mentor');
  revalidatePath('/mentorship');
  return true;
}

export async function getMentorChats(mentorId) {
  const supabase = await createClient();
  // Fetch messages where mentor is sender or receiver
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:profiles!sender_id(full_name, email)
    `)
    .or(`sender_id.eq.${mentorId},receiver_id.eq.${mentorId}`)
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function sendMessage(receiverId, content) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('messages')
    .insert([{
      sender_id: user.id,
      receiver_id: receiverId,
      content: content
    }]);

  if (error) throw new Error(error.message);
  return true;
}
