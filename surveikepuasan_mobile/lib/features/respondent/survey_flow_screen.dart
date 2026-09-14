import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../core/theme/app_theme.dart';
import '../../core/mock/mock_data.dart';
import '../../core/providers/survey_provider.dart';

class SurveyFlowScreen extends ConsumerStatefulWidget {
  const SurveyFlowScreen({super.key});

  @override
  ConsumerState<SurveyFlowScreen> createState() => _SurveyFlowScreenState();
}

class _SurveyFlowScreenState extends ConsumerState<SurveyFlowScreen> {
  final PageController _pageController = PageController();
  int _currentStep = 0;
  final int _totalSteps = 4;

  final TextEditingController _reviewController = TextEditingController(
    text: 'Pelayanan dokter sangat sigap dan ramah. Terima kasih atas kesabarannya.',
  );

  @override
  void dispose() {
    _pageController.dispose();
    _reviewController.dispose();
    super.dispose();
  }

  void _nextPage() {
    if (_currentStep < _totalSteps - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }

  void _prevPage() {
    if (_currentStep > 0) {
      _pageController.previousPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }

  Future<void> _submit() async {
    ref.read(surveyProvider.notifier).setReviewText(_reviewController.text);
    final auditCode = await ref.read(surveyProvider.notifier).submitSurvey();
    if (mounted) {
      context.go('/survey-success?code=$auditCode');
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(surveyProvider);
    final hospital = state.selectedHospital ?? MockData.hospitals[0];

    return Scaffold(
      backgroundColor: AppTheme.backgroundLight,
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              hospital.name,
              style: GoogleFonts.plusJakartaSans(fontSize: 14, fontWeight: FontWeight.bold),
            ),
            Text(
              'Langkah ${_currentStep + 1} dari $_totalSteps',
              style: GoogleFonts.inter(fontSize: 11, color: AppTheme.textMuted),
            ),
          ],
        ),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(4),
          child: LinearProgressIndicator(
            value: (_currentStep + 1) / _totalSteps,
            backgroundColor: AppTheme.borderLight,
            valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.primaryTeal),
          ),
        ),
      ),
      body: PageView(
        controller: _pageController,
        physics: const NeverScrollableScrollPhysics(),
        onPageChanged: (idx) => setState(() => _currentStep = idx),
        children: [
          // STEP 1: DEMOGRAFI OPSIONAL
          _buildDemographicsStep(state),

          // STEP 2: PILIH UNIT LAYANAN
          _buildUnitStep(state),

          // STEP 3: LIKERT QUESTIONS
          _buildLikertStep(state),

          // STEP 4: ULASAN & SUBMIT
          _buildReviewStep(state),
        ],
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(16),
        decoration: const BoxDecoration(
          color: Colors.white,
          border: Border(top: BorderSide(color: AppTheme.borderLight)),
        ),
        child: Row(
          children: [
            if (_currentStep > 0) ...[
              Expanded(
                flex: 1,
                child: OutlinedButton(
                  onPressed: _prevPage,
                  child: const Text('Kembali'),
                ),
              ),
              const SizedBox(width: 12),
            ],
            Expanded(
              flex: 2,
              child: ElevatedButton(
                onPressed: _currentStep == _totalSteps - 1 ? _submit : _nextPage,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(_currentStep == _totalSteps - 1 ? 'Kirim Survei' : 'Lanjutkan'),
                    const SizedBox(width: 6),
                    Icon(
                      _currentStep == _totalSteps - 1 ? LucideIcons.send : LucideIcons.chevronRight,
                      size: 16,
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // -------------------------------------------------------------
  // STEP 1: DEMOGRAFI
  // -------------------------------------------------------------
  Widget _buildDemographicsStep(SurveyState state) {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Text(
          'Profil Responden (Opsional)',
          style: GoogleFonts.plusJakartaSans(
            fontSize: 20,
            fontWeight: FontWeight.w800,
            color: AppTheme.textMain,
          ),
        ),
        const SizedBox(height: 6),
        Text(
          'Data demografi membantu evaluasi pelayanan tanpa mencatat identitas nama Anda.',
          style: GoogleFonts.inter(fontSize: 12, color: AppTheme.textMuted),
        ),
        const SizedBox(height: 24),

        // Usia
        _buildSectionLabel('Kelompok Usia Anda:'),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: ['< 17 tahun', '17-25 tahun', '26-35 tahun', '36-45 tahun', '46-55 tahun', '> 55 tahun']
              .map((age) {
            final isSelected = state.ageRange == age;
            return ChoiceChip(
              label: Text(age),
              selected: isSelected,
              selectedColor: AppTheme.secondaryTeal,
              labelStyle: TextStyle(
                color: isSelected ? AppTheme.primaryDark : AppTheme.textMain,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                fontSize: 12,
              ),
              onSelected: (_) => ref.read(surveyProvider.notifier).setDemographics(ageRange: age),
            );
          }).toList(),
        ),
        const SizedBox(height: 20),

        // Jenis Kelamin
        _buildSectionLabel('Jenis Kelamin:'),
        Wrap(
          spacing: 8,
          children: [
            {'k': 'MALE', 'l': 'Laki-laki'},
            {'k': 'FEMALE', 'l': 'Perempuan'},
            {'k': 'UNSPECIFIED', 'l': 'Tidak Mengisi'},
          ].map((item) {
            final isSelected = state.gender == item['k'];
            return ChoiceChip(
              label: Text(item['l']!),
              selected: isSelected,
              selectedColor: AppTheme.secondaryTeal,
              labelStyle: TextStyle(
                color: isSelected ? AppTheme.primaryDark : AppTheme.textMain,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                fontSize: 12,
              ),
              onSelected: (_) => ref.read(surveyProvider.notifier).setDemographics(gender: item['k']),
            );
          }).toList(),
        ),
        const SizedBox(height: 20),

        // Pendidikan
        _buildSectionLabel('Pendidikan Terakhir:'),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: ['SD / SMP', 'SMA / SMK', 'Diploma / D3', 'S1 / Sarjana', 'S2 / Pasca']
              .map((edu) {
            final isSelected = state.education == edu;
            return ChoiceChip(
              label: Text(edu),
              selected: isSelected,
              selectedColor: AppTheme.secondaryTeal,
              labelStyle: TextStyle(
                color: isSelected ? AppTheme.primaryDark : AppTheme.textMain,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                fontSize: 12,
              ),
              onSelected: (_) => ref.read(surveyProvider.notifier).setDemographics(education: edu),
            );
          }).toList(),
        ),
      ],
    );
  }

  // -------------------------------------------------------------
  // STEP 2: UNIT LAYANAN
  // -------------------------------------------------------------
  Widget _buildUnitStep(SurveyState state) {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Text(
          'Pilih Unit Layanan yang Dikunjungi',
          style: GoogleFonts.plusJakartaSans(
            fontSize: 20,
            fontWeight: FontWeight.w800,
            color: AppTheme.textMain,
          ),
        ),
        const SizedBox(height: 6),
        Text(
          'Pilih bagian rumah sakit tempat Anda menerima pelayanan hari ini.',
          style: GoogleFonts.inter(fontSize: 12, color: AppTheme.textMuted),
        ),
        const SizedBox(height: 20),
        ...MockData.units.map((unit) {
          final isSelected = state.selectedUnit?.code == unit.code;
          return Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: Card(
              color: isSelected ? AppTheme.secondaryTeal : Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: BorderSide(
                  color: isSelected ? AppTheme.primaryTeal : AppTheme.borderLight,
                  width: isSelected ? 2 : 1,
                ),
              ),
              child: ListTile(
                title: Text(
                  unit.name,
                  style: GoogleFonts.plusJakartaSans(
                    fontWeight: FontWeight.w700,
                    fontSize: 14,
                    color: isSelected ? AppTheme.primaryDark : AppTheme.textMain,
                  ),
                ),
                subtitle: Text(
                  unit.description,
                  style: GoogleFonts.inter(fontSize: 11, color: AppTheme.textMuted),
                ),
                trailing: isSelected
                    ? const Icon(LucideIcons.checkCircle2, color: AppTheme.primaryTeal)
                    : null,
                onTap: () => ref.read(surveyProvider.notifier).selectUnit(unit),
              ),
            ),
          );
        }),
      ],
    );
  }

  // -------------------------------------------------------------
  // STEP 3: LIKERT QUESTIONS
  // -------------------------------------------------------------
  Widget _buildLikertStep(SurveyState state) {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Text(
          'Penilaian Mutu Pelayanan',
          style: GoogleFonts.plusJakartaSans(
            fontSize: 20,
            fontWeight: FontWeight.w800,
            color: AppTheme.textMain,
          ),
        ),
        const SizedBox(height: 6),
        Text(
          'Berikan bintang 1 (Sangat Tidak Puas) sampai 5 (Sangat Puas).',
          style: GoogleFonts.inter(fontSize: 12, color: AppTheme.textMuted),
        ),
        const SizedBox(height: 20),

        ...MockData.ikmQuestions.asMap().entries.map((entry) {
          final idx = entry.key;
          final q = entry.value;
          final selectedVal = state.answers[q.id] ?? 4;

          return Card(
            margin: const EdgeInsets.only(bottom: 16),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        width: 24,
                        height: 24,
                        decoration: BoxDecoration(
                          color: AppTheme.secondaryTeal,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Center(
                          child: Text(
                            '${idx + 1}',
                            style: GoogleFonts.plusJakartaSans(
                              fontWeight: FontWeight.bold,
                              fontSize: 11,
                              color: AppTheme.primaryDark,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          q.text,
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 13,
                            fontWeight: FontWeight.w700,
                            color: AppTheme.textMain,
                            height: 1.3,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),

                  // 5 buttons rating
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [1, 2, 3, 4, 5].map((val) {
                      final isChosen = selectedVal == val;
                      return GestureDetector(
                        onTap: () => ref.read(surveyProvider.notifier).setAnswer(q.id, val),
                        child: Container(
                          width: 52,
                          height: 52,
                          decoration: BoxDecoration(
                            color: isChosen ? AppTheme.primaryTeal : AppTheme.backgroundLight,
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(
                              color: isChosen ? AppTheme.primaryTeal : AppTheme.borderLight,
                            ),
                          ),
                          child: Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  '$val',
                                  style: GoogleFonts.plusJakartaSans(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w800,
                                    color: isChosen ? Colors.white : AppTheme.textMain,
                                  ),
                                ),
                                Icon(
                                  LucideIcons.star,
                                  size: 11,
                                  color: isChosen ? Colors.white : AppTheme.textMuted,
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ],
              ),
            ),
          );
        }),
      ],
    );
  }

  // -------------------------------------------------------------
  // STEP 4: ULASAN & SUBMIT
  // -------------------------------------------------------------
  Widget _buildReviewStep(SurveyState state) {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Text(
          'Saran & Masukan Terbuka',
          style: GoogleFonts.plusJakartaSans(
            fontSize: 20,
            fontWeight: FontWeight.w800,
            color: AppTheme.textMain,
          ),
        ),
        const SizedBox(height: 6),
        Text(
          'Tuliskan saran konkret atau keluhan yang Anda alami untuk perbaikan rumah sakit.',
          style: GoogleFonts.inter(fontSize: 12, color: AppTheme.textMuted),
        ),
        const SizedBox(height: 20),

        TextField(
          controller: _reviewController,
          maxLines: 5,
          decoration: const InputDecoration(
            hintText: 'Tuliskan ulasan Anda di sini...',
          ),
        ),
        const SizedBox(height: 20),

        // Summary Card
        Card(
          color: AppTheme.secondaryTeal,
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(LucideIcons.shieldCheck, color: AppTheme.primaryDark, size: 18),
                    const SizedBox(width: 8),
                    Text(
                      'Konfirmasi Pengiriman',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: AppTheme.primaryDark,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  'Unit: ${state.selectedUnit?.name ?? 'IGD'}\nTotal 7 Pertanyaan IKM Terjawab\nIdentitas Anda 100% anonim.',
                  style: GoogleFonts.inter(fontSize: 12, color: AppTheme.primaryDark, height: 1.4),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSectionLabel(String label) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Text(
        label,
        style: GoogleFonts.plusJakartaSans(
          fontSize: 13,
          fontWeight: FontWeight.w700,
          color: AppTheme.textMain,
        ),
      ),
    );
  }
}
