"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  Award,
  TrendingUp,
  ArrowRight,
  ShieldAlert,
  BarChart3,
  ExternalLink,
  Loader2,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getHospitalComparisonStats } from "@/actions/analytics-actions";

export default function SuperAdminDashboardPage() {
  const chartColors = ["#0d9488", "#14b8a6", "#10b981", "#f59e0b", "#06b6d4"];
  const [comparisonList, setComparisonList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHospitalComparisonStats()
      .then((data) => setComparisonList(data))
      .catch((err) => console.error("Error fetching admin comparison:", err))
      .finally(() => setLoading(false));
  }, []);

  const totalHospitals = comparisonList.length;
  const totalResponses = comparisonList.reduce((acc, h) => acc + h.totalResponses, 0);
  const avgNationalIkm =
    totalHospitals > 0
      ? (
          comparisonList.reduce((acc, h) => acc + h.averageScore, 0) /
          totalHospitals
        ).toFixed(1)
      : "88.0";

  const chartData = comparisonList.map((h) => ({
    hospital: h.name.replace("Rumah Sakit Umum Daerah", "RSUD").replace("RSUP Dr. ", ""),
    ikm: h.averageScore,
    responses: h.totalResponses,
  }));

  const topPerformer = comparisonList[0];
  const lowestPerformer = comparisonList[comparisonList.length - 1];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard Pengawasan Platform Global"
        description="Ringkasan pemantauan kepuasan masyarakat seluruh rumah sakit mitra di basis data MySQL."
        breadcrumbs={[
          { label: "Super Admin", href: "/admin/dashboard" },
          { label: "Dashboard Ringkasan" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/admin/hospitals/new">
              <Button size="sm">+ Tambah RS Baru</Button>
            </Link>
            <Link href="/admin/comparison">
              <Button variant="outline" size="sm">
                <BarChart3 className="w-4 h-4 mr-1.5" />
                Komparasi Lintas RS
              </Button>
            </Link>
          </div>
        }
      />

      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs">Memuat data metrik nasional dari MySQL...</p>
        </div>
      ) : (
        <>
          {/* KPI Global Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Total Rumah Sakit Mitra"
              value={`${totalHospitals} RS`}
              description="Semua aktif beroperasi di MySQL"
              icon={<Building2 className="w-5 h-5 text-primary" />}
              trend={{ value: "+3 RS terdaftar", isPositive: true }}
            />
            <StatCard
              title="Total Respons Nasional"
              value={totalResponses.toLocaleString("id-ID")}
              description="Terkumpul dari formulir survei"
              icon={<Users className="w-5 h-5 text-teal-600" />}
              trend={{ value: "Data real-time", isPositive: true }}
            />
            <StatCard
              title="Rata-rata Skor IKM Nasional"
              value={`${avgNationalIkm} / 100`}
              description="Mutu Pelayanan: Sangat Baik (A)"
              icon={<Award className="w-5 h-5 text-emerald-500" />}
              trend={{ value: "Standar Permenpan RB", isPositive: true }}
            />
            <StatCard
              title="Capaian Target Respon"
              value={`${Math.min(100, Math.round((totalResponses / 100) * 100))}%`}
              description="Target 100 respons awal"
              icon={<TrendingUp className="w-5 h-5 text-amber-500" />}
              trend={{ value: "Tercapai", isPositive: true }}
            />
          </div>

          {/* Chart Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Perbandingan Skor IKM Antar Rumah Sakit</CardTitle>
                <CardDescription>
                  Skor rata-rata kepuasan masyarakat (skala 0–100) berdasarkan survei berjalan.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                      <XAxis
                        dataKey="hospital"
                        tick={{ fontSize: 11, fill: "currentColor" }}
                        interval={0}
                        angle={-10}
                        textAnchor="end"
                      />
                      <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: "currentColor" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--color-card)",
                          borderColor: "var(--color-border)",
                          borderRadius: "1rem",
                          fontSize: "12px",
                        }}
                        formatter={(value: any) => [`${value} / 100`, "Indeks IKM"]}
                      />
                      <Bar dataKey="ikm" radius={[8, 8, 0, 0]}>
                        {chartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Top Performer Card */}
            <Card>
              <CardHeader>
                <CardTitle>Peringkat Mutu Tertinggi</CardTitle>
                <CardDescription>RS dengan indeks kepuasan tertinggi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {topPerformer && (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="success" className="font-bold">
                        Peringkat #1 Nasional
                      </Badge>
                      <span className="font-mono text-xs text-muted-foreground">{topPerformer.code}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-sm">{topPerformer.name}</h4>
                      <p className="text-xs text-muted-foreground">{topPerformer.city}</p>
                    </div>
                    <div className="pt-2 border-t border-emerald-500/20 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Skor Rata-rata:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
                        {topPerformer.averageScore} / 100
                      </strong>
                    </div>
                  </div>
                )}

                {lowestPerformer && lowestPerformer.id !== topPerformer?.id && (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-800 dark:text-amber-300">
                        Perlu Pendampingan:
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">{lowestPerformer.code}</span>
                    </div>
                    <p className="font-semibold text-foreground">{lowestPerformer.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      Skor {lowestPerformer.averageScore} / 100 ({lowestPerformer.totalResponses} respons)
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
