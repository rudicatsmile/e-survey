import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Edit,
  ExternalLink,
  Layers,
  Users,
  Award,
  CalendarDays,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { DUMMY_HOSPITALS, DUMMY_UNITS, DUMMY_USERS } from "@/lib/dummy-data";

interface HospitalDetailProps {
  params: Promise<{ id: string }>;
}

export default async function AdminHospitalDetailPage({ params }: HospitalDetailProps) {
  const { id } = await params;
  const hospital = DUMMY_HOSPITALS.find((h) => h.id === id) || DUMMY_HOSPITALS[0];

  const hospitalUsers = DUMMY_USERS.filter((u) => u.hospitalId === hospital.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Detail Rumah Sakit: ${hospital.name}`}
        description={`Profil fasilitas kesehatan, kode tenant ${hospital.code}, dan ringkasan operasional survei.`}
        breadcrumbs={[
          { label: "Super Admin", href: "/admin/dashboard" },
          { label: "Daftar Rumah Sakit", href: "/admin/hospitals" },
          { label: hospital.code },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href={`/admin/hospitals/${hospital.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="w-3.5 h-3.5 mr-1" />
                Edit Profil RS
              </Button>
            </Link>
            <Link href={`/h/${hospital.code}/dashboard`}>
              <Button size="sm">
                Masuk Dashboard Tenant
                <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Skor Rata-rata IKM"
          value={`${hospital.averageScore} / 100`}
          description="Kategori Sangat Baik"
          icon={<Award className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard
          title="Total Respons Pasien"
          value={hospital.totalResponses.toLocaleString("id-ID")}
          description="Sejak awal pendaftaran"
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          title="Unit Layanan Aktif"
          value={`${hospital.unitCount} Unit`}
          description="IGD, Poli, Farmasi, dll."
          icon={<Layers className="w-5 h-5" />}
        />
        <StatCard
          title="Status Akreditasi"
          value="Paripurna"
          description="KARS Standar Kemenkes"
          icon={<ShieldCheck className="w-5 h-5 text-primary" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Detail */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informasi Profil Fasilitas</CardTitle>
            <CardDescription>Data legalitas dan kontak resmi yang terdaftar.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-border/50">
              <div>
                <span className="text-muted-foreground block">Nama Resmi</span>
                <span className="font-bold text-foreground text-sm">{hospital.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Kode Tenant Unik</span>
                <span className="font-mono font-bold text-primary text-sm">{hospital.code}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-border/50">
              <div>
                <span className="text-muted-foreground block">Kota / Wilayah</span>
                <span className="font-semibold text-foreground">{hospital.city}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Hotline Telepon</span>
                <span className="font-semibold text-foreground">{hospital.phone}</span>
              </div>
            </div>

            <div>
              <span className="text-muted-foreground block">Alamat Lengkap</span>
              <p className="font-medium text-foreground mt-0.5">{hospital.address}</p>
            </div>

            <div>
              <span className="text-muted-foreground block">Deskripsi & Profil Layanan</span>
              <p className="text-muted-foreground mt-0.5 leading-relaxed">{hospital.description}</p>
            </div>

            <div className="pt-2">
              <span className="text-muted-foreground block">Tautan Survei Publik Responden</span>
              <div className="mt-1 p-2.5 rounded-xl bg-muted font-mono text-xs flex items-center justify-between text-primary font-bold">
                <span>https://surveikepuasan.id/s/{hospital.code}</span>
                <Link href={`/s/${hospital.code}`} target="_blank">
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px]">
                    Buka
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Pengelola */}
        <Card>
          <CardHeader>
            <CardTitle>Pengelola & Petugas</CardTitle>
            <CardDescription>Pengguna dengan hak akses di RS ini</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {hospitalUsers.map((user) => (
              <div
                key={user.id}
                className="p-3 rounded-xl border border-border flex items-start justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-foreground">{user.fullName}</p>
                  <p className="text-[11px] text-muted-foreground">{user.email}</p>
                  <Badge variant="outline" className="mt-1.5 text-[10px]">
                    {user.role}
                  </Badge>
                </div>
                <Badge variant="default" className="text-[10px]">Aktif</Badge>
              </div>
            ))}

            <Link href="/admin/users" className="block pt-2">
              <Button variant="outline" size="sm" className="w-full text-xs">
                Kelola Seluruh Akun Pengguna
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
