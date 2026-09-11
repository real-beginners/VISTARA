-- Vistara Phase 1 schema. Run this in the Supabase SQL editor.
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  username text unique,
  email text,
  avatar_url text,
  bio text,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.travel_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  interests text[] not null default '{}',
  travel_companions text,
  budget text,
  travel_style text,
  distance text,
  priorities text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  destination text,
  status text not null default 'planning',
  starts_at date,
  ends_at date,
  created_at timestamptz not null default now()
);

create table if not exists public.trip_members (
  trip_id uuid references public.trips(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  primary key (trip_id, user_id)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null,
  title text not null,
  body text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, username, email)
  values (new.id, new.raw_user_meta_data ->> 'full_name', lower(new.raw_user_meta_data ->> 'username'), new.email)
  on conflict (id) do update set full_name = excluded.full_name, username = excluded.username, email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.travel_preferences enable row level security;
alter table public.trips enable row level security;
alter table public.trip_members enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile" on public.profiles for select using (auth.uid() = id);
drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Users can manage their own preferences" on public.travel_preferences;
create policy "Users can manage their own preferences" on public.travel_preferences for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Owners can manage their trips" on public.trips;
create policy "Owners can manage their trips" on public.trips for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
drop policy if exists "Members can view trip membership" on public.trip_members;
create policy "Members can view trip membership" on public.trip_members for select using (auth.uid() = user_id);
drop policy if exists "Users can view their notifications" on public.notifications;
create policy "Users can view their notifications" on public.notifications for select using (auth.uid() = user_id);
