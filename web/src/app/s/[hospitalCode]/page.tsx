import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ShieldCheck,
  Clock,
  HeartHandshake,
  CheckCircle2,
  Building2,
  Phone,
  MapPin,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getHospitalByCode } from "@/actions/hospital-actions";
import { DUMMY_HOSPITALS } from "@/lib/dummy-data";

interface HospitalWelcomeProps {
  params: Promise<{ hospitalCode: string }>;
  searchParams: Promise<{ unit?: string; period?: string }>;
}

export async function generateMetadata({
  params,
}: HospitalWelcomeProps): Promise<Metadata> {
  const { hospitalCode } = await params;
  const dbHospital = await getHospitalByCode(hospitalCode);
  const name = dbHospital?.name || hospitalCode;

  return {
    title: `Survei Kepuasan Masyarakat - ${name}`,
    description: `Formulir resmi evaluasi mutu dan survei kepuasan masyarakat (IKM) untuk pelayanan kesehatan di ${name}. Anonim, aman, dan transparan.`,
    openGraph: {
      title: `Survei Kepuasan ${name}`,
      description: `Bantu ${name} meningkatkan mutu pelayanan kesehatan untuk seluruh masyarakat.`,
    },
  };
}

export default async function HospitalWelcomePage({
  params,
  searchParams,
}: HospitalWelcomeProps) {
  const { hospitalCode } = await params;
  const { unit } = await searchParams;

  // Coba ambil dari database MySQL, jika belum ada gunakan dummy fallback
  const dbHospital = await getHospitalByCode(hospitalCode);
  const dummyHospital = DUMMY_HOSPITALS.find(
    (h) => h.code.toUpperCase() === hospitalCode.toUpperCase()
  );

  const hospital = dbHospital || dummyHospital;

  if (!hospital) {
    return notFound();
  }

  const surveyUrl = `/s/${hospital.code}/survey${unit ? `?unit=${unit}` : ""}`;

  // JSON-LD Schema.org MedicalOrganization
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    name: hospital.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: hospital.address || hospital.city,
      addressLocality: hospital.city,
      addressCountry: "ID",
    },
    telephone: hospital.phone || "",
    email: hospital.email || "",
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PublicNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Hospital Banner Card */}
        <Card className="overflow-hidden border-border/80 shadow-md">
          <div className="bg-gradient-to-r from-primary/15 via-teal-500/10 to-transparent p-6 sm:p-8 border-b border-border/50">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl shadow-sm shrink-0">
                <Building2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="font-mono text-xs">
                    {hospital.code}
                  </Badge>
                  <span className="text-xs text-muted-foreground">Tenant Terverifikasi</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {hospital.name}
                </h1>
                <p className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>{hospital.address || hospital.city}</span>
                </p>
              </div>
            </div>
          </div>

          <CardContent className="p-6 sm:p-8 space-y-8">
            {/* Intro text */}
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-foreground">
                Selamat Datang di Survei Kepuasan Masyarakat (IKM)
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Suara dan pengalaman Anda sangat berharga bagi kami. Penilaian ini digunakan oleh jajaran manajemen dan direksi {hospital.name} untuk mengevaluasi mutu pelayanan, kedisiplinan petugas, kecepatan tindakan, serta kelayakan sarana prasarana rumah sakit.
              </p>
            </div>

            {/* Key Guarantees */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-card border border-border/60 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-foreground">100% Anonim & Rahasia</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Tidak meminta Nama Lengkap, NIK, No. Rekam Medis, maupun nomor telepon. IP perangkat di-hash secara kriptografis.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-card border border-border/60 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-foreground">Hanya 2–3 Menit</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Kuesioner dirancang ringkas dengan sistem bintang (skala 1–5) yang mudah dipahami di ponsel pintar Anda.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-card border border-border/60 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-foreground">Langsung Ditindaklanjuti</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Hasil pengisian Anda langsung terakumulasi ke dalam dasbor analitik direktur rumah sakit secara real-time.
                </p>
              </div>
            </div>

            {unit && (
              <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Unit Terdeteksi: {unit.toUpperCase()}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">Dipindai dari QR Meja Petugas</span>
              </div>
            )}

            {/* CTA Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <Link href={surveyUrl} className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto px-8 justify-center shadow-md shadow-primary/20">
                  Mulai Pengisian Survei Sekarang
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/pilih-rs" className="text-xs text-muted-foreground hover:text-foreground">
                Bukan rumah sakit ini? Pilih fasilitas lain
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      <PublicFooter />
    </div>
  );
}
