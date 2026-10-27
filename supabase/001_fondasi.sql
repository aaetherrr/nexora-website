-- =====================================================================
-- NEXORA - Supabase Tahap 1: fondasi (profil, staf, role)
-- Jalankan SEKALI di Supabase > SQL Editor (tempel semua, klik Run).
-- Aman dijalankan ulang: memakai "if not exists" / "or replace".
-- =====================================================================

-- ---------- 1. PROFIL CUSTOMER ----------
create table if not exists public.profiles (
  id               uuid primary key references auth.users(id) on delete cascade,
  nama             text not null default '',
  email            text,
  via              text,                 -- Google / Discord (metode login pertama)
  discord_username text,                 -- diisi customer, hanya untuk dilihat admin
  whatsapp         text,                 -- diisi customer, format 62xxxxxxxxxx
  dibuat           timestamptz not null default now(),
  diubah           timestamptz not null default now(),
  constraint profiles_wa_fmt check (whatsapp is null or whatsapp ~ '^62[0-9]{8,13}$'),
  constraint profiles_dc_fmt check (discord_username is null or discord_username ~ '^[a-z0-9_.]{2,32}$'),
  constraint profiles_nama_len check (char_length(nama) <= 60)
);

-- ---------- 2. STAF (Founder / Co-Founder / Teknisi) ----------
create table if not exists public.staff (
  id         uuid primary key default gen_random_uuid(),
  nama       text not null,
  email      text unique,                -- untuk staf yang login lewat Google
  discord_id text unique,                -- untuk staf yang login lewat Discord (ID angka)
  role       text not null check (role in ('Founder', 'Co-Founder', 'Teknisi')),
  user_id    uuid unique references auth.users(id) on delete set null,
  dibuat     timestamptz not null default now(),
  constraint staff_ada_identitas check (email is not null or discord_id is not null),
  constraint staff_email_kecil   check (email is null or email = lower(email)),
  constraint staff_discord_fmt   check (discord_id is null or discord_id ~ '^[0-9]{15,22}$')
);

-- ---------- 3. FUNGSI BANTU ----------
create or replace function public.my_staff_role()
returns text language sql stable security definer set search_path = public as $$
  select role from public.staff where user_id = auth.uid() limit 1
$$;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.staff where user_id = auth.uid())
$$;

create or replace function public.is_founder()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.staff where user_id = auth.uid() and role = 'Founder')
$$;

-- Dipanggil saat login di halaman admin: mencocokkan akun yang sedang login
-- dengan daftar staf, lalu mengembalikan rolenya (atau null kalau bukan staf).
--  * Google : cocok bila email Google SUDAH TERVERIFIKASI sama dengan email staf
--  * Discord: cocok bila ID pengguna Discord sama (email Discord tidak dipercaya)
create or replace function public.claim_staff()
returns text language plpgsql security definer set search_path = public, auth as $$
begin
  if auth.uid() is null then return null; end if;
  update public.staff s
     set user_id = auth.uid()
   where s.user_id is null
     and (
       (s.discord_id is not null and exists (
          select 1 from auth.identities i
           where i.user_id = auth.uid() and i.provider = 'discord' and i.provider_id = s.discord_id))
       or
       (s.email is not null and exists (
          select 1 from auth.identities i
           where i.user_id = auth.uid() and i.provider = 'google'
             and lower(i.identity_data->>'email') = s.email
             and coalesce((i.identity_data->>'email_verified')::boolean, false)))
     );
  return (select role from public.staff where user_id = auth.uid() limit 1);
end $$;

-- ---------- 4. PROFIL OTOMATIS SAAT AKUN BARU ----------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, nama, email, via)
  values (
    new.id,
    left(coalesce(nullif(new.raw_user_meta_data->>'full_name', ''),
                  nullif(new.raw_user_meta_data->>'name', ''),
                  nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
                  'Customer'), 60),
    new.email,
    initcap(coalesce(new.raw_app_meta_data->>'provider', ''))
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.set_diubah()
returns trigger language plpgsql as $$
begin new.diubah = now(); return new; end $$;

drop trigger if exists profiles_diubah on public.profiles;
create trigger profiles_diubah before update on public.profiles
  for each row execute function public.set_diubah();

-- ---------- 5. KEAMANAN (Row Level Security) ----------
alter table public.profiles enable row level security;
alter table public.staff    enable row level security;

-- profiles: customer hanya melihat & mengubah datanya sendiri; staf boleh melihat semua
drop policy if exists "profil_baca" on public.profiles;
create policy "profil_baca" on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_staff());

drop policy if exists "profil_ubah_sendiri" on public.profiles;
create policy "profil_ubah_sendiri" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- hanya kolom ini yang boleh diubah customer (email/via/id tidak bisa dipalsukan)
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (nama, discord_username, whatsapp) on public.profiles to authenticated;

-- staff: Founder melihat semua; staf lain hanya melihat barisnya sendiri
drop policy if exists "staf_baca" on public.staff;
create policy "staf_baca" on public.staff for select to authenticated
  using (public.is_founder() or user_id = auth.uid());

-- hanya Founder yang boleh mengelola staf, dan baris Founder tidak bisa diubah/dihapus lewat web
drop policy if exists "staf_tambah" on public.staff;
create policy "staf_tambah" on public.staff for insert to authenticated
  with check (public.is_founder() and role <> 'Founder');

drop policy if exists "staf_ubah" on public.staff;
create policy "staf_ubah" on public.staff for update to authenticated
  using (public.is_founder() and role <> 'Founder')
  with check (public.is_founder() and role <> 'Founder');

drop policy if exists "staf_hapus" on public.staff;
create policy "staf_hapus" on public.staff for delete to authenticated
  using (public.is_founder() and role <> 'Founder');

revoke all on public.staff from anon, authenticated;
grant select on public.staff to authenticated;
grant insert (nama, email, discord_id, role) on public.staff to authenticated;
grant update (nama, role) on public.staff to authenticated;
grant delete on public.staff to authenticated;

-- fungsi hanya untuk pengguna yang sudah login
revoke all on function public.my_staff_role() from public, anon;
revoke all on function public.is_staff()      from public, anon;
revoke all on function public.is_founder()    from public, anon;
revoke all on function public.claim_staff()   from public, anon;
grant execute on function public.my_staff_role() to authenticated;
grant execute on function public.is_staff()      to authenticated;
grant execute on function public.is_founder()    to authenticated;
grant execute on function public.claim_staff()   to authenticated;
