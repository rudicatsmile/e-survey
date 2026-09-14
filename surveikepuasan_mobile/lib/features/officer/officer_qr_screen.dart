import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../core/theme/app_theme.dart';

class OfficerQrScreen extends StatelessWidget {
  const OfficerQrScreen({super.key});

  @override
  Widget build(BuildContext context) {
    const qrUrl = 'https://surveikepuasan.id/s/RSUD-CIANJUR?unit=IGD';

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('QR Code Meja IGD'),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: AppTheme.secondaryTeal,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  'INSTALASI GAWAT DARURAT (IGD)',
                  style: GoogleFonts.inter(
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                    color: AppTheme.primaryDark,
                    letterSpacing: 1,
                  ),
                ),
              ),
              const SizedBox(height: 12),
              Text(
                'RSUD Sayang Cianjur',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 22,
                  fontWeight: FontWeight.w800,
                  color: AppTheme.textMain,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                'Silakan scan barcode ini untuk mengisi survei kepuasan layanan IGD kami.',
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(fontSize: 12, color: AppTheme.textMuted),
              ),
              const SizedBox(height: 28),

              // Visual QR Frame Container
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(28),
                  border: Border.all(color: AppTheme.primaryTeal.withValues(alpha: 0.3), width: 3),
                  boxShadow: [
                    BoxShadow(
                      color: AppTheme.primaryTeal.withValues(alpha: 0.15),
                      blurRadius: 24,
                      offset: const Offset(0, 10),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    Container(
                      width: 200,
                      height: 200,
                      decoration: BoxDecoration(
                        color: AppTheme.backgroundLight,
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: const Center(
                        child: Icon(
                          LucideIcons.qrCode,
                          size: 140,
                          color: AppTheme.primaryDark,
                        ),
                      ),
                    ),
                    const SizedBox(height: 14),
                    Text(
                      qrUrl,
                      textAlign: TextAlign.center,
                      style: GoogleFonts.robotoMono(
                        fontSize: 10,
                        color: AppTheme.textMuted,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(LucideIcons.shieldCheck, size: 16, color: AppTheme.accentEmerald),
                  const SizedBox(width: 6),
                  Text(
                    '100% Anonim & Tanpa Perlu Login',
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.textMain,
                    ),
                  ),
                ],
              ),
              const Spacer(),
            ],
          ),
        ),
      ),
    );
  }
}
