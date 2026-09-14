"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { MessageSquareText, RefreshCw, ArrowLeft, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DUMMY_RESPONDENTS, DUMMY_HOSPITALS } from "@/lib/dummy-data";

interface PetugasResponsesProps {
  params: Promise<{ hospitalCode: string }>;
}

export default function PetugasResponsesPage({ params }: PetugasResponsesProps) {
  const resolvedParams = use(params);
  const hospital =
    DUMMY_HOSPITALS.find(
      (h) => h.code.toUpperCase() === resolvedParams.hospitalCode.toUpperCase()
    ) || DUMMY_HOSPITALS[0];

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Scope only to IGD
  const igdResponses = DUMMY_RESPONDENTS.filter((r) =>
    r.unitName.includes("IGD")
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Live Feed Respons Pasien IGD: ${hospital.name}`}
        description="Pemantauan langsung umpan balik pasien khusus di Instalasi Gawat Darurat."
        breadcrumbs={[
          { label: hospital.code, href: `/h/${hospital.code}/dashboard` },
          { label: "Petugas", href: `/h/${hospital.code}/petugas/dashboard` },
          { label: "Live Feed IGD" },
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Perbarui Feed
          </Button>
        }
      />

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-[10px] font-bold">
                <tr>
                  <th className="px-6 py-3.5">Kode Audit Responden</th>
                  <th className="px-6 py-3.5">Waktu Masuk</th>
                  <th className="px-6 py-3.5">Ulasan & Keluhan Pasien</th>
                  <th className="px-6 py-3.5 text-center">Skor Kepuasan</th>
                  <th className="px-6 py-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {igdResponses.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-primary">
                      {r.code}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-mono">
                      {r.submittedAt}
                    </td>
                    <td className="px-6 py-4 text-foreground italic max-w-sm leading-relaxed">
                      &quot;{r.reviewSnippet}&quot;
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="success" className="tabular-nums font-bold">
                        {r.score}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        ● Diterima
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
