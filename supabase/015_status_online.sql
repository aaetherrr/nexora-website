-- 015: status online / offline di chat ticket (Supabase Realtime Presence).
--  - Pilihan "Tampilkan status online" disimpan di profiles.show_online (default nyala, untuk customer dan admin).
--  - Status online TIDAK disimpan di database: hidup di koneksi realtime, otomatis offline saat tab ditutup.
--  - Tiap akun mengumumkan keberadaannya di channel pribadi "nx-u:<id akun>".
--    Yang boleh melihat: akun itu sendiri, staf (untuk customer yang punya ticket),
--    dan customer (hanya untuk admin yang sedang menangani ticketnya).
-- Jalankan sekali di Supabase > SQL Editor setelah 014. Aman dijalankan ulang.

alter table public.profiles add column if not exists show_online boolean not null default true;
grant update (show_online) on public.profiles to authenticated;

-- Apakah akun p_user mau status onlinenya terlihat? (null = kamu tidak berhak melihatnya)
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

-- Aturan channel realtime privat (Realtime Authorization)
do $$
begin
  drop policy if exists "nx_presence_umumkan" on realtime.messages;
  create policy "nx_presence_umumkan" on realtime.messages for insert to authenticated
    with check (realtime.messages.extension = 'presence' and realtime.topic() = 'nx-u:' || auth.uid()::text);

  drop policy if exists "nx_presence_lihat" on realtime.messages;
  create policy "nx_presence_lihat" on realtime.messages for select to authenticated
    using (
      realtime.messages.extension = 'presence' and (
        realtime.topic() = 'nx-u:' || auth.uid()::text
        or (public.is_staff() and exists (select 1 from public.tickets t where 'nx-u:' || t.customer_id::text = realtime.topic()))
        or exists (select 1 from public.tickets t where t.customer_id = auth.uid() and 'nx-u:' || t.handler_id::text = realtime.topic())
      )
    );
exception when others then
  raise notice 'Aturan realtime.messages gagal dibuat (%). Aktifkan Realtime Authorization di Supabase lalu jalankan ulang file ini.', sqlerrm;
end $$;
