"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import {
  FileQuestion,
  Plus,
  Search,
  Eye,
  Edit,
  Sparkles,
  CheckCircle2,
  Archive,
  Smartphone,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DUMMY_QUESTIONNAIRES, DUMMY_HOSPITALS } from "@/lib/dummy-data";

interface QuestionnairesPageProps {
  params: Promise<{ hospitalCode: string }>;
}

export default function HospitalQuestionnairesPage({ params }: QuestionnairesPageProps) {
  const resolvedParams = use(params);
  const hospital =
    DUMMY_HOSPITALS.find(
      (h) => h.code.toUpperCase() === resolvedParams.hospitalCode.toUpperCase()
    ) || DUMMY_HOSPITALS[0];

  const [searchTerm, setSearchTerm] = useState("");

  const filteredQuestionnaires = DUMMY_QUESTIONNAIRES.filter((q) =>
    q.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return <Badge variant="success">Dipublikasikan</Badge>;
      case "DRAFT":
        return <Badge variant="secondary">Draf</Badge>;
      case "ARCHIVED":
        return <Badge variant="outline" className="text-muted-foreground">Diarsipkan</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Manajemen Kuesioner & Pertanyaan: ${hospital.name}`}
        description="Rancang instrumen kuesioner kepuasan, atur kategori, dan publikasikan versi terbaru."
        breadcrumbs={[
          { label: hospital.code, href: `/h/${hospital.code}/dashboard` },
          { label: "Kuesioner" },
        ]}
        actions={
          <Link href={`/h/${hospital.code}/questionnaires/new`}>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1.5" />
              Buat Kuesioner Baru
            </Button>
          </Link>
        }
      />

      {/* Filter Toolbar */}
      <div className="flex items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari judul kuesioner..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Questionnaires Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-[10px] font-bold">
                <tr>
                  <th className="px-6 py-3.5">Judul Kuesioner</th>
                  <th className="px-6 py-3.5 text-center">Versi</th>
                  <th className="px-6 py-3.5 text-center">Jumlah Soal</th>
                  <th className="px-6 py-3.5 text-center">Status</th>
                  <th className="px-6 py-3.5">Tanggal Publikasi</th>
                  <th className="px-6 py-3.5 text-right">Aksi Editor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredQuestionnaires.map((q) => (
                  <tr key={q.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-foreground text-sm">{q.title}</p>
                      <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                        {q.description}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center font-mono font-bold text-primary">
                      v{q.version}
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-foreground">
                      {q.totalQuestions} Soal
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(q.status)}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-mono">
                      {q.publishedAt ? q.publishedAt.split("T")[0] : "— (Belum Diterbitkan)"}
                    </td>
                    <td className="px-6 py-4 text-right space-x-1.5">
                      <Link href={`/h/${hospital.code}/questionnaires/${q.id}/preview`}>
                        <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs">
                          <Smartphone className="w-3.5 h-3.5 mr-1" />
                          Preview
                        </Button>
                      </Link>
                      <Link href={`/h/${hospital.code}/questionnaires/${q.id}`}>
                        <Button variant="secondary" size="sm" className="h-8 px-2.5 text-xs">
                          <Edit className="w-3.5 h-3.5 mr-1" />
                          Edit Soal
                        </Button>
                      </Link>
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
