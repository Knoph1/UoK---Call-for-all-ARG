CREATE DATABASE  IF NOT EXISTS `argtest` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `argtest`;
-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: localhost    Database: argtest
-- ------------------------------------------------------
-- Server version	8.0.32

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
-- Table structure for table `collaborators`
--

DROP TABLE IF EXISTS `collaborators`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `collaborators` (
  `collaboratorid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `proposalidfk` bigint unsigned NOT NULL,
  `collaboratorname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `institution` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `researcharea` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `experience` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`collaboratorid`),
  KEY `collaborators_proposalidfk_foreign` (`proposalidfk`),
  CONSTRAINT `collaborators_proposalidfk_foreign` FOREIGN KEY (`proposalidfk`) REFERENCES `proposals` (`proposalid`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `collaborators`
--

LOCK TABLES `collaborators` WRITE;
/*!40000 ALTER TABLE `collaborators` DISABLE KEYS */;
/*!40000 ALTER TABLE `collaborators` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `depid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `schoolfk` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `shortname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`depid`),
  KEY `departments_schoolfk_foreign` (`schoolfk`),
  CONSTRAINT `departments_schoolfk_foreign` FOREIGN KEY (`schoolfk`) REFERENCES `schools` (`schoolid`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES ('0409f05e-f03a-422a-b13e-8ee35e1aa41d','89d26b77-daad-4da3-9b41-549e9b46e3a0','ict','test','2024-08-02 07:00:15','2024-08-28 10:27:31'),('05dba02d-b830-4258-a648-69c65b6a239a','89d26b77-daad-4da3-9b41-549e9b46e3a0','computer','resolved successfully','2024-08-28 08:20:40','2024-08-29 09:42:03');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expenditures`
--

DROP TABLE IF EXISTS `expenditures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expenditures` (
  `expenditureid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `proposalidfk` bigint unsigned NOT NULL,
  `item` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `itemtype` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `unitprice` decimal(8,2) NOT NULL,
  `total` decimal(15,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`expenditureid`),
  KEY `expenditures_proposalidfk_foreign` (`proposalidfk`),
  CONSTRAINT `expenditures_proposalidfk_foreign` FOREIGN KEY (`proposalidfk`) REFERENCES `proposals` (`proposalid`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenditures`
--

LOCK TABLES `expenditures` WRITE;
/*!40000 ALTER TABLE `expenditures` DISABLE KEYS */;
INSERT INTO `expenditures` VALUES ('513c9acb-e855-4558-914f-829380d06768',1,'test','Facilities',1,1000.00,1000.00,'2024-09-03 05:42:40','2024-09-03 05:42:40');
/*!40000 ALTER TABLE `expenditures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
INSERT INTO `failed_jobs` VALUES (1,'7c1ce64b-956a-4143-a6b0-39d560dd678b','database','default','{\"uuid\":\"7c1ce64b-956a-4143-a6b0-39d560dd678b\",\"displayName\":\"App\\\\Jobs\\\\SendEmailNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendEmailNotification\",\"command\":\"O:30:\\\"App\\\\Jobs\\\\SendEmailNotification\\\":2:{s:8:\\\"\\u0000*\\u0000email\\\";s:23:\\\"fkiprotich845@gmail.com\\\";s:15:\\\"\\u0000*\\u0000notification\\\";O:39:\\\"App\\\\Notifications\\\\GeneralProposalAction\\\":8:{s:8:\\\"greeting\\\";s:20:\\\"Hello Dear, John Doe\\\";s:5:\\\"level\\\";s:7:\\\"success\\\";s:10:\\\"introLines\\\";a:1:{i:0;s:42:\\\"This Project has been assigned M & E Team.\\\";}s:9:\\\"actionUrl\\\";s:45:\\\"http:\\/\\/localhost:8000\\/projects\\/allprojects\\/15\\\";s:10:\\\"actionText\\\";s:12:\\\"View Project\\\";s:10:\\\"outroLines\\\";a:1:{i:0;s:134:\\\"If you received this message mistakenly, Kindly Ignore and report to the Administrator to prevent receiving this mail again in future.\\\";}s:10:\\\"salutation\\\";s:12:\\\"Best Regards\\\";s:7:\\\"subject\\\";s:30:\\\"Project Monitoring Assignment!\\\";}}\"}}','Symfony\\Component\\Mailer\\Exception\\TransportException: Failed to authenticate on SMTP server with username \"dev@tagile.rolinsoft.com\" using the following authenticators: \"LOGIN\", \"PLAIN\". Authenticator \"LOGIN\" returned \"Expected response code \"235\" but got code \"535\", with message \"535 Incorrect authentication data\".\". Authenticator \"PLAIN\" returned \"Expected response code \"235\" but got code \"535\", with message \"535 Incorrect authentication data\".\". in C:\\xampp\\htdocs\\testarg\\vendor\\symfony\\mailer\\Transport\\Smtp\\EsmtpTransport.php:198\nStack trace:\n#0 C:\\xampp\\htdocs\\testarg\\vendor\\symfony\\mailer\\Transport\\Smtp\\EsmtpTransport.php(123): Symfony\\Component\\Mailer\\Transport\\Smtp\\EsmtpTransport->handleAuth(Array)\n#1 C:\\xampp\\htdocs\\testarg\\vendor\\symfony\\mailer\\Transport\\Smtp\\SmtpTransport.php(253): Symfony\\Component\\Mailer\\Transport\\Smtp\\EsmtpTransport->doHeloCommand()\n#2 C:\\xampp\\htdocs\\testarg\\vendor\\symfony\\mailer\\Transport\\Smtp\\SmtpTransport.php(194): Symfony\\Component\\Mailer\\Transport\\Smtp\\SmtpTransport->start()\n#3 C:\\xampp\\htdocs\\testarg\\vendor\\symfony\\mailer\\Transport\\AbstractTransport.php(69): Symfony\\Component\\Mailer\\Transport\\Smtp\\SmtpTransport->doSend(Object(Symfony\\Component\\Mailer\\SentMessage))\n#4 C:\\xampp\\htdocs\\testarg\\vendor\\symfony\\mailer\\Transport\\Smtp\\SmtpTransport.php(136): Symfony\\Component\\Mailer\\Transport\\AbstractTransport->send(Object(Symfony\\Component\\Mailer\\SentMessage), Object(Symfony\\Component\\Mailer\\DelayedEnvelope))\n#5 C:\\xampp\\htdocs\\testarg\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\Mailer.php(523): Symfony\\Component\\Mailer\\Transport\\Smtp\\SmtpTransport->send(Object(Symfony\\Component\\Mime\\Email), Object(Symfony\\Component\\Mailer\\DelayedEnvelope))\n#6 C:\\xampp\\htdocs\\testarg\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\Mailer.php(287): Illuminate\\Mail\\Mailer->sendSymfonyMessage(Object(Symfony\\Component\\Mime\\Email))\n#7 C:\\xampp\\htdocs\\testarg\\vendor\\laravel\\framework\\src\\Illuminate\\Notifications\\Channels\\MailChannel.php(67): Illuminate\\Mail\\Mailer->send(Object(Illuminate\\Support\\HtmlString), Array, Object(Closure))\n#8 C:\\xampp\\htdocs\\testarg\\vendor\\laravel\\framework\\src\\Illuminate\\Notifications\\NotificationSender.php(148): Illuminate\\Notifications\\Channels\\MailChannel->send(Object(Illuminate\\Notifications\\AnonymousNotifiable), Object(App\\Notifications\\GeneralProposalAction))\n#9 C:\\xampp\\htdocs\\testarg\\vendor\\laravel\\framework\\src\\Illuminate\\Notifications\\NotificationSender.php(106): Illuminate\\Notifications\\NotificationSender->sendToNotifiable(Object(Illuminate\\Notifications\\AnonymousNotifiable), \'346a6a7b-efeb-4...\', Object(App\\Notifications\\GeneralProposalAction), \'mail\')\n#10 C:\\xampp\\htdocs\\testarg\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Traits\\Localizable.php(19): Illuminate\\Notifications\\NotificationSender->Illuminate\\Notifications\\{closure}()\n#11 C:\\xampp\\htdocs\\testarg\\vendor\\laravel\\framework\\src\\Illuminate\\Notifications\\NotificationSender.php(109): Illuminate\\Notifications\\NotificationSender->withLocale(NULL, Object(Closure))\n#12 C:\\xampp\\htdocs\\testarg\\vendor\\laravel\\framework\\src\\Illuminate\\Notifications\\NotificationSender.php(79): Illuminate\\Notifications\\NotificationSender->sendNow(Array, Object(App\\Notifications\\GeneralProposalAction))\n#13 C:\\xampp\\htdocs\\testarg\\vendor\\laravel\\framework\\src\\Illuminate\\Notifications\\ChannelManager.php(39): Illuminate\\Notifications\\NotificationSender->send(Array, Object(App\\Notifications\\GeneralProposalAction))\n#14 C:\\xampp\\htdocs\\testarg\\vendor\\laravel\\framework\\src\\Illuminate\\Notifications\\AnonymousNotifiable.php(45): Illuminate\\Notifications\\ChannelManager->send(Object(Illuminate\\Notifications\\AnonymousNotifiable), Object(App\\Notifications\\GeneralProposalAction))\n#15 C:\\xampp\\htdocs\\testarg\\app\\Jobs\\SendEmailNotification.php(28): Illuminate\\Notifications\\AnonymousNotifiable->notify(Object(App\\Notifications\\GeneralProposalAction))\n#16 C:\\xampp\\htdocs\\testarg\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): App\\Jobs\\SendEmailNotification->handle()\n#17 C:\\xampp\\htdocs\\testarg\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(41): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#18 C:\\xampp\\htdocs\\testarg\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(93): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#19 C:\\xampp\\htdocs\\testarg\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(37): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#20 C:\\xampp\\htdocs\\testarg\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(661): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#21 C:\\xampp\\htdocs\\testarg\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(128): Illuminate\\Container\\Container->call(Array)\n#22 C:\\xampp\\htdocs\\testarg\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(141): Illuminate\\Bus\\Dispatcher->Illuminate\\Bus\\{closure}(Object(App\\Jobs\\SendEmailNotification))\n#23 C:\\xampp\\htdocs\\testarg\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(116): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(App\\Jobs\\SendEmailNotification))\n#24 C:\\xampp\\htdocs\\testarg\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(132): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#25 C:\\xampp\\htdocs\\testarg\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(124): Illuminate\\Bus\\Dispatcher->dispatchNow(Object(App\\Jobs\\SendEmailNotification), false)\n#26 C:\\xampp\\htdocs\\testarg\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(141): Illuminate\\Queue\\CallQueuedHandler->Illuminate\\Queue\\{closure}(Object(App\\Jobs\\SendEmailNotification))\n#27 C:\\xampp\\htdocs\\testarg\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(116): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(App\\Jobs\\SendEmailNotification))\n#28 C:\\xampp\\htdocs\\testarg\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(126): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#29 C:\\xampp\\htdocs\\testarg\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(70): Illuminate\\Queue\\CallQueuedHandler->dispatchThroughMiddleware(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(App\\Jobs\\SendEmailNotification))\n#30 C:\\xampp\\htdocs\\testarg\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Jobs\\Job.php(98): Illuminate\\Queue\\CallQueuedHandler->call(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Array)\n#31 C:\\xampp\\htdocs\\testarg\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(425): Illuminate\\Queue\\Jobs\\Job->fire()\n#32 C:\\xampp\\htdocs\\testarg\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(375): Illuminate\\Queue\\Worker->process(\'database\', Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Queue\\WorkerOptions))\n#33 C:\\xampp\\htdocs\\testarg\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(173): Illuminate\\Queue\\Worker->runJob(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), \'database\', Object(Illuminate\\Queue\\WorkerOptions))\n#34 C:\\xampp\\htdocs\\testarg\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(148): Illuminate\\Queue\\Worker->daemon(\'database\', \'default\', Object(Illuminate\\Queue\\WorkerOptions))\n#35 C:\\xampp\\htdocs\\testarg\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(131): Illuminate\\Queue\\Console\\WorkCommand->runWorker(\'database\', \'default\')\n#36 C:\\xampp\\htdocs\\testarg\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#37 C:\\xampp\\htdocs\\testarg\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(41): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#38 C:\\xampp\\htdocs\\testarg\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(93): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#39 C:\\xampp\\htdocs\\testarg\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(37): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#40 C:\\xampp\\htdocs\\testarg\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(661): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#41 C:\\xampp\\htdocs\\testarg\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(183): Illuminate\\Container\\Container->call(Array)\n#42 C:\\xampp\\htdocs\\testarg\\vendor\\symfony\\console\\Command\\Command.php(291): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#43 C:\\xampp\\htdocs\\testarg\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(153): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#44 C:\\xampp\\htdocs\\testarg\\vendor\\symfony\\console\\Application.php(1014): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#45 C:\\xampp\\htdocs\\testarg\\vendor\\symfony\\console\\Application.php(301): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Queue\\Console\\WorkCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#46 C:\\xampp\\htdocs\\testarg\\vendor\\symfony\\console\\Application.php(171): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#47 C:\\xampp\\htdocs\\testarg\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Application.php(102): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#48 C:\\xampp\\htdocs\\testarg\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(155): Illuminate\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#49 C:\\xampp\\htdocs\\testarg\\artisan(37): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#50 {main}','2024-09-03 17:53:28');
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `finyears`
--

DROP TABLE IF EXISTS `finyears`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `finyears` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `finyear` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `startdate` date DEFAULT NULL,
  `enddate` date DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `finyears_finyear_unique` (`finyear`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `finyears`
--

LOCK TABLES `finyears` WRITE;
/*!40000 ALTER TABLE `finyears` DISABLE KEYS */;
INSERT INTO `finyears` VALUES (1,'20222/2023','2024-08-02','2024-09-02',NULL,NULL,NULL),(2,'2222','2024-08-30','2024-09-03',NULL,'2024-08-29 18:32:17','2024-08-29 18:32:17');
/*!40000 ALTER TABLE `finyears` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `globalsettings`
--

DROP TABLE IF EXISTS `globalsettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `globalsettings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `item` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `globalsettings`
--

LOCK TABLES `globalsettings` WRITE;
/*!40000 ALTER TABLE `globalsettings` DISABLE KEYS */;
INSERT INTO `globalsettings` VALUES (1,'current_open_grant','1',NULL,NULL,'2024-09-02 17:40:40'),(2,'current_fin_year','2',NULL,NULL,'2024-09-02 17:42:26');
/*!40000 ALTER TABLE `globalsettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grants`
--

DROP TABLE IF EXISTS `grants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grants` (
  `grantid` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `finyearfk` bigint unsigned NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`grantid`),
  KEY `grants_finyearfk_foreign` (`finyearfk`),
  CONSTRAINT `grants_finyearfk_foreign` FOREIGN KEY (`finyearfk`) REFERENCES `finyears` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grants`
--

LOCK TABLES `grants` WRITE;
/*!40000 ALTER TABLE `grants` DISABLE KEYS */;
INSERT INTO `grants` VALUES (1,'test',1,'Open','2024-08-29 18:39:10','2024-08-29 18:39:10'),(2,'test2',2,'Closed','2024-08-29 18:50:08','2024-08-29 18:50:08');
/*!40000 ALTER TABLE `grants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'2014_10_12_000000_create_users_table',1),(2,'2014_10_12_100000_create_password_resets_table',1),(3,'2019_08_19_000000_create_failed_jobs_table',1),(4,'2019_12_14_000001_create_personal_access_tokens_table',1),(5,'2024_06_25_190842_create_permission_table',1),(6,'2024_06_25_212454_create_userpermissions_table',1),(7,'2024_06_26_084843_create_researchtheme_table',1),(8,'2024_06_27_102838_create_finyears_table',1),(9,'2024_06_27_114040_create_grants_table',1),(10,'2024_06_27_114135_create_schools_table',1),(11,'2024_06_27_114635_create_departments_table',1),(12,'2024_06_27_114636_create_proposals_table',1),(13,'2024_07_01_084303_create_collaborators_table',1),(14,'2024_07_01_084629_create_publications_table',1),(15,'2024_07_01_084658_create_workplan_table',1),(16,'2024_07_01_084731_create_researchdesign_table',1),(17,'2024_07_01_084759_create_expenditures_table',1),(18,'2024_07_01_084759_create_proposalchanges_table',1),(19,'2024_07_16_112641_create_jobs_table',1),(20,'2024_08_07_165952_create_researchproject_table',1),(21,'2024_08_07_170727_create_researchprogress_table',1),(22,'2024_08_28_170727_create_researchfunding_table',1),(23,'2024_08_28_170727_create_supervisionprogress_table',1),(24,'2024_08_29_192838_create_globalsettings_table',1),(25,'2024_09_01_184856_create_notificationtypes_table',1),(26,'2024_09_01_185500_create_notifiableusers_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifiableusers`
--

DROP TABLE IF EXISTS `notifiableusers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifiableusers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `notificationfk` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `useridfk` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notifiableusers_notificationfk_foreign` (`notificationfk`),
  KEY `notifiableusers_useridfk_foreign` (`useridfk`),
  CONSTRAINT `notifiableusers_notificationfk_foreign` FOREIGN KEY (`notificationfk`) REFERENCES `notificationtypes` (`typeuuid`) ON DELETE RESTRICT,
  CONSTRAINT `notifiableusers_useridfk_foreign` FOREIGN KEY (`useridfk`) REFERENCES `users` (`userid`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifiableusers`
--

LOCK TABLES `notifiableusers` WRITE;
/*!40000 ALTER TABLE `notifiableusers` DISABLE KEYS */;
INSERT INTO `notifiableusers` VALUES (1,'5f1fd679-e995-46c2-bd43-40212133e207','e41af9af-9a65-4252-bdb6-ab018e250aec',NULL,NULL),(2,'f01c5c61-9973-453c-9591-b22a304756fa','e41af9af-9a65-4252-bdb6-ab018e250aec',NULL,NULL),(3,'f3b601ff-0c78-4367-9c77-87cfb2f71f80','e41af9af-9a65-4252-bdb6-ab018e250aec',NULL,NULL),(10,'0647e2e1-001a-48ac-8d9c-c85632ad540f','89112be6-cf30-42ab-a16b-1738e61871ee',NULL,NULL),(11,'0647e2e1-001a-48ac-8d9c-c85632ad540f','e41af9af-9a65-4252-bdb6-ab018e250aec',NULL,NULL),(12,'0bd14c52-2e62-4e11-ba88-c88ff7d45b9d','89112be6-cf30-42ab-a16b-1738e61871ee',NULL,NULL),(13,'0bd14c52-2e62-4e11-ba88-c88ff7d45b9d','e41af9af-9a65-4252-bdb6-ab018e250aec',NULL,NULL),(14,'56d76cd9-710f-47de-8551-db1db8e03b9e','89112be6-cf30-42ab-a16b-1738e61871ee',NULL,NULL),(15,'56d76cd9-710f-47de-8551-db1db8e03b9e','e41af9af-9a65-4252-bdb6-ab018e250aec',NULL,NULL),(16,'5f1fd679-e995-46c2-bd43-40212133e207','89112be6-cf30-42ab-a16b-1738e61871ee',NULL,NULL),(17,'74fcba53-8cfa-4202-8938-f9d826e5f86a','89112be6-cf30-42ab-a16b-1738e61871ee',NULL,NULL),(18,'74fcba53-8cfa-4202-8938-f9d826e5f86a','e41af9af-9a65-4252-bdb6-ab018e250aec',NULL,NULL),(19,'761c96d3-53f1-40a7-8a89-5c585b30701b','89112be6-cf30-42ab-a16b-1738e61871ee',NULL,NULL),(20,'761c96d3-53f1-40a7-8a89-5c585b30701b','e41af9af-9a65-4252-bdb6-ab018e250aec',NULL,NULL),(21,'f01c5c61-9973-453c-9591-b22a304756fa','89112be6-cf30-42ab-a16b-1738e61871ee',NULL,NULL),(22,'615536d4-48ac-48c3-b4b3-f77e9baeee8d','e41af9af-9a65-4252-bdb6-ab018e250aec',NULL,NULL);
/*!40000 ALTER TABLE `notifiableusers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificationtypes`
--

DROP TABLE IF EXISTS `notificationtypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificationtypes` (
  `typeuuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `typename` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `notifyowner` tinyint(1) NOT NULL DEFAULT '0',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`typeuuid`),
  UNIQUE KEY `notificationtypes_typename_unique` (`typename`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificationtypes`
--

LOCK TABLES `notificationtypes` WRITE;
/*!40000 ALTER TABLE `notificationtypes` DISABLE KEYS */;
INSERT INTO `notificationtypes` VALUES ('0647e2e1-001a-48ac-8d9c-c85632ad540f','projectcancelled',0,'Occurs when a Project is Cancelled'),('0bd14c52-2e62-4e11-ba88-c88ff7d45b9d','projectresumed',0,'Occurs when a paused project is resumed'),('1cc917fc-d9b6-416c-9ae4-c8b12e5e677d','projectcompleted',0,'Occurs when a project is marked as complete'),('56d76cd9-710f-47de-8551-db1db8e03b9e','proposalreceived',1,'Occurs when a proposal has been received by the committee'),('5f1fd679-e995-46c2-bd43-40212133e207','proposalapproved',0,'Occurs when a proposal has been approved by the committee and turns to be a Research Project'),('615536d4-48ac-48c3-b4b3-f77e9baeee8d','projectassignedmande',1,'Occurs when a project has been assigned M & E Person'),('74fcba53-8cfa-4202-8938-f9d826e5f86a','proposalsubmitted',0,'Occurs when the Principal Investigator submits his/her proposal'),('761c96d3-53f1-40a7-8a89-5c585b30701b','proposalcorrectionposted',0,'Occurs when any of the committee posts a correction to the corresponding proposal before its approved'),('c51883a0-2ee6-4353-8a28-235abceb2de5','projectdfundingreleased',0,'Occurs when Funding Tranch has been released against the respective project'),('cef74017-b5b0-496e-9b2c-25771e3e5afd','projectmonitoringreportsubmitted',0,'Occurs when a M&E report has been submitted against a project'),('d0366c4d-4dd0-48f2-a6e0-5115fe8cc6e2','projectpaused',0,'Occurs when a project has been Paused'),('f01c5c61-9973-453c-9591-b22a304756fa','proposalrejected',0,'Occurs when a proposal has been rejected and doenst qualify to be a Research Project'),('f3b601ff-0c78-4367-9c77-87cfb2f71f80','projectprogressreport',0,'Occurs when a Principal Investigator submits a report against his/her project');
/*!40000 ALTER TABLE `notificationtypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_resets` (
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_resets`
--

LOCK TABLES `password_resets` WRITE;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
INSERT INTO `password_resets` VALUES ('fkiprotich845@gmail.com','$2y$10$QiJFOoHyKUNFcVW.1WM4Ze8BFn29HHo8m9IYLikAyPDF2MuuLOraK','2024-09-18 02:12:41'),('portxyz100@gmail.com','$2y$10$lggp80HDwMro/YdNqViAuuxfMybXAo5oC0S5EvxPuRMrjf29ynL1e','2024-09-20 09:45:59');
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `pid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `menuname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `shortname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `priorityno` int NOT NULL,
  `permissionlevel` int NOT NULL,
  `targetrole` int NOT NULL,
  `issuperadminright` tinyint(1) NOT NULL DEFAULT '0',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`pid`),
  UNIQUE KEY `permissions_shortname_unique` (`shortname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES ('0565496a-0753-46ba-9463-4c17cce8588b','Can Update Current Grant and Financial Year','canupdatecurrentgrantandyear','route.permission',0,2,1,0,NULL,NULL,NULL),('0782080f-2e30-4df7-bdea-7f7fcff70bdf','Can Read Proposal Details','canreadproposaldetails','route.permission',0,2,1,0,NULL,NULL,NULL),('09f0b68d-d401-4c7f-9ef8-10f962399fa5','My Projects','canviewmyprojects','pages.projects.myprojects',12,1,2,0,NULL,NULL,NULL),('1308ce3a-fb1f-41dd-aa52-01cba9a3df41','Can Receive a Proposal','canreceiveproposal','route.permission',0,2,1,0,NULL,NULL,NULL),('174a16d1-bdec-44c7-934a-07598e2c0bbf','Can Change User Role & Rights','canchangeuserroleorrights','route.permission',0,2,1,1,NULL,NULL,NULL),('1b667bca-caf8-4c21-a2a7-c4deab0e93b6','Can Add/Edit Department','canaddoreditdepartment','route.permission',0,2,1,0,NULL,NULL,NULL),('24533248-1e2b-4c9b-935b-234b912c727e','Departments','canviewdepartmentsandschools','pages.departments.home',5,1,1,0,NULL,NULL,NULL),('367dd0ff-c3c7-4864-9457-7f97c52f855b','M & E Links','canviewmonitoringpage','pages.supervision.home',4,1,1,0,NULL,NULL,NULL),('36bdc1a8-4216-4845-8007-52e6e26a917d','Can View NotificationTypes Tab','canviewnotificationtypestab','route.permission',0,2,1,0,NULL,NULL,NULL),('39f38bbe-9f9b-4018-98ec-4170224f33c5','Can View Office Use Tab','canviewofficeuse','route.permission',0,2,1,0,NULL,NULL,NULL),('3d05f398-d4aa-46fa-bee8-72d226a86738','Can Pause Research Project','canpauseresearchproject','route.permission',0,2,1,0,NULL,NULL,NULL),('436c7651-44f8-4c14-959d-d8ab35cb2d54','Can Add Project Funding','canaddprojectfunding','route.permission',0,2,1,0,NULL,NULL,NULL),('46b16b76-4cc8-4e68-96f2-8792087d7a51','Approve Proposal','canapproveproposal','route.permission',0,2,1,0,'test',NULL,NULL),('4e7d80e0-bbfc-457f-b81f-9f0c571c3d6e','Can Add or Edit FinancialYear','canaddoreditfinyear','route.permission',0,2,1,0,NULL,NULL,NULL),('535a7f0e-77f3-443c-a6cf-8bb2cf03f246','Mailing','mailingmodule','pages.mailing.home',9,1,1,1,NULL,NULL,NULL),('5b691787-d267-4f5b-a0fb-d4f1bee30a97','Can Read Any Project','canreadanyproject','route.permission',0,2,1,0,NULL,NULL,NULL),('5f648fb5-66de-464b-8a94-1085ec8ab468','My Applications','canviewmyapplications','pages.proposals.myapplications',11,1,2,0,'test',NULL,NULL),('6fe0ca94-35cb-429e-9d8f-4789b90699af','Can Complete Research Project','cancompleteresearchproject','route.permission',0,2,1,0,NULL,NULL,NULL),('76038eff-cd87-4540-b9c3-835e51ef6e20','Can Cancel Research Project','cancancelresearchproject','route.permission',0,2,1,0,NULL,NULL,NULL),('80cfd5d9-c5a6-45a1-8a07-0828f7961e26','Reject Proposal','canrejectproposal','route.permission',0,2,1,0,'test',NULL,NULL),('8738e24a-4df3-4d42-b20f-0867ead669b4','Can Add/Edit School','canaddoreditschool','route.permission',0,2,1,0,NULL,NULL,NULL),('894daace-4717-47fd-b50c-4bdab931f198','Can View Project Fundings','canviewprojectfunding','route.permission',0,2,1,0,NULL,NULL,NULL),('89d26b77-daad-4da3-9b41-549e9b46e3a0','Research Projects','canviewallprojects','pages.projects.allprojects',2,1,1,0,NULL,NULL,NULL),('8df711ad-9697-43ef-95fe-397b510bb27d','Reports','canviewreports','pages.reports.home',8,1,1,0,'test',NULL,NULL),('a377396f-1d3c-4375-ab5b-fed4adfc912f','All Applications','canviewallapplications','pages.proposals.allproposals',1,1,1,0,'test',NULL,NULL),('a6d51f1e-cf63-4671-8f11-2ef36e2d8882','Can Add or Remove Notifiable User','canaddorremovenotifiableuser','route.permission',0,2,1,0,NULL,NULL,NULL),('a9944b38-039c-44af-8e48-47c2ac4b1374','Can Add/edit Grant','canaddoreditgrant','route.permission',0,2,1,0,NULL,NULL,NULL),('b0734086-3341-11ef-b05b-c8d9d27c3c7e','New Proposal','canmakenewproposal','pages.proposals.viewnewproposal',10,1,2,0,'test',NULL,NULL),('b9a4edbe-7fbb-4050-bbae-20f125bd2234','Can Reset User Password','canresetuserpasswordordisablelogin','route.permission',0,2,1,1,NULL,NULL,NULL),('bf02fa16-9aff-41d1-9c33-cd40c636160f','Dashboard','canviewadmindashboard','pages.dashboard',0,1,1,0,NULL,NULL,NULL),('d0326ee8-209c-45cb-98d9-2c190d3b8fea','Can Assign Monitoring Person','canassignmonitoringperson','route.permission',0,2,1,0,NULL,NULL,NULL),('d20f3fbd-fb04-43ba-a320-6a6a124a0d0b','Users','canviewallusers','pages.users.manage',7,1,1,1,'test',NULL,NULL),('d6e1a65b-0533-415c-992d-cd03637aed4e','Grants & Years','managegrantsandyears','pages.grants.home',6,1,1,0,'test',NULL,NULL),('d980ecd9-ee91-485a-b286-31a76c0bed2a','Can Read My Project','canreadmyproject','route.permission',0,2,2,0,NULL,NULL,NULL),('de2d34fe-0799-42d8-a796-4cb58baad518','Can Propose Changes','canproposechanges','route.permission',0,2,1,0,'test',NULL,NULL),('e96c123d-80a0-4ac4-9433-6ac6f9e7cc91','Can Resume Research Project','canresumeresearchproject','route.permission',0,2,1,0,'',NULL,NULL),('e9faf986-d6af-4a14-a00d-53b423164559','Can Edit User Profile','canedituserprofile','route.permission',0,2,1,1,NULL,NULL,NULL),('eae62e07-3ca4-4293-a12e-494b5f1a4621','Can Enable Proposal Editing','canenabledisableproposaledit','route.permission',0,2,1,0,NULL,NULL,NULL);
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proposalchanges`
--

DROP TABLE IF EXISTS `proposalchanges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proposalchanges` (
  `changeid` bigint unsigned NOT NULL AUTO_INCREMENT,
  `proposalidfk` bigint unsigned NOT NULL,
  `triggerissue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `suggestedchange` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `suggestedbyfk` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`changeid`),
  KEY `proposalchanges_proposalidfk_foreign` (`proposalidfk`),
  CONSTRAINT `proposalchanges_proposalidfk_foreign` FOREIGN KEY (`proposalidfk`) REFERENCES `proposals` (`proposalid`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proposalchanges`
--

LOCK TABLES `proposalchanges` WRITE;
/*!40000 ALTER TABLE `proposalchanges` DISABLE KEYS */;
/*!40000 ALTER TABLE `proposalchanges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proposals`
--

DROP TABLE IF EXISTS `proposals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proposals` (
  `proposalid` bigint unsigned NOT NULL AUTO_INCREMENT,
  `proposalcode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `grantnofk` int unsigned NOT NULL,
  `departmentidfk` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `useridfk` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `pfnofk` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `themefk` int NOT NULL,
  `submittedstatus` tinyint(1) NOT NULL DEFAULT '0',
  `receivedstatus` tinyint(1) NOT NULL DEFAULT '0',
  `caneditstatus` tinyint(1) NOT NULL DEFAULT '1',
  `approvalstatus` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Pending',
  `highqualification` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `officephone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cellphone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `faxnumber` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `researchtitle` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commencingdate` date DEFAULT NULL,
  `terminationdate` date DEFAULT NULL,
  `objectives` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `hypothesis` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `significance` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `ethicals` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `expoutput` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `socio_impact` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `res_findings` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `approvedrejectedbywhofk` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`proposalid`),
  UNIQUE KEY `proposals_proposalcode_unique` (`proposalcode`),
  KEY `proposals_grantnofk_foreign` (`grantnofk`),
  KEY `proposals_useridfk_foreign` (`useridfk`),
  KEY `proposals_pfnofk_foreign` (`pfnofk`),
  KEY `proposals_departmentidfk_foreign` (`departmentidfk`),
  KEY `proposals_themefk_foreign` (`themefk`),
  KEY `proposals_approvedrejectedbywhofk_foreign` (`approvedrejectedbywhofk`),
  CONSTRAINT `proposals_approvedrejectedbywhofk_foreign` FOREIGN KEY (`approvedrejectedbywhofk`) REFERENCES `users` (`userid`) ON DELETE RESTRICT,
  CONSTRAINT `proposals_departmentidfk_foreign` FOREIGN KEY (`departmentidfk`) REFERENCES `departments` (`depid`) ON DELETE RESTRICT,
  CONSTRAINT `proposals_grantnofk_foreign` FOREIGN KEY (`grantnofk`) REFERENCES `grants` (`grantid`) ON DELETE RESTRICT,
  CONSTRAINT `proposals_pfnofk_foreign` FOREIGN KEY (`pfnofk`) REFERENCES `users` (`pfno`) ON DELETE RESTRICT,
  CONSTRAINT `proposals_themefk_foreign` FOREIGN KEY (`themefk`) REFERENCES `researchthemes` (`themeid`) ON DELETE RESTRICT,
  CONSTRAINT `proposals_useridfk_foreign` FOREIGN KEY (`useridfk`) REFERENCES `users` (`userid`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proposals`
--

LOCK TABLES `proposals` WRITE;
/*!40000 ALTER TABLE `proposals` DISABLE KEYS */;
INSERT INTO `proposals` VALUES (1,'UOK/ARG/A/2024/1',1,'0409f05e-f03a-422a-b13e-8ee35e1aa41d','e41af9af-9a65-4252-bdb6-ab018e250aec','41',1,1,1,0,'Approved','test','test','test','test','test','2024-02-03','2024-09-11','test','test','tes','test','test','teest','test','ddd',NULL,'2024-09-02 18:24:53','2024-09-03 06:54:23');
/*!40000 ALTER TABLE `proposals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `publications`
--

DROP TABLE IF EXISTS `publications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `publications` (
  `publicationid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `proposalidfk` bigint unsigned NOT NULL,
  `authors` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `year` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `researcharea` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `publisher` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `volume` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `pages` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`publicationid`),
  KEY `publications_proposalidfk_foreign` (`proposalidfk`),
  CONSTRAINT `publications_proposalidfk_foreign` FOREIGN KEY (`proposalidfk`) REFERENCES `proposals` (`proposalid`) ON DELETE RESTRICT
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
-- Table structure for table `researchdesigns`
--

DROP TABLE IF EXISTS `researchdesigns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `researchdesigns` (
  `designid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `proposalidfk` bigint unsigned NOT NULL,
  `summary` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `indicators` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `verification` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `assumptions` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `goal` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `purpose` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`designid`),
  KEY `researchdesigns_proposalidfk_foreign` (`proposalidfk`),
  CONSTRAINT `researchdesigns_proposalidfk_foreign` FOREIGN KEY (`proposalidfk`) REFERENCES `proposals` (`proposalid`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `researchdesigns`
--

LOCK TABLES `researchdesigns` WRITE;
/*!40000 ALTER TABLE `researchdesigns` DISABLE KEYS */;
INSERT INTO `researchdesigns` VALUES ('61714443-0f35-48f9-bd32-4679c3ae4477',1,'test','test','test','test','test','test','2024-09-03 05:44:07','2024-09-03 05:44:07');
/*!40000 ALTER TABLE `researchdesigns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `researchfundings`
--

DROP TABLE IF EXISTS `researchfundings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `researchfundings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `researchidfk` bigint unsigned NOT NULL,
  `createdby` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` double NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `researchfundings_researchidfk_foreign` (`researchidfk`),
  KEY `researchfundings_createdby_foreign` (`createdby`),
  CONSTRAINT `researchfundings_createdby_foreign` FOREIGN KEY (`createdby`) REFERENCES `users` (`userid`) ON DELETE RESTRICT,
  CONSTRAINT `researchfundings_researchidfk_foreign` FOREIGN KEY (`researchidfk`) REFERENCES `researchprojects` (`researchid`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `researchfundings`
--

LOCK TABLES `researchfundings` WRITE;
/*!40000 ALTER TABLE `researchfundings` DISABLE KEYS */;
INSERT INTO `researchfundings` VALUES (2,15,'50f0a9b5-9997-4617-a06d-1c44cc8b7aec',7,'2024-09-03 08:09:24','2024-09-03 08:09:24'),(3,15,'50f0a9b5-9997-4617-a06d-1c44cc8b7aec',22,'2024-09-03 08:14:32','2024-09-03 08:14:32');
/*!40000 ALTER TABLE `researchfundings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `researchprogress`
--

DROP TABLE IF EXISTS `researchprogress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `researchprogress` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `researchidfk` bigint unsigned NOT NULL,
  `reportedbyfk` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `report` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `researchprogress_researchidfk_foreign` (`researchidfk`),
  KEY `researchprogress_reportedbyfk_foreign` (`reportedbyfk`),
  CONSTRAINT `researchprogress_reportedbyfk_foreign` FOREIGN KEY (`reportedbyfk`) REFERENCES `users` (`userid`) ON DELETE RESTRICT,
  CONSTRAINT `researchprogress_researchidfk_foreign` FOREIGN KEY (`researchidfk`) REFERENCES `researchprojects` (`researchid`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `researchprogress`
--

LOCK TABLES `researchprogress` WRITE;
/*!40000 ALTER TABLE `researchprogress` DISABLE KEYS */;
/*!40000 ALTER TABLE `researchprogress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `researchprojects`
--

DROP TABLE IF EXISTS `researchprojects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `researchprojects` (
  `researchid` bigint unsigned NOT NULL AUTO_INCREMENT,
  `researchnumber` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `proposalidfk` bigint unsigned NOT NULL,
  `projectstatus` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `ispaused` tinyint(1) NOT NULL DEFAULT '0',
  `supervisorfk` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fundingfinyearfk` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`researchid`),
  UNIQUE KEY `researchprojects_researchnumber_unique` (`researchnumber`),
  UNIQUE KEY `researchprojects_proposalidfk_unique` (`proposalidfk`),
  KEY `researchprojects_fundingfinyearfk_foreign` (`fundingfinyearfk`),
  KEY `researchprojects_supervisorfk_foreign` (`supervisorfk`),
  CONSTRAINT `researchprojects_fundingfinyearfk_foreign` FOREIGN KEY (`fundingfinyearfk`) REFERENCES `finyears` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `researchprojects_proposalidfk_foreign` FOREIGN KEY (`proposalidfk`) REFERENCES `proposals` (`proposalid`) ON DELETE RESTRICT,
  CONSTRAINT `researchprojects_supervisorfk_foreign` FOREIGN KEY (`supervisorfk`) REFERENCES `users` (`userid`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `researchprojects`
--

LOCK TABLES `researchprojects` WRITE;
/*!40000 ALTER TABLE `researchprojects` DISABLE KEYS */;
INSERT INTO `researchprojects` VALUES (15,'UOK/ARG/2222/1',1,'Active',0,'e41af9af-9a65-4252-bdb6-ab018e250aec',1,'2024-09-03 06:54:23','2024-09-03 08:21:08');
/*!40000 ALTER TABLE `researchprojects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `researchthemes`
--

DROP TABLE IF EXISTS `researchthemes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `researchthemes` (
  `themeid` int NOT NULL,
  `themename` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `themedescription` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `applicablestatus` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`themeid`),
  UNIQUE KEY `researchthemes_themename_unique` (`themename`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `researchthemes`
--

LOCK TABLES `researchthemes` WRITE;
/*!40000 ALTER TABLE `researchthemes` DISABLE KEYS */;
INSERT INTO `researchthemes` VALUES (1,'Food Security','Food Security','open',NULL,NULL),(2,'Natural Resources','Natural Resources','open',NULL,NULL),(3,'Health & Nutrition','Health & Nutrition','open',NULL,NULL),(4,'Environmental Conservation','Environmental Conservation','open',NULL,NULL),(5,'Community Development','Community Development','open',NULL,NULL),(6,'Gender','Gender','open',NULL,NULL),(7,'Education','Education','open',NULL,NULL),(8,'Human Resource Development','Human Resource Development','open',NULL,NULL),(9,'Socio-Cultural Issues','Socio-Cultural Issues','open',NULL,NULL),(10,'Entrepreneurship','Entrepreneurship','open',NULL,NULL),(11,'Legal Issues','Legal Issues','open',NULL,NULL),(12,'Natural Sciences','Natural Sciences','open',NULL,NULL),(13,'Others (Specify)','Others (Specify)','open',NULL,NULL);
/*!40000 ALTER TABLE `researchthemes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schools`
--

DROP TABLE IF EXISTS `schools`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schools` (
  `schoolid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `schoolname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`schoolid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schools`
--

LOCK TABLES `schools` WRITE;
/*!40000 ALTER TABLE `schools` DISABLE KEYS */;
INSERT INTO `schools` VALUES ('80ee90f7-6915-4343-b975-732fe84bd89d','Business','resolved successfully','2024-08-28 08:09:44','2024-08-28 08:09:44'),('89d26b77-daad-4da3-9b41-549e9b46e3a0','SST','test','2024-08-02 07:00:15','2024-08-02 07:00:15');
/*!40000 ALTER TABLE `schools` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supervisionprogress`
--

DROP TABLE IF EXISTS `supervisionprogress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supervisionprogress` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `researchidfk` bigint unsigned NOT NULL,
  `supervisorfk` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `report` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `remark` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `supervisionprogress_researchidfk_foreign` (`researchidfk`),
  KEY `supervisionprogress_supervisorfk_foreign` (`supervisorfk`),
  CONSTRAINT `supervisionprogress_researchidfk_foreign` FOREIGN KEY (`researchidfk`) REFERENCES `researchprojects` (`researchid`) ON DELETE RESTRICT,
  CONSTRAINT `supervisionprogress_supervisorfk_foreign` FOREIGN KEY (`supervisorfk`) REFERENCES `users` (`userid`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supervisionprogress`
--

LOCK TABLES `supervisionprogress` WRITE;
/*!40000 ALTER TABLE `supervisionprogress` DISABLE KEYS */;
/*!40000 ALTER TABLE `supervisionprogress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userpermissions`
--

DROP TABLE IF EXISTS `userpermissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userpermissions` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `useridfk` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `permissionidfk` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userpermissions_useridfk_foreign` (`useridfk`),
  KEY `userpermissions_permissionidfk_foreign` (`permissionidfk`),
  CONSTRAINT `userpermissions_permissionidfk_foreign` FOREIGN KEY (`permissionidfk`) REFERENCES `permissions` (`pid`) ON DELETE RESTRICT,
  CONSTRAINT `userpermissions_useridfk_foreign` FOREIGN KEY (`useridfk`) REFERENCES `users` (`userid`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userpermissions`
--

LOCK TABLES `userpermissions` WRITE;
/*!40000 ALTER TABLE `userpermissions` DISABLE KEYS */;
INSERT INTO `userpermissions` VALUES ('0409f05e-f03a-422a-b13e-8ee35e1aa41a','0409f05e-f03a-422a-b13e-8ee35e1aa41d','8df711ad-9697-43ef-95fe-397b510bb27d','2024-06-25 16:37:39','2024-06-25 16:37:39'),('0409f05e-f03a-562a-b13e-8ee35e1aa41d','0409f05e-f03a-422a-b13e-8ee35e1aa41d','5f648fb5-66de-464b-8a94-1085ec8ab468','2024-06-25 16:37:39','2024-06-25 16:37:39'),('05921807-b2b7-461a-bbda-6e28207cec19','994ac183-0785-4c16-b45e-9c63f1da7174','a377396f-1d3c-4375-ab5b-fed4adfc912f',NULL,NULL),('0b70a9da-d756-417a-94cf-513c37e82854','50f0a9b5-9997-4617-a06d-1c44cc8b7aec','3d05f398-d4aa-46fa-bee8-72d226a86738',NULL,NULL),('11dc8fa2-c403-431d-afaa-ea4cc3fe37c5','50f0a9b5-9997-4617-a06d-1c44cc8b7aec','80cfd5d9-c5a6-45a1-8a07-0828f7961e26',NULL,NULL),('1850fb24-062e-4f85-baaa-9cb1beabca89','994ac183-0785-4c16-b45e-9c63f1da7174','e96c123d-80a0-4ac4-9433-6ac6f9e7cc91',NULL,NULL),('1a3d7555-e92f-4d82-87e0-4f607987c9ad','50f0a9b5-9997-4617-a06d-1c44cc8b7aec','36bdc1a8-4216-4845-8007-52e6e26a917d',NULL,NULL),('1c5f66e1-cd87-4941-bd42-7d19c2112006','50f0a9b5-9997-4617-a06d-1c44cc8b7aec','894daace-4717-47fd-b50c-4bdab931f198',NULL,NULL),('1c7660c2-53a4-445a-84fd-6ea164d7436a','e41af9af-9a65-4252-bdb6-ab018e250aec','b0734086-3341-11ef-b05b-c8d9d27c3c7e',NULL,NULL),('1cb9677c-7b47-4a6e-94f2-bcec9d061b43','e41af9af-9a65-4252-bdb6-ab018e250aec','09f0b68d-d401-4c7f-9ef8-10f962399fa5',NULL,NULL),('25407c5f-c3c5-418c-a1a1-e712e22e6ea1','e41af9af-9a65-4252-bdb6-ab018e250aec','5f648fb5-66de-464b-8a94-1085ec8ab468',NULL,NULL),('26d63368-ed63-441b-a41f-879baa0d0cb6','50f0a9b5-9997-4617-a06d-1c44cc8b7aec','d20f3fbd-fb04-43ba-a320-6a6a124a0d0b',NULL,NULL),('32c685bd-5562-47c9-8d4d-5a25f8e224ce','994ac183-0785-4c16-b45e-9c63f1da7174','de2d34fe-0799-42d8-a796-4cb58baad518',NULL,NULL),('35568db1-f391-4eb0-864c-179488d76c29','994ac183-0785-4c16-b45e-9c63f1da7174','89d26b77-daad-4da3-9b41-549e9b46e3a0',NULL,NULL),('3db87a54-b142-4aa4-85a9-3ba89b8d5c33','50f0a9b5-9997-4617-a06d-1c44cc8b7aec','d0326ee8-209c-45cb-98d9-2c190d3b8fea',NULL,NULL),('417b1295-e10a-49d0-9c4d-3434219190ab','994ac183-0785-4c16-b45e-9c63f1da7174','3d05f398-d4aa-46fa-bee8-72d226a86738',NULL,NULL),('427d9bf9-7f83-4e13-8f63-b339e0f9671a','50f0a9b5-9997-4617-a06d-1c44cc8b7aec','bf02fa16-9aff-41d1-9c33-cd40c636160f',NULL,NULL),('48c6f3dc-e5f2-4ab1-ba97-6453287e0c35','50f0a9b5-9997-4617-a06d-1c44cc8b7aec','e96c123d-80a0-4ac4-9433-6ac6f9e7cc91',NULL,NULL),('4e52f340-39ab-4b7f-b6b7-8d94c2885318','994ac183-0785-4c16-b45e-9c63f1da7174','80cfd5d9-c5a6-45a1-8a07-0828f7961e26',NULL,NULL),('518b9b90-10e7-4d26-9dd7-eb6878ac03ff','50f0a9b5-9997-4617-a06d-1c44cc8b7aec','24533248-1e2b-4c9b-935b-234b912c727e',NULL,NULL),('54f50ed5-61cc-4dfd-bd8c-18880d8966ea','50f0a9b5-9997-4617-a06d-1c44cc8b7aec','eae62e07-3ca4-4293-a12e-494b5f1a4621',NULL,NULL),('56b6c78a-8f71-4337-82d3-5ce3b108f662','50f0a9b5-9997-4617-a06d-1c44cc8b7aec','de2d34fe-0799-42d8-a796-4cb58baad518',NULL,NULL),('58943da0-0683-4ed1-bbf3-d0ef3c85fb0e','50f0a9b5-9997-4617-a06d-1c44cc8b7aec','535a7f0e-77f3-443c-a6cf-8bb2cf03f246',NULL,NULL),('5e3d4c7b-efa8-41fd-b9eb-b500d30941d9','994ac183-0785-4c16-b45e-9c63f1da7174','1308ce3a-fb1f-41dd-aa52-01cba9a3df41',NULL,NULL),('5ef8daf4-f4d8-434d-9e2c-9e65af016b3f','994ac183-0785-4c16-b45e-9c63f1da7174','eae62e07-3ca4-4293-a12e-494b5f1a4621',NULL,NULL),('6144471f-8df8-40d9-9f8d-c1d5a6b98d2c','50f0a9b5-9997-4617-a06d-1c44cc8b7aec','d6e1a65b-0533-415c-992d-cd03637aed4e',NULL,NULL),('6ef25581-6525-4a07-a2ca-1908dcd363fe','50f0a9b5-9997-4617-a06d-1c44cc8b7aec','6fe0ca94-35cb-429e-9d8f-4789b90699af',NULL,NULL),('6f47a07f-e6e2-459b-97fe-ab3a61b3475a','50f0a9b5-9997-4617-a06d-1c44cc8b7aec','4e7d80e0-bbfc-457f-b81f-9f0c571c3d6e',NULL,NULL),('7349a7df-3997-4b70-bd2f-06db5f5adf9c','50f0a9b5-9997-4617-a06d-1c44cc8b7aec','1b667bca-caf8-4c21-a2a7-c4deab0e93b6',NULL,NULL),('7a7db6f8-b918-40ec-b728-01de0ded77fe','50f0a9b5-9997-4617-a06d-1c44cc8b7aec','0565496a-0753-46ba-9463-4c17cce8588b',NULL,NULL),('80fd658d-2628-4586-8d99-ce3d1822f550','50f0a9b5-9997-4617-a06d-1c44cc8b7aec','8df711ad-9697-43ef-95fe-397b510bb27d',NULL,NULL),('84e4b172-50a4-4b7f-b98f-06009b461763','994ac183-0785-4c16-b45e-9c63f1da7174','bf02fa16-9aff-41d1-9c33-cd40c636160f',NULL,NULL),('8912273c-11c0-4bb9-a476-d18f7e72f6f9','50f0a9b5-9997-4617-a06d-1c44cc8b7aec','76038eff-cd87-4540-b9c3-835e51ef6e20',NULL,NULL),('8d7c1028-ed1a-4589-b3ad-3f3d0d33a580','50f0a9b5-9997-4617-a06d-1c44cc8b7aec','a377396f-1d3c-4375-ab5b-fed4adfc912f',NULL,NULL),('91598f23-a50e-4733-9110-34c0805ec3bd','50f0a9b5-9997-4617-a06d-1c44cc8b7aec','436c7651-44f8-4c14-959d-d8ab35cb2d54',NULL,NULL),('9661ed18-6c0e-4ac2-807b-da5812467d36','50f0a9b5-9997-4617-a06d-1c44cc8b7aec','1308ce3a-fb1f-41dd-aa52-01cba9a3df41',NULL,NULL),('99224ac5-c7eb-4003-b942-981ae8be9e65','994ac183-0785-4c16-b45e-9c63f1da7174','0782080f-2e30-4df7-bdea-7f7fcff70bdf',NULL,NULL),('9a6be646-af2c-4061-bbc1-795297611f16','50f0a9b5-9997-4617-a06d-1c44cc8b7aec','46b16b76-4cc8-4e68-96f2-8792087d7a51',NULL,NULL),('9fa893a1-65bd-4f42-a6a9-71616097fec4','50f0a9b5-9997-4617-a06d-1c44cc8b7aec','b9a4edbe-7fbb-4050-bbae-20f125bd2234',NULL,NULL),('a6e736a4-ec42-420a-acd5-c67bde4a28a5','50f0a9b5-9997-4617-a06d-1c44cc8b7aec','a9944b38-039c-44af-8e48-47c2ac4b1374',NULL,NULL),('a7fc3d99-a55e-4bdc-b76d-41324c186f35','994ac183-0785-4c16-b45e-9c63f1da7174','8df711ad-9697-43ef-95fe-397b510bb27d',NULL,NULL),('ab3a5eff-d856-4dbd-b0fc-2c60b83d1673','50f0a9b5-9997-4617-a06d-1c44cc8b7aec','39f38bbe-9f9b-4018-98ec-4170224f33c5',NULL,NULL),('ad0c74cb-f063-4fd4-ada9-2458457143c4','50f0a9b5-9997-4617-a06d-1c44cc8b7aec','0782080f-2e30-4df7-bdea-7f7fcff70bdf',NULL,NULL),('b0f322e9-2649-417c-90b7-617ec87c4be2','50f0a9b5-9997-4617-a06d-1c44cc8b7aec','174a16d1-bdec-44c7-934a-07598e2c0bbf',NULL,NULL),('b9984f86-809c-408e-ae05-f308a832f632','994ac183-0785-4c16-b45e-9c63f1da7174','39f38bbe-9f9b-4018-98ec-4170224f33c5',NULL,NULL),('bbd7d199-e369-4e03-9cc7-cf8877950358','994ac183-0785-4c16-b45e-9c63f1da7174','46b16b76-4cc8-4e68-96f2-8792087d7a51',NULL,NULL),('c1be283e-d5f5-4567-a591-13d0c6573f55','50f0a9b5-9997-4617-a06d-1c44cc8b7aec','e9faf986-d6af-4a14-a00d-53b423164559',NULL,NULL),('c441021a-4e11-4e61-8401-860ec28b39b4','e41af9af-9a65-4252-bdb6-ab018e250aec','d980ecd9-ee91-485a-b286-31a76c0bed2a',NULL,NULL),('c5b8640d-7498-449a-8820-5ecc17c1dd34','50f0a9b5-9997-4617-a06d-1c44cc8b7aec','5b691787-d267-4f5b-a0fb-d4f1bee30a97',NULL,NULL),('c6ac5add-75aa-4c32-89f5-7c8cb22e933a','50f0a9b5-9997-4617-a06d-1c44cc8b7aec','a6d51f1e-cf63-4671-8f11-2ef36e2d8882',NULL,NULL),('dc7323cc-c7a7-4986-a343-847e4861bcfe','50f0a9b5-9997-4617-a06d-1c44cc8b7aec','367dd0ff-c3c7-4864-9457-7f97c52f855b',NULL,NULL),('df96e14d-cd94-4a47-9dac-ef659371a9d3','994ac183-0785-4c16-b45e-9c63f1da7174','76038eff-cd87-4540-b9c3-835e51ef6e20',NULL,NULL),('e01a47e3-3341-11ed-b05b-c8d9d27c3c7e','0409f05e-f03a-422a-b13e-8ee35e1aa41d','a377396f-1d3c-4375-ab5b-fed4adfc912f','2024-06-25 16:37:39','2024-06-25 16:37:39'),('e01a47e3-3341-11ef-b05b-c8d9d27c3c7e','0409f05e-f03a-422a-b13e-8ee35e1aa41d','b0734086-3341-11ef-b05b-c8d9d27c3c7e','2024-06-25 16:37:39','2024-06-25 16:37:39'),('e01a47e3-3341-11ef-b05c-c8d9d27c3c7e','0409f05e-f03a-422a-b13e-8ee35e1aa41d','d20f3fbd-fb04-43ba-a320-6a6a124a0d0b','2024-06-25 16:37:39','2024-06-25 16:37:39'),('e01a47e3-3341-61ef-b05b-c8d9d27c3c7e','0409f05e-f03a-422a-b13e-8ee35e1aa41d','d6e1a65b-0533-415c-992d-cd03637aed4e','2024-06-25 16:37:39','2024-06-25 16:37:39'),('e93a6f01-d7c9-4000-ab09-a2a2242c7e4a','89112be6-cf30-42ab-a16b-1738e61871ee','5f648fb5-66de-464b-8a94-1085ec8ab468',NULL,NULL),('ebb48d0c-357a-42a5-880a-d9775b3f2108','89112be6-cf30-42ab-a16b-1738e61871ee','b0734086-3341-11ef-b05b-c8d9d27c3c7e',NULL,NULL),('ecb844ee-3c49-4516-b5dc-4caa199b34ca','50f0a9b5-9997-4617-a06d-1c44cc8b7aec','8738e24a-4df3-4d42-b20f-0867ead669b4',NULL,NULL),('fd4c81e0-c9aa-4e1d-abe9-9b01471450b8','994ac183-0785-4c16-b45e-9c63f1da7174','5b691787-d267-4f5b-a0fb-d4f1bee30a97',NULL,NULL),('ff7fac2a-34e8-4918-aeb5-990aa1e3a2f3','50f0a9b5-9997-4617-a06d-1c44cc8b7aec','89d26b77-daad-4da3-9b41-549e9b46e3a0',NULL,NULL);
/*!40000 ALTER TABLE `userpermissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `pfno` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phonenumber` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` int NOT NULL,
  `isadmin` tinyint(1) NOT NULL,
  `isactive` tinyint(1) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`userid`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_pfno_unique` (`pfno`),
  UNIQUE KEY `users_phonenumber_unique` (`phonenumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('0409f05e-f03a-422a-b13e-8ee35e1aa41d','Super Admin','superadmin@testmail.com','2','0712390822','Male',1,1,1,'2024-06-27 09:43:12','$2y$10$82u66PqfXybiY605mTy8Hu97rHX9D3OigwCaIbS3KRXbst2uQ6Djm','TrI0M1Q3WTszuxfUC83CyBtD7x6MO07oxOLQnV5gatsNspIaJ93rkKPHmu91','2024-06-25 16:03:33','2024-06-25 16:03:33'),('50f0a9b5-9997-4617-a06d-1c44cc8b7aec','lilian kirwa','jepkorirkirwa@gmail.com','1234','0726239591','Female',1,0,1,'2024-08-02 06:58:18','$2y$10$Gx7az9Y53VLvZgXDHKinMup.iuByTSv19/hk5n1AHP0.VcpZzWRsi',NULL,'2024-08-02 06:54:30','2024-08-29 10:54:00'),('89112be6-cf30-42ab-a16b-1738e61871ee','Mark Clinton','portxyz100@gmail.com','123','12345678','Male',2,0,1,'2024-07-17 10:41:04','$2y$10$/lDWjkjHfxm4W/H/o.UOaeT6hYnNEUpG8JZoWfr/QxCbr2AdYZer2',NULL,'2024-07-03 16:49:23','2024-07-17 10:41:04'),('994ac183-0785-4c16-b45e-9c63f1da7174','Test Admin','committee@testmail.com','1','0715038690','Female',1,0,1,'2024-07-15 13:07:46','$2y$10$ob2/LLSxMAmcmqms3Vf9UOOend4jCTPPCwEu3hxkVBqFQKtP.CL8u',NULL,'2024-06-27 10:14:54','2024-06-27 10:14:54'),('e41af9af-9a65-4252-bdb6-ab018e250aec','John Doe','fkiprotich845@gmail.com','41','0734267','Female',2,0,1,'2024-09-05 05:57:22','$2y$10$QktRATkUfn5sw/AVVfuqGuDIy9nXIE7Ch4CCOl10/tQ3a/Z8tm292','ZVDXrWoHABYwiX1NklUZE7aWVqjoLE1kUGFYOL4tOSAWRauAeVLgtqGtSAnO','2024-07-06 09:01:08','2024-09-05 05:57:22');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workplans`
--

DROP TABLE IF EXISTS `workplans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workplans` (
  `workplanid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `proposalidfk` bigint unsigned NOT NULL,
  `activity` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `time` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `input` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `facilities` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `bywhom` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `outcome` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`workplanid`),
  KEY `workplans_proposalidfk_foreign` (`proposalidfk`),
  CONSTRAINT `workplans_proposalidfk_foreign` FOREIGN KEY (`proposalidfk`) REFERENCES `proposals` (`proposalid`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workplans`
--

LOCK TABLES `workplans` WRITE;
/*!40000 ALTER TABLE `workplans` DISABLE KEYS */;
INSERT INTO `workplans` VALUES ('76a394ac-8e39-463f-82fd-b085cb43cb30',1,'test','test','test','test','test','test','2024-09-03 05:44:31','2024-09-03 05:44:31');
/*!40000 ALTER TABLE `workplans` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-01 11:31:52
