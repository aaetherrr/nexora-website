-- 017: Ganti foto profil customer (tersimpan di Supabase, bukan cuma di browser).
--  - Foto diunggah ke bucket publik "avatar", satu folder per akun: avatar/<id akun>/<nama file>.jpg
--  - Alamat fotonya disimpan di profiles.foto_url (hanya boleh menunjuk ke folder akun sendiri).
--  - Foto yang dipilih customer menggantikan foto Google/Discord di dashboard dan di ticket (admin ikut melihat).
--  - Memperbaiki ticket baru yang tidak membawa foto customer (versi 010 menimpa versi 007).
-- Jalankan sekali di Supabase > SQL Editor setelah 016. Aman dijalankan ulang.

-- 1) kolom + aturan
alter table public.profiles add column if not exists foto_url text;
alter table public.profiles drop constraint if exists profiles_foto_fmt;
alter table public.profiles add constraint profiles_foto_fmt
  check (foto_url is null or (char_length(foto_url) <= 600
         and foto_url ~ '^https://[^/[:space:]]+/storage/v1/object/public/avatar/[0-9a-f-]{36}/[A-Za-z0-9._-]+$'));
grant update (foto_url) on public.profiles to authenticated;

-- foto_url hanya boleh menunjuk ke folder milik akun sendiri
create or replace function public.profiles_foto_bu() returns trigger
language plpgsql set search_path = public as $$
begin
  if current_user in ('authenticated', 'anon') and new.foto_url is distinct from old.foto_url
     and new.foto_url is not null and position('/avatar/' || auth.uid()::text || '/' in new.foto_url) = 0 then
    raise exception 'Foto profil harus berasal dari akunmu sendiri.';
  end if;
  return new;
end $$;
drop trigger if exists profiles_foto_bu on public.profiles;
create trigger profiles_foto_bu before update on public.profiles for each row execute function public.profiles_foto_bu();

-- 2) bucket foto (publik untuk dibaca, tulis hanya ke folder sendiri)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatar', 'avatar', true, 1048576, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = true, file_size_limit = 1048576, allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

drop policy if exists avatar_lihat on storage.objects;
drop policy if exists avatar_tulis on storage.objects;
drop policy if exists avatar_ubah  on storage.objects;
drop policy if exists avatar_hapus on storage.objects;
create policy avatar_lihat on storage.objects for select to authenticated
  using (bucket_id = 'avatar' and (storage.foldername(name))[1] = auth.uid()::text);
create policy avatar_tulis on storage.objects for insert to authenticated
  with check (bucket_id = 'avatar' and (storage.foldername(name))[1] = auth.uid()::text);
create policy avatar_ubah  on storage.objects for update to authenticated
  using (bucket_id = 'avatar' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'avatar' and (storage.foldername(name))[1] = auth.uid()::text);
create policy avatar_hapus on storage.objects for delete to authenticated
  using (bucket_id = 'avatar' and (storage.foldername(name))[1] = auth.uid()::text);

-- verifikasi 2 langkah (016) juga berlaku untuk bucket ini
do $$
begin
  drop policy if exists mfa_wajib_avatar on storage.objects;
  create policy mfa_wajib_avatar on storage.objects as restrictive for all to authenticated
    using (bucket_id <> 'avatar' or (select public.mfa_ok()));
exception when others then
  raise notice 'Aturan 2FA untuk bucket avatar dilewati (%). Bagian lain tetap berlaku.', sqlerrm;
end $$;

-- 3) ticket baru membawa foto customer (foto pilihan sendiri, kalau tidak ada: foto Google/Discord)
create or replace function public.tickets_bi() returns trigger
language plpgsql security definer set search_path = public as $$
declare p public.profiles; n int; pre text; nn bigint;
begin
  if auth.uid() is null then raise exception 'Kamu harus login dulu.'; end if;
  if public.is_staff() then raise exception 'Akun tim NEXORA tidak bisa membuka ticket sebagai customer.'; end if;
  select * into p from public.profiles where id = auth.uid();
  if p.id is null then raise exception 'Profil tidak ditemukan. Coba login ulang.'; end if;
  if coalesce(p.whatsapp, '') = '' then
    raise exception 'Isi nomor WhatsApp di menu Profil sebelum membuka ticket.';
  end if;
  select count(*) into n from public.tickets where customer_id = auth.uid() and not closed;
  if n >= 3 then raise exception 'Batas 3 ticket aktif tercapai. Tunggu salah satu ticket ditutup admin.'; end if;
  if new.kat = 'Order baru' then pre := 'O'; nn := nextval('public.ticket_seq_o');
  elsif new.kat = 'Bantuan' then pre := 'B'; nn := nextval('public.ticket_seq_b');
  elsif new.kat = 'Lainnya' then pre := 'L'; nn := nextval('public.ticket_seq_l');
  else pre := 'P'; nn := nextval('public.ticket_seq_p'); end if;
  new.id := pre || '-' || lpad(nn::text, 4, '0');
  new.customer_id := auth.uid();
  new.cust_nama := p.nama; new.cust_discord := p.discord_username; new.cust_wa := p.whatsapp;
  new.cust_avatar := coalesce(p.foto_url, p.avatar_url);
  new.st := 'Menunggu admin balas'; new.closed := false; new.closed_at := null; new.closed_by := null;
  new.dibuat := now(); new.diubah := now();
  return new;
end $$;
drop trigger if exists tickets_bi on public.tickets;
create trigger tickets_bi before insert on public.tickets for each row execute function public.tickets_bi();

-- 4) ganti foto = foto di semua ticket customer itu ikut berganti (dan ticket lama yang belum punya foto terisi)
create or replace function public.profiles_au_foto() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.foto_url is distinct from old.foto_url or new.avatar_url is distinct from old.avatar_url then
    update public.tickets set cust_avatar = coalesce(new.foto_url, new.avatar_url) where customer_id = new.id;
  end if;
  return null;
end $$;
drop trigger if exists profiles_au_foto on public.profiles;
create trigger profiles_au_foto after update on public.profiles for each row execute function public.profiles_au_foto();

update public.tickets t set cust_avatar = coalesce(p.foto_url, p.avatar_url)
  from public.profiles p where p.id = t.customer_id and t.cust_avatar is distinct from coalesce(p.foto_url, p.avatar_url);
