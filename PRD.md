# SurveiKepuasan

---

## 1. Ringkasan & Tujuan Aplikasi
*Bagian ini menjelaskan gambaran umum proyek agar dipahami bersama oleh pemilik ide/klien dan tim pengembang.*
- **Nama Aplikasi**: SurveiKepuasan
- **Penjelasan Singkat**: Platform survey kepuasan masyarakat multi-rumah-sakit yang terdiri dari aplikasi mobile (Flutter) untuk responden masyarakat dan back-office web (Next.js) untuk pengelola rumah sakit. Setiap rumah sakit memiliki ID/kode unik, kuesioner independen, dan dasbor analitik tersendiri dengan pengawasan penuh dari Super Admin.
- **Masalah yang Diselesaikan**:
  - Survey kepuasan biasanya masih manual (form kertas) sehingga lambat direkap, rawan hilang, dan sulit dianalisis.
  - Rumah sakit tidak punya alat untuk membandingkan skor kepuasan antar unit layanan (IGD, Rawat Inap, Poli, Farmasi, dsb.) secara real-time.
  - Tidak ada sistem multi-tenant yang memungkinkan satu platform melayani banyak rumah sakit dengan data yang terisolasi.
  - Ulasan kualitatif responden (saran & keluhan) sering tidak terbaca karena menumpuk di tumpukan kertas.
  - Manajemen tidak memiliki jejak audit (audit trail) siapa yang membuat, mengubah, atau menonaktifkan sebuah survey.
- **Pengguna Aplikasi**:
  - **Responden Masyarakat** (mobile, anonim tanpa login): mengisi survey setelah menerima layanan.
  - **Petugas Survey** (mobile/web, login): membantu distribusi QR Code, memonitor respons di unit yang ditugaskan.
  - **Admin Rumah Sakit** (web back-office, login): mengelola kuesioner, unit layanan, periode, responden, dan laporan di RS-nya sendiri.
  - **Super Admin Platform** (web back-office, login): mengelola seluruh rumah sakit, pengguna lintas RS, dan perbandingan antar RS.
- **Target Keberhasilan**:
  - Minimal 100 respons terkumpul per rumah sakit per bulan pada 3 bulan pertama.
  - Rata-rata waktu pengisian survey < 3 menit per responden.
  - 100% rumah sakit terdaftar punya minimal 1 kuesioner aktif dengan periode berjalan.
  - Laporan PDF & Excel dapat dihasilkan < 10 detik untuk data 1 periode.
  - Tingkat kelengkapan ulasan kualitatif (responden mau mengisi saran) minimal 30%.
  - Audit trail tercatat 100% untuk setiap aksi Create/Update/Delete pada kuesioner, periode, dan unit layanan.

---

## 2. Batasan Pembuatan Sistem (Versi Awal MVP)
*Menegaskan fitur apa yang dikerjakan di versi awal dan apa yang sengaja ditunda agar aplikasi cepat selesai dan tidak membengkak.*

### ✅ Yang Dikerjakan:
- Multi-tenant rumah sakit dengan kode/ID unik dan isolasi data per tenant.
- Aplikasi mobile Flutter untuk responden anonim (pilih RS → isi survey → submit).
- Aplikasi mobile Flutter untuk Petugas Survey (login → scan QR → monitor respons unit).
- Back-office Next.js untuk Super Admin, Admin RS, dan Petugas Survey.
- Manajemen Kuesioner & Pertanyaan (Likert 1–5, multiple choice, isian singkat, esai).
- Manajemen Unit Layanan per rumah sakit.
- Manajemen Periode Survey (draft, aktif, ditutup).
- Manajemen Profil & ID Rumah Sakit.
- Manajemen Responden (data demografis ringan yang di-anonimkan).
- Dashboard Skor Kepuasan per RS dan lintas RS.
- Rekap per Unit Layanan, Tren Waktu, Perbandingan Antar Rumah Sakit.
- Export PDF & Excel.
- Analisis Ulasan Kualitatif (keyword & sentimen sederhana berbasis kamus).
- History Log / Audit Trail survey yang dibuat dan diubah.
- Generator & pemindai QR Code survey per unit layanan.
- Notifikasi email sederhana untuk admin RS (survey baru, periode hampir berakhir).
- Autentikasi Email & Password untuk semua role ber-login.

### ⛔ Yang Tidak Dikerjakan di Versi Awal:
- Integrasi Payment Gateway (SurveiKepuasan bukan aplikasi berbayar transaksional).
- Single Sign-On (SSO) dengan Google/Microsoft.
- Fitur kolaborasi real-time (multi-user mengedit 1 kuesioner bersamaan).
- Analisis sentimen berbasis LLM (cukup kamus kata kunci positif/negatif di MVP).
- Multi-bahasa (hanya Bahasa Indonesia).
- Notifikasi WhatsApp / SMS gateway (ditunda ke rilis berikutnya).
- Fitur gamifikasi responden (poin, undian, voucher).
- Integrasi SIMRS (Sistem Informasi Rumah Sakit) pihak ketiga.

---

## 3. Daftar Halaman & Struktur Menu (Pages & Routing)
*Daftar lengkap halaman yang harus dibuat, dikelompokkan berdasarkan area atau peran pengguna.*

### A. Web Publik (Tanpa Login) — Termasuk Jalur Fallback Survey Bagi RS Tanpa Instalasi Mobile
- `/` (Beranda Publik): Landing page platform SurveiKepuasan, penjelasan singkat, daftar RS mitra, tombol "Mulai Survey" & "Masuk Pengelola".
- `/pilih-rs` (Direktori Rumah Sakit): Daftar semua RS aktif dengan search bar, filter kota, kartu RS berisi logo + nama + jumlah unit layanan.
- `/s/[hospitalCode]` (Welcome RS): Halaman selamat datang khas 1 RS — logo, nama RS, alur pengisian, estimasi 3 menit, tombol "Mulai Sekarang".
- `/s/[hospitalCode]/survey` (Form Survey Web): Form multi-step (identitas demografis opsional → pilih unit → pertanyaan kepuasan → ulasan kualitatif).
- `/s/[hospitalCode]/selesai` (Konfirmasi Selesai): Halaman terima kasih dengan animasi sukses, ucapan apresiasi, dan tombol "Bagikan ke Orang Lain".
- `/faq`, `/privasi`, `/kontak`: Halaman informasi umum.

### B. Authentication Area (Email & Password)
- `/login`: Form login Email & Password untuk Super Admin, Admin RS, dan Petugas Survey (single entry, redirect otomatis sesuai role).
- `/forgot-password`: Form permintaan reset password.
- `/reset-password?token=...`: Form set password baru.

### C. Super Admin Area (`/admin`)
- `/admin/dashboard`: Ringkasan global (jumlah RS, total respons bulan ini, RS dengan skor tertinggi/terendah).
- `/admin/hospitals`: Tabel daftar rumah sakit (search, filter status, sort) + tombol "Tambah RS".
- `/admin/hospitals/new`: Form tambah RS (nama, kode unik, alamat, kontak, logo).
- `/admin/hospitals/[id]`: Detail RS (profil, ringkasan statistik, daftar admin RS).
- `/admin/hospitals/[id]/edit`: Form edit RS.
- `/admin/users`: Manajemen seluruh pengguna lintas RS (Super Admin, Admin RS, Petugas).
- `/admin/users/new`: Form tambah pengguna.
- `/admin/comparison`: Halaman perbandingan skor kepuasan antar rumah sakit (bar chart, tabel, filter periode & unit).
- `/admin/audit-logs`: Log aktivitas global semua RS dengan filter (RS, user, action, tanggal).
- `/admin/settings`: Pengaturan platform (kebijakan anonimitas, retensi data, template email).

