"use client";

import React, { useState, use } from "react";
import { Settings, Save, Shield, Clock, Bell } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DUMMY_HOSPITALS } from "@/lib/dummy-data";

interface HospitalSettingsProps {
  params: Promise<{ hospitalCode: string }>;
}

export default function HospitalSettingsPage({ params }: HospitalSettingsProps) {
  const resolvedParams = use(params);
  const hospital =
    DUMMY_HOSPITALS.find(
      (h) => h.code.toUpperCase() === resolvedParams.hospitalCode.toUpperCase()
    ) || DUMMY_HOSPITALS[0];

  const [saving, setSaving] = useState(false);
  const [preventDuplicate, setPreventDuplicate] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("Pengaturan operasional rumah sakit berhasil disimpan!");
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title={`Pengaturan Tenant: ${hospital.name}`}
        description="Konfigurasi zona waktu operasional, pencegahan survei ganda, dan notifikasi."
        breadcrumbs={[
          { label: hospital.code, href: `/h/${hospital.code}/dashboard` },
          { label: "Pengaturan" },
        ]}
      />

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pengaturan Validasi Pengisian</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card">
              <div>
                <p className="text-xs font-bold text-foreground">
                  Cegah Pengisian Ganda Beruntun (Session Fingerprint)
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Mencegah 1 perangkat HP mengirim survei berulang kali pada unit yang sama dalam tempo &lt; 30 menit.
                </p>
              </div>
              <input
                type="checkbox"
                checked={preventDuplicate}
                onChange={(e) => setPreventDuplicate(e.target.checked)}
                className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Zona Waktu Rumah Sakit
              </label>
              <select className="w-full h-10 rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option value="WIB">WIB (Waktu Indonesia Barat - UTC+7)</option>
                <option value="WITA">WITA (Waktu Indonesia Tengah - UTC+8)</option>
                <option value="WIT">WIT (Waktu Indonesia Timur - UTC+9)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Menyimpan..." : "Simpan Pengaturan"}
          </Button>
        </div>
      </form>
    </div>
  );
}
