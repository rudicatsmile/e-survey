"use client";

import React, { useState } from "react";
import { Settings, ShieldCheck, Lock, Mail, Save } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  const [rateLimit, setRateLimit] = useState(5);
  const [globalRateLimit, setGlobalRateLimit] = useState(60);
  const [retentionDays, setRetentionDays] = useState(730);
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("Pengaturan platform global berhasil diperbarui!");
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Pengaturan Platform Global"
        description="Konfigurasi standar keamanan data, rate limiting, kebijakan anonimitas, dan retensi log nasional."
        breadcrumbs={[
          { label: "Super Admin", href: "/admin/dashboard" },
          { label: "Pengaturan Platform" },
        ]}
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Keamanan & Anonimitas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Kebijakan Anonimitas & Sanitasi
            </CardTitle>
            <CardDescription>
              Parameter privasi untuk melindungi hak data responden sesuai PermenPANRB dan UU PDP.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-muted/30">
              <div>
                <p className="text-xs font-bold text-foreground">
                  Penyimpanan Alamat IP Responden
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  IP diubah otomatis menjadi hash satu arah menggunakan SHA-256 (tanpa plaintext).
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                Terkunci (Wajib Aktif)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Batas Submission per IP per Jam
                </label>
                <Input
                  type="number"
                  value={rateLimit}
                  onChange={(e) => setRateLimit(Number(e.target.value))}
                />
                <span className="text-[10px] text-muted-foreground mt-0.5 block">
                  Mencegah spam bot pengiriman survei fiktif.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Global Rate Limit per IP per Menit
                </label>
                <Input
                  type="number"
                  value={globalRateLimit}
                  onChange={(e) => setGlobalRateLimit(Number(e.target.value))}
                />
                <span className="text-[10px] text-muted-foreground mt-0.5 block">
                  Ambang batas proteksi DDOS API.
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Retensi Data */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              Retensi Data & Log Audit
            </CardTitle>
            <CardDescription>Masa simpan log audit sebelum dilakukan pengarsipan jangka panjang.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-w-xs">
              <label className="text-xs font-bold text-foreground block mb-1">
                Masa Simpan Riwayat Audit (Hari)
              </label>
              <Input
                type="number"
                value={retentionDays}
                onChange={(e) => setRetentionDays(Number(e.target.value))}
              />
              <span className="text-[10px] text-muted-foreground mt-0.5 block">
                Default: 730 hari (2 tahun audit trail).
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Menyimpan..." : "Simpan Pengaturan Platform"}
          </Button>
        </div>
      </form>
    </div>
  );
}