### D. Hospital Admin Area (`/h/[hospitalCode]`)
- `/h/[code]/dashboard`: Dashboard skor kepuasan RS (KPI cards: total respons, rata-rata skor, NPS, unit terbaik/terburuk, tren 7 hari terakhir).
- `/h/[code]/questionnaires`: Tabel daftar kuesioner RS (search, filter status Draft/Aktif/Arsip).
- `/h/[code]/questionnaires/new`: Form builder kuesioner (multi-step: info dasar → kategori → pertanyaan → review).
- `/h/[code]/questionnaires/[id]`: Editor kuesioner (drag & drop urutan, edit kategori, tambah/hapus pertanyaan).
- `/h/[code]/questionnaires/[id]/preview`: Preview tampilan kuesioner di mobile dan web.
- `/h/[code]/periods`: Tabel periode survey (status: Draft/Aktif/Selesai).
- `/h/[code]/periods/new`: Form periode (nama, tanggal mulai–selesai, kuesioner yang dipakai, unit layanan yang disurvey).
- `/h/[code]/periods/[id]`: Detail periode (statistik progress, daftar responden, tombol close periode).
- `/h/[code]/units`: Tabel unit layanan RS (IGD, Poli Umum, Poli Gigi, Farmasi, Rawat Inap, dll.).
- `/h/[code]/units/new`: Form tambah unit layanan.
- `/h/[code]/respondents`: Tabel responden anonim (ID acak, usia, jenis kelamin, pendidikan, unit, waktu submit).
- `/h/[code]/responses`: Daftar seluruh respons terkumpul (filter periode, unit, rentang skor).
- `/h/[code]/responses/[id]`: Detail jawaban 1 respons (semua jawaban + ulasan kualitatif).
- `/h/[code]/reports/satisfaction`: Laporan Skor Kepuasan (per periode, indikator IKM/KepmenPANRB 14 unsur).
- `/h/[code]/reports/units`: Rekap per Unit Layanan (ranking skor, breakdown per pertanyaan).
- `/h/[code]/reports/trends`: Tren Waktu (grafik garis mingguan/bulanan, perbandingan periode).
- `/h/[code]/reports/reviews`: Analisis Ulasan Kualitatif (word cloud, daftar saran, filter sentimen).
- `/h/[code]/reports/export`: Halaman export (pilih periode & unit → Generate PDF atau Excel).
- `/h/[code]/qr-codes`: Manajemen QR Code (per unit, per periode, download PNG/PDF cetak).
- `/h/[code]/petugas`: Manajemen akun Petugas Survey RS.
- `/h/[code]/petugas/new`: Form tambah petugas.
- `/h/[code]/history-logs`: History Log kuesioner/periode/unit (siapa mengubah apa dan kapan, before-after diff).
- `/h/[code]/profile`: Edit profil RS (nama, alamat, kontak, logo, deskripsi singkat).
- `/h/[code]/settings`: Pengaturan RS (zona waktu, prefix ID, sanitasi data demografis).

### E. Petugas Survey Area (`/h/[code]/petugas/*` — Akses Terbatas)
- `/h/[code]/petugas/dashboard`: Dashboard ringkas unit yang ditugaskan (jumlah respons hari ini, tombol "Buka QR").
- `/h/[code]/petugas/responses`: Tabel respons khusus unit petugas (tanpa akses lintas unit).

### F. Aplikasi Mobile (Flutter) — Responden (Anonim)
- Splash Screen
- Onboarding (1 halaman cara pakai)
- Home: Scan QR Code & Pilih RS Manual
- Hospital Detail & Persetujuan (informed consent)
- Form Survey Multi-Step
- Halaman Terima Kasih
- Halaman Riwayat Lokal (cache 3 survey terakhir, opsional)

### G. Aplikasi Mobile (Flutter) — Petugas Survey (Login)
- Login
- Petugas Dashboard
- QR Code Viewer
- Live Responses (Auto-refresh)

---

## 4. Pedoman UI/UX & Design System
*Panduan visual konkret agar AI coding assistant tidak membuat UI yang kaku atau default.*
- **Skema Warna**:
  - Primary: `hsl(174, 72%, 40%)` (Teal 40% — nuansa kesehatan, tenang, tepercaya)
  - Primary Foreground: `hsl(0, 0%, 100%)`
  - Secondary: `hsl(174, 60%, 96%)` (Tint teal sangat muda)
  - Accent (untuk skor tinggi): `hsl(142, 71%, 45%)` (Emerald)
  - Warning (skor sedang): `hsl(38, 92%, 50%)` (Amber)
  - Danger (skor rendah): `hsl(0, 84%, 60%)` (Red)
  - Background: `hsl(210, 20%, 98%)`
  - Muted: `hsl(210, 16%, 93%)`
  - Foreground: `hsl(215, 25%, 15%)`
  - Border: `hsl(214, 20%, 89%)`
- **Tipografi**:
  - Heading: `Plus Jakarta Sans` (700, 600) — modern, ramah, mudah dibaca pada angka besar.
  - Body & UI: `Inter` (400, 500) — netral dan jelas.
  - Angka statistik (KPI cards): `Inter` dengan `font-variant-numeric: tabular-nums`.
- **Aturan Komponen**:
  - Sudut membulat: `rounded-2xl` untuk Card utama & modal, `rounded-xl` untuk tombol, `rounded-lg` untuk input.
  - Shadow: `shadow-sm` default, `shadow-md` saat hover, `shadow-lg` untuk dialog/modal.
  - Warna border tipis `1px` selalu dipakai pada Card untuk kesan bersih dan "klinis".
  - Setiap angka skor menggunakan badge berwarna dinamis (Emerald/Amber/Red) berdasarkan threshold.
  - Grafik (Recharts/Shadcn Charts) menggunakan warna primary + accent, konsep minimalis tanpa gridline tebal.
- **Vibe & Nuansa**:
  - **Web Back-Office**: Profesional, banyak whitespace, density data sedang, sidebar ramping, breadcrumb selalu tampil. Fokus pada kecepatan scanning data.
  - **Mobile App**: Bersih, besar, satu aksi per layar. Emoji/badge untuk feedback mikro. Layout 1 kolom untuk survey. Tombol besar dengan `minHeight: 56`.
  - Micro-animations: fade-in pada KPI cards, transition pada step survey, ripple effect pada tombol mobile.
  - Ikonografi: Lucide Icons untuk web, Lucide Icons (flutter package `lucide_icons`) untuk mobile.
  - Dark mode: Didukung penuh di web back-office (class-based), mobile mengikuti `ThemeMode.system`.

---

## 5. Pembagian Hak Akses Pengguna
*Tabel hak akses yang menentukan siapa saja yang boleh melihat, mengedit, atau mengelola data.*

| Menu / Halaman | Responden (Publik, Anonim) | Petugas Survey | Admin RS | Super Admin |
| :--- | :---: | :---: | :---: | :---: |
| Beranda & Direktori RS (`/`, `/pilih-rs`) | ✅ | ✅ | ✅ | ✅ |
| Form Survey Web (`/s/[code]/survey`) | ✅ | ✅ | ✅ | ✅ |
| Halaman Admin Global (`/admin/*`) | ❌ | ❌ | ❌ | ✅ |
| Kelola Rumah Sakit (`/admin/hospitals`) | ❌ | ❌ | ❌ | ✅ |
| Perbandingan Antar RS (`/admin/comparison`) | ❌ | ❌ | ❌ | ✅ |
| Audit Log Global (`/admin/audit-logs`) | ❌ | ❌ | ❌ | ✅ |
| Dashboard RS (`/h/[code]/dashboard`) | ❌ | ⚠️ (unit sendiri) | ✅ | ✅ |
| Manajemen Kuesioner (`/h/[code]/questionnaires`) | ❌ | ❌ | ✅ | ✅ |
| Manajemen Unit Layanan (`/h/[code]/units`) | ❌ | ❌ | ✅ | ✅ |
| Manajemen Periode (`/h/[code]/periods`) | ❌ | ❌ | ✅ | ✅ |
| Manajemen Responden (`/h/[code]/respondents`) | ❌ | ⚠️ (unit sendiri) | ✅ | ✅ |
| Detail Respons (`/h/[code]/responses/[id]`) | ❌ | ⚠️ (unit sendiri) | ✅ | ✅ |
| Laporan & Export (`/h/[code]/reports/*`) | ❌ | ❌ | ✅ | ✅ |
| QR Code Unit (`/h/[code]/qr-codes`) | ❌ | ⚠️ (generate hanya unit sendiri) | ✅ | ✅ |
| History Log RS (`/h/[code]/history-logs`) | ❌ | ❌ | ✅ | ✅ |
| Kelola Akun Petugas (`/h/[code]/petugas`) | ❌ | ❌ | ✅ | ✅ |
| Profil & Setting RS (`/h/[code]/profile`, `/h/[code]/settings`) | ❌ | ❌ | ✅ | ✅ |

