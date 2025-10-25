-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: comfachoco_portal
-- ------------------------------------------------------
-- Server version	8.0.43

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
-- Table structure for table `auditoria`
--

DROP TABLE IF EXISTS `auditoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auditoria` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `accion` varchar(100) NOT NULL,
  `tabla_afectada` varchar(50) DEFAULT NULL,
  `registro_id` int DEFAULT NULL,
  `detalles` json DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `auditoria_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditoria`
--

LOCK TABLES `auditoria` WRITE;
/*!40000 ALTER TABLE `auditoria` DISABLE KEYS */;
INSERT INTO `auditoria` VALUES (1,1,'login','usuarios',NULL,NULL,'::1','2025-10-25 01:30:26'),(2,1,'logout','usuarios',NULL,NULL,'::1','2025-10-25 01:33:58'),(3,1,'login','usuarios',NULL,NULL,'::1','2025-10-25 01:34:27'),(4,1,'logout','usuarios',NULL,NULL,'::1','2025-10-25 01:34:31'),(5,3,'login','usuarios',NULL,NULL,'::1','2025-10-25 01:34:48'),(6,3,'logout','usuarios',NULL,NULL,'::1','2025-10-25 01:36:24'),(7,1,'login','usuarios',NULL,NULL,'::1','2025-10-25 01:36:33'),(8,1,'logout','usuarios',NULL,NULL,'::1','2025-10-25 01:36:38'),(9,1,'login','usuarios',NULL,NULL,'::1','2025-10-25 01:57:54'),(10,1,'logout','usuarios',NULL,NULL,'::1','2025-10-25 02:54:33'),(11,4,'login','usuarios',NULL,NULL,'::1','2025-10-25 02:55:00'),(12,4,'logout','usuarios',NULL,NULL,'::1','2025-10-25 02:57:20'),(13,2,'login','usuarios',NULL,NULL,'::1','2025-10-25 02:57:39'),(14,2,'logout','usuarios',NULL,NULL,'::1','2025-10-25 02:58:08'),(15,3,'login','usuarios',NULL,NULL,'::1','2025-10-25 02:59:07'),(16,3,'logout','usuarios',NULL,NULL,'::1','2025-10-25 03:01:45'),(17,1,'login','usuarios',NULL,NULL,'::1','2025-10-25 03:01:58'),(18,1,'logout','usuarios',NULL,NULL,'::1','2025-10-25 03:02:13'),(19,4,'login','usuarios',NULL,NULL,'::1','2025-10-25 03:02:45'),(20,4,'crear_solicitud','solicitudes',1,'{\"dias_solicitados\": 3, \"tipo_solicitud_id\": \"4\"}',NULL,'2025-10-25 04:28:51'),(21,4,'logout','usuarios',NULL,NULL,'::1','2025-10-25 04:29:14'),(22,1,'login','usuarios',NULL,NULL,'::1','2025-10-25 04:29:23'),(23,1,'logout','usuarios',NULL,NULL,'::1','2025-10-25 04:36:22'),(24,4,'login','usuarios',NULL,NULL,'::1','2025-10-25 04:36:32'),(25,4,'crear_solicitud','solicitudes',2,'{\"dias_solicitados\": 5, \"tipo_solicitud_id\": \"1\"}',NULL,'2025-10-25 04:38:59'),(26,4,'logout','usuarios',NULL,NULL,'::1','2025-10-25 04:39:47'),(27,1,'login','usuarios',NULL,NULL,'::1','2025-10-25 04:39:56'),(28,4,'Solicitud aprobada','solicitudes',2,'{\"estado_nuevo\": \"aprobada\", \"estado_anterior\": \"pendiente\"}',NULL,'2025-10-25 04:56:10'),(29,4,'Solicitud aprobada','solicitudes',1,'{\"estado_nuevo\": \"aprobada\", \"estado_anterior\": \"pendiente\"}',NULL,'2025-10-25 04:57:19'),(30,1,'logout','usuarios',NULL,NULL,'::1','2025-10-25 04:57:29'),(31,4,'login','usuarios',NULL,NULL,'::1','2025-10-25 04:57:44'),(32,4,'crear_solicitud','solicitudes',3,'{\"dias_solicitados\": 4, \"tipo_solicitud_id\": \"2\"}',NULL,'2025-10-25 05:23:33'),(33,4,'logout','usuarios',NULL,NULL,'::1','2025-10-25 05:24:12'),(34,1,'login','usuarios',NULL,NULL,'::1','2025-10-25 05:24:22'),(35,1,'logout','usuarios',NULL,NULL,'::1','2025-10-25 05:25:37'),(36,5,'registro','usuarios',5,NULL,'::1','2025-10-25 05:45:36'),(37,5,'login','usuarios',NULL,NULL,'::1','2025-10-25 05:45:51'),(38,5,'crear_solicitud','solicitudes',4,'{\"dias_solicitados\": 15, \"tipo_solicitud_id\": \"1\"}',NULL,'2025-10-25 05:57:14'),(39,5,'logout','usuarios',NULL,NULL,'::1','2025-10-25 05:57:20'),(40,1,'login','usuarios',NULL,NULL,'::1','2025-10-25 05:57:50'),(41,1,'logout','usuarios',NULL,NULL,'::1','2025-10-25 05:58:26'),(42,4,'login','usuarios',NULL,NULL,'::1','2025-10-25 05:58:35'),(43,4,'logout','usuarios',NULL,NULL,'::1','2025-10-25 05:59:12'),(44,1,'login','usuarios',NULL,NULL,'::1','2025-10-25 05:59:21'),(45,5,'Solicitud aprobada','solicitudes',4,'{\"estado_nuevo\": \"aprobada\", \"estado_anterior\": \"pendiente\"}',NULL,'2025-10-25 06:05:09'),(46,4,'Solicitud rechazada','solicitudes',3,'{\"estado_nuevo\": \"rechazada\", \"estado_anterior\": \"pendiente\"}',NULL,'2025-10-25 06:05:40'),(47,1,'logout','usuarios',NULL,NULL,'::1','2025-10-25 06:07:17'),(48,5,'login','usuarios',NULL,NULL,'::1','2025-10-25 06:07:24'),(49,5,'logout','usuarios',NULL,NULL,'::1','2025-10-25 06:17:55'),(50,4,'login','usuarios',NULL,NULL,'::1','2025-10-25 06:18:06'),(51,4,'logout','usuarios',NULL,NULL,'::1','2025-10-25 06:35:03'),(52,5,'login','usuarios',NULL,NULL,'::1','2025-10-25 13:19:32'),(53,5,'logout','usuarios',NULL,NULL,'::1','2025-10-25 13:22:45'),(54,6,'registro','usuarios',6,NULL,'::1','2025-10-25 13:26:21'),(55,6,'login','usuarios',NULL,NULL,'::1','2025-10-25 13:26:43'),(56,6,'crear_solicitud','solicitudes',5,'{\"dias_solicitados\": 7, \"tipo_solicitud_id\": \"3\"}',NULL,'2025-10-25 13:29:42'),(57,6,'logout','usuarios',NULL,NULL,'::1','2025-10-25 13:30:45'),(58,1,'login','usuarios',NULL,NULL,'::1','2025-10-25 13:30:57'),(59,6,'Solicitud aprobada','solicitudes',5,'{\"estado_nuevo\": \"aprobada\", \"estado_anterior\": \"pendiente\"}',NULL,'2025-10-25 13:31:43'),(60,1,'logout','usuarios',NULL,NULL,'::1','2025-10-25 13:34:18'),(61,1,'login','usuarios',NULL,NULL,'::1','2025-10-25 14:01:24'),(62,1,'logout','usuarios',NULL,NULL,'::1','2025-10-25 14:02:45'),(63,1,'login','usuarios',NULL,NULL,'::1','2025-10-25 14:17:07'),(64,1,'logout','usuarios',NULL,NULL,'::1','2025-10-25 14:30:28'),(65,5,'login','usuarios',NULL,NULL,'::1','2025-10-25 14:30:38'),(66,5,'logout','usuarios',NULL,NULL,'::1','2025-10-25 14:31:22'),(67,1,'login','usuarios',NULL,NULL,'::1','2025-10-25 14:34:55'),(68,1,'logout','usuarios',NULL,NULL,'::1','2025-10-25 14:50:06'),(69,1,'login','usuarios',NULL,NULL,'::1','2025-10-25 14:50:47'),(70,1,'crear_solicitud','solicitudes',6,'{\"dias_solicitados\": 4, \"tipo_solicitud_id\": \"4\"}',NULL,'2025-10-25 14:53:27'),(71,1,'Solicitud aprobada','solicitudes',6,'{\"estado_nuevo\": \"aprobada\", \"estado_anterior\": \"pendiente\"}',NULL,'2025-10-25 14:54:56'),(72,1,'logout','usuarios',NULL,NULL,'::1','2025-10-25 14:55:35'),(73,5,'login','usuarios',NULL,NULL,'::1','2025-10-25 14:55:43'),(74,5,'logout','usuarios',NULL,NULL,'::1','2025-10-25 14:57:31');
/*!40000 ALTER TABLE `auditoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departamentos`
--

DROP TABLE IF EXISTS `departamentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departamentos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departamentos`
--

LOCK TABLES `departamentos` WRITE;
/*!40000 ALTER TABLE `departamentos` DISABLE KEYS */;
INSERT INTO `departamentos` VALUES (1,'Recursos Humanos','Gestión del talento humano','2025-10-24 14:06:18','2025-10-24 14:06:18'),(2,'Tecnología','Desarrollo y soporte tecnológico','2025-10-24 14:06:18','2025-10-24 14:06:18'),(3,'Operaciones','Operaciones y logística','2025-10-24 14:06:18','2025-10-24 14:06:18'),(4,'Administrativo','Gestión administrativa','2025-10-24 14:06:18','2025-10-24 14:06:18'),(5,'Comercial','Ventas y atención al cliente','2025-10-24 14:06:18','2025-10-24 14:06:18');
/*!40000 ALTER TABLE `departamentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `encuestas_bienestar`
--

DROP TABLE IF EXISTS `encuestas_bienestar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `encuestas_bienestar` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `fecha_encuesta` date NOT NULL,
  `nivel_satisfaccion` int DEFAULT NULL,
  `comentario` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `encuestas_bienestar_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `encuestas_bienestar_chk_1` CHECK ((`nivel_satisfaccion` between 1 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `encuestas_bienestar`
--

LOCK TABLES `encuestas_bienestar` WRITE;
/*!40000 ALTER TABLE `encuestas_bienestar` DISABLE KEYS */;
/*!40000 ALTER TABLE `encuestas_bienestar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mensajes_soporte`
--

DROP TABLE IF EXISTS `mensajes_soporte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mensajes_soporte` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `asunto` varchar(200) NOT NULL,
  `mensaje` text NOT NULL,
  `estado` enum('abierto','en_proceso','cerrado') DEFAULT 'abierto',
  `respuesta` text,
  `respondido_por` int DEFAULT NULL,
  `fecha_respuesta` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `respondido_por` (`respondido_por`),
  CONSTRAINT `mensajes_soporte_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `mensajes_soporte_ibfk_2` FOREIGN KEY (`respondido_por`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mensajes_soporte`
--

LOCK TABLES `mensajes_soporte` WRITE;
/*!40000 ALTER TABLE `mensajes_soporte` DISABLE KEYS */;
/*!40000 ALTER TABLE `mensajes_soporte` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificaciones`
--

DROP TABLE IF EXISTS `notificaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificaciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `mensaje` text NOT NULL,
  `tipo` enum('solicitud','aprobacion','rechazo','recordatorio','sistema') DEFAULT 'sistema',
  `leida` tinyint(1) DEFAULT '0',
  `solicitud_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `solicitud_id` (`solicitud_id`),
  KEY `idx_notificaciones_usuario` (`usuario_id`,`leida`),
  CONSTRAINT `notificaciones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `notificaciones_ibfk_2` FOREIGN KEY (`solicitud_id`) REFERENCES `solicitudes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificaciones`
--

LOCK TABLES `notificaciones` WRITE;
/*!40000 ALTER TABLE `notificaciones` DISABLE KEYS */;
INSERT INTO `notificaciones` VALUES (1,1,'Nueva Solicitud','Tienes una nueva solicitud pendiente de revisión','solicitud',1,1,'2025-10-25 04:28:51'),(2,2,'Nueva Solicitud','Tienes una nueva solicitud pendiente de revisión','solicitud',0,1,'2025-10-25 04:28:51'),(3,1,'Nueva Solicitud','Tienes una nueva solicitud pendiente de revisión','solicitud',1,2,'2025-10-25 04:38:59'),(4,2,'Nueva Solicitud','Tienes una nueva solicitud pendiente de revisión','solicitud',0,2,'2025-10-25 04:38:59'),(5,4,'Solicitud Aprobada','Tu solicitud ha sido aprobada por el supervisor.','aprobacion',1,2,'2025-10-25 04:56:10'),(6,4,'Solicitud Aprobada','Tu solicitud ha sido aprobada por el supervisor.','aprobacion',1,1,'2025-10-25 04:57:19'),(7,1,'Nueva Solicitud','Tienes una nueva solicitud pendiente de revisión','solicitud',1,3,'2025-10-25 05:23:33'),(8,2,'Nueva Solicitud','Tienes una nueva solicitud pendiente de revisión','solicitud',0,3,'2025-10-25 05:23:33'),(9,1,'Nueva Solicitud','Tienes una nueva solicitud pendiente de revisión','solicitud',1,4,'2025-10-25 05:57:14'),(10,2,'Nueva Solicitud','Tienes una nueva solicitud pendiente de revisión','solicitud',0,4,'2025-10-25 05:57:14'),(11,5,'Solicitud Aprobada','Tu solicitud ha sido aprobada por el supervisor.','aprobacion',1,4,'2025-10-25 06:05:09'),(12,4,'Solicitud Rechazada','Tu solicitud ha sido rechazada. Motivo: Justificacion invalida','rechazo',1,3,'2025-10-25 06:05:40'),(13,1,'Nueva Solicitud','Tienes una nueva solicitud pendiente de revisión','solicitud',1,5,'2025-10-25 13:29:42'),(14,2,'Nueva Solicitud','Tienes una nueva solicitud pendiente de revisión','solicitud',0,5,'2025-10-25 13:29:42'),(15,6,'Solicitud Aprobada','Tu solicitud ha sido aprobada por el supervisor.','aprobacion',0,5,'2025-10-25 13:31:43'),(16,1,'Nueva Solicitud','Tienes una nueva solicitud pendiente de revisión','solicitud',0,6,'2025-10-25 14:53:27'),(17,2,'Nueva Solicitud','Tienes una nueva solicitud pendiente de revisión','solicitud',0,6,'2025-10-25 14:53:27'),(18,1,'Solicitud Aprobada','Tu solicitud ha sido aprobada por el supervisor.','aprobacion',0,6,'2025-10-25 14:54:56');
/*!40000 ALTER TABLE `notificaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `saldos_dias`
--

DROP TABLE IF EXISTS `saldos_dias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `saldos_dias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `tipo_solicitud_id` int NOT NULL,
  `anio` int NOT NULL,
  `dias_totales` int NOT NULL,
  `dias_usados` int DEFAULT '0',
  `dias_pendientes` int DEFAULT '0',
  `dias_disponibles` int GENERATED ALWAYS AS (((`dias_totales` - `dias_usados`) - `dias_pendientes`)) STORED,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_saldo` (`usuario_id`,`tipo_solicitud_id`,`anio`),
  KEY `tipo_solicitud_id` (`tipo_solicitud_id`),
  KEY `idx_saldos_usuario_anio` (`usuario_id`,`anio`),
  CONSTRAINT `saldos_dias_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `saldos_dias_ibfk_2` FOREIGN KEY (`tipo_solicitud_id`) REFERENCES `tipos_solicitud` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=336 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saldos_dias`
--

LOCK TABLES `saldos_dias` WRITE;
/*!40000 ALTER TABLE `saldos_dias` DISABLE KEYS */;
INSERT INTO `saldos_dias` (`id`, `usuario_id`, `tipo_solicitud_id`, `anio`, `dias_totales`, `dias_usados`, `dias_pendientes`, `updated_at`) VALUES (1,1,1,2025,20,0,0,'2025-10-25 00:55:31'),(2,2,1,2025,15,0,0,'2025-10-25 00:55:31'),(3,4,1,2025,15,5,0,'2025-10-25 04:56:10'),(4,3,1,2025,15,0,0,'2025-10-25 00:55:31'),(5,1,2,2025,36,0,0,'2025-10-25 00:55:31'),(6,2,2,2025,12,0,0,'2025-10-25 00:55:31'),(7,4,2,2025,24,0,0,'2025-10-25 06:05:40'),(8,3,2,2025,24,0,0,'2025-10-25 00:55:31'),(18,1,3,2025,30,0,0,'2025-10-25 04:05:39'),(19,1,4,2025,10,4,0,'2025-10-25 14:54:56'),(22,2,3,2025,30,0,0,'2025-10-25 04:05:39'),(23,2,4,2025,10,0,0,'2025-10-25 04:05:39'),(26,3,3,2025,30,0,0,'2025-10-25 04:05:39'),(27,3,4,2025,10,0,0,'2025-10-25 04:05:39'),(30,4,3,2025,30,0,0,'2025-10-25 04:05:39'),(31,4,4,2025,10,3,0,'2025-10-25 04:57:19'),(168,5,1,2025,15,15,0,'2025-10-25 06:05:09'),(169,5,2,2025,12,0,0,'2025-10-25 05:45:36'),(170,5,3,2025,30,0,0,'2025-10-25 05:45:36'),(171,5,4,2025,10,0,0,'2025-10-25 05:45:36'),(288,6,1,2025,15,0,0,'2025-10-25 13:26:21'),(289,6,2,2025,12,0,0,'2025-10-25 13:26:21'),(290,6,3,2025,30,7,0,'2025-10-25 13:31:43'),(291,6,4,2025,10,0,0,'2025-10-25 13:26:21');
/*!40000 ALTER TABLE `saldos_dias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitudes`
--

DROP TABLE IF EXISTS `solicitudes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solicitudes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `tipo_solicitud_id` int NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `dias_solicitados` int NOT NULL,
  `motivo` text,
  `estado` enum('pendiente','aprobada','rechazada','cancelada') DEFAULT 'pendiente',
  `aprobado_por` int DEFAULT NULL,
  `fecha_aprobacion` timestamp NULL DEFAULT NULL,
  `comentarios_aprobador` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `tipo_solicitud_id` (`tipo_solicitud_id`),
  KEY `aprobado_por` (`aprobado_por`),
  KEY `idx_solicitudes_usuario` (`usuario_id`),
  KEY `idx_solicitudes_estado` (`estado`),
  KEY `idx_solicitudes_fecha` (`fecha_inicio`,`fecha_fin`),
  CONSTRAINT `solicitudes_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `solicitudes_ibfk_2` FOREIGN KEY (`tipo_solicitud_id`) REFERENCES `tipos_solicitud` (`id`),
  CONSTRAINT `solicitudes_ibfk_3` FOREIGN KEY (`aprobado_por`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitudes`
--

LOCK TABLES `solicitudes` WRITE;
/*!40000 ALTER TABLE `solicitudes` DISABLE KEYS */;
INSERT INTO `solicitudes` VALUES (1,4,4,'2025-10-27','2025-10-29',3,'Cumpleaños de la abuela','aprobada',1,'2025-10-25 04:57:19','Saludos de mi parte a su abuela','2025-10-25 04:28:51','2025-10-25 04:57:19'),(2,4,1,'2025-11-01','2025-11-05',5,'Motivos personales ','aprobada',1,'2025-10-25 04:56:10','Disfrute sus 5 dias, que despues el trabajo es doble','2025-10-25 04:38:59','2025-10-25 04:56:10'),(3,4,2,'2025-11-20','2025-11-23',4,'Motivos personales ','rechazada',1,'2025-10-25 06:05:40','Justificacion invalida','2025-10-25 05:23:33','2025-10-25 06:05:40'),(4,5,1,'2025-12-01','2025-12-15',15,'Motivos personales ','aprobada',1,'2025-10-25 06:05:09','','2025-10-25 05:57:14','2025-10-25 06:05:09'),(5,6,3,'2025-11-04','2025-11-10',7,' solicitud por cuestion medica','aprobada',1,'2025-10-25 13:31:43','','2025-10-25 13:29:42','2025-10-25 13:31:43'),(6,1,4,'2025-10-31','2025-11-03',4,'Motivos personales ','aprobada',1,'2025-10-25 14:54:56','','2025-10-25 14:53:27','2025-10-25 14:54:56');
/*!40000 ALTER TABLE `solicitudes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipos_empleado`
--

DROP TABLE IF EXISTS `tipos_empleado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipos_empleado` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `dias_vacaciones_anuales` int NOT NULL,
  `dias_permiso_mensual` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipos_empleado`
--

LOCK TABLES `tipos_empleado` WRITE;
/*!40000 ALTER TABLE `tipos_empleado` DISABLE KEYS */;
INSERT INTO `tipos_empleado` VALUES (1,'Administrativo',15,2,'2025-10-24 14:06:18'),(2,'Operativo',15,1,'2025-10-24 14:06:18'),(3,'Directivo',20,3,'2025-10-24 14:06:18');
/*!40000 ALTER TABLE `tipos_empleado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipos_solicitud`
--

DROP TABLE IF EXISTS `tipos_solicitud`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipos_solicitud` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` text,
  `requiere_aprobacion` tinyint(1) DEFAULT '1',
  `color_hex` varchar(7) DEFAULT '#3B82F6',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipos_solicitud`
--

LOCK TABLES `tipos_solicitud` WRITE;
/*!40000 ALTER TABLE `tipos_solicitud` DISABLE KEYS */;
INSERT INTO `tipos_solicitud` VALUES (1,'Vacaciones','Vacaciones anuales remuneradas',1,'#10B981','2025-10-24 14:06:18'),(2,'Permiso','Permiso personal de corta duración',1,'#3B82F6','2025-10-24 14:06:18'),(3,'Licencia Médica','Licencia por motivos de salud',1,'#F59E0B','2025-10-24 14:06:18'),(4,'Licencia Familiar','Licencia por asuntos familiares',1,'#8B5CF6','2025-10-24 14:06:18');
/*!40000 ALTER TABLE `tipos_solicitud` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_completo` varchar(150) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `cargo` varchar(100) DEFAULT NULL,
  `departamento_id` int DEFAULT NULL,
  `tipo_empleado_id` int DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `fecha_ingreso` date DEFAULT NULL,
  `es_supervisor` tinyint(1) DEFAULT '0',
  `es_rrhh` tinyint(1) DEFAULT '0',
  `estado` enum('activo','inactivo') DEFAULT 'activo',
  `avatar_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `departamento_id` (`departamento_id`),
  KEY `tipo_empleado_id` (`tipo_empleado_id`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`departamento_id`) REFERENCES `departamentos` (`id`),
  CONSTRAINT `usuarios_ibfk_2` FOREIGN KEY (`tipo_empleado_id`) REFERENCES `tipos_empleado` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'María González','maria.gonzalez@comfachoco.com','$2b$10$kVkfJo3RVxvEp8leAG8yjelH4Ml0xKV5LExWNhtlZZA9FO73erKO.','Directora de RRHH',1,3,NULL,'2020-01-15',1,1,'activo',NULL,'2025-10-24 14:06:18','2025-10-25 01:29:55'),(2,'Carlos Ramírez','carlos.ramirez@comfachoco.com','$2b$10$kVkfJo3RVxvEp8leAG8yjelH4Ml0xKV5LExWNhtlZZA9FO73erKO.','Supervisor de Operaciones',3,2,NULL,'2021-03-10',1,0,'activo',NULL,'2025-10-24 14:06:18','2025-10-25 01:29:55'),(3,'Ana Martínez','ana.martinez@comfachoco.com','$2b$10$kVkfJo3RVxvEp8leAG8yjelH4Ml0xKV5LExWNhtlZZA9FO73erKO.','Analista de Sistemas',2,1,NULL,'2022-06-01',0,0,'activo',NULL,'2025-10-24 14:06:18','2025-10-25 01:29:55'),(4,'Juan Pérez','juan.perez@comfachoco.com','$2b$10$kVkfJo3RVxvEp8leAG8yjelH4Ml0xKV5LExWNhtlZZA9FO73erKO.','Asistente Administrativo',4,1,NULL,'2023-01-20',0,0,'activo',NULL,'2025-10-24 14:06:18','2025-10-25 01:29:55'),(5,'Gustavo Mena Palacios','gustavomenap434@gmail.com','$2b$10$jSN4RAhAXyUPEXxtxAY6nuGFCcq8TJOyHdNTnAdjQVG1akDNbYZAy','Pasante',2,2,'3217391838','2025-10-25',0,0,'activo',NULL,'2025-10-25 05:45:36','2025-10-25 05:45:36'),(6,'karina rios bejarano','karinariosbejarano@gmail.com','$2b$10$PX6N6aLik/q2GSeB2XadFOn2nWeufsVp.SBwKdNyKekGTihK8d0sC','trabajadora social',1,2,'3104529257','2025-06-02',0,0,'activo',NULL,'2025-10-25 13:26:21','2025-10-25 13:26:21');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `vista_saldos_actuales`
--

DROP TABLE IF EXISTS `vista_saldos_actuales`;
/*!50001 DROP VIEW IF EXISTS `vista_saldos_actuales`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vista_saldos_actuales` AS SELECT 
 1 AS `usuario_id`,
 1 AS `nombre_completo`,
 1 AS `tipo_solicitud`,
 1 AS `dias_totales`,
 1 AS `dias_usados`,
 1 AS `dias_pendientes`,
 1 AS `dias_disponibles`,
 1 AS `anio`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vista_solicitudes_completa`
--

DROP TABLE IF EXISTS `vista_solicitudes_completa`;
/*!50001 DROP VIEW IF EXISTS `vista_solicitudes_completa`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vista_solicitudes_completa` AS SELECT 
 1 AS `id`,
 1 AS `usuario_id`,
 1 AS `empleado_nombre`,
 1 AS `empleado_email`,
 1 AS `empleado_cargo`,
 1 AS `departamento`,
 1 AS `tipo_solicitud`,
 1 AS `color_hex`,
 1 AS `fecha_inicio`,
 1 AS `fecha_fin`,
 1 AS `dias_solicitados`,
 1 AS `motivo`,
 1 AS `estado`,
 1 AS `comentarios_aprobador`,
 1 AS `aprobado_por_nombre`,
 1 AS `fecha_aprobacion`,
 1 AS `created_at`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `vista_saldos_actuales`
--

/*!50001 DROP VIEW IF EXISTS `vista_saldos_actuales`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vista_saldos_actuales` AS select `sd`.`usuario_id` AS `usuario_id`,`u`.`nombre_completo` AS `nombre_completo`,`ts`.`nombre` AS `tipo_solicitud`,`sd`.`dias_totales` AS `dias_totales`,`sd`.`dias_usados` AS `dias_usados`,`sd`.`dias_pendientes` AS `dias_pendientes`,`sd`.`dias_disponibles` AS `dias_disponibles`,`sd`.`anio` AS `anio` from ((`saldos_dias` `sd` join `usuarios` `u` on((`sd`.`usuario_id` = `u`.`id`))) join `tipos_solicitud` `ts` on((`sd`.`tipo_solicitud_id` = `ts`.`id`))) where (`sd`.`anio` = year(curdate())) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vista_solicitudes_completa`
--

/*!50001 DROP VIEW IF EXISTS `vista_solicitudes_completa`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vista_solicitudes_completa` AS select `s`.`id` AS `id`,`s`.`usuario_id` AS `usuario_id`,`u`.`nombre_completo` AS `empleado_nombre`,`u`.`email` AS `empleado_email`,`u`.`cargo` AS `empleado_cargo`,`d`.`nombre` AS `departamento`,`ts`.`nombre` AS `tipo_solicitud`,`ts`.`color_hex` AS `color_hex`,`s`.`fecha_inicio` AS `fecha_inicio`,`s`.`fecha_fin` AS `fecha_fin`,`s`.`dias_solicitados` AS `dias_solicitados`,`s`.`motivo` AS `motivo`,`s`.`estado` AS `estado`,`s`.`comentarios_aprobador` AS `comentarios_aprobador`,`a`.`nombre_completo` AS `aprobado_por_nombre`,`s`.`fecha_aprobacion` AS `fecha_aprobacion`,`s`.`created_at` AS `created_at` from ((((`solicitudes` `s` join `usuarios` `u` on((`s`.`usuario_id` = `u`.`id`))) left join `departamentos` `d` on((`u`.`departamento_id` = `d`.`id`))) join `tipos_solicitud` `ts` on((`s`.`tipo_solicitud_id` = `ts`.`id`))) left join `usuarios` `a` on((`s`.`aprobado_por` = `a`.`id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-25 10:25:33
