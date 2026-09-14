"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function KontakPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNavbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="max-w-2xl mb-10 space-y-3">
          <Badge variant="secondary">Hubungi Tim Pengelola</Badge>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Pusat Bantuan & Kemitraan Rumah Sakit
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Apakah Anda perwakilan manajemen rumah sakit yang ingin mengintegrasikan SurveiKepuasan, atau masyarakat yang membutuhkan informasi teknis? Kirimkan pesan Anda kepada kami.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Info Card */}
          <div className="space-y-4">
            <Card className="border-border">
              <CardContent className="p-6 space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Kantor Operasional</h4>
                    <p className="text-muted-foreground mt-0.5">Gedung Pusat Pelayanan Publik Terpadu, Jl. Kesehatan No. 10, Jakarta Pusat</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Email Resmi</h4>
                    <p className="text-muted-foreground mt-0.5">dukungan@surveikepuasan.id</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Call Center</h4>
                    <p className="text-muted-foreground mt-0.5">(021) 500-SURVEI (Senin - Jumat 08:00 - 17:00)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form */}
          <div className="md:col-span-2">
            <Card className="border-border shadow-xs">
              <CardContent className="p-6 sm:p-8">
                {submitted ? (
                  <div className="py-12 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Pesan Anda Berhasil Terkirim!</h3>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                      Tim kemitraan kami akan menghubungi Anda melalui email dalam waktu 1x24 jam kerja.
                    </p>
                    <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                      Kirim Pesan Lain
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-foreground block mb-1">Nama Lengkap</label>
                        <Input required placeholder="Contoh: Dr. Irwan Santoso" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-foreground block mb-1">Email Anda</label>
                        <Input type="email" required placeholder="nama@instansi.go.id" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-foreground block mb-1">Nama Rumah Sakit / Instansi</label>
                        <Input placeholder="Contoh: RSUD Sayang Cianjur" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-foreground block mb-1">Nomor Telepon / WhatsApp</label>
                        <Input placeholder="0812-xxxx-xxxx" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-foreground block mb-1">Pesan atau Kebutuhan Kemitraan</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Tuliskan pertanyaan atau kebutuhan integrasi sistem survei rumah sakit Anda..."
                        className="w-full rounded-xl border border-input bg-background/80 p-3 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
                      />
                    </div>

                    <Button type="submit" size="md" className="w-full sm:w-auto">
                      Kirim Formulir Pertanyaan
                      <Send className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
