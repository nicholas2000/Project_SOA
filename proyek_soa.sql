/*
SQLyog Community v13.1.9 (64 bit)
MySQL - 10.4.27-MariaDB : Database - proyek_soa
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*Table structure for table `carts` */

DROP TABLE IF EXISTS `carts`;

CREATE TABLE `carts` (
  `id` varchar(255) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `qty` int(11) NOT NULL,
  `customer` varchar(255) NOT NULL,
  `price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `carts` */

insert  into `carts`(`id`,`product_name`,`qty`,`customer`,`price`) values 
('CART_0001','apple',1,'donald',10000),
('CART_0001','apple',1,'donald',10000);

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

/*Table structure for table `delivery` */

DROP TABLE IF EXISTS `delivery`;

CREATE TABLE `delivery` (
  `id_pengiriman` varchar(100) NOT NULL,
  `id_carts` varchar(100) NOT NULL,
  `customer` varchar(100) NOT NULL,
  `price` int(100) NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `delivery` */

insert  into `delivery`(`id_pengiriman`,`id_carts`,`customer`,`price`,`createdAt`,`updatedAt`,`deletedAt`) values 
('DLVR_0001','CART_0001','aldi',16000,'2023-06-22 14:00:50','2023-06-22 14:00:50',NULL),
('DLVR_0002','CART_0001','donald',16000,'2023-06-22 19:31:27','2023-06-22 19:31:27',NULL);

/*Table structure for table `orders` */

DROP TABLE IF EXISTS `orders`;

CREATE TABLE `orders` (
  `id` varchar(100) NOT NULL,
  `product_name` varchar(100) DEFAULT NULL,
  `qty` int(100) DEFAULT NULL,
  `customer` varchar(100) DEFAULT NULL,
  `price` int(100) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `orders` */

insert  into `orders`(`id`,`product_name`,`qty`,`customer`,`price`,`createdAt`,`updatedAt`,`deletedAt`) values 
('DLVR_0001','Pisang',5,'aldi',15500,NULL,NULL,NULL),
('DLVR_0002','Semangka',10,'toni',15000,NULL,NULL,NULL);

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
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
