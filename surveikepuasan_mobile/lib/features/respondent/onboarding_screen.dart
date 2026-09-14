import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../core/theme/app_theme.dart';

class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Spacer(),
              // Visual Icon Container
              Container(
                width: 72,
                height: 72,
                decoration: BoxDecoration(
                  color: AppTheme.secondaryTeal,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: AppTheme.primaryTeal.withValues(alpha: 0.2)),
                ),
                child: const Icon(
                  LucideIcons.shieldCheck,
                  color: AppTheme.primaryTeal,
                  size: 38,
                ),
              ),
              const SizedBox(height: 28),
              Text(
                'Suara Anda Sangat Berharga',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 28,
                  fontWeight: FontWeight.w800,
                  color: AppTheme.textMain,
                  height: 1.2,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                'Bantu rumah sakit meningkatkan kualitas IGD, Poli Klinik, dan Layanan Obat secara transparan.',
                style: GoogleFonts.inter(
                  fontSize: 14,
                  height: 1.5,
                  color: AppTheme.textMuted,
                ),
              ),
              const SizedBox(height: 32),
              // Highlights list
              _buildFeatureRow(
                icon: LucideIcons.userX,
                title: '100% Anonim & Rahasia',
                desc: 'Tanpa perlu login, tanpa NIK, dan tanpa kontak pribadi.',
              ),
              const SizedBox(height: 18),
              _buildFeatureRow(
                icon: LucideIcons.clock,
                title: 'Hanya Butuh ±3 Menit',
                desc: 'Pertanyaan ringkas pilihan bintang dan kolom saran terbuka.',
              ),
              const SizedBox(height: 18),
              _buildFeatureRow(
                icon: LucideIcons.lineChart,
                title: 'Langsung Sampai ke Direksi',
                desc: 'Setiap masukan dipantau real-time oleh tim penjamin mutu RS.',
              ),
              const Spacer(),
              ElevatedButton(
                onPressed: () => context.go('/home'),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text('Mulai Sekarang'),
                    SizedBox(width: 8),
                    Icon(LucideIcons.arrowRight, size: 18),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              Center(
                child: TextButton(
                  onPressed: () => context.push('/officer-login'),
                  child: Text(
                    'Masuk Sebagai Petugas Lapangan RS',
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.primaryDark,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFeatureRow({
    required IconData icon,
    required String title,
    required String desc,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 38,
          height: 38,
          decoration: BoxDecoration(
            color: AppTheme.secondaryTeal,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icon, color: AppTheme.primaryDark, size: 20),
        ),
        const SizedBox(width: 14),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: AppTheme.textMain,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                desc,
                style: GoogleFonts.inter(
                  fontSize: 12,
                  color: AppTheme.textMuted,
                  height: 1.3,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
