import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../core/theme/app_theme.dart';
import '../../core/mock/mock_data.dart';
import '../../core/providers/survey_provider.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  String _searchQuery = '';

  @override
  Widget build(BuildContext context) {
    final filteredHospitals = MockData.hospitals.where((h) {
      return h.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          h.city.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          h.code.toLowerCase().contains(_searchQuery.toLowerCase());
    }).toList();

    return Scaffold(
      backgroundColor: AppTheme.backgroundLight,
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: AppTheme.primaryTeal,
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(LucideIcons.activity, color: Colors.white, size: 18),
            ),
            const SizedBox(width: 10),
            RichText(
              text: TextSpan(
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                  color: AppTheme.textMain,
                ),
                children: const [
                  TextSpan(text: 'Survei'),
                  TextSpan(
                    text: 'Kepuasan',
                    style: TextStyle(color: AppTheme.primaryTeal),
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.history, color: AppTheme.textMain),
            tooltip: 'Riwayat Survei',
            onPressed: () => context.push('/history'),
          ),
          IconButton(
            icon: const Icon(LucideIcons.user, color: AppTheme.textMain),
            tooltip: 'Mode Petugas',
            onPressed: () => context.push('/officer-login'),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        children: [
          // Big QR Scan Prompt Card
          GestureDetector(
            onTap: () => context.push('/qr-scanner'),
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppTheme.primaryTeal, AppTheme.primaryDark],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: AppTheme.primaryTeal.withValues(alpha: 0.3),
                    blurRadius: 18,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            'JALUR CEPAT',
                            style: GoogleFonts.inter(
                              color: Colors.white,
                              fontSize: 10,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 1,
                            ),
                          ),
                        ),
                        const SizedBox(height: 10),
                        Text(
                          'Pindai QR Code di Loket RS',
                          style: GoogleFonts.plusJakartaSans(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          'Arahkan kamera ke barcode meja IGD, Poli, atau Farmasi.',
                          style: GoogleFonts.inter(
                            color: Colors.white.withValues(alpha: 0.85),
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 12),
                  Container(
                    width: 56,
                    height: 56,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(18),
                    ),
                    child: const Icon(
                      LucideIcons.qrCode,
                      color: AppTheme.primaryTeal,
                      size: 30,
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 28),

          // Section Title
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Atau Pilih Rumah Sakit Manual',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: AppTheme.textMain,
                ),
              ),
              Text(
                '${filteredHospitals.length} RS Aktif',
                style: GoogleFonts.inter(
                  fontSize: 12,
                  color: AppTheme.textMuted,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Search Field
          TextField(
            onChanged: (val) => setState(() => _searchQuery = val),
            decoration: InputDecoration(
              hintText: 'Cari nama rumah sakit atau kota...',
              prefixIcon: const Icon(LucideIcons.search, size: 20, color: AppTheme.textMuted),
              suffixIcon: _searchQuery.isNotEmpty
                ? IconButton(
                    icon: const Icon(LucideIcons.x, size: 16),
                    onPressed: () => setState(() => _searchQuery = ''),
                  )
                : null,
            ),
          ),
          const SizedBox(height: 16),

          // Hospital List
          ...filteredHospitals.map((hosp) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: Card(
                child: InkWell(
                  borderRadius: BorderRadius.circular(20),
                  onTap: () {
                    ref.read(surveyProvider.notifier).selectHospital(hosp);
                    context.push('/hospital-detail');
                  },
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          width: 48,
                          height: 48,
                          decoration: BoxDecoration(
                            color: AppTheme.secondaryTeal,
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: const Icon(
                            LucideIcons.building,
                            color: AppTheme.primaryDark,
                            size: 24,
                          ),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Expanded(
                                    child: Text(
                                      hosp.name,
                                      style: GoogleFonts.plusJakartaSans(
                                        fontSize: 15,
                                        fontWeight: FontWeight.w700,
                                        color: AppTheme.textMain,
                                      ),
                                    ),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFDCFCE7),
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: Text(
                                      '${hosp.averageScore}',
                                      style: GoogleFonts.inter(
                                        color: const Color(0xFF15803D),
                                        fontSize: 11,
                                        fontWeight: FontWeight.w800,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 4),
                              Text(
                                '${hosp.city} • ${hosp.unitCount} Unit Layanan',
                                style: GoogleFonts.inter(
                                  fontSize: 12,
                                  color: AppTheme.textMuted,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                hosp.address,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
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
                  ),
                ),
              ),
            );
          }),
        ],
      ),
    );
  }
}
