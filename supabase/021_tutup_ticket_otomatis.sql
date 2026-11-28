-- 021: Tutup ticket otomatis kalau tidak ada aktivitas chat selama 3 hari.
--
-- Aturan:
--   * Hanya ticket berstatus "Terhubung dengan admin", "Menunggu pembayaran", dan "Orderan Selesai".
--   * Kecuali "Orderan Selesai", pesan terakhir harus dari admin (artinya giliran customer yang membalas).
--     Kalau pesan terakhir dari customer, admin yang belum membalas, jadi ticket tidak pernah ditutup otomatis.
--   * Setelah 2 hari tanpa aktivitas muncul peringatan di chat; setelah 3 hari ticket ditutup dan muncul pesan sistem.
--   * Admin bisa mematikannya per ticket (saklar "Tutup otomatis" di panel info ticket).
--   * Tagihan tidak disentuh.
--
-- Tugas terjadwal memakai pg_cron (jalan tiap jam). Kalau pg_cron belum aktif di projectmu, aktifkan dulu di
-- Dashboard Supabase > Database > Extensions > pg_cron, lalu jalankan ulang file ini (aman dijalankan berulang).

alter table public.tickets add column if not exists jangan_tutup_otomatis boolean not null default false;

-- Trigger pesan: sama seperti versi 013, ditambah jalur untuk pesan sistem dari tugas terjadwal.
create or replace function public.ticket_messages_bi() returns trigger
language plpgsql security definer set search_path = public as $$
declare t public.tickets; s public.staff; av_ text;
begin
  -- pesan sistem dari tugas terjadwal (tutup ticket otomatis): tidak ada pengguna login, jadi dilewatkan lebih dulu
  if new.w = 's' and coalesce(current_setting('nx.sys_auto', true), '') = '1' then
    new.n := null; new.r := null; new.av := null; new.sender_id := null; new.dibuat := now();
    return new;
  end if;
  if auth.uid() is null then raise exception 'Kamu harus login dulu.'; end if;
  select * into t from public.tickets where id = new.ticket_id for update;
  if t.id is null then raise exception 'Ticket tidak ditemukan.'; end if;
  if t.closed then raise exception 'Ticket sudah ditutup, chat tidak bisa dikirim lagi.'; end if;
  select * into s from public.staff where user_id = auth.uid();
  new.av := null;
  if new.w = 'c' then
    if t.customer_id is distinct from auth.uid() then raise exception 'Tidak diizinkan.'; end if;
    new.n := null; new.r := null;
  elsif new.w = 's' and coalesce(current_setting('nx.sys_pin', true), '') = '1' then
    new.n := null; new.r := null;
  elsif new.w in ('a', 's') then
    if s.id is null then raise exception 'Hanya tim NEXORA yang bisa mengirim pesan ini.'; end if;
    if t.handler_nama is not null and t.handler_id is distinct from auth.uid() then
      raise exception 'Ticket ini sedang ditangani % . Ambil alih ticket dulu kalau kamu ingin membalas.', t.handler_nama;
    end if;
    av_ := (select avatar_url from public.profiles where id = auth.uid());
    new.n := s.nama; new.r := s.role;
    if new.w = 'a' then new.av := av_; end if;
    if t.handler_nama is null then
      update public.tickets
         set handler_id = auth.uid(), handler_nama = s.nama, handler_role = s.role, handler_av = av_
       where id = t.id;
    end if;
  else
    raise exception 'Jenis pesan tidak valid.';
  end if;
  new.sender_id := auth.uid(); new.dibuat := now();
  return new;
end $$;
drop trigger if exists ticket_messages_bi on public.ticket_messages;
create trigger ticket_messages_bi before insert on public.ticket_messages for each row execute function public.ticket_messages_bi();

-- Saklar admin per ticket: true = jangan tutup otomatis.
create or replace function public.atur_tutup_otomatis(p_ticket text, p_off boolean) returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'Kamu harus login dulu.'; end if;
  if not public.is_staff() then raise exception 'Hanya tim NEXORA yang bisa mengubah ini.'; end if;
  update public.tickets set jangan_tutup_otomatis = coalesce(p_off, false) where id = p_ticket and not closed;
end $$;
revoke all on function public.atur_tutup_otomatis(text, boolean) from public, anon;
grant execute on function public.atur_tutup_otomatis(text, boolean) to authenticated;

-- Pemeriksa: kirim peringatan (2 hari) dan tutup ticket (3 hari). Mengembalikan jumlah ticket yang ditutup.
create or replace function public.tutup_ticket_idle() returns int
language plpgsql security definer set search_path = public as $$
declare r record; l record; n int := 0;
begin
  for r in
    select id, st from public.tickets
     where not closed and not jangan_tutup_otomatis
       and st in ('Terhubung dengan admin', 'Menunggu pembayaran', 'Orderan Selesai')
  loop
    select id, w, dibuat into l from public.ticket_messages
     where ticket_id = r.id and w in ('c', 'a') order by id desc limit 1;
    if l.id is null then continue; end if;
    if r.st <> 'Orderan Selesai' and l.w <> 'a' then continue; end if;
    if l.dibuat <= now() - interval '3 days' then
      perform set_config('nx.sys_auto', '1', true);
      insert into public.ticket_messages (ticket_id, w, t)
        values (r.id, 's', 'Ticket ditutup otomatis karena tidak ada aktivitas selama 3 hari. Kamu bisa membuka ticket baru kapan saja.');
      perform set_config('nx.sys_auto', '', true);
      update public.tickets set closed = true, closed_at = now(), closed_by = 'Sistem (otomatis)', diubah = now() where id = r.id;
      n := n + 1;
    elsif l.dibuat <= now() - interval '2 days'
      and not exists (select 1 from public.ticket_messages w
                       where w.ticket_id = r.id and w.id > l.id and w.w = 's' and w.t like 'Ticket ini akan ditutup otomatis%') then
      perform set_config('nx.sys_auto', '1', true);
      insert into public.ticket_messages (ticket_id, w, t)
        values (r.id, 's', 'Ticket ini akan ditutup otomatis dalam 24 jam jika tidak ada balasan.');
      perform set_config('nx.sys_auto', '', true);
    end if;
  end loop;
  return n;
end $$;
revoke all on function public.tutup_ticket_idle() from public, anon, authenticated;

-- Jadwal: tiap jam.
do $$
begin
  create extension if not exists pg_cron;
  if exists (select 1 from cron.job where jobname = 'nexora_tutup_ticket_idle') then
    perform cron.unschedule('nexora_tutup_ticket_idle');
  end if;
  perform cron.schedule('nexora_tutup_ticket_idle', '0 * * * *', 'select public.tutup_ticket_idle()');
exception when others then
  raise notice 'pg_cron belum aktif. Aktifkan di Dashboard > Database > Extensions, lalu jalankan ulang file ini.';
end $$;
