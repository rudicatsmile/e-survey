export interface Hospital {
  id: string;
  code: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  logoUrl: string;
  description: string;
  isActive: boolean;
  totalResponses: number;
  averageScore: number;
  unitCount: number;
}

export interface ServiceUnit {
  id: string;
  hospitalId: string;
  code: string;
  name: string;
  description: string;
  isActive: boolean;
  averageScore: number;
  totalResponses: number;
}

export interface SurveyPeriod {
  id: string;
  hospitalId: string;
  name: string;
  startDate: string;
  endDate: string;
  status: "DRAFT" | "ACTIVE" | "CLOSED";
  questionnaireTitle: string;
  totalResponses: number;
  targetResponses: number;
  averageScore: number;
}

export interface QuestionCategory {
  id: string;
  name: string;
  weight: number;
  orderIndex: number;
}

export interface Question {
  id: string;
  categoryId: string;
  text: string;
  type: "LIKERT_5" | "MULTIPLE_CHOICE" | "SHORT_TEXT" | "LONG_TEXT";
  options?: string[];
  isRequired: boolean;
  weight: number;
  orderIndex: number;
}

export interface Questionnaire {
  id: string;
  hospitalId: string;
  title: string;
  description: string;
  version: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt?: string;
  categories: QuestionCategory[];
  questions: Question[];
  totalQuestions: number;
}

export interface Respondent {
  id: string;
  code: string; // RES-2025-xxxxxx
  hospitalId: string;
  periodId: string;
  unitId: string;
  unitName: string;
  ageRange: string;
  gender: "MALE" | "FEMALE" | "UNSPECIFIED";
  education: string;
  occupation: string;
  submittedAt: string;
  score: number;
  reviewSnippet?: string;
}

export interface SurveyResponseItem {
  id: string;
  hospitalId: string;
  respondentCode: string;
  unitName: string;
  submittedAt: string;
  overallScore: number;
  npsScore: number;
  answers: {
    questionText: string;
    answerValue: number | string;
    categoryName: string;
  }[];
  reviewText: string;
  sentiment: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
  keywords: string[];
}

export interface HistoryLog {
  id: number;
  hospitalId: string;
  hospitalName: string;
  actorName: string;
  actorRole: string;
  entityType: "QUESTIONNAIRE" | "PERIOD" | "UNIT" | "HOSPITAL" | "USER" | "QRCODE";
  entityId: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "PUBLISH" | "CLOSE" | "ARCHIVE" | "ACTIVATE";
  notes?: string;
  beforeJson?: Record<string, unknown>;
  afterJson?: Record<string, unknown>;
  ipAddress: string;
  createdAt: string;
}

export interface SystemUser {
  id: string;
  fullName: string;
  email: string;
  role: "SUPER_ADMIN" | "HOSPITAL_ADMIN" | "FIELD_OFFICER";
  hospitalId?: string;
  hospitalName?: string;
  assignedUnitId?: string;
  assignedUnitName?: string;
  isActive: boolean;
  lastLoginAt: string;
}

