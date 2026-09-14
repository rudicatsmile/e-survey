# PANDUAN PENGGUNAAN APLIKASI E-SURVEY
### Platform Survei Kepuasan Pasien Rumah Sakit Berbasis Standar IKM PermenPAN-RB No. 14/2017

Selamat datang di Buku Panduan Penggunaan Sistem **E-Survey**. Dokumen ini disusun untuk memandu seluruh pengguna dalam mengoperasikan aplikasi mobile maupun web backoffice sesuai dengan hak akses dan peran (role) masing-masing.

---

## DAFTAR ISI
1. [Struktur Pengguna & Hak Akses](#1-struktur-pengguna--hak-akses)
2. [Panduan Role 1: Masyarakat / Pasien / Responden (Publik)](#2-panduan-role-1-masyarakat--pasien--responden-publik)
3. [Panduan Role 2: Petugas Pelayanan Lapangan (Field Officer)](#3-panduan-role-2-petugas-pelayanan-lapangan-field-officer)
4. [Panduan Role 3: Admin Rumah Sakit (Hospital Admin)](#4-panduan-role-3-admin-rumah-sakit-hospital-admin)
5. [Panduan Role 4: Super Admin Platform (Administrator Sistem)](#5-panduan-role-4-super-admin-platform-administrator-sistem)
6. [Tabel Matriks Fitur & Perbandingan Role](#6-tabel-matriks-fitur--perbandingan-role)
7. [Pusat Bantuan & Troubleshooting Umum](#7-pusat-bantuan--troubleshooting-umum)

---

## 1. STRUKTUR PENGGUNA & HAK AKSES

Sistem **E-Survey** memiliki 4 jenjang peran pengguna dengan fungsi yang terisolasi secara aman:

| Jenjang / Role | Platform | Fungsi Utama |
| :--- | :--- | :--- |
| **Responden (Publik)** | Mobile App & Web Publik | Mengisi survei kepuasan 14 unsur IKM, memberikan penilaian NPS, dan ulasan pelayanan tanpa wajib registrasi akun. |
| **Petugas Lapangan** | Mobile App & Web Backoffice | Menyediakan QR Code unit layanan kepada pengunjung dan memantau respon masuk secara langsung (*live feed*). |
| **Admin Rumah Sakit** | Web Backoffice | Mengelola unit layanan, generator QR code, periode survei, kuesioner, staf petugas, serta menganalisis dan mengekspor laporan IKM. |
| **Super Admin** | Web Backoffice | Mengelola data multi-rumah sakit, master kuesioner nasional, komparasi antar-RS, audit trail global, dan pengaturan sistem. |

---

## 2. PANDUAN ROLE 1: MASYARAKAT / PASIEN / RESPONDEN (PUBLIK)

### A. Gambaran Umum & Hak Akses
* **Siapa penggunanya?** Pasien, keluarga pasien, atau masyarakat yang telah menerima layanan di rumah sakit.
* **Hak Akses**: Publik (Tidak memerlukan login akun).
* **Media Akses**:
  1. **Aplikasi Mobile (Android / Desktop)**: Menggunakan aplikasi **E-Survey**.
  2. **Web Browser (Smartphone / PC)**: Mengakses tautan survei langsung atau memindai QR Code di loket RS.

---

### B. Alur Penggunaan via Aplikasi Mobile (Android)

#### Langkah 1: Membuka Aplikasi & Layar Pengenalan (*Onboarding*)
1. Buka aplikasi **E-Survey** di smartphone Android Anda.
2. Pada penggunaan pertama kali, akan tampil layar *Onboarding* yang menjelaskan standar survei IKM KemenPAN-RB.
3. Klik tombol **"Mulai Sekarang"** untuk menuju ke Beranda.

#### Langkah 2: Memilih Rumah Sakit & Unit Layanan
Tersedia 2 cara mudah:
* **Cara Cepat (Scan QR Code Unit)**:
  1. Klik ikon/tombol **"Pindai QR"** pada bilah navigasi bawah atau kartu di beranda.
  2. Arahkan kamera smartphone ke QR Code yang terpasang di meja loket pelayanan (misal: Loket IGD, Loket Farmasi).
  3. Aplikasi secara otomatis mendeteksi rumah sakit dan unit layanan tersebut, lalu langsung membuka formulir survei.
* **Cara Manual**:
  1. Di layar Beranda, pilih Rumah Sakit yang dikunjungi (misal: *RSUD Sayang Cianjur*).
  2. Klik tombol **"Isi Survei"** pada rumah sakit yang dipilih.
  3. Pilih unit pelayanan yang baru saja Anda terima layanannya (misal: *Instalasi Gawat Darurat (IGD)*, *Farmasi*, atau *Rawat Jalan*).

#### Langkah 3: Mengisi Data Demografi Singkat
1. Pilih **Rentang Usia** (misal: *18–25 tahun*, *26–35 tahun*, *36–45 tahun*, dst.).
2. Pilih **Jenis Kelamin** (*Laki-laki* atau *Perempuan*).
3. Pilih **Pendidikan Terakhir** dan **Pekerjaan Utama** (opsional/sesuai form).
4. Klik **"Lanjut ke Pertanyaan"**.
> *Catatan Privasi: Data demografi hanya digunakan untuk statistik agregat IKM dan tidak menyimpan identitas pribadi seperti NIK atau nama lengkap.*

#### Langkah 4: Menjawab 14 Unsur Pelayanan IKM
1. Jawab pertanyaan yang muncul secara berurutan. Masing-masing pertanyaan mencakup unsur pelayanan (Kesesuaian Persyaratan, Kemudahan Prosedur, Kecepatan Waktu, Kewajaran Biaya, Kesesuaian Produk Layanan, Kompetensi Petugas, Perilaku/Kesopanan, Kualitas Sarana Prasarana, dan Penanganan Pengaduan).
2. Berikan penilaian pada skala Likert 1–4 dengan memilih kartu emotikon:
   - **1 bintang (Merah)**: Tidak Baik / Tidak Puas
   - **2 bintang (Kuning)**: Kurang Baik / Kurang Puas
   - **3 bintang (Biru)**: Baik / Puas
   - **4 bintang (Hijau)**: Sangat Baik / Sangat Puas
3. Tombol **"Selanjutnya"** akan aktif otomatis setelah pilihan ditekan.

#### Langkah 5: Penilaian Rekomendasi (NPS) & Saran Tertulis
1. **Net Promoter Score (NPS)**: Berikan skor antara **0 sampai 10** pada pertanyaan: *"Seberapa besar kemungkinan Anda merekomendasikan layanan rumah sakit ini kepada keluarga/kerabat?"*
   - Skor 0–6: Detractor (Perlu perbaikan)
   - Skor 7–8: Passive (Cukup puas)
   - Skor 9–10: Promoter (Sangat merekomendasikan)
2. **Kritik & Saran**: Tuliskan ulasan atau apresiasi Anda pada kotak teks yang disediakan (misal: *"Pelayanan perawat IGD sangat cepat dan ramah, ruang tunggu bersih"*).
3. Klik tombol **"Kirim Survei"**.

#### Langkah 6: Bukti Partisipasi & Riwayat Lokal
1. Layar akan menampilkan pesan **"Terima Kasih atas Partisipasi Anda!"** beserta Nomor Resi Responden unik (misal: `RES-2025-XXXXXX`) dan skor ringkasan Anda.
2. Bukti pengisian survei otomatis tersimpan di menu **"Riwayat"** pada aplikasi HP Anda. Jika perangkat offline saat pengiriman, data tersimpan di HP dan otomatis dikirim saat ada sinyal internet.

---

### C. Alur Penggunaan via Web Publik (Browser / Scan HP)
1. Buka browser dan kunjungi: [http://localhost:3000/pilih-rs](http://localhost:3000/pilih-rs) (atau scan QR code di loket yang mengarah ke `http://.../s/RSUD-CIANJUR?unit=u_cianjur_igd`).
2. Tampilan web responsif akan memandu Anda melalui tahapan:
   - Verifikasi Unit Pelayanan.
   - Demografi responden.
   - Pengisian nilai 14 unsur pelayanan.
   - Pengisian NPS dan ulasan.
3. Klik **"Kirim Survei"** dan simpan kode tanda terima partisipasi Anda.

---

## 3. PANDUAN ROLE 2: PETUGAS PELAYANAN LAPANGAN (FIELD OFFICER)

### A. Gambaran Umum & Hak Akses
* **Siapa penggunanya?** Staf rumah sakit yang bertugas di loket pendaftaran, kasir, ruang tunggu IGD, poli rawat jalan, atau loket farmasi.
* **Hak Akses**:
  - Menampilkan QR Code resmi unit kerjanya kepada pasien.
  - Memantau tanggapan dan skor kepuasan pasien yang baru saja masuk secara langsung (*real-time*).
  - Tidak memiliki hak mengubah struktur survei atau mengakses data keuangan/laporan RS lain.

---

### B. Penggunaan Melalui Aplikasi Mobile (Mode Petugas)

#### Langkah 1: Masuk ke Mode Petugas
1. Buka aplikasi **E-Survey** di smartphone.
2. Di halaman Beranda, klik tombol **"Mode Petugas"** pada pojok kanan atas.
3. Masukkan kredensial petugas:
   - **Email**: `petugas.igd@cianjur.go.id` *(sesuai akun unit masing-masing)*
   - **Password**: `Petugas123!`
4. Klik **"Masuk Sebagai Petugas"**.

#### Langkah 2: Menampilkan QR Code ke Pasien
1. Setelah login berhasil, aplikasi membuka halaman **Dashboard Petugas Lapangan**.
2. Pada tab **"QR Code Unit"**, layar akan menampilkan QR Code besar beresolusi tinggi bertuliskan nama unit Anda (misal: *Instalasi Gawat Darurat (IGD) - RSUD Sayang Cianjur*).
3. **Praktek di Lapangan**:
   - Tunjukkan layar smartphone ini kepada pasien setelah mereka selesai mendapatkan layanan.
   - Pasien cukup membuka kamera HP atau scanner aplikasi E-Survey untuk memindai kode tersebut.
   - Tersedia tombol **"Segarkan QR"** jika QR code perlu di-regenerate.

#### Langkah 3: Memantau Respon Pasien (*Live Feed*)
1. Pindah ke tab **"Live Feed"** di menu bawah.
2. Di tab ini, setiap survei yang baru saja dikirim oleh pasien akan langsung muncul dalam hitungan detik:
   - Jam masuk pengisian.
   - Skor rata-rata kepuasan.
   - Nilai NPS.
   - Komentar / masukan tertulis pasien.
3. **Tindakan Responsif**: Jika terdapat keluhan pasien bernilai rendah, petugas dapat segera mengoordinasikannya dengan kepala unit atau tim humas RS untuk evaluasi cepat.

#### Langkah 4: Keluar dari Mode Petugas (*Logout*)
1. Klik ikon profil/logout di sudut kanan atas dashboard petugas.
2. Konfirmasi logout untuk mengembalikan aplikasi ke mode responden publik.

---

### C. Penggunaan Melalui Web Backoffice Petugas
1. Buka browser: [http://localhost:3000/login](http://localhost:3000/login).
2. Masukkan email dan password akun petugas.
3. Anda otomatis diarahkan ke: [http://localhost:3000/h/RSUD-CIANJUR/petugas/dashboard](http://localhost:3000/h/RSUD-CIANJUR/petugas/dashboard).
4. Menu yang tersedia:
   - **Dashboard**: Statistik kepuasan hari ini khusus untuk unit Anda.
   - **Daftar Respon**: Riwayat seluruh respon masuk unit terkait.
   - **Cetak QR Code**: Tombol untuk mencetak stiker atau tent-card QR code unit layanan agar dapat diletakkan di meja loket secara permanen.

---

## 4. PANDUAN ROLE 3: ADMIN RUMAH SAKIT (HOSPITAL ADMIN)

### A. Gambaran Umum & Hak Akses
* **Siapa penggunanya?** Tim Mutu Rumah Sakit, Bagian Humas, atau Administrator Pelayanan Publik RSUD.
* **Hak Akses**:
  - Mengelola profil rumah sakit, unit pelayanan, kuesioner, dan periode survei.
  - Membuat dan mengelola akun petugas lapangan.
  - Memantau dashboard analitik eksekutif IKM, NPS, dan sentimen ulasan.
  - Mengunduh laporan berkala IKM dalam format resmi PermenPAN-RB (Excel, PDF, JSON).

---

### B. Langkah-Langkah Operasional Admin Rumah Sakit

#### Langkah 1: Login ke Backoffice RS
1. Kunjungi: [http://localhost:3000/login](http://localhost:3000/login).
2. Masukkan akun Admin RS:
   - **Email**: `admin.rsud@cianjur.go.id`
   - **Password**: `Admin123!`
3. Sistem akan memvalidasi role dan mengarahkan Anda ke Dashboard Utama: [http://localhost:3000/h/RSUD-CIANJUR/dashboard](http://localhost:3000/h/RSUD-CIANJUR/dashboard).

#### Langkah 2: Membaca & Menganalisis Dashboard IKM
Di halaman Dashboard, perhatikan indikator kinerja utama:
* **Indeks Kepuasan Masyarakat (IKM)**: Nilai skala 25–100 (misal: `88.42`).
* **Mutu Pelayanan**:
  - `A (Sangat Baik)` : Nilai 88.31 – 100.00
  - `B (Baik)`        : Nilai 76.61 – 88.30
  - `C (Kurang Baik)` : Nilai 65.00 – 76.60
  - `D (Tidak Baik)`  : Nilai 25.00 – 64.99
* **Net Promoter Score (NPS)**: Persentase keunggulan *Promoter* dikurangi *Detractor* (skala -100% sampai +100%).
* **Radar Chart 14 Unsur**: Menampilkan unsur mana yang bernilai tertinggi dan unsur mana yang membutuhkan peningkatan (misal: waktu tunggu atau sarana prasarana).
* **Tren Responden Harian/Bulanan**: Grafik laju jumlah pasien yang mengisi survei.

#### Langkah 3: Mengelola Unit Layanan (*Service Units*)
* **Menu**: Klik menu **"Unit Layanan"** di sidebar (`/h/RSUD-CIANJUR/units`).
* **Menambah Unit Baru**:
  1. Klik tombol **"+ Tambah Unit Layanan"**.
  2. Isi Nama Unit (misal: *Instalasi Radiologi*, *Laboratorium Patologi*, *Loket BPJS*).
  3. Masukkan Kode Unit (misal: `RAD-01`).
  4. Tuliskan deskripsi singkat dan nama penanggung jawab unit.
  5. Klik **"Simpan Unit"**.
* **Menonaktifkan / Edit**: Klik tombol titik tiga di baris unit untuk mengedit informasi atau mengubah status ke non-aktif jika unit sedang direnovasi/tutup.

#### Langkah 4: Membuat & Mencetak QR Code Pelayanan
* **Menu**: Klik menu **"Manajemen QR Code"** (`/h/RSUD-CIANJUR/qr-codes`).
* **Membuat QR Code Baru**:
  1. Klik tombol **"+ Buat QR Code"**.
  2. Pilih target: **Seluruh Rumah Sakit** (General) atau **Unit Spesifik** (misal: IGD).
  3. Tentukan Masa Berlaku (misal: 6 bulan, 1 tahun, atau permanen).
  4. Klik **"Generate QR Code"**.
* **Mencetak Standee / Banner**:
  1. Klik tombol **"Unduh PNG"** atau **"Cetak Standee"** pada kartu QR yang diinginkan.
  2. Cetak dalam ukuran kertas A5 (untuk meja kasir/loket) atau A4/Standing Roll Banner (untuk pintu masuk ruang tunggu).

#### Langkah 5: Mengelola Periode Survei & Target Responden
* **Menu**: Klik menu **"Periode Survei"** (`/h/RSUD-CIANJUR/periods`).
* **Membuat Periode Baru (Triwulan/Tahunan)**:
  1. Klik **"+ Buka Periode Baru"**.
  2. Isi Nama Periode (misal: *Survei Kepuasan Triwulan II 2026*).
  3. Pilih Rentang Tanggal Mulai dan Selesai.
  4. Tentukan **Target Kuota Responden** (misal: *500 Responden*).
  5. Pilih Kuesioner Acuan yang aktif.
  6. Klik **"Buka Periode"**.
> *Sistem secara otomatis akan mengunci periode jika tanggal berakhir tercapai melalui background cron harian.*

#### Langkah 6: Mengelola Akun Petugas Lapangan
* **Menu**: Klik menu **"Petugas Lapangan"** (`/h/RSUD-CIANJUR/petugas`).
* **Mendaftarkan Petugas Baru**:
  1. Klik **"+ Daftarkan Petugas"**.
  2. Masukkan Nama Lengkap, Alamat Email resmi, dan Nomor Telepon.
  3. Pilih unit penugasan (misal: *Instalasi Farmasi*).
  4. Tentukan password awal sementara.
  5. Klik **"Buat Akun Petugas"**.

#### Langkah 7: Menganalisis Ulasan & Sentimen Pasien
* **Menu**: Klik menu **"Ulasan & Masukan"** (`/h/RSUD-CIANJUR/reports/reviews`).
* **Fitur**:
  - Filter berdasarkan sentimen: *Positif*, *Netral*, atau *Perlu Perhatian (Negatif)*.
  - Filter berdasarkan Unit Layanan (misal: evaluasi khusus Poli Gigi).
  - Fitur pencarian kata kunci keluhan (misal: *"antrean"*, *"obat"*, *"dokter"*).

#### Langkah 8: Mengekspor Laporan Akreditasi & KemenPAN-RB
* **Menu**: Klik menu **"Ekspor Laporan"** (`/h/RSUD-CIANJUR/reports/export`).
* **Pilihan Format**:
  1. **Format Excel (.xlsx / .csv)**: Berisi raw data lengkap per responden, skor per unsur, data demografi, dan rekapitulasi nilai konversi IKM.
  2. **Format PDF Siap Cetak**: Dokumen rekapitulasi resmi dengan format tabel KemenPAN-RB lengkap dengan tanda tangan pengesahan pimpinan RS.
  3. **Format JSON**: Untuk integrasi API dengan dashboard SatuData atau Kementerian Kesehatan.
* Pilih rentang tanggal atau periode survei, lalu klik **"Unduh Laporan"**.

---

## 5. PANDUAN ROLE 4: SUPER ADMIN PLATFORM (ADMINISTRATOR SISTEM)

### A. Gambaran Umum & Hak Akses
* **Siapa penggunanya?** Administrator Sistem Pusat, Pengelola IT Dinas Kesehatan, atau Lembaga Penyelenggara Platform.
* **Hak Akses**:
  - Hak akses tertinggi di seluruh platform (*Global Full Access*).
  - Mendaftarkan dan mengelola seluruh rumah sakit (*multi-tenant*).
  - Manajemen master kuesioner nasional standar PermenPAN-RB.
  - Komparasi dan benchmarking kinerja antar-rumah sakit.
  - Pemantauan audit trail global (seluruh log aktivitas pengguna).
  - Konfigurasi parameter keamanan, token JWT, rate limiting, dan scheduler otomatis.

---

### B. Langkah-Langkah Operasional Super Admin

#### Langkah 1: Login ke Dashboard Global
1. Kunjungi: [http://localhost:3000/login](http://localhost:3000/login).
2. Masukkan akun Super Admin:
   - **Email**: `admin@surveikepuasan.id`
   - **Password**: `Admin123!`
3. Sistem akan mengarahkan Anda ke Dashboard Super Admin: [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard).

#### Langkah 2: Mengonboarding Rumah Sakit Baru
* **Menu**: Klik menu **"Rumah Sakit"** di sidebar (`/admin/hospitals`).
* **Menambah Faskes Baru**:
  1. Klik tombol **"+ Tambah Rumah Sakit"**.
  2. Isi informasi rumah sakit:
     - Nama Faskes (misal: *RSUD Dr. Slamet Garut*).
     - Kode Unik RS (misal: `RSUD-GARUT`).
     - Tipe/Kelas Rumah Sakit (Kelas A, B, C, atau D).
     - Alamat Lengkap, Kota/Kabupaten, dan Provinsi.
     - Nomor Telepon Resmi dan Website.
  3. Buatkan akun **Admin Rumah Sakit** pertama untuk instansi tersebut.
  4. Klik **"Daftarkan Rumah Sakit"**.
* **Manajemen Status**: Super Admin dapat membekukan sementara (*suspend*) tenant rumah sakit jika masa kerjasama berakhir.

#### Langkah 3: Melakukan Komparasi Kinerja Antar-Faskes
* **Menu**: Klik menu **"Komparasi Faskes"** (`/admin/comparison`).
* **Fungsi Analitik**:
  1. Pilih 2 atau lebih rumah sakit yang ingin dibandingkan (misal: *RSUD Sayang Cianjur* vs *RSUD Karawang*).
  2. Pilih periode pembanding (misal: Triwulan I 2026).
  3. Sistem akan menampilkan grafik perbandingan nilai IKM, Mutu Layanan, rata-rata skor per unsur, dan kepuasan NPS secara berdampingan.
  4. Temukan faskes dengan performa terbaik (*Best Practice*) dan faskes yang memerlukan pembinaan mutu layanan.

#### Langkah 4: Memeriksa Audit Log Keamanan Global
* **Menu**: Klik menu **"Audit Trail & Log"** (`/admin/audit-logs`).
* **Pemantauan**:
  - Melihat rekaman jejak audit: Waktu kejadian, User ID, Role, Alamat IP, Aksi yang dilakukan (misal: `LOGIN_SUCCESS`, `CREATE_UNIT`, `EXPORT_REPORT`), dan status aksi.
  - Memeriksa adanya percobaan login gagal berturut-turut (*brute force attempt*).
  - Ekspor log keamanan untuk audit kepatuhan ISO 27001 / SPBE.

#### Langkah 5: Manajemen Pengaturan Sistem (*Global Settings*)
* **Menu**: Klik menu **"Pengaturan Sistem"** (`/admin/settings`).
* **Konfigurasi yang Dapat Disesuaikan**:
  - **Rate Limiting**: Membatasi maksimal pengisian survei dari 1 IP address per jam untuk mencegah manipulasi data.
  - **Status Background Scheduler (Cron)**: Memantau eksekusi daily cron (`/api/cron/daily`) untuk auto-close periode survei yang berakhir dan dispatch notifikasi.

---

## 6. TABEL MATRIKS FITUR & PERBANDINGAN ROLE

Tabel berikut menunjukkan hak akses fitur untuk setiap role:

| Fitur / Modul Aplikasi | Responden (Publik) | Petugas Lapangan | Admin Rumah Sakit | Super Admin |
| :--- | :---: | :---: | :---: | :---: |
| **Isi Survei 14 Unsur IKM + NPS** | ✅ Ya | ✅ Ya | ✅ Ya | ✅ Ya |
| **Pindai QR Code via Kamera HP** | ✅ Ya | ✅ Ya | ❌ Tidak | ❌ Tidak |
| **Tampilkan QR Code Unit Layanan** | ❌ Tidak | ✅ Ya (Di HP & Web) | ✅ Ya | ❌ Tidak |
| **Live Feed Respon Unit Masuk** | ❌ Tidak | ✅ Ya (Khusus unitnya) | ✅ Ya (Seluruh RS) | ✅ Ya (Seluruh RS) |
| **Dashboard Analitik IKM & Radar** | ❌ Tidak | ❌ Tidak | ✅ Ya (RS Miliknya) | ✅ Ya (Nasional/Semua) |
| **Kelola Master Unit Pelayanan** | ❌ Tidak | ❌ Tidak | ✅ Ya | ❌ Tidak |
| **Buat Periode & Kuesioner Survei** | ❌ Tidak | ❌ Tidak | ✅ Ya | ✅ Master Nasional |
| **Kelola Akun Petugas Lapangan** | ❌ Tidak | ❌ Tidak | ✅ Ya | ✅ Ya |
| **Ekspor Laporan (Excel, PDF, JSON)**| ❌ Tidak | ❌ Tidak | ✅ Ya (RS Miliknya) | ✅ Ya (Multi-RS) |
| **Komparasi Kinerja Antar-RS** | ❌ Tidak | ❌ Tidak | ❌ Tidak | ✅ Ya |
| **Pendaftaran Rumah Sakit Baru** | ❌ Tidak | ❌ Tidak | ❌ Tidak | ✅ Ya |
| **Audit Trail Seluruh Log Sistem** | ❌ Tidak | ❌ Tidak | ✅ Terbatas RS | ✅ Global Nasional |

---

## 7. PUSAT BANTUAN & TROUBLESHOOTING UMUM

### 1. Pesan "Akun terkunci sementara" (Error 423) saat Login
* **Penyebab**: Terjadi kesalahan memasukkan password sebanyak 5 kali berturut-turut.
* **Solusi**:
  - Tunggu selama 15 menit agar kunci akun terbuka otomatis.
  - Atau hubungi Admin Rumah Sakit / Super Admin untuk melakukan reset kata sandi melalui menu Manajemen Pengguna.

### 2. Kamera Pemindai QR Tidak Mau Terbuka di HP Android
* **Penyebab**: Izin akses kamera belum diizinkan pada aplikasi.
* **Solusi**:
  - Buka menu **Pengaturan HP (Settings)** -> **Aplikasi** -> **E-Survey** -> **Izin (Permissions)**.
  - Pastikan izin **Kamera (Camera)** disetel ke status **"Izinkan saat aplikasi digunakan"**.

### 3. Data Survei Gagal Terkirim Saat Pasien di Area Susah Sinyal
* **Fitur Offline Sync**:
  - Pasien tidak perlu mengulang pengisian survei dari awal.
  - Aplikasi **E-Survey** secara otomatis menyimpan jawaban di penyimpanan lokal ponsel (*local storage*).
  - Begitu perangkat mendapatkan koneksi internet, data akan otomatis tersinkronisasi ke server pusat tanpa data hilang.

### 4. Cara Mencetak QR Code yang Tidak Mudah Rusak di Loket RS
* **Rekomendasi Admin RS**:
  - Unduh file QR Code dari menu **Manajemen QR Code** dalam format resolusi tinggi PNG.
  - Cetak menggunakan bahan stiker *Vinyl Matte* atau masukkan ke dalam *Acrylic Tent Card* ukuran A5/A6.
  - Letakkan di dekat loket penyerahan obat, loket kasir, atau pintu keluar ruang IGD yang mudah terlihat oleh pasien.

---

> **Dokumen Panduan E-Survey Versi 1.0.0**  
> Diterbitkan: 2026 | Standar KemenPAN-RB No. 14 Tahun 2017 & Akreditasi Faskes Kemenkes RI.
