import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/legacy.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/models.dart';
import '../mock/mock_data.dart';
import '../services/api_service.dart';

class SurveyState {
  final List<HospitalModel> hospitals;
  final HospitalModel? selectedHospital;
  final ServiceUnitModel? selectedUnit;
  final String ageRange;
  final String gender;
  final String education;
  final String occupation;
  final Map<String, int> answers; // questionId -> 1..5
  final String reviewText;
  final List<SubmittedSurveyModel> history;
  final bool isLoading;

  const SurveyState({
    this.hospitals = const [],
    this.selectedHospital,
    this.selectedUnit,
    this.ageRange = '26-35 tahun',
    this.gender = 'UNSPECIFIED',
    this.education = 'S1 / Sarjana',
    this.occupation = 'Karyawan Swasta',
    this.answers = const {},
    this.reviewText = '',
    this.history = const [],
    this.isLoading = false,
  });

  SurveyState copyWith({
    List<HospitalModel>? hospitals,
    HospitalModel? selectedHospital,
    ServiceUnitModel? selectedUnit,
    String? ageRange,
    String? gender,
    String? education,
    String? occupation,
    Map<String, int>? answers,
    String? reviewText,
    List<SubmittedSurveyModel>? history,
    bool? isLoading,
  }) {
    return SurveyState(
      hospitals: hospitals ?? this.hospitals,
      selectedHospital: selectedHospital ?? this.selectedHospital,
      selectedUnit: selectedUnit ?? this.selectedUnit,
      ageRange: ageRange ?? this.ageRange,
      gender: gender ?? this.gender,
      education: education ?? this.education,
      occupation: occupation ?? this.occupation,
      answers: answers ?? this.answers,
      reviewText: reviewText ?? this.reviewText,
      history: history ?? this.history,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

class SurveyNotifier extends StateNotifier<SurveyState> {
  SurveyNotifier()
      : super(SurveyState(
          hospitals: MockData.hospitals,
          selectedHospital: MockData.hospitals[0],
          selectedUnit: MockData.units[0],
          history: MockData.initialHistory,
        )) {
    initData();
  }

  Future<void> initData() async {
    await loadHistoryFromStorage();
    await loadHospitalsFromApi();
    await loadDraft();
  }

  Future<void> loadHospitalsFromApi() async {
    try {
      final list = await ApiService().getHospitals();
      if (list.isNotEmpty) {
        state = state.copyWith(
          hospitals: list,
          selectedHospital: state.selectedHospital ?? list.first,
        );
      }
    } catch (e) {
      debugPrint('Error loading hospitals: $e');
    }
  }

  void selectHospital(HospitalModel hospital) {
    state = state.copyWith(selectedHospital: hospital);
    saveDraft();
  }

  void selectUnit(ServiceUnitModel unit) {
    state = state.copyWith(selectedUnit: unit);
    saveDraft();
  }

  void setDemographics({
    String? ageRange,
    String? gender,
    String? education,
    String? occupation,
  }) {
    state = state.copyWith(
      ageRange: ageRange,
      gender: gender,
      education: education,
      occupation: occupation,
    );
    saveDraft();
  }

  void setAnswer(String questionId, int value) {
    final updated = Map<String, int>.from(state.answers);
    updated[questionId] = value;
    state = state.copyWith(answers: updated);
    saveDraft();
  }

  void setReviewText(String text) {
    state = state.copyWith(reviewText: text);
    saveDraft();
  }

  Future<void> saveDraft() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final draftMap = {
        'hospitalCode': state.selectedHospital?.code,
        'unitCode': state.selectedUnit?.code,
        'ageRange': state.ageRange,
        'gender': state.gender,
        'education': state.education,
        'occupation': state.occupation,
        'answers': state.answers,
        'reviewText': state.reviewText,
      };
      await prefs.setString('survey_draft', jsonEncode(draftMap));
    } catch (e) {
      debugPrint('Error saving draft: $e');
    }
  }

  Future<void> loadDraft() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final draftStr = prefs.getString('survey_draft');
      if (draftStr != null) {
        final Map<String, dynamic> data = jsonDecode(draftStr);
        final answersMap = (data['answers'] as Map<String, dynamic>?)?.map(
              (k, v) => MapEntry(k, (v as num).toInt()),
            ) ??
            {};

        state = state.copyWith(
          ageRange: data['ageRange'] ?? state.ageRange,
          gender: data['gender'] ?? state.gender,
          education: data['education'] ?? state.education,
          occupation: data['occupation'] ?? state.occupation,
          answers: answersMap.isNotEmpty ? answersMap : state.answers,
          reviewText: data['reviewText'] ?? state.reviewText,
        );
      }
    } catch (e) {
      debugPrint('Error loading draft: $e');
    }
  }

  Future<void> clearDraft() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove('survey_draft');
    } catch (e) {
      debugPrint('Error clearing draft: $e');
    }
  }

  Future<void> loadHistoryFromStorage() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final historyJson = prefs.getStringList('submitted_surveys_history');
      if (historyJson != null && historyJson.isNotEmpty) {
        final loaded = historyJson
            .map((s) => SubmittedSurveyModel.fromJson(jsonDecode(s)))
            .toList();
        state = state.copyWith(history: loaded);
      }
    } catch (e) {
      debugPrint('Error loading survey history: $e');
    }
  }

  Future<void> saveHistoryToStorage(List<SubmittedSurveyModel> list) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final jsonList = list.map((e) => jsonEncode(e.toJson())).toList();
      await prefs.setStringList('submitted_surveys_history', jsonList);
    } catch (e) {
      debugPrint('Error saving survey history: $e');
    }
  }

  Future<String> submitSurvey() async {
    state = state.copyWith(isLoading: true);

    final hospital = state.selectedHospital ?? MockData.hospitals[0];
    final unit = state.selectedUnit ?? MockData.units[0];

    // Format answers for API
    final answersList = state.answers.entries
        .map((e) => {
              'questionId': e.key,
              'likertValue': e.value,
            })
        .toList();

    final result = await ApiService().submitSurvey(
      hospitalId: hospital.id,
      periodId: 'period_cianjur_2025_t1',
      questionnaireId: 'quest_cianjur_ikm_14',
      unitId: unit.id,
      demographics: {
        'ageRange': state.ageRange,
        'gender': state.gender,
        'education': state.education,
        'occupation': state.occupation,
      },
      answers: answersList,
      reviewText: state.reviewText,
    );

    final auditCode = result['respondentCode'] ??
        'RES-${DateTime.now().year}-${100000 + (DateTime.now().millisecondsSinceEpoch % 900000)}';
    final score = (result['overallScore'] as num?)?.toDouble() ?? 90.0;

    final newEntry = SubmittedSurveyModel(
      code: auditCode,
      hospitalName: hospital.name,
      unitName: unit.name,
      date: '${DateTime.now().day} Mar ${DateTime.now().year}',
      score: double.parse(score.toStringAsFixed(1)),
    );

    final newHistory = [newEntry, ...state.history];
    state = state.copyWith(
      history: newHistory,
      answers: {},
      reviewText: '',
      isLoading: false,
    );

    await saveHistoryToStorage(newHistory);
    await clearDraft();

    return auditCode;
  }
}