Keterangan: ✅ = akses penuh; ⚠️ = akses terbatas (dibatasi `unit_id` yang ditugaskan); ❌ = tidak punya akses.

---

## 6. Alur Kerja dan Fitur Utama
*Menjelaskan cara kerja setiap fitur utama dalam bahasa yang mudah dipahami serta aturan logikanya.*

### A. Manajemen Rumah Sakit Multi-Tenant (Super Admin)
1. **Cara Kerja**:
   - Super Admin membuka `/admin/hospitals` dan menekan tombol "Tambah RS".
   - Mengisi nama RS, kode unik (mis. `RSUD-CIANJUR`), kota, kontak, dan mengunggah logo.
   - Sistem membuat tenant baru dan Super Admin otomatis membuat akun Admin RS pertama.
   - Kode unik RS langsung dapat diakses di `https://surveikepuasan.id/s/RSUD-CIANJUR` dan disematkan pada QR Code.
2. **Aturan Sistem**:
   - Kode RS wajib unik, hanya boleh huruf kapital, angka, dan tanda hubung (`-`), panjang 3–20 karakter.
   - Kode RS tidak dapat diubah setelah dibuat untuk menjaga validitas QR Code yang sudah dicetak.
   - Semua tabel data operasional (kuesioner, unit, responden, respons) wajib memiliki kolom `hospital_id` sebagai pembatas tenant.
   - Super Admin wajib bisa menonaktifkan RS tanpa menghapus data historis.

### B. Manajemen Pengguna & Role (Email & Password)
1. **Cara Kerja**:
   - Pengguna login melalui `/login` menggunakan Email & Password.
   - Setelah login, sistem mengarahkan: Super Admin ke `/admin/dashboard`, Admin RS ke `/h/[code]/dashboard`, Petugas Survey ke `/h/[code]/petugas/dashboard`.
   - Admin RS dapat menambah Petugas Survey melalui `/h/[code]/petugas/new`; Petugas menerima email invitation berisi link aktivasi (set password pertama).
2. **Aturan Sistem**:
   - Password minimal 8 karakter, wajib mengandung huruf & angka, di-hash dengan bcrypt (cost 12).
   - Email harus unik lintas platform (satu email hanya satu akun).
   - 5 kali gagal login berturut-turut → akun terkunci 15 menit.
   - Reset password via token berumur 60 menit.

### C. Manajemen Kuesioner & Pertanyaan
1. **Cara Kerja**:
   - Admin RS membuka `/h/[code]/questionnaires/new`.
   - Mengisi judul, deskripsi singkat (disclaimer ke responden), lalu memilih template (mis. template IKM KepmenPANRB 14 unsur) atau membuat dari nol.
   - Menambah kategori (mis. "Keandalan", "Responsif"), lalu menambah pertanyaan pada tiap kategori.
   - Setiap pertanyaan memiliki tipe: **Likert 1–5** (Puas/Sangat Puas), **Pilihan Ganda**, **Isian Singkat**, atau **Esai**.
   - Setelah selesai, Admin menekan "Publikasikan Kuesioner".
2. **Aturan Sistem**:
   - Kuesioner yang sudah punya respons tidak dapat dihapus, hanya dapat di-archive.
   - Setiap kuesioner memiliki `version` yang naik +1 setiap kali diubah setelah publikasi.
   - Jumlah pertanyaan minimal 1, maksimal 50 per kuesioner.
   - Bobot pertanyaan default 1; admin bisa mengubah bobot untuk pertanyaan tertentu (0.5–2).
   - Pertanyaan wajib minimal 1 dalam kuesioner aktif.

### D. Manajemen Unit Layanan RS
1. **Cara Kerja**:
   - Admin RS membuka `/h/[code]/units`, menambahkan unit layanan (IGD, Poli Umum, Poli Gigi, Farmasi, Laboratorium, Rawat Inap, Radiologi, dll.).
   - Setelah unit dibuat, masing-masing unit bisa memiliki QR Code sendiri.
2. **Aturan Sistem**:
   - Nama unit wajib unik di satu RS.
   - Unit memiliki `code` singkat (mis. `IGD`, `POLI-UM`) untuk penamaan QR.
   - Menonaktifkan unit tidak menghapus data respons historis.
   - Satu RS minimal harus punya 1 unit layanan aktif.

### E. Manajemen Periode Survey
1. **Cara Kerja**:
   - Admin RS membuka `/h/[code]/periods/new`.
   - Mengisi nama periode (mis. "Triwulan I 2025"), tanggal mulai, tanggal selesai, memilih kuesioner aktif, dan memilih unit layanan yang disurvey.
   - Periode berstatus **Draft** → **Aktif** → **Selesai**.
   - Saat periode Aktif, responden dapat mengirim jawaban; saat Selesai, pengiriman baru akan ditolak.
2. **Aturan Sistem**:
   - Tanggal mulai < tanggal selesai, dan tidak boleh bertumpang tindih dengan periode aktif lain dengan kuesioner yang sama di RS yang sama.
   - Saat Admin menutup periode, sistem menandai semua respons di periode tersebut `is_locked = true` (tidak dapat diubah/dihapus).
   - Setiap perubahan status periode tercatat otomatis di `survey_history_logs`.

### F. Manajemen Responden (Anonim)
1. **Cara Kerja**:
   - Responden mengisi survey tanpa login.
   - Sistem memberikan `respondent_code` acak (mis. `RES-2025-000123`) sebagai identitas unik untuk keperluan audit internal, tapi tidak menyimpan nama, NIK, atau kontak.
   - Admin RS dapat melihat daftar responden di `/h/[code]/respondents` dengan data: usia (rentang 5 tahunan), jenis kelamin, pendidikan, pekerjaan, unit yang dikunjungi, waktu submit.
2. **Aturan Sistem**:
   - Semua kolom demografis bersifat opsional (bisa "Tidak Diisi") untuk menjaga anonimitas.
   - IP address responden disimpan sebagai hash SHA-256, bukan plaintext, hanya untuk mendeteksi spam.
   - Rate-limit: 1 IP maksimal 5 submission per jam.
   - Seorang responden boleh mengisi lebih dari satu survey (misal kunjungan berbeda), namun sistem menyimpan `session_fingerprint` untuk mencegah submit ganda beruntun pada periode & unit yang sama (opsional, dapat dinyalakan/dimatikan di `/h/[code]/settings`).

### G. Pengisian Survey oleh Responden (Mobile Aplikasi & Web Fallback)
1. **Cara Kerja**:
   - Responden membuka aplikasi mobile SurveiKepuasan atau scan QR Code yang ada di unit layanan.
   - Sistem menampilkan halaman detail RS & informed consent ("Data Anda aman dan anonim. Waktu pengisian ± 3 menit.").
   - Responden memilih unit layanan yang dikunjungi (bisa dipilih otomatis jika masuk dari QR unit).
   - Mengisi data demografis opsional (usia, jenis kelamin, pendidikan).
   - Menjawab pertanyaan kepuasan pada kuesioner aktif.
   - Mengisi ulasan kualitatif (saran/keluhan).
   - Menekan tombol "Kirim Survey" → tampil halaman terima kasih.
