"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, Save, ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DUMMY_HOSPITALS } from "@/lib/dummy-data";

export default function NewUserPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    role: "HOSPITAL_ADMIN",
    hospitalId: "hosp-001",
    unitName: "",
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      alert(`Pengguna "${form.fullName}" berhasil ditambahkan dan email aktivasi telah dikirim.`);
      router.push("/admin/users");
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Tambah Pengguna Platform Baru"
        description="Daftarkan akun pengelola baru dengan peran Super Admin, Admin Rumah Sakit, atau Petugas Lapangan."
        breadcrumbs={[
          { label: "Super Admin", href: "/admin/dashboard" },
          { label: "Pengguna", href: "/admin/users" },
          { label: "Tambah Pengguna" },
        ]}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informasi Akun</CardTitle>
            <CardDescription>Kata sandi awal akan disetel oleh pengguna melalui tautan undangan email.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Nama Lengkap & Gelar *
                </label>
                <Input
                  required
                  placeholder="Contoh: Dr. Budi Santoso, Sp.B"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Alamat Email (Unik) *
                </label>
                <Input
                  type="email"
                  required
                  placeholder="budi.santoso@rsudsayang.id"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Peran / Hak Akses (Role) *
                </label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full h-10 rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="HOSPITAL_ADMIN">Admin Rumah Sakit</option>
                  <option value="FIELD_OFFICER">Petugas Survei Lapangan</option>
                  <option value="SUPER_ADMIN">Super Admin Platform</option>
                </select>
              </div>

              {form.role !== "SUPER_ADMIN" && (
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Afiliasi Rumah Sakit *
                  </label>
                  <select
                    value={form.hospitalId}
                    onChange={(e) => setForm({ ...form, hospitalId: e.target.value })}
                    className="w-full h-10 rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {DUMMY_HOSPITALS.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name} ({h.code})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <Link href="/admin/users">
            <Button variant="outline" type="button">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Batal
            </Button>
          </Link>
          <Button type="submit" disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Mendaftarkan..." : "Kirim Undangan Pengguna"}
          </Button>
        </div>
      </form>
    </div>
  );
}
