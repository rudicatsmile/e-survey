"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Activity, Mail, ArrowRight, CheckCircle2, ChevronLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
          <h1 className="text-xl font-bold text-foreground">Pemulihan Kata Sandi</h1>
          <p className="text-xs text-muted-foreground">
            Masukkan alamat email akun pengelola rumah sakit Anda
          </p>
        </div>

        <Card className="border-border shadow-md">
          <CardContent className="p-6 sm:p-8">
            {submitted ? (
              <div className="text-center space-y-4 py-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-foreground">Tautan Reset Terkirim!</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Kami telah mengirimkan tautan reset kata sandi ke <strong className="text-foreground">{email}</strong>. Tautan berlaku selama 60 menit.
                </p>
                <Link href="/reset-password?token=mock-token-demo" className="block pt-2">
                  <Button size="sm" variant="secondary" className="w-full">
                    Lanjut Simulasi Buat Sandi Baru (Demo Token)
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Email Akun Terdaftar
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="dr.ratna@rsudsayang.id"
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full justify-center">
                  Kirim Instruksi Reset Password
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/login" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            <ChevronLeft className="w-3.5 h-3.5" />
            Kembali ke Halaman Login
          </Link>
        </div>
      </div>
    </div>
  );
}
