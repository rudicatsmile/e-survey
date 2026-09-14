"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import {
  Smartphone,
  Monitor,
  ArrowLeft,
  Building2,
  ShieldCheck,
  Star,
  Send,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DUMMY_QUESTIONNAIRES, DUMMY_HOSPITALS } from "@/lib/dummy-data";

interface PreviewProps {
  params: Promise<{ hospitalCode: string; id: string }>;
}

export default function QuestionnairePreviewPage({ params }: PreviewProps) {
  const resolvedParams = use(params);
  const hospital =
    DUMMY_HOSPITALS.find(
      (h) => h.code.toUpperCase() === resolvedParams.hospitalCode.toUpperCase()
    ) || DUMMY_HOSPITALS[0];

  const questionnaire =
    DUMMY_QUESTIONNAIRES.find((q) => q.id === resolvedParams.id) ||
    DUMMY_QUESTIONNAIRES[0];

  const [mode, setMode] = useState<"MOBILE" | "DESKTOP">("MOBILE");
  const likertQuestions = questionnaire.questions.filter((q) => q.type === "LIKERT_5");

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Preview Tampilan: ${questionnaire.title}`}
        description="Simulasi tampilan visual kuesioner pada layar smartphone responden dan peramban web desktop."
        breadcrumbs={[
          { label: hospital.code, href: `/h/${hospital.code}/dashboard` },
          { label: "Kuesioner", href: `/h/${hospital.code}/questionnaires` },
          { label: "Preview Tampilan" },
        ]}
        actions={
          <div className="flex items-center gap-1.5 bg-card p-1 rounded-xl border border-border">
            <button
              onClick={() => setMode("MOBILE")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                mode === "MOBILE"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Layar Mobile
            </button>
            <button
              onClick={() => setMode("DESKTOP")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                mode === "DESKTOP"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              Layar Web
            </button>
          </div>
        }
      />

      {/* Simulator Container */}
      <div className="flex items-center justify-center p-4 sm:p-8 bg-muted/40 rounded-3xl border border-border">
        {mode === "MOBILE" ? (
          /* Phone Frame */
          <div className="w-full max-w-[380px] rounded-[2.5rem] border-4 border-foreground/10 bg-background shadow-2xl overflow-hidden flex flex-col h-[740px]">
            {/* Phone Top Notch */}
            <div className="h-6 bg-card border-b border-border/50 flex items-center justify-center">
              <div className="w-20 h-3 rounded-full bg-muted" />
            </div>

            {/* Mobile App Header */}
            <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight truncate max-w-[190px]">
                    {hospital.name}
                  </p>
                  <p className="text-[9px] opacity-80">Survei Kepuasan Pasien</p>
                </div>
              </div>
              <Badge variant="outline" className="text-[9px] border-primary-foreground/40 text-primary-foreground py-0">
                100% Anonim
              </Badge>
            </div>

            {/* Simulated Survey Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="text-center space-y-1">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                  Langkah 2 dari 3
                </span>
                <h4 className="text-sm font-bold text-foreground">
                  Penilaian Kualitas Pelayanan
                </h4>
              </div>

              <div className="space-y-3">
                {likertQuestions.slice(0, 3).map((q, idx) => (
                  <div key={q.id} className="p-3 rounded-xl border border-border bg-card space-y-2.5">
                    <p className="text-xs font-semibold text-foreground leading-snug">
                      {idx + 1}. {q.text}
                    </p>
                    <div className="grid grid-cols-5 gap-1 text-center">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <div
                          key={num}
                          className={`py-2 rounded-lg border text-xs font-bold ${
                            num === 5 ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 border-border"
                          }`}
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <Button size="sm" className="w-full justify-center">
                Lanjutkan ke Ulasan Saran
              </Button>
            </div>

            {/* Phone Bottom Home Bar */}
            <div className="h-6 bg-card border-t border-border/50 flex items-center justify-center">
              <div className="w-28 h-1 rounded-full bg-muted-foreground/30" />
            </div>
          </div>
        ) : (
          /* Desktop Web View */
          <div className="w-full max-w-3xl rounded-2xl border border-border bg-card shadow-xl p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h3 className="text-base font-bold text-foreground">Tampilan Formulir Web Publik (/s/{hospital.code}/survey)</h3>
              <Badge variant="secondary">Format Desktop 1080p</Badge>
            </div>

            <div className="space-y-4">
              {likertQuestions.slice(0, 4).map((q, idx) => (
                <div key={q.id} className="p-4 rounded-xl border border-border space-y-2">
                  <h4 className="text-xs font-bold text-foreground">
                    {idx + 1}. {q.text}
                  </h4>
                  <div className="grid grid-cols-5 gap-2">
                    {["Sangat Tidak Puas", "Tidak Puas", "Cukup", "Puas", "Sangat Puas"].map((label, i) => (
                      <div
                        key={i}
                        className={`p-2.5 rounded-lg border text-center text-xs font-medium ${
                          i === 4 ? "bg-primary text-primary-foreground border-primary font-bold" : "bg-background border-border"
                        }`}
                      >
                        <span className="block font-bold">{i + 1}</span>
                        <span className="text-[10px] block truncate">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
