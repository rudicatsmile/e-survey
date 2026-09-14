"use client";

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, Save, ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DUMMY_HOSPITALS } from "@/lib/dummy-data";

interface EditHospitalProps {
  params: Promise<{ id: string }>;
}

export default function EditHospitalPage({ params }: EditHospitalProps) {
  const resolvedParams = use(params);
  const router = useRouter();

  const hospital =
    DUMMY_HOSPITALS.find((h) => h.id === resolvedParams.id) || DUMMY_HOSPITALS[0];

  const [form, setForm] = useState({
    name: hospital.name,
    code: hospital.code,
    city: hospital.city,
    address: hospital.address,
    phone: hospital.phone,
    email: hospital.email,
    description: hospital.description,
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      alert(`Profil "${form.name}" berhasil diperbarui!`);
      router.push(`/admin/hospitals/${hospital.id}`);
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title={`Edit Profil: ${hospital.name}`}
        description="Perbarui informasi alamat, kontak telepon, atau deskripsi layanan rumah sakit."
        breadcrumbs={[
          { label: "Super Admin", href: "/admin/dashboard" },
          { label: "Daftar Rumah Sakit", href: "/admin/hospitals" },
          { label: hospital.code, href: `/admin/hospitals/${hospital.id}` },
          { label: "Edit" },
        ]}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informasi Legalitas & Kontak</CardTitle>
            <CardDescription>Kode unik tenant bersifat permanen dan tidak dapat diedit.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Nama Rumah Sakit
                </label>
                <Input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Kode Tenant (Terkunci)
                </label>
                <Input
                  disabled
                  value={form.code}
                  className="bg-muted cursor-not-allowed font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Kota</label>
                <Input
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">No. Telepon</label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Email Resmi</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">Alamat Lengkap</label>
              <textarea
                rows={2}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full rounded-xl border border-input bg-background/80 p-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">Deskripsi Singkat</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-xl border border-input bg-background/80 p-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <Link href={`/admin/hospitals/${hospital.id}`}>
            <Button variant="outline" type="button">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Batal
            </Button>
          </Link>
          <Button type="submit" disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Menyimpan Perubahan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </form>
    </div>
  );
}