// -------------------------------------------------------------
// DUMMY HOSPITALS
// -------------------------------------------------------------
export const DUMMY_HOSPITALS: Hospital[] = [
  {
    id: "hosp-001",
    code: "RSUD-CIANJUR",
    name: "RSUD Sayang Cianjur",
    city: "Cianjur",
    address: "Jl. Rumah Sakit No. 1, Bojongherang, Kec. Cianjur, Kab. Cianjur",
    phone: "(0263) 261026",
    email: "kontak@rsudsayang.cianjurkab.go.id",
    logoUrl: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=128&auto=format&fit=crop&q=80",
    description: "Rumah Sakit Umum Daerah Tipe B rujukan utama pelayanan kesehatan masyarakat Kabupaten Cianjur.",
    isActive: true,
    totalResponses: 1420,
    averageScore: 84.6,
    unitCount: 11,
  },
  {
    id: "hosp-002",
    code: "RSUD-KARAWANG",
    name: "RSUD Kabupaten Karawang",
    city: "Karawang",
    address: "Jl. Galuh Mas Raya No. 1, Sukaharja, Telukjambe Timur, Karawang",
    phone: "(0267) 640118",
    email: "info@rsudkarawang.id",
    logoUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=128&auto=format&fit=crop&q=80",
    description: "Pusat rujukan medik modern terakreditasi Paripurna di wilayah Pantai Utara Jawa Barat.",
    isActive: true,
    totalResponses: 1890,
    averageScore: 82.1,
    unitCount: 14,
  },
  {
    id: "hosp-003",
    code: "RSHS",
    name: "RSUP Dr. Hasan Sadikin",
    city: "Bandung",
    address: "Jl. Pasteur No. 38, Pasteur, Sukajadi, Kota Bandung",
    phone: "(022) 2034953",
    email: "humas@rshs.or.id",
    logoUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=128&auto=format&fit=crop&q=80",
    description: "Rumah sakit rujukan nasional Tipe A pusat pendidikan kedokteran terkemuka di Indonesia.",
    isActive: true,
    totalResponses: 3240,
    averageScore: 88.3,
    unitCount: 18,
  },
  {
    id: "hosp-004",
    code: "RSUD-BANDUNG",
    name: "RSUD Kota Bandung (Ujungberung)",
    city: "Bandung",
    address: "Jl. Rumah Sakit No. 22, Pakemitan, Cinambo, Kota Bandung",
    phone: "(022) 7811794",
    email: "rsudkotabandung@gmail.com",
    logoUrl: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=128&auto=format&fit=crop&q=80",
    description: "Fasilitas kesehatan ramah keluarga dengan standar pelayanan mutu unggul di Bandung Timur.",
    isActive: true,
    totalResponses: 980,
    averageScore: 81.4,
    unitCount: 10,
  },
  {
    id: "hosp-005",
    code: "SILOAM-SMG",
    name: "RS Siloam Semanggi",
    city: "Jakarta Selatan",
    address: "Garnisun Dalam No. 2-3, Karet Semanggi, Setiabudi, Jakarta Selatan",
    phone: "(021) 29962888",
    email: "customer.care@siloamhospitals.com",
    logoUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=128&auto=format&fit=crop&q=80",
    description: "Pusat rujukan onkologi dan layanan spesialis terintegrasi berstandar internasional.",
    isActive: true,
    totalResponses: 1650,
    averageScore: 91.2,
    unitCount: 15,
  },
];

// -------------------------------------------------------------
// DUMMY SERVICE UNITS (RSUD-CIANJUR)
// -------------------------------------------------------------
export const DUMMY_UNITS: ServiceUnit[] = [
  {
    id: "unit-001",
    hospitalId: "hosp-001",
    code: "IGD",
    name: "Instalasi Gawat Darurat (IGD)",
    description: "Penanganan kegawatdaruratan medis 24 jam dengan triage terstandar.",
    isActive: true,
    averageScore: 86.4,
    totalResponses: 380,
  },
  {
    id: "unit-002",
    hospitalId: "hosp-001",
    code: "POLI-GIGI",
    name: "Poli Gigi & Mulut",
    description: "Pelayanan kuratif, konservasi, dan bedah mulut rawat jalan.",
    isActive: true,
    averageScore: 89.2,
    totalResponses: 210,
  },
  {
    id: "unit-003",
    hospitalId: "hosp-001",
    code: "FARMASI",
    name: "Instalasi Farmasi & Depo Obat",
    description: "Peracikan dan penyerahan obat rawat jalan dan rawat inap.",
    isActive: true,
    averageScore: 76.5,
    totalResponses: 450,
  },
  {
    id: "unit-004",
    hospitalId: "hosp-001",
    code: "POLI-UMUM",
    name: "Poli Rawat Jalan Umum",
    description: "Pemeriksaan kesehatan dasar dan skrining penyakit umum.",
    isActive: true,
    averageScore: 83.1,
    totalResponses: 320,
  },
  {
    id: "unit-005",
    hospitalId: "hosp-001",
    code: "POLI-ANAK",
    name: "Poli Spesialis Anak & Tumbuh Kembang",
    description: "Konsultasi spesialis anak, imunisasi, dan nutrisi pediatrik.",
    isActive: true,
    averageScore: 88.0,
    totalResponses: 195,
  },
  {
    id: "unit-006",
    hospitalId: "hosp-001",
    code: "LAB",
    name: "Laboratorium Patologi Klinik",
    description: "Pemeriksaan darah lengkap, kimia darah, dan urin 24 jam.",
    isActive: true,
    averageScore: 85.3,
    totalResponses: 240,
  },
  {
    id: "unit-007",
    hospitalId: "hosp-001",
    code: "RAD",
    name: "Instalasi Radiologi (Rontgen & CT-Scan)",
    description: "Layanan diagnostik imaging medis.",
    isActive: true,
    averageScore: 84.7,
    totalResponses: 160,
  },
  {
    id: "unit-008",
    hospitalId: "hosp-001",
    code: "RANAP-3",
    name: "Rawat Inap Kelas III (Kresna)",
    description: "Fasilitas perawatan rawat inap kelas dasar terintegrasi BPJS.",
    isActive: true,
    averageScore: 79.8,
    totalResponses: 180,
  },
  {
    id: "unit-009",
    hospitalId: "hosp-001",
    code: "LOKET-ADM",
    name: "Loket Pendaftaran & Administrasi BPJS",
    description: "Pendaftaran pasien mandiri dan verifikasi jaminan.",
    isActive: true,
    averageScore: 78.2,
    totalResponses: 510,
  },
];

