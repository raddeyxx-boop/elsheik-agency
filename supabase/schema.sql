-- شغّل هذا الملف مرة واحدة داخل محرر SQL في Supabase.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text, full_name text, role text default 'user',
  created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists public.colleges (
  id uuid primary key default gen_random_uuid(), name text not null,
  short_description text, description text, location text, website_url text,
  image_url text, is_active boolean default true, display_order integer default 0,
  created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists public.college_courses (
  id uuid primary key default gen_random_uuid(), college_id uuid references public.colleges(id) on delete cascade,
  name text not null, description text, duration text, degree_type text,
  created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists public.student_requests (
  id uuid primary key default gen_random_uuid(), student_name text not null,
  college_name text not null, course_name text not null, phone_number text not null,
  email text, country text, city text, education_level text, message text,
  status text default 'pending', admin_notes text,
  created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(), setting_key text unique,
  setting_value jsonb, is_public boolean default false,
  created_at timestamptz default now(), updated_at timestamptz default now()
);

create or replace function public.is_admin() returns boolean language sql stable security definer
set search_path = public as $$ select exists(select 1 from profiles where id=auth.uid() and role='admin') $$;

alter table profiles enable row level security;
alter table colleges enable row level security;
alter table college_courses enable row level security;
alter table student_requests enable row level security;
alter table site_settings enable row level security;

create policy "public reads active colleges" on colleges for select using (is_active or public.is_admin());
create policy "public reads courses of active colleges" on college_courses for select using (exists(select 1 from colleges c where c.id=college_id and c.is_active) or public.is_admin());
create policy "public creates requests" on student_requests for insert with check (status is null or status='pending');
create policy "admins manage requests" on student_requests for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage colleges" on colleges for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage courses" on college_courses for all using (public.is_admin()) with check (public.is_admin());
create policy "public reads public settings" on site_settings for select using (is_public or public.is_admin());
create policy "admins manage settings" on site_settings for all using (public.is_admin()) with check (public.is_admin());
create policy "users read own profile" on profiles for select using (id=auth.uid() or public.is_admin());
create policy "admins manage profiles" on profiles for all using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id,name,public) values ('college-images','college-images',true) on conflict (id) do nothing;
create policy "public reads college images" on storage.objects for select using (bucket_id='college-images');
create policy "admins upload college images" on storage.objects for insert with check (bucket_id='college-images' and public.is_admin());
create policy "admins update college images" on storage.objects for update using (bucket_id='college-images' and public.is_admin());
create policy "admins delete college images" on storage.objects for delete using (bucket_id='college-images' and public.is_admin());

-- بعد إنشاء المستخدم من لوحة Authentication، استبدل المعرف أدناه بمعرفه ثم نفّذ:
-- insert into public.profiles(id,email,full_name,role) values ('USER_UUID','elsheik@gmail.com','علي الشيخ','admin');
