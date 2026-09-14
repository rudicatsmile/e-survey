import React from "react";
import Link from "next/link";
import { Activity, ShieldCheck, HeartHandshake, PhoneCall } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/60 backdrop-blur-xs text-muted-foreground mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-foreground">
                Survei<span className="text-primary">Kepuasan</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Platform evaluasi mutu layanan kesehatan publik terstandarisasi PermenPANRB No. 14 Tahun 2017 untuk Rumah Sakit Indonesia.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Anonim & Rahasia</span>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
              Layanan Publik
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/pilih-rs" className="hover:text-primary transition-colors">
                  Cari Rumah Sakit
                </Link>
              </li>
              <li>
                <Link href="/s/RSUD-CIANJUR" className="hover:text-primary transition-colors">
                  Survei RSUD Sayang Cianjur
                </Link>
              </li>
              <li>
                <Link href="/s/RSUD-KARAWANG" className="hover:text-primary transition-colors">
                  Survei RSUD Karawang
                </Link>
              </li>
              <li>
                <Link href="/s/RSHS" className="hover:text-primary transition-colors">
                  Survei RSUP dr. Hasan Sadikin
                </Link>
              </li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
              Informasi & Kebijakan
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/faq" className="hover:text-primary transition-colors">
                  Pertanyaan Umum (FAQ)
                </Link>
              </li>
              <li>
                <Link href="/privasi" className="hover:text-primary transition-colors">
                  Kebijakan Privasi & Data
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="hover:text-primary transition-colors">
                  Pusat Bantuan & Kontak
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary transition-colors">
                  Login Petugas & Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="space-y-2 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
              Layanan Bantuan
            </h4>
            <p className="flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-primary" />
              <span>(021) 500-SURVEI (Hari Kerja 08:00 - 17:00)</span>
            </p>
            <p className="flex items-center gap-2">
              <HeartHandshake className="w-3.5 h-3.5 text-primary" />
              <span>dukungan@surveikepuasan.id</span>
            </p>
            <div className="pt-2 text-[11px] text-muted-foreground/80">
              Mendukung integrasi akreditasi KARS & standar pelayanan publik nasional.
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground/70 gap-3">
          <p>© {new Date().getFullYear()} SurveiKepuasan. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-4">
            <Link href="/privasi" className="hover:underline">
              Keamanan Data
            </Link>
            <span>•</span>
            <Link href="/faq" className="hover:underline">
              Bantuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