2. **Aturan Sistem**:
   - Survey tidak bisa dikirim jika ada pertanyaan wajib yang kosong.
   - Progress bar mengikuti jumlah pertanyaan yang telah dijawab.
   - Data disimpan di local storage mobile (draft) agar responden tidak kehilangan isian bila koneksi terputus.
   - Setelah submit, sistem mencatat `hospital_id`, `period_id`, `unit_id`, `questionnaire_id`, `submitted_at`, dan seluruh jawaban pada `survey_answers`.
   - Semua submit dan perubahan pada kuesioner/periode otomatis tercatat pada tabel `activity_logs` dan `survey_history_logs`.

### H. Dashboard & Analitik
1. **Cara Kerja**:
   - **Dashboard Skor Kepuasan**: Menampilkan rata-rata skor kepuasan (0–100), jumlah respons, NPS (Net Promoter Score), unit dengan skor tertinggi & terendah, tren 7 hari terakhir.
   - **Rekap per Unit Layanan**: Tabel skor per unit dengan ranking, filter periode, drill-down ke jawaban tiap pertanyaan.
   - **Tren Waktu Survey**: Grafik garis per minggu/bulan, dapat dibandingkan antar periode.
   - **Perbandingan Antar Rumah Sakit** (khusus Super Admin): bar chart skor per RS, tabel ranking.
   - **Analisis Ulasan Kualitatif**: Word cloud, daftar saran terurut berdasarkan kata kunci, filter sentimen (Positif/Netral/Negatif berbasis kamus kata).
   - **Export PDF & Excel**: Generate laporan siap cetak.
2. **Aturan Sistem**:
   - Skor kepuasan dihitung dari rata-rata jawaban Likert per pertanyaan, dikonversi ke skala 0–100.
   - Data agregat dashboard di-cache 5 menit untuk mengurangi beban query.
   - Hanya Admin RS & Super Admin yang bisa melakukan export.
   - Export dibatasi maksimal 5 file per menit per pengguna (rate limit).

### I. Generator QR Code
1. **Cara Kerja**:
   - Admin RS membuka `/h/[code]/qr-codes`, memilih unit & periode, lalu menekan "Generate QR".
   - Sistem membuat QR Code yang berisi URL: `https://surveikepuasan.id/s/[hospitalCode]?unit=[unitCode]&period=[periodId]`.
   - QR dapat diunduh sebagai PNG atau PDF siap cetak (dengan logo RS & teks ajakan).
2. **Aturan Sistem**:
   - QR Code hanya dapat dibuat untuk unit yang aktif.
   - Setiap scan QR yang membuka survey mencacah kolom `scan_count` untuk statistik.
   - Jika responden masuk via QR unit, langkah "Pilih unit" dilewati otomatis.

### J. History Log / Audit Trail
1. **Cara Kerja**:
   - Setiap aksi pada entitas penting (kuesioner, periode, unit, RS, pengguna) dicatat di tabel `survey_history_logs` dan `activity_logs`.
   - Admin RS dapat melihat riwayat perubahan pada `/h/[code]/history-logs`, lengkap dengan diff before/after.
   - Super Admin melihat semua log di `/admin/audit-logs`.
2. **Aturan Sistem**:
   - Log wajib mencatat: `actor_user_id`, `hospital_id`, `entity_type`, `entity_id`, `action` (CREATE/UPDATE/DELETE/PUBLISH/CLOSE), `before_json`, `after_json`, `ip_address`, `user_agent`, `created_at`.
   - Log tidak dapat dihapus/diedit oleh siapapun kecuali Super Admin platform.
   - Field kritis yang diubah (mis. status periode) selalu disertai `notes` opsional dari pengubah.

### K. Notifikasi Email
1. **Cara Kerja**:
   - Admin RS langsung menerima email saat: periode survey dibuat, periode memasuki 3 hari terakhir, dan periode otomatis selesai.
   - Super Admin menerima email rekap mingguan seluruh RS.
2. **Aturan Sistem**:
   - Email dikirim melalui provider SMTP (mis. Resend/Mailtrap untuk development, Gmail Workspace untuk production).
   - Pengiriman async melalui job queue sederhana (drizzle + cron, atau Trigger.dev/Inngest).

---

## 7. Alur Navigasi & Arsitektur Layout
*Peta navigasi alur halaman dan struktur tata letak (layout).*

### Arsitektur Layout (Persisten)
- **Public Layout (Web)**: Navbar atas sticky dengan logo, tautan "Pilih RS", "FAQ", "Masuk Pengelola"; Footer dengan legal & kontak. Background putih, container maksimal 1200px.
- **Auth Layout**: Tanpa navbar & sidebar, layout terpusat (card di tengah), ilustrasi minimal di sisi kiri desktop.
- **Back-Office Dashboard Layout**: Sidebar kiri fixed (collapsible di mobile menjadi drawer), header kecil atas berisi breadcrumb + user menu + notifikasi bell.
- **Mobile App Layout (Flutter)**: Tanpa sidebar, menggunakan bottom navigation (2–3 tab) dan tombol besar. Bottom sheet untuk pilihan. Navigasi survey menggunakan `PageView` multi-step.
- **Tenant Context Bar**: Di area Admin RS, bagian atas header menampilkan kode RS aktif (`RSUD-CIANJUR`) sebagai jangkar identitas.

### Bagan Alur (Flowchart)
```mermaid
flowchart TD
    A[Responden Masyarakat] --> B{Pilih Channel}
    B -->|Scan QR Unit| C[Halaman Detail RS di Mobile App]
    B -->|Buka App Manual| D[Pilih RS dari Direktori]
    B -->|Web Fallback| E[/s/hospitalCode/]
    C --> F[Informed Consent]
    D --> F
    E --> F
    F --> G{Login?}
    G -- Tidak, Anonim --> H[Isi Data Demografis Opsional]
    G -- Ya (Petugas Mode) --> I[Petugas Dashboard]
    H --> J[Pilih Unit Layanan]
    J --> K[Isi Pertanyaan Likert & Pilihan]
    K --> L[Isi Ulasan Kualitatif]
    L --> M[Submit Survey]
    M --> N[(Simpan ke MySQL)]
    N --> O[Log activity_logs & survey_history_logs]
    N --> P[Halaman Terima Kasih]
    P --> Q[Selesai]

    subgraph Admin Flow
        R[Super Admin] --> S[/admin/dashboard/]
        S --> T[/admin/hospitals/]
        S --> U[/admin/comparison/]
        S --> V[/admin/audit-logs/]

        W[Admin RS] --> X[/h/code/dashboard/]
        X --> Y[Manajemen Kuesioner]
        X --> Z[Manajemen Periode]
        X --> AA[Manajemen Unit Layanan]
        X --> AB[Manajemen Responden]
        X --> AC[Laporan & Export]
        X --> AD[History Log]
        X --> AE[QR Code]
    end
```

---

## 8. Kebutuhan Non-Fungsional (SEO, Keamanan, & Performa)
*Syarat wajib agar website siap rilis ke publik (production-ready).*
- **SEO**:
  - Wajib menggunakan tag `<title>` dinamis, meta description, dan Open Graph (OG) tags di setiap halaman publik (`/`, `/pilih-rs`, `/s/[hospitalCode]`, `/faq`).
  - Generate `sitemap.xml` otomatis & `robots.txt` yang menutup area `/admin`, `/h`, dan endpoint API.
  - Struktur heading semantik (satu `<h1>` per halaman), schema.org `MedicalOrganization` untuk halaman RS.
- **Keamanan**:
  - Password di-hash dengan bcrypt (cost factor 12).
  - Wajib implementasi proteksi CSRF (double-submit cookie) untuk semua Server Actions.
  - Sanitasi input untuk mencegah XSS (semua ulasan kualitatif disanitasi via `DOMPurify` sebelum dirender).
  - Validasi sisi server (Zod schema) untuk semua payload.
  - Middleware role-based access di Next.js — verifikasi `hospital_id` di setiap query agar tidak ada data leak antar tenant (multi-tenant isolation).
  - Rate-limiting pada endpoint publik: 5 submission/jam/IP dan 60 request/menit/IP global.
  - JWT untuk API mobile, expired 24 jam, refresh token 30 hari.
  - Semua transport menggunakan HTTPS; cookie `Secure`, `HttpOnly`, `SameSite=Lax`.
  - Audit trail tidak dapat dihapus (append-only policy).
