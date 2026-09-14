import React from "react";
import Link from "next/link";
import { HelpCircle, ShieldCheck, Clock, FileCheck, ArrowRight } from "lucide-react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function FaqPage() {
  const faqs = [
    {
      q: "Apakah data dan identitas saya benar-benar aman dan anonim?",
      a: "Ya, 100% anonim. Sistem SurveiKepuasan tidak pernah menanyakan atau menyimpan Nama Lengkap, NIK, alamat rumah, nomor telepon, ataupun nomor rekam medis Anda. Alamat IP yang digunakan pun di-hash satu arah menggunakan algoritma SHA-256 hanya untuk mencegah spam submission.",
    },
    {
      q: "Apa dasar hukum pengukuran kepuasan ini?",
      a: "Survei ini disusun merujuk pada Peraturan Menteri Pendayagunaan Aparatur Negara dan Reformasi Birokrasi (PermenPANRB) Republik Indonesia Nomor 14 Tahun 2017 tentang Pedoman Penyusunan Survei Kepuasan Masyarakat Unit Penyelenggara Pelayanan Publik.",
    },
    {
      q: "Berapa lama waktu yang dibutuhkan untuk mengisi kuesioner?",
      a: "Hanya sekitar 2 hingga 3 menit. Kuesioner terdiri dari 9 pertanyaan utama dengan skala bintang (Likert 1–5) dan satu kolom saran terbuka opsional.",
    },
    {
      q: "Apakah penilaian negatif/keluhan saya akan mempengaruhi pelayanan rumah sakit kepada saya?",
      a: "Sama sekali tidak. Petugas medis dan perawat tidak dapat mengetahui siapa yang memberikan nilai tertentu. Penilaian dikumpulkan secara kolektif untuk dianalisis oleh Komite Mutu Rumah Sakit dan Super Admin Kementerian/Dinas Kesehatan terkait.",
    },
    {
      q: "Bagaimana jika rumah sakit saya tidak tercantum di direktori?",
      a: "Anda dapat meminta petugas administrasi rumah sakit atau pihak humas untuk mendaftarkan fasilitas mereka ke platform SurveiKepuasan melalui menu Kontak kami.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <Badge variant="secondary">Pusat Bantuan & Edukasi</Badge>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h1>
          <p className="text-sm text-muted-foreground">
            Temukan jawaban lengkap seputar transparansi, keamanan data, dan mekanisme survei kepuasan masyarakat di rumah sakit.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="border-border shadow-xs">
              <CardContent className="p-6 space-y-2">
                <h3 className="text-base font-bold text-foreground flex items-start gap-2.5">
                  <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground pl-7.5 leading-relaxed">
                  {faq.a}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-primary/10 via-background to-background border border-primary/20 text-center space-y-4">
          <h3 className="text-lg font-bold text-foreground">Masih Memiliki Pertanyaan Lain?</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Tim layanan dukungan SurveiKepuasan siap membantu Anda maupun pihak pengelola rumah sakit.
          </p>
          <Link href="/kontak">
            <Button size="sm">
              Hubungi Tim Bantuan
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
