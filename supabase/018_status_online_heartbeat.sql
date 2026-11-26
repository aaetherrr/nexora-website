-- 018: Status online TANPA Realtime Authorization (menggantikan cara kerja channel privat di 015).
--  - Tab yang aktif mengirim "detak" tiap ~20 detik (fungsi ping_online). Online = detak terakhir < 60 detik lalu.
--  - Yang tampil ke lawan bicara cuma true/false. Waktu detak TIDAK pernah bisa dibaca customer/admin lain.
--  - Kalau akun menyembunyikan status (show_online = false), fungsi online_status mengembalikan null,
--    jadi lawan bicara tidak melihat apa pun (tidak bisa ditebak lewat API).
-- Jalankan sekali di Supabase > SQL Editor. Aman dijalankan ulang. Tidak perlu mengaktifkan apa pun di dashboard Supabase.

alter table public.profiles add column if not exists show_online boolean not null default true;
alter table public.profiles add column if not exists online_at timestamptz;
grant update (show_online) on public.profiles to authenticated;

-- Siapa yang boleh melihat status siapa, dan apakah pemiliknya mengizinkan (null = tidak berhak)
create or replace function public.online_pref(p_user uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select case
    when p_user = auth.uid() then (select coalesce(show_online, true) from public.profiles where id = p_user)
    when public.is_staff() and exists (select 1 from public.tickets where customer_id = p_user)
      then (select coalesce(show_online, true) from public.profiles where id = p_user)
    when exists (select 1 from public.tickets where customer_id = auth.uid() and handler_id = p_user)
      then (select coalesce(show_online, true) from public.profiles where id = p_user)
    else null
  end
$$;
revoke all on function public.online_pref(uuid) from public, anon;
grant execute on function public.online_pref(uuid) to authenticated;

-- Detak dari tab yang aktif (dibatasi 1x per 15 detik per akun)
create or replace function public.ping_online() returns void
language sql volatile security definer set search_path = public as $$
  update public.profiles set online_at = now()
   where id = auth.uid() and coalesce(show_online, true)
     and (online_at is null or online_at < now() - interval '15 seconds')
$$;
revoke all on function public.ping_online() from public, anon;
grant execute on function public.ping_online() to authenticated;

-- Keluar / tab ditutup / status dimatikan: langsung offline
create or replace function public.go_offline() returns void
language sql volatile security definer set search_path = public as $$
  update public.profiles set online_at = null where id = auth.uid() and online_at is not null
$$;
revoke all on function public.go_offline() from public, anon;
grant execute on function public.go_offline() to authenticated;

-- Status akun lain: true = online, false = offline, null = disembunyikan / tidak berhak melihat
create or replace function public.online_status(p_user uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select case when public.online_pref(p_user) is true
    then coalesce((select online_at > now() - interval '60 seconds' from public.profiles where id = p_user), false)
    else null end
$$;
revoke all on function public.online_status(uuid) from public, anon;
grant execute on function public.online_status(uuid) to authenticated;
