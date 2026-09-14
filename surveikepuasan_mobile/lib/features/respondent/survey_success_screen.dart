import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../core/theme/app_theme.dart';

class SurveySuccessScreen extends StatelessWidget {
  final String code;

  const SurveySuccessScreen({super.key, required this.code});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Spacer(),
              // Big Success Check Icon
              Container(
                width: 90,
                height: 90,
                decoration: BoxDecoration(
                  color: AppTheme.secondaryTeal,
                  borderRadius: BorderRadius.circular(30),
                ),
                child: const Icon(
                  LucideIcons.checkCircle2,
                  color: AppTheme.primaryTeal,
                  size: 48,
                ),
              ),
              const SizedBox(height: 28),
              Text(
                'Terima Kasih Banyak!',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 24,
                  fontWeight: FontWeight.w800,
                  color: AppTheme.textMain,
                ),
              ),
              const SizedBox(height: 10),
              Text(
                'Survei Anda telah berhasil dikirimkan secara anonim dan langsung masuk ke sistem evaluasi mutu rumah sakit.',
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(
                  fontSize: 13,
                  color: AppTheme.textMuted,
                  height: 1.5,
                ),
              ),
              const SizedBox(height: 28),

              // Audit Code Box
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.backgroundLight,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppTheme.borderLight),
                ),
                child: Column(
                  children: [
                    Text(
                      'NOMOR TIKET AUDIT SURVEI',
                      style: GoogleFonts.inter(
                        fontSize: 10,
                        fontWeight: FontWeight.w700,
                        color: AppTheme.textMuted,
                        letterSpacing: 1,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      code,
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                        color: AppTheme.primaryDark,
                        letterSpacing: 1.5,
                      ),
                    ),
                  ],
                ),
              ),
              const Spacer(),

              ElevatedButton(
                onPressed: () => context.go('/home'),
                child: const Text('Kembali ke Halaman Utama'),
              ),
              const SizedBox(height: 12),
              OutlinedButton(
                onPressed: () => context.push('/history'),
                child: const Text('Lihat Riwayat Survei Saya'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
