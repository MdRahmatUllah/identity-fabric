
-- Roles enum
create type public.app_role as enum ('admin', 'org_admin', 'operator', 'viewer');

-- Organizations
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  plan text not null default 'starter',
  created_at timestamptz not null default now()
);
alter table public.organizations enable row level security;

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  organization_id uuid references public.organizations(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- User roles
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

-- Security definer for role checks
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

create or replace function public.current_org_id()
returns uuid language sql stable security definer set search_path = public
as $$ select organization_id from public.profiles where id = auth.uid() $$;

-- Templates
create table public.templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  orientation text not null default 'landscape', -- landscape | portrait
  description text,
  thumbnail_url text,
  field_manifest jsonb not null default '[]'::jsonb,
  layout jsonb not null default '{}'::jsonb,
  primary_color text default '#1f2937',
  accent_color text default '#3b82f6',
  status text not null default 'published', -- draft | published | archived
  version int not null default 1,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.templates enable row level security;

-- Generated cards
create table public.generated_cards (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.templates(id) on delete restrict,
  template_version int not null default 1,
  organization_id uuid references public.organizations(id) on delete set null,
  generated_by uuid not null references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  preview_url text,
  created_at timestamptz not null default now()
);
alter table public.generated_cards enable row level security;

-- RLS POLICIES
-- profiles
create policy "view own profile" on public.profiles for select using (auth.uid() = id);
create policy "update own profile" on public.profiles for update using (auth.uid() = id);
create policy "insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "admins view all profiles" on public.profiles for select using (public.has_role(auth.uid(), 'admin'));

-- organizations
create policy "members view own org" on public.organizations for select using (id = public.current_org_id() or public.has_role(auth.uid(), 'admin'));
create policy "admins manage orgs" on public.organizations for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- user_roles
create policy "view own roles" on public.user_roles for select using (user_id = auth.uid());
create policy "admins view all roles" on public.user_roles for select using (public.has_role(auth.uid(), 'admin'));
create policy "admins manage roles" on public.user_roles for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- templates
create policy "anyone authed views published" on public.templates for select to authenticated using (status = 'published' or public.has_role(auth.uid(), 'admin'));
create policy "admins manage templates" on public.templates for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- generated_cards
create policy "view own org cards" on public.generated_cards for select using (
  generated_by = auth.uid()
  or organization_id = public.current_org_id()
  or public.has_role(auth.uid(), 'admin')
);
create policy "operators create cards" on public.generated_cards for insert with check (
  generated_by = auth.uid() and (
    public.has_role(auth.uid(), 'operator')
    or public.has_role(auth.uid(), 'org_admin')
    or public.has_role(auth.uid(), 'admin')
  )
);
create policy "creators delete own cards" on public.generated_cards for delete using (generated_by = auth.uid() or public.has_role(auth.uid(), 'admin'));

-- Trigger to create profile + default org + operator role on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  new_org_id uuid;
begin
  insert into public.organizations (name) values (coalesce(new.raw_user_meta_data->>'organization_name', 'My Organization'))
  returning id into new_org_id;

  insert into public.profiles (id, full_name, organization_id)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email), new_org_id);

  insert into public.user_roles (user_id, role) values (new.id, 'org_admin');
  insert into public.user_roles (user_id, role) values (new.id, 'operator');
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Seed templates
insert into public.templates (name, category, orientation, description, primary_color, accent_color, field_manifest) values
('Corporate Employee', 'Corporate', 'landscape', 'Standard employee badge with photo, name, title and ID.', '#0f172a', '#3b82f6',
 '[{"key":"full_name","label":"Full Name","type":"text","required":true,"max":40},{"key":"job_title","label":"Job Title","type":"text","required":true,"max":40},{"key":"employee_id","label":"Employee ID","type":"text","required":true,"max":20},{"key":"department","label":"Department","type":"text","required":false,"max":30},{"key":"photo","label":"Photo","type":"image","required":true}]'::jsonb),
