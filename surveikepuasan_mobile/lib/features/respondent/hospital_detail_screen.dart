import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../core/theme/app_theme.dart';
import '../../core/providers/survey_provider.dart';

class HospitalDetailScreen extends ConsumerWidget {
  const HospitalDetailScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(surveyProvider);
    final hospital = state.selectedHospital;
    final selectedUnit = state.selectedUnit;

    if (hospital == null) {
      return Scaffold(
        body: Center(
          child: ElevatedButton(
            onPressed: () => context.go('/home'),
            child: const Text('Kembali ke Beranda'),
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: AppTheme.backgroundLight,
      appBar: AppBar(
        title: Text(hospital.code),
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        children: [
          // Hospital Header Card
          Card(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 52,
                        height: 52,
                        decoration: BoxDecoration(
                          color: AppTheme.secondaryTeal,
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: const Icon(
                          LucideIcons.building,
                          color: AppTheme.primaryDark,
                          size: 28,
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              hospital.name,
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 17,
                                fontWeight: FontWeight.w800,
                                color: AppTheme.textMain,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              '${hospital.city} • Terakreditasi Paripurna KARS',
                              style: GoogleFonts.inter(
                                fontSize: 11,
                                color: AppTheme.textMuted,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  const Divider(color: AppTheme.borderLight),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      const Icon(LucideIcons.mapPin, size: 16, color: AppTheme.primaryTeal),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          hospital.address,
                          style: GoogleFonts.inter(fontSize: 12, color: AppTheme.textMuted),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(LucideIcons.phone, size: 16, color: AppTheme.primaryTeal),
                      const SizedBox(width: 8),
                      Text(
                        hospital.phone,
                        style: GoogleFonts.inter(fontSize: 12, color: AppTheme.textMuted),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          if (selectedUnit != null) ...[
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppTheme.secondaryTeal,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.primaryTeal.withValues(alpha: 0.3)),
              ),
              child: Row(
                children: [
                  const Icon(LucideIcons.checkCircle2, color: AppTheme.primaryDark, size: 20),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'Unit terpilih: ${selectedUnit.name} (${selectedUnit.code})',
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: AppTheme.primaryDark,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
          ],

          // Informed Consent Card
          Card(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(LucideIcons.shieldCheck, color: AppTheme.accentEmerald, size: 22),
                      const SizedBox(width: 8),
                      Text(
                        'Pernyataan Informed Consent',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: AppTheme.textMain,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  _buildConsentItem('Data 100% Anonim: Tanpa NIK, Nama Lengkap, atau nomor telepon Anda.'),
                  _buildConsentItem('Pengisian Cepat: Hanya membutuhkan waktu ±2 sampai 3 menit.'),
                  _buildConsentItem('Hak Pelayanan Tetap Terjaga: Jawaban Anda tidak mempengaruhi tindakan medis.'),
                ],
              ),
            ),
          ),
          const SizedBox(height: 32),

          ElevatedButton(
            onPressed: () => context.push('/survey-flow'),
            child: const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('Mulai Pengisian Survei'),
                SizedBox(width: 8),
                Icon(LucideIcons.arrowRight, size: 18),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildConsentItem(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Padding(
            padding: EdgeInsets.only(top: 4),
            child: Icon(LucideIcons.check, size: 14, color: AppTheme.accentEmerald),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              text,
              style: GoogleFonts.inter(fontSize: 12, color: AppTheme.textMuted, height: 1.4),
            ),
          ),
        ],
      ),
    );
  }
}
