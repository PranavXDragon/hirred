"use server";

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const getPublicClient = () => {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
};

const dummyCompanies = [
  {
    id: 'dummy-1',
    slug: 'salesforce',
    name: 'Salesforce',
    industry: 'Enterprise SaaS',
    location: 'San Francisco, CA',
    size: '10,000+',
    remote: true,
    culture_ratings: { workLife: 4.2, compensation: 4.8, culture: 4.5, growth: 4.3, diversity: 4.7 },
    perks: [],
    openJobs: 42,
    jobs: []
  },
  {
    id: 'dummy-2',
    slug: 'anthropic',
    name: 'Anthropic',
    industry: 'AI & Machine Learning',
    location: 'San Francisco, CA',
    size: '100-500',
    remote: false,
    culture_ratings: { workLife: 3.8, compensation: 5.0, culture: 4.8, growth: 4.9, diversity: 4.4 },
    perks: [],
    openJobs: 15,
    jobs: []
  },
  {
    id: 'dummy-3',
    slug: 'shopify',
    name: 'Shopify',
    industry: 'E-Commerce',
    location: 'Remote',
    size: '5,000-10,000',
    remote: true,
    culture_ratings: { workLife: 4.6, compensation: 4.5, culture: 4.7, growth: 4.2, diversity: 4.5 },
    perks: [],
    openJobs: 28,
    jobs: []
  },
  {
    id: 'dummy-4',
    slug: 'databricks',
    name: 'Databricks',
    industry: 'Data Analytics',
    location: 'San Francisco, CA',
    size: '1,000-5,000',
    remote: true,
    culture_ratings: { workLife: 3.9, compensation: 4.9, culture: 4.4, growth: 4.8, diversity: 4.1 },
    perks: [],
    openJobs: 64,
    jobs: []
  },
  {
    id: 'dummy-5',
    slug: 'cloudflare',
    name: 'Cloudflare',
    industry: 'Cyber Security',
    location: 'San Francisco, CA',
    size: '1,000-5,000',
    remote: true,
    culture_ratings: { workLife: 4.1, compensation: 4.4, culture: 4.6, growth: 4.5, diversity: 4.3 },
    perks: [],
    openJobs: 33,
    jobs: []
  },
  {
    id: 'dummy-6',
    slug: 'aws',
    name: 'AWS',
    industry: 'Cloud Infrastructure',
    location: 'Seattle, WA',
    size: '10,000+',
    remote: false,
    culture_ratings: { workLife: 3.2, compensation: 4.7, culture: 3.8, growth: 4.6, diversity: 4.0 },
    perks: [],
    openJobs: 156,
    jobs: []
  }
];

export async function getCompanies() {
  const supabase = getPublicClient();
  
  const { data, error } = await supabase
    .from('companies')
    .select(`
      *,
      jobs:jobs(id)
    `)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching companies:', JSON.stringify(error, null, 2), error.message, error.details, error.hint, error.code);
    return dummyCompanies;
  }

  const mappedData = data.map(company => ({
    id: company.id,
    slug: company.slug,
    name: company.name,
    industry: company.industry,
    location: company.location,
    size: company.size,
    remote: company.remote,
    website: company.website,
    logoUrl: company.logo_url,
    culture_ratings: company.culture_ratings || {},
    perks: company.perks || [],
    openJobs: company.jobs?.length || 0
  }));

  return [...mappedData, ...dummyCompanies];
}

export async function getCompanyById(id) {
  if (id.startsWith('dummy-')) {
    const dummy = dummyCompanies.find(c => c.id === id);
    return dummy || null;
  }

  const supabase = getPublicClient();
  
  const { data, error } = await supabase
    .from('companies')
    .select(`
      *,
      jobs:jobs(
        id,
        title,
        type,
        location,
        salary_range,
        stack,
        category,
        created_at,
        deadline,
        views
      )
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching company ${id}:`, error);
    return null;
  }
  
  if (!data) return null;

  return {
    id: data.id,
    name: data.name,
    industry: data.industry,
    location: data.location,
    size: data.size,
    remote: data.remote,
    website: data.website,
    about: data.about,
    logoUrl: data.logo_url,
    culture_ratings: data.culture_ratings || {},
    perks: data.perks || [],
    openJobs: data.jobs?.length || 0,
    jobs: data.jobs || []
  };
}

export async function getCompanyBySlug(slug) {
  const dummy = dummyCompanies.find(c => c.slug === slug);
  if (dummy) {
    return dummy;
  }

  const supabase = getPublicClient();
  
  const { data, error } = await supabase
    .from('companies')
    .select(`
      *,
      jobs:jobs(
        id,
        slug,
        title,
        type,
        location,
        salary_range,
        stack,
        category,
        created_at,
        deadline,
        views
      )
    `)
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching company with slug ${slug}:`, error);
    return null;
  }
  
  if (!data) return null;

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    industry: data.industry,
    location: data.location,
    size: data.size,
    remote: data.remote,
    website: data.website,
    about: data.about,
    logoUrl: data.logo_url,
    culture_ratings: data.culture_ratings || {},
    perks: data.perks || [],
    openJobs: data.jobs?.length || 0,
    jobs: data.jobs || []
  };
}
