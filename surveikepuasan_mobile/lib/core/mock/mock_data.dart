import '../models/models.dart';

class MockData {
  static const List<HospitalModel> hospitals = [
    HospitalModel(
      id: 'hosp-001',
      code: 'RSUD-CIANJUR',
      name: 'RSUD Sayang Cianjur',
      city: 'Cianjur',
      address: 'Jl. Rumah Sakit No. 1, Bojongherang, Cianjur',
      phone: '(0263) 261026',
      averageScore: 84.6,
      totalResponses: 1420,
      unitCount: 11,
    ),
    HospitalModel(
      id: 'hosp-002',
      code: 'RSUD-KARAWANG',
      name: 'RSUD Kabupaten Karawang',
      city: 'Karawang',
      address: 'Jl. Galuh Mas Raya No. 1, Telukjambe Timur',
      phone: '(0267) 640118',
      averageScore: 82.1,
      totalResponses: 1890,
      unitCount: 14,
    ),
    HospitalModel(
      id: 'hosp-003',
      code: 'RSHS',
      name: 'RSUP Dr. Hasan Sadikin',
      city: 'Bandung',
      address: 'Jl. Pasteur No. 38, Sukajadi, Bandung',
      phone: '(022) 2034953',
      averageScore: 88.3,
      totalResponses: 3240,
      unitCount: 18,
    ),
  ];

  static const List<ServiceUnitModel> units = [
    ServiceUnitModel(
      id: 'unit-001',
      code: 'IGD',
      name: 'Instalasi Gawat Darurat (IGD)',
      description: 'Penanganan kegawatdaruratan medis 24 jam dengan triage terstandar.',
      averageScore: 86.4,
    ),
    ServiceUnitModel(
      id: 'unit-002',
      code: 'POLI-GIGI',
      name: 'Poli Gigi & Mulut',
      description: 'Pemeriksaan, perawatan konservasi, dan bedah mulut.',
      averageScore: 89.2,
    ),
    ServiceUnitModel(
      id: 'unit-003',
      code: 'FARMASI',
      name: 'Instalasi Farmasi & Depo Obat',
      description: 'Peracikan dan penyerahan obat resep rawat jalan.',
      averageScore: 76.5,
    ),
    ServiceUnitModel(
      id: 'unit-004',
      code: 'POLI-UMUM',
      name: 'Poli Rawat Jalan Umum',
      description: 'Pemeriksaan kesehatan dasar dan rujukan poliklinik spesialis.',
      averageScore: 83.1,
    ),
    ServiceUnitModel(
      id: 'unit-005',
      code: 'POLI-ANAK',
      name: 'Poli Spesialis Anak',
      description: 'Konsultasi dokter spesialis anak, tumbuh kembang, dan imunisasi.',
      averageScore: 88.0,
    ),
  ];

  static const List<SurveyQuestionModel> ikmQuestions = [
    SurveyQuestionModel(
      id: 'q-1',
      text: 'Bagaimana kemudahan informasi persyaratan dan alur pendaftaran yang Anda rasakan?',
    ),
    SurveyQuestionModel(
      id: 'q-2',
      text: 'Bagaimana kejelasan panduan dan arahan petugas terkait alur yang harus Anda lalui?',
    ),
    SurveyQuestionModel(
      id: 'q-3',
      text: 'Bagaimana ketepatan waktu pelayanan dokter/paramedis sesuai jadwal yang diinformasikan?',
    ),
    SurveyQuestionModel(
      id: 'q-4',
      text: 'Bagaimana kecepatan antrean penerimaan obat di depo farmasi?',
    ),
    SurveyQuestionModel(
      id: 'q-5',
      text: 'Bagaimana kesopanan, keramahan, dan empati petugas/perawat saat melayani Anda?',
    ),
    SurveyQuestionModel(
      id: 'q-6',
      text: 'Bagaimana kejelasan penjelasan dokter mengenai kondisi diagnosa dan resep obat?',
    ),
    SurveyQuestionModel(
      id: 'q-7',
      text: 'Bagaimana kenyamanan ruang tunggu, kebersihan toilet, dan pendingin ruangan di unit ini?',
    ),
  ];

  static List<SubmittedSurveyModel> initialHistory = [
    const SubmittedSurveyModel(
      code: 'RES-2025-001429',
      hospitalName: 'RSUD Sayang Cianjur',
      unitName: 'Instalasi Gawat Darurat (IGD)',
      date: '14 Maret 2025, 09:42',
      score: 92.5,
    ),
    const SubmittedSurveyModel(
      code: 'RES-2025-001427',
      hospitalName: 'RSUD Sayang Cianjur',
      unitName: 'Poli Gigi & Mulut',
      date: '14 Maret 2025, 08:50',
      score: 95.0,
    ),
  ];

  static const List<Map<String, dynamic>> officerLiveReviews = [
    {
      'code': 'RES-2025-001429',
      'text': 'Dokter jaga IGD sangat sigap dan ramah saat memeriksa demam anak saya.',
      'score': 92.5,
      'time': '5 menit lalu',
      'sentiment': 'POSITIF',
    },
    {
      'code': 'RES-2025-001423',
      'text': 'Perawat triage cepat tanggap memberikan kursi roda di pintu masuk.',
      'score': 88.0,
      'time': '18 menit lalu',
      'sentiment': 'POSITIF',
    },
    {
      'code': 'RES-2025-001419',
      'text': 'Ruang tunggu IGD agak dingin, tapi pelayanan dokter sangat memuaskan.',
      'score': 85.0,
      'time': '42 menit lalu',
      'sentiment': 'NETRAL',
    },
    {
      'code': 'RES-2025-001412',
      'text': 'Proses pendaftaran BPJS di loket IGD cukup lancar.',
      'score': 82.0,
      'time': '1 jam lalu',
      'sentiment': 'POSITIF',
    },
  ];
}
