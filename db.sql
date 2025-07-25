CREATE DATABASE  IF NOT EXISTS `argresearch` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `argresearch`;
-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: argresearch
-- ------------------------------------------------------
-- Server version	8.0.42-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entityName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entityId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action` enum('CREATE','UPDATE','DELETE','LOGIN','LOGOUT','EXPORT','VIEW') COLLATE utf8mb4_unicode_ci NOT NULL,
  `prevDataJSON` text COLLATE utf8mb4_unicode_ci,
  `newDataJSON` text COLLATE utf8mb4_unicode_ci,
  `timestamp` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `ip` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userAgent` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `audit_logs_userId_fkey` (`userId`),
  CONSTRAINT `audit_logs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES ('cmd25knj50004gu9m3t379y3a','User','cmd25kniq0002gu9m6p6xv1q1','cmd25kniq0002gu9m6p6xv1q1','CREATE',NULL,'{\"user\":{\"id\":\"cmd25kniq0002gu9m6p6xv1q1\",\"email\":\"admin@research.com\",\"name\":\"Felix Kiprotich\",\"passwordHash\":\"$2b$12$JlOYXFeDHpwK47aep5iLpuqRTO3EC3ksS/0ZeYtUIXTfMZbXldEza\",\"role\":\"RESEARCHER\",\"isActive\":true,\"createdAt\":\"2025-07-13T20:54:34.515Z\",\"updatedAt\":\"2025-07-13T20:54:34.515Z\"},\"researcher\":null}','2025-07-13 20:54:34.527',NULL,NULL),('cmd26n1vb000egu9mlh8eh9ix','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":[\"recentActivity\"]}','2025-07-13 21:24:26.037',NULL,NULL),('cmd26nck8000ggu9m9rehcln6','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":[\"recentActivity\"]}','2025-07-13 21:24:39.895',NULL,NULL),('cmd26niib000igu9m2jxadll3','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":[\"recentActivity\"]}','2025-07-13 21:24:47.601',NULL,NULL),('cmd26rod4000kgu9meunuv05g','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":[\"recentActivity\"]}','2025-07-13 21:28:01.813',NULL,NULL),('cmd26upkc000mgu9mnc22rl5b','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":[\"recentActivity\"]}','2025-07-13 21:30:23.338',NULL,NULL),('cmd26uuap000ogu9mgh2k8zrv','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":[\"recentActivity\"]}','2025-07-13 21:30:29.472',NULL,NULL),('cmd26uvb5000qgu9mkzvn4yl4','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":[\"recentActivity\"]}','2025-07-13 21:30:30.784',NULL,NULL),('cmd26x9ze000sgu9mwihc16uf','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":[\"recentActivity\"]}','2025-07-13 21:32:23.112',NULL,NULL),('cmd26xavx000ugu9mfe16iz6w','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":[\"recentActivity\"]}','2025-07-13 21:32:24.284',NULL,NULL),('cmd26xbiq000wgu9mjfsozu9f','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":[\"recentActivity\"]}','2025-07-13 21:32:25.105',NULL,NULL),('cmd26xc73000ygu9mfxfc8kj7','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":[\"recentActivity\"]}','2025-07-13 21:32:25.981',NULL,NULL),('cmd26xctp0010gu9mtt3qkv3k','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":[\"recentActivity\"]}','2025-07-13 21:32:26.796',NULL,NULL),('cmd26y5ew0012gu9m3k2vv3xj','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":[\"recentActivity\"]}','2025-07-13 21:33:03.845',NULL,NULL),('cmd26y61t0014gu9mr3fozv07','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":[\"recentActivity\"]}','2025-07-13 21:33:04.672',NULL,NULL),('cmd26y6h20016gu9mhqex6c3r','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":[\"recentActivity\"]}','2025-07-13 21:33:05.220',NULL,NULL),('cmd26y6te0018gu9myosi2gl4','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":[\"recentActivity\"]}','2025-07-13 21:33:05.664',NULL,NULL),('cmd26y78q001agu9m7m7rigs2','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":[\"recentActivity\"]}','2025-07-13 21:33:06.217',NULL,NULL),('cmd26y7it001cgu9mo8b2cylo','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":[\"recentActivity\"]}','2025-07-13 21:33:06.580',NULL,NULL),('cmd26y7rk001egu9mzzfzctsl','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":[\"recentActivity\"]}','2025-07-13 21:33:06.895',NULL,NULL),('cmd26y82a001ggu9m2d5gr9t8','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":[\"recentActivity\"]}','2025-07-13 21:33:07.281',NULL,NULL),('cmd26y8ke001igu9mxh4f9hw5','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":[\"recentActivity\"]}','2025-07-13 21:33:07.932',NULL,NULL),('cmd26ye0p001kgu9mb6103tn3','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":[\"recentActivity\"]}','2025-07-13 21:33:15.000',NULL,NULL),('cmd27rqm60001gu8etitgothj','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":[\"proposals\",\"projects\",\"users\",\"financial\",\"recentActivity\"]}','2025-07-13 21:56:04.349',NULL,NULL),('cmd27rqq90003gu8e3rmkyekt','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":[\"proposals\",\"projects\",\"users\",\"financial\",\"recentActivity\"]}','2025-07-13 21:56:04.496',NULL,NULL),('cmd27s18g0005gu8eutmulene','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":[\"proposals\",\"projects\",\"users\",\"financial\",\"recentActivity\"]}','2025-07-13 21:56:18.111',NULL,NULL),('cmd27s1bl0007gu8ex5ok4o67','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":[\"proposals\",\"projects\",\"users\",\"financial\",\"recentActivity\"]}','2025-07-13 21:56:18.224',NULL,NULL),('cmd27suwn0009gu8eh589uejo','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":[\"proposals\",\"projects\",\"users\",\"financial\",\"recentActivity\"]}','2025-07-13 21:56:56.566',NULL,NULL),('cmd27sv0c000bgu8ebr2dsbi2','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":[\"proposals\",\"projects\",\"users\",\"financial\",\"recentActivity\"]}','2025-07-13 21:56:56.699',NULL,NULL),('cmd27wguk000dgu8evf5pvj6k','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":[\"proposals\",\"projects\",\"users\",\"financial\",\"recentActivity\"]}','2025-07-13 21:59:44.971',NULL,NULL),('cmd27wgzd000fgu8ehe51g2xu','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":[\"proposals\",\"projects\",\"users\",\"financial\",\"recentActivity\"]}','2025-07-13 21:59:45.144',NULL,NULL),('cmd27zpat000hgu8e3545cqqi','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":[\"proposals\",\"projects\",\"users\",\"financial\",\"recentActivity\"]}','2025-07-13 22:02:15.891',NULL,NULL),('cmd27zpgb000jgu8entajpbs6','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":[\"proposals\",\"projects\",\"users\",\"financial\",\"recentActivity\"]}','2025-07-13 22:02:16.090',NULL,NULL),('cmd27zybd000lgu8ekrwi5vvy','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":[\"proposals\",\"projects\",\"users\",\"financial\",\"recentActivity\"]}','2025-07-13 22:02:27.575',NULL,NULL),('cmd27zyh5000ngu8e8eixoutb','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":[\"proposals\",\"projects\",\"users\",\"financial\",\"recentActivity\"]}','2025-07-13 22:02:27.784',NULL,NULL),('cmdinozbm0001guiwqj68f7qo','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":true}','2025-07-25 10:06:08.337',NULL,NULL),('cmdinp18f0003guiw84c74aew','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":true}','2025-07-25 10:06:10.814',NULL,NULL),('cmdio6yru0005guiwgur41l42','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":true}','2025-07-25 10:20:07.433',NULL,NULL),('cmdio71000007guiwxqjv5a34','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":true}','2025-07-25 10:20:10.319',NULL,NULL),('cmdio7h1h0009guiwiwbbp4xa','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":true}','2025-07-25 10:20:31.108',NULL,NULL),('cmdio7j66000bguiwwszm8kcg','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":true}','2025-07-25 10:20:33.869',NULL,NULL),('cmdiob2rm000dguiwtr6gq3ug','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":true}','2025-07-25 10:23:19.233',NULL,NULL),('cmdiob56z000fguiwoaeblwuh','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":true}','2025-07-25 10:23:22.378',NULL,NULL),('cmdiocgm1000hguiwle12qlsz','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":true}','2025-07-25 10:24:23.832',NULL,NULL),('cmdioh6fn000jguiwsymvc112','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":true}','2025-07-25 10:28:03.923',NULL,NULL),('cmdiohe7q000lguiwfn0k8agi','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":true}','2025-07-25 10:28:14.005',NULL,NULL),('cmdiohhp0000nguiw5sa3o5ls','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":true}','2025-07-25 10:28:18.515',NULL,NULL),('cmdiohkg9000pguiwfzn7h14y','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":true}','2025-07-25 10:28:22.087',NULL,NULL),('cmdioviee000rguiw1jotujb3','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":true}','2025-07-25 10:39:12.614',NULL,NULL),('cmdiovkvd000tguiwzyauqbp7','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":true}','2025-07-25 10:39:15.816',NULL,NULL),('cmdioy4ak000vguiwtzprnfxc','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":true}','2025-07-25 10:41:14.299',NULL,NULL),('cmdioy9bp000xguiwsakavq2a','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":true}','2025-07-25 10:41:20.820',NULL,NULL),('cmdioyb7t000zguiw33i0q318','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":true}','2025-07-25 10:41:23.272',NULL,NULL),('cmdip20az0011guiwj9c8s1qy','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":true}','2025-07-25 10:44:15.754',NULL,NULL),('cmdip22ns0013guiwo864zv6a','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":true}','2025-07-25 10:44:18.807',NULL,NULL),('cmdip48jd0015guiw3hb1sfbc','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":true}','2025-07-25 10:45:59.736',NULL,NULL),('cmdip4asw0017guiw32qtbcz3','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":true}','2025-07-25 10:46:02.671',NULL,NULL),('cmdipa8hj0001gu45a53d5tm1','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":true}','2025-07-25 10:50:39.605',NULL,NULL),('cmdipaexv0003gu457n3hjpud','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":true}','2025-07-25 10:50:47.970',NULL,NULL),('cmdipcqqn0005gu45q4acw4il','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":true}','2025-07-25 10:52:36.574',NULL,NULL),('cmdipcspt0007gu45g4v4upes','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":true}','2025-07-25 10:52:39.136',NULL,NULL),('cmdiprn5b0001gugnx8vsl63x','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":true}','2025-07-25 11:04:11.757',NULL,NULL),('cmdiprp190003gugn0no8hx3w','Dashboard','stats','cmd25kniq0002gu9m6p6xv1q1','VIEW',NULL,'{\"statsRequested\":true}','2025-07-25 11:04:14.204',NULL,NULL);
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `co_investigators`
--

DROP TABLE IF EXISTS `co_investigators`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `co_investigators` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `proposalId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `co_investigators_proposalId_fkey` (`proposalId`),
  CONSTRAINT `co_investigators_proposalId_fkey` FOREIGN KEY (`proposalId`) REFERENCES `proposals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `co_investigators`
--

LOCK TABLES `co_investigators` WRITE;
/*!40000 ALTER TABLE `co_investigators` DISABLE KEYS */;
/*!40000 ALTER TABLE `co_investigators` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `headOfDept` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `departments_name_key` (`name`),
  UNIQUE KEY `departments_code_key` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES ('dhcksd','test','12','test','test',1,'2025-07-14 00:52:25.523','2025-07-14 00:52:25.523');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_templates`
