"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, Save, ArrowLeft, UserCheck, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createHospitalAction } from "@/actions/hospital-actions";
import { createUserAction } from "@/actions/user-actions";

export default function NewHospitalPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    code: "",
    city: "",
    address: "",
    phone: "",
    email: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "AdminPassword123!",
  });

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);

    try {
      // 1. Buat rumah sakit baru
      const hospRes = await createHospitalAction({
        code: form.code,
        name: form.name,
        city: form.city,
        address: form.address,
        phone: form.phone,
        email: form.email,
      });

      if (!hospRes.success || !hospRes.hospital) {
        setErrorMessage(hospRes.error || "Gagal mendaftarkan rumah sakit.");
        setSaving(false);
        return;
      }

      // 2. Buat akun Admin Rumah Sakit pengelola
      if (form.adminEmail && form.adminName) {
        await createUserAction({
          email: form.adminEmail,
          fullName: form.adminName,
          password: form.adminPassword,
          role: "HOSPITAL_ADMIN",
          hospitalId: hospRes.hospital.id,
        });
      }

      alert(`Rumah Sakit "${form.name}" (${form.code}) dan akun admin berhasil dibuat di database MySQL!`);
      router.push("/admin/hospitals");
    } catch (err: any) {
      setErrorMessage(err?.message || "Terjadi kesalahan jaringan saat menyimpan data.");
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Daftarkan Rumah Sakit Baru"
        description="Buat tenant multi-tenant baru beserta akun Admin Rumah Sakit pengelola pertama di basis data MySQL."
        breadcrumbs={[
          { label: "Super Admin", href: "/admin/dashboard" },
          { label: "Daftar Rumah Sakit", href: "/admin/hospitals" },
          { label: "Tambah RS Baru" },
        ]}
      />

      {errorMessage && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Detail Fasilitas RS */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" />
              1. Identitas & Profil Rumah Sakit
            </CardTitle>
            <CardDescription>
              Kode unik RS digunakan sebagai tautan survei publik dan parameter QR Code (tidak dapat diubah setelah dibuat).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Nama Lengkap Rumah Sakit *
                </label>
                <Input
                  required
                  placeholder="Contoh: RSUD Kabupaten Subang"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Kode Unik Tenant (Huruf Kapital & Strip) *
                </label>
                <Input
                  required
                  placeholder="Contoh: RSUD-SUBANG"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                />
                <span className="text-[10px] text-muted-foreground mt-0.5 block">
                  URL Survei Publik: /s/{form.code || "KODE-RS"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Kota / Kabupaten *
                </label>
                <Input
                  required
                  placeholder="Contoh: Subang"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  No. Telepon / Hotline
                </label>
                <Input
                  placeholder="(0260) 411xxx"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Email Resmi RS
                </label>
                <Input
                  type="email"
                  placeholder="info@rsudsubang.go.id"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Alamat Lengkap Fasilitas
              </label>
              <textarea
                rows={2}
                placeholder="Jl. Brigjen Katamso No. 37, Dangdeur, Kec. Subang, Kabupaten Subang, Jawa Barat 41211"
                className="w-full rounded-xl border border-input bg-background/80 p-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Akun Admin RS Pertama */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-primary" />
              2. Akun Administrator Utama Rumah Sakit
            </CardTitle>
            <CardDescription>
              Akun ini akan diberikan hak penuh untuk mengelola kuesioner, unit layanan, dan periode survei di RS ini.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Nama Lengkap Admin RS *
                </label>
                <Input
                  required
                  placeholder="Contoh: Dr. Ahmad Fauzi, Sp.A"
                  value={form.adminName}
                  onChange={(e) => setForm({ ...form, adminName: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Email Login Admin RS *
                </label>
                <Input
                  type="email"
                  required
                  placeholder="dr.ahmad@rsudsubang.go.id"
                  value={form.adminEmail}
                  onChange={(e) => setForm({ ...form, adminEmail: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between pt-2">
          <Link href="/admin/hospitals">
            <Button variant="outline" type="button">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Kembali
            </Button>
          </Link>
          <Button type="submit" disabled={saving} className="px-6">
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Menyimpan ke MySQL..." : "Daftarkan Rumah Sakit"}
          </Button>
        </div>
      </form>
    </div>
  );
}
