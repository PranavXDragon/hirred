-- Supabase Master Schema for hirrd
-- Execute this entirely in your Supabase SQL Editor

drop table if exists public.bookings cascade;
drop table if exists public.saved_jobs cascade;
drop table if exists public.applications cascade;
drop table if exists public.jobs cascade;
drop table if exists public.companies cascade;
drop table if exists public.mentors cascade;
drop table if exists public.profiles cascade;
drop table if exists public.resume_designs cascade;

-- 1. PROFILES TABLE EXTENSION
-- Extending the default auth.users table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  email text,
  role text check (role in ('student', 'employer', 'mentor', 'admin')) default 'student',
  profile_photo text,
  resume_url text,
  bio text,
  github_url text,
  linkedin_url text,
  is_pro boolean default false,
  phone text,
  college text,
  location text,
  experience text,
  skills text[],
  preferences jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);


-- 2. COMPANIES TABLE
create table if not exists public.companies (
  id uuid default uuid_generate_v4() primary key,
  employer_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  industry text not null,
  location text not null,
  size text not null,
  remote boolean default false,
  logo_url text,
  website text,
  about text,
  culture_ratings jsonb default '{"workLife": 0, "compensation": 0, "culture": 0, "growth": 0, "diversity": 0}'::jsonb,
  perks jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for companies
alter table public.companies enable row level security;
create policy "Companies are viewable by everyone." on public.companies for select using (true);
create policy "Employers can insert their own companies." on public.companies for insert with check (auth.uid() = employer_id);
create policy "Employers can update their own companies." on public.companies for update using (auth.uid() = employer_id);


-- 3. JOBS TABLE
create table if not exists public.jobs (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid references public.companies(id) on delete cascade not null,
  recruiter_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  type text not null,
  location text not null,
  salary_range text not null,
  stack text[] not null default '{}',
  category text not null,
  description text,
  responsibilities text[] default '{}',
  deadline timestamp with time zone,
  views integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for jobs
alter table public.jobs enable row level security;
create policy "Jobs are viewable by everyone." on public.jobs for select using (true);
create policy "Employers can insert jobs." on public.jobs for insert with check (auth.uid() = recruiter_id);
create policy "Employers can update their own jobs." on public.jobs for update using (auth.uid() = recruiter_id);
create policy "Employers can delete their own jobs." on public.jobs for delete using (auth.uid() = recruiter_id);


-- 4. APPLICATIONS TABLE
create table if not exists public.applications (
  id uuid default uuid_generate_v4() primary key,
  job_id uuid references public.jobs(id) on delete cascade not null,
  student_id uuid references public.profiles(id) on delete cascade not null,
  status text check (status in ('pending', 'reviewing', 'assessment', 'interview', 'rejected', 'hired')) default 'pending',
  resume_url text,
  cover_letter text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(job_id, student_id) -- Prevent duplicate applications
);

-- RLS for applications
alter table public.applications enable row level security;
create policy "Students can view their own applications." on public.applications for select using (auth.uid() = student_id);
create policy "Employers can view applications for their jobs." on public.applications for select using (
  exists (
    select 1 from public.jobs where id = applications.job_id and recruiter_id = auth.uid()
  )
);
create policy "Students can insert their own applications." on public.applications for insert with check (auth.uid() = student_id);
create policy "Employers can update application status." on public.applications for update using (
  exists (
    select 1 from public.jobs where id = applications.job_id and recruiter_id = auth.uid()
  )
);


-- 5. MENTORS TABLE
create table if not exists public.mentors (
  id uuid references public.profiles(id) on delete cascade not null primary key,
  company text not null,
  role text not null,
  location text not null,
  rating numeric(3,2) default 5.00,
  rate numeric(10,2) not null,
  expertise text[] not null default '{}',
  domain text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for mentors
alter table public.mentors enable row level security;
create policy "Mentors are viewable by everyone." on public.mentors for select using (true);
create policy "Mentors can insert their own profile." on public.mentors for insert with check (auth.uid() = id);
create policy "Mentors can update their own profile." on public.mentors for update using (auth.uid() = id);


-- 6. MENTORSHIP BOOKINGS TABLE
create table if not exists public.bookings (
  id uuid default uuid_generate_v4() primary key,
  mentor_id uuid references public.mentors(id) on delete cascade not null,
  student_id uuid references public.profiles(id) on delete cascade not null,
  booking_date timestamp with time zone not null,
  status text check (status in ('pending', 'confirmed', 'completed', 'cancelled')) default 'pending',
  meet_link text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for bookings
alter table public.bookings enable row level security;
create policy "Users can view their own bookings." on public.bookings for select using (auth.uid() = student_id or auth.uid() = mentor_id);
create policy "Students can insert their own bookings." on public.bookings for insert with check (auth.uid() = student_id);
create policy "Mentors can update their bookings." on public.bookings for update using (auth.uid() = mentor_id);


-- 7. STORAGE BUCKETS SETUP
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('resumes', 'resumes', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('company-logos', 'company-logos', true) on conflict do nothing;

-- RLS for Storage (Avatars)
drop policy if exists "Avatar images are publicly accessible." on storage.objects;
create policy "Avatar images are publicly accessible." on storage.objects for select using (bucket_id = 'avatars');
drop policy if exists "Anyone can upload an avatar." on storage.objects;
create policy "Anyone can upload an avatar." on storage.objects for insert with check (bucket_id = 'avatars');
drop policy if exists "Anyone can update their avatar." on storage.objects;
create policy "Anyone can update their avatar." on storage.objects for update with check (bucket_id = 'avatars');

-- RLS for Storage (Resumes)
drop policy if exists "Users can view their own resumes." on storage.objects;
create policy "Users can view their own resumes." on storage.objects for select using (bucket_id = 'resumes' and (auth.uid() = owner));
drop policy if exists "Users can upload their own resumes." on storage.objects;
create policy "Users can upload their own resumes." on storage.objects for insert with check (bucket_id = 'resumes' and (auth.uid() = owner));

-- RLS for Storage (Logos)
drop policy if exists "Company logos are publicly accessible." on storage.objects;
create policy "Company logos are publicly accessible." on storage.objects for select using (bucket_id = 'company-logos');
drop policy if exists "Anyone can upload a logo." on storage.objects;
create policy "Anyone can upload a logo." on storage.objects for insert with check (bucket_id = 'company-logos');
drop policy if exists "Anyone can update a logo." on storage.objects;
create policy "Anyone can update a logo." on storage.objects for update with check (bucket_id = 'company-logos');

-- 8. SAVED JOBS TABLE
create table if not exists public.saved_jobs (
  id uuid default uuid_generate_v4() primary key,
  job_id uuid references jobs on delete cascade not null,
  student_id uuid references profiles on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(job_id, student_id)
);

-- RLS for saved_jobs
alter table public.saved_jobs enable row level security;
create policy "Students can view their saved jobs." on public.saved_jobs for select using (auth.uid() = student_id);
create policy "Students can save jobs." on public.saved_jobs for insert with check (auth.uid() = student_id);
create policy "Students can unsave jobs." on public.saved_jobs for delete using (auth.uid() = student_id);

-- 9. CONTACT MESSAGES
create table if not exists public.contact_messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  message text not null,
  status text default 'unread',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.contact_messages enable row level security;
create policy "Anyone can insert a contact message." on public.contact_messages for insert with check (true);

-- 10. REAL-TIME MESSAGES (For Mentor/Student Chat)
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  receiver_id text not null, -- Changed to text to support 'dummy-1' mentors during testing
  content text not null,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.messages enable row level security;
create policy "Users can view their own messages." on public.messages for select using (auth.uid() = sender_id or auth.uid() = receiver_id);
create policy "Users can insert messages." on public.messages for insert with check (auth.uid() = sender_id);
create policy "Users can update received messages (e.g. mark read)." on public.messages for update using (auth.uid() = receiver_id);
