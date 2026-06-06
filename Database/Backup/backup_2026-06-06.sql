CREATE DATABASE IF NOT EXISTS EcoSolido;
USE EcoSolido;

-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: EcoSolido
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `incidencia`
--

DROP TABLE IF EXISTS `incidencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incidencia` (
  `id_incidencia` bigint NOT NULL AUTO_INCREMENT,
  `descripcion` text NOT NULL,
  `categoria` varchar(255) DEFAULT NULL,
  `estado` varchar(50) DEFAULT 'PENDIENTE',
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `id_ciudadano` bigint DEFAULT NULL,
  PRIMARY KEY (`id_incidencia`),
  KEY `id_ciudadano` (`id_ciudadano`),
  CONSTRAINT `incidencia_ibfk_1` FOREIGN KEY (`id_ciudadano`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incidencia`
--

LOCK TABLES `incidencia` WRITE;
/*!40000 ALTER TABLE `incidencia` DISABLE KEYS */;
INSERT INTO `incidencia` VALUES (1,'adsadsasda','Acumulación y falta de recojo','0',NULL,NULL),(2,'adsadsasda','Acumulación y falta de recojo','0',NULL,NULL),(3,'fadsfdsfsdfgh','Acumulación y falta de recojo','0','2026-05-24 10:49:51',NULL),(4,'Se reporta la presencia de un menor de edad transitando y permaneciendo en un vertedero de residuos a cielo abierto. Esta situación representa un grave riesgo sanitario y un peligro inmediato para la integridad física del niño.','Otro','0','2026-05-24 10:54:51',NULL),(5,'Se reporta la presencia de un menor de edad transitando y permaneciendo en un vertedero de desechos sólidos. Se solicita la intervención de las autoridades competentes debido al riesgo sanitario y la situación de vulnerabilidad del niño.','Otro','PENDIENTE','2026-05-24 10:57:49',NULL),(6,'Aquí tienes el reporte para cada imagen:\n\n**Imagen 1:** Se reporta un cúmulo excesivo de bolsas de basura depositadas incorrectamente sobre la vía pública. Es necesaria la intervención inmediata del servicio de recolección para evitar focos de infección.\n\n**Imagen 2:** Se observa un desbordamiento de residuos sólidos alrededor de un contenedor público, afectando la limpieza de la zona verde. Se solicita el vaciado del depósito y la limpieza del área perimetral.','Acumulación y falta de recojo','PENDIENTE','2026-05-24 11:06:21',NULL),(7,'Se reportan trabajos de demolición y remoción de escombros mediante el uso de maquinaria pesada. La zona presenta una acumulación considerable de residuos de construcción que obstruyen el área.','Escombros o materiales de construcción','PENDIENTE','2026-05-24 11:14:02',NULL),(8,'El contenedor de basura ha sido afectado por una grúa hoy.','Contenedor dañado o lleno','PENDIENTE','2026-05-24 11:26:10',NULL),(10,'Se reporta una acumulación excesiva de basura y desechos sólidos en la vía pública. Esta situación genera un foco de contaminación y obstruye el paso peatonal en la zona.','Basura en vía pública','PENDIENTE','2026-05-24 19:10:34',NULL),(11,'Hay una gran falta de recojo de residuos.','Acumulación y falta de recojo','PENDIENTE','2026-05-24 19:35:53',NULL),(12,'Se reporta una acumulación masiva de residuos sólidos y desechos orgánicos en plena vía pública. Se observa a una persona depositando más desperdicios sobre el montón, obstruyendo el flujo vehicular.','Acumulación y falta de recojo','PENDIENTE','2026-05-24 19:37:43',NULL),(13,'Hay mucha basura que afecta la estética de la calle.','Otro','PENDIENTE','2026-05-29 16:56:12',NULL),(14,'No se recoge la basura en vía pública.','Basura en vía pública','PENDIENTE','2026-05-29 17:03:40',NULL),(15,'Escombros de construcción.','Escombros o materiales de construcción','PENDIENTE','2026-05-29 17:06:10',NULL),(16,'Niño junto a la basura.','Basura en vía pública','PENDIENTE','2026-05-29 17:11:07',NULL),(17,'Contenedor súper dañado','Contenedor dañado o lleno','PENDIENTE','2026-05-29 17:14:10',NULL),(18,'Falta de recojo en la calle.','Acumulación y falta de recojo','PENDIENTE','2026-05-29 17:15:59',NULL);
/*!40000 ALTER TABLE `incidencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `incidencia_foto`
--

DROP TABLE IF EXISTS `incidencia_foto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incidencia_foto` (
  `id_foto` bigint NOT NULL AUTO_INCREMENT,
  `id_incidencia` bigint NOT NULL,
  `url_foto` varchar(255) DEFAULT NULL,
  `public_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_foto`),
  KEY `id_incidencia` (`id_incidencia`),
  CONSTRAINT `incidencia_foto_ibfk_1` FOREIGN KEY (`id_incidencia`) REFERENCES `incidencia` (`id_incidencia`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incidencia_foto`
--

LOCK TABLES `incidencia_foto` WRITE;
/*!40000 ALTER TABLE `incidencia_foto` DISABLE KEYS */;
INSERT INTO `incidencia_foto` VALUES (5,5,'https://res.cloudinary.com/dpf2ubzgb/image/upload/v1779638269/incidencias/vnx4snkb01tx5kpvfwnh.jpg','incidencias/vnx4snkb01tx5kpvfwnh'),(6,6,'https://res.cloudinary.com/dpf2ubzgb/image/upload/v1779638781/incidencias/ks9xkcbjieqxqyqmouhe.jpg','incidencias/ks9xkcbjieqxqyqmouhe'),(7,6,'https://res.cloudinary.com/dpf2ubzgb/image/upload/v1779638782/incidencias/u972plq7jdyqya16wii6.jpg','incidencias/u972plq7jdyqya16wii6'),(8,7,'https://res.cloudinary.com/dpf2ubzgb/image/upload/v1779639242/incidencias/upev6swkiz1xahriqgxo.jpg','incidencias/upev6swkiz1xahriqgxo'),(9,7,'https://res.cloudinary.com/dpf2ubzgb/image/upload/v1779639243/incidencias/vj1xw99lroervpcm2crv.jpg','incidencias/vj1xw99lroervpcm2crv'),(10,8,'https://res.cloudinary.com/dpf2ubzgb/image/upload/v1779639970/incidencias/syiweozt387vu8hmgcup.jpg','incidencias/syiweozt387vu8hmgcup'),(13,10,'https://res.cloudinary.com/dpf2ubzgb/image/upload/v1779667587/incidencias/ccrhi9zmt3jkfhkprb7d.jpg',NULL),(14,11,'https://res.cloudinary.com/dpf2ubzgb/image/upload/v1779669353/incidencias/ddwi0bhg54mbs5j78kri.jpg','incidencias/ddwi0bhg54mbs5j78kri'),(15,11,'https://res.cloudinary.com/dpf2ubzgb/image/upload/v1779669354/incidencias/tu76rqfo7nhljgkhlrsz.jpg','incidencias/tu76rqfo7nhljgkhlrsz'),(16,12,'https://res.cloudinary.com/dpf2ubzgb/image/upload/v1779669433/incidencias/runihbum4jdqauxlkuv6.png',NULL),(17,13,'https://res.cloudinary.com/dpf2ubzgb/image/upload/v1780091775/incidencias/ko93gn1xz9wt11rlaygg.jpg','incidencias/ko93gn1xz9wt11rlaygg'),(18,14,'https://res.cloudinary.com/dpf2ubzgb/image/upload/v1780092223/incidencias/gxvmxv6r2mnqfprpz73a.png','incidencias/gxvmxv6r2mnqfprpz73a'),(19,15,'https://res.cloudinary.com/dpf2ubzgb/image/upload/v1780092373/incidencias/ynok8pjw1xnylfxskj0r.jpg','incidencias/ynok8pjw1xnylfxskj0r'),(20,16,'https://res.cloudinary.com/dpf2ubzgb/image/upload/v1780092670/incidencias/nv2hpycyghr3yii4kcf6.jpg','incidencias/nv2hpycyghr3yii4kcf6'),(21,17,'https://res.cloudinary.com/dpf2ubzgb/image/upload/v1780092854/incidencias/ui4gm7k7hyxxcj6yvsz1.jpg','incidencias/ui4gm7k7hyxxcj6yvsz1'),(22,18,'https://res.cloudinary.com/dpf2ubzgb/image/upload/v1780092962/incidencias/b2lwirdaman7jnvvuagi.jpg','incidencias/b2lwirdaman7jnvvuagi');
/*!40000 ALTER TABLE `incidencia_foto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` bigint NOT NULL AUTO_INCREMENT,
  `nombre_completo` varchar(255) NOT NULL,
  `apellido_completo` varchar(255) NOT NULL,
  `dni` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `nombre_usuario` varchar(255) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `pregunta_seguridad` varchar(255) DEFAULT NULL,
  `correo_electronico` varchar(255) DEFAULT NULL,
  `respuesta_pregunta` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Salvador Vasco','Goicochea Díaz','72930314','977373349','salvagd09','6789','¿Cual es tu color favorito?','vasco14_100@hotmail.com','rojo'),(2,'Marco Antonio','Goicochea Vega','32818860','915362984','magoic18','15984','¿Cómo se llama mi perro?','magoico@gmail.com','luca');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-06  0:00:00
