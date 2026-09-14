# E-Survey - Platform Survei Kepuasan Pasien Rumah Sakit Berbasis Standar IKM KemenPAN-RB

Platform digital terintegrasi untuk survei kepuasan masyarakat (IKM) pada fasilitas kesehatan rumah sakit, dilengkapi aplikasi mobile (Flutter) dan web backoffice (Next.js & MySQL).

---

## 🚀 Fitur Utama

- **Aplikasi Mobile (Flutter)**:
  - Alur survei responden publik ramah pengguna (skala Likert emotikon 1-4, NPS 0-10, saran/ulasan).
  - Integrasi Scanner QR Code untuk verifikasi unit layanan.
  - Mode Petugas: Tampilan dinamis QR Code unit IGD/layanan & Live Feed monitoring respon survei.
  - Penyimpanan lokal riwayat & sinkronisasi data offline/online.
- **Web Backoffice (Next.js 16 + Drizzle ORM + MySQL)**:
  - Multi-tenant Rumah Sakit & Master Unit Pelayanan.
  - Dashboard Analitik Eksekutif: Nilai IKM terbobot, Mutu Pelayanan (A/B/C/D), NPS, radar chart unsur pelayanan.
  - Manajemen Kuesioner & Periode Survei.
  - Generator & Manajemen QR Code Unit Pelayanan.
  - Ekspor Laporan Rekapitulasi (Excel, PDF, JSON).
  - Otomasi Cron Job harian untuk penutupan periode kadaluarsa & reminder target sampel.

---

## 📁 Struktur Monorepo

```
e-survey/
├── PRD.md                       # Product Requirements Document
├── docker-compose.yml           # Docker deployment (Web & MySQL)
├── docs/                        # Dokumentasi & Kredensial Login
│   ├── LOGIN_CREDENTIALS.md
│   └── images/
├── backups/                     # Backup database SQL
├── scripts/                     # Skrip backup & utilitas
├── web/                         # Next.js Backoffice & REST API
│   ├── src/
│   │   ├── app/                 # App Router (Pages & API v1)
│   │   ├── db/                  # Drizzle ORM Schema & Migrasi MySQL
│   │   └── lib/                 # Auth, Audit, & Business Logic
│   └── package.json
└── surveikepuasan_mobile/       # Flutter Mobile Application
    ├── lib/
    │   ├── core/                # Routing, Themes, Models, API Services
    │   └── features/            # Modul Responden & Petugas Lapangan
    └── pubspec.yaml
```

---

## 🛠️ Panduan Menjalankan Sistem

### 1. Prasyarat
- Node.js 20+
- Flutter 3.24+ / 3.47+
- MySQL 8.0+

### 2. Backoffice Web App
```bash
cd web
npm install
# Konfigurasi .env dari .env.example
npm run db:push
npm run db:seed
npm run dev
```
Akses web di `http://localhost:3000`

### 3. Mobile App
```bash
cd surveikepuasan_mobile
flutter pub get

# Jalankan di Windows Desktop (dimensi smartphone):
flutter run -d windows

# Atau jalankan di perangkat fisik Android:
flutter run -d <device_id>
```

---

## 🔑 Kredensial Login Bawaan
Silakan baca [docs/LOGIN_CREDENTIALS.md](docs/LOGIN_CREDENTIALS.md) untuk daftar lengkap akun Super Admin, Admin Rumah Sakit, dan Petugas IGD.
