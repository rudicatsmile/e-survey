"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { CalendarDays, Plus, Search, Eye, CheckCircle2, Lock } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DUMMY_PERIODS, DUMMY_HOSPITALS } from "@/lib/dummy-data";

interface PeriodsPageProps {
  params: Promise<{ hospitalCode: string }>;
}

export default function HospitalPeriodsPage({ params }: PeriodsPageProps) {
  const resolvedParams = use(params);
  const hospital =
    DUMMY_HOSPITALS.find(
      (h) => h.code.toUpperCase() === resolvedParams.hospitalCode.toUpperCase()
    ) || DUMMY_HOSPITALS[0];

  const [searchTerm, setSearchTerm] = useState("");

  const filteredPeriods = DUMMY_PERIODS.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge variant="success">Sedang Berjalan</Badge>;
      case "CLOSED":
        return <Badge variant="outline" className="text-muted-foreground">Ditutup</Badge>;
      case "DRAFT":
        return <Badge variant="secondary">Draf Persiapan</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Periode Survei: ${hospital.name}`}
        description="Kelola jadwal pelaksanaan survei berkala (Triwulan, Semester, atau Khusus)."
        breadcrumbs={[
          { label: hospital.code, href: `/h/${hospital.code}/dashboard` },
          { label: "Periode Survei" },
        ]}
        actions={
          <Link href={`/h/${hospital.code}/periods/new`}>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1.5" />
              Buat Periode Baru
            </Button>
          </Link>
        }
      />

      {/* Filter Toolbar */}
      <div className="flex items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama periode..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Periods Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-[10px] font-bold">
                <tr>
                  <th className="px-6 py-3.5">Nama Periode & Kuesioner</th>
                  <th className="px-6 py-3.5">Rentang Tanggal</th>
                  <th className="px-6 py-3.5 text-center">Status</th>
                  <th className="px-6 py-3.5 text-right">Progres Respons</th>
                  <th className="px-6 py-3.5 text-center">Skor IKM</th>
                  <th className="px-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredPeriods.map((p) => {
                  const percent = Math.min(
                    100,
                    Math.round((p.totalResponses / (p.targetResponses || 1000)) * 100)
                  );
                  return (
                    <tr key={p.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-foreground text-sm">{p.name}</p>
                        <p className="text-[11px] text-muted-foreground line-clamp-1">
                          {p.questionnaireTitle}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground font-mono">
                        {p.startDate} s/d {p.endDate}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(p.status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="space-y-1 inline-block text-right">
                          <span className="font-bold text-foreground tabular-nums">
                            {p.totalResponses} / {p.targetResponses} ({percent}%)
                          </span>
                          <div className="w-28 h-1.5 rounded-full bg-muted overflow-hidden ml-auto">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {p.averageScore > 0 ? (
                          <Badge variant="success" className="font-bold tabular-nums">
                            {p.averageScore}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/h/${hospital.code}/periods/${p.id}`}>
                          <Button variant="outline" size="sm" className="h-7 px-2.5 text-xs">
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            Detail
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
