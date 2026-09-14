import React from "react";
import { ShieldCheck, Lock, EyeOff, Server, CheckCircle2 } from "lucide-react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PrivasiPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">
        <div className="max-w-2xl space-y-3">
          <Badge variant="secondary">Kebijakan Kerahasiaan Data</Badge>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Kebijakan Privasi & Perlindungan Responden
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Terakhir diperbarui: 14 Maret 2025. Dokumen ini menjelaskan komitmen perlindungan privasi responden dalam pengisian Survei Kepuasan Masyarakat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-border p-5 space-y-2">
            <EyeOff className="w-8 h-8 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Tanpa Data Pribadi (PII)</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Kami tidak pernah meminta NIK KTP, Nama Pasien, Nomor Telepon/WhatsApp, ataupun riwayat rekam medis pribadi.
            </p>
          </Card>

          <Card className="border-border p-5 space-y-2">
            <Lock className="w-8 h-8 text-emerald-500" />
            <h3 className="text-sm font-bold text-foreground">Hashing SHA-256</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Alamat IP hanya diproses dalam bentuk hash satu arah untuk mendeteksi spam serangan bot, bukan identifikasi individu.
            </p>
          </Card>

          <Card className="border-border p-5 space-y-2">
            <Server className="w-8 h-8 text-amber-500" />
            <h3 className="text-sm font-bold text-foreground">Isolasi Multi-Tenant</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Data respons RSUD Cianjur terisolasi secara ketat dan tidak dapat diakses oleh admin rumah sakit lain.
            </p>
          </Card>
        </div>

        <Card className="border-border shadow-xs">
          <CardContent className="p-6 sm:p-8 space-y-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            <h2 className="text-lg font-bold text-foreground">1. Ruang Lingkup Data yang Dikumpulkan</h2>
            <p>
              Platform SurveiKepuasan dirancang dengan prinsip <em>privacy by design</em>. Data yang dikumpulkan semata-mata adalah data agregat persepsi mutu layanan, meliputi:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Nilai kepuasan atas unsur pelayanan (skala 1–5).</li>
              <li>Unit instalasi layanan yang dikunjungi (contoh: IGD, Poli Gigi, Farmasi).</li>
              <li>Data demografis opsional (rentang usia, tingkat pendidikan, kategori pekerjaan umum).</li>
              <li>Ulasan teks saran dan kritik yang disanitasi secara otomatis dari unsur nama orang.</li>
            </ul>

            <h2 className="text-lg font-bold text-foreground pt-4">2. Pemanfaatan Data</h2>
            <p>
              Seluruh data respons diolah menjadi Indeks Kepuasan Masyarakat (IKM) berbobot dan disajikan dalam laporan komparatif berkala kepada Direktur Rumah Sakit dan Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi (KemenPAN-RB).
            </p>

            <h2 className="text-lg font-bold text-foreground pt-4">3. Kontak Petugas Privasi Data</h2>
            <p>
              Apabila terdapat pertanyaan mengenai kebijakan kerahasiaan data ini, Anda dapat menghubungi tim kepatuhan kami di <strong className="text-foreground">privasi@surveikepuasan.id</strong>.
            </p>
          </CardContent>
        </Card>
      </main>

      <PublicFooter />
    </div>
  );
}
