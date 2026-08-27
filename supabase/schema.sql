-- ============================================================
--  hifi — skema database (jalankan di Supabase → SQL Editor)
-- ============================================================

-- ---------- Tabel ----------
create table if not exists public.hero (
  id          int primary key default 1,
  badge       text not null,
  headline    text not null,
  highlight   text not null,
  subheadline text not null,
  cta_label   text not null,
  updated_at  timestamptz default now(),
  constraint hero_single check (id = 1)
);

create table if not exists public.site_settings (
  id         int primary key default 1,
  wa_number  text not null,
  promo_text text not null,
  hours      text not null,
  updated_at timestamptz default now(),
  constraint settings_single check (id = 1)
);

create table if not exists public.packages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  speed      text not null,
  is_popular boolean not null default false,
  price_1    int not null default 0,
  price_6    int not null default 0,
  price_12   int not null default 0,
  features   text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz default now()
);

-- ---------- Data awal (seed) ----------
insert into public.hero (id, badge, headline, highlight, subheadline, cta_label)
values (1,
  'Internet fiber & 5G untuk rumah',
  'Internet ngebut buat seisi rumah',
  'ngebut',
  'Streaming 4K, main game, kerja online — semua lancar tanpa buffering. Pasang gratis, tanpa ribet.',
  'Cek coverage')
on conflict (id) do nothing;

insert into public.site_settings (id, wa_number, promo_text, hours)
values (1,
  '628123456789',
  'Promo bulan ini: pasang GRATIS + diskon bulan pertama untuk pelanggan baru.',
  'Setiap hari 08.00–21.00')
on conflict (id) do nothing;

insert into public.packages (name, speed, is_popular, price_1, price_6, price_12, features, sort_order) values
  ('hifi Home','100 Mbps',false,250000,235000,219000,
    array['Wi-Fi 6 router included','Hingga 8 perangkat','Cocok untuk 2–3 orang','Tanpa FUP'],1),
  ('hifi Plus','300 Mbps',true ,299000,279000,259000,
    array['Wi-Fi 6 router included','Hingga 15 perangkat','Streaming 4K & gaming lancar','Prioritas support'],2),
  ('hifi Pro','500 Mbps',false,449000,419000,389000,
    array['Wi-Fi 6 mesh ready','Perangkat tak terbatas','Buat WFH & smart home','Prioritas support 24/7'],3);

-- ---------- Row Level Security ----------
alter table public.hero          enable row level security;
alter table public.site_settings enable row level security;
alter table public.packages      enable row level security;

-- publik boleh baca (landing page pakai anon key)
drop policy if exists "public read hero"     on public.hero;
drop policy if exists "public read settings" on public.site_settings;
drop policy if exists "public read packages" on public.packages;
create policy "public read hero"     on public.hero          for select using (true);
create policy "public read settings" on public.site_settings for select using (true);
create policy "public read packages" on public.packages      for select using (true);

-- hanya user login (admin) yang boleh ubah
drop policy if exists "auth write hero"     on public.hero;
drop policy if exists "auth write settings" on public.site_settings;
drop policy if exists "auth write packages" on public.packages;
create policy "auth write hero"     on public.hero          for all using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "auth write settings" on public.site_settings for all using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "auth write packages" on public.packages      for all using (auth.uid() is not null) with check (auth.uid() is not null);
