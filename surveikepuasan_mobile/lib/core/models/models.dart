class HospitalModel {
  final String id;
  final String code;
  final String name;
  final String city;
  final String address;
  final String phone;
  final double averageScore;
  final int totalResponses;
  final int unitCount;

  const HospitalModel({
    required this.id,
    required this.code,
    required this.name,
    required this.city,
    required this.address,
    required this.phone,
    required this.averageScore,
    required this.totalResponses,
    required this.unitCount,
  });

  factory HospitalModel.fromJson(Map<String, dynamic> json) {
    return HospitalModel(
      id: json['id']?.toString() ?? '',
      code: json['code']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      city: json['city']?.toString() ?? '',
      address: json['address']?.toString() ?? '',
      phone: json['phone']?.toString() ?? '',
      averageScore: double.tryParse(json['averageScore']?.toString() ?? '88.5') ?? 88.5,
      totalResponses: int.tryParse(json['totalResponses']?.toString() ?? '150') ?? 150,
      unitCount: int.tryParse(json['totalUnits']?.toString() ?? json['unitCount']?.toString() ?? '10') ?? 10,
    );
  }
}

class ServiceUnitModel {
  final String id;
  final String code;
  final String name;
  final String description;
  final double averageScore;

  const ServiceUnitModel({
    required this.id,
    required this.code,
    required this.name,
    required this.description,
    required this.averageScore,
  });

  factory ServiceUnitModel.fromJson(Map<String, dynamic> json) {
    return ServiceUnitModel(
      id: json['id']?.toString() ?? '',
      code: json['code']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      description: json['description']?.toString() ?? '',
      averageScore: double.tryParse(json['averageScore']?.toString() ?? '4.5') ?? 4.5,
    );
  }
}

class SurveyQuestionModel {
  final String id;
  final String text;
  final String type; // LIKERT_5, LONG_TEXT
  final bool isRequired;

  const SurveyQuestionModel({
    required this.id,
    required this.text,
    this.type = 'LIKERT_5',
    this.isRequired = true,
  });

  factory SurveyQuestionModel.fromJson(Map<String, dynamic> json) {
    return SurveyQuestionModel(
      id: json['id']?.toString() ?? '',
      text: json['text']?.toString() ?? '',
      type: json['type']?.toString() ?? 'LIKERT_5',
      isRequired: json['isRequired'] == true || json['isRequired'] == 1,
    );
  }
}

class SubmittedSurveyModel {
  final String code;
  final String hospitalName;
  final String unitName;
  final String date;
  final double score;

  const SubmittedSurveyModel({
    required this.code,
    required this.hospitalName,
    required this.unitName,
    required this.date,
    required this.score,
  });

  factory SubmittedSurveyModel.fromJson(Map<String, dynamic> json) {
    return SubmittedSurveyModel(
      code: json['code']?.toString() ?? json['respondentCode']?.toString() ?? '',
      hospitalName: json['hospitalName']?.toString() ?? '',
      unitName: json['unitName']?.toString() ?? '',
      date: json['date']?.toString() ?? json['submittedAt']?.toString() ?? '',
      score: double.tryParse(json['score']?.toString() ?? json['overallScore']?.toString() ?? '0.0') ?? 0.0,
    );
  }

  Map<String, dynamic> toJson() => {
        'code': code,
        'hospitalName': hospitalName,
        'unitName': unitName,
        'date': date,
        'score': score,
      };
}

class PetugasProfileModel {
  final String id;
  final String email;
  final String fullName;
  final String role;
  final String? hospitalId;
  final String? hospitalName;
  final String? hospitalCode;
  final String? assignedUnitId;
  final String? assignedUnitName;

  const PetugasProfileModel({
    required this.id,
    required this.email,
    required this.fullName,
    required this.role,
    this.hospitalId,
    this.hospitalName,
    this.hospitalCode,
    this.assignedUnitId,
    this.assignedUnitName,
  });

  factory PetugasProfileModel.fromJson(Map<String, dynamic> json) {
    return PetugasProfileModel(
      id: json['id']?.toString() ?? '',
      email: json['email']?.toString() ?? '',
      fullName: json['fullName']?.toString() ?? '',
      role: json['role']?.toString() ?? '',
      hospitalId: json['hospitalId']?.toString(),
      hospitalName: json['hospitalName']?.toString(),
      hospitalCode: json['hospitalCode']?.toString(),
      assignedUnitId: json['assignedUnitId']?.toString(),
      assignedUnitName: json['assignedUnitName']?.toString(),
    );
  }
}