final surveyProvider = StateNotifierProvider<SurveyNotifier, SurveyState>((ref) {
  return SurveyNotifier();
});

// Petugas / Officer Auth State
class OfficerState {
  final bool isAuthenticated;
  final String? token;
  final PetugasProfileModel? profile;
  final Map<String, dynamic>? stats;
  final List<dynamic>? responses;
  final bool isLoading;

  const OfficerState({
    this.isAuthenticated = false,
    this.token,
    this.profile,
    this.stats,
    this.responses,
    this.isLoading = false,
  });

  OfficerState copyWith({
    bool? isAuthenticated,
    String? token,
    PetugasProfileModel? profile,
    Map<String, dynamic>? stats,
    List<dynamic>? responses,
    bool? isLoading,
  }) {
    return OfficerState(
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      token: token ?? this.token,
      profile: profile ?? this.profile,
      stats: stats ?? this.stats,
      responses: responses ?? this.responses,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

class OfficerNotifier extends StateNotifier<OfficerState> {
  OfficerNotifier() : super(const OfficerState()) {
    checkSavedSession();
  }

  Future<void> checkSavedSession() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('officer_jwt_token');
      final profileStr = prefs.getString('officer_profile');

      if (token != null && profileStr != null) {
        final profile = PetugasProfileModel.fromJson(jsonDecode(profileStr));
        state = state.copyWith(
          isAuthenticated: true,
          token: token,
          profile: profile,
        );
        refreshDashboard();
      }
    } catch (e) {
      debugPrint('Error restoring officer session: $e');
    }
  }

  Future<bool> login(String email, String password) async {
    state = state.copyWith(isLoading: true);
    final data = await ApiService().loginPetugas(email, password);

    if (data != null && data['token'] != null) {
      final token = data['token'] as String;
      final userJson = data['user'] as Map<String, dynamic>;
      final profile = PetugasProfileModel.fromJson(userJson);

      state = state.copyWith(
        isAuthenticated: true,
        token: token,
        profile: profile,
        isLoading: false,
      );

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('officer_jwt_token', token);
      await prefs.setString('officer_profile', jsonEncode(userJson));

      await refreshDashboard();
      return true;
    }

    state = state.copyWith(isLoading: false);
    return false;
  }

  Future<void> refreshDashboard() async {
    if (state.token == null) return;
    try {
      final stats = await ApiService().getPetugasStats(state.token!);
      final responses = await ApiService().getPetugasResponses(state.token!);
      state = state.copyWith(stats: stats, responses: responses);
    } catch (e) {
      debugPrint('Error refreshing officer dashboard: $e');
    }
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('officer_jwt_token');
    await prefs.remove('officer_profile');
    state = const OfficerState();
  }
}

final officerProvider = StateNotifierProvider<OfficerNotifier, OfficerState>((ref) {
  return OfficerNotifier();
});
