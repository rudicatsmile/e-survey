import 'dart:io';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import '../models/models.dart';
import '../mock/mock_data.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;

  late final Dio dio;

  ApiService._internal() {
    String defaultUrl = 'http://localhost:3000/api/v1';
    if (!kIsWeb && Platform.isAndroid) {
      defaultUrl = 'http://127.0.0.1:3000/api/v1';
    }
    const envUrl = String.fromEnvironment('API_URL');
    final String baseUrl = envUrl.isNotEmpty ? envUrl : defaultUrl;

    dio = Dio(
      BaseOptions(
        baseUrl: baseUrl,
        connectTimeout: const Duration(seconds: 4),
        receiveTimeout: const Duration(seconds: 4),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    if (!kIsWeb && Platform.isAndroid) {
      dio.interceptors.add(
        InterceptorsWrapper(
          onError: (DioException err, handler) async {
            if (dio.options.baseUrl.contains('127.0.0.1')) {
              debugPrint('Retrying on LAN IP 192.168.100.128...');
              dio.options.baseUrl = 'http://192.168.100.128:3000/api/v1';
              final opts = Options(
                method: err.requestOptions.method,
                headers: err.requestOptions.headers,
              );
              try {
                final cloneReq = await dio.request(
                  err.requestOptions.path,
                  options: opts,
                  data: err.requestOptions.data,
                  queryParameters: err.requestOptions.queryParameters,
                );
                return handler.resolve(cloneReq);
              } catch (_) {
                return handler.next(err);
              }
            }
            return handler.next(err);
          },
        ),
      );
    }
  }

  void setBaseUrl(String url) {
    dio.options.baseUrl = url;
  }

  Future<List<HospitalModel>> getHospitals() async {
    try {
      final response = await dio.get('/hospitals');
      if (response.statusCode == 200 && response.data['success'] == true) {
        final list = response.data['data'] as List;
        return list.map((json) => HospitalModel.fromJson(json)).toList();
      }
    } catch (e) {
      debugPrint('ApiService getHospitals failed, falling back to mock: $e');
    }
    return MockData.hospitals;
  }

  Future<Map<String, dynamic>?> getActiveSurvey(String hospitalCode) async {
    try {
      final response = await dio.get('/hospitals/$hospitalCode/active-survey');
      if (response.statusCode == 200 && response.data['success'] == true) {
        return response.data['data'] as Map<String, dynamic>;
      }
    } catch (e) {
      debugPrint('ApiService getActiveSurvey failed, using mock data: $e');
    }
    return null;
  }

  Future<Map<String, dynamic>> submitSurvey({
    required String hospitalId,
    required String periodId,
    required String questionnaireId,
    required String unitId,
    required Map<String, dynamic> demographics,
    required List<Map<String, dynamic>> answers,
    String? reviewText,
  }) async {
    try {
      final response = await dio.post('/surveys/submit', data: {
        'hospitalId': hospitalId,
        'periodId': periodId,
        'questionnaireId': questionnaireId,
        'unitId': unitId,
        'demographics': demographics,
        'answers': answers,
        'reviewText': reviewText,
      });

      if (response.statusCode == 200 && response.data['success'] == true) {
        return response.data['data'] as Map<String, dynamic>;
      }
    } catch (e) {
      debugPrint('ApiService submitSurvey failed, generating offline code: $e');
    }

    // Offline / Fallback response
    final randomDigits = 100000 + (DateTime.now().millisecondsSinceEpoch % 900000);
    return {
      'respondentCode': 'RES-${DateTime.now().year}-$randomDigits',
      'overallScore': 92.5,
      'npsScore': 9,
      'submittedAt': DateTime.now().toIso8601String(),
    };
  }

  Future<Map<String, dynamic>?> loginPetugas(String email, String password) async {
    try {
      final response = await dio.post('/auth/login', data: {
        'email': email,
        'password': password,
      });

      if (response.statusCode == 200 && response.data['success'] == true) {
        return response.data['data'] as Map<String, dynamic>;
      }
    } catch (e) {
      debugPrint('ApiService loginPetugas failed: $e');
    }
    return null;
  }

  Future<Map<String, dynamic>?> getPetugasStats(String token) async {
    try {
      final response = await dio.get(
        '/petugas/stats',
        options: Options(headers: {'Authorization': 'Bearer $token'}),
      );
      if (response.statusCode == 200 && response.data['success'] == true) {
        return response.data['data'] as Map<String, dynamic>;
      }
    } catch (e) {
      debugPrint('ApiService getPetugasStats failed: $e');
    }
    return null;
  }

  Future<List<dynamic>?> getPetugasResponses(String token) async {
    try {
      final response = await dio.get(
        '/petugas/responses',
        options: Options(headers: {'Authorization': 'Bearer $token'}),
      );
      if (response.statusCode == 200 && response.data['success'] == true) {
        return response.data['data'] as List<dynamic>;
      }
    } catch (e) {
      debugPrint('ApiService getPetugasResponses failed: $e');
    }
    return null;
  }

  Future<bool> scanQr(String qrId) async {
    try {
      final response = await dio.post('/qr-codes/$qrId/scan');
      return response.statusCode == 200;
    } catch (e) {
      debugPrint('ApiService scanQr failed: $e');
      return false;
    }
  }
}