// -------------------------------------------------------------
// DUMMY PERIODS
// -------------------------------------------------------------
export const DUMMY_PERIODS: SurveyPeriod[] = [
  {
    id: "per-001",
    hospitalId: "hosp-001",
    name: "Triwulan I 2025 (Januari - Maret 2025)",
    startDate: "2025-01-01",
    endDate: "2025-03-31",
    status: "ACTIVE",
    questionnaireTitle: "Kuesioner Indeks Kepuasan Masyarakat (IKM PermenPANRB)",
    totalResponses: 842,
    targetResponses: 1000,
    averageScore: 84.6,
  },
  {
    id: "per-002",
    hospitalId: "hosp-001",
    name: "Semester II 2024 (Juli - Desember 2024)",
    startDate: "2024-07-01",
    endDate: "2024-12-31",
    status: "CLOSED",
    questionnaireTitle: "Kuesioner Pelayanan Prima RSUD Sayang 2024",
    totalResponses: 1840,
    targetResponses: 1500,
    averageScore: 82.9,
  },
  {
    id: "per-003",
    hospitalId: "hosp-001",
    name: "Evaluasi Pasca-Renovasi Farmasi & IGD 2025",
    startDate: "2025-04-01",
    endDate: "2025-05-31",
    status: "DRAFT",
    questionnaireTitle: "Survei Khusus Waktu Tunggu Layanan Obat & IGD",
    totalResponses: 0,
    targetResponses: 500,
    averageScore: 0,
  },
];

