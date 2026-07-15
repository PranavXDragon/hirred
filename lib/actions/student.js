"use server";

import { createClient } from '../supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitApplication(jobId) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Unauthorized. Please log in to apply.");

  if (user.role === 'employer') {
    throw new Error("Employers cannot apply to jobs.");
  }

  // Check if already applied
  const { data: existing } = await supabase
    .from('applications')
    .select('id')
    .eq('job_id', jobId)
    .eq('student_id', user.id)
    .maybeSingle();

  if (existing) {
    throw new Error("You have already applied for this protocol.");
  }

  const { error } = await supabase
    .from('applications')
    .insert([{
      job_id: jobId,
      student_id: user.id,
      status: 'pending'
    }]);

  if (error) {
    if (error.code === '23505') { // unique violation
      throw new Error("You have already applied for this protocol.");
    }
    throw new Error(error.message);
  }

  revalidatePath('/jobs');
  revalidatePath('/dashboard/student');
  return { success: true };
}

export async function getStudentApplications() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];

  const { data: applications, error } = await supabase
    .from('applications')
    .select(`
      *,
      job:jobs (
        id,
        title,
        type,
        location,
        salary_range,
        company:companies (
          name,
          logo_url
        )
      )
    `)
    .eq('student_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching student applications:', error.message || error);
    return [];
  }

  return applications;
}

export async function toggleSavedJob(jobId) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Unauthorized");

  // Check if saved
  const { data: existing } = await supabase
    .from('saved_jobs')
    .select('id')
    .eq('job_id', jobId)
    .eq('student_id', user.id)
    .maybeSingle();

  if (existing) {
    // Remove it
    await supabase.from('saved_jobs').delete().eq('id', existing.id);
    revalidatePath('/dashboard/student');
    return { saved: false };
  } else {
    // Save it
    await supabase.from('saved_jobs').insert([{
      job_id: jobId,
      student_id: user.id
    }]);
    revalidatePath('/dashboard/student');
    return { saved: true };
  }
}

export async function getSavedJobs() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];

  const { data: savedJobs, error } = await supabase
    .from('saved_jobs')
    .select(`
      id,
      job_id,
      created_at,
      job:jobs (
        id,
        title,
        type,
        location,
        salary_range,
        company:companies (
          name,
          logo_url
        )
      )
    `)
    .eq('student_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching saved jobs:', error.message || error);
    return [];
  }

  return savedJobs;
}

export async function incrementJobViews(jobId) {
  const supabase = await createClient();
  
  // Use the database function to bypass RLS
  const { data: newViews, error } = await supabase
    .rpc('increment_job_views', { job_id_param: jobId });

  if (error) {
    console.error("Error incrementing views:", error);
    return 0;
  }

  return newViews;
}

export async function withdrawApplication(applicationId) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Unauthorized");

  // Verify ownership before deleting
  const { data: app } = await supabase
    .from('applications')
    .select('id')
    .eq('id', applicationId)
    .eq('student_id', user.id)
    .maybeSingle();

  if (!app) {
    throw new Error("Application not found or you do not have permission to withdraw it.");
  }

  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('id', applicationId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/dashboard/student/applications');
  revalidatePath('/dashboard/student');
  return { success: true };
}
