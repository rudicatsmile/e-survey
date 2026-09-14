"use client";

import React, { useState, use } from "react";
import { Building2, Save, MapPin, Phone, Mail } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DUMMY_HOSPITALS } from "@/lib/dummy-data";

interface HospitalProfileProps {
  params: Promise<{ hospitalCode: string }>;
}

export default function HospitalProfilePage({ params }: HospitalProfileProps) {
  const resolvedParams = use(params);
  const hospital =
    DUMMY_HOSPITALS.find(
      (h) => h.code.toUpperCase() === resolvedParams.hospitalCode.toUpperCase()
    ) || DUMMY_HOSPITALS[0];

  const [form, setForm] = useState({
    name: hospital.name,
    city: hospital.city,
    phone: hospital.phone,
    email: hospital.email,
    address: hospital.address,
    description: hospital.description,
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("Profil rumah sakit berhasil disimpan!");
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title={`Profil Rumah Sakit: ${hospital.name}`}
        description="Kelola nama resmi, alamat kontak, dan informasi publik yang ditampilkan kepada responden."
        breadcrumbs={[
          { label: hospital.code, href: `/h/${hospital.code}/dashboard` },
          { label: "Profil RS" },
        ]}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informasi Publik Fasilitas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">Nama Rumah Sakit</label>
              <Input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Kota / Kabupaten</label>
                <Input
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">No. Telepon / Hotline</label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
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
              <label className="text-xs font-bold text-foreground block mb-1">Deskripsi Fasilitas</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-xl border border-input bg-background/80 p-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Menyimpan..." : "Simpan Profil RS"}
          </Button>
        </div>
      </form>
    </div>
  );
}
