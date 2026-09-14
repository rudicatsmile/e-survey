import React from "react";
import Link from "next/link";
import {
  MessageSquareText,
  ArrowLeft,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  Award,
  Sparkles,
  Lock,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DUMMY_HOSPITALS, DUMMY_RESPONDENTS } from "@/lib/dummy-data";

interface ResponseDetailProps {
  params: Promise<{ hospitalCode: string; id: string }>;
}

export default async function ResponseDetailPage({ params }: ResponseDetailProps) {
  const { hospitalCode, id } = await params;
  const hospital =
    DUMMY_HOSPITALS.find(
      (h) => h.code.toUpperCase() === hospitalCode.toUpperCase()
    ) || DUMMY_HOSPITALS[0];

  const respondent =
    DUMMY_RESPONDENTS.find((r) => r.id === id) || DUMMY_RESPONDENTS[0];

  const answers = [
    { text: "Kemudahan informasi persyaratan & alur pendaftaran", val: 5, label: "Sangat Puas" },
    { text: "Kejelasan panduan & arahan petugas prosedur", val: 4, label: "Puas" },
    { text: "Ketepatan waktu pelayanan dokter/paramedis", val: 5, label: "Sangat Puas" },
    { text: "Kecepatan antrean penerimaan obat di depo farmasi", val: 4, label: "Puas" },
    { text: "Kesopanan, keramahan, dan empati petugas/perawat", val: 5, label: "Sangat Puas" },
    { text: "Kejelasan penjelasan dokter mengenai diagnosa", val: 5, label: "Sangat Puas" },
    { text: "Kenyamanan ruang tunggu, kebersihan toilet & AC", val: 4, label: "Puas" },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title={`Detail Jawaban Responden: ${respondent.code}`}
        description={`Rincian evaluasi pasien pada unit ${respondent.unitName} di ${hospital.name}.`}
        breadcrumbs={[
          { label: hospital.code, href: `/h/${hospital.code}/dashboard` },
          { label: "Respons", href: `/h/${hospital.code}/responses` },
          { label: respondent.code },
        ]}
      />

      {/* Overview Card */}
      <Card>
        <CardContent className="p-6 space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
            <div>
              <span className="text-muted-foreground">Nomor Tiket Audit (Anonim):</span>
              <p className="font-mono text-lg font-extrabold text-primary">{respondent.code}</p>
            </div>
            <div className="flex items-center gap-3">
              <div>
                <span className="text-muted-foreground block text-right">Skor IKM Diberikan</span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {respondent.score} / 100
                </span>
              </div>
              <Badge variant="success">Sangat Baik (A)</Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <span className="text-muted-foreground block">Unit Layanan</span>
              <span className="font-bold text-foreground">{respondent.unitName}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Waktu Pengisian</span>
              <span className="font-mono text-foreground">{respondent.submittedAt}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Kelompok Usia</span>
              <span className="text-foreground">{respondent.ageRange}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Pendidikan & Pekerjaan</span>
              <span className="text-foreground">{respondent.education} • {respondent.occupation}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Answers Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Jawaban Butir Pertanyaan IKM</CardTitle>
          <CardDescription>Skor Likert (skala 1–5 bintang) yang diberikan pasien.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {answers.map((ans, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl border border-border flex items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="font-medium text-foreground">{ans.text}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="default" className="tabular-nums">
                  {ans.val} Bintang
                </Badge>
                <span className="text-[11px] text-muted-foreground hidden sm:inline">{ans.label}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Qualitative Feedback */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Ulasan Kualitatif & Analisis Sentimen</CardTitle>
            <Badge variant="success">Sentimen Positif</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="p-4 rounded-xl bg-muted/40 border border-border italic text-foreground leading-relaxed">
            &quot;{respondent.reviewSnippet}&quot;
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground font-semibold">Kata Kunci Terdeteksi:</span>
            <div className="flex flex-wrap gap-1">
              {["dokter jaga", "sigap", "ramah", "demam tinggi"].map((k) => (
                <Badge key={k} variant="secondary" className="text-[10px]">
                  #{k}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <Link href={`/h/${hospital.code}/responses`}>
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Kembali ke Daftar Respons
          </Button>
        </Link>
      </div>
    </div>
  );
}