// -------------------------------------------------------------
// DUMMY QUESTIONNAIRE & QUESTIONS (IKM PermenPANRB 14 Unsur)
// -------------------------------------------------------------
export const DUMMY_QUESTIONNAIRES: Questionnaire[] = [
  {
    id: "quest-001",
    hospitalId: "hosp-001",
    title: "Kuesioner Indeks Kepuasan Masyarakat (IKM PermenPANRB No. 14 Tahun 2017)",
    description: "Survei resmi kepuasan masyarakat terhadap mutu penyelenggaraan pelayanan publik di lingkungan RSUD Sayang Cianjur.",
    version: 2,
    status: "PUBLISHED",
    publishedAt: "2025-01-01T08:00:00Z",
    totalQuestions: 9,
    categories: [
      { id: "cat-1", name: "Persyaratan & Prosedur", weight: 1.0, orderIndex: 1 },
      { id: "cat-2", name: "Kecepatan Waktu Pelayanan", weight: 1.2, orderIndex: 2 },
      { id: "cat-3", name: "Kompetensi & Keramahan Petugas", weight: 1.0, orderIndex: 3 },
      { id: "cat-4", name: "Kualitas Sarana & Prasarana", weight: 0.8, orderIndex: 4 },
      { id: "cat-5", name: "Penanganan Pengaduan & Saran", weight: 1.0, orderIndex: 5 },
    ],
    questions: [
      {
        id: "q-1",
        categoryId: "cat-1",
        text: "Bagaimana kemudahan informasi persyaratan dan alur pendaftaran layanan yang Anda rasakan?",
        type: "LIKERT_5",
        isRequired: true,
        weight: 1.0,
        orderIndex: 1,
      },
      {
        id: "q-2",
        categoryId: "cat-1",
        text: "Bagaimana kejelasan panduan dan arahan petugas terkait prosedur yang harus Anda lalui?",
        type: "LIKERT_5",
        isRequired: true,
        weight: 1.0,
        orderIndex: 2,
      },
      {
        id: "q-3",
        categoryId: "cat-2",
        text: "Bagaimana ketepatan waktu pelayanan dokter/paramedis sesuai jadwal yang diinformasikan?",
        type: "LIKERT_5",
        isRequired: true,
        weight: 1.2,
        orderIndex: 3,
      },
      {
        id: "q-4",
        categoryId: "cat-2",
        text: "Bagaimana kecepatan antrean penerimaan obat di depo farmasi?",
        type: "LIKERT_5",
        isRequired: true,
        weight: 1.2,
        orderIndex: 4,
      },
      {
        id: "q-5",
        categoryId: "cat-3",
        text: "Bagaimana kesopanan, keramahan, dan empati petugas/perawat saat melayani Anda?",
        type: "LIKERT_5",
        isRequired: true,
        weight: 1.0,
        orderIndex: 5,
      },
      {
        id: "q-6",
        categoryId: "cat-3",
        text: "Bagaimana kejelasan penjelasan dokter mengenai diagnosa penyakit dan rencana tindakan?",
        type: "LIKERT_5",
        isRequired: true,
        weight: 1.0,
        orderIndex: 6,
      },
      {
        id: "q-7",
        categoryId: "cat-4",
        text: "Bagaimana kenyamanan ruang tunggu, kebersihan toilet, dan pendingin ruangan di unit ini?",
        type: "LIKERT_5",
        isRequired: true,
        weight: 0.8,
        orderIndex: 7,
      },
      {
        id: "q-8",
        categoryId: "cat-4",
        text: "Fasilitas apa yang paling Anda harapkan untuk ditingkatkan di rumah sakit ini?",
        type: "MULTIPLE_CHOICE",
        options: [
          "Ruang tunggu & tempat duduk",
          "Kesejukan AC & ventilasi",
          "Kebersihan toilet umum",
          "Ketersediaan air minum gratis",
          "Petunjuk arah/signage digital",
        ],
        isRequired: false,
        weight: 0.5,
        orderIndex: 8,
      },
      {
        id: "q-9",
        categoryId: "cat-5",
        text: "Tuliskan saran konkret atau keluhan yang Anda alami untuk perbaikan layanan kami ke depan:",
        type: "LONG_TEXT",
        isRequired: false,
        weight: 1.0,
        orderIndex: 9,
      },
    ],
  },
  {
    id: "quest-002",
    hospitalId: "hosp-001",
    title: "Survei Khusus Evaluasi Layanan Rawat Inap & Gizi",
    description: "Kuesioner periodik untuk pasien pasca rawat inap mengenai kepuasan asuhan keperawatan dan makanan rumah sakit.",
    version: 1,
    status: "DRAFT",
    totalQuestions: 6,
    categories: [
      { id: "cat-201", name: "Kenyamanan Kamar", weight: 1.0, orderIndex: 1 },
      { id: "cat-202", name: "Menu Gizi & Makanan", weight: 1.0, orderIndex: 2 },
    ],
    questions: [
      {
        id: "q-201",
        categoryId: "cat-201",
        text: "Bagaimana ketenangan dan kebersihan kamar rawat inap selama Anda dirawat?",
        type: "LIKERT_5",
        isRequired: true,
        weight: 1.0,
        orderIndex: 1,
      },
      {
        id: "q-202",
        categoryId: "cat-202",
        text: "Bagaimana cita rasa dan ketepatan waktu penyajian makanan pasien?",
        type: "LIKERT_5",
        isRequired: true,
        weight: 1.0,
        orderIndex: 2,
      },
    ],
  },
];

