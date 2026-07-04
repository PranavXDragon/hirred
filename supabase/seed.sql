-- Supabase Seed Script for hirrd
-- Run this in your SQL Editor AFTER running schema.sql

-- 1. Insert a mock employer profile (assuming we can bypass auth.users foreign key for this test, OR if RLS/foreign keys prevent this, you might need to create a user manually first).
-- Actually, since `profiles.id` references `auth.users(id)`, we cannot easily insert a dummy profile without a real auth user.

/* 
DO NOT RUN THIS SCRIPT UNTIL YOU HAVE AT LEAST ONE REGISTERED USER.
This script will automatically grab the first user in your database and use them as the employer.
*/

DO $$ 
DECLARE 
  emp_id uuid;
  comp1_id uuid;
  comp2_id uuid;
BEGIN
  -- Grab the first available profile ID to use as the employer
  SELECT id INTO emp_id FROM public.profiles LIMIT 1;

  IF emp_id IS NULL THEN
    RAISE EXCEPTION 'CRITICAL ERROR: You must register at least one user in the application (http://localhost:3000/register) before running this seed script!';
  END IF;
  
  -- Insert Company 1
  INSERT INTO public.companies (employer_id, name, industry, location, size, remote, website, culture_ratings)
  VALUES (
    emp_id, 
    'hirrd Core', 
    'Enterprise SaaS', 
    'Nagpur HQ', 
    '50-200', 
    true, 
    'https://hirrd.com', 
    '{"workLife": 4.8, "compensation": 4.9, "culture": 4.9, "growth": 4.7, "diversity": 4.5}'::jsonb
  ) RETURNING id INTO comp1_id;

  -- Insert Company 2
  INSERT INTO public.companies (employer_id, name, industry, location, size, remote, website, culture_ratings)
  VALUES (
    emp_id, 
    'Inphora IT Solutions', 
    'AI & Machine Learning', 
    'Hybrid (Pune)', 
    '10-50', 
    false, 
    'https://inphora.com', 
    '{"workLife": 3.5, "compensation": 4.5, "culture": 4.8, "growth": 4.9, "diversity": 4.0}'::jsonb
  ) RETURNING id INTO comp2_id;

  -- Insert Jobs for Company 1
  INSERT INTO public.jobs (company_id, recruiter_id, title, type, location, salary_range, stack, category, description, responsibilities, deadline)
  VALUES (
    comp1_id, 
    emp_id, 
    'Senior Full Stack Developer', 
    'Full-Time', 
    'Remote / Nagpur', 
    '₹18L - ₹24L', 
    ARRAY['React', 'Node.js', 'AWS', 'JavaScript'], 
    'Engineering', 
    'We are seeking an elite Senior Full Stack Developer to join our core architecture team. You will be responsible for designing, building, and optimizing high-performance systems that scale globally.',
    ARRAY['Architect and deploy scalable microservices.', 'Optimize database queries for sub-millisecond response times.', 'Maintain zero-downtime CI/CD pipelines.'],
    now() + interval '14 days'
  );

  INSERT INTO public.jobs (company_id, recruiter_id, title, type, location, salary_range, stack, category, description, responsibilities, deadline)
  VALUES (
    comp1_id, 
    emp_id, 
    'DevOps Architect', 
    'Full-Time', 
    'Nagpur HQ', 
    '₹22L - ₹30L', 
    ARRAY['Docker', 'K8s', 'CI/CD', 'AWS', 'DevOps'], 
    'DevOps/Cloud', 
    'Lead our infrastructure transformation and build bulletproof deployment pipelines.',
    ARRAY['Manage Kubernetes clusters', 'Implement infrastructure as code', 'Ensure 99.99% uptime'],
    now() + interval '30 days'
  );

  -- Insert Jobs for Company 2
  INSERT INTO public.jobs (company_id, recruiter_id, title, type, location, salary_range, stack, category, description, responsibilities, deadline)
  VALUES (
    comp2_id, 
    emp_id, 
    'AI Model Trainer', 
    'Contract', 
    'Hybrid', 
    '₹12L - ₹15L', 
    ARRAY['Python', 'PyTorch', 'NLP', 'Machine Learning'], 
    'AI/ML', 
    'Join our elite AI research wing to train and fine-tune large language models.',
    ARRAY['Fine-tune LLMs on proprietary datasets', 'Optimize inference latency', 'Publish research findings'],
    now() + interval '7 days'
  );

END $$;
