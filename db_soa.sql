/*
SQLyog Community v13.1.9 (64 bit)
MySQL - 10.4.27-MariaDB : Database - proyek_soa
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`proyek_soa` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `proyek_soa`;

/*Table structure for table `customers` */

DROP TABLE IF EXISTS `customers`;

CREATE TABLE `customers` (
  `username` varchar(100) NOT NULL,
  `nama` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `saldo` int(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `customers` */

insert  into `customers`(`username`,`nama`,`password`,`saldo`,`email`,`status`) values 
('aldi','nicho','123',0,'ca@gmail.com','Berhasil Verifikasi'),
('dece','nicho','123',0,'b@gmail.com','Belom Terverifikasi'),
('donald','nicho','123',0,'b@gmail.com','Berhasil Verifikasi'),
('nicho','nicho','123',40000,'s@gmail.com','Sudah Terverifikasi');

/*Table structure for table `products` */

DROP TABLE IF EXISTS `products`;

CREATE TABLE `products` (
  `id` varchar(10) NOT NULL,
  `product_name` varchar(100) NOT NULL,
  `qty` int(100) NOT NULL,
  `supplier` varchar(100) NOT NULL,
  `price` int(100) NOT NULL,
  `gambar` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `products` */

insert  into `products`(`id`,`product_name`,`qty`,`supplier`,`price`,`gambar`,`createdAt`,`updatedAt`,`deletedAt`) values 
('ITEM_0001','pisang',5,'Hero',1500,'sfood.jpg',NULL,NULL,NULL),
('ITEM_0002','pisang',5,'Hero',1500,'sfood.jpg',NULL,NULL,NULL),
('ITEM_0003','pisang',5,'Hero',1500,NULL,'2023-06-22 20:20:48','2023-06-22 20:20:48',NULL),
('ITEM_0004','pisang',5,'Hero',1500,NULL,'2023-06-22 20:54:07','2023-06-22 20:54:07',NULL),
('ITEM_0005','pisang',5,'Hero',1500,NULL,'2023-06-22 20:54:52','2023-06-22 20:54:52',NULL),
('ITEM_0006','pisang',5,'Hero',1500,'delivery.jpg','2023-06-22 20:55:42','2023-06-22 20:55:42',NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
