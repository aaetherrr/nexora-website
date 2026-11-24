-- 016: Verifikasi 2 langkah (TOTP) OPSIONAL.
--  - Aplikasi authenticator (Google Authenticator, Authy, 1Password) lewat fitur MFA bawaan Supabase Auth.
--    TOTP gratis di semua paket; tidak perlu mengaktifkan apa pun di dashboard Supabase.
--  - Hanya akun yang MENGAKTIFKAN 2FA yang kena aturan di bawah. Akun tanpa 2FA berjalan persis seperti sebelumnya.
--  - Akun dengan 2FA: selama sesinya belum lolos kode 6 digit (aal1), semua data di tabel aplikasi
--    tidak bisa dibaca atau diubah, walau token dipakai langsung ke API (bukan lewat situs).
-- Jalankan sekali di Supabase > SQL Editor setelah 015. Aman dijalankan ulang.

-- ---------- 1) Apakah sesi ini boleh akses? ----------
-- true  : akun TIDAK punya 2FA terverifikasi, atau sesinya sudah lolos kode (aal2).
-- false : akun punya 2FA terverifikasi tapi sesi ini baru login biasa (aal1).
-- (security definer karena tabel auth.mfa_factors tidak bisa dibaca role authenticator)
create or replace function public.mfa_ok() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce((select auth.jwt() ->> 'aal'), 'aal1') = 'aal2'
      or not exists (
           select 1 from auth.mfa_factors f
            where f.user_id = (select auth.uid()) and f.status = 'verified')
$$;
revoke all on function public.mfa_ok() from public, anon;
grant execute on function public.mfa_ok() to authenticated;

-- ---------- 2) Pagar di semua tabel aplikasi (baca dan tulis lewat API) ----------
-- Policy "restrictive" = syarat TAMBAHAN di atas policy yang sudah ada, tidak menggantikannya.
do $$
declare t text;
begin
  foreach t in array array['profiles', 'staff', 'tickets', 'ticket_messages', 'catalog_jasa', 'catalog_paket', 'site_settings'] loop
    execute format('drop policy if exists mfa_wajib on public.%I', t);
    execute format('create policy mfa_wajib on public.%I as restrictive for all to authenticated using ((select public.mfa_ok()))', t);
  end loop;
end $$;

-- Bucket foto situs (hanya bucket "situs"; bucket lain tidak terpengaruh)
do $$
begin
  drop policy if exists mfa_wajib_situs on storage.objects;
  create policy mfa_wajib_situs on storage.objects as restrictive for all to authenticated
    using (bucket_id <> 'situs' or (select public.mfa_ok()));
exception when others then
  raise notice 'Aturan storage.objects gagal dibuat (%). Bagian lain tetap berlaku.', sqlerrm;
end $$;

-- ---------- 3) Pagar untuk fungsi RPC (mark_ticket_read, pin_message, take_over_ticket, dst.) ----------
-- Fungsi "security definer" melewati RLS, jadi dijaga di level trigger: setiap tulis ke tabel aplikasi ditolak
-- kalau sesinya belum lolos kode. Dijalankan paling awal (nama diawali "a_").
create or replace function public.mfa_guard() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if not public.mfa_ok() then
    raise exception 'Verifikasi 2 langkah dulu: masukkan kode dari aplikasi authenticator.' using errcode = '42501';
  end if;
  return null;
end $$;
revoke all on function public.mfa_guard() from public, anon, authenticated;

do $$
declare t text;
begin
  foreach t in array array['profiles', 'staff', 'tickets', 'ticket_messages', 'catalog_jasa', 'catalog_paket', 'site_settings'] loop
    execute format('drop trigger if exists a_mfa_guard on public.%I', t);
    execute format('create trigger a_mfa_guard before insert or update or delete on public.%I for each statement execute function public.mfa_guard()', t);
  end loop;
end $$;

-- ---------- Cek hasil (opsional) ----------
-- select policyname, tablename from pg_policies where policyname like 'mfa_wajib%';
-- select event_object_table from information_schema.triggers where trigger_name = 'a_mfa_guard';

-- ---------- Membatalkan semuanya (kalau perlu) ----------
-- do $$ declare t text; begin
--   foreach t in array array['profiles','staff','tickets','ticket_messages','catalog_jasa','catalog_paket','site_settings'] loop
--     execute format('drop policy if exists mfa_wajib on public.%I', t);
--     execute format('drop trigger if exists a_mfa_guard on public.%I', t);
--   end loop; end $$;
-- drop policy if exists mfa_wajib_situs on storage.objects;
