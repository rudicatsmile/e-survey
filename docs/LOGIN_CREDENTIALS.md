# Kredensial Login Aplikasi E-Survey

Dokumen ini berisi daftar kredensial akun bawaan (seeder) untuk pengujian sistem **E-Survey** (Backoffice Web & Mobile App).

---

## 1. Kredensial Pengguna Berdasarkan Peran (Role)

### A. Super Admin Platform
* **Akses**: Pengelolaan seluruh rumah sakit, master kuisioner nasional, audit trail, global settings, & rekapitulasi data multi-RS.
* **Email**: `admin@surveikepuasan.id`
* **Password**: `Admin123!`
* **URL Login**: [http://localhost:3000/login](http://localhost:3000/login)
* **Dashboard**: [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard)

---

### B. Admin Rumah Sakit (RSUD Sayang Cianjur)
* **Akses**: Dashboard IKM rumah sakit, kelola unit layanan (IGD, Rawat Jalan, Farmasi, dll.), generate QR code unit, kelola petugas lapangan, ekspor laporan Excel/PDF/JSON.
* **Email**: `admin.rsud@cianjur.go.id`
* **Password**: `Admin123!`
* **URL Login**: [http://localhost:3000/login](http://localhost:3000/login)
* **Dashboard**: [http://localhost:3000/h/RSUD-CIANJUR/dashboard](http://localhost:3000/h/RSUD-CIANJUR/dashboard)

---

### C. Admin Rumah Sakit (RSUD Karawang)
* **Akses**: Pengelolaan tenant RSUD Karawang.
* **Email**: `admin.rsud@karawang.go.id`
* **Password**: `Admin123!`
* **URL Login**: [http://localhost:3000/login](http://localhost:3000/login)
* **Dashboard**: [http://localhost:3000/h/RSUD-KARAWANG/dashboard](http://localhost:3000/h/RSUD-KARAWANG/dashboard)

---

### D. Petugas Unit Pelayanan (Field Officer - IGD RSUD Sayang)
* **Akses**:
  * **Mobile App**: Tekan tombol **"Mode Petugas"** di kanan atas aplikasi mobile -> Masuk untuk menampilkan QR Code IGD dan melihat Live Feed kepuasan unit IGD.
  * **Web App**: Dashboard monitoring petugas unit IGD.
* **Email**: `petugas.igd@cianjur.go.id`
* **Password**: `Petugas123!`
* **Unit Kerja**: Instalasi Gawat Darurat (IGD)
* **Dashboard Web**: [http://localhost:3000/h/RSUD-CIANJUR/petugas/dashboard](http://localhost:3000/h/RSUD-CIANJUR/petugas/dashboard)

---

## 2. Alur Penggunaan Responden (Publik - Tanpa Login)

* **Pemilihan Rumah Sakit & Unit**: [http://localhost:3000/pilih-rs](http://localhost:3000/pilih-rs)
* **Form Survei Langsung (RSUD Sayang Cianjur)**: [http://localhost:3000/s/RSUD-CIANJUR](http://localhost:3000/s/RSUD-CIANJUR)
* **Form Survei Unit IGD Langsung**: [http://localhost:3000/s/RSUD-CIANJUR?unit=u_cianjur_igd](http://localhost:3000/s/RSUD-CIANJUR?unit=u_cianjur_igd)
* **Aplikasi Mobile Android**: Buka aplikasi **E-Survey**, pilih RS atau scan QR code unit.

---

## 3. Informasi Konfigurasi Teknis

* **Web Local URL**: `http://localhost:3000`
* **Web LAN Network URL**: `http://192.168.100.128:3000`
* **Mobile API Base URL**: `http://localhost:3000/api/v1` (USB adb reverse: `127.0.0.1:3000/api/v1` atau LAN: `192.168.100.128:3000/api/v1`)
* **Koneksi Database MySQL**: `mysql://root:root@localhost:3306/esurvey`
* **Cron Secret Endpoint**: `http://localhost:3000/api/cron/daily?secret=cron-secret-xxxxx`
