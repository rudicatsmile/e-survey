import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../core/theme/app_theme.dart';
import '../../core/mock/mock_data.dart';
import '../../core/providers/survey_provider.dart';

class QrScannerScreen extends ConsumerStatefulWidget {
  const QrScannerScreen({super.key});

  @override
  ConsumerState<QrScannerScreen> createState() => _QrScannerScreenState();
}

class _QrScannerScreenState extends ConsumerState<QrScannerScreen> {
  void _simulateScan(String unitCode) {
    final hospital = MockData.hospitals[0];
    final unit = MockData.units.firstWhere(
      (u) => u.code == unitCode,
      orElse: () => MockData.units[0],
    );

    ref.read(surveyProvider.notifier).selectHospital(hospital);
    ref.read(surveyProvider.notifier).selectUnit(unit);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('QR Code Terdeteksi: ${hospital.name} - ${unit.name}'),
        backgroundColor: AppTheme.primaryDark,
      ),
    );

    context.pushReplacement('/hospital-detail');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        foregroundColor: Colors.white,
        title: const Text('Pindai QR Code Unit'),
      ),
      body: Stack(
        children: [
          // Visual Camera Viewfinder Mockup
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: 260,
                  height: 260,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(28),
                    border: Border.all(color: AppTheme.primaryTeal, width: 3),
                  ),
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      Icon(
                        LucideIcons.qrCode,
                        size: 140,
                        color: Colors.white.withValues(alpha: 0.2),
                      ),
                      Container(
                        height: 2,
                        width: 220,
                        color: AppTheme.primaryTeal,
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                Text(
                  'Arahkan kamera ke QR Code di loket RS',
                  style: GoogleFonts.inter(
                    color: Colors.white70,
                    fontSize: 13,
                  ),
                ),
              ],
            ),
          ),

          // Bottom Bar for Demo Testing
          Positioned(
            left: 20,
            right: 20,
            bottom: 30,
            child: Column(
              children: [
                Text(
                  'TOMBOL SIMULASI SCANNER (DEMO):',
                  style: GoogleFonts.inter(
                    color: Colors.white54,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1,
                  ),
                ),
                const SizedBox(height: 10),
                ElevatedButton(
                  onPressed: () => _simulateScan('IGD'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primaryTeal,
                  ),
                  child: const Text('Simulasi Scan Barcode IGD'),
                ),
                const SizedBox(height: 8),
                OutlinedButton(
                  onPressed: () => _simulateScan('FARMASI'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.white,
                    side: const BorderSide(color: Colors.white38),
                  ),
                  child: const Text('Simulasi Scan Barcode Farmasi'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
