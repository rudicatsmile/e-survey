"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Search,
  Building,
  User,
  LogOut,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { DUMMY_HOSPITALS } from "@/lib/dummy-data";

interface DashboardTopbarProps {
  currentHospitalCode?: string;
  userRole?: string;
  userName?: string;
}

export function DashboardTopbar({
  currentHospitalCode = "RSUD-CIANJUR",
  userRole = "Admin Rumah Sakit",
  userName = "Dr. Ratna Kusuma, Sp.PK",
}: DashboardTopbarProps) {
  const router = useRouter();
  const [hospDropdownOpen, setHospDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "Respons Baru Masuk",
      desc: "Responden mengisi survei unit IGD dengan skor 95.0.",
      time: "5 menit lalu",
      unread: true,
    },
    {
      id: 2,
      title: "Target Survei Tercapai 85%",
      desc: "Periode Triwulan I 2025 telah mengumpulkan 842 dari 1.000 respons.",
      time: "2 jam lalu",
      unread: true,
    },
    {
      id: 3,
      title: "Perubahan Kuesioner",
      desc: "Kuesioner IKM versi 2 berhasil dipublikasikan.",
      time: "Kemarin",
      unread: false,
    },
  ];

  return (
    <header className="h-16 border-b border-border/70 bg-card/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Hospital Switcher dropdown for multi-tenant simulation */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            type="button"
            onClick={() => setHospDropdownOpen(!hospDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-background hover:bg-muted/70 text-xs font-semibold text-foreground transition-colors cursor-pointer"
          >
            <Building className="w-3.5 h-3.5 text-primary" />
            <span className="hidden sm:inline">Pilih RS:</span>
            <span className="text-primary font-bold">{currentHospitalCode}</span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </button>

          {hospDropdownOpen && (
            <div className="absolute left-0 mt-2 w-72 rounded-2xl border border-border bg-card shadow-xl p-2 z-50 animate-in fade-in-50 zoom-in-95">
              <p className="px-3 py-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Simulasi Multi-Tenant RS
              </p>
              <div className="space-y-1">
                {DUMMY_HOSPITALS.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => {
                      setHospDropdownOpen(false);
                      router.push(`/h/${h.code}/dashboard`);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-muted flex items-center justify-between group transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="font-semibold text-foreground group-hover:text-primary">
                        {h.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{h.city} • {h.code}</p>
                    </div>
                    {h.code === currentHospitalCode && (
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Public Survey Shortcut */}
        <Link
          href={`/s/${currentHospitalCode}`}
          target="_blank"
          className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-medium ml-2"
        >
          <span>Buka Form Survei Publik</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Notifications Popover */}
        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setNotifOpen(!notifOpen)}
            className="w-9 h-9 rounded-xl relative"
            title="Notifikasi"
          >
            <Bell className="w-4 h-4 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
          </Button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-border bg-card shadow-xl p-3 z-50 animate-in fade-in-50 zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-border/50">
                <span className="text-xs font-bold text-foreground">Notifikasi Aktivitas</span>
                <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">
                  2 Baru
                </span>
              </div>
              <div className="divide-y divide-border/40 max-h-64 overflow-y-auto mt-2">
                {notifications.map((n) => (
                  <div key={n.id} className="py-2.5 px-1 hover:bg-muted/40 rounded-lg">
                    <p className="text-xs font-semibold text-foreground flex items-center justify-between">
                      {n.title}
                      <span className="text-[10px] text-muted-foreground font-normal">{n.time}</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <ThemeToggle />

        {/* User Profile Avatar */}
        <div className="flex items-center gap-3 pl-3 border-l border-border/70">
          <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary font-bold flex items-center justify-center text-sm border border-primary/20">
            {userName.charAt(0)}
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-bold text-foreground leading-tight">
              {userName}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">
              {userRole}
            </span>
          </div>
          <Link href="/login" title="Keluar">
            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-muted-foreground hover:text-destructive">
              <LogOut className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
