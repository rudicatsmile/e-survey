"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Building2, MapPin, Layers, ArrowRight, Loader2 } from "lucide-react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PilihRsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("Semua");
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/hospitals")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setHospitals(json.data);
        }
      })
      .catch((err) => console.error("Failed to load hospitals:", err))
      .finally(() => setLoading(false));
  }, []);

  const cities = ["Semua", ...Array.from(new Set(hospitals.map((h) => h.city))).filter(Boolean)];

  const filteredHospitals = hospitals.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity =
      selectedCity === "Semua" || h.city.toLowerCase() === selectedCity.toLowerCase();
    return matchesSearch && matchesCity;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNavbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Header */}
        <div className="max-w-2xl mb-8 space-y-3">
          <Badge variant="secondary">Direktori Fasilitas Kesehatan</Badge>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Pilih Rumah Sakit yang Anda Kunjungi
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Cari berdasarkan nama rumah sakit, kode, atau kota domisili. Setiap fasilitas memiliki kuesioner kepuasan tersendiri yang dipantau oleh manajemen rumah sakit bersangkutan.
          </p>
        </div>

        {/* Search & City Filter Bar */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8 bg-card border border-border/80 p-4 rounded-2xl shadow-xs">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ketik nama RS (contoh: Sayang Cianjur, Hasan Sadikin, Karawang)..."
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCity === city
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-xs">Memuat direktori rumah sakit dari database...</p>
          </div>
        ) : (
          /* Hospital Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHospitals.map((hospital) => (
              <Card
                key={hospital.id}
                className="group hover:border-primary/50 transition-all duration-200 flex flex-col justify-between"
              >
                <CardContent className="p-6 flex flex-col h-full justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-lg overflow-hidden">
                        {hospital.logoUrl ? (
                          <img
                            src={hospital.logoUrl}
                            alt={hospital.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Building2 className="w-6 h-6" />
                        )}
                      </div>
                      <Badge variant="outline" className="text-[11px] font-mono tracking-wide">
                        {hospital.code}
                      </Badge>
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {hospital.name}
                      </h2>
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        <span>{hospital.city}</span>
                      </p>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {hospital.description || hospital.address || "Fasilitas kesehatan rujukan terdaftar."}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-primary" />
                        <strong>{hospital.totalUnits || 0}</strong> Unit Layanan
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Status Layanan</span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        Aktif Menerima Survei
                      </span>
                    </div>
                    <Link href={`/s/${hospital.code}`}>
                      <Button size="sm">
                        Buka Survei
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredHospitals.length === 0 && (
          <div className="text-center py-16 bg-card border border-dashed border-border rounded-2xl">
            <Building2 className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-base font-semibold text-foreground">Tidak Ada Rumah Sakit Ditemukan</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
              Tidak ada rumah sakit yang cocok dengan kata kunci &quot;{searchTerm}&quot; di kota &quot;{selectedCity}&quot;.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setSearchTerm("");
                setSelectedCity("Semua");
              }}
            >
              Reset Filter Pencarian
            </Button>
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}
