-- =====================================================================
-- NEXORA - Perbaikan login akun baru: "Database error saving new user"
-- Jalankan SEKALI di SQL Editor (setelah 007). Aman diulang.
--
-- Penyebab: 007 lama memakai {1,500} di aturan foto profil, padahal PostgreSQL hanya
-- mengizinkan pengulangan {m,n} sampai 255 ("invalid repetition count(s)"). Setiap akun
-- baru dari Google/Discord punya foto, jadi trigger error dan akun gagal dibuat.
-- Perbaikan: batasi panjang dengan char_length, dan foto bermasalah tidak lagi
-- bisa menggagalkan pembuatan akun.
-- =====================================================================

alter table public.profiles drop constraint if exists profiles_avatar_fmt;
alter table public.profiles add constraint profiles_avatar_fmt
  check (avatar_url is null or (char_length(avatar_url) <= 600
         and avatar_url ~ '^https://(lh[0-9]+\.googleusercontent\.com|cdn\.discordapp\.com)/[^[:space:]]+$'));

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare v text; n text; vi text;
begin
  v := coalesce(nullif(new.raw_user_meta_data->>'avatar_url', ''), nullif(new.raw_user_meta_data->>'picture', ''));
  begin
    if v is not null and (char_length(v) > 600
       or v !~ '^https://(lh[0-9]+\.googleusercontent\.com|cdn\.discordapp\.com)/[^[:space:]]+$') then v := null; end if;
  exception when others then v := null;
  end;
  n  := left(coalesce(nullif(new.raw_user_meta_data->>'full_name', ''),
                      nullif(new.raw_user_meta_data->>'name', ''),
                      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
                      'Customer'), 60);
  vi := initcap(coalesce(new.raw_app_meta_data->>'provider', ''));
  begin
    insert into public.profiles (id, nama, email, via, avatar_url)
    values (new.id, n, new.email, vi, v)
    on conflict (id) do nothing;
  exception when others then
    -- foto bermasalah tidak boleh menggagalkan pembuatan akun: simpan tanpa foto
    insert into public.profiles (id, nama, email, via)
    values (new.id, n, new.email, vi)
    on conflict (id) do nothing;
  end;
  return new;
end $$;
