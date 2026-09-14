"use client";

import React, { use } from "react";
import Link from "next/link";
import { Users, Plus, QrCode, Shield, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DUMMY_USERS, DUMMY_HOSPITALS } from "@/lib/dummy-data";

interface PetugasPageProps {
  params: Promise<{ hospitalCode: string }>;
}

export default function HospitalPetugasPage({ params }: PetugasPageProps) {
  const resolvedParams = use(params);
  const hospital =
    DUMMY_HOSPITALS.find(
      (h) => h.code.toUpperCase() === resolvedParams.hospitalCode.toUpperCase()
    ) || DUMMY_HOSPITALS[0];

  const officers = DUMMY_USERS.filter((u) => u.role === "FIELD_OFFICER");

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Petugas Survei Lapangan: ${hospital.name}`}
        description="Kelola akun petugas yang bertugas mendistribusikan QR Code dan memantau respons di unit tertentu."
        breadcrumbs={[
          { label: hospital.code, href: `/h/${hospital.code}/dashboard` },
          { label: "Petugas Survei" },
        ]}
        actions={
          <Link href={`/h/${hospital.code}/petugas/new`}>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1.5" />
              Tambah Petugas Baru
            </Button>
          </Link>
        }
      />

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-[10px] font-bold">
                <tr>
                  <th className="px-6 py-3.5">Nama Petugas & Kontak</th>
                  <th className="px-6 py-3.5">Unit Layanan Penugasan</th>
                  <th className="px-6 py-3.5 font-mono">Terakhir Login</th>
                  <th className="px-6 py-3.5 text-center">Status Akun</th>
                  <th className="px-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {officers.map((o) => (
                  <tr key={o.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-foreground">
                      <p className="text-sm">{o.fullName}</p>
                      <p className="text-[11px] text-muted-foreground font-normal">{o.email}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-primary">
                      {o.assignedUnitName || "Semua Unit"}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-mono">
                      {o.lastLoginAt}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="default" className="text-[10px]">Aktif</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/h/${hospital.code}/petugas/dashboard`}>
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          Masuk Mode Petugas
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
