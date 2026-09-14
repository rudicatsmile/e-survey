import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../core/theme/app_theme.dart';
import '../../core/providers/survey_provider.dart';

class OfficerLoginScreen extends ConsumerStatefulWidget {
  const OfficerLoginScreen({super.key});

  @override
  ConsumerState<OfficerLoginScreen> createState() => _OfficerLoginScreenState();
}

class _OfficerLoginScreenState extends ConsumerState<OfficerLoginScreen> {
  final _emailController = TextEditingController(text: 'petugas.igd@cianjur.go.id');
  final _passwordController = TextEditingController(text: 'Petugas123!');
  bool _isLoading = false;

  Future<void> _login() async {
    setState(() => _isLoading = true);
    final email = _emailController.text.trim();
    final pass = _passwordController.text.trim();

    final success = await ref.read(officerProvider.notifier).login(email, pass);

    if (mounted) {
      setState(() => _isLoading = false);
      if (success) {
        context.go('/officer-dashboard');
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Login gagal. Periksa kembali email dan kata sandi Anda.'),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    }
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('Login Petugas Survei'),
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          children: [
            const SizedBox(height: 10),
            Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                color: AppTheme.secondaryTeal,
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Icon(
                LucideIcons.userCheck,
                color: AppTheme.primaryDark,
                size: 32,
              ),
            ),
            const SizedBox(height: 20),
            Text(
              'Akses Petugas Lapangan',
              style: GoogleFonts.plusJakartaSans(
                fontSize: 22,
                fontWeight: FontWeight.w800,
                color: AppTheme.textMain,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'Masuk untuk menampilkan QR Code meja dan memantau live responses di unit Anda.',
              style: GoogleFonts.inter(fontSize: 12, color: AppTheme.textMuted),
            ),
            const SizedBox(height: 28),

            TextField(
              controller: _emailController,
              decoration: const InputDecoration(
                labelText: 'Email Petugas',
                prefixIcon: Icon(LucideIcons.mail, size: 20),
              ),
            ),
            const SizedBox(height: 16),

            TextField(
              controller: _passwordController,
              obscureText: true,
              decoration: const InputDecoration(
                labelText: 'Kata Sandi',
                prefixIcon: Icon(LucideIcons.lock, size: 20),
              ),
            ),
            const SizedBox(height: 24),

            ElevatedButton(
              onPressed: _isLoading ? null : _login,
              child: _isLoading
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                    )
                  : const Text('Masuk Sebagai Petugas'),
            ),
            const SizedBox(height: 24),

            // Demo Shortcut
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppTheme.backgroundLight,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.borderLight),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'AKUN PETUGAS DATABASE MYSQL:',
                    style: GoogleFonts.inter(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.textMuted,
                      letterSpacing: 1,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Budi Santoso, A.Md.Kep\nUnit: Instalasi Gawat Darurat (RSUD Sayang Cianjur)\nEmail: petugas.igd@cianjur.go.id',
                    style: GoogleFonts.inter(fontSize: 11, color: AppTheme.textMain),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
