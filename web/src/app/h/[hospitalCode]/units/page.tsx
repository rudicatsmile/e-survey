"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { Layers, Plus, Search, QrCode, ToggleLeft, ToggleRight, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DUMMY_UNITS, DUMMY_HOSPITALS } from "@/lib/dummy-data";

interface UnitsPageProps {
  params: Promise<{ hospitalCode: string }>;
}

export default function HospitalUnitsPage({ params }: UnitsPageProps) {
  const resolvedParams = use(params);
  const hospital =
    DUMMY_HOSPITALS.find(
      (h) => h.code.toUpperCase() === resolvedParams.hospitalCode.toUpperCase()
    ) || DUMMY_HOSPITALS[0];

  const [searchTerm, setSearchTerm] = useState("");
  const [units, setUnits] = useState(DUMMY_UNITS);

  const filteredUnits = units.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setUnits((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u))
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Unit Layanan: ${hospital.name}`}
        description="Kelola daftar instalasi, poli klinik rawat jalan, rawat inap, dan fasilitas penunjang medis."
        breadcrumbs={[
          { label: hospital.code, href: `/h/${hospital.code}/dashboard` },
          { label: "Unit Layanan" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href={`/h/${hospital.code}/qr-codes`}>
              <Button variant="outline" size="sm">
                <QrCode className="w-4 h-4 mr-1.5" />
                Manajemen QR Unit
              </Button>
            </Link>
            <Link href={`/h/${hospital.code}/units/new`}>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1.5" />
                Tambah Unit Layanan
              </Button>
            </Link>
          </div>
        }
      />

      {/* Filter Toolbar */}
      <div className="flex items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama atau kode unit (IGD, Poli Gigi)..."
            className="pl-10"
          />
        </div>
        <span className="text-xs text-muted-foreground hidden sm:inline">
          Total: {filteredUnits.length} Unit Terdaftar
        </span>
      </div>

      {/* Units Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-[10px] font-bold">
                <tr>
                  <th className="px-6 py-3.5">Kode & Nama Unit</th>
                  <th className="px-6 py-3.5">Deskripsi Layanan</th>
                  <th className="px-6 py-3.5 text-right">Volume Respons</th>
                  <th className="px-6 py-3.5 text-center">Rata-rata Skor</th>
                  <th className="px-6 py-3.5 text-center">Status Aktif</th>
                  <th className="px-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredUnits.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10">
                          {u.code}
                        </span>
                        <span className="font-bold text-foreground text-sm">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground max-w-sm">
                      {u.description}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-foreground tabular-nums">
                      {u.totalResponses}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge
                        variant={u.averageScore >= 85 ? "success" : u.averageScore >= 80 ? "default" : "warning"}
                        className="tabular-nums font-bold"
                      >
                        {u.averageScore} / 100
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleStatus(u.id)}
                        className="cursor-pointer inline-flex items-center gap-1 text-xs"
                      >
                        {u.isActive ? (
                          <Badge variant="default">Aktif</Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">Nonaktif</Badge>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right space-x-1.5">
                      <Link href={`/h/${hospital.code}/qr-codes`}>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-[11px]">
                          <QrCode className="w-3.5 h-3.5 mr-1" />
                          Lihat QR
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
