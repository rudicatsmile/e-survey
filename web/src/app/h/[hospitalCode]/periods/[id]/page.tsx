"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Users,
  Award,
  Lock,
  ArrowLeft,
  CheckCircle2,
  FileSpreadsheet,
  AlertTriangle,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { DUMMY_PERIODS, DUMMY_HOSPITALS } from "@/lib/dummy-data";

interface PeriodDetailProps {
  params: Promise<{ hospitalCode: string; id: string }>;
}

export default function PeriodDetailPage({ params }: PeriodDetailProps) {
  const resolvedParams = use(params);
  const hospital =
    DUMMY_HOSPITALS.find(
      (h) => h.code.toUpperCase() === resolvedParams.hospitalCode.toUpperCase()
    ) || DUMMY_HOSPITALS[0];

  const period =
    DUMMY_PERIODS.find((p) => p.id === resolvedParams.id) || DUMMY_PERIODS[0];

  const [status, setStatus] = useState(period.status);

  const handleClosePeriod = () => {
    if (
      confirm(
        "Apakah Anda yakin ingin menutup periode ini? Semua data respons akan dikunci (is_locked = true) dan survei tidak dapat menerima jawaban baru lagi."
      )
    ) {
      setStatus("CLOSED");
      alert("Periode survei berhasil ditutup dan seluruh data telah dikunci permanen.");
    }
  };

  const percent = Math.min(
    100,
    Math.round((period.totalResponses / (period.targetResponses || 1000)) * 100)
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Detail Periode: ${period.name}`}
        description={`Status pelaksanaan survei di ${hospital.name}.`}
        breadcrumbs={[
          { label: hospital.code, href: `/h/${hospital.code}/dashboard` },
          { label: "Periode Survei", href: `/h/${hospital.code}/periods` },
          { label: period.name },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href={`/h/${hospital.code}/reports/satisfaction`}>
              <Button variant="outline" size="sm">
                <FileSpreadsheet className="w-4 h-4 mr-1.5" />
                Lihat Laporan IKM
              </Button>
            </Link>
            {status === "ACTIVE" && (
              <Button variant="danger" size="sm" onClick={handleClosePeriod}>
                <Lock className="w-4 h-4 mr-1.5" />
                Tutup & Kunci Periode
              </Button>
            )}
          </div>
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Respons Terkumpul"
          value={`${period.totalResponses} / ${period.targetResponses}`}
          description={`${percent}% dari target tercapai`}
          icon={<Users className="w-5 h-5 text-primary" />}
        />
        <StatCard
          title="Skor Rata-rata IKM"
          value={`${period.averageScore} / 100`}
          description="Kategori: Mutu B (Baik)"
          icon={<Award className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard
          title="Status Periode"
          value={status === "ACTIVE" ? "SEDANG BERJALAN" : status === "CLOSED" ? "DITUTUP / TERKUNCI" : "DRAF"}
          description={`Rentang: ${period.startDate} s/d ${period.endDate}`}
          icon={<CalendarDays className="w-5 h-5 text-teal-500" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Informasi Periode</CardTitle>
          <CardDescription>Detail teknis kuesioner dan aturan penguncian data.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-border/50">
            <div>
              <span className="text-muted-foreground block">Nama Periode</span>
              <span className="font-bold text-foreground text-sm">{period.name}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Status Pelaksanaan</span>
              <div className="mt-1">
                {status === "ACTIVE" ? (
                  <Badge variant="success">Sedang Berjalan (Aktif Menerima Jawaban)</Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">Telah Ditutup & Dikunci</Badge>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-border/50">
            <div>
              <span className="text-muted-foreground block">Kuesioner Instrumen yang Digunakan</span>
              <span className="font-semibold text-foreground">{period.questionnaireTitle}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Rentang Tanggal Berlaku</span>
              <span className="font-mono font-semibold text-foreground">{period.startDate} s/d {period.endDate}</span>
            </div>
          </div>

          <div>
            <span className="text-muted-foreground block">Keterangan Audit Trail</span>
            <p className="text-muted-foreground mt-1 leading-relaxed">
              Penutupan periode akan mencatat log ke <code>survey_history_logs</code> dan menandai seluruh baris respons pada tabel <code>survey_responses</code> menjadi <code>is_locked = true</code> agar integritas laporan tidak dapat dimanipulasi setelah penutupan resmi.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
