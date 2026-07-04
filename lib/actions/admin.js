"use server";

import { createClient } from '../supabase/server';
import { revalidatePath } from 'next/cache';

// Helper to check admin role
async function checkAdminAccess(supabase) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (profile?.role !== 'admin') throw new Error("Access Denied: Admin clearance required.");
  return user;
}

export async function getAdminStats() {
  const supabase = await createClient();
  await checkAdminAccess(supabase);

  // Count Profiles (Users)
  const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  const { count: totalStudents } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student');
  const { count: totalEmployers } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'employer');
  const { count: totalAdmins } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'admin');

  // Count Jobs
  const { count: totalJobs } = await supabase.from('jobs').select('*', { count: 'exact', head: true });

  return {
    totalUsers: totalUsers || 0,
    students: totalStudents || 0,
    employers: totalEmployers || 0,
    admins: totalAdmins || 0,
    jobsPosted: totalJobs || 0
  };
}

export async function getAllUsers() {
  const supabase = await createClient();
  await checkAdminAccess(supabase);

  const { data: users, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }

  return users;
}

export async function deleteUserProfile(userId) {
  const supabase = await createClient();
  const user = await checkAdminAccess(supabase);

  if (userId === user.id) {
    throw new Error("Security Protocol Blocked: Cannot delete your own administrative session.");
  }

  // Delete from profiles (assuming cascading deletes are set up for companies, jobs, applications)
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/dashboard/admin');
  return { success: true };
}
