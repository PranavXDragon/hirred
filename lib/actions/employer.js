"use server";

import { createClient } from '../supabase/server';
import { revalidatePath } from 'next/cache';

export async function getEmployerData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { user: null, company: null };

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('employer_id', user.id)
    .maybeSingle();

  return { 
    user: profile || user, 
    company: company || null 
  };
}

export async function saveCompanyProfile(formData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Unauthorized");

  const companyData = {
    employer_id: user.id,
    name: formData.name,
    industry: formData.industry,
    location: formData.location,
    size: formData.size,
    remote: formData.remote === 'true',
    website: formData.website,
    culture_ratings: {
      workLife: parseFloat(formData.workLife) || 0,
      compensation: parseFloat(formData.compensation) || 0,
      culture: parseFloat(formData.culture) || 0,
      growth: parseFloat(formData.growth) || 0,
      diversity: parseFloat(formData.diversity) || 0
    }
  };

  // Check if company exists
  const { data: existing } = await supabase
    .from('companies')
    .select('id')
    .eq('employer_id', user.id)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from('companies')
      .update(companyData)
      .eq('employer_id', user.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from('companies')
      .insert([companyData]);
    if (error) throw new Error(error.message);
  }

  revalidatePath('/dashboard/employer');
  revalidatePath('/companies');
  return { success: true };
}

export async function postJob(formData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Unauthorized");

  // Get company id
  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('employer_id', user.id)
    .maybeSingle();

  if (!company) throw new Error("You must create a company profile first before posting a job.");

  const jobData = {
    company_id: company.id,
    recruiter_id: user.id,
    title: formData.title,
    type: formData.type,
    location: formData.location,
    salary_range: formData.salary_range,
    category: formData.category,
    description: formData.description,
    stack: formData.stack.split(',').map(s => s.trim()).filter(s => s !== ''),
    responsibilities: formData.responsibilities.split('\n').map(r => r.trim()).filter(r => r !== ''),
    deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null
  };

  const { error } = await supabase
    .from('jobs')
    .insert([jobData]);

  if (error) throw new Error(error.message);

  revalidatePath('/jobs');
  return { success: true };
}

export async function getEmployerApplications() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];

  // Get jobs posted by this employer
  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, title')
    .eq('recruiter_id', user.id);

  if (!jobs || jobs.length === 0) return [];

  const jobIds = jobs.map(j => j.id);

  // Get applications for these jobs
  const { data: applications, error } = await supabase
    .from('applications')
    .select(`
      *,
      job:jobs(title),
      student:profiles(full_name, email, resume_url, github_url, linkedin_url)
    `)
    .in('job_id', jobIds)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching applications:', error);
    return [];
  }

  return applications;
}

export async function updateApplicationStatus(appId, newStatus) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('applications')
    .update({ status: newStatus })
    .eq('id', appId);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/employer');
  return { success: true };
}
