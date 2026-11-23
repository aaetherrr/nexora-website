-- 014: ticket order boleh memilih lebih dari satu paket (jasa setup).
-- Nama paket digabung dengan " + " di kolom tickets.paket, jadi batas panjangnya dinaikkan.
-- Jalankan sekali di Supabase > SQL Editor setelah 013. Aman dijalankan ulang.
alter table public.tickets drop constraint if exists tickets_paket_check;
alter table public.tickets drop constraint if exists tickets_paket_len;
alter table public.tickets add constraint tickets_paket_len check (char_length(paket) <= 500);
