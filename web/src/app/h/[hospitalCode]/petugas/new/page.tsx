"use client";

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, Save, ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DUMMY_UNITS, DUMMY_HOSPITALS } from "@/lib/dummy-data";

interface NewPetugasProps {
  params: Promise<{ hospitalCode: string }>;
}

export default function NewPetugasPage({ params }: NewPetugasProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const hospital =
    DUMMY_HOSPITALS.find(
      (h) => h.code.toUpperCase() === resolvedParams.hospitalCode.toUpperCase()
    ) || DUMMY_HOSPITALS[0];

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    unitId: DUMMY_UNITS[0].id,
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      alert(`Petugas "${form.fullName}" berhasil didaftarkan dan tautan aktivasi telah dikirim ke ${form.email}.`);
      router.push(`/h/${hospital.code}/petugas`);
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        title="Daftarkan Petugas Survei Baru"
        description="Petugas survei hanya memiliki akses pada unit layanan yang ditugaskan."
        breadcrumbs={[
          { label: hospital.code, href: `/h/${hospital.code}/dashboard` },
          { label: "Petugas", href: `/h/${hospital.code}/petugas` },
          { label: "Tambah Petugas" },
        ]}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informasi Petugas Lapangan</CardTitle>
            <CardDescription>Petugas akan login menggunakan email ini di aplikasi mobile atau web.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Nama Lengkap Petugas *
              </label>
              <Input
                required
                placeholder="Contoh: Rian Pratama, A.Md.Kep"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Alamat Email *
              </label>
              <Input
                type="email"
                required
                placeholder="rian.pratama@rsudsayang.id"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Unit Layanan yang Ditugaskan *
              </label>
              <select
                value={form.unitId}
                onChange={(e) => setForm({ ...form, unitId: e.target.value })}
                className="w-full h-10 rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {DUMMY_UNITS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.code} - {u.name}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <Link href={`/h/${hospital.code}/petugas`}>
            <Button variant="outline" type="button">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Batal
            </Button>
          </Link>
          <Button type="submit" disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Mendaftarkan..." : "Kirim Undangan Petugas"}
          </Button>
        </div>
      </form>
    </div>
  );
}
