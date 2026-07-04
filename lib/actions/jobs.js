"use server";

import { createClient } from '../supabase/server';

export async function getJobs() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('jobs')
    .select(`
      *,
      company:companies (
        id,
        name,
        logo_url,
        industry
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }

  // Format the data to match the expected structure in the frontend
  return data.map(job => ({
    id: job.id,
    role: job.title,
    company: job.company?.name || 'Unknown',
    companyLogo: job.company?.logo_url,
    type: job.type,
    location: job.location,
    salary: job.salary_range,
    stack: job.stack || [],
    category: job.category,
    description: job.description,
    responsibilities: job.responsibilities || [],
    posted: new Date(job.created_at).toLocaleDateString(),
    deadline: job.deadline,
    views: job.views || 0,
    company_id: job.company?.id
  }));
}

export async function getJobById(id) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('jobs')
    .select(`
      *,
      company:companies (*)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching job ${id}:`, error);
    return null;
  }

  return {
    id: data.id,
    role: data.title,
    company: data.company?.name || 'Unknown',
    companyDetails: data.company,
    type: data.type,
    location: data.location,
    salary: data.salary_range,
    stack: data.stack || [],
    category: data.category,
    description: data.description,
    responsibilities: data.responsibilities || [],
    posted: new Date(data.created_at).toLocaleDateString(),
    deadline: data.deadline,
    views: data.views || 0,
    company_id: data.company?.id
  };
}
