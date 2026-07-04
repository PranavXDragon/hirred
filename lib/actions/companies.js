"use server";

import { createClient } from '../supabase/server';

export async function getCompanies() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('companies')
    .select(`
      *,
      jobs:jobs(id)
    `)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching companies:', error);
    return [];
  }

  const mappedData = data.map(company => ({
    id: company.id,
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

  const dummyCompanies = [
    {
      id: 'dummy-1',
      name: 'Salesforce',
      industry: 'Enterprise SaaS',
      location: 'San Francisco, CA',
      size: '10,000+',
      remote: true,
      culture_ratings: { workLife: 4.2, compensation: 4.8, culture: 4.5, growth: 4.3, diversity: 4.7 },
      perks: [],
      openJobs: 42
    },
    {
      id: 'dummy-2',
      name: 'Anthropic',
      industry: 'AI & Machine Learning',
      location: 'San Francisco, CA',
      size: '100-500',
      remote: false,
      culture_ratings: { workLife: 3.8, compensation: 5.0, culture: 4.8, growth: 4.9, diversity: 4.4 },
      perks: [],
      openJobs: 15
    },
    {
      id: 'dummy-3',
      name: 'Shopify',
      industry: 'E-Commerce',
      location: 'Remote',
      size: '5,000-10,000',
      remote: true,
      culture_ratings: { workLife: 4.6, compensation: 4.5, culture: 4.7, growth: 4.2, diversity: 4.5 },
      perks: [],
      openJobs: 28
    },
    {
      id: 'dummy-4',
      name: 'Databricks',
      industry: 'Data Analytics',
      location: 'San Francisco, CA',
      size: '1,000-5,000',
      remote: true,
      culture_ratings: { workLife: 3.9, compensation: 4.9, culture: 4.4, growth: 4.8, diversity: 4.1 },
      perks: [],
      openJobs: 64
    },
    {
      id: 'dummy-5',
      name: 'Cloudflare',
      industry: 'Cyber Security',
      location: 'San Francisco, CA',
      size: '1,000-5,000',
      remote: true,
      culture_ratings: { workLife: 4.1, compensation: 4.4, culture: 4.6, growth: 4.5, diversity: 4.3 },
      perks: [],
      openJobs: 33
    },
    {
      id: 'dummy-6',
      name: 'AWS',
      industry: 'Cloud Infrastructure',
      location: 'Seattle, WA',
      size: '10,000+',
      remote: false,
      culture_ratings: { workLife: 3.2, compensation: 4.7, culture: 3.8, growth: 4.6, diversity: 4.0 },
      perks: [],
      openJobs: 156
    }
  ];

  return [...mappedData, ...dummyCompanies];
}
