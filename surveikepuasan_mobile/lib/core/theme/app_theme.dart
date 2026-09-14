import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Brand Colors (PRD Bab 4)
  static const Color primaryTeal = Color(0xFF1CB09A);
  static const Color primaryDark = Color(0xFF0D9488);
  static const Color secondaryTeal = Color(0xFFE8F8F5);
  static const Color accentEmerald = Color(0xFF10B981);
  static const Color warningAmber = Color(0xFFF59E0B);
  static const Color dangerRose = Color(0xFFEF4444);
  static const Color backgroundLight = Color(0xFFF8FAFC);
  static const Color surfaceLight = Colors.white;
  static const Color borderLight = Color(0xFFE2E8F0);
  static const Color textMain = Color(0xFF0F172A);
  static const Color textMuted = Color(0xFF64748B);

  static ThemeData get lightTheme {
    final baseTextTheme = GoogleFonts.interTextTheme();
    final headingTextTheme = GoogleFonts.plusJakartaSansTextTheme();

    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.light(
        primary: primaryTeal,
        onPrimary: Colors.white,
        primaryContainer: secondaryTeal,
        onPrimaryContainer: primaryDark,
        secondary: primaryDark,
        surface: surfaceLight,
        error: dangerRose,
      ),
      scaffoldBackgroundColor: backgroundLight,
      textTheme: baseTextTheme.copyWith(
        displayLarge: headingTextTheme.displayLarge?.copyWith(
          color: textMain,
          fontWeight: FontWeight.w800,
        ),
        displayMedium: headingTextTheme.displayMedium?.copyWith(
          color: textMain,
          fontWeight: FontWeight.w700,
        ),
        titleLarge: headingTextTheme.titleLarge?.copyWith(
          color: textMain,
          fontWeight: FontWeight.w700,
        ),
        titleMedium: headingTextTheme.titleMedium?.copyWith(
          color: textMain,
          fontWeight: FontWeight.w600,
        ),
        bodyLarge: baseTextTheme.bodyLarge?.copyWith(color: textMain),
        bodyMedium: baseTextTheme.bodyMedium?.copyWith(color: textMuted),
        bodySmall: baseTextTheme.bodySmall?.copyWith(color: textMuted),
      ),
      cardTheme: CardThemeData(
        color: surfaceLight,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: borderLight, width: 1),
        ),
        margin: EdgeInsets.zero,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryTeal,
          foregroundColor: Colors.white,
          minimumSize: const Size.fromHeight(54),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          elevation: 0,
          textStyle: GoogleFonts.plusJakartaSans(
            fontSize: 15,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: textMain,
          minimumSize: const Size.fromHeight(50),
          side: const BorderSide(color: borderLight, width: 1),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          textStyle: GoogleFonts.plusJakartaSans(
            fontSize: 14,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: surfaceLight,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: borderLight),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: borderLight),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: primaryTeal, width: 2),
        ),
        hintStyle: const TextStyle(color: textMuted, fontSize: 13),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: surfaceLight,
        foregroundColor: textMain,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: false,
        titleTextStyle: GoogleFonts.plusJakartaSans(
          color: textMain,
          fontSize: 17,
          fontWeight: FontWeight.w700,
        ),
      ),
    );
  }
}
