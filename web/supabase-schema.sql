create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  avatar_url text,
  created_at timestamptz default now(),
  preferences jsonb default '{}'::jsonb
);

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text,
  description text,
  url text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.photos enable row level security;

create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can view own photos" on public.photos for select using (auth.uid() = user_id);
create policy "Users can insert own photos" on public.photos for insert with check (auth.uid() = user_id);
create policy "Users can delete own photos" on public.photos for delete using (auth.uid() = user_id);
create policy "Users can update own photos" on public.photos for update using (auth.uid() = user_id);
