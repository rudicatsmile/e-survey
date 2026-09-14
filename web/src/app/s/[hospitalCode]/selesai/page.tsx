"use client";

import React, { useEffect, useState, use } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Building2,
  ShieldCheck,
  Share2,
  Home,
  RefreshCw,
  Copy,
  Check,
  Heart,
} from "lucide-react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DUMMY_HOSPITALS } from "@/lib/dummy-data";

interface SelesaiPageProps {
  params: Promise<{ hospitalCode: string }>;
}

export default function SelesaiSurveyPage({ params }: SelesaiPageProps) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const respondentCode = searchParams.get("code") || "RES-2025-001430";
  const unitName = searchParams.get("unit") || "IGD";

  const hospital = DUMMY_HOSPITALS.find(
    (h) => h.code.toUpperCase() === resolvedParams.hospitalCode.toUpperCase()
  ) || DUMMY_HOSPITALS[0];

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Trigger celebratory confetti effect on mount
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#14B8A6", "#0D9488", "#10B981", "#F59E0B"],
    });
  }, []);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/s/${hospital.code}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNavbar />

      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-12 w-full flex items-center justify-center">
        <Card className="w-full border-border/80 shadow-lg text-center overflow-hidden">
          {/* Header Graphic */}
          <div className="bg-gradient-to-b from-primary/15 to-transparent pt-10 pb-6 px-6 flex flex-col items-center">
            <div className="w-20 h-20 rounded-3xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 mb-4 animate-in zoom-in-75 duration-300">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>
            <Badge variant="success" className="mb-2">
              Survei Berhasil Dikirim
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Terima Kasih Atas Partisipasi Anda!
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-md">
              Masukan Anda sangat bernilai untuk mewujudkan pelayanan kesehatan yang lebih cepat, ramah, dan manusiawi di <strong className="text-foreground">{hospital.name}</strong>.
            </p>
          </div>

          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* Audit Reference Code Box */}
            <div className="p-4 rounded-2xl bg-muted/50 border border-border space-y-2">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Nomor Tiket Audit Responden (Anonim)
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-lg font-extrabold text-primary tracking-wider">
                  {respondentCode}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Unit: <strong className="text-foreground">{unitName}</strong> • Tanggal: {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Identitas Anda dijamin 100% anonim dan terlindungi.</span>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto">
                  <Home className="w-4 h-4 mr-2" />
                  Kembali ke Beranda
                </Button>
              </Link>
              <Link href={`/s/${hospital.code}/survey`} className="w-full sm:w-auto">
                <Button variant="secondary" className="w-full sm:w-auto">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Isi Survei Unit Lain
                </Button>
              </Link>
              <Button
                variant="primary"
                onClick={handleCopyLink}
                className="w-full sm:w-auto"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Link Tersalin!
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 mr-2" />
                    Ajak Pasien Lain
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <PublicFooter />
    </div>
  );
}