--

DROP TABLE IF EXISTS `email_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_templates` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `body` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `variables` text COLLATE utf8mb4_unicode_ci,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_templates_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_templates`
--

LOCK TABLES `email_templates` WRITE;
/*!40000 ALTER TABLE `email_templates` DISABLE KEYS */;
/*!40000 ALTER TABLE `email_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evaluations`
--

DROP TABLE IF EXISTS `evaluations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evaluations` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `projectId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `evaluatorId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `score` int DEFAULT NULL,
  `date` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `attachmentPath` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `evaluations_projectId_fkey` (`projectId`),
  KEY `evaluations_evaluatorId_fkey` (`evaluatorId`),
  CONSTRAINT `evaluations_evaluatorId_fkey` FOREIGN KEY (`evaluatorId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `evaluations_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evaluations`
--

LOCK TABLES `evaluations` WRITE;
/*!40000 ALTER TABLE `evaluations` DISABLE KEYS */;
/*!40000 ALTER TABLE `evaluations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedbacks`
--

DROP TABLE IF EXISTS `feedbacks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedbacks` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `projectId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `authorId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('RESEARCHER','SUPERVISOR','STAKEHOLDER') COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `feedbacks_projectId_fkey` (`projectId`),
  KEY `feedbacks_authorId_fkey` (`authorId`),
  CONSTRAINT `feedbacks_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `feedbacks_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedbacks`
--

LOCK TABLES `feedbacks` WRITE;
/*!40000 ALTER TABLE `feedbacks` DISABLE KEYS */;
/*!40000 ALTER TABLE `feedbacks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `financial_years`
--

DROP TABLE IF EXISTS `financial_years`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `financial_years` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `startDate` datetime(3) NOT NULL,
  `endDate` datetime(3) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `financial_years_label_key` (`label`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `financial_years`
--

LOCK TABLES `financial_years` WRITE;
/*!40000 ALTER TABLE `financial_years` DISABLE KEYS */;
INSERT INTO `financial_years` VALUES ('cmd284y3p000ogu8e0ahvhgpm','fy25','2025-07-14 00:00:00.000','2025-08-07 00:00:00.000',1,'2025-07-13 22:06:20.582','2025-07-13 22:06:20.582');
/*!40000 ALTER TABLE `financial_years` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `follow_up_tasks`
--

DROP TABLE IF EXISTS `follow_up_tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `follow_up_tasks` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `feedbackId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dueDate` datetime(3) NOT NULL,
  `status` enum('PENDING','IN_PROGRESS','COMPLETED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `reminderSent` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `follow_up_tasks_feedbackId_fkey` (`feedbackId`),
  CONSTRAINT `follow_up_tasks_feedbackId_fkey` FOREIGN KEY (`feedbackId`) REFERENCES `feedbacks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `follow_up_tasks`
--

LOCK TABLES `follow_up_tasks` WRITE;
/*!40000 ALTER TABLE `follow_up_tasks` DISABLE KEYS */;
/*!40000 ALTER TABLE `follow_up_tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grant_openings`
--

DROP TABLE IF EXISTS `grant_openings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grant_openings` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `financialYearId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `openDate` datetime(3) NOT NULL,
  `closeDate` datetime(3) NOT NULL,
  `budgetCeiling` decimal(15,2) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `grant_openings_financialYearId_fkey` (`financialYearId`),
  CONSTRAINT `grant_openings_financialYearId_fkey` FOREIGN KEY (`financialYearId`) REFERENCES `financial_years` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grant_openings`
--

LOCK TABLES `grant_openings` WRITE;
/*!40000 ALTER TABLE `grant_openings` DISABLE KEYS */;
INSERT INTO `grant_openings` VALUES ('cmd284y3p000ogu8e0ahvhgpm','cmd284y3p000ogu8e0ahvhgpm','test','test','2025-07-13 22:06:20.582','2025-07-16 22:06:20.582',10000.00,1,'2025-07-13 22:06:20.582','2025-07-13 22:06:20.582');
/*!40000 ALTER TABLE `grant_openings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `impact_metrics`
--

DROP TABLE IF EXISTS `impact_metrics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `impact_metrics` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `projectId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `indicator` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `baseline` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `result` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unit` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recordedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `impact_metrics_projectId_fkey` (`projectId`),
  CONSTRAINT `impact_metrics_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `impact_metrics`
--

LOCK TABLES `impact_metrics` WRITE;
/*!40000 ALTER TABLE `impact_metrics` DISABLE KEYS */;
/*!40000 ALTER TABLE `impact_metrics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `login_audits`
--

DROP TABLE IF EXISTS `login_audits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login_audits` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `eventType` enum('LOGIN','LOGOUT','FAILED_LOGIN') COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userAgent` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timestamp` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `login_audits_userId_fkey` (`userId`),
  CONSTRAINT `login_audits_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login_audits`
--

LOCK TABLES `login_audits` WRITE;
/*!40000 ALTER TABLE `login_audits` DISABLE KEYS */;
/*!40000 ALTER TABLE `login_audits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES ('perm_access_api','access_api','Access API','General',1,'2025-07-13 20:54:34.515','2025-07-13 20:54:34.515'),('perm_approve_budgets','approve_budgets','Approve budgets','Financial Management',1,'2025-07-13 20:54:34.515','2025-07-13 20:54:34.515'),('perm_approve_proposals','approve_proposals','Approve proposals','Proposal Management',1,'2025-07-13 20:54:34.515','2025-07-13 20:54:34.515'),('perm_approve_researchers','approve_researchers','Approve researcher accounts','User Management',1,'2025-07-13 20:54:34.515','2025-07-13 20:54:34.515'),('perm_bulk_manage_proposals','bulk_manage_proposals','Bulk manage proposals','Proposal Management',1,'2025-07-13 20:54:34.515','2025-07-13 20:54:34.515'),('perm_create_custom_reports','create_custom_reports','Create custom reports','Reporting',1,'2025-07-13 20:54:34.515','2025-07-13 20:54:34.515'),('perm_create_proposals','create_proposals','Create research proposals','Proposal Management',1,'2025-07-13 20:54:34.515','2025-07-13 20:54:34.515'),('perm_edit_own_proposals','edit_own_proposals','Edit own proposals','Proposal Management',1,'2025-07-13 20:54:34.515','2025-07-13 20:54:34.515'),('perm_evaluate_projects','evaluate_projects','Evaluate projects','Project Management',1,'2025-07-13 20:54:34.515','2025-07-13 20:54:34.515'),('perm_export_data','export_data','Export data','Reporting',1,'2025-07-13 20:54:34.515','2025-07-13 20:54:34.515'),('perm_manage_budgets','manage_budgets','Manage budgets','Financial Management',1,'2025-07-13 20:54:34.515','2025-07-13 20:54:34.515'),('perm_manage_departments','manage_departments','Manage departments','System Administration',1,'2025-07-13 20:54:34.515','2025-07-13 20:54:34.515'),('perm_manage_email_templates','manage_email_templates','Manage email templates','Communication',1,'2025-07-13 20:54:34.515','2025-07-13 20:54:34.515'),('perm_manage_evaluations','manage_evaluations','Manage evaluations','Feedback',1,'2025-07-13 20:54:34.515','2025-07-13 20:54:34.515'),('perm_manage_financial_years','manage_financial_years','Manage financial years','System Administration',1,'2025-07-13 20:54:34.515','2025-07-13 20:54:34.515'),('perm_manage_grants','manage_grants','Manage grants','System Administration',1,'2025-07-13 20:54:34.515','2025-07-13 20:54:34.515'),('perm_manage_security','manage_security','Manage security','Audit',1,'2025-07-13 20:54:34.515','2025-07-13 20:54:34.515'),('perm_manage_themes','manage_themes','Manage themes','System Administration',1,'2025-07-13 20:54:34.515','2025-07-13 20:54:34.515'),('perm_manage_users','manage_users','Manage system users','User Management',1,'2025-07-13 20:54:34.515','2025-07-13 20:54:34.515'),('perm_provide_feedback','provide_feedback','Provide feedback','Feedback',1,'2025-07-13 20:54:34.515','2025-07-13 20:54:34.515'),('perm_review_proposals','review_proposals','Review proposals','Proposal Management',1,'2025-07-13 20:54:34.515','2025-07-13 20:54:34.515'),('perm_send_notifications','send_notifications','Send notifications','Communication',1,'2025-07-13 20:54:34.515','2025-07-13 20:54:34.515'),('perm_supervise_projects','supervise_projects','Supervise projects','Project Management',1,'2025-07-13 20:54:34.515','2025-07-13 20:54:34.515'),('perm_system_settings','system_settings','Access system settings','System Administration',1,'2025-07-13 20:54:34.515','2025-07-13 20:54:34.515'),('perm_update_profile','update_profile','Update profile','General',1,'2025-07-13 20:54:34.515','2025-07-13 20:54:34.515'),('perm_update_project_status','update_project_status','Update project status','Project Management',1,'2025-07-13 20:54:34.515','2025-07-13 20:54:34.515'),('perm_view_all_activities','view_all_activities','View all activities','Audit',1,'2025-07-13 20:54:34.515','2025-07-13 20:54:34.515'),('perm_view_all_projects','view_all_projects','View all projects','Project Management',1,'2025-07-13 20:54:34.515','2025-07-13 20:54:34.515'),('perm_view_all_proposals','view_all_proposals','View all proposals','Proposal Management',1,'2025-07-13 20:54:34.515','2025-07-13 20:54:34.515'),('perm_view_all_users','view_all_users','View all system users','User Management',1,'2025-07-13 20:54:34.515','2025-07-13 20:54:34.515'),('perm_view_audit_logs','view_audit_logs','View audit logs','Audit',1,'2025-07-13 20:54:34.515','2025-07-13 20:54:34.515'),('perm_view_dashboard','view_dashboard','View dashboard','General',1,'2025-07-13 20:54:34.515','2025-07-13 20:54:34.515'),('perm_view_feedback','view_feedback','View feedback','Feedback',1,'2025-07-13 20:54:34.515','2025-07-13 20:54:34.515'),('perm_view_financial_data','view_financial_data','View financial data','Financial Management',1,'2025-07-13 20:54:34.515','2025-07-13 20:54:34.515'),('perm_view_own_projects','view_own_projects','View own projects','Project Management',1,'2025-07-13 20:54:34.515','2025-07-13 20:54:34.515'),('perm_view_own_proposals','view_own_proposals','View own proposals','Proposal Management',1,'2025-07-13 20:54:34.515','2025-07-13 20:54:34.515'),('perm_view_reports','view_reports','View reports','Reporting',1,'2025-07-13 20:54:34.515','2025-07-13 20:54:34.515');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `proposalId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `supervisorId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `startDate` datetime(3) NOT NULL,
  `endDate` datetime(3) DEFAULT NULL,
  `status` enum('INITIATED','IN_PROGRESS','COMPLETED','SUSPENDED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'INITIATED',
  `overallProgress` int NOT NULL DEFAULT '0',
  `budgetUtilized` decimal(15,2) NOT NULL DEFAULT '0.00',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `projects_proposalId_key` (`proposalId`),
  KEY `projects_supervisorId_fkey` (`supervisorId`),
  CONSTRAINT `projects_proposalId_fkey` FOREIGN KEY (`proposalId`) REFERENCES `proposals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `projects_supervisorId_fkey` FOREIGN KEY (`supervisorId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proposal_attachments`
--

DROP TABLE IF EXISTS `proposal_attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proposal_attachments` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `proposalId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fileName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `filePath` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fileType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fileSize` int NOT NULL,
  `uploadedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `proposal_attachments_proposalId_fkey` (`proposalId`),
  CONSTRAINT `proposal_attachments_proposalId_fkey` FOREIGN KEY (`proposalId`) REFERENCES `proposals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proposal_attachments`
--

LOCK TABLES `proposal_attachments` WRITE;
/*!40000 ALTER TABLE `proposal_attachments` DISABLE KEYS */;
/*!40000 ALTER TABLE `proposal_attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proposal_budget_items`
--

DROP TABLE IF EXISTS `proposal_budget_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proposal_budget_items` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `proposalId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `itemName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cost` decimal(15,2) NOT NULL,
  `notes` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `proposal_budget_items_proposalId_fkey` (`proposalId`),
  CONSTRAINT `proposal_budget_items_proposalId_fkey` FOREIGN KEY (`proposalId`) REFERENCES `proposals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proposal_budget_items`
--

LOCK TABLES `proposal_budget_items` WRITE;
/*!40000 ALTER TABLE `proposal_budget_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `proposal_budget_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proposals`
--

DROP TABLE IF EXISTS `proposals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proposals` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `researcherId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `grantOpeningId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `themeId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `researchTitle` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `objectives` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `methodology` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `timeline` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `requestedAmount` decimal(15,2) NOT NULL,
  `approvedAmount` decimal(15,2) DEFAULT NULL,
  `status` enum('SUBMITTED','RECEIVED','UNDER_REVIEW','APPROVED','REJECTED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'SUBMITTED',
  `priority` enum('LOW','MEDIUM','HIGH','URGENT') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'MEDIUM',
  `submissionDate` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `reviewDate` datetime(3) DEFAULT NULL,
  `approvalDate` datetime(3) DEFAULT NULL,
  `rejectionReason` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `proposals_researcherId_fkey` (`researcherId`),
  KEY `proposals_grantOpeningId_fkey` (`grantOpeningId`),
  KEY `proposals_themeId_fkey` (`themeId`),
  CONSTRAINT `proposals_grantOpeningId_fkey` FOREIGN KEY (`grantOpeningId`) REFERENCES `grant_openings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `proposals_researcherId_fkey` FOREIGN KEY (`researcherId`) REFERENCES `researchers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `proposals_themeId_fkey` FOREIGN KEY (`themeId`) REFERENCES `themes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proposals`
--

LOCK TABLES `proposals` WRITE;
/*!40000 ALTER TABLE `proposals` DISABLE KEYS */;
/*!40000 ALTER TABLE `proposals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `publications`
--

DROP TABLE IF EXISTS `publications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `publications` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `proposalId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `journal` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `year` int DEFAULT NULL,
  `link` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `doi` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `publications_proposalId_fkey` (`proposalId`),
  CONSTRAINT `publications_proposalId_fkey` FOREIGN KEY (`proposalId`) REFERENCES `proposals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `publications`
--

LOCK TABLES `publications` WRITE;
/*!40000 ALTER TABLE `publications` DISABLE KEYS */;
/*!40000 ALTER TABLE `publications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `research_design_items`
--

DROP TABLE IF EXISTS `research_design_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `research_design_items` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `proposalId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `research_design_items_proposalId_fkey` (`proposalId`),
  CONSTRAINT `research_design_items_proposalId_fkey` FOREIGN KEY (`proposalId`) REFERENCES `proposals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `research_design_items`
--

LOCK TABLES `research_design_items` WRITE;
/*!40000 ALTER TABLE `research_design_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `research_design_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `researchers`
--

DROP TABLE IF EXISTS `researchers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `researchers` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `employeeNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `departmentId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `designation` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isApproved` tinyint(1) NOT NULL DEFAULT '0',
  `approvedAt` datetime(3) DEFAULT NULL,
  `approvedBy` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `researchers_userId_key` (`userId`),
  UNIQUE KEY `researchers_employeeNumber_key` (`employeeNumber`),
  KEY `researchers_departmentId_fkey` (`departmentId`),
  CONSTRAINT `researchers_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `departments` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `researchers_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `researchers`
--

LOCK TABLES `researchers` WRITE;
/*!40000 ALTER TABLE `researchers` DISABLE KEYS */;
INSERT INTO `researchers` VALUES ('gsdhkad','cmd25kniq0002gu9m6p6xv1q1','123','dhcksd','test','89898',1,'2025-07-14 00:52:25.523','cmd25kniq0002gu9m6p6xv1q1');
/*!40000 ALTER TABLE `researchers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permissions` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('ADMIN','RESEARCHER','SUPERVISOR','GENERAL_USER') COLLATE utf8mb4_unicode_ci NOT NULL,
  `permissionId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `granted` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_permissions_role_permissionId_key` (`role`,`permissionId`),
  KEY `role_permissions_permissionId_fkey` (`permissionId`),
  CONSTRAINT `role_permissions_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
INSERT INTO `role_permissions` VALUES ('a9b4214c-6033-11f0-a910-7470fddec5bf','ADMIN','perm_access_api',1,'2025-07-14 00:52:25.523','2025-07-14 00:52:25.000'),('a9b42b7d-6033-11f0-a910-7470fddec5bf','ADMIN','perm_approve_budgets',1,'2025-07-14 00:52:25.523','2025-07-14 00:52:25.000'),('a9b432f9-6033-11f0-a910-7470fddec5bf','ADMIN','perm_approve_proposals',1,'2025-07-14 00:52:25.523','2025-07-14 00:52:25.000'),('a9b43970-6033-11f0-a910-7470fddec5bf','ADMIN','perm_approve_researchers',1,'2025-07-14 00:52:25.523','2025-07-14 00:52:25.000'),('a9b43ef9-6033-11f0-a910-7470fddec5bf','ADMIN','perm_bulk_manage_proposals',1,'2025-07-14 00:52:25.523','2025-07-14 00:52:25.000'),('a9b44403-6033-11f0-a910-7470fddec5bf','ADMIN','perm_create_custom_reports',1,'2025-07-14 00:52:25.523','2025-07-14 00:52:25.000'),('a9b44988-6033-11f0-a910-7470fddec5bf','ADMIN','perm_create_proposals',1,'2025-07-14 00:52:25.523','2025-07-14 00:52:25.000'),('a9b44ec8-6033-11f0-a910-7470fddec5bf','ADMIN','perm_edit_own_proposals',1,'2025-07-14 00:52:25.523','2025-07-14 00:52:25.000'),('a9b453fd-6033-11f0-a910-7470fddec5bf','ADMIN','perm_evaluate_projects',1,'2025-07-14 00:52:25.523','2025-07-14 00:52:25.000'),('a9b45a35-6033-11f0-a910-7470fddec5bf','ADMIN','perm_export_data',1,'2025-07-14 00:52:25.523','2025-07-14 00:52:25.000'),('a9b45f8f-6033-11f0-a910-7470fddec5bf','ADMIN','perm_manage_budgets',1,'2025-07-14 00:52:25.523','2025-07-14 00:52:25.000'),('a9b465e7-6033-11f0-a910-7470fddec5bf','ADMIN','perm_manage_departments',1,'2025-07-14 00:52:25.523','2025-07-14 00:52:25.000'),('a9b46b75-6033-11f0-a910-7470fddec5bf','ADMIN','perm_manage_email_templates',1,'2025-07-14 00:52:25.523','2025-07-14 00:52:25.000'),('a9b47173-6033-11f0-a910-7470fddec5bf','ADMIN','perm_manage_evaluations',1,'2025-07-14 00:52:25.523','2025-07-14 00:52:25.000'),('a9b47792-6033-11f0-a910-7470fddec5bf','ADMIN','perm_manage_financial_years',1,'2025-07-14 00:52:25.523','2025-07-14 00:52:25.000'),('a9b47d42-6033-11f0-a910-7470fddec5bf','ADMIN','perm_manage_grants',1,'2025-07-14 00:52:25.523','2025-07-14 00:52:25.000'),('a9b48301-6033-11f0-a910-7470fddec5bf','ADMIN','perm_manage_security',1,'2025-07-14 00:52:25.523','2025-07-14 00:52:25.000'),('a9b4886a-6033-11f0-a910-7470fddec5bf','ADMIN','perm_manage_themes',1,'2025-07-14 00:52:25.523','2025-07-14 00:52:25.000'),('a9b48d93-6033-11f0-a910-7470fddec5bf','ADMIN','perm_manage_users',1,'2025-07-14 00:52:25.523','2025-07-14 00:52:25.000'),('a9b49374-6033-11f0-a910-7470fddec5bf','ADMIN','perm_provide_feedback',1,'2025-07-14 00:52:25.523','2025-07-14 00:52:25.000'),('a9b498b0-6033-11f0-a910-7470fddec5bf','ADMIN','perm_review_proposals',1,'2025-07-14 00:52:25.523','2025-07-14 00:52:25.000'),('a9b49da1-6033-11f0-a910-7470fddec5bf','ADMIN','perm_send_notifications',1,'2025-07-14 00:52:25.523','2025-07-14 00:52:25.000'),('a9b4a1aa-6033-11f0-a910-7470fddec5bf','ADMIN','perm_supervise_projects',1,'2025-07-14 00:52:25.523','2025-07-14 00:52:25.000'),('a9b4a6d9-6033-11f0-a910-7470fddec5bf','ADMIN','perm_system_settings',1,'2025-07-14 00:52:25.523','2025-07-14 00:52:25.000'),('a9b4ac77-6033-11f0-a910-7470fddec5bf','ADMIN','perm_update_profile',1,'2025-07-14 00:52:25.523','2025-07-14 00:52:25.000'),('a9b4b278-6033-11f0-a910-7470fddec5bf','ADMIN','perm_update_project_status',1,'2025-07-14 00:52:25.523','2025-07-14 00:52:25.000'),('a9b4b781-6033-11f0-a910-7470fddec5bf','ADMIN','perm_view_all_activities',1,'2025-07-14 00:52:25.523','2025-07-14 00:52:25.000'),('a9b4bcc1-6033-11f0-a910-7470fddec5bf','ADMIN','perm_view_all_projects',1,'2025-07-14 00:52:25.523','2025-07-14 00:52:25.000'),('a9b4c230-6033-11f0-a910-7470fddec5bf','ADMIN','perm_view_all_proposals',1,'2025-07-14 00:52:25.523','2025-07-14 00:52:25.000'),('a9b4c7db-6033-11f0-a910-7470fddec5bf','ADMIN','perm_view_all_users',1,'2025-07-14 00:52:25.523','2025-07-14 00:52:25.000'),('a9b4cd69-6033-11f0-a910-7470fddec5bf','ADMIN','perm_view_audit_logs',1,'2025-07-14 00:52:25.523','2025-07-14 00:52:25.000'),('a9b4d2cd-6033-11f0-a910-7470fddec5bf','ADMIN','perm_view_dashboard',1,'2025-07-14 00:52:25.523','2025-07-14 00:52:25.000'),('a9b4d8b4-6033-11f0-a910-7470fddec5bf','ADMIN','perm_view_feedback',1,'2025-07-14 00:52:25.523','2025-07-14 00:52:25.000'),('a9b4de54-6033-11f0-a910-7470fddec5bf','ADMIN','perm_view_financial_data',1,'2025-07-14 00:52:25.523','2025-07-14 00:52:25.000'),('a9b4e271-6033-11f0-a910-7470fddec5bf','ADMIN','perm_view_own_projects',1,'2025-07-14 00:52:25.523','2025-07-14 00:52:25.000'),('a9b4e72f-6033-11f0-a910-7470fddec5bf','ADMIN','perm_view_own_proposals',1,'2025-07-14 00:52:25.523','2025-07-14 00:52:25.000'),('a9b4ec75-6033-11f0-a910-7470fddec5bf','ADMIN','perm_view_reports',1,'2025-07-14 00:52:25.523','2025-07-14 00:52:25.000');
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `themes`
--

DROP TABLE IF EXISTS `themes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `themes` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `themes_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `themes`
--

LOCK TABLES `themes` WRITE;
/*!40000 ALTER TABLE `themes` DISABLE KEYS */;
/*!40000 ALTER TABLE `themes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_permissions`
--

DROP TABLE IF EXISTS `user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_permissions` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `permissionId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `granted` tinyint(1) NOT NULL DEFAULT '1',
  `grantedBy` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `grantedAt` datetime(3) DEFAULT NULL,
  `revokedBy` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `revokedAt` datetime(3) DEFAULT NULL,
  `expiresAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_permissions_userId_permissionId_key` (`userId`,`permissionId`),
  KEY `user_permissions_permissionId_fkey` (`permissionId`),
  CONSTRAINT `user_permissions_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_permissions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_permissions`
--

LOCK TABLES `user_permissions` WRITE;
/*!40000 ALTER TABLE `user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `passwordHash` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('ADMIN','RESEARCHER','SUPERVISOR','GENERAL_USER') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'GENERAL_USER',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('cmd25kniq0002gu9m6p6xv1q1','admin@research.com','Felix Kiprotich','$2b$12$JlOYXFeDHpwK47aep5iLpuqRTO3EC3ksS/0ZeYtUIXTfMZbXldEza','ADMIN',1,'2025-07-13 20:54:34.515','2025-07-13 20:54:34.515');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workplan_items`
--

DROP TABLE IF EXISTS `workplan_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workplan_items` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `proposalId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `activity` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `startDate` datetime(3) NOT NULL,
  `endDate` datetime(3) NOT NULL,
  `notes` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `workplan_items_proposalId_fkey` (`proposalId`),
  CONSTRAINT `workplan_items_proposalId_fkey` FOREIGN KEY (`proposalId`) REFERENCES `proposals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workplan_items`
--

LOCK TABLES `workplan_items` WRITE;
/*!40000 ALTER TABLE `workplan_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `workplan_items` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-25 14:06:00
