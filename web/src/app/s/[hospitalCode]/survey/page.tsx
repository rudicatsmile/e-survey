"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Check,
  Building2,
  Star,
  Layers,
  Send,
  Sparkles,
  Info,
} from "lucide-react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DUMMY_HOSPITALS, DUMMY_UNITS, DUMMY_QUESTIONNAIRES } from "@/lib/dummy-data";

interface SurveyFormProps {
  params: Promise<{ hospitalCode: string }>;
}

export default function SurveyFormPage({ params }: SurveyFormProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const unitParam = searchParams.get("unit");

  const hospital = DUMMY_HOSPITALS.find(
    (h) => h.code.toUpperCase() === resolvedParams.hospitalCode.toUpperCase()
  ) || DUMMY_HOSPITALS[0];

  const questionnaire = DUMMY_QUESTIONNAIRES[0];
  const likertQuestions = questionnaire.questions.filter((q) => q.type === "LIKERT_5");
  const multipleChoiceQuestion = questionnaire.questions.find((q) => q.type === "MULTIPLE_CHOICE");
  const textQuestion = questionnaire.questions.find((q) => q.type === "LONG_TEXT");

  // Multi-step State
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Form State
  const [demographics, setDemographics] = useState({
    ageRange: "26-35 tahun",
    gender: "UNSPECIFIED",
    education: "S1 / Sarjana",
    occupation: "Karyawan Swasta",
  });

  const [selectedUnit, setSelectedUnit] = useState(
    unitParam ? unitParam.toUpperCase() : "IGD"
  );

  // Answers State: map question id -> likert value (1-5)
  const [answers, setAnswers] = useState<Record<string, number>>({
    "q-1": 5,
    "q-2": 4,
    "q-3": 4,
    "q-4": 3,
    "q-5": 5,
    "q-6": 5,
    "q-7": 4,
  });

  const [selectedFacility, setSelectedFacility] = useState<string>(
    "Kesejukan AC & ventilasi"
  );

  const [reviewText, setReviewText] = useState(
    "Pelayanan dokter dan perawat sangat ramah dan sigap. Mohon agar antrean pengambilan obat farmasi dapat dipercepat lagi."
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Likert scale options
  const likertOptions = [
    { value: 1, label: "Sangat Tidak Puas", desc: "1 Bintang" },
    { value: 2, label: "Tidak Puas", desc: "2 Bintang" },
    { value: 3, label: "Kurang Puas / Cukup", desc: "3 Bintang" },
    { value: 4, label: "Puas", desc: "4 Bintang" },
    { value: 5, label: "Sangat Puas", desc: "5 Bintang" },
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Cari unit id yang dipilih
      const targetUnit = DUMMY_UNITS.find((u) => u.code.toUpperCase() === selectedUnit.toUpperCase()) || DUMMY_UNITS[0];
      
      const payload = {
        hospitalId: hospital.id,
        periodId: 'period_cianjur_2025_t1',
        questionnaireId: questionnaire.id || 'quest_cianjur_ikm_14',
        unitId: targetUnit.id,
        demographics: demographics,
        answers: Object.entries(answers).map(([qId, val]) => ({
          questionId: qId,
          likertValue: val,
        })),
        reviewText: reviewText,
      };

      const res = await fetch('/api/v1/surveys/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        const code = json.data?.respondentCode || `RES-${new Date().getFullYear()}-000000`;
        router.push(`/s/${hospital.code}/selesai?code=${code}&unit=${selectedUnit}&score=${json.data?.overallScore || 90}`);
      } else {
        alert(json.error || 'Gagal mengirim survei.');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Error submitting survey:', err);
      // Fallback
      const generatedCode = `RES-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      router.push(`/s/${hospital.code}/selesai?code=${generatedCode}&unit=${selectedUnit}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNavbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-8 w-full">
        {/* Hospital Mini Header */}
        <div className="flex items-center justify-between pb-5 border-b border-border/60 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground leading-tight">
                {hospital.name}
              </p>
              <p className="text-[10px] text-muted-foreground">{hospital.code} • Survei Kepuasan Pasien</p>
            </div>
          </div>
          <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 gap-1 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Anonim
          </Badge>
        </div>

        {/* Multi-Step Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground mb-2">
            <span className="text-foreground">Langkah {currentStep} dari {totalSteps}</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}% Selesai</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          <div className="grid grid-cols-4 gap-2 text-center text-[10px] sm:text-xs text-muted-foreground mt-2">
            <span className={currentStep >= 1 ? "text-primary font-bold" : ""}>1. Demografi</span>
            <span className={currentStep >= 2 ? "text-primary font-bold" : ""}>2. Unit Layanan</span>
            <span className={currentStep >= 3 ? "text-primary font-bold" : ""}>3. Penilaian IKM</span>
            <span className={currentStep >= 4 ? "text-primary font-bold" : ""}>4. Ulasan & Kirim</span>
          </div>
        </div>

        {/* STEP 1: DEMOGRAFIS (OPSIONAL) */}
        {currentStep === 1 && (
          <Card className="border-border shadow-sm">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div>
                <Badge variant="secondary" className="mb-2">Langkah 1: Identitas Demografis</Badge>
                <h2 className="text-xl font-extrabold text-foreground">
                  Informasi Responden (Bersifat Opsional)
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Data ini digunakan oleh RS untuk memetakan kelompok usia dan latar belakang pengguna layanan, tanpa mengidentifikasi identitas pribadi Anda.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1.5">
                    Kelompok Usia Anda:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {["< 17 tahun", "17-25 tahun", "26-35 tahun", "36-45 tahun", "46-55 tahun", "> 55 tahun"].map((age) => (
                      <button
                        key={age}
                        type="button"
                        onClick={() => setDemographics({ ...demographics, ageRange: age })}
                        className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                          demographics.ageRange === age
                            ? "bg-primary text-primary-foreground border-primary font-bold shadow-xs"
                            : "bg-card border-border hover:bg-muted text-foreground"
                        }`}
                      >
                        {age}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1.5">
                    Jenis Kelamin:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: "MALE", label: "Laki-laki" },
                      { key: "FEMALE", label: "Perempuan" },
                      { key: "UNSPECIFIED", label: "Tidak Menjawab" },
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setDemographics({ ...demographics, gender: item.key as any })}
                        className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                          demographics.gender === item.key
                            ? "bg-primary text-primary-foreground border-primary font-bold shadow-xs"
                            : "bg-card border-border hover:bg-muted text-foreground"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1.5">
                    Pendidikan Terakhir:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {["SD / SMP", "SMA / Sederajat", "Diploma / D3", "S1 / Sarjana", "S2 / Pascasarjana"].map((edu) => (
                      <button
                        key={edu}
                        type="button"
                        onClick={() => setDemographics({ ...demographics, education: edu })}
                        className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                          demographics.education === edu
                            ? "bg-primary text-primary-foreground border-primary font-bold shadow-xs"
                            : "bg-card border-border hover:bg-muted text-foreground"
                        }`}
                      >
                        {edu}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1.5">
                    Pekerjaan Utama:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {["PNS / TNI / POLRI", "Karyawan Swasta", "Wiraswasta", "Pelajar / Mahasiswa", "Ibu Rumah Tangga", "Lainnya"].map((occ) => (
                      <button
                        key={occ}
                        type="button"
                        onClick={() => setDemographics({ ...demographics, occupation: occ })}
                        className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                          demographics.occupation === occ
                            ? "bg-primary text-primary-foreground border-primary font-bold shadow-xs"
                            : "bg-card border-border hover:bg-muted text-foreground"
                        }`}
                      >
                        {occ}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 2: PILIH UNIT LAYANAN */}
        {currentStep === 2 && (
          <Card className="border-border shadow-sm">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div>
                <Badge variant="secondary" className="mb-2">Langkah 2: Lokasi Pelayanan</Badge>
                <h2 className="text-xl font-extrabold text-foreground">
                  Pilih Unit Layanan yang Anda Terima
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Pilih bagian atau instalasi tempat Anda mendapatkan perawatan/layanan hari ini di {hospital.name}.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {DUMMY_UNITS.map((unit) => (
                  <button
                    key={unit.id}
                    type="button"
                    onClick={() => setSelectedUnit(unit.code)}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-start justify-between group cursor-pointer ${
                      selectedUnit === unit.code
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                        : "border-border bg-card hover:bg-muted/50"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-primary px-1.5 py-0.5 rounded-md bg-primary/10">
                          {unit.code}
                        </span>
                        <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                          {unit.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                        {unit.description}
                      </p>
                    </div>
                    {selectedUnit === unit.code && (
                      <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 ml-2">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 3: PENILAIAN LIKERT IKM */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <Card className="border-border shadow-sm">
              <CardContent className="p-6 sm:p-8 space-y-2">
                <Badge variant="secondary">Langkah 3: Pertanyaan Baku IKM</Badge>
                <h2 className="text-xl font-extrabold text-foreground">
                  Penilaian Kepuasan Pelayanan
                </h2>
                <p className="text-xs text-muted-foreground">
                  Skala penilaian: 1 = Sangat Tidak Puas hingga 5 = Sangat Puas. Berikan penilaian sesuai pengalaman riil Anda.
                </p>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {likertQuestions.map((q, idx) => {
                const currentVal = answers[q.id] || 4;
                return (
                  <Card key={q.id} className="border-border shadow-xs hover:shadow-sm transition-shadow">
                    <CardContent className="p-5 sm:p-6 space-y-4">
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <h4 className="text-sm font-bold text-foreground leading-relaxed">
                          {q.text}
                        </h4>
                      </div>

                      {/* Likert Buttons 1-5 */}
                      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 pt-1">
                        {likertOptions.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setAnswers({ ...answers, [q.id]: opt.value })}
                            className={`p-2.5 sm:p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                              currentVal === opt.value
                                ? "bg-primary text-primary-foreground border-primary shadow-xs font-bold ring-2 ring-primary/20 scale-[1.02]"
                                : "bg-card border-border hover:bg-muted text-foreground"
                            }`}
                          >
                            <span className="text-base sm:text-lg font-extrabold">{opt.value}</span>
                            <span className="text-[9px] sm:text-[10px] text-center leading-tight line-clamp-1">
                              {opt.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: ULASAN KUALITATIF & KIRIM */}
        {currentStep === 4 && (
          <Card className="border-border shadow-sm">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div>
                <Badge variant="secondary" className="mb-2">Langkah 4: Saran & Penyelesaian</Badge>
                <h2 className="text-xl font-extrabold text-foreground">
                  Ulasan Kualitatif & Rekomendasi
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Saran konkret Anda akan dibaca langsung oleh tim penjamin mutu {hospital.name}.
                </p>
              </div>

              {multipleChoiceQuestion && (
                <div className="space-y-2 pt-1">
                  <label className="text-xs font-bold text-foreground block">
                    {multipleChoiceQuestion.text}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {multipleChoiceQuestion.options?.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedFacility(opt)}
                        className={`p-3 rounded-xl border text-xs font-medium text-left transition-all flex items-center justify-between cursor-pointer ${
                          selectedFacility === opt
                            ? "bg-primary text-primary-foreground border-primary font-bold shadow-xs"
                            : "bg-card border-border hover:bg-muted text-foreground"
                        }`}
                      >
                        <span>{opt}</span>
                        {selectedFacility === opt && <Check className="w-4 h-4 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {textQuestion && (
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-foreground block">
                    {textQuestion.text}
                  </label>
                  <textarea
                    rows={4}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Contoh: Dokter Poli Anak sangat ramah dan sabar, namun ruang tunggu agak gerah. Mohon kipas angin ditambah..."
                    className="w-full rounded-xl border border-input bg-background/80 p-3.5 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
                  />
                </div>
              )}

              {/* Summary recap before submit */}
              <div className="p-4 rounded-xl bg-muted/60 border border-border space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Rumah Sakit:</span>
                  <span className="font-bold text-foreground">{hospital.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Unit Layanan:</span>
                  <span className="font-bold text-primary">{selectedUnit}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Jumlah Pertanyaan Terjawab:</span>
                  <span className="font-bold text-foreground">7 Pertanyaan Likert (Lengkap)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="mt-6 flex items-center justify-between gap-4">
          {currentStep > 1 ? (
            <Button variant="outline" onClick={handleBack} disabled={isSubmitting}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              Kembali
            </Button>
          ) : (
            <Link href={`/s/${hospital.code}`}>
              <Button variant="ghost" size="sm">
                Batal
              </Button>
            </Link>
          )}

          {currentStep < totalSteps ? (
            <Button onClick={handleNext}>
              Lanjutkan
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 shadow-md shadow-primary/25"
            >
              {isSubmitting ? "Mengirimkan Survei..." : "Kirim Survei Saya"}
              <Send className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
