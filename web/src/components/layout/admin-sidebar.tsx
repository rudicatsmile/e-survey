"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  BarChart3,
  History,
  Settings,
  FileQuestion,
  CalendarDays,
  Layers,
  UserCheck,
  MessageSquareText,
  QrCode,
  FileSpreadsheet,
  TrendingUp,
  FileText,
  Hospital as HospitalIcon,
  ChevronDown,
  Shield,
  Activity,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface AdminSidebarProps {
  hospitalCode?: string;
  isSuperAdmin?: boolean;
  isOfficer?: boolean;
  hospitalName?: string;
}

export function AdminSidebar({
  hospitalCode = "RSUD-CIANJUR",
  isSuperAdmin = false,
  isOfficer = false,
  hospitalName = "RSUD Sayang Cianjur",
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [reportsOpen, setReportsOpen] = useState(true);

  // Super Admin Navigation Items
  const superAdminNav = [
    { label: "Dashboard Global", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Kelola Rumah Sakit", href: "/admin/hospitals", icon: Building2 },
    { label: "Pengguna Lintas RS", href: "/admin/users", icon: Users },
    { label: "Komparasi Skor RS", href: "/admin/comparison", icon: BarChart3 },
    { label: "Audit Log Global", href: "/admin/audit-logs", icon: History },
    { label: "Pengaturan Platform", href: "/admin/settings", icon: Settings },
  ];

  // Hospital Officer Navigation Items
  const officerNav = [
    {
      label: "Dashboard Unit Saya",
      href: `/h/${hospitalCode}/petugas/dashboard`,
      icon: LayoutDashboard,
    },
    {
      label: "Live Feed Respons",
      href: `/h/${hospitalCode}/petugas/responses`,
      icon: MessageSquareText,
    },
  ];

  // Hospital Admin Navigation Items
  const baseHospitalUrl = `/h/${hospitalCode}`;
  const hospitalAdminNav = [
    { label: "Dashboard RS", href: `${baseHospitalUrl}/dashboard`, icon: LayoutDashboard },
    { label: "Kuesioner & Soal", href: `${baseHospitalUrl}/questionnaires`, icon: FileQuestion },
    { label: "Periode Survey", href: `${baseHospitalUrl}/periods`, icon: CalendarDays },
    { label: "Unit Layanan", href: `${baseHospitalUrl}/units`, icon: Layers },
    { label: "Data Responden", href: `${baseHospitalUrl}/respondents`, icon: UserCheck },
    { label: "Detail Respons", href: `${baseHospitalUrl}/responses`, icon: MessageSquareText },
    { label: "Manajemen QR Code", href: `${baseHospitalUrl}/qr-codes`, icon: QrCode },
    { label: "Petugas Survey", href: `${baseHospitalUrl}/petugas`, icon: Users },
    { label: "History Log / Audit", href: `${baseHospitalUrl}/history-logs`, icon: History },
  ];

  const reportSubmenu = [
    { label: "Indeks IKM 14 Unsur", href: `${baseHospitalUrl}/reports/satisfaction`, icon: BarChart3 },
    { label: "Ranking Unit Layanan", href: `${baseHospitalUrl}/reports/units`, icon: Layers },
    { label: "Tren Waktu Kepuasan", href: `${baseHospitalUrl}/reports/trends`, icon: TrendingUp },
    { label: "Analisis Ulasan Responden", href: `${baseHospitalUrl}/reports/reviews`, icon: MessageSquareText },
    { label: "Export PDF & Excel", href: `${baseHospitalUrl}/reports/export`, icon: FileSpreadsheet },
  ];

  const settingsNav = [
    { label: "Profil Rumah Sakit", href: `${baseHospitalUrl}/profile`, icon: HospitalIcon },
    { label: "Pengaturan Tenant", href: `${baseHospitalUrl}/settings`, icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-border/70 bg-card/80 backdrop-blur-md flex flex-col h-screen sticky top-0">
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-border/60 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-xs">
            <Activity className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight text-foreground leading-tight">
              Survei<span className="text-primary">Kepuasan</span>
            </span>
            <span className="text-[10px] text-muted-foreground font-semibold">
              BACK-OFFICE
            </span>
          </div>
        </Link>
      </div>

      {/* Tenant Context Bar (if hospital admin or officer) */}
      {!isSuperAdmin && (
        <div className="px-4 py-3 bg-secondary/50 border-b border-border/50">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Tenant Aktif
            </span>
            <Badge variant="default" className="text-[10px] py-0 px-1.5 h-4">
              {hospitalCode}
            </Badge>
          </div>
          <p className="text-xs font-bold text-foreground truncate mt-0.5">
            {hospitalName}
          </p>
        </div>
      )}

      {/* Super Admin Tenant Context Bar */}
      {isSuperAdmin && (
        <div className="px-4 py-2.5 bg-amber-500/10 border-b border-amber-500/20">
          <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
            <Shield className="w-3.5 h-3.5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Akses Super Admin
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Pengawasan multi-tenant seluruh RS
          </p>
        </div>
      )}

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Navigation Group */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
            {isSuperAdmin ? "Manajemen Platform" : isOfficer ? "Tugas Lapangan" : "Operasional Survei"}
          </div>

          <nav className="space-y-1">
            {(isSuperAdmin ? superAdminNav : isOfficer ? officerNav : hospitalAdminNav).map(
              (item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors group",
                      isActive
                        ? "bg-primary text-primary-foreground font-semibold shadow-xs shadow-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                    )}
                  >
                    <Icon className={cn("w-4 h-4 shrink-0 transition-transform group-hover:scale-105", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              }
            )}
          </nav>
        </div>

        {/* Reports Submenu (Hospital Admin Only) */}
        {!isSuperAdmin && !isOfficer && (
          <div>
            <button
              type="button"
              onClick={() => setReportsOpen(!reportsOpen)}
              className="w-full flex items-center justify-between px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 hover:text-foreground transition-colors cursor-pointer"
            >
              <span>Laporan & Analitik</span>
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 transition-transform duration-200",
                  reportsOpen ? "rotate-0" : "-rotate-90"
                )}
              />
            </button>

            {reportsOpen && (
              <nav className="space-y-1 pl-1">
                {reportSubmenu.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary font-bold"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>
        )}

        {/* Settings Group (Hospital Admin Only) */}
        {!isSuperAdmin && !isOfficer && (
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              Konfigurasi
            </div>
            <nav className="space-y-1">
              {settingsNav.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Footer Navigation Switcher */}
      <div className="p-3 border-t border-border/60 bg-muted/20 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground px-2">
          <span>Demo Role Switcher:</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 text-[11px]">
          <Link
            href="/admin/dashboard"
            className={cn(
              "px-2 py-1.5 rounded-lg text-center font-medium border border-border/60 transition-colors",
              isSuperAdmin ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"
            )}
          >
            Super Admin
          </Link>
          <Link
            href={`/h/${hospitalCode}/dashboard`}
            className={cn(
              "px-2 py-1.5 rounded-lg text-center font-medium border border-border/60 transition-colors",
              !isSuperAdmin && !isOfficer ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"
            )}
          >
            Admin RS
          </Link>
        </div>
        <Link
          href={`/h/${hospitalCode}/petugas/dashboard`}
          className={cn(
            "w-full block px-2 py-1 rounded-lg text-center text-[11px] font-medium border border-border/60 transition-colors",
            isOfficer ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"
          )}
        >
          Mode Petugas Lapangan (IGD)
        </Link>
      </div>
    </aside>
  );
}
