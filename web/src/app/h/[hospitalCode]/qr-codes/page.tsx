"use client";

import React, { useState, use } from "react";
import { QRCodeSVG } from "qrcode.react";
import { QrCode, Download, Printer, ExternalLink, Layers, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DUMMY_UNITS, DUMMY_HOSPITALS } from "@/lib/dummy-data";

interface QrCodesPageProps {
  params: Promise<{ hospitalCode: string }>;
}

export default function QrCodesPage({ params }: QrCodesPageProps) {
  const resolvedParams = use(params);
  const hospital =
    DUMMY_HOSPITALS.find(
      (h) => h.code.toUpperCase() === resolvedParams.hospitalCode.toUpperCase()
    ) || DUMMY_HOSPITALS[0];

  const [selectedUnitCode, setSelectedUnitCode] = useState(DUMMY_UNITS[0].code);

  const selectedUnit =
    DUMMY_UNITS.find((u) => u.code === selectedUnitCode) || DUMMY_UNITS[0];

  const surveyUrl = `https://surveikepuasan.id/s/${hospital.code}?unit=${selectedUnit.code}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Generator & Manajemen QR Code: ${hospital.name}`}
        description="Buat dan cetak barcode QR untuk dipajang di meja pendaftaran, ruang tunggu poli, dan loket farmasi."
        breadcrumbs={[
          { label: hospital.code, href: `/h/${hospital.code}/dashboard` },
          { label: "Manajemen QR Code" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selector Unit */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Pilih Unit Layanan</CardTitle>
            <CardDescription>QR Code akan secara otomatis mengarahkan pasien ke kuesioner unit terkait.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {DUMMY_UNITS.map((u) => (
              <button
                key={u.id}
                onClick={() => setSelectedUnitCode(u.code)}
                className={`w-full p-3 rounded-xl border text-left text-xs flex items-center justify-between transition-all cursor-pointer ${
                  selectedUnitCode === u.code
                    ? "bg-primary text-primary-foreground border-primary font-bold shadow-xs"
                    : "bg-card border-border hover:bg-muted text-foreground"
                }`}
              >
                <div>
                  <p className="font-semibold">{u.name}</p>
                  <p className={`text-[10px] ${selectedUnitCode === u.code ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    Kode: {u.code}
                  </p>
                </div>
                <QrCode className="w-4 h-4 shrink-0 opacity-70" />
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Printable Standee Mockup */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6 sm:p-8 flex flex-col items-center justify-center text-center bg-card border-2 border-primary/20 shadow-md">
            {/* Header Standee */}
            <div className="space-y-1.5 mb-6">
              <Badge variant="secondary" className="font-bold text-[10px] mb-1">
                STAND PELAYANAN PASIEN RS
              </Badge>
              <h3 className="text-xl sm:text-2xl font-extrabold text-foreground">
                Bagaimana Pengalaman Pelayanan Anda?
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Bantu kami meningkatkan mutu pelayanan di <strong className="text-foreground">{selectedUnit.name}</strong>
              </p>
            </div>

            {/* QR Code Container */}
            <div className="p-5 rounded-3xl bg-white shadow-md border border-neutral-200 inline-block mb-5">
              <QRCodeSVG
                value={surveyUrl}
                size={220}
                level="H"
                includeMargin={false}
                fgColor="#0d9488"
              />
            </div>

            <div className="space-y-2 max-w-xs">
              <p className="text-xs font-bold text-foreground">
                📱 Pindai (Scan) Menggunakan Kamera HP Anda
              </p>
              <p className="text-[10px] text-muted-foreground">
                Pengisian hanya 2 menit • 100% Anonim & Rahasia
              </p>
              <div className="p-2 rounded-lg bg-muted text-[10px] font-mono text-muted-foreground break-all">
                {surveyUrl}
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-1.5" />
                Cetak Format Poster (A5/A4)
              </Button>
              <Button size="sm" onClick={() => alert("Mengunduh gambar QR dalam format PNG resolusi tinggi...")}>
                <Download className="w-4 h-4 mr-1.5" />
                Unduh File QR (.PNG)
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
