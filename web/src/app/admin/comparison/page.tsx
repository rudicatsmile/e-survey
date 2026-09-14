"use client";

import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Award,
  Download,
  Filter,
  Layers,
  Building2,
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DUMMY_HOSPITALS, DUMMY_MONTHLY_COMPARISON } from "@/lib/dummy-data";

export default function ComparisonPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("Triwulan I 2025");
  const chartColors = ["#0d9488", "#14b8a6", "#10b981", "#f59e0b", "#06b6d4"];

  const comparisonData = [
    {
      name: "RS Siloam Semanggi",
      city: "Jakarta Selatan",
      ikm: 91.2,
      mutu: "A (Sangat Baik)",
      responses: 1650,
      nps: "+68",
      kecepatan: 89.5,
      keramahan: 94.0,
      fasilitas: 92.1,
    },
    {
      name: "RSUP Dr. Hasan Sadikin",
      city: "Bandung",
      ikm: 88.3,
      mutu: "A (Sangat Baik)",
      responses: 3240,
      nps: "+59",
      kecepatan: 84.0,
      keramahan: 91.2,
      fasilitas: 88.5,
    },
    {
      name: "RSUD Sayang Cianjur",
      city: "Cianjur",
      ikm: 84.6,
      mutu: "B (Baik)",
      responses: 1420,
      nps: "+52",
      kecepatan: 78.4,
      keramahan: 89.0,
      fasilitas: 85.2,
    },
    {
      name: "RSUD Kab. Karawang",
      city: "Karawang",
      ikm: 82.1,
      mutu: "B (Baik)",
      responses: 1890,
      nps: "+46",
      kecepatan: 76.5,
      keramahan: 86.8,
      fasilitas: 82.4,
    },
    {
      name: "RSUD Kota Bandung",
      city: "Bandung",
      ikm: 81.4,
      mutu: "B (Baik)",
      responses: 980,
      nps: "+42",
      kecepatan: 77.0,
      keramahan: 85.0,
      fasilitas: 80.5,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Matriks Komparasi Skor Antar Rumah Sakit"
        description="Analisis perbandingan kinerja mutu pelayanan dan persepsi masyarakat lintas fasilitas mitra."
        breadcrumbs={[
          { label: "Super Admin", href: "/admin/dashboard" },
          { label: "Komparasi Lintas RS" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => alert("Mengunduh laporan komparasi dalam format Excel...")}>
              <Download className="w-4 h-4 mr-1.5" />
              Export Komparasi (.xlsx)
            </Button>
          </div>
        }
      />

      {/* Period Filter Bar */}
      <div className="flex items-center justify-between bg-card p-4 rounded-2xl border border-border">
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-4 h-4 text-primary" />
          <span className="font-bold text-foreground">Periode Pemantauan:</span>
          {["Triwulan I 2025", "Semester II 2024", "Semester I 2024"].map((per) => (
            <button
              key={per}
              onClick={() => setSelectedPeriod(per)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                selectedPeriod === per
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {per}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Peta Perbandingan Indeks Kepuasan Masyarakat (IKM)</CardTitle>
          <CardDescription>
            Skor konversi standar PermenPANRB 14/2017 (skala 25–100) pada periode {selectedPeriod}.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DUMMY_MONTHLY_COMPARISON} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                <XAxis
                  dataKey="hospital"
                  tick={{ fontSize: 11, fill: "currentColor" }}
                  interval={0}
                />
                <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: "currentColor" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    borderColor: "var(--color-border)",
                    borderRadius: "1rem",
                    fontSize: "12px",
                  }}
                  formatter={(val: any) => [`${val} / 100`, "Skor IKM"]}
                />
                <Bar dataKey="ikm" radius={[8, 8, 0, 0]}>
                  {DUMMY_MONTHLY_COMPARISON.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Breakdown Matrix Table */}
      <Card>
        <CardHeader>
          <CardTitle>Rincian Parameter Kualitas Antar RS</CardTitle>
          <CardDescription>
            Breakdown skor indikator kecepatan layanan, keramahan petugas, dan kualitas sarana fisik.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 border-y border-border text-muted-foreground uppercase text-[10px] font-bold">
                <tr>
                  <th className="px-6 py-3.5">Peringkat & RS</th>
                  <th className="px-6 py-3.5">Kota</th>
                  <th className="px-6 py-3.5 text-center">Skor IKM</th>
                  <th className="px-6 py-3.5 text-center">Mutu Pelayanan</th>
                  <th className="px-6 py-3.5 text-center">Kecepatan</th>
                  <th className="px-6 py-3.5 text-center">Keramahan</th>
                  <th className="px-6 py-3.5 text-center">Fasilitas</th>
                  <th className="px-6 py-3.5 text-right">Volume Respons</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {comparisonData.map((item, idx) => (
                  <tr key={item.name} className="hover:bg-muted/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-foreground flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span>{item.name}</span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{item.city}</td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="success" className="font-bold tabular-nums">
                        {item.ikm}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-foreground">
                      {item.mutu}
                    </td>
                    <td className="px-6 py-4 text-center tabular-nums">{item.kecepatan}</td>
                    <td className="px-6 py-4 text-center tabular-nums">{item.keramahan}</td>
                    <td className="px-6 py-4 text-center tabular-nums">{item.fasilitas}</td>
                    <td className="px-6 py-4 text-right font-bold tabular-nums">
                      {item.responses.toLocaleString("id-ID")}
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
