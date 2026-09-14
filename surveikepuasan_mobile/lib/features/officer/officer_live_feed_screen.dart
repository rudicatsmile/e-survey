import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../core/theme/app_theme.dart';
import '../../core/mock/mock_data.dart';

class OfficerLiveFeedScreen extends StatefulWidget {
  const OfficerLiveFeedScreen({super.key});

  @override
  State<OfficerLiveFeedScreen> createState() => _OfficerLiveFeedScreenState();
}

class _OfficerLiveFeedScreenState extends State<OfficerLiveFeedScreen> {
  bool _isRefreshing = false;

  void _refresh() {
    setState(() => _isRefreshing = true);
    Future.delayed(const Duration(milliseconds: 600), () {
      if (mounted) {
        setState(() => _isRefreshing = false);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Feed respons IGD berhasil diperbarui.'),
            duration: Duration(seconds: 1),
          ),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundLight,
      appBar: AppBar(
        title: const Text('Live Feed Respons IGD'),
        actions: [
          IconButton(
            icon: Icon(
              LucideIcons.refreshCw,
              size: 20,
              color: _isRefreshing ? AppTheme.primaryTeal : AppTheme.textMain,
            ),
            onPressed: _refresh,
          ),
        ],
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(20),
        itemCount: MockData.officerLiveReviews.length,
        itemBuilder: (context, idx) {
          final item = MockData.officerLiveReviews[idx];
          final isPositive = item['sentiment'] == 'POSITIF';

          return Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Text(
                              item['code'],
                              style: GoogleFonts.plusJakartaSans(
                                fontWeight: FontWeight.w800,
                                fontSize: 12,
                                color: AppTheme.primaryDark,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              '• ${item['time']}',
                              style: GoogleFonts.inter(
                                fontSize: 11,
                                color: AppTheme.textMuted,
                              ),
                            ),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: isPositive
                                ? const Color(0xFFDCFCE7)
                                : const Color(0xFFFEF3C7),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            item['sentiment'],
                            style: GoogleFonts.inter(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: isPositive
                                  ? const Color(0xFF15803D)
                                  : const Color(0xFFB45309),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppTheme.backgroundLight,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        '“${item['text']}”',
                        style: GoogleFonts.inter(
                          fontSize: 12,
                          color: AppTheme.textMain,
                          height: 1.4,
                          fontStyle: FontStyle.italic,
                        ),
                      ),
                    ),
                    const SizedBox(height: 10),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        Text(
                          'Skor Diberikan: ',
                          style: GoogleFonts.inter(fontSize: 11, color: AppTheme.textMuted),
                        ),
                        Text(
                          '${item['score']} / 100',
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 12,
                            fontWeight: FontWeight.w800,
                            color: AppTheme.accentEmerald,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
