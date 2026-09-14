"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { loginAction } from "@/actions/auth-actions";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin.rsud@cianjur.go.id");
  const [password, setPassword] = useState("Admin123!");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const result = await loginAction(formData);

      if (result.success) {
        if (result.redirectUrl) {
          router.push(result.redirectUrl);
        } else {
          router.push("/");
        }
      } else {
        setErrorMessage(result.error || "Gagal masuk. Periksa email dan password Anda.");
        setIsLoading(false);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Terjadi kesalahan jaringan.");
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setIsLoading(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("email", roleEmail);
    formData.append("password", rolePass);

    try {
      const result = await loginAction(formData);
      if (result.success) {
        if (result.redirectUrl) {
          router.push(result.redirectUrl);
        }
      } else {
        setErrorMessage(result.error || "Login gagal.");
        setIsLoading(false);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Terjadi kesalahan koneksi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 px-4 py-12 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm shadow-primary/30 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-foreground">
              Survei<span className="text-primary">Kepuasan</span>
            </span>
          </Link>
          <p className="text-xs text-muted-foreground">
            Portal Masuk Terpadu Admin Rumah Sakit, Super Admin, & Petugas Survey
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-border shadow-md">
          <CardContent className="p-6 sm:p-8 space-y-5">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Alamat Email Terdaftar
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@rsudsayang.id"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-foreground">
                    Kata Sandi (Password)
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[11px] text-primary hover:underline font-medium"
                  >
                    Lupa Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full justify-center shadow-xs"
              >
                {isLoading ? "Memverifikasi Akun..." : "Masuk ke Dashboard"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>

            {/* Quick Demo Switcher */}
            <div className="pt-4 border-t border-border/50 space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block text-center">
                Akses Cepat (Akun Pengguna Terdaftar)
              </span>
              <div className="grid grid-cols-1 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickLogin("admin.rsud@cianjur.go.id", "Admin123!")}
                  className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted/70 text-left flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div>
                    <p className="font-bold text-foreground">Admin RSUD Sayang Cianjur</p>
                    <p className="text-[10px] text-muted-foreground">H. Asep Saifullah, S.Kom</p>
                  </div>
                  <Badge variant="default" className="text-[10px]">Pilih</Badge>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin("admin@surveikepuasan.id", "Admin123!")}
                  className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted/70 text-left flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div>
                    <p className="font-bold text-foreground">Super Admin Platform</p>
                    <p className="text-[10px] text-muted-foreground">Dr. Pratama Wicaksono, M.Kes</p>
                  </div>
                  <Badge variant="warning" className="text-[10px]">Pilih</Badge>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin("petugas.igd@cianjur.go.id", "Petugas123!")}
                  className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted/70 text-left flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div>
                    <p className="font-bold text-foreground">Petugas Survey IGD Cianjur</p>
                    <p className="text-[10px] text-muted-foreground">Budi Santoso, A.Md.Kep</p>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">Pilih</Badge>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/" className="text-xs text-muted-foreground hover:text-foreground">
            ← Kembali ke Beranda Publik
          </Link>
        </div>
      </div>
    </div>
  );
}
