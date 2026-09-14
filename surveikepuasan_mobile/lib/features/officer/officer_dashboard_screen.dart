import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../core/theme/app_theme.dart';

class OfficerDashboardScreen extends StatelessWidget {
  const OfficerDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    const officerName = 'Ns. Sri Wahyuni, S.Kep.';
    const unitName = 'Instalasi Gawat Darurat (IGD)';
    const hospitalName = 'RSUD Sayang Cianjur';

    return Scaffold(
      backgroundColor: AppTheme.backgroundLight,
      appBar: AppBar(
        title: const Text('Dashboard Petugas Lapangan'),
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.logOut, color: AppTheme.dangerRose),
            tooltip: 'Keluar',
            onPressed: () => context.go('/home'),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        children: [
          // Officer ID Card
          Card(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Row(
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: AppTheme.secondaryTeal,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: const Icon(
                      LucideIcons.userCheck,
                      color: AppTheme.primaryDark,
                      size: 24,
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          officerName,
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 15,
                            fontWeight: FontWeight.w700,
                            color: AppTheme.textMain,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          '$unitName\n$hospitalName',
                          style: GoogleFonts.inter(
                            fontSize: 11,
                            color: AppTheme.textMuted,
                            height: 1.3,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Daily Stats Grid
          Row(
            children: [
              Expanded(
                child: Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Respons Hari Ini',
                          style: GoogleFonts.inter(fontSize: 11, color: AppTheme.textMuted),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          '52',
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 26,
                            fontWeight: FontWeight.w800,
                            color: AppTheme.primaryDark,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '+12 jam ini',
                          style: GoogleFonts.inter(
                            fontSize: 11,
                            color: AppTheme.accentEmerald,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Skor Mutu IGD',
                          style: GoogleFonts.inter(fontSize: 11, color: AppTheme.textMuted),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          '86.4',
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 26,
                            fontWeight: FontWeight.w800,
                            color: AppTheme.accentEmerald,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Sangat Baik (A)',
                          style: GoogleFonts.inter(
                            fontSize: 11,
                            color: AppTheme.textMuted,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),

          // Action 1: Buka QR Meja
          Card(
            child: InkWell(
              borderRadius: BorderRadius.circular(20),
              onTap: () => context.push('/officer-qr'),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: AppTheme.secondaryTeal,
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: const Icon(LucideIcons.qrCode, color: AppTheme.primaryDark),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Tampilkan QR Code Meja IGD',
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 14,
                              fontWeight: FontWeight.w700,
                              color: AppTheme.textMain,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            'Buka layar penuh untuk dipajang di meja loket IGD.',
                            style: GoogleFonts.inter(fontSize: 11, color: AppTheme.textMuted),
                          ),
                        ],
                      ),
                    ),
                    const Icon(LucideIcons.chevronRight, color: AppTheme.textMuted, size: 20),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(height: 12),

          // Action 2: Live Responses Feed
          Card(
            child: InkWell(
              borderRadius: BorderRadius.circular(20),
              onTap: () => context.push('/officer-live-feed'),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: const Color(0xFFFEF3C7),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: const Icon(LucideIcons.messageSquare, color: Color(0xFFB45309)),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Live Feed Respons Pasien',
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 14,
                              fontWeight: FontWeight.w700,
                              color: AppTheme.textMain,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            'Pantau ulasan & saran pasien IGD secara langsung.',
                            style: GoogleFonts.inter(fontSize: 11, color: AppTheme.textMuted),
                          ),
                        ],
                      ),
                    ),
                    const Icon(LucideIcons.chevronRight, color: AppTheme.textMuted, size: 20),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