// -------------------------------------------------------------
// DUMMY RESPONDENTS & REVIEWS
// -------------------------------------------------------------
export const DUMMY_RESPONDENTS: Respondent[] = [
  {
    id: "resp-001",
    code: "RES-2025-001429",
    hospitalId: "hosp-001",
    periodId: "per-001",
    unitId: "unit-001",
    unitName: "Instalasi Gawat Darurat (IGD)",
    ageRange: "26-35 tahun",
    gender: "MALE",
    education: "S1 / Sarjana",
    occupation: "Karyawan Swasta",
    submittedAt: "2025-03-14 09:42:10",
    score: 92.5,
    reviewSnippet: "Penanganan dokter jaga IGD sigap dan ramah saat anak saya demam tinggi.",
  },
  {
    id: "resp-002",
    code: "RES-2025-001428",
    hospitalId: "hosp-001",
    periodId: "per-001",
    unitId: "unit-003",
    unitName: "Instalasi Farmasi & Depo Obat",
    ageRange: "46-55 tahun",
    gender: "FEMALE",
    education: "SMA / Sederajat",
    occupation: "Wiraswasta",
    submittedAt: "2025-03-14 09:15:33",
    score: 68.0,
    reviewSnippet: "Antrian obat kronis BPJS terlalu lama, menunggu lebih dari 2 jam tanpa kepastian nomor panggil.",
  },
  {
    id: "resp-003",
    code: "RES-2025-001427",
    hospitalId: "hosp-001",
    periodId: "per-001",
    unitId: "unit-002",
    unitName: "Poli Gigi & Mulut",
    ageRange: "36-45 tahun",
    gender: "FEMALE",
    education: "Diploma / D3",
    occupation: "PNS / ASN",
    submittedAt: "2025-03-14 08:50:12",
    score: 95.0,
    reviewSnippet: "Dokter gigi sangat teliti menjelaskan cara perawatan gigi pasca tambal. Alatnya bersih.",
  },
  {
    id: "resp-004",
    code: "RES-2025-001426",
    hospitalId: "hosp-001",
    periodId: "per-001",
    unitId: "unit-005",
    unitName: "Poli Spesialis Anak",
    ageRange: "26-35 tahun",
    gender: "FEMALE",
    education: "S1 / Sarjana",
    occupation: "Ibu Rumah Tangga",
    submittedAt: "2025-03-13 15:30:20",
    score: 87.5,
    reviewSnippet: "Ruang tunggu ramah anak sudah bagus, mohon sediakan dispenser air hangat untuk susu bayi.",
  },
  {
    id: "resp-005",
    code: "RES-2025-001425",
    hospitalId: "hosp-001",
    periodId: "per-001",
    unitId: "unit-009",
    unitName: "Loket Pendaftaran & Administrasi BPJS",
    ageRange: "56-65 tahun",
    gender: "MALE",
    education: "SMP / Sederajat",
    occupation: "Petani / Buruh",
    submittedAt: "2025-03-13 11:22:45",
    score: 75.0,
    reviewSnippet: "Petugas loket agak terburu-buru menjelaskan, untuk lansia seperti saya agak bingung.",
  },
  {
    id: "resp-006",
    code: "RES-2025-001424",
    hospitalId: "hosp-001",
    periodId: "per-001",
    unitId: "unit-006",
    unitName: "Laboratorium Patologi Klinik",
    ageRange: "17-25 tahun",
    gender: "FEMALE",
    education: "S1 / Mahasiswa",
    occupation: "Pelajar / Mahasiswa",
    submittedAt: "2025-03-13 10:10:04",
    score: 90.0,
    reviewSnippet: "Pengambilan darah tidak sakit, hasil lab bisa diunduh via WA atau web, sangat praktis!",
  },
];

