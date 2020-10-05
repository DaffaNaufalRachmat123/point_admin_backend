-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 05, 2020 at 05:54 PM
-- Server version: 10.1.28-MariaDB
-- PHP Version: 7.1.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `points_admin`
--

-- --------------------------------------------------------

--
-- Table structure for table `rewards`
--

CREATE TABLE `rewards` (
  `id` int(11) NOT NULL,
  `users_point` int(11) DEFAULT NULL,
  `rewards` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `rewards`
--

INSERT INTO `rewards` (`id`, `users_point`, `rewards`, `createdAt`, `updatedAt`) VALUES
(10, 10, 'Beng Beng', '2020-10-05 13:09:11', '2020-10-05 13:09:11'),
(11, 5, 'Top', '2020-10-05 13:09:18', '2020-10-05 13:09:18'),
(12, 20, 'Silverqueen', '2020-10-05 15:40:29', '2020-10-05 15:40:29');

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20201003053815-create-users.js'),
('20201003054310-create-transactions.js'),
('20201003055103-create-rewards.js');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `users_id` int(11) NOT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `product_total_count` int(11) DEFAULT NULL,
  `product_price` int(11) DEFAULT NULL,
  `product_total_price` int(11) DEFAULT NULL,
  `transaction_point` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `transaction_id`, `users_id`, `product_name`, `product_total_count`, `product_price`, `product_total_price`, `transaction_point`, `createdAt`, `updatedAt`) VALUES
(13, 'T-8G83', 4, 'Beng beng', 3, 1000, 4000, 5, '2020-10-05 13:53:09', '2020-10-05 14:18:31'),
(14, 'T-2CUQ', 12, 'Beng Bengs', 1, 1000, 10200, 5, '2020-10-05 14:12:20', '2020-10-05 14:18:23');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` text,
  `transactions_count` int(11) DEFAULT NULL,
  `users_point` int(11) DEFAULT NULL,
  `is_user_admin` enum('user','admin') DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `transactions_count`, `users_point`, `is_user_admin`, `createdAt`, `updatedAt`) VALUES
(4, 'Daffanaufalrachmats', 'naufals@gmail.com', '$2a$12$vc3AsHxszDIRx./C/eLSoOOX11JYj1wJ01Z0Y9cwY7QqNBvTQrQga', 0, 15, 'user', '2020-10-04 16:21:08', '2020-10-05 13:53:10'),
(12, 'hellosss', 'hello123@gmail.com', '$2a$12$dMYUprVCn/T0hDGVfplFZ.zJjycMNvkon0PD/gXyPEtDtv2RtFeMy', 0, 20, 'admin', '2020-10-05 11:54:44', '2020-10-05 14:12:20');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `rewards`
--
ALTER TABLE `rewards`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `users_id` (`users_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `rewards`
--
ALTER TABLE `rewards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
