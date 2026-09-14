"use client";

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Layers, Save, ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DUMMY_HOSPITALS } from "@/lib/dummy-data";

interface NewUnitProps {
  params: Promise<{ hospitalCode: string }>;
}

export default function NewUnitPage({ params }: NewUnitProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const hospital =
    DUMMY_HOSPITALS.find(
      (h) => h.code.toUpperCase() === resolvedParams.hospitalCode.toUpperCase()
    ) || DUMMY_HOSPITALS[0];

  const [form, setForm] = useState({
    name: "",
    code: "",
    description: "",
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      alert(`Unit "${form.name}" (${form.code}) berhasil ditambahkan ke ${hospital.name}!`);
      router.push(`/h/${hospital.code}/units`);
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        title="Tambah Unit Layanan Baru"
        description="Tambahkan poli spesialis, instalasi, atau ruangan baru untuk dilakukan survei kepuasan."
        breadcrumbs={[
          { label: hospital.code, href: `/h/${hospital.code}/dashboard` },
          { label: "Unit Layanan", href: `/h/${hospital.code}/units` },
          { label: "Tambah Unit" },
        ]}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informasi Unit Layanan</CardTitle>
            <CardDescription>Kode unit unik digunakan untuk nama dan parameter QR Code cetak.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Nama Lengkap Unit *
              </label>
              <Input
                required
                placeholder="Contoh: Poli Spesialis Mata"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Kode Singkat Unit (Huruf Kapital, maks 10 karakter) *
              </label>
              <Input
                required
                placeholder="Contoh: POLI-MATA"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Deskripsi Singkat Layanan
              </label>
              <textarea
                rows={3}
                placeholder="Pemeriksaan visus mata, refraksi, dan konsultasi spesialis mata rawat jalan."
                className="w-full rounded-xl border border-input bg-background/80 p-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <Link href={`/h/${hospital.code}/units`}>
            <Button variant="outline" type="button">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Batal
            </Button>
          </Link>
          <Button type="submit" disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Menyimpan..." : "Simpan Unit"}
          </Button>
        </div>
      </form>
    </div>
  );
}