- **Performa**:
  - Optimasi gambar via `<Image>` Next.js dan format WebP/AVIF.
  - Lazy loading komponen berat (Chart, PDF generator) menggunakan dynamic import.
  - Indexing MySQL pada kolom pencarian & filter utama: `(hospital_id, period_id)`, `(hospital_id, unit_id, submitted_at)`, `(actor_user_id, created_at)`.
  - Caching response agregat dashboard 5 menit (in-memory LRU + revalidate tag).
  - Pagination server-side untuk semua tabel (default 20 baris).
  - Batch insert untuk `survey_answers` (satu query untuk semua jawaban).
  - Target Lighthouse Performance ≥ 90 pada halaman publik.

---

## 9. Panduan Bahasa, Copywriting, & Data Dummy
*Panduan nada bicara (Tone of Voice) dan contoh data agar prototipe terasa nyata.*
- **Gaya Bahasa**: Profesional, ramah, dan membumi. Gunakan kata "Anda" untuk responden, "Bapak/Ibu" untuk pengelola. Hindari jargon IT di sisi responden. Contoh nada: "Terima kasih, Andi! Masukan Anda sangat berarti untuk RSUD Cianjur."
- **Instruksi Data Dummy**: JANGAN PERNAH MENGGUNAKAN "Lorem Ipsum". Selalu gunakan data dummy berbahasa Indonesia yang relevan. Berikut contoh spesifik:
  - **Rumah Sakit**: "RSUD Cianjur", "RS Umum Daerah Karawang", "RSUD Kota Bandung", "RS Siloam Semanggi", "RSUD dr. Soetomo", "RS Hasan Sadikin".
  - **Kode RS**: `RSUD-CIANJUR`, `RSUD-KARAWANG`, `RSUD-BANDUNG`, `SILOAM-SMG`, `RSUD-SOETOMO`, `RSHS`.
  - **Unit Layanan**: "Instalasi Gawat Darurat (IGD)", "Poli Umum", "Poli Gigi & Mulut", "Poli Anak", "Poli Kandungan", "Instalasi Farmasi", "Laboratorium Klinik", "Radiologi", "Rawat Inap Kelas III", "Rawat Inap VIP", "Administrasi & Pendaftaran".
  - **Pertanyaan Likert**: "Bagaimana kemudahan proses pendaftaran/pendaftaran ulang?" dengan opsi "Sangat Tidak Puas" hingga "Sangat Puas".
  - **Ulasan Responden**: "Pelayanan dokter Poli Anak cepat dan ramah, tapi ruang tunggu agak panas.", "Antrian di IGD sudah cukup cepat, perawat tanggap.", "Loket farmasi kurang informatif, saya menunggu lama tanpa penjelasan.", "Dokter sangat profesional dan menjelaskan kondisi saya dengan detail."
  - **Nama Admin RS**: "Dr. Ratna Kusuma", "Bambang Setiawan, S.Kom.", "Ns. Sri Wahyuni".
  - **Nama Petugas Survey**: "Anisa Fitria", "Rizky Ramadhan", "Dewi Lestari".
  - **Nama Super Admin**: "Hendra Wijaya".
  - **Periode**: "Triwulan I 2025 (Januari – Maret 2025)", "Semester I 2025", "Pasca-Renovasi Poli 2025".
  - **Kategori Kuesioner**: "Persyaratan & Prosedur", "Kecepatan Layanan", "Kewajaran Biaya", "Keramahan Petugas", "Kualitas Fasilitas & Lingkungan".

---

## 10. Fondasi Teknis (Untuk Tim Pengembang / Programmer & AI)
*Petunjuk arsitektur teknis spesifik.*

- **Mobile App (Responden & Petugas)**: Flutter 3.24+ (Dart 3.x) dengan **Riverpod** untuk state management, **go_router** untuk navigasi, **dio** untuk HTTP, **mobile_scanner** untuk scan QR, **shared_preferences** untuk storage draf.
- **Back-Office Web**: Next.js 15 (App Router, Server Actions, RSC) + TypeScript 5.x.
- **Tampilan Antarmuka (UI)**: Tailwind CSS 4 + shadcn/ui Component Library + Lucide Icons + Recharts untuk grafik + TanStack Table untuk tabel data.
- **Autentikasi**: **NextAuth.js (Auth.js v5)** dengan Credentials Provider (Email & Password) di web; **JWT (jsonwebtoken) + bcrypt** untuk API yang di-consume aplikasi Flutter.
- **Basis Data (Database)**: **MySQL 8.x** (production) / MariaDB 10.6+ (opsional), diakses melalui **Drizzle ORM (mysql2 driver)**. Migrasi via **drizzle-kit**.
- **Background Jobs**: **cron** built-in Next.js route handler untuk auto-close periode + notifikasi email.
- **Email Provider**: Nodemailer + SMTP (Resend / Mailtrap untuk dev).
- **File Storage**: Local S3-compatible (MinIO) untuk logo RS & file export PDF/Excel.

