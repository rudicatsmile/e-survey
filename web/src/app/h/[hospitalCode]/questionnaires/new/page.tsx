"use client";

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileQuestion,
  Sparkles,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DUMMY_HOSPITALS } from "@/lib/dummy-data";

interface NewQuestionnaireProps {
  params: Promise<{ hospitalCode: string }>;
}

export default function NewQuestionnairePage({ params }: NewQuestionnaireProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const hospital =
    DUMMY_HOSPITALS.find(
      (h) => h.code.toUpperCase() === resolvedParams.hospitalCode.toUpperCase()
    ) || DUMMY_HOSPITALS[0];

  const [useTemplate, setUseTemplate] = useState(true);
  const [title, setTitle] = useState(
    "Kuesioner Indeks Kepuasan Masyarakat (IKM PermenPANRB 2025)"
  );
  const [description, setDescription] = useState(
    "Survei kepuasan masyarakat atas penyelenggaraan pelayanan publik di rumah sakit."
  );

  const [questions, setQuestions] = useState([
    {
      id: "q-1",
      text: "Bagaimana kemudahan informasi persyaratan dan alur pendaftaran layanan yang Anda rasakan?",
      type: "LIKERT_5",
      weight: 1.0,
    },
    {
      id: "q-2",
      text: "Bagaimana ketepatan waktu pelayanan dokter/paramedis sesuai jadwal yang diinformasikan?",
      type: "LIKERT_5",
      weight: 1.2,
    },
    {
      id: "q-3",
      text: "Bagaimana kesopanan, keramahan, dan empati petugas/perawat saat melayani Anda?",
      type: "LIKERT_5",
      weight: 1.0,
    },
    {
      id: "q-4",
      text: "Bagaimana kenyamanan ruang tunggu, kebersihan toilet, dan pendingin ruangan di unit ini?",
      type: "LIKERT_5",
      weight: 0.8,
    },
  ]);

  const [newQuestionText, setNewQuestionText] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAddQuestion = () => {
    if (!newQuestionText.trim()) return;
    setQuestions([
      ...questions,
      {
        id: `q-${Date.now()}`,
        text: newQuestionText,
        type: "LIKERT_5",
        weight: 1.0,
      },
    ]);
    setNewQuestionText("");
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      alert(`Kuesioner "${title}" berhasil disimpan sebagai draf baru!`);
      router.push(`/h/${hospital.code}/questionnaires`);
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Rancang Kuesioner Baru"
        description="Buat kuesioner survei baru menggunakan template standar IKM KemenPAN-RB atau kustom."
        breadcrumbs={[
          { label: hospital.code, href: `/h/${hospital.code}/dashboard` },
          { label: "Kuesioner", href: `/h/${hospital.code}/questionnaires` },
          { label: "Buat Kuesioner Baru" },
        ]}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Template Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pilihan Fondasi Kuesioner</CardTitle>
            <CardDescription>Pilih template standar resmi untuk memudahkan perumusan instrumen.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setUseTemplate(true)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                useTemplate
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                  : "border-border bg-card hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h4 className="font-bold text-foreground text-sm">Standar IKM PermenPANRB</h4>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Menggunakan 9 unsur baku kepuasan publik (Persyaratan, Waktu, Biaya, Keramahan, dll).
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setUseTemplate(false);
                setQuestions([]);
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                !useTemplate
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                  : "border-border bg-card hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-2">
                <FileQuestion className="w-4 h-4 text-primary" />
                <h4 className="font-bold text-foreground text-sm">Buat Kosong (Custom Blank)</h4>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Tuliskan pertanyaan dari nol sesuai kebutuhan riset spesifik rumah sakit Anda.
              </p>
            </button>
          </CardContent>
        </Card>

        {/* Informasi Dasar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informasi & Disclaimer Responden</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Judul Kuesioner *
              </label>
              <Input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Deskripsi & Penjelasan Singkat
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-input bg-background/80 p-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </CardContent>
        </Card>

        {/* Daftar Pertanyaan */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Daftar Pertanyaan ({questions.length} Soal)</CardTitle>
              <CardDescription>Semua pertanyaan Likert 1–5 secara otomatis dikonversi ke skala 100.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className="p-3.5 rounded-xl border border-border bg-card flex items-start justify-between gap-4 text-xs"
              >
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-foreground leading-relaxed">{q.text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[10px]">Likert 1–5 Bintang</Badge>
                      <span className="text-[10px] text-muted-foreground">Bobot: {q.weight}</span>
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveQuestion(q.id)}
                  className="text-muted-foreground hover:text-destructive shrink-0 h-7 w-7"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}

            {/* Quick Add Input */}
            <div className="pt-2 flex items-center gap-2">
              <Input
                placeholder="Tuliskan pertanyaan baru..."
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddQuestion();
                  }
                }}
              />
              <Button type="button" variant="secondary" size="sm" onClick={handleAddQuestion}>
                <Plus className="w-4 h-4 mr-1" />
                Tambah
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <Link href={`/h/${hospital.code}/questionnaires`}>
            <Button variant="outline" type="button">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Batal
            </Button>
          </Link>
          <Button type="submit" disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Menyimpan Draf..." : "Simpan Draf Kuesioner"}
          </Button>
        </div>
      </form>
    </div>
  );
}
