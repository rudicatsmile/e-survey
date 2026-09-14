import * as dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { db, pool } from './index';
import {
  hospitals,
  users,
  serviceUnits,
  surveyPeriods,
  questionnaires,
  questionCategories,
  questions,
  respondents,
  surveyResponses,
  surveyAnswers,
  surveyReviews,
  qrCodes,
  surveyHistoryLogs,
  activityLogs,
} from './schema';

function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
}

function sha256(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex');
}

async function runSeed() {
  console.log('🌱 Starting Database Seeding for SurveiKepuasan...');

  // 1. Bersihkan tabel (urutan child ke parent)
  console.log('🧹 Clearing existing tables...');
  await db.delete(surveyReviews);
  await db.delete(surveyAnswers);
  await db.delete(surveyResponses);
  await db.delete(respondents);
  await db.delete(questions);
  await db.delete(questionCategories);
  await db.delete(questionnaires);
  await db.delete(qrCodes);
  await db.delete(surveyPeriods);
  await db.delete(users);
  await db.delete(serviceUnits);
  await db.delete(surveyHistoryLogs);
  await db.delete(activityLogs);
  await db.delete(hospitals);

  // 2. Data Rumah Sakit
  console.log('🏥 Inserting Hospitals...');
  const hospitalData = [
    {
      id: 'hosp_rsud_cianjur_01',
      code: 'RSUD-CIANJUR',
      name: 'RSUD Sayang Cianjur',
      city: 'Cianjur',
      address: 'Jl. Rumah Sakit No. 1, Bojongherang, Kec. Cianjur, Kab. Cianjur, Jawa Barat 43216',
      phone: '(0263) 261026',
      email: 'info@rsudsayang.id',
      logoUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=200',
      description: 'Rumah Sakit Umum Daerah Kelas B rujukan utama di wilayah Kabupaten Cianjur dengan standar pelayanan prima.',
      isActive: true,
    },
    {
      id: 'hosp_rsud_karawang_02',
      code: 'RSUD-KARAWANG',
      name: 'RSUD Karawang',
      city: 'Karawang',
      address: 'Jl. Galuh Mas Raya No. 1, Sukaharja, Telukjambe Timur, Karawang, Jawa Barat 41361',
      phone: '(0267) 640118',
      email: 'kontak@rsudkarawang.go.id',
      logoUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=200',
      description: 'RSUD rujukan regional Jawa Barat bagian timur yang mengutamakan kecepatan, keramahan, dan teknologi terdepan.',
      isActive: true,
    },
    {
      id: 'hosp_rshs_bandung_03',
      code: 'RSHS',
      name: 'RSUP Dr. Hasan Sadikin Bandung',
      city: 'Bandung',
      address: 'Jl. Pasteur No. 38, Pasteur, Kec. Sukajadi, Kota Bandung, Jawa Barat 40161',
      phone: '(022) 2034953',
      email: 'humas@rshs.or.id',
      logoUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=200',
      description: 'Rumah Sakit Pusat Rujukan Nasional Kelas A dengan fasilitas medis paripurna dan pusat pendidikan kedokteran unggulan.',
      isActive: true,
    },
  ];

  await db.insert(hospitals).values(hospitalData);

  // 3. Unit Layanan (8-10 per RS)
  console.log('🏢 Inserting Service Units...');
  const unitTemplates = [
    { code: 'IGD', name: 'Instalasi Gawat Darurat (IGD)', desc: 'Pelayanan gawat darurat medis 24 jam' },
    { code: 'POLI', name: 'Rawat Jalan / Poliklinik Spesialis', desc: 'Layanan poli spesialis dan konsul medis' },
    { code: 'RAWAT_INAP', name: 'Instalasi Rawat Inap', desc: 'Perawatan inap VIP, Kelas 1, 2, dan 3' },
    { code: 'FARMASI', name: 'Instalasi Farmasi & Apotek', desc: 'Pelayanan resep obat dan konseling farmasi' },
    { code: 'LAB', name: 'Laboratorium Patologi Klinik', desc: 'Pemeriksaan darah, urine, dan spesimen klinik' },
    { code: 'RADIOLOGI', name: 'Instalasi Radiologi & Imaging', desc: 'Rontgen, CT Scan, USG, dan MRI' },
    { code: 'KASIR', name: 'Kasir & Pembayaran Pasien', desc: 'Administrasi keuangan, BPJS, dan umum' },
    { code: 'PENDAFTARAN', name: 'Pendaftaran & Rekam Medis', desc: 'Loket registrasi pasien baru dan rujukan' },
    { code: 'HEMODIALISA', name: 'Unit Hemodialisa (Cuci Darah)', desc: 'Pelayanan cuci darah pasien gagal ginjal' },
    { code: 'ICU', name: 'Intensive Care Unit (ICU / ICCU)', desc: 'Perawatan intensif dan kritis' },
  ];

  const allUnits: { id: string; hospitalId: string; code: string; name: string; description: string }[] = [];

  for (const h of hospitalData) {
    const shortCode = h.code.replace('RSUD-', '').toLowerCase();
    for (const u of unitTemplates) {
      allUnits.push({
        id: `u_${shortCode}_${u.code.toLowerCase()}`,
        hospitalId: h.id,
        code: u.code,
        name: u.name,
        description: u.desc,
      });
    }
  }

  await db.insert(serviceUnits).values(allUnits);

  // 4. Pengguna (Users) - Super Admin, Admin RS, Petugas
  console.log('👥 Inserting Users with bcrypt hash...');
  const adminPasswordHash = await bcrypt.hash('Admin123!', 12);
  const officerPasswordHash = await bcrypt.hash('Petugas123!', 12);

  const cianjurIgdUnit = allUnits.find(
    (u) => u.hospitalId === 'hosp_rsud_cianjur_01' && u.code === 'IGD'
  )!;

  const usersData = [
    {
      id: 'usr_super_admin_01',
      hospitalId: null,
      email: 'admin@surveikepuasan.id',
      passwordHash: adminPasswordHash,
      fullName: 'Dr. Pratama Wicaksono, M.Kes',
      role: 'SUPER_ADMIN' as const,
      assignedUnitId: null,
      isActive: true,
    },
    {
      id: 'usr_admin_cianjur_02',
      hospitalId: 'hosp_rsud_cianjur_01',
      email: 'admin.rsud@cianjur.go.id',
      passwordHash: adminPasswordHash,
      fullName: 'H. Asep Saifullah, S.Kom',
      role: 'HOSPITAL_ADMIN' as const,
      assignedUnitId: null,
      isActive: true,
    },
    {
      id: 'usr_admin_karawang_03',
      hospitalId: 'hosp_rsud_karawang_02',
      email: 'admin.rsud@karawang.go.id',
      passwordHash: adminPasswordHash,
      fullName: 'Dra. Siti Nurhaliza, M.M.',
      role: 'HOSPITAL_ADMIN' as const,
      assignedUnitId: null,
      isActive: true,
    },
    {
      id: 'usr_petugas_cianjur_04',
      hospitalId: 'hosp_rsud_cianjur_01',
      email: 'petugas.igd@cianjur.go.id',
      passwordHash: officerPasswordHash,
      fullName: 'Budi Santoso, A.Md.Kep',
      role: 'FIELD_OFFICER' as const,
      assignedUnitId: cianjurIgdUnit.id,
      isActive: true,
    },
  ];

  await db.insert(users).values(usersData);

  // 5. Periode Survey Aktif (surveyPeriods)
  console.log('📅 Inserting Survey Periods...');
  const nowTime = new Date();
  const oneYearFromNow = new Date(nowTime.getTime() + 365 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(nowTime.getTime() - 30 * 24 * 60 * 60 * 1000);

  const periodsData = [
    {
      id: 'period_cianjur_2025_t1',
      hospitalId: 'hosp_rsud_cianjur_01',
      name: 'Periode Berjalan - IKM Terpadu RSUD Sayang',
      startDate: oneMonthAgo,
      endDate: oneYearFromNow,
      status: 'ACTIVE' as const,
      createdBy: 'usr_admin_cianjur_02',
    },
    {
      id: 'period_karawang_2025_t1',
      hospitalId: 'hosp_rsud_karawang_02',
      name: 'Survei Kepuasan Pasien Karawang',
      startDate: oneMonthAgo,
      endDate: oneYearFromNow,
      status: 'ACTIVE' as const,
      createdBy: 'usr_admin_karawang_03',
    },
    {
      id: 'period_rshs_2025_t1',
      hospitalId: 'hosp_rshs_bandung_03',
      name: 'Survei Mutu & Kepuasan Pelanggan RSHS',
      startDate: oneMonthAgo,
      endDate: oneYearFromNow,
      status: 'ACTIVE' as const,
      createdBy: 'usr_super_admin_01',
    },
  ];

  await db.insert(surveyPeriods).values(periodsData);

  // 6. Kuesioner IKM 14 Unsur Pelayanan Publik (Permenpan RB)
  console.log('📝 Inserting Questionnaires & 14 Questions...');
  const qId = 'quest_cianjur_ikm_14';
  await db.insert(questionnaires).values({
    id: qId,
    hospitalId: 'hosp_rsud_cianjur_01',
    periodId: 'period_cianjur_2025_t1',
    title: 'Survei Kepuasan Masyarakat (IKM) Pelayanan Rumah Sakit 2025',
    description:
      'Kuesioner evaluasi mutu pelayanan berdasarkan 14 Unsur Indeks Kepuasan Masyarakat Permenpan RB untuk meningkatkan kualitas layanan kesehatan.',
    version: 1,
    status: 'PUBLISHED',
    publishedAt: new Date(),
    createdBy: 'usr_admin_cianjur_02',
  });

  const categoriesData = [
    { id: 'cat_01', questionnaireId: qId, name: 'Persyaratan & Prosedur Pelayanan', weight: '1.00', orderIndex: 1 },
    { id: 'cat_02', questionnaireId: qId, name: 'Waktu & Biaya/Tarif Pelayanan', weight: '1.00', orderIndex: 2 },
    { id: 'cat_03', questionnaireId: qId, name: 'Produk Spesifikasi & Kompetensi Pelaksana', weight: '1.00', orderIndex: 3 },
    { id: 'cat_04', questionnaireId: qId, name: 'Perilaku Pelaksana & Sarana Prasarana', weight: '1.00', orderIndex: 4 },
    { id: 'cat_05', questionnaireId: qId, name: 'Penanganan Pengaduan & Ketanggapan', weight: '1.00', orderIndex: 5 },
  ];
  await db.insert(questionCategories).values(categoriesData);

  const questionsList = [
    { id: 'q_01', categoryId: 'cat_01', text: 'Kemudahan persyaratan pelayanan yang harus dipenuhi pasien/keluarga', orderIndex: 1 },
    { id: 'q_02', categoryId: 'cat_01', text: 'Kemudahan alur dan prosedur pelayanan di unit ini', orderIndex: 2 },
    { id: 'q_03', categoryId: 'cat_02', text: 'Kecepatan dan ketepatan waktu pemberian pelayanan oleh petugas', orderIndex: 3 },
    { id: 'q_04', categoryId: 'cat_02', text: 'Kesesuaian dan transparansi biaya/tarif pelayanan dengan ketentuan resmi', orderIndex: 4 },
    { id: 'q_05', categoryId: 'cat_03', text: 'Kesesuaian produk pelayanan yang diterima dengan standar yang dijanjikan', orderIndex: 5 },
    { id: 'q_06', categoryId: 'cat_03', text: 'Kompetensi, keterampilan, dan keahlian tenaga medis dalam melayani', orderIndex: 6 },
    { id: 'q_07', categoryId: 'cat_04', text: 'Keramahan, kesopanan, dan kepedulian sikap petugas pelayanan', orderIndex: 7 },
    { id: 'q_08', categoryId: 'cat_04', text: 'Kualitas, kebersihan, dan kenyamanan sarana ruang tunggu dan toilet', orderIndex: 8 },
    { id: 'q_09', categoryId: 'cat_05', text: 'Kecepatan tindak lanjut rumah sakit atas keluhan atau saran pasien', orderIndex: 9 },
    { id: 'q_10', categoryId: 'cat_01', text: 'Kejelasan informasi petunjuk arah, jadwal dokter, dan alur pendaftaran', orderIndex: 10 },
    { id: 'q_11', categoryId: 'cat_04', text: 'Kerapian dan kesiapan fasilitas peralatan medis yang digunakan', orderIndex: 11 },
    { id: 'q_12', categoryId: 'cat_05', text: 'Ketanggapan petugas dalam menangani kondisi darurat atau pertanyaan keluarga', orderIndex: 12 },
    { id: 'q_13', categoryId: 'cat_03', text: 'Ketersediaan dan kejelasan penjelasan aturan minum obat di farmasi', orderIndex: 13 },
    { id: 'q_14', categoryId: 'cat_04', text: 'Kenyamanan sirkulasi udara, pencahayaan, dan keamanan di lingkungan RS', orderIndex: 14 },
  ];

  const questionsData = questionsList.map((q) => ({
    id: q.id,
    questionnaireId: qId,
    categoryId: q.categoryId,
    text: q.text,
    type: 'LIKERT_5' as const,
    isRequired: true,
    weight: '1.00',
    orderIndex: q.orderIndex,
  }));
  await db.insert(questions).values(questionsData);

  // Duplikat kuesioner dasar untuk RSUD Karawang dan RSHS agar siap pakai
  for (const h of [hospitalData[1], hospitalData[2]]) {
    const qidH = `quest_${h.code.toLowerCase()}_ikm`;
    const pidH = periodsData.find((p) => p.hospitalId === h.id)!.id;
    await db.insert(questionnaires).values({
      id: qidH,
      hospitalId: h.id,
      periodId: pidH,
      title: `Survei Kepuasan Masyarakat Pelayanan ${h.name} 2025`,
      description: 'Kuesioner resmi evaluasi kepuasan pasien & keluarga.',
      version: 1,
      status: 'PUBLISHED',
      publishedAt: new Date(),
      createdBy: 'usr_super_admin_01',
    });

    const catH = `cat_${h.code.toLowerCase()}_main`;
    await db.insert(questionCategories).values({
      id: catH,
      questionnaireId: qidH,
      name: 'Unsur Pelayanan Utama',
      weight: '1.00',
      orderIndex: 1,
    });

    const qHData = questionsList.slice(0, 9).map((q, idx) => ({
      id: `q_${h.code.toLowerCase()}_${idx + 1}`,
      questionnaireId: qidH,
      categoryId: catH,
      text: q.text,
      type: 'LIKERT_5' as const,
      isRequired: true,
      weight: '1.00',
      orderIndex: idx + 1,
    }));
    await db.insert(questions).values(qHData);
  }

  // 7. QR Codes untuk Unit Layanan
  console.log('📱 Generating QR Codes...');
  const qrData = allUnits.map((u) => ({
    id: `qr_${u.id}`,
    hospitalId: u.hospitalId,
    unitId: u.id,
    periodId: periodsData.find((p) => p.hospitalId === u.hospitalId)?.id || null,
    qrUrl: `http://localhost:3000/s/${
      hospitalData.find((h) => h.id === u.hospitalId)!.code
    }/survey?unit=${u.code}`,
    imageUrl: null,
    scanCount: Math.floor(Math.random() * 80) + 10,
    createdBy: 'usr_super_admin_01',
  }));
  await db.insert(qrCodes).values(qrData);

  // 8. 50 Sample Respondents, Responses, Answers, & Reviews
  console.log('📊 Inserting 50 Sample Survey Responses & Reviews...');
  const sampleAge = ['17-25', '26-35', '36-45', '46-60', '>60'];
  const sampleGenders = ['MALE', 'FEMALE'] as const;
  const sampleEdu = ['SMA / Sederajat', 'Diploma (D3)', 'Sarjana (S1)', 'SMP', 'Magister (S2)'];
  const sampleOcc = ['Karyawan Swasta', 'PNS / ASN', 'Wiraswasta', 'Ibu Rumah Tangga', 'Mahasiswa'];

  const positiveReviews = [
    { text: 'Pelayanan dokter dan perawat di IGD sangat cekatan dan ramah. Ruang tunggu bersih dan ber-AC.', kw: ['dokter', 'perawat', 'ramah', 'bersih', 'cepat'] },
    { text: 'Sangat puas dengan fasilitas rawat jalan. Obat farmasi cepat selesai tidak perlu antre lama.', kw: ['obat', 'farmasi', 'cepat', 'puas'] },
    { text: 'Proses administrasi BPJS mudah dan petugas kasir sangat membantu keluarga kami yang kebingungan.', kw: ['bpjs', 'petugas', 'ramah', 'membantu'] },
    { text: 'Fasilitas ruang inap kelas 1 sangat nyaman, perawat sigap datang saat bel dipanggil.', kw: ['rawat inap', 'nyaman', 'sigap'] },
    { text: 'Alur pendaftaran online sangat membantu mempersingkat waktu tunggu di loket.', kw: ['pendaftaran', 'online', 'cepat'] },
  ];

  const neutralReviews = [
    { text: 'Pelayanan lumayan baik, namun ruang tunggu poli spesialis agak penuh saat jam 9 pagi.', kw: ['pelayanan', 'ruang tunggu', 'ramai'] },
    { text: 'Dokter sangat ramah, tapi mohon jadwal dokter diinformasikan jika ada operasi mendadak.', kw: ['dokter', 'jadwal', 'informasi'] },
    { text: 'Standar pelayanan sudah bagus, hanya tempat parkir motor kadang sulit didapat.', kw: ['standar', 'parkir'] },
  ];

  const negativeReviews = [
    { text: 'Waktu tunggu di apotek masih agak lama, antrean obat racikan mencapai 1 jam.', kw: ['apotek', 'lama', 'antre', 'obat'] },
    { text: 'Toilet di dekat ruang tunggu pendaftaran perlu dibersihkan lebih rutin lagi.', kw: ['toilet', 'kebersihan'] },
  ];

  const cianjurUnits = allUnits.filter((u) => u.hospitalId === 'hosp_rsud_cianjur_01');

  for (let i = 1; i <= 50; i++) {
    const respId = `resp_cianjur_${i.toString().padStart(3, '0')}`;
    const code = `RES-2025-${(100000 + i).toString()}`;
    const unit = cianjurUnits[i % cianjurUnits.length];
    const age = sampleAge[i % sampleAge.length];
    const gender = sampleGenders[i % sampleGenders.length];
    const edu = sampleEdu[i % sampleEdu.length];
    const occ = sampleOcc[i % sampleOcc.length];
    const fakeIp = `192.168.1.${(i % 50) + 10}`;
    const ipHashVal = sha256(fakeIp);

    // Random date in last 30 days
    const submittedDate = new Date(Date.now() - (50 - i) * 14 * 3600 * 1000);

    await db.insert(respondents).values({
      id: respId,
      code: code,
      hospitalId: 'hosp_rsud_cianjur_01',
      periodId: 'period_cianjur_2025_t1',
      unitId: unit.id,
      ageRange: age,
      gender: gender,
      education: edu,
      occupation: occ,
      ipHash: ipHashVal,
      sessionFingerprint: sha256(`session_${i}`),
      submittedAt: submittedDate,
    });

    // Generate answers for 14 questions
    const responseRecordId = `sresp_cianjur_${i.toString().padStart(3, '0')}`;
    let totalScore = 0;
    const answersData = [];

    for (const q of questionsList) {
      // Skor condong ke 4 & 5 (puas & sangat puas), sesekali 3 atau 2
      const rand = Math.random();
      const likertVal = rand > 0.4 ? 5 : rand > 0.15 ? 4 : rand > 0.05 ? 3 : 2;
      totalScore += likertVal;

      answersData.push({
        responseId: responseRecordId,
        questionId: q.id,
        likertValue: likertVal,
        choiceValues: null,
        textValue: null,
      });
    }

    const overall = ((totalScore / (questionsList.length * 5)) * 100).toFixed(2);
    const nps = Math.min(10, Math.max(1, Math.round(Number(overall) / 10)));

    await db.insert(surveyResponses).values({
      id: responseRecordId,
      hospitalId: 'hosp_rsud_cianjur_01',
      periodId: 'period_cianjur_2025_t1',
      questionnaireId: qId,
      respondentId: respId,
      unitId: unit.id,
      overallScore: overall,
      npsScore: nps,
      isLocked: false,
      submittedAt: submittedDate,
    });

    await db.insert(surveyAnswers).values(answersData);

    // 40% responden menyertakan ulasan kualitatif
    if (i % 2 === 0 || i % 3 === 0) {
      let sampleRev;
      let sentimentVal: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';

      if (Number(overall) >= 80) {
        sampleRev = positiveReviews[i % positiveReviews.length];
        sentimentVal = 'POSITIVE';
      } else if (Number(overall) >= 65) {
        sampleRev = neutralReviews[i % neutralReviews.length];
        sentimentVal = 'NEUTRAL';
      } else {
        sampleRev = negativeReviews[i % negativeReviews.length];
        sentimentVal = 'NEGATIVE';
      }

      await db.insert(surveyReviews).values({
        id: `rev_cianjur_${i.toString().padStart(3, '0')}`,
        hospitalId: 'hosp_rsud_cianjur_01',
        responseId: responseRecordId,
        reviewText: sampleRev.text,
        sentiment: sentimentVal,
        keywordsJson: sampleRev.kw,
        createdAt: submittedDate,
      });
    }
  }

  // 9. Audit Logs & History Logs sample
  console.log('📜 Inserting Audit Trail Logs...');
  await db.insert(surveyHistoryLogs).values([
    {
      hospitalId: 'hosp_rsud_cianjur_01',
      actorUserId: 'usr_admin_cianjur_02',
      entityType: 'QUESTIONNAIRE',
      entityId: qId,
      action: 'PUBLISH',
      beforeJson: { status: 'DRAFT', version: 1 },
      afterJson: { status: 'PUBLISHED', version: 1, publishedAt: new Date().toISOString() },
      notes: 'Publikasi Kuesioner IKM 14 Unsur Pelayanan Rumah Sakit 2025.',
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      createdAt: new Date(Date.now() - 30 * 86400 * 1000),
    },
    {
      hospitalId: 'hosp_rsud_cianjur_01',
      actorUserId: 'usr_admin_cianjur_02',
      entityType: 'PERIOD',
      entityId: 'period_cianjur_2025_t1',
      action: 'ACTIVATE',
      beforeJson: { status: 'DRAFT' },
      afterJson: { status: 'ACTIVE' },
      notes: 'Aktivasi periode survey Triwulan I 2025.',
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      createdAt: new Date(Date.now() - 29 * 86400 * 1000),
    },
  ]);

  await db.insert(activityLogs).values([
    {
      userId: 'usr_super_admin_01',
      hospitalId: null,
      action: 'LOGIN',
      description: 'Super Admin login berhasil dari dashboard pusat.',
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 Chrome/130.0',
      createdAt: new Date(Date.now() - 3 * 3600 * 1000),
    },
    {
      userId: 'usr_admin_cianjur_02',
      hospitalId: 'hosp_rsud_cianjur_01',
      action: 'LOGIN',
      description: 'Admin RSUD Cianjur login ke dashboard operasional.',
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 Chrome/130.0',
      createdAt: new Date(Date.now() - 2 * 3600 * 1000),
    },
  ]);

  console.log('✅ Database Seeding Completed Successfully!');
  console.log('   - 3 Hospitals (RSUD Sayang Cianjur, RSUD Karawang, RSUP Hasan Sadikin)');
  console.log('   - 30 Service Units (10 per RS)');
  console.log('   - 4 Users (Super Admin, 2 Hospital Admins, 1 Field Officer)');
  console.log('   - 3 Active Survey Periods');
  console.log('   - 1 Master IKM Questionnaire with 14 Unsur Pelayanan');
  console.log('   - 30 QR Codes per Unit');
  console.log('   - 50 Live Sample Responses with Demographic, Answers, and Reviews');
  console.log('   - Initial Audit Trails & Activity Logs');
}

runSeed()
  .catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
    process.exit(0);
  });