### Struktur Skema Database Nyata
*(Drizzle ORM - schema.ts, MySQL)*
```typescript
import {
  mysqlTable, varchar, int, text, timestamp, boolean, decimal,
  mysqlEnum, json, index, uniqueIndex, bigint
} from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

export const hospitals = mysqlTable('hospitals', {
  id: varchar('id', { length: 26 }).primaryKey(),
  code: varchar('code', { length: 20 }).notNull().unique(),
  name: varchar('name', { length: 150 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  address: text('address'),
  phone: varchar('phone', { length: 30 }),
  email: varchar('email', { length: 150 }),
  logoUrl: varchar('logo_url', { length: 255 }),
  description: text('description'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, (t) => ({
  codeIdx: uniqueIndex('idx_hospitals_code').on(t.code),
}));

export const users = mysqlTable('users', {
  id: varchar('id', { length: 26 }).primaryKey(),
  hospitalId: varchar('hospital_id', { length: 26 }), // NULL untuk Super Admin
  email: varchar('email', { length: 150 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  fullName: varchar('full_name', { length: 120 }).notNull(),
  role: mysqlEnum('role', ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'FIELD_OFFICER']).notNull(),
  assignedUnitId: varchar('assigned_unit_id', { length: 26 }), // khusus FIELD_OFFICER
  isActive: boolean('is_active').default(true).notNull(),
  lastLoginAt: timestamp('last_login_at'),
  failedLoginAttempts: int('failed_login_attempts').default(0).notNull(),
  lockedUntil: timestamp('locked_until'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, (t) => ({
  emailIdx: uniqueIndex('idx_users_email').on(t.email),
  roleHospitalIdx: index('idx_users_role_hospital').on(t.role, t.hospitalId),
}));

export const serviceUnits = mysqlTable('service_units', {
  id: varchar('id', { length: 26 }).primaryKey(),
  hospitalId: varchar('hospital_id', { length: 26 }).notNull(),
  code: varchar('code', { length: 20 }).notNull(),
  name: varchar('name', { length: 120 }).notNull(),
  description: text('description'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, (t) => ({
  uniqCodePerHospital: uniqueIndex('idx_units_hospital_code').on(t.hospitalId, t.code),
}));

export const surveyPeriods = mysqlTable('survey_periods', {
  id: varchar('id', { length: 26 }).primaryKey(),
  hospitalId: varchar('hospital_id', { length: 26 }).notNull(),
  name: varchar('name', { length: 150 }).notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  status: mysqlEnum('status', ['DRAFT', 'ACTIVE', 'CLOSED']).default('DRAFT').notNull(),
  createdBy: varchar('created_by', { length: 26 }).notNull(),
  closedAt: timestamp('closed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, (t) => ({
  hospitalStatusIdx: index('idx_periods_hospital_status').on(t.hospitalId, t.status),
  dateRangeIdx: index('idx_periods_dates').on(t.hospitalId, t.startDate, t.endDate),
}));

export const questionnaires = mysqlTable('questionnaires', {
  id: varchar('id', { length: 26 }).primaryKey(),
  hospitalId: varchar('hospital_id', { length: 26 }).notNull(),
  periodId: varchar('period_id', { length: 26 }),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  version: int('version').default(1).notNull(),
  status: mysqlEnum('status', ['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT').notNull(),
  publishedAt: timestamp('published_at'),
  createdBy: varchar('created_by', { length: 26 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, (t) => ({
  hospitalPeriodIdx: index('idx_questionnaires_hospital_period').on(t.hospitalId, t.periodId, t.status),
}));

export const questionCategories = mysqlTable('question_categories', {
  id: varchar('id', { length: 26 }).primaryKey(),
  questionnaireId: varchar('questionnaire_id', { length: 26 }).notNull(),
  name: varchar('name', { length: 150 }).notNull(),
  weight: decimal('weight', { precision: 5, scale: 2 }).default('1.00').notNull(),
  orderIndex: int('order_index').notNull(),
});

export const questions = mysqlTable('questions', {
  id: varchar('id', { length: 26 }).primaryKey(),
  questionnaireId: varchar('questionnaire_id', { length: 26 }).notNull(),
  categoryId: varchar('category_id', { length: 26 }),
  text: text('text').notNull(),
  type: mysqlEnum('type', ['LIKERT_5', 'MULTIPLE_CHOICE', 'SHORT_TEXT', 'LONG_TEXT']).notNull(),
  optionsJson: json('options_json'), // untuk MULTIPLE_CHOICE
  isRequired: boolean('is_required').default(true).notNull(),
  weight: decimal('weight', { precision: 5, scale: 2 }).default('1.00').notNull(),
  orderIndex: int('order_index').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const respondents = mysqlTable('respondents', {
  id: varchar('id', { length: 26 }).primaryKey(),
  code: varchar('code', { length: 30 }).notNull().unique(), // RES-2025-xxxxxx
  hospitalId: varchar('hospital_id', { length: 26 }).notNull(),
  periodId: varchar('period_id', { length: 26 }).notNull(),
  unitId: varchar('unit_id', { length: 26 }).notNull(),
  ageRange: varchar('age_range', { length: 20 }), // '17-25', '26-35', dst
  gender: mysqlEnum('gender', ['MALE', 'FEMALE', 'OTHER', 'UNSPECIFIED']).default('UNSPECIFIED'),
  education: varchar('education', { length: 50 }),
  occupation: varchar('occupation', { length: 80 }),
  ipHash: varchar('ip_hash', { length: 64 }),
  sessionFingerprint: varchar('session_fingerprint', { length: 64 }),
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
}, (t) => ({
  hospitalPeriodIdx: index('idx_respondents_hospital_period').on(t.hospitalId, t.periodId),
  unitIdx: index('idx_respondents_unit').on(t.unitId, t.submittedAt),
}));

export const surveyResponses = mysqlTable('survey_responses', {
  id: varchar('id', { length: 26 }).primaryKey(),
  hospitalId: varchar('hospital_id', { length: 26 }).notNull(),
  periodId: varchar('period_id', { length: 26 }).notNull(),
  questionnaireId: varchar('questionnaire_id', { length: 26 }).notNull(),
  respondentId: varchar('respondent_id', { length: 26 }).notNull(),
  unitId: varchar('unit_id', { length: 26 }).notNull(),
  overallScore: decimal('overall_score', { precision: 5, scale: 2 }), // 0-100
  npsScore: int('nps_score'), // 0-10
  isLocked: boolean('is_locked').default(false).notNull(),
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
}, (t) => ({
  hospitalPeriodIdx: index('idx_responses_hospital_period').on(t.hospitalId, t.periodId),
  unitDateIdx: index('idx_responses_unit_date').on(t.unitId, t.submittedAt),
}));

export const surveyAnswers = mysqlTable('survey_answers', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  responseId: varchar('response_id', { length: 26 }).notNull(),
  questionId: varchar('question_id', { length: 26 }).notNull(),
  likertValue: int('likert_value'), // 1-5
  choiceValues: json('choice_values'),
  textValue: text('text_value'),
});

export const surveyReviews = mysqlTable('survey_reviews', {
  id: varchar('id', { length: 26 }).primaryKey(),
  hospitalId: varchar('hospital_id', { length: 26 }).notNull(),
  responseId: varchar('response_id', { length: 26 }).notNull(),
  reviewText: text('review_text').notNull(),
  sentiment: mysqlEnum('sentiment', ['POSITIVE', 'NEUTRAL', 'NEGATIVE']).default('NEUTRAL'),
  keywordsJson: json('keywords_json'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const qrCodes = mysqlTable('qr_codes', {
  id: varchar('id', { length: 26 }).primaryKey(),
  hospitalId: varchar('hospital_id', { length: 26 }).notNull(),
  unitId: varchar('unit_id', { length: 26 }).notNull(),
  periodId: varchar('period_id', { length: 26 }),
  qrUrl: varchar('qr_url', { length: 255 }).notNull(),
  imageUrl: varchar('image_url', { length: 255 }),
  scanCount: int('scan_count').default(0).notNull(),
  createdBy: varchar('created_by', { length: 26 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const surveyHistoryLogs = mysqlTable('survey_history_logs', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  hospitalId: varchar('hospital_id', { length: 26 }).notNull(),
  actorUserId: varchar('actor_user_id', { length: 26 }).notNull(),
  entityType: mysqlEnum('entity_type', ['QUESTIONNAIRE', 'PERIOD', 'UNIT', 'HOSPITAL', 'USER', 'QRCODE']).notNull(),
  entityId: varchar('entity_id', { length: 26 }).notNull(),
  action: mysqlEnum('action', ['CREATE', 'UPDATE', 'DELETE', 'PUBLISH', 'CLOSE', 'ARCHIVE', 'ACTIVATE']).notNull(),
  beforeJson: json('before_json'),
  afterJson: json('after_json'),
  notes: text('notes'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: varchar('user_agent', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
  hospitalIdx: index('idx_history_hospital').on(t.hospitalId, t.createdAt),
  entityIdx: index('idx_history_entity').on(t.entityType, t.entityId, t.createdAt),
}));

export const activityLogs = mysqlTable('activity_logs', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  userId: varchar('user_id', { length: 26 }),
  hospitalId: varchar('hospital_id', { length: 26 }),
  action: varchar('action', { length: 80 }).notNull(), // LOGIN, LOGOUT, EXPORT, SUBMIT_RESPONSE, dll
  description: text('description'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: varchar('user_agent', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
  userIdx: index('idx_activity_user').on(t.userId, t.createdAt),
}));

export const passwordResetTokens = mysqlTable('password_reset_tokens', {
  id: varchar('id', { length: 26 }).primaryKey(),
  userId: varchar('user_id', { length: 26 }).notNull(),
  token: varchar('token', { length: 120 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  usedAt: timestamp('used_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const notificationEmails = mysqlTable('notification_emails', {
  id: varchar('id', { length: 26 }).primaryKey(),
  hospitalId: varchar('hospital_id', { length: 26 }),
  recipientEmail: varchar('recipient_email', { length: 150 }).notNull(),
  subject: varchar('subject', { length: 200 }).notNull(),
  body: text('body').notNull(),
  status: mysqlEnum('status', ['PENDING', 'SENT', 'FAILED']).default('PENDING').notNull(),
  sentAt: timestamp('sent_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const hospitalsRelations = relations(hospitals, ({ many }) => ({
  users: many(users),
  units: many(serviceUnits),
  periods: many(surveyPeriods),
  questionnaires: many(questionnaires),
  respondents: many(respondents),
  responses: many(surveyResponses),
  qrCodes: many(qrCodes),
}));

export const responsesRelations = relations(surveyResponses, ({ one, many }) => ({
  respondent: one(respondents, { fields: [surveyResponses.respondentId], references: [respondents.id] }),
  unit: one(serviceUnits, { fields: [surveyResponses.unitId], references: [serviceUnits.id] }),
  answers: many(surveyAnswers),
}));
```

