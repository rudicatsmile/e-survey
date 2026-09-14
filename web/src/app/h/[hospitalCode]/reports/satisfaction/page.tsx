"use client";

import React, { use } from "react";
import Link from "next/link";
import {
  BarChart3,
  Download,
  Award,
  CheckCircle2,
  FileSpreadsheet,
  Building2,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DUMMY_HOSPITALS } from "@/lib/dummy-data";

interface SatisfactionReportProps {
  params: Promise<{ hospitalCode: string }>;
}

export default function SatisfactionReportPage({ params }: SatisfactionReportProps) {
  const resolvedParams = use(params);
  const hospital =
    DUMMY_HOSPITALS.find(
      (h) => h.code.toUpperCase() === resolvedParams.hospitalCode.toUpperCase()
    ) || DUMMY_HOSPITALS[0];

  const ikmElements = [
    { no: 1, element: "Kesesuaian Persyaratan Pelayanan", score: 86.5, conversion: 3.46, mutu: "A (Sangat Baik)" },
    { no: 2, element: "Kemudahan Prosedur Pelayanan", score: 84.2, conversion: 3.37, mutu: "B (Baik)" },
    { no: 3, element: "Kecepatan Waktu Pelayanan", score: 79.4, conversion: 3.18, mutu: "B (Baik)" },
    { no: 4, element: "Kewajaran Biaya / Tarif (Non-BPJS)", score: 88.0, conversion: 3.52, mutu: "A (Sangat Baik)" },
    { no: 5, element: "Kesesuaian Produk Pelayanan", score: 87.1, conversion: 3.48, mutu: "A (Sangat Baik)" },
    { no: 6, element: "Kompetensi / Kemampuan Petugas Medis", score: 91.5, conversion: 3.66, mutu: "A (Sangat Baik)" },
    { no: 7, element: "Perilaku & Keramahan Petugas", score: 89.2, conversion: 3.57, mutu: "A (Sangat Baik)" },
    { no: 8, element: "Kualitas Sarana & Kenyamanan Ruang", score: 82.4, conversion: 3.30, mutu: "B (Baik)" },
    { no: 9, element: "Penanganan Pengaduan & Keluhan Pasien", score: 81.0, conversion: 3.24, mutu: "B (Baik)" },
  ];

  const totalIKM = 84.6;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Laporan Indeks Kepuasan Masyarakat (IKM): ${hospital.name}`}
        description="Pengukuran resmi mutu penyelenggaraan pelayanan publik berdasarkan PermenPANRB Nomor 14 Tahun 2017."
        breadcrumbs={[
          { label: hospital.code, href: `/h/${hospital.code}/dashboard` },
          { label: "Laporan IKM" },
        ]}
        actions={
          <Link href={`/h/${hospital.code}/reports/export`}>
            <Button size="sm">
              <Download className="w-4 h-4 mr-1.5" />
              Unduh Dokumen Laporan (PDF)
            </Button>
          </Link>
        }
      />

      {/* Nilai IKM Rangkuman */}
      <Card className="bg-gradient-to-r from-primary/10 via-background to-card border-primary/30">
        <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Nilai IKM Terkonversi (Skala 25–100)
            </span>
            <div className="flex items-center gap-3">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground tabular-nums">
                {totalIKM}
              </h2>
              <div className="text-left">
                <Badge variant="success" className="text-sm px-3 py-1 font-bold">
                  Mutu Pelayanan B (Baik)
                </Badge>
                <p className="text-[11px] text-muted-foreground mt-0.5">Kinerja Unit Pelayanan Sangat Memuaskan</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border text-xs space-y-1 text-right">
            <p className="text-muted-foreground">Jumlah Sampel Valid: <strong className="text-foreground">{hospital.totalResponses.toLocaleString("id-ID")} Responden</strong></p>
            <p className="text-muted-foreground">Periode Pelaksanaan: <strong className="text-foreground">Triwulan I 2025</strong></p>
            <p className="text-emerald-600 dark:text-emerald-400 font-semibold">Taraf Signifikansi 95% (Margin of Error &lt; 3%)</p>
          </div>
        </CardContent>
      </Card>

      {/* Tabel 9 Unsur Pelayanan */}
      <Card>
        <CardHeader>
          <CardTitle>Rincian Skor per Unsur Pelayanan Publik (IKM)</CardTitle>
          <CardDescription>Bobot nilai rata-rata tertimbang dari seluruh butir kuesioner.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 border-y border-border text-muted-foreground uppercase text-[10px] font-bold">
                <tr>
                  <th className="px-6 py-3.5">No</th>
                  <th className="px-6 py-3.5">Unsur Pelayanan KepmenPANRB</th>
                  <th className="px-6 py-3.5 text-center">Nilai Rata-rata (NRR)</th>
                  <th className="px-6 py-3.5 text-center">NRR Tertimbang (x25)</th>
                  <th className="px-6 py-3.5 text-center">Kategori Mutu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {ikmElements.map((el) => (
                  <tr key={el.no} className="hover:bg-muted/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-muted-foreground">
                      U{el.no}
                    </td>
                    <td className="px-6 py-4 font-bold text-foreground text-sm">
                      {el.element}
                    </td>
                    <td className="px-6 py-4 text-center font-mono font-semibold text-foreground">
                      {el.conversion.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-foreground tabular-nums text-sm">
                        {el.score}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge
                        variant={el.score >= 85 ? "success" : "default"}
                        className="font-semibold"
                      >
                        {el.mutu}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
