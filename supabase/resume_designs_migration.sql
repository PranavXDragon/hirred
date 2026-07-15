-- Create the resume_designs table to store AI generated themes
create table if not exists public.resume_designs (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  template text not null, -- The base structure (e.g. brutalist, minimalist)
  accent text not null, -- Hex color code
  font text not null, -- Font family name
  custom_css text, -- AI-generated custom structural CSS
  is_published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.resume_designs enable row level security;

-- Add is_published to existing table
alter table public.resume_designs add column if not exists is_published boolean default true;

-- Policies
create policy "Designs are viewable by everyone." on public.resume_designs for select using (true);
create policy "Admins can insert designs." on public.resume_designs for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can delete designs." on public.resume_designs for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Create storage bucket for resumes
insert into storage.buckets (id, name, public) values ('resumes', 'resumes', true) on conflict do nothing;

create policy "Anyone can read resumes" on storage.objects for select using (bucket_id = 'resumes');
create policy "Authenticated users can upload resumes" on storage.objects for insert with check (
  bucket_id = 'resumes' and auth.role() = 'authenticated'
);
