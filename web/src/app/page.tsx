import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Clock,
  BarChart2,
  Building2,
  ArrowRight,
  CheckCircle,
  QrCode,
  Users,
  Award,
  Sparkles,
  Search,
} from "lucide-react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DUMMY_HOSPITALS } from "@/lib/dummy-data";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 border-b border-border/40 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide animate-in fade-in-50">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Standar Indeks Kepuasan Masyarakat (IKM) PermenPANRB</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground tracking-tight leading-[1.15]">
              Suara Anda Membangun{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-teal-500 to-emerald-600">
                Layanan Rumah Sakit
              </span>{" "}
              Lebih Baik
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Bantu rumah sakit meningkatkan mutu pelayanan IGD, Poli Rawat Jalan, dan Farmasi. Pengisian cepat hanya <strong className="text-foreground">±3 menit</strong>, <strong className="text-foreground">100% Anonim</strong>, tanpa perlu login.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Link href="/pilih-rs" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto shadow-md shadow-primary/25">
                  Mulai Isi Survei Pasien
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Masuk Sebagai Pengelola RS
                </Button>
              </Link>
            </div>

            {/* Quick Guarantees */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Data Rahasia & Tanpa NIK
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" />
                Selesai dalam 3 Menit
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                Akreditasi Mutu Fasyankes
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metric Highlights */}
      <section className="py-12 border-b border-border/40 bg-card/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-extrabold text-primary tabular-nums">45+</p>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">Rumah Sakit Mitra</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-extrabold text-foreground tabular-nums">142.500+</p>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">Respons Pasien Terkumpul</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">84.8</p>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">Rata-rata Skor IKM (Kategori Baik)</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-extrabold text-foreground tabular-nums">100%</p>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">Jaminan Anonimitas Responden</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hospitals Directory Preview */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <Badge variant="secondary" className="mb-2">Direktori Rumah Sakit</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Pilih Rumah Sakit yang Anda Kunjungi
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Silakan pilih fasilitas kesehatan untuk mulai mengisi kuesioner kepuasan pelayanan.
              </p>
            </div>
            <Link href="/pilih-rs">
              <Button variant="outline" size="sm">
                Lihat Semua ({DUMMY_HOSPITALS.length} RS)
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DUMMY_HOSPITALS.slice(0, 3).map((hospital) => (
              <Card key={hospital.id} className="group hover:border-primary/50 transition-all duration-200">
                <CardContent className="p-6 flex flex-col h-full justify-between">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-base">
                        {hospital.code.split("-")[0]}
                      </div>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {hospital.code}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {hospital.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {hospital.city} • {hospital.unitCount} Unit Layanan Aktif
                      </p>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {hospital.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-border/50 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Skor Kepuasan</span>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {hospital.averageScore} / 100
                      </span>
                    </div>
                    <Link href={`/s/${hospital.code}`}>
                      <Button size="sm">
                        Mulai Survei
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Step Flow */}
      <section className="py-16 bg-muted/40 border-y border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Alur Pengisian Survei yang Cepat & Mudah
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Dirancang dengan alur intuitif tanpa birokrasi pendaftaran akun.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-card border border-border space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h3 className="text-base font-bold text-foreground">Pilih RS & Unit Layanan</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Pilih rumah sakit dari direktori atau langsung pindai (scan) QR Code yang tersedia di loket unit layanan (IGD, Poli, Farmasi).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h3 className="text-base font-bold text-foreground">Beri Penilaian Objektif</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Jawab 9 pertanyaan baku IKM (skala 1–5 bintang) mengenai kecepatan, keramahan, dan kenyamanan fasilitas rumah sakit.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h3 className="text-base font-bold text-foreground">Sampaikan Ulasan & Kirim</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tuliskan saran atau keluhan secara terbuka. Masukan Anda langsung dianalisis pimpinan RS untuk perbaikan layanan.
              </p>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
