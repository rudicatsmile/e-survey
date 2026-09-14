"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Konfirmasi kata sandi tidak cocok!");
      return;
    }
    setSuccess(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-foreground">
              Survei<span className="text-primary">Kepuasan</span>
            </span>
          </Link>
          <h1 className="text-xl font-bold text-foreground">Setel Kata Sandi Baru</h1>
          <p className="text-xs text-muted-foreground">
            Masukkan kata sandi baru minimal 8 karakter dengan kombinasi huruf dan angka
          </p>
        </div>

        <Card className="border-border shadow-md">
          <CardContent className="p-6 sm:p-8">
            {success ? (
              <div className="text-center space-y-4 py-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-foreground">Password Berhasil Diperbarui!</h3>
                <p className="text-xs text-muted-foreground">
                  Kata sandi baru Anda telah aktif. Silakan masuk kembali menggunakan kredensial baru.
                </p>
                <Link href="/login" className="block pt-2">
                  <Button className="w-full">
                    Masuk Sekarang
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Kata Sandi Baru
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimal 8 karakter..."
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Ulangi Kata Sandi Baru
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ketik ulang kata sandi..."
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full justify-center">
                  Simpan Kata Sandi Baru
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