// -------------------------------------------------------------
// DUMMY REVIEWS & SENTIMENTS
// -------------------------------------------------------------
export const DUMMY_REVIEWS = [
  {
    id: "rev-001",
    hospitalId: "hosp-001",
    respondentCode: "RES-2025-001429",
    unitName: "Instalasi Gawat Darurat (IGD)",
    text: "Penanganan dokter jaga IGD sigap dan ramah saat anak saya demam tinggi. Perawat langsung memasang oksigen dengan tenang.",
    sentiment: "POSITIVE" as const,
    score: 92.5,
    date: "14 Maret 2025, 09:42",
    keywords: ["sigap", "ramah", "perawat", "tenang", "dokter"],
  },
  {
    id: "rev-002",
    hospitalId: "hosp-001",
    respondentCode: "RES-2025-001428",
    unitName: "Instalasi Farmasi & Depo Obat",
    text: "Antrian obat kronis BPJS terlalu lama, menunggu lebih dari 2 jam tanpa kepastian nomor panggil. Ruang tunggu farmasi panas.",
    sentiment: "NEGATIVE" as const,
    score: 68.0,
    date: "14 Maret 2025, 09:15",
    keywords: ["antrian lama", "farmasi", "panas", "nunggu 2 jam", "bpjs"],
  },
  {
    id: "rev-003",
    hospitalId: "hosp-001",
    respondentCode: "RES-2025-001427",
    unitName: "Poli Gigi & Mulut",
    text: "Dokter gigi sangat teliti menjelaskan cara perawatan gigi pasca tambal. Alatnya steril dan higienis.",
    sentiment: "POSITIVE" as const,
    score: 95.0,
    date: "14 Maret 2025, 08:50",
    keywords: ["teliti", "higienis", "dokter gigi", "steril", "puas"],
  },
  {
    id: "rev-004",
    hospitalId: "hosp-001",
    respondentCode: "RES-2025-001426",
    unitName: "Poli Spesialis Anak",
    text: "Ruang tunggu ramah anak sudah bagus, tapi mohon sediakan dispenser air hangat untuk keperluan susu bayi.",
    sentiment: "NEUTRAL" as const,
    score: 87.5,
    date: "13 Maret 2025, 15:30",
    keywords: ["ramah anak", "dispenser", "air hangat", "ruang tunggu"],
  },
  {
    id: "rev-005",
    hospitalId: "hosp-001",
    respondentCode: "RES-2025-001425",
    unitName: "Loket Pendaftaran & Administrasi",
    text: "Petugas loket agak terburu-buru menjelaskan, untuk lansia seperti saya agak kebingungan mencocokkan berkas rujukan.",
    sentiment: "NEGATIVE" as const,
    score: 75.0,
    date: "13 Maret 2025, 11:22",
    keywords: ["terburu-buru", "lansia", "bingung", "berkas rujukan"],
  },
  {
    id: "rev-006",
    hospitalId: "hosp-001",
    respondentCode: "RES-2025-001424",
    unitName: "Laboratorium Patologi Klinik",
    text: "Pelayanan sangat memuaskan, perawat ramah, jarum suntik tidak terasa sakit, tempat bersih dan wangi.",
    sentiment: "POSITIVE" as const,
    score: 90.0,
    date: "13 Maret 2025, 10:10",
    keywords: ["memuaskan", "ramah", "tidak sakit", "bersih", "wangi"],
  },
];

// -------------------------------------------------------------
// DUMMY USERS
// -------------------------------------------------------------
export const DUMMY_USERS: SystemUser[] = [
  {
    id: "usr-001",
    fullName: "Hendra Wijaya, S.Kom., M.T.",
    email: "hendra.wijaya@surveikepuasan.id",
    role: "SUPER_ADMIN",
    isActive: true,
    lastLoginAt: "2025-03-14 08:30:11",
  },
  {
    id: "usr-002",
    fullName: "Dr. Ratna Kusuma, Sp.PK",
    email: "dr.ratna@rsudsayang.id",
    role: "HOSPITAL_ADMIN",
    hospitalId: "hosp-001",
    hospitalName: "RSUD Sayang Cianjur",
    isActive: true,
    lastLoginAt: "2025-03-14 09:12:00",
  },
  {
    id: "usr-003",
    fullName: "Bambang Setiawan, S.Kom.",
    email: "bambang@rsudkarawang.id",
    role: "HOSPITAL_ADMIN",
    hospitalId: "hosp-002",
    hospitalName: "RSUD Kabupaten Karawang",
    isActive: true,
    lastLoginAt: "2025-03-13 17:40:22",
  },
  {
    id: "usr-004",
    fullName: "Ns. Sri Wahyuni, S.Kep.",
    email: "sri.wahyuni@rsudsayang.id",
    role: "FIELD_OFFICER",
    hospitalId: "hosp-001",
    hospitalName: "RSUD Sayang Cianjur",
    assignedUnitId: "unit-001",
    assignedUnitName: "Instalasi Gawat Darurat (IGD)",
    isActive: true,
    lastLoginAt: "2025-03-14 07:00:15",
  },
  {
    id: "usr-005",
    fullName: "Anisa Fitria, A.Md.Kes.",
    email: "anisa.fitria@rsudsayang.id",
    role: "FIELD_OFFICER",
    hospitalId: "hosp-001",
    hospitalName: "RSUD Sayang Cianjur",
    assignedUnitId: "unit-002",
    assignedUnitName: "Poli Gigi & Mulut",
    isActive: true,
    lastLoginAt: "2025-03-14 08:15:30",
  },
];