### Variabel Lingkungan (`.env.example`)
```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=SurveiKepuasan

# Database (MySQL)
DATABASE_URL=mysql://root:password@localhost:3306/surveikepuasan
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=password
DATABASE_NAME=surveikepuasan

# Auth.js / NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=change-me-with-openssl-rand
JWT_SECRET=change-me-too
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_EXPIRES_IN=30d

# Password Reset
PASSWORD_RESET_TOKEN_TTL_MINUTES=60
BCRYPT_COST=12

# Email (SMTP)
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASSWORD=re_xxxxxxxxxxxx
SMTP_FROM_EMAIL=no-reply@surveikepuasan.id
SMTP_FROM_NAME=SurveiKepuasan

# File Storage (S3-compatible / MinIO)
S3_ENDPOINT=http://localhost:9000
S3_BUCKET=surveikepuasan-files
S3_ACCESS_KEY=minio
S3_SECRET_KEY=minio123
S3_REGION=ap-southeast-1
S3_PUBLIC_URL=http://localhost:9000/surveikepuasan-files

# Rate Limiting
RATE_LIMIT_RESPONSE_PER_HOUR_PER_IP=5
RATE_LIMIT_GLOBAL_PER_MINUTE_PER_IP=60
RATE_LIMIT_EXPORT_PER_MINUTE=5

# Flutter Mobile App
MOBILE_API_BASE_URL=http://localhost:3000/api/v1
MOBILE_API_APP_KEY=mobile-app-key-xxxxx

# Cron / Background Job
CRON_SECRET=cron-secret-xxxxx
```

---

## 11. Tahapan Pengerjaan & Task Breakdown (Actionable Work Breakdown Structure)
*Daftar tugas terstruktur dan terurut (Atomic Tasks). Dirancang agar AI Coding Assistant mengeksekusi per Fase penuh, lalu berhenti untuk konfirmasi.*

### Tahap 1: Fondasi Proyek, UI/UX Web & Mobile App (Dummy Data)
*Tujuan: Membangun seluruh antarmuka visual web back-office dan mobile app secara 100% lengkap dan responsif menggunakan data dummy sebelum menyentuh database.*

- [ ] **Task 1.1 (Setup Next.js & Design System)**: Setup Next.js 15 App Router + TypeScript + Tailwind CSS 4 + shadcn/ui (Button, Card, Input, Dialog, Table, Badge, Dropdown, Tabs, Select, Textarea, Toast, Progress, Avatar, Sheet). Konfigurasi CSS variable token warna (Teal primary), font `Plus Jakarta Sans` (heading) & `Inter` (body) via next/font, icon library `lucide-react`, dan util theme toggle (dark mode).
- [ ] **Task 1.2 (Setup Flutter Mobile App)**: Buat project Flutter `surveikepuasan_mobile` dengan `riverpod`, `go_router`, `dio`, `mobile_scanner`, `shared_preferences`, `lucide_icons`, `intl`. Buat `AppTheme` dengan Material 3, warna primary Teal, font `Plus Jakarta Sans` + `Inter`, dan setup struktur folder `lib/features/*`, `lib/core/*`.
- [ ] **Task 1.3 (Layouts & Persistent Navigation Web)**: Buat Public Layout (Navbar + Footer), Auth Layout (centered card), Back-Office Dashboard Layout (sidebar fixed + header breadcrumb + user menu + notifikasi bell + tenant context bar), dan responsive mobile drawer. Buat komponen reusable: `DataTable`, `PageHeader`, `StatCard`, `EmptyState`, `ConfirmDialog`, `SearchInput`.
- [ ] **Task 1.4 (Public Pages & Web Fallback Survey)**: Buat halaman `/`, `/pilih-rs`, `/s/[hospitalCode]`, `/s/[hospitalCode]/survey` (multi-step), `/s/[hospitalCode]/selesai`, `/faq`, `/privasi`, `/kontak`, semua dengan data dummy RS (`RSUD-CIANJUR`, `RSUD-KARAWANG`, `RSHS`) dan pertanyaan IKM.
- [ ] **Task 1.5 (Auth Pages)**: Buat `/login`, `/forgot-password`, `/reset-password` dengan validasi form dasar (react-hook-form + zod) dan state dummy.
- [ ] **Task 1.6 (Super Admin Area Pages)**: Buat `/admin/dashboard`, `/admin/hospitals`, `/admin/hospitals/new`, `/admin/hospitals/[id]`, `/admin/hospitals/[id]/edit`, `/admin/users`, `/admin/users/new`, `/admin/comparison` (bar chart dummy), `/admin/audit-logs`, `/admin/settings`. Tabel dummy dengan search, filter, pagination, sort. Modal form dummy.
- [ ] **Task 1.7 (Hospital Admin Area Pages — Non-Kuesioner)**: Buat `/h/[code]/dashboard` (KPI cards, chart tren 7 hari, unit ranking), `/h/[code]/units`, `/h/[code]/units/new`, `/h/[code]/periods`, `/h/[code]/periods/new`, `/h/[code]/periods/[id]`, `/h/[code]/respondents`, `/h/[code]/responses`, `/h/[code]/responses/[id]`, `/h/[code]/reports/satisfaction`, `/h/[code]/reports/units`, `/h/[code]/reports/trends`, `/h/[code]/reports/reviews`, `/h/[code]/reports/export`, `/h/[code]/qr-codes`, `/h/[code]/petugas`, `/h/[code]/petugas/new`, `/h/[code]/history-logs`, `/h/[code]/profile`, `/h/[code]/settings`. Semua dengan data dummy realistis berbahasa Indonesia.
- [ ] **Task 1.8 (Hospital Admin Area Pages — Kuesioner Builder)**: Buat `/h/[code]/questionnaires`, `/h/[code]/questionnaires/new` (multi-step builder), `/h/[code]/questionnaires/[id]` (editor drag & drop urutan), `/h/[code]/questionnaires/[id]/preview` (tampilan mobile & web).
- [ ] **Task 1.9 (Petugas Survey Area Pages)**: Buat `/h/[code]/petugas/dashboard` dan `/h/[code]/petugas/responses` (scope unit, data dummy).
- [ ] **Task 1.10 (Flutter Mobile — Responden)**: Buat seluruh layar: Splash, Onboarding, Home (Scan QR & Pilih RS), Hospital Detail + Informed Consent, Form Survey Multi-Step (demografis → pilih unit → Likert → ulasan → review), Terima Kasih, Riwayat Lokal. Semua dengan data dummy dari mock JSON.
- [ ] **Task 1.11 (Flutter Mobile — Petugas Survey)**: Buat layar Login, Petugas Dashboard, QR Code Viewer, Live Responses (auto-refresh dengan data dummy).
- [ ] **Task 1.12 (Polish & Uji Responsif)**: Validasi semua halaman responsif (web 360px–1920px, mobile 320–430 width), konsistensi warna & tipografi, animasi mikro, empty state, error state, loading skeleton.

### Tahap 2: Database MySQL, Autentikasi, & Integrasi Data Dinamis
*Tujuan: Menghidupkan aplikasi dengan MySQL nyata, autentikasi Email & Password, API mobile, dan Server Actions.*

