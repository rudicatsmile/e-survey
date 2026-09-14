"use client";

import React, { useState, use } from "react";
import { FileSpreadsheet, FileText, Download, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DUMMY_PERIODS, DUMMY_UNITS, DUMMY_HOSPITALS } from "@/lib/dummy-data";

interface ExportReportProps {
  params: Promise<{ hospitalCode: string }>;
}

export default function ExportReportPage({ params }: ExportReportProps) {
  const resolvedParams = use(params);
  const hospital =
    DUMMY_HOSPITALS.find(
      (h) => h.code.toUpperCase() === resolvedParams.hospitalCode.toUpperCase()
    ) || DUMMY_HOSPITALS[0];

  const [period, setPeriod] = useState("per-001");
  const [unitScope, setUnitScope] = useState("ALL");
  const [format, setFormat] = useState<"PDF" | "EXCEL" | "CSV">("PDF");
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setDownloadSuccess(false);

    try {
      const exportFormat = format.toLowerCase();
      const downloadUrl = `/api/v1/reports/export?hospitalCode=${resolvedParams.hospitalCode}&format=${exportFormat}`;
      window.location.href = downloadUrl;
      setDownloadSuccess(true);
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title={`Export Laporan Resmi: ${hospital.name}`}
        description="Unduh laporan agregat kepuasan masyarakat siap cetak untuk lampiran akreditasi RS dan instansi pengawas."
        breadcrumbs={[
          { label: hospital.code, href: `/h/${hospital.code}/dashboard` },
          { label: "Laporan", href: `/h/${hospital.code}/reports/satisfaction` },
          { label: "Export Dokumen" },
        ]}
      />

      <form onSubmit={handleExport} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Parameter Dokumen Laporan</CardTitle>
            <CardDescription>Pilih cakupan data periode dan format dokumen yang Anda butuhkan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Pilih Periode Survei
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full h-10 rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {DUMMY_PERIODS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Cakupan Unit Layanan
              </label>
              <select
                value={unitScope}
                onChange={(e) => setUnitScope(e.target.value)}
                className="w-full h-10 rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="ALL">Seluruh Unit Layanan (Rekap Agregat Rumah Sakit)</option>
                {DUMMY_UNITS.map((u) => (
                  <option key={u.id} value={u.code}>
                    {u.code} - {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-2">
                Pilih Format File
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setFormat("PDF")}
                  className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                    format === "PDF"
                      ? "border-primary bg-primary/10 ring-2 ring-primary/20 text-primary font-bold shadow-xs"
                      : "border-border bg-card hover:bg-muted text-foreground"
                  }`}
                >
                  <FileText className="w-6 h-6 mx-auto mb-1" />
                  <span className="text-xs block">Laporan PDF</span>
                  <span className="text-[10px] text-muted-foreground block font-normal">Format Cetak Resmi</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormat("EXCEL")}
                  className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                    format === "EXCEL"
                      ? "border-primary bg-primary/10 ring-2 ring-primary/20 text-primary font-bold shadow-xs"
                      : "border-border bg-card hover:bg-muted text-foreground"
                  }`}
                >
                  <FileSpreadsheet className="w-6 h-6 mx-auto mb-1" />
                  <span className="text-xs block">Excel (.xlsx)</span>
                  <span className="text-[10px] text-muted-foreground block font-normal">Matriks Perhitungan</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormat("CSV")}
                  className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                    format === "CSV"
                      ? "border-primary bg-primary/10 ring-2 ring-primary/20 text-primary font-bold shadow-xs"
                      : "border-border bg-card hover:bg-muted text-foreground"
                  }`}
                >
                  <Download className="w-6 h-6 mx-auto mb-1" />
                  <span className="text-xs block">Raw Data (.csv)</span>
                  <span className="text-[10px] text-muted-foreground block font-normal">Dataset Olahan SPSS</span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {downloadSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-3 animate-in fade-in-50">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <div>
              <p className="font-bold">Dokumen Berhasil Dibuat!</p>
              <p className="text-[11px] mt-0.5">
                File <strong>LAPORAN-IKM-{hospital.code}-{format}.{format.toLowerCase()}</strong> telah berhasil di-generate dan tersimpan.
              </p>
            </div>
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={isGenerating}
          className="w-full sm:w-auto shadow-sm"
        >
          {isGenerating ? (
            "Memproses Dokumen Laporan..."
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Generate & Unduh Dokumen Sekarang
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
