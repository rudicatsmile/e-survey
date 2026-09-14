"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  Search,
  Plus,
  Edit,
  Eye,
  ExternalLink,
  MapPin,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getHospitals } from "@/actions/hospital-actions";

export default function AdminHospitalsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [hospitalsList, setHospitalsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHospitals()
      .then((data) => {
        setHospitalsList(data);
      })
      .catch((err) => console.error("Error fetching hospitals:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredHospitals = hospitalsList.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.city.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Fasilitas Rumah Sakit"
        description="Kelola pendaftaran tenant rumah sakit, kode identitas unik, dan pantau status keaktifan di database MySQL."
        breadcrumbs={[
          { label: "Super Admin", href: "/admin/dashboard" },
          { label: "Daftar Rumah Sakit" },
        ]}
        actions={
          <Link href="/admin/hospitals/new">
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1.5" />
              Tambah Rumah Sakit Baru
            </Button>
          </Link>
        }
      />

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama RS, kode, atau kota..."
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-muted-foreground">
            Total: {filteredHospitals.length} Rumah Sakit
          </span>
        </div>
      </div>

      {/* Hospitals Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <p className="text-xs">Memuat data rumah sakit dari basis data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-[10px] font-bold">
                  <tr>
                    <th className="px-6 py-3.5">Nama Fasilitas & Kode</th>
                    <th className="px-6 py-3.5">Kota / Alamat</th>
                    <th className="px-6 py-3.5">Kontak</th>
                    <th className="px-6 py-3.5 text-center">Status</th>
                    <th className="px-6 py-3.5 text-right">Aksi Manajemen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredHospitals.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-muted-foreground">
                        Tidak ada rumah sakit yang sesuai pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredHospitals.map((h) => (
                      <tr key={h.id} className="hover:bg-muted/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0">
                              <Building2 className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-bold text-foreground text-sm">{h.name}</p>
                              <span className="inline-block font-mono text-[11px] text-primary font-bold">
                                {h.code}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-foreground">{h.city}</p>
                          <p className="text-[11px] text-muted-foreground line-clamp-1">
                            {h.address || "-"}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          <p className="text-[11px] font-medium text-foreground">{h.phone || "-"}</p>
                          <p className="text-[10px] text-muted-foreground">{h.email || "-"}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Badge
                            variant={h.isActive ? "default" : "outline"}
                            className="text-[10px]"
                          >
                            {h.isActive ? "Aktif" : "Non-aktif"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right space-x-1">
                          <Link href={`/admin/hospitals/${h.id}`}>
                            <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs">
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              Detail
                            </Button>
                          </Link>
                          <Link href={`/admin/hospitals/${h.id}/edit`}>
                            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                          <Link href={`/h/${h.code}/dashboard`}>
                            <Button variant="secondary" size="sm" className="h-8 px-2.5 text-xs">
                              Masuk Tenant
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
