"use client";

import React, { use } from "react";
import Link from "next/link";
import { Layers, Download, Award, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DUMMY_UNITS, DUMMY_HOSPITALS } from "@/lib/dummy-data";

interface UnitReportsProps {
  params: Promise<{ hospitalCode: string }>;
}

export default function UnitReportsPage({ params }: UnitReportsProps) {
  const resolvedParams = use(params);
  const hospital =
    DUMMY_HOSPITALS.find(
      (h) => h.code.toUpperCase() === resolvedParams.hospitalCode.toUpperCase()
    ) || DUMMY_HOSPITALS[0];

  const sortedUnits = [...DUMMY_UNITS].sort((a, b) => b.averageScore - a.averageScore);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Rekapitulasi Kepuasan per Unit Layanan: ${hospital.name}`}
        description="Peringkat kinerja dan evaluasi perbandingan mutu antar instalasi dan poli rawat jalan."
        breadcrumbs={[
          { label: hospital.code, href: `/h/${hospital.code}/dashboard` },
          { label: "Laporan", href: `/h/${hospital.code}/reports/satisfaction` },
          { label: "Rekap Unit" },
        ]}
        actions={
          <Link href={`/h/${hospital.code}/reports/export`}>
            <Button size="sm">
              <Download className="w-4 h-4 mr-1.5" />
              Export Rekap (.xlsx)
            </Button>
          </Link>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Peringkat Indeks Kepuasan Unit Layanan</CardTitle>
          <CardDescription>Berdasarkan seluruh respons valid pada periode aktif berjalan.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 border-y border-border text-muted-foreground uppercase text-[10px] font-bold">
                <tr>
                  <th className="px-6 py-3.5">Peringkat & Kode</th>
                  <th className="px-6 py-3.5">Nama Unit Layanan</th>
                  <th className="px-6 py-3.5 text-right">Volume Sampel</th>
                  <th className="px-6 py-3.5 text-center">Skor IKM (0–100)</th>
                  <th className="px-6 py-3.5 text-center">Mutu Pelayanan</th>
                  <th className="px-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {sortedUnits.map((u, idx) => (
                  <tr key={u.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-mono font-bold text-foreground text-xs">{u.code}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-foreground text-sm">
                      {u.name}
                    </td>
                    <td className="px-6 py-4 text-right font-bold tabular-nums">
                      {u.totalResponses} Responden
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge
                        variant={u.averageScore >= 85 ? "success" : u.averageScore >= 80 ? "default" : "warning"}
                        className="tabular-nums font-bold"
                      >
                        {u.averageScore}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center font-medium">
                      {u.averageScore >= 85 ? "Sangat Baik (A)" : u.averageScore >= 80 ? "Baik (B)" : "Kurang Memuaskan (C)"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/h/${hospital.code}/qr-codes`}>
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          QR Code
                        </Button>
                      </Link>
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
