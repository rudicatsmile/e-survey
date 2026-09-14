"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { MessageSquareText, Search, Eye, Filter } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DUMMY_RESPONDENTS, DUMMY_HOSPITALS } from "@/lib/dummy-data";

interface ResponsesPageProps {
  params: Promise<{ hospitalCode: string }>;
}

export default function HospitalResponsesPage({ params }: ResponsesPageProps) {
  const resolvedParams = use(params);
  const hospital =
    DUMMY_HOSPITALS.find(
      (h) => h.code.toUpperCase() === resolvedParams.hospitalCode.toUpperCase()
    ) || DUMMY_HOSPITALS[0];

  const [searchTerm, setSearchTerm] = useState("");

  const filtered = DUMMY_RESPONDENTS.filter(
    (r) =>
      r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.unitName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Daftar Respons Survei: ${hospital.name}`}
        description="Seluruh isian survei yang masuk secara real-time dari aplikasi mobile maupun formulir web."
        breadcrumbs={[
          { label: hospital.code, href: `/h/${hospital.code}/dashboard` },
          { label: "Detail Respons" },
        ]}
      />

      {/* Filter Toolbar */}
      <div className="flex items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari kode tiket responden atau unit..."
            className="pl-10"
          />
        </div>
        <span className="text-xs text-muted-foreground">
          Total: {filtered.length} Respons Terkumpul
        </span>
      </div>

      {/* Responses Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-[10px] font-bold">
                <tr>
                  <th className="px-6 py-3.5">Kode Tiket</th>
                  <th className="px-6 py-3.5">Unit Layanan</th>
                  <th className="px-6 py-3.5">Cuplikan Saran / Keluhan</th>
                  <th className="px-6 py-3.5 text-center">Skor IKM</th>
                  <th className="px-6 py-3.5 font-mono">Waktu Pengisian</th>
                  <th className="px-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-primary">
                      {r.code}
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      {r.unitName}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground max-w-xs truncate italic">
                      &quot;{r.reviewSnippet || "Tidak ada saran khusus"}&quot;
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="success" className="tabular-nums font-bold">
                        {r.score}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-mono">
                      {r.submittedAt}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/h/${hospital.code}/responses/${r.id}`}>
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          Buka Detail
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