- [ ] **Task 2.1 (MySQL & Drizzle Schema)**: Buat database `surveikepuasan` di MySQL 8, setup Drizzle ORM (mysql2), tulis file `db/schema.ts` lengkap dengan semua tabel: `hospitals`, `users`, `service_units`, `survey_periods`, `questionnaires`, `question_categories`, `questions`, `respondents`, `survey_responses`, `survey_answers`, `survey_reviews`, `qr_codes`, `survey_history_logs`, `activity_logs`, `password_reset_tokens`, `notification_emails`.
- [ ] **Task 2.2 (Migrations & Seed)**: Jalankan `drizzle-kit generate` + `drizzle-kit migrate`, lalu buat script seed (`db/seed.ts`) berisi 3 RS (`RSUD-CIANJUR`, `RSUD-KARAWANG`, `RSHS`), 8–12 unit layanan per RS, 4 akun pengguna (1 Super Admin, 2 Admin RS, 1 Petugas), 1 template kuesioner IKM 14 unsur, 1 periode aktif, dan 50 data respons dummy acak tersebar.
- [ ] **Task 2.3 (Autentikasi NextAuth Email & Password)**: Konfigurasi Auth.js v5 Credentials Provider, bcrypt hash (cost 12), JWT session, role-based redirect setelah login, fitur forgot/reset password via email (nodemailer + SMTP), rate-limit 5x gagal login → kunci 15 menit. Middleware `middleware.ts` untuk proteksi `/admin/*`, `/h/*`, dan redirect jika tidak login.
- [ ] **Task 2.4 (Multi-Tenant Isolation & RBAC Server-side)**: Buat helper `requireRole()` + `assertHospitalAccess()` di setiap Server Action / route handler. Semua query wajib difilter `hospital_id`. Uji dengan skenario Admin RS A mengakses data RS B → 403.
- [ ] **Task 2.5 (Server Actions — CRUD Rumah Sakit)**: Implementasi Server Action untuk `createHospital`, `updateHospital`, `deactivateHospital`, `activateHospital`. Setiap aksi menulis log ke `survey_history_logs` dengan `entity_type = 'HOSPITAL'`. Wire ke `/admin/hospitals`.
- [ ] **Task 2.6 (Server Actions — CRUD Pengguna)**: Implementasi CRUD user + invite email untuk Petugas Survey, reset password, aktivasi/deaktivasi. Wire ke `/admin/users` dan `/h/[code]/petugas`.
- [ ] **Task 2.7 (Server Actions — CRUD Unit Layanan)**: Implementasi CRUD `service_units` dengan validasi kode unik per RS. Log ke `survey_history_logs`. Wire ke `/h/[code]/units`.
- [ ] **Task 2.8 (Server Actions — CRUD Kuesioner & Pertanyaan)**: Implementasi CRUD `questionnaires`, `question_categories`, `questions` termasuk drag & drop reorder, versioning saat publish, dan aturan "tidak dapat dihapus jika ada respons". Log ke `survey_history_logs`. Wire ke halaman kuesioner.
- [ ] **Task 2.9 (Server Actions — CRUD Periode Survey)**: Implementasi CRUD `survey_periods` dengan status DRAFT/ACTIVE/CLOSED, validasi overlap tanggal, dan lock respons saat periode ditutup. Log ke `survey_history_logs`. Wire ke `/h/[code]/periods`.
- [ ] **Task 2.10 (API Publik untuk Mobile — Survey Submission)**: Buat endpoint `POST /api/v1/surveys/submit` (tanpa auth), `GET /api/v1/hospitals`, `GET /api/v1/hospitals/:code`, `GET /api/v1/hospitals/:code/active-survey` (kuesioner + pertanyaan + unit aktif). Rate limit 5 submission/jam/IP, hash IP dengan SHA-256, batch insert ke `survey_answers`, hitung `overall_score`, dan ekstrak keyword ulasan ke `survey_reviews`.
- [ ] **Task 2.11 (API Mobile — Auth Petugas & Dashboard Scope Unit)**: Buat `POST /api/v1/auth/login` (JWT), `GET /api/v1/petugas/me`, `GET /api/v1/petugas/responses` (hanya unit yang ditugaskan), `GET /api/v1/petugas/stats`. Verifikasi JWT di setiap request.
- [ ] **Task 2.12 (Wire Frontend Web ke Data Dinamis)**: Ganti seluruh data dummy di Fase 1 dengan query Drizzle / Server Action asli. Tambahkan loading (Suspense + skeleton), error boundary, dan empty state.
- [ ] **Task 2.13 (Wire Flutter Mobile ke API)**: Integrasikan Dio client ke `MOBILE_API_BASE_URL`, implementasi state provider untuk daftar RS, kuesioner aktif, submit survey, dan dashboard petugas. Simpan draf form ke `SharedPreferences`.
- [ ] **Task 2.14 (History Log & Audit Trail)**: Implementasi helper `writeHistoryLog()` dan `writeActivityLog()` yang dipanggil di semua Server Action. Wire halaman `/h/[code]/history-logs` (dengan diff before/after) dan `/admin/audit-logs` (filter RS, user, action, tanggal).
- [ ] **Task 2.15 (QR Code Generator & Scanner)**: Buat lib generator QR (qrcode/react) untuk `/h/[code]/qr-codes`, endpoint `POST /api/v1/qr-codes/:id/scan` untuk increment `scan_count`, dan dukungan param URL `?unit=&period=` di halaman `/s/[code]`. Integrasikan `mobile_scanner` di Flutter untuk scan QR petugas.

### Tahap 3: Analitik, Laporan, Keamanan, Testing, & Deployment
*Tujuan: Menyempurnakan analitik, export, keamanan, testing E2E, dan rilis produksi.*

- [ ] **Task 3.1 (Dashboard Analytics & Agregasi)**: Implementasi query agregat: skor kepuasan per RS (`AVG(overall_score)`), jumlah respons, NPS, respons 7 hari terakhir, unit ranking. Caching in-memory 5 menit dengan revalidate tag + rate-limit. Wire ke `/h/[code]/dashboard` dan `/admin/dashboard`.
- [ ] **Task 3.2 (Rekap per Unit & Tren Waktu)**: Implementasi query agregasi per unit (`GROUP BY unit_id`) dan per interval waktu (mingguan/bulanan). Wire ke `/h/[code]/reports/units` dan `/h/[code]/reports/trends` dengan Recharts.
- [ ] **Task 3.3 (Perbandingan Antar Rumah Sakit)**: Query multi-tenant lintas RS (hanya Super Admin). Bar chart + tabel ranking, filter periode & unit. Wire ke `/admin/comparison`.
- [ ] **Task 3.4 (Analisis Ulasan Kualitatif)**: Implementasi ekstraksi keyword (tokenisasi sederhana + stopword Indonesia) dan klasifikasi sentimen berbasis kamus kata (positif/netral/negatif). Tampilkan word cloud + tabel ulasan dengan filter sentimen di `/h/[code]/reports/reviews`.
- [ ] **Task 3.5 (Export PDF & Excel)**: Implementasi generator PDF (react-pdf / puppeteer) untuk laporan kepuasan & export Excel (exceljs) untuk rekap per unit/periode. Rate limit 5 export/menit. Endpoint download ter-autentikasi + audit log ke `activity_logs`. Wire ke `/h/[code]/reports/export`.
- [ ] **Task 3.6 (Notifikasi Email & Cron Auto-Close Periode)**: Integrasi nodemailer + SMTP. Buat cron endpoint `/api/cron/daily` (header `x-cron-secret`) untuk: (1) email pengingat 3 hari sebelum periode tutup, (2) auto-close periode yang sudah melewati `endDate`, (3) rekap mingguan ke Super Admin. Log ke `notification_emails`.
- [ ] **Task 3.7 (Non-Functional Requirements & Security)**: Pasang dynamic SEO (`generateMetadata`, schema.org `MedicalOrganization`), `sitemap.xml`, `robots.txt`. Pasang sanitasi XSS (DOMPurify untuk input ulasan), CSRF protection (double-submit cookie di Server Actions), Zod validation di semua endpoint & form, rate limiting global per-IP, cookie Secure+HttpOnly+SameSite, dan CSP header.
- [ ] **Task 3.8 (Uji End-to-End & Bugfix)**: Uji alur Responden (scan QR → isi survey → submit → tampil di laporan), alur Admin RS (buat kuesioner → periode → lihat respons → export), alur Petugas (login mobile → monitor unit), alur Super Admin (buat RS → comparison → audit log). Perbaiki bug, optimasi query (index check `EXPLAIN`), polish responsif.
- [ ] **Task 3.9 (Production Build & Deployment)**: Konfigurasi `.env.production`, verifikasi `npm run build` & `flutter build apk --release`, deploy Next.js ke VPS (Docker Compose: app + MySQL + MinIO + Nginx) atau Vercel + database MySQL terkelola, upload APK ke Play Store internal track / bagikan langsung. Setup backup otomatis MySQL harian dan monitoring uptime.

---

