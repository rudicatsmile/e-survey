"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import {
  FileQuestion,
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Smartphone,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DUMMY_QUESTIONNAIRES, DUMMY_HOSPITALS } from "@/lib/dummy-data";

interface QuestionnaireEditorProps {
  params: Promise<{ hospitalCode: string; id: string }>;
}

export default function QuestionnaireEditorPage({ params }: QuestionnaireEditorProps) {
  const resolvedParams = use(params);
  const hospital =
    DUMMY_HOSPITALS.find(
      (h) => h.code.toUpperCase() === resolvedParams.hospitalCode.toUpperCase()
    ) || DUMMY_HOSPITALS[0];

  const questionnaire =
    DUMMY_QUESTIONNAIRES.find((q) => q.id === resolvedParams.id) ||
    DUMMY_QUESTIONNAIRES[0];

  const [questions, setQuestions] = useState(questionnaire.questions);
  const [newText, setNewText] = useState("");

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newArr = [...questions];
    const temp = newArr[index - 1];
    newArr[index - 1] = newArr[index];
    newArr[index] = temp;
    setQuestions(newArr);
  };

  const moveDown = (index: number) => {
    if (index === questions.length - 1) return;
    const newArr = [...questions];
    const temp = newArr[index + 1];
    newArr[index + 1] = newArr[index];
    newArr[index] = temp;
    setQuestions(newArr);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleAddQuestion = () => {
    if (!newText.trim()) return;
    setQuestions([
      ...questions,
      {
        id: `q-${Date.now()}`,
        categoryId: "cat-1",
        text: newText,
        type: "LIKERT_5",
        isRequired: true,
        weight: 1.0,
        orderIndex: questions.length + 1,
      },
    ]);
    setNewText("");
  };

  const handleSave = () => {
    alert("Perubahan urutan dan daftar soal berhasil disimpan (versi kuesioner dinaikkan +1).");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Editor Kuesioner: ${questionnaire.title}`}
        description={`Kelola susunan urutan, bobot, dan tambah/hapus pertanyaan di ${hospital.name}.`}
        breadcrumbs={[
          { label: hospital.code, href: `/h/${hospital.code}/dashboard` },
          { label: "Kuesioner", href: `/h/${hospital.code}/questionnaires` },
          { label: `Editor (v${questionnaire.version})` },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href={`/h/${hospital.code}/questionnaires/${questionnaire.id}/preview`}>
              <Button variant="outline" size="sm">
                <Smartphone className="w-3.5 h-3.5 mr-1" />
                Preview Tampilan
              </Button>
            </Link>
            <Button size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-1.5" />
              Simpan Perubahan
            </Button>
          </div>
        }
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Daftar Pertanyaan ({questions.length} Butir)</CardTitle>
            <CardDescription>Gunakan tombol panah untuk mengatur urutan kemunculan soal di formulir pasien.</CardDescription>
          </div>
          <Badge variant="default">Versi {questionnaire.version}</Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className="p-3.5 rounded-xl border border-border bg-card flex items-center justify-between gap-4 text-xs transition-colors hover:border-primary/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-0.5">
                  <button
                    disabled={idx === 0}
                    onClick={() => moveUp(idx)}
                    className="p-1 rounded hover:bg-muted disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={idx === questions.length - 1}
                    onClick={() => moveDown(idx)}
                    className="p-1 rounded hover:bg-muted disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <div>
                  <p className="font-semibold text-foreground leading-relaxed">{q.text}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {q.type}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">Bobot: {q.weight}</span>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeQuestion(q.id)}
                className="text-muted-foreground hover:text-destructive shrink-0 h-8 w-8"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}

          {/* Add Question input */}
          <div className="pt-3 flex items-center gap-2">
            <Input
              placeholder="Tuliskan butir pertanyaan baru..."
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddQuestion();
                }
              }}
            />
            <Button variant="secondary" size="sm" onClick={handleAddQuestion}>
              <Plus className="w-4 h-4 mr-1" />
              Tambah Soal
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
