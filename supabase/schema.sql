-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  full_name text,
  email text,
  avatar_url text,

  constraint full_name_length check (char_length(full_name) >= 3)
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on profiles
  for update using ((select auth.uid()) = id);

-- Create a table for subscriptions (Razorpay)
create table subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) not null,
  razorpay_subscription_id text,
  razorpay_customer_id text,
  status text check (status in ('active', 'created', 'authenticated', 'past_due', 'halted', 'canceled', 'paused', 'expired', 'pending', 'completed')),
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table subscriptions enable row level security;

create policy "Users can view own subscription." on subscriptions
  for select using ((select auth.uid()) = user_id);

-- Create a table for analyses
create table analyses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  repo_url text not null,
  status text not null check (status in ('pending', 'running', 'completed', 'failed')),
  result jsonb,
  summary text,
  error_message text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Indexes for performance
create index analyses_user_id_idx on analyses (user_id);
create index analyses_created_at_idx on analyses (created_at desc);

-- Trigger to automatically update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger set_updated_at
    before update on analyses
    for each row
    execute procedure update_updated_at_column();

-- Row Level Security (RLS)
alter table analyses enable row level security;

create policy "Users can insert own analyses." on analyses
  for insert with check (auth.uid() = user_id);

create policy "Users can view own analyses." on analyses
  for select using (auth.uid() = user_id);

create policy "Users can update own analyses." on analyses
  for update using (auth.uid() = user_id);

create policy "Users can delete own analyses." on analyses
  for delete using (auth.uid() = user_id);

-- Function to handle new user signup
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