('Student ID', 'Education', 'portrait', 'University student identification card.', '#0c4a6e', '#0ea5e9',
 '[{"key":"full_name","label":"Full Name","type":"text","required":true,"max":40},{"key":"student_id","label":"Student ID","type":"text","required":true,"max":20},{"key":"program","label":"Program","type":"text","required":true,"max":40},{"key":"valid_until","label":"Valid Until","type":"date","required":true},{"key":"photo","label":"Photo","type":"image","required":true}]'::jsonb),
('Event Delegate', 'Events', 'portrait', 'Conference delegate pass with QR code.', '#312e81', '#8b5cf6',
 '[{"key":"full_name","label":"Full Name","type":"text","required":true,"max":40},{"key":"company","label":"Company","type":"text","required":false,"max":40},{"key":"role","label":"Role","type":"text","required":false,"max":30},{"key":"ticket_id","label":"Ticket ID","type":"text","required":true,"max":20}]'::jsonb),
('Healthcare Staff', 'Healthcare', 'landscape', 'Medical staff identification with role and department.', '#064e3b', '#10b981',
 '[{"key":"full_name","label":"Full Name","type":"text","required":true,"max":40},{"key":"role","label":"Role","type":"text","required":true,"max":30},{"key":"department","label":"Department","type":"text","required":true,"max":30},{"key":"staff_id","label":"Staff ID","type":"text","required":true,"max":20},{"key":"photo","label":"Photo","type":"image","required":true}]'::jsonb),
('Visitor Pass', 'Visitor', 'landscape', 'Temporary visitor identification badge.', '#7c2d12', '#f97316',
 '[{"key":"full_name","label":"Visitor Name","type":"text","required":true,"max":40},{"key":"company","label":"Company","type":"text","required":false,"max":40},{"key":"host","label":"Host","type":"text","required":true,"max":40},{"key":"valid_date","label":"Valid Date","type":"date","required":true}]'::jsonb),
('Contractor Badge', 'Contractor', 'landscape', 'Contractor identification with company and access level.', '#3f3f46', '#eab308',
 '[{"key":"full_name","label":"Full Name","type":"text","required":true,"max":40},{"key":"company","label":"Company","type":"text","required":true,"max":40},{"key":"access_level","label":"Access Level","type":"text","required":true,"max":20},{"key":"valid_until","label":"Valid Until","type":"date","required":true},{"key":"photo","label":"Photo","type":"image","required":true}]'::jsonb),
('Press Pass', 'Press', 'portrait', 'Media and press credential.', '#450a0a', '#dc2626',
 '[{"key":"full_name","label":"Full Name","type":"text","required":true,"max":40},{"key":"outlet","label":"Media Outlet","type":"text","required":true,"max":40},{"key":"credential_id","label":"Credential ID","type":"text","required":true,"max":20},{"key":"photo","label":"Photo","type":"image","required":true}]'::jsonb),
('Membership Card', 'Membership', 'landscape', 'Loyalty or membership card.', '#1e1b4b', '#a855f7',
 '[{"key":"full_name","label":"Member Name","type":"text","required":true,"max":40},{"key":"member_id","label":"Member ID","type":"text","required":true,"max":20},{"key":"tier","label":"Tier","type":"text","required":false,"max":20},{"key":"member_since","label":"Member Since","type":"date","required":false}]'::jsonb),
('Government Visitor', 'Government', 'portrait', 'Government facility visitor credential.', '#1e293b', '#475569',
 '[{"key":"full_name","label":"Full Name","type":"text","required":true,"max":40},{"key":"id_number","label":"ID Number","type":"text","required":true,"max":20},{"key":"purpose","label":"Visit Purpose","type":"text","required":true,"max":40},{"key":"valid_date","label":"Valid Date","type":"date","required":true},{"key":"photo","label":"Photo","type":"image","required":true}]'::jsonb),
('Conference Attendee', 'Events', 'portrait', 'General conference attendee badge.', '#134e4a', '#14b8a6',
 '[{"key":"full_name","label":"Full Name","type":"text","required":true,"max":40},{"key":"company","label":"Company","type":"text","required":false,"max":40},{"key":"track","label":"Track","type":"text","required":false,"max":30},{"key":"badge_id","label":"Badge ID","type":"text","required":true,"max":20}]'::jsonb);