// -------------------------------------------------------------
// DUMMY AUDIT LOGS (HISTORY)
// -------------------------------------------------------------
export const DUMMY_HISTORY_LOGS: HistoryLog[] = [
  {
    id: 101,
    hospitalId: "hosp-001",
    hospitalName: "RSUD Sayang Cianjur",
    actorName: "Dr. Ratna Kusuma, Sp.PK",
    actorRole: "HOSPITAL_ADMIN",
    entityType: "PERIOD",
    entityId: "per-001",
    action: "ACTIVATE",
    notes: "Pengaktifan periode Triwulan I 2025 untuk seluruh 9 unit layanan",
    beforeJson: { status: "DRAFT", isActive: false },
    afterJson: { status: "ACTIVE", isActive: true },
    ipAddress: "103.111.201.42",
    createdAt: "2025-01-01 08:15:20",
  },
  {
    id: 102,
    hospitalId: "hosp-001",
    hospitalName: "RSUD Sayang Cianjur",
    actorName: "Dr. Ratna Kusuma, Sp.PK",
    actorRole: "HOSPITAL_ADMIN",
    entityType: "QUESTIONNAIRE",
    entityId: "quest-001",
    action: "PUBLISH",
    notes: "Publikasi revisi v2 penambahan pertanyaan fasilitas ruang tunggu",
    beforeJson: { version: 1, totalQuestions: 8 },
    afterJson: { version: 2, totalQuestions: 9 },
    ipAddress: "103.111.201.42",
    createdAt: "2025-01-01 07:55:00",
  },
  {
    id: 103,
    hospitalId: "hosp-001",
    hospitalName: "RSUD Sayang Cianjur",
    actorName: "Dr. Ratna Kusuma, Sp.PK",
    actorRole: "HOSPITAL_ADMIN",
    entityType: "UNIT",
    entityId: "unit-009",
    action: "CREATE",
    notes: "Penambahan unit baru Loket Pendaftaran & Administrasi BPJS",
    beforeJson: undefined,
    afterJson: { code: "LOKET-ADM", name: "Loket Pendaftaran & Administrasi BPJS", isActive: true },
    ipAddress: "103.111.201.42",
    createdAt: "2024-12-28 14:20:10",
  },
  {
    id: 104,
    hospitalId: "hosp-001",
    hospitalName: "RSUD Sayang Cianjur",
    actorName: "Hendra Wijaya, S.Kom.",
    actorRole: "SUPER_ADMIN",
    entityType: "HOSPITAL",
    entityId: "hosp-001",
    action: "UPDATE",
    notes: "Pembaruan alamat resmi dan nomor telepon operasional RSUD Sayang Cianjur",
    beforeJson: { phone: "(0263) 261000" },
    afterJson: { phone: "(0263) 261026" },
    ipAddress: "180.252.12.89",
    createdAt: "2024-12-20 10:11:45",
  },
  {
    id: 105,
    hospitalId: "hosp-001",
    hospitalName: "RSUD Sayang Cianjur",
    actorName: "Dr. Ratna Kusuma, Sp.PK",
    actorRole: "HOSPITAL_ADMIN",
    entityType: "QRCODE",
    entityId: "qr-001",
    action: "CREATE",
    notes: "Pembuatan QR Code cetak untuk meja triage IGD",
    beforeJson: undefined,
    afterJson: { unitCode: "IGD", qrUrl: "https://surveikepuasan.id/s/RSUD-CIANJUR?unit=IGD" },
    ipAddress: "103.111.201.42",
    createdAt: "2025-01-02 09:30:10",
  },
];

// -------------------------------------------------------------
// DUMMY TREND DATA (7 Hari & 6 Bulan)
// -------------------------------------------------------------
export const DUMMY_DAILY_TREND = [
  { date: "08 Mar", responses: 45, score: 83.2 },
  { date: "09 Mar", responses: 38, score: 84.1 },
  { date: "10 Mar", responses: 62, score: 85.0 },
  { date: "11 Mar", responses: 58, score: 84.4 },
  { date: "12 Mar", responses: 71, score: 83.8 },
  { date: "13 Mar", responses: 84, score: 85.5 },
  { date: "14 Mar", responses: 52, score: 86.2 },
];

export const DUMMY_MONTHLY_COMPARISON = [
  { hospital: "RSUD Sayang Cianjur", ikm: 84.6, responses: 1420 },
  { hospital: "RSUD Karawang", ikm: 82.1, responses: 1890 },
  { hospital: "RSUP Dr. Hasan Sadikin", ikm: 88.3, responses: 3240 },
  { hospital: "RSUD Kota Bandung", ikm: 81.4, responses: 980 },
  { hospital: "RS Siloam Semanggi", ikm: 91.2, responses: 1650 },
];
