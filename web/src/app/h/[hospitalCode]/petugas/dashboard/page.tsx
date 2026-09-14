"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  Users,
  QrCode,
  Award,
  Clock,
  ExternalLink,
  RefreshCw,
  Maximize2,
  X,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { DUMMY_UNITS, DUMMY_HOSPITALS, DUMMY_REVIEWS } from "@/lib/dummy-data";

interface PetugasDashboardProps {
  params: Promise<{ hospitalCode: string }>;
}

export default function PetugasDashboardPage({ params }: PetugasDashboardProps) {
  const resolvedParams = use(params);
  const hospital =
    DUMMY_HOSPITALS.find(
      (h) => h.code.toUpperCase() === resolvedParams.hospitalCode.toUpperCase()
    ) || DUMMY_HOSPITALS[0];

  const assignedUnit = DUMMY_UNITS[0]; // IGD
  const [fullscreenQR, setFullscreenQR] = useState(false);

  const qrUrl = `https://surveikepuasan.id/s/${hospital.code}?unit=${assignedUnit.code}`;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Dashboard Petugas: ${assignedUnit.name}`}
        description={`Penugasan aktif: Ns. Sri Wahyuni • ${hospital.name}.`}
        breadcrumbs={[
          { label: hospital.code, href: `/h/${hospital.code}/dashboard` },
          { label: "Petugas Lapangan", href: `/h/${hospital.code}/petugas` },
          { label: "Dashboard IGD" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFullscreenQR(true)}
            >
              <Maximize2 className="w-4 h-4 mr-1.5" />
              Buka QR Code Layar Penuh (Kios Meja)
            </Button>
            <Link href={`/h/${hospital.code}/petugas/responses`}>
              <Button size="sm">
                Lihat Feed Respons Masuk
              </Button>
            </Link>
          </div>
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Respons Hari Ini"
          value="52"
          description="Pasien & keluarga di IGD"
          icon={<Users className="w-5 h-5 text-primary" />}
          trend={{ value: "+12 dalam 2 jam terakhir", isPositive: true }}
        />
        <StatCard
          title="Skor Kepuasan IGD"
          value={`${assignedUnit.averageScore} / 100`}
          description="Predikat: Sangat Memuaskan"
          icon={<Award className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard
          title="Waktu Rata-rata Pengisian"
          value="2m 14s"
          description="Efisien & cepat"
          icon={<Clock className="w-5 h-5 text-teal-500" />}
        />
      </div>

      {/* Two Columns: QR Code Display & Recent Responses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* QR Code Stand */}
        <Card className="flex flex-col items-center justify-center p-6 text-center">
          <Badge variant="secondary" className="mb-2">
            Pajangan Meja / Loket
          </Badge>
          <h3 className="text-base font-bold text-foreground mb-1">
            QR Code Survei Pasien IGD
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Arahkan pasien atau keluarga untuk scan kode ini saat menunggu obat/administrasi.
          </p>

          <div className="p-4 rounded-2xl bg-white shadow-sm border border-neutral-200 mb-4">
            <QRCodeSVG value={qrUrl} size={180} fgColor="#0d9488" />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setFullscreenQR(true)}
            className="w-full"
          >
            <Maximize2 className="w-4 h-4 mr-1.5" />
            Mode Tablet Kios Stand
          </Button>
        </Card>

        {/* Live Stream of Feedback for IGD */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Ulasan Masuk Khusus Unit IGD Hari Ini</CardTitle>
              <CardDescription>Umpan balik langsung dari responden di ruang gawat darurat.</CardDescription>
            </div>
            <Link href={`/h/${hospital.code}/petugas/responses`}>
              <Button variant="ghost" size="sm" className="text-xs">
                Lihat Semua Feed
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {DUMMY_REVIEWS.filter((r) => r.unitName.includes("IGD")).map((rev) => (
              <div
                key={rev.id}
                className="p-3.5 rounded-xl border border-border/70 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-muted-foreground">{rev.date}</span>
                  <Badge variant="success">Positif</Badge>
                </div>
                <p className="text-foreground italic bg-muted/30 p-2.5 rounded-lg">
                  &quot;{rev.text}&quot;
                </p>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                  <span>Audit Tiket: {rev.respondentCode}</span>
                  <span className="font-bold text-foreground">Skor: {rev.score}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Fullscreen Kiosk QR Modal */}
      {fullscreenQR && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-8 animate-in fade-in duration-200">
          <button
            onClick={() => setFullscreenQR(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-muted hover:bg-muted/80 text-foreground cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center space-y-4 max-w-md">
            <div className="space-y-1">
              <span className="text-xs font-bold text-primary uppercase tracking-widest">
                {hospital.name}
              </span>
              <h2 className="text-3xl font-extrabold text-foreground">
                Survei Kepuasan Pasien {assignedUnit.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                Silakan scan QR Code di bawah menggunakan kamera smartphone Anda.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white shadow-2xl border-4 border-primary/30 inline-block">
              <QRCodeSVG value={qrUrl} size={300} fgColor="#0d9488" />
            </div>

            <div className="p-3 rounded-xl bg-secondary/50 border border-primary/20 text-xs text-primary font-bold">
              ✓ 100% Anonim &bull; ±2 Menit &bull; Membantu Peningkatan Layanan
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
