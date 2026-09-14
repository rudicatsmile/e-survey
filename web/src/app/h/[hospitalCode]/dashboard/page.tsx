"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Award,
  TrendingUp,
  Layers,
  QrCode,
  Download,
  AlertTriangle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getHospitalDashboardStats, DashboardStats } from "@/actions/analytics-actions";
import { getHospitalReviewsAction } from "@/actions/review-actions";

interface HospitalDashboardProps {
  params: Promise<{ hospitalCode: string }>;
}

export default function HospitalDashboardPage({ params }: HospitalDashboardProps) {
  const resolvedParams = use(params);
  const hospitalCode = resolvedParams.hospitalCode.toUpperCase();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getHospitalDashboardStats(hospitalCode),
      getHospitalReviewsAction(hospitalCode, 'ALL'),
    ])
      .then(([statsData, reviewsData]) => {
        setStats(statsData);
        setReviews(reviewsData);
      })
      .catch((err) => console.error("Error loading dashboard metrics:", err))
      .finally(() => setLoading(false));
  }, [hospitalCode]);

  if (loading) {
    return (
      <div className="p-16 flex flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs">Memuat analitik IKM dan metrik rumah sakit dari MySQL...</p>
      </div>
    );
  }

  const bestUnit = stats?.bestUnit;
  const lowestUnit = stats?.lowestUnit;

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Dashboard Evaluasi: ${stats?.hospitalName || hospitalCode}`}
        description={`Pantauan real-time kepuasan pasien, kinerja per unit, dan saran masyarakat dari database MySQL.`}
        breadcrumbs={[
          { label: hospitalCode, href: `/h/${hospitalCode}/dashboard` },
          { label: "Dashboard Utama" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href={`/h/${hospitalCode}/qr-codes`}>
              <Button variant="outline" size="sm">
                <QrCode className="w-4 h-4 mr-1.5" />
                Cetak QR Unit
              </Button>
            </Link>
            <Link href={`/h/${hospitalCode}/reports/export`}>
              <Button size="sm">
                <Download className="w-4 h-4 mr-1.5" />
                Export Laporan
              </Button>
            </Link>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Respons Pasien"
          value={stats ? stats.totalResponses.toLocaleString("id-ID") : "0"}
          description="Periode Survei Terkini"
          icon={<Users className="w-5 h-5 text-primary" />}
          trend={{ value: "+50 respons terlacak", isPositive: true }}
        />
        <StatCard
          title="Indeks Kepuasan (IKM)"
          value={`${stats?.averageScore || 0} / 100`}
          description={`Mutu Pelayanan: ${stats?.ikmGrade || "B"} (${stats?.ikmQuality || "Baik"})`}
          icon={<Award className="w-5 h-5 text-emerald-500" />}
          trend={{ value: "Permenpan RB No. 14/2017", isPositive: true }}
        />
        <StatCard
          title="Net Promoter Score (NPS)"
          value={`${stats && stats.npsScore >= 0 ? "+" : ""}${stats?.npsScore || 0}`}
          description={`${stats?.promoterPercent || 0}% Promotor Pasien`}
          icon={<TrendingUp className="w-5 h-5 text-teal-500" />}
          trend={{ value: `${stats?.detractorPercent || 0}% Detraktor`, isPositive: (stats?.npsScore || 0) > 30 }}
        />
        <StatCard
          title="Unit Layanan Unggulan"
          value={bestUnit ? `${bestUnit.score} Poin` : "100"}
          description={bestUnit ? bestUnit.name : "Semua unit prima"}
          icon={<Layers className="w-5 h-5 text-emerald-500" />}
        />
      </div>

      {/* Warning Alert if lowest unit below threshold */}
      {lowestUnit && lowestUnit.score < 80 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <p className="font-bold">Perhatian Khusus: {lowestUnit.name}</p>
              <p className="text-[11px] opacity-90 mt-0.5">
                Skor unit ini saat ini {lowestUnit.score} (di bawah target minimal 80.0). Periksa ulasan kualitatif untuk tindakan perbaikan.
              </p>
            </div>
          </div>
          <Link href={`/h/${hospitalCode}/reports/reviews`}>
            <Button variant="outline" size="sm" className="shrink-0 text-xs bg-card">
              Lihat Ulasan Unit
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      )}

      {/* Daily Trend Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Tren Pengisian Survei 7 Hari Terakhir</CardTitle>
            <CardDescription>Volume respons harian dan pergerakan skor kepuasan pasien dari basis data real-time.</CardDescription>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <span className="w-3 h-3 rounded-full bg-primary inline-block" />
            <span>Volume Respons Harian</span>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.dailyTrends || []} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorResp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "currentColor" }} />
                <YAxis tick={{ fontSize: 11, fill: "currentColor" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    borderColor: "var(--color-border)",
                    borderRadius: "1rem",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="responses"
                  stroke="#0d9488"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorResp)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Two Column Grid: Unit Ranking & Latest Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Unit Ranking Table */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Peringkat Skor Kepuasan per Unit Layanan</CardTitle>
              <CardDescription>Evaluasi berkala seluruh instalasi pelayanan di RS.</CardDescription>
            </div>
            <Link href={`/h/${hospitalCode}/units`}>
              <Button variant="ghost" size="sm" className="text-xs">
                Kelola Unit
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 border-y border-border text-muted-foreground uppercase text-[10px] font-bold">
                  <tr>
                    <th className="px-5 py-3">Peringkat & Unit</th>
                    <th className="px-5 py-3 text-right">Respons</th>
                    <th className="px-5 py-3 text-center">Skor IKM</th>
                    <th className="px-5 py-3 text-center">Status Mutu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {stats?.unitRankings.map((u, idx) => (
                    <tr key={u.unitId} className="hover:bg-muted/40 transition-colors">
                      <td className="px-5 py-3 font-medium text-foreground flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-muted text-muted-foreground font-bold text-[10px] flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="font-bold">{u.unitName}</span>
                          <span className="text-[10px] font-mono text-muted-foreground block">{u.unitCode}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right font-semibold text-foreground tabular-nums">
                        {u.responses}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <Badge
                          variant={u.score >= 88 ? "success" : u.score >= 76 ? "default" : "warning"}
                          className="tabular-nums font-bold"
                        >
                          {u.score}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-center text-[11px] text-muted-foreground">
                        {u.grade === "A" ? "Sangat Baik (A)" : u.grade === "B" ? "Baik (B)" : "Kurang Baik (C)"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Latest Patient Reviews Feed */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Ulasan Terbaru Pasien</CardTitle>
              <CardDescription>Saran kualitatif dari database</CardDescription>
            </div>
            <Link href={`/h/${hospitalCode}/reports/reviews`}>
              <Button variant="ghost" size="sm" className="text-xs">
                Semua Ulasan
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3.5">
            {reviews.slice(0, 4).map((rev) => (
              <div
                key={rev.id}
                className="p-3 rounded-xl border border-border/70 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground text-[11px] truncate max-w-[150px]">
                    {rev.unitName || "Unit Pelayanan"}
                  </span>
                  <Badge
                    variant={rev.sentiment === "POSITIVE" ? "success" : rev.sentiment === "NEGATIVE" ? "destructive" : "secondary"}
                    className="text-[10px] px-1.5 py-0"
                  >
                    {rev.sentiment}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-[11px] italic leading-relaxed line-clamp-2">
                  &quot;{rev.reviewText}&quot;
                </p>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground/80 pt-1 border-t border-border/40">
                  <span>{new Date(rev.createdAt).toLocaleDateString("id-ID")}</span>
                  <span className="font-semibold text-foreground">Skor: {rev.overallScore || "-"}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
