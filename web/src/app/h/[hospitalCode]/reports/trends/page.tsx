"use client";

import React, { useState, use } from "react";
import { TrendingUp, Download, Calendar, Filter } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DUMMY_HOSPITALS } from "@/lib/dummy-data";

interface TrendsReportProps {
  params: Promise<{ hospitalCode: string }>;
}

export default function TrendsReportPage({ params }: TrendsReportProps) {
  const resolvedParams = use(params);
  const hospital =
    DUMMY_HOSPITALS.find(
      (h) => h.code.toUpperCase() === resolvedParams.hospitalCode.toUpperCase()
    ) || DUMMY_HOSPITALS[0];

  const trendData = [
    { bulan: "Okt 2024", igd: 84.1, farmasi: 74.0, poliGigi: 88.0, total: 82.5 },
    { bulan: "Nov 2024", igd: 85.0, farmasi: 75.2, poliGigi: 88.5, total: 83.1 },
    { bulan: "Des 2024", igd: 85.4, farmasi: 75.8, poliGigi: 89.0, total: 83.5 },
    { bulan: "Jan 2025", igd: 86.0, farmasi: 76.0, poliGigi: 89.1, total: 84.0 },
    { bulan: "Feb 2025", igd: 86.2, farmasi: 76.3, poliGigi: 89.2, total: 84.2 },
    { bulan: "Mar 2025", igd: 86.4, farmasi: 76.5, poliGigi: 89.2, total: 84.6 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Tren Waktu Kepuasan Pasien: ${hospital.name}`}
        description="Analisis pergerakan skor IKM bulanan untuk mendeteksi dampak perbaikan fasilitas dan pelatihan staf."
        breadcrumbs={[
          { label: hospital.code, href: `/h/${hospital.code}/dashboard` },
          { label: "Laporan", href: `/h/${hospital.code}/reports/satisfaction` },
          { label: "Tren Waktu" },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Pergerakan Skor Kepuasan Bulanan (6 Bulan Terakhir)</CardTitle>
          <CardDescription>Menampilkan tren rata-rata skor RS secara keseluruhan dan unit-unit kunci.</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: "currentColor" }} />
                <YAxis domain={[70, 95]} tick={{ fontSize: 11, fill: "currentColor" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    borderColor: "var(--color-border)",
                    borderRadius: "1rem",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
                <Line type="monotone" dataKey="total" name="Rata-rata RS" stroke="#0d9488" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="poliGigi" name="Poli Gigi" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="igd" name="IGD" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="farmasi" name="Farmasi" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
