"use client";

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Save, ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DUMMY_HOSPITALS, DUMMY_QUESTIONNAIRES } from "@/lib/dummy-data";

interface NewPeriodProps {
  params: Promise<{ hospitalCode: string }>;
}

export default function NewPeriodPage({ params }: NewPeriodProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const hospital =
    DUMMY_HOSPITALS.find(
      (h) => h.code.toUpperCase() === resolvedParams.hospitalCode.toUpperCase()
    ) || DUMMY_HOSPITALS[0];

  const [form, setForm] = useState({
    name: "",
    startDate: "2025-04-01",
    endDate: "2025-06-30",
    questionnaireId: DUMMY_QUESTIONNAIRES[0].id,
    targetResponses: 1000,
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      alert(`Periode survei "${form.name}" berhasil dibuat untuk ${hospital.name}!`);
      router.push(`/h/${hospital.code}/periods`);
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        title="Buat Periode Survei Baru"
        description="Tentukan rentang jadwal pelaksanaan dan kuesioner aktif yang akan digunakan."
        breadcrumbs={[
          { label: hospital.code, href: `/h/${hospital.code}/dashboard` },
          { label: "Periode Survei", href: `/h/${hospital.code}/periods` },
          { label: "Buat Periode Baru" },
        ]}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pengaturan Waktu & Target</CardTitle>
            <CardDescription>Responden hanya dapat mengirimkan jawaban saat status periode Aktif.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Nama Periode Pelaksanaan *
              </label>
              <Input
                required
                placeholder="Contoh: Triwulan II 2025 (April - Juni 2025)"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Tanggal Mulai *
                </label>
                <Input
                  type="date"
                  required
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Tanggal Selesai *
                </label>
                <Input
                  type="date"
                  required
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Kuesioner yang Digunakan *
                </label>
                <select
                  value={form.questionnaireId}
                  onChange={(e) => setForm({ ...form, questionnaireId: e.target.value })}
                  className="w-full h-10 rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {DUMMY_QUESTIONNAIRES.map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.title} (v{q.version})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Target Minimal Responden
                </label>
                <Input
                  type="number"
                  required
                  value={form.targetResponses}
                  onChange={(e) => setForm({ ...form, targetResponses: Number(e.target.value) })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <Link href={`/h/${hospital.code}/periods`}>
            <Button variant="outline" type="button">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Batal
            </Button>
          </Link>
          <Button type="submit" disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Menyimpan..." : "Simpan Periode"}
          </Button>
        </div>
      </form>
    </div>
  );
}
