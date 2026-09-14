-- MySQL dump 10.16  Distrib 10.1.38-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: esurvey
-- ------------------------------------------------------
-- Server version	10.6.27-MariaDB-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activity_logs`
--

DROP TABLE IF EXISTS `activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activity_logs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` varchar(26) DEFAULT NULL,
  `hospital_id` varchar(26) DEFAULT NULL,
  `action` varchar(80) NOT NULL,
  `description` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_activity_user` (`user_id`,`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_logs`
--

LOCK TABLES `activity_logs` WRITE;
/*!40000 ALTER TABLE `activity_logs` DISABLE KEYS */;
INSERT INTO `activity_logs` VALUES (1,'usr_super_admin_01',NULL,'LOGIN','Super Admin login berhasil dari dashboard pusat.','127.0.0.1','Mozilla/5.0 Chrome/130.0','2026-09-13 19:42:55'),(2,'usr_admin_cianjur_02','hosp_rsud_cianjur_01','LOGIN','Admin RSUD Cianjur login ke dashboard operasional.','127.0.0.1','Mozilla/5.0 Chrome/130.0','2026-09-13 20:42:55');
/*!40000 ALTER TABLE `activity_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hospitals`
--

DROP TABLE IF EXISTS `hospitals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hospitals` (
  `id` varchar(26) NOT NULL,
  `code` varchar(20) NOT NULL,
  `name` varchar(150) NOT NULL,
  `city` varchar(100) NOT NULL,
  `address` text DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `hospitals_code_unique` (`code`),
  UNIQUE KEY `idx_hospitals_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hospitals`
--

LOCK TABLES `hospitals` WRITE;
/*!40000 ALTER TABLE `hospitals` DISABLE KEYS */;
INSERT INTO `hospitals` VALUES ('hosp_rshs_bandung_03','RSHS','RSUP Dr. Hasan Sadikin Bandung','Bandung','Jl. Pasteur No. 38, Pasteur, Kec. Sukajadi, Kota Bandung, Jawa Barat 40161','(022) 2034953','humas@rshs.or.id','https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=200','Rumah Sakit Pusat Rujukan Nasional Kelas A dengan fasilitas medis paripurna dan pusat pendidikan kedokteran unggulan.',1,'2026-09-14 05:42:54','2026-09-14 05:42:54'),('hosp_rsud_cianjur_01','RSUD-CIANJUR','RSUD Sayang Cianjur','Cianjur','Jl. Rumah Sakit No. 1, Bojongherang, Kec. Cianjur, Kab. Cianjur, Jawa Barat 43216','(0263) 261026','info@rsudsayang.id','https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=200','Rumah Sakit Umum Daerah Kelas B rujukan utama di wilayah Kabupaten Cianjur dengan standar pelayanan prima.',1,'2026-09-14 05:42:54','2026-09-14 05:42:54'),('hosp_rsud_karawang_02','RSUD-KARAWANG','RSUD Karawang','Karawang','Jl. Galuh Mas Raya No. 1, Sukaharja, Telukjambe Timur, Karawang, Jawa Barat 41361','(0267) 640118','kontak@rsudkarawang.go.id','https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=200','RSUD rujukan regional Jawa Barat bagian timur yang mengutamakan kecepatan, keramahan, dan teknologi terdepan.',1,'2026-09-14 05:42:54','2026-09-14 05:42:54');
/*!40000 ALTER TABLE `hospitals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification_emails`
--

DROP TABLE IF EXISTS `notification_emails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notification_emails` (
  `id` varchar(26) NOT NULL,
  `hospital_id` varchar(26) DEFAULT NULL,
  `recipient_email` varchar(150) NOT NULL,
  `subject` varchar(200) NOT NULL,
  `body` text NOT NULL,
  `status` enum('PENDING','SENT','FAILED') NOT NULL DEFAULT 'PENDING',
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification_emails`
--

LOCK TABLES `notification_emails` WRITE;
/*!40000 ALTER TABLE `notification_emails` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification_emails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_reset_tokens` (
  `id` varchar(26) NOT NULL,
  `user_id` varchar(26) NOT NULL,
  `token` varchar(120) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `used_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `password_reset_tokens_token_unique` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `qr_codes`
--

DROP TABLE IF EXISTS `qr_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `qr_codes` (
  `id` varchar(26) NOT NULL,
  `hospital_id` varchar(26) NOT NULL,
  `unit_id` varchar(26) NOT NULL,
  `period_id` varchar(26) DEFAULT NULL,
  `qr_url` varchar(255) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `scan_count` int(11) NOT NULL DEFAULT 0,
  `created_by` varchar(26) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `qr_codes`
--

LOCK TABLES `qr_codes` WRITE;
/*!40000 ALTER TABLE `qr_codes` DISABLE KEYS */;
INSERT INTO `qr_codes` VALUES ('qr_u_cianjur_farmasi','hosp_rsud_cianjur_01','u_cianjur_farmasi','period_cianjur_2025_t1','http://localhost:3000/s/RSUD-CIANJUR/survey?unit=FARMASI',NULL,56,'usr_super_admin_01','2026-09-14 05:42:55'),('qr_u_cianjur_hemodialisa','hosp_rsud_cianjur_01','u_cianjur_hemodialisa','period_cianjur_2025_t1','http://localhost:3000/s/RSUD-CIANJUR/survey?unit=HEMODIALISA',NULL,49,'usr_super_admin_01','2026-09-14 05:42:55'),('qr_u_cianjur_icu','hosp_rsud_cianjur_01','u_cianjur_icu','period_cianjur_2025_t1','http://localhost:3000/s/RSUD-CIANJUR/survey?unit=ICU',NULL,58,'usr_super_admin_01','2026-09-14 05:42:55'),('qr_u_cianjur_igd','hosp_rsud_cianjur_01','u_cianjur_igd','period_cianjur_2025_t1','http://localhost:3000/s/RSUD-CIANJUR/survey?unit=IGD',NULL,55,'usr_super_admin_01','2026-09-14 05:42:55'),('qr_u_cianjur_kasir','hosp_rsud_cianjur_01','u_cianjur_kasir','period_cianjur_2025_t1','http://localhost:3000/s/RSUD-CIANJUR/survey?unit=KASIR',NULL,37,'usr_super_admin_01','2026-09-14 05:42:55'),('qr_u_cianjur_lab','hosp_rsud_cianjur_01','u_cianjur_lab','period_cianjur_2025_t1','http://localhost:3000/s/RSUD-CIANJUR/survey?unit=LAB',NULL,17,'usr_super_admin_01','2026-09-14 05:42:55'),('qr_u_cianjur_pendaftaran','hosp_rsud_cianjur_01','u_cianjur_pendaftaran','period_cianjur_2025_t1','http://localhost:3000/s/RSUD-CIANJUR/survey?unit=PENDAFTARAN',NULL,85,'usr_super_admin_01','2026-09-14 05:42:55'),('qr_u_cianjur_poli','hosp_rsud_cianjur_01','u_cianjur_poli','period_cianjur_2025_t1','http://localhost:3000/s/RSUD-CIANJUR/survey?unit=POLI',NULL,72,'usr_super_admin_01','2026-09-14 05:42:55'),('qr_u_cianjur_radiologi','hosp_rsud_cianjur_01','u_cianjur_radiologi','period_cianjur_2025_t1','http://localhost:3000/s/RSUD-CIANJUR/survey?unit=RADIOLOGI',NULL,55,'usr_super_admin_01','2026-09-14 05:42:55'),('qr_u_cianjur_rawat_inap','hosp_rsud_cianjur_01','u_cianjur_rawat_inap','period_cianjur_2025_t1','http://localhost:3000/s/RSUD-CIANJUR/survey?unit=RAWAT_INAP',NULL,23,'usr_super_admin_01','2026-09-14 05:42:55'),('qr_u_karawang_farmasi','hosp_rsud_karawang_02','u_karawang_farmasi','period_karawang_2025_t1','http://localhost:3000/s/RSUD-KARAWANG/survey?unit=FARMASI',NULL,53,'usr_super_admin_01','2026-09-14 05:42:55'),('qr_u_karawang_hemodialisa','hosp_rsud_karawang_02','u_karawang_hemodialisa','period_karawang_2025_t1','http://localhost:3000/s/RSUD-KARAWANG/survey?unit=HEMODIALISA',NULL,11,'usr_super_admin_01','2026-09-14 05:42:55'),('qr_u_karawang_icu','hosp_rsud_karawang_02','u_karawang_icu','period_karawang_2025_t1','http://localhost:3000/s/RSUD-KARAWANG/survey?unit=ICU',NULL,84,'usr_super_admin_01','2026-09-14 05:42:55'),('qr_u_karawang_igd','hosp_rsud_karawang_02','u_karawang_igd','period_karawang_2025_t1','http://localhost:3000/s/RSUD-KARAWANG/survey?unit=IGD',NULL,31,'usr_super_admin_01','2026-09-14 05:42:55'),('qr_u_karawang_kasir','hosp_rsud_karawang_02','u_karawang_kasir','period_karawang_2025_t1','http://localhost:3000/s/RSUD-KARAWANG/survey?unit=KASIR',NULL,53,'usr_super_admin_01','2026-09-14 05:42:55'),('qr_u_karawang_lab','hosp_rsud_karawang_02','u_karawang_lab','period_karawang_2025_t1','http://localhost:3000/s/RSUD-KARAWANG/survey?unit=LAB',NULL,40,'usr_super_admin_01','2026-09-14 05:42:55'),('qr_u_karawang_pendaftaran','hosp_rsud_karawang_02','u_karawang_pendaftaran','period_karawang_2025_t1','http://localhost:3000/s/RSUD-KARAWANG/survey?unit=PENDAFTARAN',NULL,60,'usr_super_admin_01','2026-09-14 05:42:55'),('qr_u_karawang_poli','hosp_rsud_karawang_02','u_karawang_poli','period_karawang_2025_t1','http://localhost:3000/s/RSUD-KARAWANG/survey?unit=POLI',NULL,29,'usr_super_admin_01','2026-09-14 05:42:55'),('qr_u_karawang_radiologi','hosp_rsud_karawang_02','u_karawang_radiologi','period_karawang_2025_t1','http://localhost:3000/s/RSUD-KARAWANG/survey?unit=RADIOLOGI',NULL,89,'usr_super_admin_01','2026-09-14 05:42:55'),('qr_u_karawang_rawat_inap','hosp_rsud_karawang_02','u_karawang_rawat_inap','period_karawang_2025_t1','http://localhost:3000/s/RSUD-KARAWANG/survey?unit=RAWAT_INAP',NULL,50,'usr_super_admin_01','2026-09-14 05:42:55'),('qr_u_rshs_farmasi','hosp_rshs_bandung_03','u_rshs_farmasi','period_rshs_2025_t1','http://localhost:3000/s/RSHS/survey?unit=FARMASI',NULL,23,'usr_super_admin_01','2026-09-14 05:42:55'),('qr_u_rshs_hemodialisa','hosp_rshs_bandung_03','u_rshs_hemodialisa','period_rshs_2025_t1','http://localhost:3000/s/RSHS/survey?unit=HEMODIALISA',NULL,61,'usr_super_admin_01','2026-09-14 05:42:55'),('qr_u_rshs_icu','hosp_rshs_bandung_03','u_rshs_icu','period_rshs_2025_t1','http://localhost:3000/s/RSHS/survey?unit=ICU',NULL,76,'usr_super_admin_01','2026-09-14 05:42:55'),('qr_u_rshs_igd','hosp_rshs_bandung_03','u_rshs_igd','period_rshs_2025_t1','http://localhost:3000/s/RSHS/survey?unit=IGD',NULL,81,'usr_super_admin_01','2026-09-14 05:42:55'),('qr_u_rshs_kasir','hosp_rshs_bandung_03','u_rshs_kasir','period_rshs_2025_t1','http://localhost:3000/s/RSHS/survey?unit=KASIR',NULL,31,'usr_super_admin_01','2026-09-14 05:42:55'),('qr_u_rshs_lab','hosp_rshs_bandung_03','u_rshs_lab','period_rshs_2025_t1','http://localhost:3000/s/RSHS/survey?unit=LAB',NULL,37,'usr_super_admin_01','2026-09-14 05:42:55'),('qr_u_rshs_pendaftaran','hosp_rshs_bandung_03','u_rshs_pendaftaran','period_rshs_2025_t1','http://localhost:3000/s/RSHS/survey?unit=PENDAFTARAN',NULL,60,'usr_super_admin_01','2026-09-14 05:42:55'),('qr_u_rshs_poli','hosp_rshs_bandung_03','u_rshs_poli','period_rshs_2025_t1','http://localhost:3000/s/RSHS/survey?unit=POLI',NULL,45,'usr_super_admin_01','2026-09-14 05:42:55'),('qr_u_rshs_radiologi','hosp_rshs_bandung_03','u_rshs_radiologi','period_rshs_2025_t1','http://localhost:3000/s/RSHS/survey?unit=RADIOLOGI',NULL,55,'usr_super_admin_01','2026-09-14 05:42:55'),('qr_u_rshs_rawat_inap','hosp_rshs_bandung_03','u_rshs_rawat_inap','period_rshs_2025_t1','http://localhost:3000/s/RSHS/survey?unit=RAWAT_INAP',NULL,32,'usr_super_admin_01','2026-09-14 05:42:55');
/*!40000 ALTER TABLE `qr_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question_categories`
--

DROP TABLE IF EXISTS `question_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `question_categories` (
  `id` varchar(26) NOT NULL,
  `questionnaire_id` varchar(26) NOT NULL,
  `name` varchar(150) NOT NULL,
  `weight` decimal(5,2) NOT NULL DEFAULT 1.00,
  `order_index` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question_categories`
--

LOCK TABLES `question_categories` WRITE;
/*!40000 ALTER TABLE `question_categories` DISABLE KEYS */;
INSERT INTO `question_categories` VALUES ('cat_01','quest_cianjur_ikm_14','Persyaratan & Prosedur Pelayanan',1.00,1),('cat_02','quest_cianjur_ikm_14','Waktu & Biaya/Tarif Pelayanan',1.00,2),('cat_03','quest_cianjur_ikm_14','Produk Spesifikasi & Kompetensi Pelaksana',1.00,3),('cat_04','quest_cianjur_ikm_14','Perilaku Pelaksana & Sarana Prasarana',1.00,4),('cat_05','quest_cianjur_ikm_14','Penanganan Pengaduan & Ketanggapan',1.00,5),('cat_rshs_main','quest_rshs_ikm','Unsur Pelayanan Utama',1.00,1),('cat_rsud-karawang_main','quest_rsud-karawang_ikm','Unsur Pelayanan Utama',1.00,1);
/*!40000 ALTER TABLE `question_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questionnaires`
--

DROP TABLE IF EXISTS `questionnaires`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `questionnaires` (
  `id` varchar(26) NOT NULL,
  `hospital_id` varchar(26) NOT NULL,
  `period_id` varchar(26) DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `version` int(11) NOT NULL DEFAULT 1,
  `status` enum('DRAFT','PUBLISHED','ARCHIVED') NOT NULL DEFAULT 'DRAFT',
  `published_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` varchar(26) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_questionnaires_hospital_period` (`hospital_id`,`period_id`,`status`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questionnaires`
--

LOCK TABLES `questionnaires` WRITE;
/*!40000 ALTER TABLE `questionnaires` DISABLE KEYS */;
INSERT INTO `questionnaires` VALUES ('quest_cianjur_ikm_14','hosp_rsud_cianjur_01','period_cianjur_2025_t1','Survei Kepuasan Masyarakat (IKM) Pelayanan Rumah Sakit 2025','Kuesioner evaluasi mutu pelayanan berdasarkan 14 Unsur Indeks Kepuasan Masyarakat Permenpan RB untuk meningkatkan kualitas layanan kesehatan.',1,'PUBLISHED','2026-09-13 22:42:55','usr_admin_cianjur_02','2026-09-14 05:42:55','2026-09-14 05:42:55'),('quest_rshs_ikm','hosp_rshs_bandung_03','period_rshs_2025_t1','Survei Kepuasan Masyarakat Pelayanan RSUP Dr. Hasan Sadikin Bandung 2025','Kuesioner resmi evaluasi kepuasan pasien & keluarga.',1,'PUBLISHED','2026-09-13 22:42:55','usr_super_admin_01','2026-09-14 05:42:55','2026-09-14 05:42:55'),('quest_rsud-karawang_ikm','hosp_rsud_karawang_02','period_karawang_2025_t1','Survei Kepuasan Masyarakat Pelayanan RSUD Karawang 2025','Kuesioner resmi evaluasi kepuasan pasien & keluarga.',1,'PUBLISHED','2026-09-13 22:42:55','usr_super_admin_01','2026-09-14 05:42:55','2026-09-14 05:42:55');
/*!40000 ALTER TABLE `questionnaires` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `questions` (
  `id` varchar(26) NOT NULL,
  `questionnaire_id` varchar(26) NOT NULL,
  `category_id` varchar(26) DEFAULT NULL,
  `text` text NOT NULL,
  `type` enum('LIKERT_5','MULTIPLE_CHOICE','SHORT_TEXT','LONG_TEXT') NOT NULL,
  `options_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`options_json`)),
  `is_required` tinyint(1) NOT NULL DEFAULT 1,
  `weight` decimal(5,2) NOT NULL DEFAULT 1.00,
  `order_index` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES ('q_01','quest_cianjur_ikm_14','cat_01','Kemudahan persyaratan pelayanan yang harus dipenuhi pasien/keluarga','LIKERT_5',NULL,1,1.00,1,'2026-09-14 05:42:55'),('q_02','quest_cianjur_ikm_14','cat_01','Kemudahan alur dan prosedur pelayanan di unit ini','LIKERT_5',NULL,1,1.00,2,'2026-09-14 05:42:55'),('q_03','quest_cianjur_ikm_14','cat_02','Kecepatan dan ketepatan waktu pemberian pelayanan oleh petugas','LIKERT_5',NULL,1,1.00,3,'2026-09-14 05:42:55'),('q_04','quest_cianjur_ikm_14','cat_02','Kesesuaian dan transparansi biaya/tarif pelayanan dengan ketentuan resmi','LIKERT_5',NULL,1,1.00,4,'2026-09-14 05:42:55'),('q_05','quest_cianjur_ikm_14','cat_03','Kesesuaian produk pelayanan yang diterima dengan standar yang dijanjikan','LIKERT_5',NULL,1,1.00,5,'2026-09-14 05:42:55'),('q_06','quest_cianjur_ikm_14','cat_03','Kompetensi, keterampilan, dan keahlian tenaga medis dalam melayani','LIKERT_5',NULL,1,1.00,6,'2026-09-14 05:42:55'),('q_07','quest_cianjur_ikm_14','cat_04','Keramahan, kesopanan, dan kepedulian sikap petugas pelayanan','LIKERT_5',NULL,1,1.00,7,'2026-09-14 05:42:55'),('q_08','quest_cianjur_ikm_14','cat_04','Kualitas, kebersihan, dan kenyamanan sarana ruang tunggu dan toilet','LIKERT_5',NULL,1,1.00,8,'2026-09-14 05:42:55'),('q_09','quest_cianjur_ikm_14','cat_05','Kecepatan tindak lanjut rumah sakit atas keluhan atau saran pasien','LIKERT_5',NULL,1,1.00,9,'2026-09-14 05:42:55'),('q_10','quest_cianjur_ikm_14','cat_01','Kejelasan informasi petunjuk arah, jadwal dokter, dan alur pendaftaran','LIKERT_5',NULL,1,1.00,10,'2026-09-14 05:42:55'),('q_11','quest_cianjur_ikm_14','cat_04','Kerapian dan kesiapan fasilitas peralatan medis yang digunakan','LIKERT_5',NULL,1,1.00,11,'2026-09-14 05:42:55'),('q_12','quest_cianjur_ikm_14','cat_05','Ketanggapan petugas dalam menangani kondisi darurat atau pertanyaan keluarga','LIKERT_5',NULL,1,1.00,12,'2026-09-14 05:42:55'),('q_13','quest_cianjur_ikm_14','cat_03','Ketersediaan dan kejelasan penjelasan aturan minum obat di farmasi','LIKERT_5',NULL,1,1.00,13,'2026-09-14 05:42:55'),('q_14','quest_cianjur_ikm_14','cat_04','Kenyamanan sirkulasi udara, pencahayaan, dan keamanan di lingkungan RS','LIKERT_5',NULL,1,1.00,14,'2026-09-14 05:42:55'),('q_rshs_1','quest_rshs_ikm','cat_rshs_main','Kemudahan persyaratan pelayanan yang harus dipenuhi pasien/keluarga','LIKERT_5',NULL,1,1.00,1,'2026-09-14 05:42:55'),('q_rshs_2','quest_rshs_ikm','cat_rshs_main','Kemudahan alur dan prosedur pelayanan di unit ini','LIKERT_5',NULL,1,1.00,2,'2026-09-14 05:42:55'),('q_rshs_3','quest_rshs_ikm','cat_rshs_main','Kecepatan dan ketepatan waktu pemberian pelayanan oleh petugas','LIKERT_5',NULL,1,1.00,3,'2026-09-14 05:42:55'),('q_rshs_4','quest_rshs_ikm','cat_rshs_main','Kesesuaian dan transparansi biaya/tarif pelayanan dengan ketentuan resmi','LIKERT_5',NULL,1,1.00,4,'2026-09-14 05:42:55'),('q_rshs_5','quest_rshs_ikm','cat_rshs_main','Kesesuaian produk pelayanan yang diterima dengan standar yang dijanjikan','LIKERT_5',NULL,1,1.00,5,'2026-09-14 05:42:55'),('q_rshs_6','quest_rshs_ikm','cat_rshs_main','Kompetensi, keterampilan, dan keahlian tenaga medis dalam melayani','LIKERT_5',NULL,1,1.00,6,'2026-09-14 05:42:55'),('q_rshs_7','quest_rshs_ikm','cat_rshs_main','Keramahan, kesopanan, dan kepedulian sikap petugas pelayanan','LIKERT_5',NULL,1,1.00,7,'2026-09-14 05:42:55'),('q_rshs_8','quest_rshs_ikm','cat_rshs_main','Kualitas, kebersihan, dan kenyamanan sarana ruang tunggu dan toilet','LIKERT_5',NULL,1,1.00,8,'2026-09-14 05:42:55'),('q_rshs_9','quest_rshs_ikm','cat_rshs_main','Kecepatan tindak lanjut rumah sakit atas keluhan atau saran pasien','LIKERT_5',NULL,1,1.00,9,'2026-09-14 05:42:55'),('q_rsud-karawang_1','quest_rsud-karawang_ikm','cat_rsud-karawang_main','Kemudahan persyaratan pelayanan yang harus dipenuhi pasien/keluarga','LIKERT_5',NULL,1,1.00,1,'2026-09-14 05:42:55'),('q_rsud-karawang_2','quest_rsud-karawang_ikm','cat_rsud-karawang_main','Kemudahan alur dan prosedur pelayanan di unit ini','LIKERT_5',NULL,1,1.00,2,'2026-09-14 05:42:55'),('q_rsud-karawang_3','quest_rsud-karawang_ikm','cat_rsud-karawang_main','Kecepatan dan ketepatan waktu pemberian pelayanan oleh petugas','LIKERT_5',NULL,1,1.00,3,'2026-09-14 05:42:55'),('q_rsud-karawang_4','quest_rsud-karawang_ikm','cat_rsud-karawang_main','Kesesuaian dan transparansi biaya/tarif pelayanan dengan ketentuan resmi','LIKERT_5',NULL,1,1.00,4,'2026-09-14 05:42:55'),('q_rsud-karawang_5','quest_rsud-karawang_ikm','cat_rsud-karawang_main','Kesesuaian produk pelayanan yang diterima dengan standar yang dijanjikan','LIKERT_5',NULL,1,1.00,5,'2026-09-14 05:42:55'),('q_rsud-karawang_6','quest_rsud-karawang_ikm','cat_rsud-karawang_main','Kompetensi, keterampilan, dan keahlian tenaga medis dalam melayani','LIKERT_5',NULL,1,1.00,6,'2026-09-14 05:42:55'),('q_rsud-karawang_7','quest_rsud-karawang_ikm','cat_rsud-karawang_main','Keramahan, kesopanan, dan kepedulian sikap petugas pelayanan','LIKERT_5',NULL,1,1.00,7,'2026-09-14 05:42:55'),('q_rsud-karawang_8','quest_rsud-karawang_ikm','cat_rsud-karawang_main','Kualitas, kebersihan, dan kenyamanan sarana ruang tunggu dan toilet','LIKERT_5',NULL,1,1.00,8,'2026-09-14 05:42:55'),('q_rsud-karawang_9','quest_rsud-karawang_ikm','cat_rsud-karawang_main','Kecepatan tindak lanjut rumah sakit atas keluhan atau saran pasien','LIKERT_5',NULL,1,1.00,9,'2026-09-14 05:42:55');
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `respondents`
--

DROP TABLE IF EXISTS `respondents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `respondents` (
  `id` varchar(26) NOT NULL,
  `code` varchar(30) NOT NULL,
  `hospital_id` varchar(26) NOT NULL,
  `period_id` varchar(26) NOT NULL,
  `unit_id` varchar(26) NOT NULL,
  `age_range` varchar(20) DEFAULT NULL,
  `gender` enum('MALE','FEMALE','OTHER','UNSPECIFIED') DEFAULT 'UNSPECIFIED',
  `education` varchar(50) DEFAULT NULL,
  `occupation` varchar(80) DEFAULT NULL,
  `ip_hash` varchar(64) DEFAULT NULL,
  `session_fingerprint` varchar(64) DEFAULT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `respondents_code_unique` (`code`),
  KEY `idx_respondents_hospital_period` (`hospital_id`,`period_id`),
  KEY `idx_respondents_unit` (`unit_id`,`submitted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `respondents`
--

LOCK TABLES `respondents` WRITE;
/*!40000 ALTER TABLE `respondents` DISABLE KEYS */;
INSERT INTO `respondents` VALUES ('resp_cianjur_001','RES-2025-100001','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_poli','26-35','FEMALE','Diploma (D3)','PNS / ASN','ba753efa2015157bd094d405599223a50af144ea30c22ce5755f88d0aca95845','3a1d7b6848ba4816d72ee2f2d98b95b46e0f0aa0581ce7d46ff561935316e1b4','2026-08-16 08:42:55'),('resp_cianjur_002','RES-2025-100002','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_rawat_inap','36-45','MALE','Sarjana (S1)','Wiraswasta','734d6b3fb4778119bbf7010d94157466f40f860a003f057574e1d066d58b6c3d','c21260d59ec18c21290931f0777a853b66303efe528de76485b2c974ee6a0490','2026-08-16 22:42:55'),('resp_cianjur_003','RES-2025-100003','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_farmasi','46-60','FEMALE','SMP','Ibu Rumah Tangga','4088220d560a503ec6eff649b578efcdf792e8b8931dd2696826804478af3d2b','e27c90338d0951bd86dfdeece2dd9e2360f2f9958ad957abffea78dbc16b65e6','2026-08-17 12:42:55'),('resp_cianjur_004','RES-2025-100004','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_lab','>60','MALE','Magister (S2)','Mahasiswa','38c3b95d6ba403febf1e2add6d401d29797feb40ccdc49c0204ec34549b0102a','822584b2c67cc02963db6d8fff1a9e1c6775fdc8e684f7e8f90b8123f694b274','2026-08-18 02:42:55'),('resp_cianjur_005','RES-2025-100005','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_radiologi','17-25','FEMALE','SMA / Sederajat','Karyawan Swasta','c0096e7df394a6ba5e4d4dbae1ae1604b9ef342d7ac69e836e40c474a8ccd59e','df9c7f6d462800fea47dab93684edc3a7e07b5ef957757ebe8648b90f0516013','2026-08-18 16:42:55'),('resp_cianjur_006','RES-2025-100006','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_kasir','26-35','MALE','Diploma (D3)','PNS / ASN','998788e0f2eaf59156bc86fd67f78597e795f6e82e26d10f221ded470a00bbcc','fbce594eb3819241e34b0abba3bde7ec3202449a7cb93c2a4042fa1a0c162909','2026-08-19 06:42:55'),('resp_cianjur_007','RES-2025-100007','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_pendaftaran','36-45','FEMALE','Sarjana (S1)','Wiraswasta','5ca643c62787ef22d5bd41e501dc692969ec053b103bcdddb35e0520e2fc2fb5','8504ed062c7efeb38d4451f9b2d8b81e6d877939b1826fcf1920dbb9b97b25a9','2026-08-19 20:42:55'),('resp_cianjur_008','RES-2025-100008','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_hemodialisa','46-60','MALE','SMP','Ibu Rumah Tangga','7f44c49a485a7e0165ff68f6e79dbf5575fa97fd32f97c74d15790bd0021262a','383e6d13044307c837ec15c939632f4db73d9127eb5ec299149a221b058638fb','2026-08-20 10:42:55'),('resp_cianjur_009','RES-2025-100009','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_icu','>60','FEMALE','Magister (S2)','Mahasiswa','8d6dd59fcb9d94f78077ea9ac8b69bc7deb27efc69240e7c4a283f503c3c4685','b6b64a41c2919e417747740cbf4fefe2eccb3a458bce00e7dba1e02685e70729','2026-08-21 00:42:55'),('resp_cianjur_010','RES-2025-100010','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_igd','17-25','MALE','SMA / Sederajat','Karyawan Swasta','552354592821b7e6b76f87d10c0cb4ff512ffed049dde0e40769a0bcf9f50c8d','2aa738bd2d317dfb0a6690deb07952085f78f0989ea13fbceb667cd5b899a2c5','2026-08-21 14:42:55'),('resp_cianjur_011','RES-2025-100011','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_poli','26-35','FEMALE','Diploma (D3)','PNS / ASN','edb785f1afeec4e108230b124f33c21952078486afe599f6dd6d460eef26c848','574000dd2705722c5769eed068fcc2c9867332db8976b1e483b57c54a7704cca','2026-08-22 04:42:55'),('resp_cianjur_012','RES-2025-100012','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_rawat_inap','36-45','MALE','Sarjana (S1)','Wiraswasta','3e96d8732051b54fef2ae0c914fb09658c3defa513f6bbd274e73ccd57f59fc4','318330c0b853e5568a67d70f9ad424aaae49b8b066535b713196755c1b09d6a5','2026-08-22 18:42:55'),('resp_cianjur_013','RES-2025-100013','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_farmasi','46-60','FEMALE','SMP','Ibu Rumah Tangga','cc6b08f9e38f604b3b318293a83ebb79d6cfa7bf184d46ff6ce45d627f2d73e2','209b0d3325245ca99a66ae38100b80253718321a6d2d02a9d04981852045e6c3','2026-08-23 08:42:55'),('resp_cianjur_014','RES-2025-100014','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_lab','>60','MALE','Magister (S2)','Mahasiswa','f440a732cc54e779639fbf19d215a88f1217707f240e01f02b547bbeedeee466','a54a511bcc9ae9088eace2f3c4aeba14591c5bfa3285dfc4ebeaf4e0f39ef04b','2026-08-23 22:42:55'),('resp_cianjur_015','RES-2025-100015','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_radiologi','17-25','FEMALE','SMA / Sederajat','Karyawan Swasta','6727123bdea2a7847465260a70b2e8c9fff01ae3d77a3baf902b23285f3170c8','b0a6721da6c6bd9f2740155bf01474a83512fe7c0517b377c96bbb080716488f','2026-08-24 12:42:55'),('resp_cianjur_016','RES-2025-100016','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_kasir','26-35','MALE','Diploma (D3)','PNS / ASN','4a215f75cb8bb56a05b61762b8a63f93b0f0d0070e27947ff9faafc7c13470d6','a5089dd3303d15131c8b54efaa35935706b61f83312d304765cc6f1253e3f956','2026-08-25 02:42:55'),('resp_cianjur_017','RES-2025-100017','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_pendaftaran','36-45','FEMALE','Sarjana (S1)','Wiraswasta','a17dc9ec6f7f44674551e8bac32c2bd75f2fb7929c71decf01672f6c98d9fb8b','a28d3d86a39697d7985ac42a9ac40604df0ccf98e5102095cec8eef5134d24ad','2026-08-25 16:42:55'),('resp_cianjur_018','RES-2025-100018','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_hemodialisa','46-60','MALE','SMP','Ibu Rumah Tangga','7628acfc85480dc04e588b4d14f117550e3a888b44f3bf83cab7b94a3b432d18','21f507c9d745ccf71a70ca3b5e4de12ca6a2eb5e467335e3ce4cb90a04ea47d7','2026-08-26 06:42:55'),('resp_cianjur_019','RES-2025-100019','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_icu','>60','FEMALE','Magister (S2)','Mahasiswa','38f2bc40b11a0b4ef4748bd3b749c485de2fadd1512226f79a99b3ec0dd66311','a5d297901a37fa9738c6337f70219ee958fecdf8df501a6f93ac069b7647f993','2026-08-26 20:42:55'),('resp_cianjur_020','RES-2025-100020','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_igd','17-25','MALE','SMA / Sederajat','Karyawan Swasta','4f4393c6b387ecd2aeb4127d432f243df37107617a8cdc8c8db24ceefc1a222c','13d246d795c82b06aab60cd4fa3ba394937b2456df85f30312748f4bf47236b4','2026-08-27 10:42:55'),('resp_cianjur_021','RES-2025-100021','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_poli','26-35','FEMALE','Diploma (D3)','PNS / ASN','4b07c45518eb605469b36ad62f1f68558e0e404616404d4b2135543d324522b4','4b6c866311b898078373582ab047fabaf69879d6bb3bcd92886dade1b6b90a5c','2026-08-28 00:42:55'),('resp_cianjur_022','RES-2025-100022','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_rawat_inap','36-45','MALE','Sarjana (S1)','Wiraswasta','d78b66ce9dbd5e1d82d308e10769e0804f495f47e5e5b6890304190d6b4f6478','b504951a2fc924669415bcb62efae677c82725a80b48a1907c564495a508c54a','2026-08-28 14:42:55'),('resp_cianjur_023','RES-2025-100023','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_farmasi','46-60','FEMALE','SMP','Ibu Rumah Tangga','aa66341ec6fddde35c237b1bf5c0a2f007e5892b4a9dd11a3619f3da58bb27d7','021f3c3165ad58b653ce068eb2d6de385fd5d5ba0dba8e319ed0d6e90735a0c0','2026-08-29 04:42:55'),('resp_cianjur_024','RES-2025-100024','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_lab','>60','MALE','Magister (S2)','Mahasiswa','44de453b798b6602d02e04aaca03d4262b7f1122d51c7308f8b7df315028d2e7','a4cd837c82018a0c459d8bedb69b8cffac6c7a6925d1186f63a36389e9f4f9f1','2026-08-29 18:42:55'),('resp_cianjur_025','RES-2025-100025','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_radiologi','17-25','FEMALE','SMA / Sederajat','Karyawan Swasta','d49b5daa63f30a308b2eb2729ef5b05af471333bbd58f8807d5385ef70fc8249','bca75cc93d8228c23a2f640bd68d7ec7d60227444e8a6c58f017b1a47de4c49f','2026-08-30 08:42:55'),('resp_cianjur_026','RES-2025-100026','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_kasir','26-35','MALE','Diploma (D3)','PNS / ASN','c950bc3c71206a17e8f465938767914a203c4ce79dc9016d2b128e983571668a','316a5f2ab04a450609e4557141b1a3325b7d2b8617625cf50da683e5a41c92ff','2026-08-30 22:42:55'),('resp_cianjur_027','RES-2025-100027','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_pendaftaran','36-45','FEMALE','Sarjana (S1)','Wiraswasta','3f94995ceabc89818c8c72891c462cbe183d8d56c45c94da45df37b28e30132e','e43752d2cb0d9e77cd494ce86fcb8364d1771e3080827b4614c1207521f88615','2026-08-31 12:42:55'),('resp_cianjur_028','RES-2025-100028','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_hemodialisa','46-60','MALE','SMP','Ibu Rumah Tangga','3e756943455d85ad43c492ff2999d680b991dd785e0dd764076ac612100b815f','42a3ec7f5bda6ac6bfe5efa6c793d6e3bf180215aca3a7d91e39f94d123eb9ea','2026-09-01 02:42:55'),('resp_cianjur_029','RES-2025-100029','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_icu','>60','FEMALE','Magister (S2)','Mahasiswa','3d74fcf969db2a409f42286c6fd6ebe55d408efaffb460340e5b57c78fe50ebf','906ba13f506ec9f00621d2d0d39103ebb531f71b7c08682a77ec9fe67c07f853','2026-09-01 16:42:55'),('resp_cianjur_030','RES-2025-100030','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_igd','17-25','MALE','SMA / Sederajat','Karyawan Swasta','2f3777ee1aca092d2da3b591acf67812e4b45e871c15f8c8c2b7ce2f4288f197','627fed6314c7276a23c9fbb9056c46cc7a986340461988cc09b680d608f58bfa','2026-09-02 06:42:55'),('resp_cianjur_031','RES-2025-100031','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_poli','26-35','FEMALE','Diploma (D3)','PNS / ASN','93c76785ddf0262ef241b1f2ee59c2b6b559950458de3527d92ed8ef24b71e0c','307f595da5e8f7abf4a5f33652fd6f5f82c1d00048f873619ab2a559287a46fe','2026-09-02 20:42:55'),('resp_cianjur_032','RES-2025-100032','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_rawat_inap','36-45','MALE','Sarjana (S1)','Wiraswasta','84b4812195edd00eade601ea1bcd88014093567b46b964d901a9ae31220ff9ca','7d92808156cbd86f8b05417fbfb35f6907c004f0099324084e3775c688e9ad9e','2026-09-03 10:42:55'),('resp_cianjur_033','RES-2025-100033','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_farmasi','46-60','FEMALE','SMP','Ibu Rumah Tangga','efcc47b3eea2435e219fa21f0a1e0731133963208a1483e5dfd3a22e38e1fe03','7565da98fd4d9626ef57a527cee14e72426c3ac92e487a015e35da10cfa397eb','2026-09-04 00:42:55'),('resp_cianjur_034','RES-2025-100034','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_lab','>60','MALE','Magister (S2)','Mahasiswa','629e1bbe393416d676e9c8a1cc823029e9f25a8b5452ddb4701ab388d18d375f','dc1fb99bfcf683c9358a45231454423a8c6e4b52dae9bdec1318117d0962a766','2026-09-04 14:42:55'),('resp_cianjur_035','RES-2025-100035','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_radiologi','17-25','FEMALE','SMA / Sederajat','Karyawan Swasta','c1671d4e1ccf1954d2fa64da98153d600febc3e238a5eb4bfd8440f539b09cfd','37eb97cdefcb955322902c93af1a0ed6f9fafc9707117be2ae949a96cf94a1f7','2026-09-05 04:42:55'),('resp_cianjur_036','RES-2025-100036','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_kasir','26-35','MALE','Diploma (D3)','PNS / ASN','67c3192e470b5c241bb8ac1b095828f1dbceff9f86e702685bde8f3de4c2be4c','c4cb97f5d7aa74c2871380508fd0aaacfbb45c129c78e9506b4221420e5cd237','2026-09-05 18:42:55'),('resp_cianjur_037','RES-2025-100037','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_pendaftaran','36-45','FEMALE','Sarjana (S1)','Wiraswasta','a36cafa65ef55934cfc778695ff5a4daa9b293244500f79491d9d1c789593707','c41d5b8d56d26ce423655a61c96afdf8e5a764b31d1f6be4ecba8c6cecea71e4','2026-09-06 08:42:55'),('resp_cianjur_038','RES-2025-100038','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_hemodialisa','46-60','MALE','SMP','Ibu Rumah Tangga','4e01a8805564639ddead65ba9d2a369f0380ac07e4d2565de1849a6f9e4601c8','dc1ef1126dc7606f3232b7df4ca5aa9481970f1a910f26a9d1ce16075b7bbd72','2026-09-06 22:42:55'),('resp_cianjur_039','RES-2025-100039','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_icu','>60','FEMALE','Magister (S2)','Mahasiswa','b7e96f1e97f1b71043ab5f477436da9398409541a8bf367cfd99efb406f3753c','43acfda85e8dcee2392a4650eb6575f91c709b4edabf1e9e30a40d6a151ecf06','2026-09-07 12:42:55'),('resp_cianjur_040','RES-2025-100040','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_igd','17-25','MALE','SMA / Sederajat','Karyawan Swasta','725b4c8929840ff6c88be48f3ea31e88d7b44485de136c65a1b90965874d17d5','b9de80ce62a2b779f659a9a5cb01330d817ff86c1229fb8d93f0d442864c6a9a','2026-09-08 02:42:55'),('resp_cianjur_041','RES-2025-100041','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_poli','26-35','FEMALE','Diploma (D3)','PNS / ASN','85a6d6d04188bc6d321fb4eb7dff07afb729397307901d9c542c5e52dd44e8cc','e3b0acc64de65b02b734086f32766c486fd57f6e1daeadd6518c172f3b3e5a06','2026-09-08 16:42:55'),('resp_cianjur_042','RES-2025-100042','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_rawat_inap','36-45','MALE','Sarjana (S1)','Wiraswasta','f4d64990e150201f5885d048353a04239c036cfdd6a0cb91e6082e1ac31ce8e0','1b37288a3dc7f38c1b7596678732f8abb861814baa0647fe6a8e97aa475e4768','2026-09-09 06:42:55'),('resp_cianjur_043','RES-2025-100043','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_farmasi','46-60','FEMALE','SMP','Ibu Rumah Tangga','c8624d25341699e297408b608797e42c342a62a97db8c7eb8bed2dd21468dd07','025bb2dc4bbb7fcc580a6d5390cc1890d5f2782c6a64cf79bbc90c9096cd5b81','2026-09-09 20:42:55'),('resp_cianjur_044','RES-2025-100044','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_lab','>60','MALE','Magister (S2)','Mahasiswa','7e72d9c58638854f01c817197acbc93516031f1db5961315400492e9fc0bbbca','96e08f65161c37f8efbb802224628bdef7544d85af4366134d4aebbad3f4079e','2026-09-10 10:42:55'),('resp_cianjur_045','RES-2025-100045','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_radiologi','17-25','FEMALE','SMA / Sederajat','Karyawan Swasta','de8838000814009fc32142e4121a9599df8aa9d69ffbb72f7b9ecbb677904e82','e9ab33575cccb8f0c1dc7ee3e1dea0733ff57245a57098fadbe684c67b33d158','2026-09-11 00:42:55'),('resp_cianjur_046','RES-2025-100046','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_kasir','26-35','MALE','Diploma (D3)','PNS / ASN','377229a1ec807b5601f266a06aa173aedeb3c71c097f7a960f3ac3292146bf7a','bf562a06cbb9142f1aedfeebe4a0c673d75d83c1f484006045703477af72f54b','2026-09-11 14:42:55'),('resp_cianjur_047','RES-2025-100047','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_pendaftaran','36-45','FEMALE','Sarjana (S1)','Wiraswasta','7fbab0f422be4a8023e53e3f6caeaa62f7a9c9f775cf0639caa687ccd2f7f157','7af108a04dddb1417b69db5ad910827d77f6e67ee08963f76e81e905a5b23f2d','2026-09-12 04:42:55'),('resp_cianjur_048','RES-2025-100048','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_hemodialisa','46-60','MALE','SMP','Ibu Rumah Tangga','4198ae77f7025686dffa29a3daf0742db0376f38de512f7ad3cff6e961190b99','699679a5dd94e8854efb6cb783343bd73fe44052b7b49a26e4cb748d6ac9e8ec','2026-09-12 18:42:55'),('resp_cianjur_049','RES-2025-100049','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_icu','>60','FEMALE','Magister (S2)','Mahasiswa','2b20540ab0f12677104b40113c3046eb68fc02c5ffea0b4b962f29a45c8fa71d','979442b1474f6d9db4ef3d15f224d8542d18ba6a417f71b1daa7ae493f76c27e','2026-09-13 08:42:55'),('resp_cianjur_050','RES-2025-100050','hosp_rsud_cianjur_01','period_cianjur_2025_t1','u_cianjur_igd','17-25','MALE','SMA / Sederajat','Karyawan Swasta','805ebf201c523f69376591c6ce5ceb3f12ebcfedad297c5f175a380426cf0b42','c13a639014177d8a4b6a43fddaff209d3fc5e3f62ed6da708f728ed4749c8263','2026-09-13 22:42:55');
/*!40000 ALTER TABLE `respondents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_units`
--

DROP TABLE IF EXISTS `service_units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `service_units` (
  `id` varchar(26) NOT NULL,
  `hospital_id` varchar(26) NOT NULL,
  `code` varchar(20) NOT NULL,
  `name` varchar(120) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_units_hospital_code` (`hospital_id`,`code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_units`
--

LOCK TABLES `service_units` WRITE;
/*!40000 ALTER TABLE `service_units` DISABLE KEYS */;
INSERT INTO `service_units` VALUES ('u_cianjur_farmasi','hosp_rsud_cianjur_01','FARMASI','Instalasi Farmasi & Apotek','Pelayanan resep obat dan konseling farmasi',1,'2026-09-14 05:42:54','2026-09-14 05:42:54'),('u_cianjur_hemodialisa','hosp_rsud_cianjur_01','HEMODIALISA','Unit Hemodialisa (Cuci Darah)','Pelayanan cuci darah pasien gagal ginjal',1,'2026-09-14 05:42:54','2026-09-14 05:42:54'),('u_cianjur_icu','hosp_rsud_cianjur_01','ICU','Intensive Care Unit (ICU / ICCU)','Perawatan intensif dan kritis',1,'2026-09-14 05:42:54','2026-09-14 05:42:54'),('u_cianjur_igd','hosp_rsud_cianjur_01','IGD','Instalasi Gawat Darurat (IGD)','Pelayanan gawat darurat medis 24 jam',1,'2026-09-14 05:42:54','2026-09-14 05:42:54'),('u_cianjur_kasir','hosp_rsud_cianjur_01','KASIR','Kasir & Pembayaran Pasien','Administrasi keuangan, BPJS, dan umum',1,'2026-09-14 05:42:54','2026-09-14 05:42:54'),('u_cianjur_lab','hosp_rsud_cianjur_01','LAB','Laboratorium Patologi Klinik','Pemeriksaan darah, urine, dan spesimen klinik',1,'2026-09-14 05:42:54','2026-09-14 05:42:54'),('u_cianjur_pendaftaran','hosp_rsud_cianjur_01','PENDAFTARAN','Pendaftaran & Rekam Medis','Loket registrasi pasien baru dan rujukan',1,'2026-09-14 05:42:54','2026-09-14 05:42:54'),('u_cianjur_poli','hosp_rsud_cianjur_01','POLI','Rawat Jalan / Poliklinik Spesialis','Layanan poli spesialis dan konsul medis',1,'2026-09-14 05:42:54','2026-09-14 05:42:54'),('u_cianjur_radiologi','hosp_rsud_cianjur_01','RADIOLOGI','Instalasi Radiologi & Imaging','Rontgen, CT Scan, USG, dan MRI',1,'2026-09-14 05:42:54','2026-09-14 05:42:54'),('u_cianjur_rawat_inap','hosp_rsud_cianjur_01','RAWAT_INAP','Instalasi Rawat Inap','Perawatan inap VIP, Kelas 1, 2, dan 3',1,'2026-09-14 05:42:54','2026-09-14 05:42:54'),('u_karawang_farmasi','hosp_rsud_karawang_02','FARMASI','Instalasi Farmasi & Apotek','Pelayanan resep obat dan konseling farmasi',1,'2026-09-14 05:42:54','2026-09-14 05:42:54'),('u_karawang_hemodialisa','hosp_rsud_karawang_02','HEMODIALISA','Unit Hemodialisa (Cuci Darah)','Pelayanan cuci darah pasien gagal ginjal',1,'2026-09-14 05:42:54','2026-09-14 05:42:54'),('u_karawang_icu','hosp_rsud_karawang_02','ICU','Intensive Care Unit (ICU / ICCU)','Perawatan intensif dan kritis',1,'2026-09-14 05:42:54','2026-09-14 05:42:54'),('u_karawang_igd','hosp_rsud_karawang_02','IGD','Instalasi Gawat Darurat (IGD)','Pelayanan gawat darurat medis 24 jam',1,'2026-09-14 05:42:54','2026-09-14 05:42:54'),('u_karawang_kasir','hosp_rsud_karawang_02','KASIR','Kasir & Pembayaran Pasien','Administrasi keuangan, BPJS, dan umum',1,'2026-09-14 05:42:54','2026-09-14 05:42:54'),('u_karawang_lab','hosp_rsud_karawang_02','LAB','Laboratorium Patologi Klinik','Pemeriksaan darah, urine, dan spesimen klinik',1,'2026-09-14 05:42:54','2026-09-14 05:42:54'),('u_karawang_pendaftaran','hosp_rsud_karawang_02','PENDAFTARAN','Pendaftaran & Rekam Medis','Loket registrasi pasien baru dan rujukan',1,'2026-09-14 05:42:54','2026-09-14 05:42:54'),('u_karawang_poli','hosp_rsud_karawang_02','POLI','Rawat Jalan / Poliklinik Spesialis','Layanan poli spesialis dan konsul medis',1,'2026-09-14 05:42:54','2026-09-14 05:42:54'),('u_karawang_radiologi','hosp_rsud_karawang_02','RADIOLOGI','Instalasi Radiologi & Imaging','Rontgen, CT Scan, USG, dan MRI',1,'2026-09-14 05:42:54','2026-09-14 05:42:54'),('u_karawang_rawat_inap','hosp_rsud_karawang_02','RAWAT_INAP','Instalasi Rawat Inap','Perawatan inap VIP, Kelas 1, 2, dan 3',1,'2026-09-14 05:42:54','2026-09-14 05:42:54'),('u_rshs_farmasi','hosp_rshs_bandung_03','FARMASI','Instalasi Farmasi & Apotek','Pelayanan resep obat dan konseling farmasi',1,'2026-09-14 05:42:54','2026-09-14 05:42:54'),('u_rshs_hemodialisa','hosp_rshs_bandung_03','HEMODIALISA','Unit Hemodialisa (Cuci Darah)','Pelayanan cuci darah pasien gagal ginjal',1,'2026-09-14 05:42:54','2026-09-14 05:42:54'),('u_rshs_icu','hosp_rshs_bandung_03','ICU','Intensive Care Unit (ICU / ICCU)','Perawatan intensif dan kritis',1,'2026-09-14 05:42:54','2026-09-14 05:42:54'),('u_rshs_igd','hosp_rshs_bandung_03','IGD','Instalasi Gawat Darurat (IGD)','Pelayanan gawat darurat medis 24 jam',1,'2026-09-14 05:42:54','2026-09-14 05:42:54'),('u_rshs_kasir','hosp_rshs_bandung_03','KASIR','Kasir & Pembayaran Pasien','Administrasi keuangan, BPJS, dan umum',1,'2026-09-14 05:42:54','2026-09-14 05:42:54'),('u_rshs_lab','hosp_rshs_bandung_03','LAB','Laboratorium Patologi Klinik','Pemeriksaan darah, urine, dan spesimen klinik',1,'2026-09-14 05:42:54','2026-09-14 05:42:54'),('u_rshs_pendaftaran','hosp_rshs_bandung_03','PENDAFTARAN','Pendaftaran & Rekam Medis','Loket registrasi pasien baru dan rujukan',1,'2026-09-14 05:42:54','2026-09-14 05:42:54'),('u_rshs_poli','hosp_rshs_bandung_03','POLI','Rawat Jalan / Poliklinik Spesialis','Layanan poli spesialis dan konsul medis',1,'2026-09-14 05:42:54','2026-09-14 05:42:54'),('u_rshs_radiologi','hosp_rshs_bandung_03','RADIOLOGI','Instalasi Radiologi & Imaging','Rontgen, CT Scan, USG, dan MRI',1,'2026-09-14 05:42:54','2026-09-14 05:42:54'),('u_rshs_rawat_inap','hosp_rshs_bandung_03','RAWAT_INAP','Instalasi Rawat Inap','Perawatan inap VIP, Kelas 1, 2, dan 3',1,'2026-09-14 05:42:54','2026-09-14 05:42:54');
/*!40000 ALTER TABLE `service_units` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `survey_answers`
--

DROP TABLE IF EXISTS `survey_answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `survey_answers` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `response_id` varchar(26) NOT NULL,
  `question_id` varchar(26) NOT NULL,
  `likert_value` int(11) DEFAULT NULL,
  `choice_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`choice_values`)),
  `text_value` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=701 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `survey_answers`
--

LOCK TABLES `survey_answers` WRITE;
/*!40000 ALTER TABLE `survey_answers` DISABLE KEYS */;
INSERT INTO `survey_answers` VALUES (1,'sresp_cianjur_001','q_01',4,NULL,NULL),(2,'sresp_cianjur_001','q_02',5,NULL,NULL),(3,'sresp_cianjur_001','q_03',4,NULL,NULL),(4,'sresp_cianjur_001','q_04',3,NULL,NULL),(5,'sresp_cianjur_001','q_05',5,NULL,NULL),(6,'sresp_cianjur_001','q_06',2,NULL,NULL),(7,'sresp_cianjur_001','q_07',2,NULL,NULL),(8,'sresp_cianjur_001','q_08',3,NULL,NULL),(9,'sresp_cianjur_001','q_09',3,NULL,NULL),(10,'sresp_cianjur_001','q_10',3,NULL,NULL),(11,'sresp_cianjur_001','q_11',5,NULL,NULL),(12,'sresp_cianjur_001','q_12',5,NULL,NULL),(13,'sresp_cianjur_001','q_13',5,NULL,NULL),(14,'sresp_cianjur_001','q_14',5,NULL,NULL),(15,'sresp_cianjur_002','q_01',5,NULL,NULL),(16,'sresp_cianjur_002','q_02',3,NULL,NULL),(17,'sresp_cianjur_002','q_03',5,NULL,NULL),(18,'sresp_cianjur_002','q_04',5,NULL,NULL),(19,'sresp_cianjur_002','q_05',5,NULL,NULL),(20,'sresp_cianjur_002','q_06',4,NULL,NULL),(21,'sresp_cianjur_002','q_07',4,NULL,NULL),(22,'sresp_cianjur_002','q_08',3,NULL,NULL),(23,'sresp_cianjur_002','q_09',5,NULL,NULL),(24,'sresp_cianjur_002','q_10',5,NULL,NULL),(25,'sresp_cianjur_002','q_11',4,NULL,NULL),(26,'sresp_cianjur_002','q_12',3,NULL,NULL),(27,'sresp_cianjur_002','q_13',5,NULL,NULL),(28,'sresp_cianjur_002','q_14',4,NULL,NULL),(29,'sresp_cianjur_003','q_01',2,NULL,NULL),(30,'sresp_cianjur_003','q_02',5,NULL,NULL),(31,'sresp_cianjur_003','q_03',5,NULL,NULL),(32,'sresp_cianjur_003','q_04',2,NULL,NULL),(33,'sresp_cianjur_003','q_05',4,NULL,NULL),(34,'sresp_cianjur_003','q_06',5,NULL,NULL),(35,'sresp_cianjur_003','q_07',5,NULL,NULL),(36,'sresp_cianjur_003','q_08',5,NULL,NULL),(37,'sresp_cianjur_003','q_09',5,NULL,NULL),(38,'sresp_cianjur_003','q_10',5,NULL,NULL),(39,'sresp_cianjur_003','q_11',5,NULL,NULL),(40,'sresp_cianjur_003','q_12',5,NULL,NULL),(41,'sresp_cianjur_003','q_13',4,NULL,NULL),(42,'sresp_cianjur_003','q_14',5,NULL,NULL),(43,'sresp_cianjur_004','q_01',5,NULL,NULL),(44,'sresp_cianjur_004','q_02',5,NULL,NULL),(45,'sresp_cianjur_004','q_03',4,NULL,NULL),(46,'sresp_cianjur_004','q_04',2,NULL,NULL),(47,'sresp_cianjur_004','q_05',5,NULL,NULL),(48,'sresp_cianjur_004','q_06',4,NULL,NULL),(49,'sresp_cianjur_004','q_07',4,NULL,NULL),(50,'sresp_cianjur_004','q_08',5,NULL,NULL),(51,'sresp_cianjur_004','q_09',5,NULL,NULL),(52,'sresp_cianjur_004','q_10',4,NULL,NULL),(53,'sresp_cianjur_004','q_11',3,NULL,NULL),(54,'sresp_cianjur_004','q_12',5,NULL,NULL),(55,'sresp_cianjur_004','q_13',2,NULL,NULL),(56,'sresp_cianjur_004','q_14',5,NULL,NULL),(57,'sresp_cianjur_005','q_01',5,NULL,NULL),(58,'sresp_cianjur_005','q_02',5,NULL,NULL),(59,'sresp_cianjur_005','q_03',4,NULL,NULL),(60,'sresp_cianjur_005','q_04',4,NULL,NULL),(61,'sresp_cianjur_005','q_05',5,NULL,NULL),(62,'sresp_cianjur_005','q_06',5,NULL,NULL),(63,'sresp_cianjur_005','q_07',4,NULL,NULL),(64,'sresp_cianjur_005','q_08',3,NULL,NULL),(65,'sresp_cianjur_005','q_09',4,NULL,NULL),(66,'sresp_cianjur_005','q_10',5,NULL,NULL),(67,'sresp_cianjur_005','q_11',5,NULL,NULL),(68,'sresp_cianjur_005','q_12',4,NULL,NULL),(69,'sresp_cianjur_005','q_13',4,NULL,NULL),(70,'sresp_cianjur_005','q_14',5,NULL,NULL),(71,'sresp_cianjur_006','q_01',4,NULL,NULL),(72,'sresp_cianjur_006','q_02',5,NULL,NULL),(73,'sresp_cianjur_006','q_03',5,NULL,NULL),(74,'sresp_cianjur_006','q_04',3,NULL,NULL),(75,'sresp_cianjur_006','q_05',2,NULL,NULL),(76,'sresp_cianjur_006','q_06',4,NULL,NULL),(77,'sresp_cianjur_006','q_07',4,NULL,NULL),(78,'sresp_cianjur_006','q_08',5,NULL,NULL),(79,'sresp_cianjur_006','q_09',5,NULL,NULL),(80,'sresp_cianjur_006','q_10',4,NULL,NULL),(81,'sresp_cianjur_006','q_11',5,NULL,NULL),(82,'sresp_cianjur_006','q_12',5,NULL,NULL),(83,'sresp_cianjur_006','q_13',4,NULL,NULL),(84,'sresp_cianjur_006','q_14',5,NULL,NULL),(85,'sresp_cianjur_007','q_01',5,NULL,NULL),(86,'sresp_cianjur_007','q_02',4,NULL,NULL),(87,'sresp_cianjur_007','q_03',5,NULL,NULL),(88,'sresp_cianjur_007','q_04',5,NULL,NULL),(89,'sresp_cianjur_007','q_05',2,NULL,NULL),(90,'sresp_cianjur_007','q_06',5,NULL,NULL),(91,'sresp_cianjur_007','q_07',5,NULL,NULL),(92,'sresp_cianjur_007','q_08',5,NULL,NULL),(93,'sresp_cianjur_007','q_09',5,NULL,NULL),(94,'sresp_cianjur_007','q_10',4,NULL,NULL),(95,'sresp_cianjur_007','q_11',3,NULL,NULL),(96,'sresp_cianjur_007','q_12',5,NULL,NULL),(97,'sresp_cianjur_007','q_13',4,NULL,NULL),(98,'sresp_cianjur_007','q_14',5,NULL,NULL),(99,'sresp_cianjur_008','q_01',4,NULL,NULL),(100,'sresp_cianjur_008','q_02',5,NULL,NULL),(101,'sresp_cianjur_008','q_03',2,NULL,NULL),(102,'sresp_cianjur_008','q_04',3,NULL,NULL),(103,'sresp_cianjur_008','q_05',5,NULL,NULL),(104,'sresp_cianjur_008','q_06',5,NULL,NULL),(105,'sresp_cianjur_008','q_07',3,NULL,NULL),(106,'sresp_cianjur_008','q_08',4,NULL,NULL),(107,'sresp_cianjur_008','q_09',5,NULL,NULL),(108,'sresp_cianjur_008','q_10',5,NULL,NULL),(109,'sresp_cianjur_008','q_11',5,NULL,NULL),(110,'sresp_cianjur_008','q_12',5,NULL,NULL),(111,'sresp_cianjur_008','q_13',5,NULL,NULL),(112,'sresp_cianjur_008','q_14',5,NULL,NULL),(113,'sresp_cianjur_009','q_01',4,NULL,NULL),(114,'sresp_cianjur_009','q_02',4,NULL,NULL),(115,'sresp_cianjur_009','q_03',4,NULL,NULL),(116,'sresp_cianjur_009','q_04',3,NULL,NULL),(117,'sresp_cianjur_009','q_05',5,NULL,NULL),(118,'sresp_cianjur_009','q_06',4,NULL,NULL),(119,'sresp_cianjur_009','q_07',5,NULL,NULL),(120,'sresp_cianjur_009','q_08',4,NULL,NULL),(121,'sresp_cianjur_009','q_09',5,NULL,NULL),(122,'sresp_cianjur_009','q_10',4,NULL,NULL),(123,'sresp_cianjur_009','q_11',4,NULL,NULL),(124,'sresp_cianjur_009','q_12',5,NULL,NULL),(125,'sresp_cianjur_009','q_13',5,NULL,NULL),(126,'sresp_cianjur_009','q_14',4,NULL,NULL),(127,'sresp_cianjur_010','q_01',5,NULL,NULL),(128,'sresp_cianjur_010','q_02',5,NULL,NULL),(129,'sresp_cianjur_010','q_03',4,NULL,NULL),(130,'sresp_cianjur_010','q_04',4,NULL,NULL),(131,'sresp_cianjur_010','q_05',3,NULL,NULL),(132,'sresp_cianjur_010','q_06',5,NULL,NULL),(133,'sresp_cianjur_010','q_07',4,NULL,NULL),(134,'sresp_cianjur_010','q_08',5,NULL,NULL),(135,'sresp_cianjur_010','q_09',4,NULL,NULL),(136,'sresp_cianjur_010','q_10',5,NULL,NULL),(137,'sresp_cianjur_010','q_11',5,NULL,NULL),(138,'sresp_cianjur_010','q_12',4,NULL,NULL),(139,'sresp_cianjur_010','q_13',5,NULL,NULL),(140,'sresp_cianjur_010','q_14',4,NULL,NULL),(141,'sresp_cianjur_011','q_01',5,NULL,NULL),(142,'sresp_cianjur_011','q_02',4,NULL,NULL),(143,'sresp_cianjur_011','q_03',4,NULL,NULL),(144,'sresp_cianjur_011','q_04',5,NULL,NULL),(145,'sresp_cianjur_011','q_05',5,NULL,NULL),(146,'sresp_cianjur_011','q_06',5,NULL,NULL),(147,'sresp_cianjur_011','q_07',2,NULL,NULL),(148,'sresp_cianjur_011','q_08',5,NULL,NULL),(149,'sresp_cianjur_011','q_09',5,NULL,NULL),(150,'sresp_cianjur_011','q_10',5,NULL,NULL),(151,'sresp_cianjur_011','q_11',4,NULL,NULL),(152,'sresp_cianjur_011','q_12',5,NULL,NULL),(153,'sresp_cianjur_011','q_13',4,NULL,NULL),(154,'sresp_cianjur_011','q_14',4,NULL,NULL),(155,'sresp_cianjur_012','q_01',3,NULL,NULL),(156,'sresp_cianjur_012','q_02',5,NULL,NULL),(157,'sresp_cianjur_012','q_03',3,NULL,NULL),(158,'sresp_cianjur_012','q_04',5,NULL,NULL),(159,'sresp_cianjur_012','q_05',5,NULL,NULL),(160,'sresp_cianjur_012','q_06',5,NULL,NULL),(161,'sresp_cianjur_012','q_07',5,NULL,NULL),(162,'sresp_cianjur_012','q_08',5,NULL,NULL),(163,'sresp_cianjur_012','q_09',4,NULL,NULL),(164,'sresp_cianjur_012','q_10',5,NULL,NULL),(165,'sresp_cianjur_012','q_11',4,NULL,NULL),(166,'sresp_cianjur_012','q_12',4,NULL,NULL),(167,'sresp_cianjur_012','q_13',5,NULL,NULL),(168,'sresp_cianjur_012','q_14',5,NULL,NULL),(169,'sresp_cianjur_013','q_01',5,NULL,NULL),(170,'sresp_cianjur_013','q_02',5,NULL,NULL),(171,'sresp_cianjur_013','q_03',5,NULL,NULL),(172,'sresp_cianjur_013','q_04',5,NULL,NULL),(173,'sresp_cianjur_013','q_05',5,NULL,NULL),(174,'sresp_cianjur_013','q_06',4,NULL,NULL),(175,'sresp_cianjur_013','q_07',3,NULL,NULL),(176,'sresp_cianjur_013','q_08',4,NULL,NULL),(177,'sresp_cianjur_013','q_09',5,NULL,NULL),(178,'sresp_cianjur_013','q_10',5,NULL,NULL),(179,'sresp_cianjur_013','q_11',4,NULL,NULL),(180,'sresp_cianjur_013','q_12',5,NULL,NULL),(181,'sresp_cianjur_013','q_13',5,NULL,NULL),(182,'sresp_cianjur_013','q_14',2,NULL,NULL),(183,'sresp_cianjur_014','q_01',5,NULL,NULL),(184,'sresp_cianjur_014','q_02',5,NULL,NULL),(185,'sresp_cianjur_014','q_03',3,NULL,NULL),(186,'sresp_cianjur_014','q_04',5,NULL,NULL),(187,'sresp_cianjur_014','q_05',4,NULL,NULL),(188,'sresp_cianjur_014','q_06',4,NULL,NULL),(189,'sresp_cianjur_014','q_07',5,NULL,NULL),(190,'sresp_cianjur_014','q_08',5,NULL,NULL),(191,'sresp_cianjur_014','q_09',4,NULL,NULL),(192,'sresp_cianjur_014','q_10',4,NULL,NULL),(193,'sresp_cianjur_014','q_11',2,NULL,NULL),(194,'sresp_cianjur_014','q_12',4,NULL,NULL),(195,'sresp_cianjur_014','q_13',5,NULL,NULL),(196,'sresp_cianjur_014','q_14',5,NULL,NULL),(197,'sresp_cianjur_015','q_01',5,NULL,NULL),(198,'sresp_cianjur_015','q_02',5,NULL,NULL),(199,'sresp_cianjur_015','q_03',5,NULL,NULL),(200,'sresp_cianjur_015','q_04',4,NULL,NULL),(201,'sresp_cianjur_015','q_05',5,NULL,NULL),(202,'sresp_cianjur_015','q_06',4,NULL,NULL),(203,'sresp_cianjur_015','q_07',3,NULL,NULL),(204,'sresp_cianjur_015','q_08',5,NULL,NULL),(205,'sresp_cianjur_015','q_09',4,NULL,NULL),(206,'sresp_cianjur_015','q_10',4,NULL,NULL),(207,'sresp_cianjur_015','q_11',4,NULL,NULL),(208,'sresp_cianjur_015','q_12',5,NULL,NULL),(209,'sresp_cianjur_015','q_13',5,NULL,NULL),(210,'sresp_cianjur_015','q_14',5,NULL,NULL),(211,'sresp_cianjur_016','q_01',4,NULL,NULL),(212,'sresp_cianjur_016','q_02',4,NULL,NULL),(213,'sresp_cianjur_016','q_03',5,NULL,NULL),(214,'sresp_cianjur_016','q_04',5,NULL,NULL),(215,'sresp_cianjur_016','q_05',5,NULL,NULL),(216,'sresp_cianjur_016','q_06',5,NULL,NULL),(217,'sresp_cianjur_016','q_07',5,NULL,NULL),(218,'sresp_cianjur_016','q_08',5,NULL,NULL),(219,'sresp_cianjur_016','q_09',5,NULL,NULL),(220,'sresp_cianjur_016','q_10',5,NULL,NULL),(221,'sresp_cianjur_016','q_11',4,NULL,NULL),(222,'sresp_cianjur_016','q_12',3,NULL,NULL),(223,'sresp_cianjur_016','q_13',3,NULL,NULL),(224,'sresp_cianjur_016','q_14',5,NULL,NULL),(225,'sresp_cianjur_017','q_01',5,NULL,NULL),(226,'sresp_cianjur_017','q_02',5,NULL,NULL),(227,'sresp_cianjur_017','q_03',5,NULL,NULL),(228,'sresp_cianjur_017','q_04',5,NULL,NULL),(229,'sresp_cianjur_017','q_05',4,NULL,NULL),(230,'sresp_cianjur_017','q_06',5,NULL,NULL),(231,'sresp_cianjur_017','q_07',4,NULL,NULL),(232,'sresp_cianjur_017','q_08',5,NULL,NULL),(233,'sresp_cianjur_017','q_09',2,NULL,NULL),(234,'sresp_cianjur_017','q_10',5,NULL,NULL),(235,'sresp_cianjur_017','q_11',4,NULL,NULL),(236,'sresp_cianjur_017','q_12',4,NULL,NULL),(237,'sresp_cianjur_017','q_13',3,NULL,NULL),(238,'sresp_cianjur_017','q_14',4,NULL,NULL),(239,'sresp_cianjur_018','q_01',5,NULL,NULL),(240,'sresp_cianjur_018','q_02',4,NULL,NULL),(241,'sresp_cianjur_018','q_03',4,NULL,NULL),(242,'sresp_cianjur_018','q_04',5,NULL,NULL),(243,'sresp_cianjur_018','q_05',5,NULL,NULL),(244,'sresp_cianjur_018','q_06',2,NULL,NULL),(245,'sresp_cianjur_018','q_07',5,NULL,NULL),(246,'sresp_cianjur_018','q_08',5,NULL,NULL),(247,'sresp_cianjur_018','q_09',4,NULL,NULL),(248,'sresp_cianjur_018','q_10',4,NULL,NULL),(249,'sresp_cianjur_018','q_11',4,NULL,NULL),(250,'sresp_cianjur_018','q_12',5,NULL,NULL),(251,'sresp_cianjur_018','q_13',2,NULL,NULL),(252,'sresp_cianjur_018','q_14',5,NULL,NULL),(253,'sresp_cianjur_019','q_01',4,NULL,NULL),(254,'sresp_cianjur_019','q_02',5,NULL,NULL),(255,'sresp_cianjur_019','q_03',5,NULL,NULL),(256,'sresp_cianjur_019','q_04',4,NULL,NULL),(257,'sresp_cianjur_019','q_05',4,NULL,NULL),(258,'sresp_cianjur_019','q_06',5,NULL,NULL),(259,'sresp_cianjur_019','q_07',5,NULL,NULL),(260,'sresp_cianjur_019','q_08',5,NULL,NULL),(261,'sresp_cianjur_019','q_09',5,NULL,NULL),(262,'sresp_cianjur_019','q_10',5,NULL,NULL),(263,'sresp_cianjur_019','q_11',4,NULL,NULL),(264,'sresp_cianjur_019','q_12',5,NULL,NULL),(265,'sresp_cianjur_019','q_13',5,NULL,NULL),(266,'sresp_cianjur_019','q_14',3,NULL,NULL),(267,'sresp_cianjur_020','q_01',5,NULL,NULL),(268,'sresp_cianjur_020','q_02',4,NULL,NULL),(269,'sresp_cianjur_020','q_03',4,NULL,NULL),(270,'sresp_cianjur_020','q_04',4,NULL,NULL),(271,'sresp_cianjur_020','q_05',2,NULL,NULL),(272,'sresp_cianjur_020','q_06',3,NULL,NULL),(273,'sresp_cianjur_020','q_07',4,NULL,NULL),(274,'sresp_cianjur_020','q_08',2,NULL,NULL),(275,'sresp_cianjur_020','q_09',5,NULL,NULL),(276,'sresp_cianjur_020','q_10',3,NULL,NULL),(277,'sresp_cianjur_020','q_11',3,NULL,NULL),(278,'sresp_cianjur_020','q_12',5,NULL,NULL),(279,'sresp_cianjur_020','q_13',4,NULL,NULL),(280,'sresp_cianjur_020','q_14',5,NULL,NULL),(281,'sresp_cianjur_021','q_01',3,NULL,NULL),(282,'sresp_cianjur_021','q_02',4,NULL,NULL),(283,'sresp_cianjur_021','q_03',5,NULL,NULL),(284,'sresp_cianjur_021','q_04',4,NULL,NULL),(285,'sresp_cianjur_021','q_05',5,NULL,NULL),(286,'sresp_cianjur_021','q_06',5,NULL,NULL),(287,'sresp_cianjur_021','q_07',3,NULL,NULL),(288,'sresp_cianjur_021','q_08',3,NULL,NULL),(289,'sresp_cianjur_021','q_09',5,NULL,NULL),(290,'sresp_cianjur_021','q_10',5,NULL,NULL),(291,'sresp_cianjur_021','q_11',5,NULL,NULL),(292,'sresp_cianjur_021','q_12',3,NULL,NULL),(293,'sresp_cianjur_021','q_13',3,NULL,NULL),(294,'sresp_cianjur_021','q_14',5,NULL,NULL),(295,'sresp_cianjur_022','q_01',4,NULL,NULL),(296,'sresp_cianjur_022','q_02',5,NULL,NULL),(297,'sresp_cianjur_022','q_03',5,NULL,NULL),(298,'sresp_cianjur_022','q_04',4,NULL,NULL),(299,'sresp_cianjur_022','q_05',5,NULL,NULL),(300,'sresp_cianjur_022','q_06',4,NULL,NULL),(301,'sresp_cianjur_022','q_07',4,NULL,NULL),(302,'sresp_cianjur_022','q_08',5,NULL,NULL),(303,'sresp_cianjur_022','q_09',5,NULL,NULL),(304,'sresp_cianjur_022','q_10',5,NULL,NULL),(305,'sresp_cianjur_022','q_11',5,NULL,NULL),(306,'sresp_cianjur_022','q_12',2,NULL,NULL),(307,'sresp_cianjur_022','q_13',5,NULL,NULL),(308,'sresp_cianjur_022','q_14',5,NULL,NULL),(309,'sresp_cianjur_023','q_01',2,NULL,NULL),(310,'sresp_cianjur_023','q_02',5,NULL,NULL),(311,'sresp_cianjur_023','q_03',5,NULL,NULL),(312,'sresp_cianjur_023','q_04',2,NULL,NULL),(313,'sresp_cianjur_023','q_05',3,NULL,NULL),(314,'sresp_cianjur_023','q_06',5,NULL,NULL),(315,'sresp_cianjur_023','q_07',5,NULL,NULL),(316,'sresp_cianjur_023','q_08',5,NULL,NULL),(317,'sresp_cianjur_023','q_09',4,NULL,NULL),(318,'sresp_cianjur_023','q_10',4,NULL,NULL),(319,'sresp_cianjur_023','q_11',5,NULL,NULL),(320,'sresp_cianjur_023','q_12',5,NULL,NULL),(321,'sresp_cianjur_023','q_13',5,NULL,NULL),(322,'sresp_cianjur_023','q_14',4,NULL,NULL),(323,'sresp_cianjur_024','q_01',5,NULL,NULL),(324,'sresp_cianjur_024','q_02',5,NULL,NULL),(325,'sresp_cianjur_024','q_03',5,NULL,NULL),(326,'sresp_cianjur_024','q_04',3,NULL,NULL),(327,'sresp_cianjur_024','q_05',4,NULL,NULL),(328,'sresp_cianjur_024','q_06',5,NULL,NULL),(329,'sresp_cianjur_024','q_07',5,NULL,NULL),(330,'sresp_cianjur_024','q_08',4,NULL,NULL),(331,'sresp_cianjur_024','q_09',4,NULL,NULL),(332,'sresp_cianjur_024','q_10',5,NULL,NULL),(333,'sresp_cianjur_024','q_11',3,NULL,NULL),(334,'sresp_cianjur_024','q_12',5,NULL,NULL),(335,'sresp_cianjur_024','q_13',2,NULL,NULL),(336,'sresp_cianjur_024','q_14',5,NULL,NULL),(337,'sresp_cianjur_025','q_01',5,NULL,NULL),(338,'sresp_cianjur_025','q_02',4,NULL,NULL),(339,'sresp_cianjur_025','q_03',2,NULL,NULL),(340,'sresp_cianjur_025','q_04',4,NULL,NULL),(341,'sresp_cianjur_025','q_05',5,NULL,NULL),(342,'sresp_cianjur_025','q_06',5,NULL,NULL),(343,'sresp_cianjur_025','q_07',5,NULL,NULL),(344,'sresp_cianjur_025','q_08',3,NULL,NULL),(345,'sresp_cianjur_025','q_09',5,NULL,NULL),(346,'sresp_cianjur_025','q_10',3,NULL,NULL),(347,'sresp_cianjur_025','q_11',5,NULL,NULL),(348,'sresp_cianjur_025','q_12',4,NULL,NULL),(349,'sresp_cianjur_025','q_13',4,NULL,NULL),(350,'sresp_cianjur_025','q_14',5,NULL,NULL),(351,'sresp_cianjur_026','q_01',4,NULL,NULL),(352,'sresp_cianjur_026','q_02',5,NULL,NULL),(353,'sresp_cianjur_026','q_03',4,NULL,NULL),(354,'sresp_cianjur_026','q_04',5,NULL,NULL),(355,'sresp_cianjur_026','q_05',5,NULL,NULL),(356,'sresp_cianjur_026','q_06',5,NULL,NULL),(357,'sresp_cianjur_026','q_07',5,NULL,NULL),(358,'sresp_cianjur_026','q_08',5,NULL,NULL),(359,'sresp_cianjur_026','q_09',5,NULL,NULL),(360,'sresp_cianjur_026','q_10',5,NULL,NULL),(361,'sresp_cianjur_026','q_11',5,NULL,NULL),(362,'sresp_cianjur_026','q_12',5,NULL,NULL),(363,'sresp_cianjur_026','q_13',5,NULL,NULL),(364,'sresp_cianjur_026','q_14',5,NULL,NULL),(365,'sresp_cianjur_027','q_01',2,NULL,NULL),(366,'sresp_cianjur_027','q_02',5,NULL,NULL),(367,'sresp_cianjur_027','q_03',4,NULL,NULL),(368,'sresp_cianjur_027','q_04',5,NULL,NULL),(369,'sresp_cianjur_027','q_05',2,NULL,NULL),(370,'sresp_cianjur_027','q_06',4,NULL,NULL),(371,'sresp_cianjur_027','q_07',3,NULL,NULL),(372,'sresp_cianjur_027','q_08',5,NULL,NULL),(373,'sresp_cianjur_027','q_09',4,NULL,NULL),(374,'sresp_cianjur_027','q_10',5,NULL,NULL),(375,'sresp_cianjur_027','q_11',5,NULL,NULL),(376,'sresp_cianjur_027','q_12',5,NULL,NULL),(377,'sresp_cianjur_027','q_13',5,NULL,NULL),(378,'sresp_cianjur_027','q_14',5,NULL,NULL),(379,'sresp_cianjur_028','q_01',5,NULL,NULL),(380,'sresp_cianjur_028','q_02',4,NULL,NULL),(381,'sresp_cianjur_028','q_03',5,NULL,NULL),(382,'sresp_cianjur_028','q_04',5,NULL,NULL),(383,'sresp_cianjur_028','q_05',5,NULL,NULL),(384,'sresp_cianjur_028','q_06',4,NULL,NULL),(385,'sresp_cianjur_028','q_07',4,NULL,NULL),(386,'sresp_cianjur_028','q_08',4,NULL,NULL),(387,'sresp_cianjur_028','q_09',5,NULL,NULL),(388,'sresp_cianjur_028','q_10',4,NULL,NULL),(389,'sresp_cianjur_028','q_11',5,NULL,NULL),(390,'sresp_cianjur_028','q_12',5,NULL,NULL),(391,'sresp_cianjur_028','q_13',4,NULL,NULL),(392,'sresp_cianjur_028','q_14',5,NULL,NULL),(393,'sresp_cianjur_029','q_01',3,NULL,NULL),(394,'sresp_cianjur_029','q_02',3,NULL,NULL),(395,'sresp_cianjur_029','q_03',5,NULL,NULL),(396,'sresp_cianjur_029','q_04',5,NULL,NULL),(397,'sresp_cianjur_029','q_05',4,NULL,NULL),(398,'sresp_cianjur_029','q_06',4,NULL,NULL),(399,'sresp_cianjur_029','q_07',5,NULL,NULL),(400,'sresp_cianjur_029','q_08',5,NULL,NULL),(401,'sresp_cianjur_029','q_09',5,NULL,NULL),(402,'sresp_cianjur_029','q_10',5,NULL,NULL),(403,'sresp_cianjur_029','q_11',5,NULL,NULL),(404,'sresp_cianjur_029','q_12',3,NULL,NULL),(405,'sresp_cianjur_029','q_13',2,NULL,NULL),(406,'sresp_cianjur_029','q_14',5,NULL,NULL),(407,'sresp_cianjur_030','q_01',5,NULL,NULL),(408,'sresp_cianjur_030','q_02',4,NULL,NULL),(409,'sresp_cianjur_030','q_03',5,NULL,NULL),(410,'sresp_cianjur_030','q_04',5,NULL,NULL),(411,'sresp_cianjur_030','q_05',5,NULL,NULL),(412,'sresp_cianjur_030','q_06',5,NULL,NULL),(413,'sresp_cianjur_030','q_07',5,NULL,NULL),(414,'sresp_cianjur_030','q_08',4,NULL,NULL),(415,'sresp_cianjur_030','q_09',4,NULL,NULL),(416,'sresp_cianjur_030','q_10',5,NULL,NULL),(417,'sresp_cianjur_030','q_11',5,NULL,NULL),(418,'sresp_cianjur_030','q_12',4,NULL,NULL),(419,'sresp_cianjur_030','q_13',5,NULL,NULL),(420,'sresp_cianjur_030','q_14',4,NULL,NULL),(421,'sresp_cianjur_031','q_01',5,NULL,NULL),(422,'sresp_cianjur_031','q_02',5,NULL,NULL),(423,'sresp_cianjur_031','q_03',4,NULL,NULL),(424,'sresp_cianjur_031','q_04',5,NULL,NULL),(425,'sresp_cianjur_031','q_05',3,NULL,NULL),(426,'sresp_cianjur_031','q_06',5,NULL,NULL),(427,'sresp_cianjur_031','q_07',4,NULL,NULL),(428,'sresp_cianjur_031','q_08',5,NULL,NULL),(429,'sresp_cianjur_031','q_09',4,NULL,NULL),(430,'sresp_cianjur_031','q_10',4,NULL,NULL),(431,'sresp_cianjur_031','q_11',4,NULL,NULL),(432,'sresp_cianjur_031','q_12',3,NULL,NULL),(433,'sresp_cianjur_031','q_13',5,NULL,NULL),(434,'sresp_cianjur_031','q_14',5,NULL,NULL),(435,'sresp_cianjur_032','q_01',4,NULL,NULL),(436,'sresp_cianjur_032','q_02',2,NULL,NULL),(437,'sresp_cianjur_032','q_03',4,NULL,NULL),(438,'sresp_cianjur_032','q_04',4,NULL,NULL),(439,'sresp_cianjur_032','q_05',4,NULL,NULL),(440,'sresp_cianjur_032','q_06',4,NULL,NULL),(441,'sresp_cianjur_032','q_07',5,NULL,NULL),(442,'sresp_cianjur_032','q_08',4,NULL,NULL),(443,'sresp_cianjur_032','q_09',5,NULL,NULL),(444,'sresp_cianjur_032','q_10',2,NULL,NULL),(445,'sresp_cianjur_032','q_11',5,NULL,NULL),(446,'sresp_cianjur_032','q_12',5,NULL,NULL),(447,'sresp_cianjur_032','q_13',4,NULL,NULL),(448,'sresp_cianjur_032','q_14',5,NULL,NULL),(449,'sresp_cianjur_033','q_01',5,NULL,NULL),(450,'sresp_cianjur_033','q_02',4,NULL,NULL),(451,'sresp_cianjur_033','q_03',3,NULL,NULL),(452,'sresp_cianjur_033','q_04',4,NULL,NULL),(453,'sresp_cianjur_033','q_05',5,NULL,NULL),(454,'sresp_cianjur_033','q_06',3,NULL,NULL),(455,'sresp_cianjur_033','q_07',5,NULL,NULL),(456,'sresp_cianjur_033','q_08',4,NULL,NULL),(457,'sresp_cianjur_033','q_09',5,NULL,NULL),(458,'sresp_cianjur_033','q_10',5,NULL,NULL),(459,'sresp_cianjur_033','q_11',5,NULL,NULL),(460,'sresp_cianjur_033','q_12',4,NULL,NULL),(461,'sresp_cianjur_033','q_13',5,NULL,NULL),(462,'sresp_cianjur_033','q_14',4,NULL,NULL),(463,'sresp_cianjur_034','q_01',2,NULL,NULL),(464,'sresp_cianjur_034','q_02',5,NULL,NULL),(465,'sresp_cianjur_034','q_03',4,NULL,NULL),(466,'sresp_cianjur_034','q_04',3,NULL,NULL),(467,'sresp_cianjur_034','q_05',5,NULL,NULL),(468,'sresp_cianjur_034','q_06',4,NULL,NULL),(469,'sresp_cianjur_034','q_07',5,NULL,NULL),(470,'sresp_cianjur_034','q_08',5,NULL,NULL),(471,'sresp_cianjur_034','q_09',5,NULL,NULL),(472,'sresp_cianjur_034','q_10',5,NULL,NULL),(473,'sresp_cianjur_034','q_11',5,NULL,NULL),(474,'sresp_cianjur_034','q_12',2,NULL,NULL),(475,'sresp_cianjur_034','q_13',2,NULL,NULL),(476,'sresp_cianjur_034','q_14',3,NULL,NULL),(477,'sresp_cianjur_035','q_01',5,NULL,NULL),(478,'sresp_cianjur_035','q_02',5,NULL,NULL),(479,'sresp_cianjur_035','q_03',2,NULL,NULL),(480,'sresp_cianjur_035','q_04',5,NULL,NULL),(481,'sresp_cianjur_035','q_05',5,NULL,NULL),(482,'sresp_cianjur_035','q_06',5,NULL,NULL),(483,'sresp_cianjur_035','q_07',4,NULL,NULL),(484,'sresp_cianjur_035','q_08',4,NULL,NULL),(485,'sresp_cianjur_035','q_09',5,NULL,NULL),(486,'sresp_cianjur_035','q_10',5,NULL,NULL),(487,'sresp_cianjur_035','q_11',4,NULL,NULL),(488,'sresp_cianjur_035','q_12',5,NULL,NULL),(489,'sresp_cianjur_035','q_13',4,NULL,NULL),(490,'sresp_cianjur_035','q_14',4,NULL,NULL),(491,'sresp_cianjur_036','q_01',5,NULL,NULL),(492,'sresp_cianjur_036','q_02',4,NULL,NULL),(493,'sresp_cianjur_036','q_03',5,NULL,NULL),(494,'sresp_cianjur_036','q_04',3,NULL,NULL),(495,'sresp_cianjur_036','q_05',5,NULL,NULL),(496,'sresp_cianjur_036','q_06',5,NULL,NULL),(497,'sresp_cianjur_036','q_07',5,NULL,NULL),(498,'sresp_cianjur_036','q_08',4,NULL,NULL),(499,'sresp_cianjur_036','q_09',5,NULL,NULL),(500,'sresp_cianjur_036','q_10',4,NULL,NULL),(501,'sresp_cianjur_036','q_11',5,NULL,NULL),(502,'sresp_cianjur_036','q_12',5,NULL,NULL),(503,'sresp_cianjur_036','q_13',4,NULL,NULL),(504,'sresp_cianjur_036','q_14',5,NULL,NULL),(505,'sresp_cianjur_037','q_01',5,NULL,NULL),(506,'sresp_cianjur_037','q_02',5,NULL,NULL),(507,'sresp_cianjur_037','q_03',5,NULL,NULL),(508,'sresp_cianjur_037','q_04',3,NULL,NULL),(509,'sresp_cianjur_037','q_05',5,NULL,NULL),(510,'sresp_cianjur_037','q_06',4,NULL,NULL),(511,'sresp_cianjur_037','q_07',3,NULL,NULL),(512,'sresp_cianjur_037','q_08',5,NULL,NULL),(513,'sresp_cianjur_037','q_09',5,NULL,NULL),(514,'sresp_cianjur_037','q_10',5,NULL,NULL),(515,'sresp_cianjur_037','q_11',4,NULL,NULL),(516,'sresp_cianjur_037','q_12',2,NULL,NULL),(517,'sresp_cianjur_037','q_13',5,NULL,NULL),(518,'sresp_cianjur_037','q_14',5,NULL,NULL),(519,'sresp_cianjur_038','q_01',4,NULL,NULL),(520,'sresp_cianjur_038','q_02',5,NULL,NULL),(521,'sresp_cianjur_038','q_03',4,NULL,NULL),(522,'sresp_cianjur_038','q_04',5,NULL,NULL),(523,'sresp_cianjur_038','q_05',5,NULL,NULL),(524,'sresp_cianjur_038','q_06',5,NULL,NULL),(525,'sresp_cianjur_038','q_07',5,NULL,NULL),(526,'sresp_cianjur_038','q_08',5,NULL,NULL),(527,'sresp_cianjur_038','q_09',5,NULL,NULL),(528,'sresp_cianjur_038','q_10',5,NULL,NULL),(529,'sresp_cianjur_038','q_11',5,NULL,NULL),(530,'sresp_cianjur_038','q_12',5,NULL,NULL),(531,'sresp_cianjur_038','q_13',5,NULL,NULL),(532,'sresp_cianjur_038','q_14',4,NULL,NULL),(533,'sresp_cianjur_039','q_01',4,NULL,NULL),(534,'sresp_cianjur_039','q_02',3,NULL,NULL),(535,'sresp_cianjur_039','q_03',5,NULL,NULL),(536,'sresp_cianjur_039','q_04',4,NULL,NULL),(537,'sresp_cianjur_039','q_05',5,NULL,NULL),(538,'sresp_cianjur_039','q_06',5,NULL,NULL),(539,'sresp_cianjur_039','q_07',5,NULL,NULL),(540,'sresp_cianjur_039','q_08',4,NULL,NULL),(541,'sresp_cianjur_039','q_09',5,NULL,NULL),(542,'sresp_cianjur_039','q_10',2,NULL,NULL),(543,'sresp_cianjur_039','q_11',3,NULL,NULL),(544,'sresp_cianjur_039','q_12',5,NULL,NULL),(545,'sresp_cianjur_039','q_13',5,NULL,NULL),(546,'sresp_cianjur_039','q_14',3,NULL,NULL),(547,'sresp_cianjur_040','q_01',5,NULL,NULL),(548,'sresp_cianjur_040','q_02',5,NULL,NULL),(549,'sresp_cianjur_040','q_03',3,NULL,NULL),(550,'sresp_cianjur_040','q_04',5,NULL,NULL),(551,'sresp_cianjur_040','q_05',5,NULL,NULL),(552,'sresp_cianjur_040','q_06',5,NULL,NULL),(553,'sresp_cianjur_040','q_07',5,NULL,NULL),(554,'sresp_cianjur_040','q_08',5,NULL,NULL),(555,'sresp_cianjur_040','q_09',5,NULL,NULL),(556,'sresp_cianjur_040','q_10',3,NULL,NULL),(557,'sresp_cianjur_040','q_11',2,NULL,NULL),(558,'sresp_cianjur_040','q_12',2,NULL,NULL),(559,'sresp_cianjur_040','q_13',5,NULL,NULL),(560,'sresp_cianjur_040','q_14',5,NULL,NULL),(561,'sresp_cianjur_041','q_01',5,NULL,NULL),(562,'sresp_cianjur_041','q_02',5,NULL,NULL),(563,'sresp_cianjur_041','q_03',5,NULL,NULL),(564,'sresp_cianjur_041','q_04',5,NULL,NULL),(565,'sresp_cianjur_041','q_05',5,NULL,NULL),(566,'sresp_cianjur_041','q_06',4,NULL,NULL),(567,'sresp_cianjur_041','q_07',5,NULL,NULL),(568,'sresp_cianjur_041','q_08',4,NULL,NULL),(569,'sresp_cianjur_041','q_09',3,NULL,NULL),(570,'sresp_cianjur_041','q_10',5,NULL,NULL),(571,'sresp_cianjur_041','q_11',4,NULL,NULL),(572,'sresp_cianjur_041','q_12',3,NULL,NULL),(573,'sresp_cianjur_041','q_13',5,NULL,NULL),(574,'sresp_cianjur_041','q_14',5,NULL,NULL),(575,'sresp_cianjur_042','q_01',4,NULL,NULL),(576,'sresp_cianjur_042','q_02',5,NULL,NULL),(577,'sresp_cianjur_042','q_03',5,NULL,NULL),(578,'sresp_cianjur_042','q_04',5,NULL,NULL),(579,'sresp_cianjur_042','q_05',5,NULL,NULL),(580,'sresp_cianjur_042','q_06',4,NULL,NULL),(581,'sresp_cianjur_042','q_07',5,NULL,NULL),(582,'sresp_cianjur_042','q_08',5,NULL,NULL),(583,'sresp_cianjur_042','q_09',5,NULL,NULL),(584,'sresp_cianjur_042','q_10',4,NULL,NULL),(585,'sresp_cianjur_042','q_11',5,NULL,NULL),(586,'sresp_cianjur_042','q_12',3,NULL,NULL),(587,'sresp_cianjur_042','q_13',5,NULL,NULL),(588,'sresp_cianjur_042','q_14',5,NULL,NULL),(589,'sresp_cianjur_043','q_01',5,NULL,NULL),(590,'sresp_cianjur_043','q_02',5,NULL,NULL),(591,'sresp_cianjur_043','q_03',2,NULL,NULL),(592,'sresp_cianjur_043','q_04',4,NULL,NULL),(593,'sresp_cianjur_043','q_05',5,NULL,NULL),(594,'sresp_cianjur_043','q_06',4,NULL,NULL),(595,'sresp_cianjur_043','q_07',5,NULL,NULL),(596,'sresp_cianjur_043','q_08',2,NULL,NULL),(597,'sresp_cianjur_043','q_09',5,NULL,NULL),(598,'sresp_cianjur_043','q_10',5,NULL,NULL),(599,'sresp_cianjur_043','q_11',5,NULL,NULL),(600,'sresp_cianjur_043','q_12',5,NULL,NULL),(601,'sresp_cianjur_043','q_13',5,NULL,NULL),(602,'sresp_cianjur_043','q_14',3,NULL,NULL),(603,'sresp_cianjur_044','q_01',2,NULL,NULL),(604,'sresp_cianjur_044','q_02',3,NULL,NULL),(605,'sresp_cianjur_044','q_03',3,NULL,NULL),(606,'sresp_cianjur_044','q_04',4,NULL,NULL),(607,'sresp_cianjur_044','q_05',3,NULL,NULL),(608,'sresp_cianjur_044','q_06',5,NULL,NULL),(609,'sresp_cianjur_044','q_07',5,NULL,NULL),(610,'sresp_cianjur_044','q_08',5,NULL,NULL),(611,'sresp_cianjur_044','q_09',5,NULL,NULL),(612,'sresp_cianjur_044','q_10',5,NULL,NULL),(613,'sresp_cianjur_044','q_11',5,NULL,NULL),(614,'sresp_cianjur_044','q_12',5,NULL,NULL),(615,'sresp_cianjur_044','q_13',5,NULL,NULL),(616,'sresp_cianjur_044','q_14',5,NULL,NULL),(617,'sresp_cianjur_045','q_01',5,NULL,NULL),(618,'sresp_cianjur_045','q_02',5,NULL,NULL),(619,'sresp_cianjur_045','q_03',5,NULL,NULL),(620,'sresp_cianjur_045','q_04',4,NULL,NULL),(621,'sresp_cianjur_045','q_05',5,NULL,NULL),(622,'sresp_cianjur_045','q_06',4,NULL,NULL),(623,'sresp_cianjur_045','q_07',3,NULL,NULL),(624,'sresp_cianjur_045','q_08',3,NULL,NULL),(625,'sresp_cianjur_045','q_09',4,NULL,NULL),(626,'sresp_cianjur_045','q_10',3,NULL,NULL),(627,'sresp_cianjur_045','q_11',5,NULL,NULL),(628,'sresp_cianjur_045','q_12',5,NULL,NULL),(629,'sresp_cianjur_045','q_13',5,NULL,NULL),(630,'sresp_cianjur_045','q_14',5,NULL,NULL),(631,'sresp_cianjur_046','q_01',5,NULL,NULL),(632,'sresp_cianjur_046','q_02',5,NULL,NULL),(633,'sresp_cianjur_046','q_03',5,NULL,NULL),(634,'sresp_cianjur_046','q_04',5,NULL,NULL),(635,'sresp_cianjur_046','q_05',5,NULL,NULL),(636,'sresp_cianjur_046','q_06',5,NULL,NULL),(637,'sresp_cianjur_046','q_07',4,NULL,NULL),(638,'sresp_cianjur_046','q_08',5,NULL,NULL),(639,'sresp_cianjur_046','q_09',5,NULL,NULL),(640,'sresp_cianjur_046','q_10',5,NULL,NULL),(641,'sresp_cianjur_046','q_11',5,NULL,NULL),(642,'sresp_cianjur_046','q_12',5,NULL,NULL),(643,'sresp_cianjur_046','q_13',5,NULL,NULL),(644,'sresp_cianjur_046','q_14',3,NULL,NULL),(645,'sresp_cianjur_047','q_01',5,NULL,NULL),(646,'sresp_cianjur_047','q_02',5,NULL,NULL),(647,'sresp_cianjur_047','q_03',5,NULL,NULL),(648,'sresp_cianjur_047','q_04',5,NULL,NULL),(649,'sresp_cianjur_047','q_05',5,NULL,NULL),(650,'sresp_cianjur_047','q_06',5,NULL,NULL),(651,'sresp_cianjur_047','q_07',5,NULL,NULL),(652,'sresp_cianjur_047','q_08',5,NULL,NULL),(653,'sresp_cianjur_047','q_09',5,NULL,NULL),(654,'sresp_cianjur_047','q_10',5,NULL,NULL),(655,'sresp_cianjur_047','q_11',5,NULL,NULL),(656,'sresp_cianjur_047','q_12',5,NULL,NULL),(657,'sresp_cianjur_047','q_13',5,NULL,NULL),(658,'sresp_cianjur_047','q_14',5,NULL,NULL),(659,'sresp_cianjur_048','q_01',4,NULL,NULL),(660,'sresp_cianjur_048','q_02',5,NULL,NULL),(661,'sresp_cianjur_048','q_03',5,NULL,NULL),(662,'sresp_cianjur_048','q_04',5,NULL,NULL),(663,'sresp_cianjur_048','q_05',5,NULL,NULL),(664,'sresp_cianjur_048','q_06',3,NULL,NULL),(665,'sresp_cianjur_048','q_07',4,NULL,NULL),(666,'sresp_cianjur_048','q_08',5,NULL,NULL),(667,'sresp_cianjur_048','q_09',5,NULL,NULL),(668,'sresp_cianjur_048','q_10',4,NULL,NULL),(669,'sresp_cianjur_048','q_11',5,NULL,NULL),(670,'sresp_cianjur_048','q_12',4,NULL,NULL),(671,'sresp_cianjur_048','q_13',5,NULL,NULL),(672,'sresp_cianjur_048','q_14',4,NULL,NULL),(673,'sresp_cianjur_049','q_01',4,NULL,NULL),(674,'sresp_cianjur_049','q_02',5,NULL,NULL),(675,'sresp_cianjur_049','q_03',5,NULL,NULL),(676,'sresp_cianjur_049','q_04',5,NULL,NULL),(677,'sresp_cianjur_049','q_05',2,NULL,NULL),(678,'sresp_cianjur_049','q_06',5,NULL,NULL),(679,'sresp_cianjur_049','q_07',4,NULL,NULL),(680,'sresp_cianjur_049','q_08',4,NULL,NULL),(681,'sresp_cianjur_049','q_09',2,NULL,NULL),(682,'sresp_cianjur_049','q_10',5,NULL,NULL),(683,'sresp_cianjur_049','q_11',5,NULL,NULL),(684,'sresp_cianjur_049','q_12',5,NULL,NULL),(685,'sresp_cianjur_049','q_13',5,NULL,NULL),(686,'sresp_cianjur_049','q_14',5,NULL,NULL),(687,'sresp_cianjur_050','q_01',4,NULL,NULL),(688,'sresp_cianjur_050','q_02',5,NULL,NULL),(689,'sresp_cianjur_050','q_03',4,NULL,NULL),(690,'sresp_cianjur_050','q_04',4,NULL,NULL),(691,'sresp_cianjur_050','q_05',4,NULL,NULL),(692,'sresp_cianjur_050','q_06',4,NULL,NULL),(693,'sresp_cianjur_050','q_07',5,NULL,NULL),(694,'sresp_cianjur_050','q_08',5,NULL,NULL),(695,'sresp_cianjur_050','q_09',5,NULL,NULL),(696,'sresp_cianjur_050','q_10',4,NULL,NULL),(697,'sresp_cianjur_050','q_11',5,NULL,NULL),(698,'sresp_cianjur_050','q_12',4,NULL,NULL),(699,'sresp_cianjur_050','q_13',5,NULL,NULL),(700,'sresp_cianjur_050','q_14',5,NULL,NULL);
/*!40000 ALTER TABLE `survey_answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `survey_history_logs`
--

DROP TABLE IF EXISTS `survey_history_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `survey_history_logs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `hospital_id` varchar(26) NOT NULL,
  `actor_user_id` varchar(26) NOT NULL,
  `entity_type` enum('QUESTIONNAIRE','PERIOD','UNIT','HOSPITAL','USER','QRCODE') NOT NULL,
  `entity_id` varchar(26) NOT NULL,
  `action` enum('CREATE','UPDATE','DELETE','PUBLISH','CLOSE','ARCHIVE','ACTIVATE') NOT NULL,
  `before_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`before_json`)),
  `after_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`after_json`)),
  `notes` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_history_hospital` (`hospital_id`,`created_at`),
  KEY `idx_history_entity` (`entity_type`,`entity_id`,`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `survey_history_logs`
--

LOCK TABLES `survey_history_logs` WRITE;
/*!40000 ALTER TABLE `survey_history_logs` DISABLE KEYS */;
INSERT INTO `survey_history_logs` VALUES (1,'hosp_rsud_cianjur_01','usr_admin_cianjur_02','QUESTIONNAIRE','quest_cianjur_ikm_14','PUBLISH','{\"status\":\"DRAFT\",\"version\":1}','{\"status\":\"PUBLISHED\",\"version\":1,\"publishedAt\":\"2026-09-14T05:42:55.356Z\"}','Publikasi Kuesioner IKM 14 Unsur Pelayanan Rumah Sakit 2025.','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64)','2026-08-14 22:42:55'),(2,'hosp_rsud_cianjur_01','usr_admin_cianjur_02','PERIOD','period_cianjur_2025_t1','ACTIVATE','{\"status\":\"DRAFT\"}','{\"status\":\"ACTIVE\"}','Aktivasi periode survey Triwulan I 2025.','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64)','2026-08-15 22:42:55');
/*!40000 ALTER TABLE `survey_history_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `survey_periods`
--

DROP TABLE IF EXISTS `survey_periods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `survey_periods` (
  `id` varchar(26) NOT NULL,
  `hospital_id` varchar(26) NOT NULL,
  `name` varchar(150) NOT NULL,
  `start_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `end_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `status` enum('DRAFT','ACTIVE','CLOSED') NOT NULL DEFAULT 'DRAFT',
  `created_by` varchar(26) NOT NULL,
  `closed_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_periods_hospital_status` (`hospital_id`,`status`),
  KEY `idx_periods_dates` (`hospital_id`,`start_date`,`end_date`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `survey_periods`
--

LOCK TABLES `survey_periods` WRITE;
/*!40000 ALTER TABLE `survey_periods` DISABLE KEYS */;
INSERT INTO `survey_periods` VALUES ('period_cianjur_2025_t1','hosp_rsud_cianjur_01','Triwulan I 2025 - IKM Terpadu','2024-12-31 17:00:00','2025-12-31 16:59:59','ACTIVE','usr_admin_cianjur_02','0000-00-00 00:00:00','2026-09-14 05:42:55','2026-09-14 05:42:55'),('period_karawang_2025_t1','hosp_rsud_karawang_02','Survei Kepuasan Pasien Karawang 2025','2024-12-31 17:00:00','2025-12-31 16:59:59','ACTIVE','usr_admin_karawang_03','0000-00-00 00:00:00','2026-09-14 05:42:55','2026-09-14 05:42:55'),('period_rshs_2025_t1','hosp_rshs_bandung_03','Survei Mutu & Kepuasan Pelanggan RSHS 2025','2024-12-31 17:00:00','2025-12-31 16:59:59','ACTIVE','usr_super_admin_01','0000-00-00 00:00:00','2026-09-14 05:42:55','2026-09-14 05:42:55');
/*!40000 ALTER TABLE `survey_periods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `survey_responses`
--

DROP TABLE IF EXISTS `survey_responses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `survey_responses` (
  `id` varchar(26) NOT NULL,
  `hospital_id` varchar(26) NOT NULL,
  `period_id` varchar(26) NOT NULL,
  `questionnaire_id` varchar(26) NOT NULL,
  `respondent_id` varchar(26) NOT NULL,
  `unit_id` varchar(26) NOT NULL,
  `overall_score` decimal(5,2) DEFAULT NULL,
  `nps_score` int(11) DEFAULT NULL,
  `is_locked` tinyint(1) NOT NULL DEFAULT 0,
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_responses_hospital_period` (`hospital_id`,`period_id`),
  KEY `idx_responses_unit_date` (`unit_id`,`submitted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `survey_responses`
--

LOCK TABLES `survey_responses` WRITE;
/*!40000 ALTER TABLE `survey_responses` DISABLE KEYS */;
INSERT INTO `survey_responses` VALUES ('sresp_cianjur_001','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_001','u_cianjur_poli',77.14,8,0,'2026-08-16 08:42:55'),('sresp_cianjur_002','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_002','u_cianjur_rawat_inap',85.71,9,0,'2026-08-16 22:42:55'),('sresp_cianjur_003','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_003','u_cianjur_farmasi',88.57,9,0,'2026-08-17 12:42:55'),('sresp_cianjur_004','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_004','u_cianjur_lab',82.86,8,0,'2026-08-18 02:42:55'),('sresp_cianjur_005','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_005','u_cianjur_radiologi',88.57,9,0,'2026-08-18 16:42:55'),('sresp_cianjur_006','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_006','u_cianjur_kasir',85.71,9,0,'2026-08-19 06:42:55'),('sresp_cianjur_007','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_007','u_cianjur_pendaftaran',88.57,9,0,'2026-08-19 20:42:55'),('sresp_cianjur_008','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_008','u_cianjur_hemodialisa',87.14,9,0,'2026-08-20 10:42:55'),('sresp_cianjur_009','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_009','u_cianjur_icu',85.71,9,0,'2026-08-21 00:42:55'),('sresp_cianjur_010','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_010','u_cianjur_igd',88.57,9,0,'2026-08-21 14:42:55'),('sresp_cianjur_011','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_011','u_cianjur_poli',88.57,9,0,'2026-08-22 04:42:55'),('sresp_cianjur_012','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_012','u_cianjur_rawat_inap',90.00,9,0,'2026-08-22 18:42:55'),('sresp_cianjur_013','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_013','u_cianjur_farmasi',88.57,9,0,'2026-08-23 08:42:55'),('sresp_cianjur_014','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_014','u_cianjur_lab',85.71,9,0,'2026-08-23 22:42:55'),('sresp_cianjur_015','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_015','u_cianjur_radiologi',90.00,9,0,'2026-08-24 12:42:55'),('sresp_cianjur_016','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_016','u_cianjur_kasir',90.00,9,0,'2026-08-25 02:42:55'),('sresp_cianjur_017','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_017','u_cianjur_pendaftaran',85.71,9,0,'2026-08-25 16:42:55'),('sresp_cianjur_018','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_018','u_cianjur_hemodialisa',84.29,8,0,'2026-08-26 06:42:55'),('sresp_cianjur_019','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_019','u_cianjur_icu',91.43,9,0,'2026-08-26 20:42:55'),('sresp_cianjur_020','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_020','u_cianjur_igd',75.71,8,0,'2026-08-27 10:42:55'),('sresp_cianjur_021','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_021','u_cianjur_poli',82.86,8,0,'2026-08-28 00:42:55'),('sresp_cianjur_022','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_022','u_cianjur_rawat_inap',90.00,9,0,'2026-08-28 14:42:55'),('sresp_cianjur_023','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_023','u_cianjur_farmasi',84.29,8,0,'2026-08-29 04:42:55'),('sresp_cianjur_024','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_024','u_cianjur_lab',85.71,9,0,'2026-08-29 18:42:55'),('sresp_cianjur_025','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_025','u_cianjur_radiologi',84.29,8,0,'2026-08-30 08:42:55'),('sresp_cianjur_026','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_026','u_cianjur_kasir',97.14,10,0,'2026-08-30 22:42:55'),('sresp_cianjur_027','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_027','u_cianjur_pendaftaran',84.29,8,0,'2026-08-31 12:42:55'),('sresp_cianjur_028','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_028','u_cianjur_hemodialisa',91.43,9,0,'2026-09-01 02:42:55'),('sresp_cianjur_029','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_029','u_cianjur_icu',84.29,8,0,'2026-09-01 16:42:55'),('sresp_cianjur_030','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_030','u_cianjur_igd',92.86,9,0,'2026-09-02 06:42:55'),('sresp_cianjur_031','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_031','u_cianjur_poli',87.14,9,0,'2026-09-02 20:42:55'),('sresp_cianjur_032','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_032','u_cianjur_rawat_inap',81.43,8,0,'2026-09-03 10:42:55'),('sresp_cianjur_033','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_033','u_cianjur_farmasi',87.14,9,0,'2026-09-04 00:42:55'),('sresp_cianjur_034','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_034','u_cianjur_lab',78.57,8,0,'2026-09-04 14:42:55'),('sresp_cianjur_035','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_035','u_cianjur_radiologi',88.57,9,0,'2026-09-05 04:42:55'),('sresp_cianjur_036','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_036','u_cianjur_kasir',91.43,9,0,'2026-09-05 18:42:55'),('sresp_cianjur_037','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_037','u_cianjur_pendaftaran',87.14,9,0,'2026-09-06 08:42:55'),('sresp_cianjur_038','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_038','u_cianjur_hemodialisa',95.71,10,0,'2026-09-06 22:42:55'),('sresp_cianjur_039','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_039','u_cianjur_icu',82.86,8,0,'2026-09-07 12:42:55'),('sresp_cianjur_040','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_040','u_cianjur_igd',85.71,9,0,'2026-09-08 02:42:55'),('sresp_cianjur_041','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_041','u_cianjur_poli',90.00,9,0,'2026-09-08 16:42:55'),('sresp_cianjur_042','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_042','u_cianjur_rawat_inap',92.86,9,0,'2026-09-09 06:42:55'),('sresp_cianjur_043','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_043','u_cianjur_farmasi',85.71,9,0,'2026-09-09 20:42:55'),('sresp_cianjur_044','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_044','u_cianjur_lab',85.71,9,0,'2026-09-10 10:42:55'),('sresp_cianjur_045','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_045','u_cianjur_radiologi',87.14,9,0,'2026-09-11 00:42:55'),('sresp_cianjur_046','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_046','u_cianjur_kasir',95.71,10,0,'2026-09-11 14:42:55'),('sresp_cianjur_047','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_047','u_cianjur_pendaftaran',100.00,10,0,'2026-09-12 04:42:55'),('sresp_cianjur_048','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_048','u_cianjur_hemodialisa',90.00,9,0,'2026-09-12 18:42:55'),('sresp_cianjur_049','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_049','u_cianjur_icu',87.14,9,0,'2026-09-13 08:42:55'),('sresp_cianjur_050','hosp_rsud_cianjur_01','period_cianjur_2025_t1','quest_cianjur_ikm_14','resp_cianjur_050','u_cianjur_igd',90.00,9,0,'2026-09-13 22:42:55');
/*!40000 ALTER TABLE `survey_responses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `survey_reviews`
--

DROP TABLE IF EXISTS `survey_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `survey_reviews` (
  `id` varchar(26) NOT NULL,
  `hospital_id` varchar(26) NOT NULL,
  `response_id` varchar(26) NOT NULL,
  `review_text` text NOT NULL,
  `sentiment` enum('POSITIVE','NEUTRAL','NEGATIVE') DEFAULT 'NEUTRAL',
  `keywords_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`keywords_json`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `survey_reviews`
--

LOCK TABLES `survey_reviews` WRITE;
/*!40000 ALTER TABLE `survey_reviews` DISABLE KEYS */;
INSERT INTO `survey_reviews` VALUES ('rev_cianjur_002','hosp_rsud_cianjur_01','sresp_cianjur_002','Proses administrasi BPJS mudah dan petugas kasir sangat membantu keluarga kami yang kebingungan.','POSITIVE','[\"bpjs\",\"petugas\",\"ramah\",\"membantu\"]','2026-08-16 22:42:55'),('rev_cianjur_003','hosp_rsud_cianjur_01','sresp_cianjur_003','Fasilitas ruang inap kelas 1 sangat nyaman, perawat sigap datang saat bel dipanggil.','POSITIVE','[\"rawat inap\",\"nyaman\",\"sigap\"]','2026-08-17 12:42:55'),('rev_cianjur_004','hosp_rsud_cianjur_01','sresp_cianjur_004','Alur pendaftaran online sangat membantu mempersingkat waktu tunggu di loket.','POSITIVE','[\"pendaftaran\",\"online\",\"cepat\"]','2026-08-18 02:42:55'),('rev_cianjur_006','hosp_rsud_cianjur_01','sresp_cianjur_006','Sangat puas dengan fasilitas rawat jalan. Obat farmasi cepat selesai tidak perlu antre lama.','POSITIVE','[\"obat\",\"farmasi\",\"cepat\",\"puas\"]','2026-08-19 06:42:55'),('rev_cianjur_008','hosp_rsud_cianjur_01','sresp_cianjur_008','Fasilitas ruang inap kelas 1 sangat nyaman, perawat sigap datang saat bel dipanggil.','POSITIVE','[\"rawat inap\",\"nyaman\",\"sigap\"]','2026-08-20 10:42:55'),('rev_cianjur_009','hosp_rsud_cianjur_01','sresp_cianjur_009','Alur pendaftaran online sangat membantu mempersingkat waktu tunggu di loket.','POSITIVE','[\"pendaftaran\",\"online\",\"cepat\"]','2026-08-21 00:42:55'),('rev_cianjur_010','hosp_rsud_cianjur_01','sresp_cianjur_010','Pelayanan dokter dan perawat di IGD sangat cekatan dan ramah. Ruang tunggu bersih dan ber-AC.','POSITIVE','[\"dokter\",\"perawat\",\"ramah\",\"bersih\",\"cepat\"]','2026-08-21 14:42:55'),('rev_cianjur_012','hosp_rsud_cianjur_01','sresp_cianjur_012','Proses administrasi BPJS mudah dan petugas kasir sangat membantu keluarga kami yang kebingungan.','POSITIVE','[\"bpjs\",\"petugas\",\"ramah\",\"membantu\"]','2026-08-22 18:42:55'),('rev_cianjur_014','hosp_rsud_cianjur_01','sresp_cianjur_014','Alur pendaftaran online sangat membantu mempersingkat waktu tunggu di loket.','POSITIVE','[\"pendaftaran\",\"online\",\"cepat\"]','2026-08-23 22:42:55'),('rev_cianjur_015','hosp_rsud_cianjur_01','sresp_cianjur_015','Pelayanan dokter dan perawat di IGD sangat cekatan dan ramah. Ruang tunggu bersih dan ber-AC.','POSITIVE','[\"dokter\",\"perawat\",\"ramah\",\"bersih\",\"cepat\"]','2026-08-24 12:42:55'),('rev_cianjur_016','hosp_rsud_cianjur_01','sresp_cianjur_016','Sangat puas dengan fasilitas rawat jalan. Obat farmasi cepat selesai tidak perlu antre lama.','POSITIVE','[\"obat\",\"farmasi\",\"cepat\",\"puas\"]','2026-08-25 02:42:55'),('rev_cianjur_018','hosp_rsud_cianjur_01','sresp_cianjur_018','Fasilitas ruang inap kelas 1 sangat nyaman, perawat sigap datang saat bel dipanggil.','POSITIVE','[\"rawat inap\",\"nyaman\",\"sigap\"]','2026-08-26 06:42:55'),('rev_cianjur_020','hosp_rsud_cianjur_01','sresp_cianjur_020','Standar pelayanan sudah bagus, hanya tempat parkir motor kadang sulit didapat.','NEUTRAL','[\"standar\",\"parkir\"]','2026-08-27 10:42:55'),('rev_cianjur_021','hosp_rsud_cianjur_01','sresp_cianjur_021','Sangat puas dengan fasilitas rawat jalan. Obat farmasi cepat selesai tidak perlu antre lama.','POSITIVE','[\"obat\",\"farmasi\",\"cepat\",\"puas\"]','2026-08-28 00:42:55'),('rev_cianjur_022','hosp_rsud_cianjur_01','sresp_cianjur_022','Proses administrasi BPJS mudah dan petugas kasir sangat membantu keluarga kami yang kebingungan.','POSITIVE','[\"bpjs\",\"petugas\",\"ramah\",\"membantu\"]','2026-08-28 14:42:55'),('rev_cianjur_024','hosp_rsud_cianjur_01','sresp_cianjur_024','Alur pendaftaran online sangat membantu mempersingkat waktu tunggu di loket.','POSITIVE','[\"pendaftaran\",\"online\",\"cepat\"]','2026-08-29 18:42:55'),('rev_cianjur_026','hosp_rsud_cianjur_01','sresp_cianjur_026','Sangat puas dengan fasilitas rawat jalan. Obat farmasi cepat selesai tidak perlu antre lama.','POSITIVE','[\"obat\",\"farmasi\",\"cepat\",\"puas\"]','2026-08-30 22:42:55'),('rev_cianjur_027','hosp_rsud_cianjur_01','sresp_cianjur_027','Proses administrasi BPJS mudah dan petugas kasir sangat membantu keluarga kami yang kebingungan.','POSITIVE','[\"bpjs\",\"petugas\",\"ramah\",\"membantu\"]','2026-08-31 12:42:55'),('rev_cianjur_028','hosp_rsud_cianjur_01','sresp_cianjur_028','Fasilitas ruang inap kelas 1 sangat nyaman, perawat sigap datang saat bel dipanggil.','POSITIVE','[\"rawat inap\",\"nyaman\",\"sigap\"]','2026-09-01 02:42:55'),('rev_cianjur_030','hosp_rsud_cianjur_01','sresp_cianjur_030','Pelayanan dokter dan perawat di IGD sangat cekatan dan ramah. Ruang tunggu bersih dan ber-AC.','POSITIVE','[\"dokter\",\"perawat\",\"ramah\",\"bersih\",\"cepat\"]','2026-09-02 06:42:55'),('rev_cianjur_032','hosp_rsud_cianjur_01','sresp_cianjur_032','Proses administrasi BPJS mudah dan petugas kasir sangat membantu keluarga kami yang kebingungan.','POSITIVE','[\"bpjs\",\"petugas\",\"ramah\",\"membantu\"]','2026-09-03 10:42:55'),('rev_cianjur_033','hosp_rsud_cianjur_01','sresp_cianjur_033','Fasilitas ruang inap kelas 1 sangat nyaman, perawat sigap datang saat bel dipanggil.','POSITIVE','[\"rawat inap\",\"nyaman\",\"sigap\"]','2026-09-04 00:42:55'),('rev_cianjur_034','hosp_rsud_cianjur_01','sresp_cianjur_034','Dokter sangat ramah, tapi mohon jadwal dokter diinformasikan jika ada operasi mendadak.','NEUTRAL','[\"dokter\",\"jadwal\",\"informasi\"]','2026-09-04 14:42:55'),('rev_cianjur_036','hosp_rsud_cianjur_01','sresp_cianjur_036','Sangat puas dengan fasilitas rawat jalan. Obat farmasi cepat selesai tidak perlu antre lama.','POSITIVE','[\"obat\",\"farmasi\",\"cepat\",\"puas\"]','2026-09-05 18:42:55'),('rev_cianjur_038','hosp_rsud_cianjur_01','sresp_cianjur_038','Fasilitas ruang inap kelas 1 sangat nyaman, perawat sigap datang saat bel dipanggil.','POSITIVE','[\"rawat inap\",\"nyaman\",\"sigap\"]','2026-09-06 22:42:55'),('rev_cianjur_039','hosp_rsud_cianjur_01','sresp_cianjur_039','Alur pendaftaran online sangat membantu mempersingkat waktu tunggu di loket.','POSITIVE','[\"pendaftaran\",\"online\",\"cepat\"]','2026-09-07 12:42:55'),('rev_cianjur_040','hosp_rsud_cianjur_01','sresp_cianjur_040','Pelayanan dokter dan perawat di IGD sangat cekatan dan ramah. Ruang tunggu bersih dan ber-AC.','POSITIVE','[\"dokter\",\"perawat\",\"ramah\",\"bersih\",\"cepat\"]','2026-09-08 02:42:55'),('rev_cianjur_042','hosp_rsud_cianjur_01','sresp_cianjur_042','Proses administrasi BPJS mudah dan petugas kasir sangat membantu keluarga kami yang kebingungan.','POSITIVE','[\"bpjs\",\"petugas\",\"ramah\",\"membantu\"]','2026-09-09 06:42:55'),('rev_cianjur_044','hosp_rsud_cianjur_01','sresp_cianjur_044','Alur pendaftaran online sangat membantu mempersingkat waktu tunggu di loket.','POSITIVE','[\"pendaftaran\",\"online\",\"cepat\"]','2026-09-10 10:42:55'),('rev_cianjur_045','hosp_rsud_cianjur_01','sresp_cianjur_045','Pelayanan dokter dan perawat di IGD sangat cekatan dan ramah. Ruang tunggu bersih dan ber-AC.','POSITIVE','[\"dokter\",\"perawat\",\"ramah\",\"bersih\",\"cepat\"]','2026-09-11 00:42:55'),('rev_cianjur_046','hosp_rsud_cianjur_01','sresp_cianjur_046','Sangat puas dengan fasilitas rawat jalan. Obat farmasi cepat selesai tidak perlu antre lama.','POSITIVE','[\"obat\",\"farmasi\",\"cepat\",\"puas\"]','2026-09-11 14:42:55'),('rev_cianjur_048','hosp_rsud_cianjur_01','sresp_cianjur_048','Fasilitas ruang inap kelas 1 sangat nyaman, perawat sigap datang saat bel dipanggil.','POSITIVE','[\"rawat inap\",\"nyaman\",\"sigap\"]','2026-09-12 18:42:55'),('rev_cianjur_050','hosp_rsud_cianjur_01','sresp_cianjur_050','Pelayanan dokter dan perawat di IGD sangat cekatan dan ramah. Ruang tunggu bersih dan ber-AC.','POSITIVE','[\"dokter\",\"perawat\",\"ramah\",\"bersih\",\"cepat\"]','2026-09-13 22:42:55');
/*!40000 ALTER TABLE `survey_reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` varchar(26) NOT NULL,
  `hospital_id` varchar(26) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(120) NOT NULL,
  `role` enum('SUPER_ADMIN','HOSPITAL_ADMIN','FIELD_OFFICER') NOT NULL,
  `assigned_unit_id` varchar(26) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `last_login_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `failed_login_attempts` int(11) NOT NULL DEFAULT 0,
  `locked_until` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `idx_users_email` (`email`),
  KEY `idx_users_role_hospital` (`role`,`hospital_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('usr_admin_cianjur_02','hosp_rsud_cianjur_01','admin.rsud@cianjur.go.id','$2b$12$eJSLnJKji4UAYY0yb50ueemxNPlNj/Ap7qHId1W/ifwRC6Qhu51VO','H. Asep Saifullah, S.Kom','HOSPITAL_ADMIN',NULL,1,'2026-09-14 05:42:55',0,'0000-00-00 00:00:00','2026-09-14 05:42:55','2026-09-14 05:42:55'),('usr_admin_karawang_03','hosp_rsud_karawang_02','admin.rsud@karawang.go.id','$2b$12$eJSLnJKji4UAYY0yb50ueemxNPlNj/Ap7qHId1W/ifwRC6Qhu51VO','Dra. Siti Nurhaliza, M.M.','HOSPITAL_ADMIN',NULL,1,'2026-09-14 05:42:55',0,'0000-00-00 00:00:00','2026-09-14 05:42:55','2026-09-14 05:42:55'),('usr_petugas_cianjur_04','hosp_rsud_cianjur_01','petugas.igd@cianjur.go.id','$2b$12$xchONM1LroOX9M8Dfxjnfef74OwH1zo6cNX6fkKJAGrc5Doa3C3qG','Budi Santoso, A.Md.Kep','FIELD_OFFICER','u_cianjur_igd',1,'2026-09-14 05:42:55',0,'0000-00-00 00:00:00','2026-09-14 05:42:55','2026-09-14 05:42:55'),('usr_super_admin_01',NULL,'admin@surveikepuasan.id','$2b$12$eJSLnJKji4UAYY0yb50ueemxNPlNj/Ap7qHId1W/ifwRC6Qhu51VO','Dr. Pratama Wicaksono, M.Kes','SUPER_ADMIN',NULL,1,'2026-09-14 05:42:55',0,'0000-00-00 00:00:00','2026-09-14 05:42:55','2026-09-14 05:42:55');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-14 13:01:41
