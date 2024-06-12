-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 12, 2024 at 03:00 PM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.0.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `driverapp`
--

-- --------------------------------------------------------

--
-- Table structure for table `ordertrips`
--

CREATE TABLE `ordertrips` (
  `id` int(11) NOT NULL,
  `trip_id` int(11) NOT NULL,
  `driver_id` int(11) DEFAULT NULL,
  `status` enum('pending','accepted','completed') DEFAULT 'pending',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `ordertrips`
--

INSERT INTO `ordertrips` (`id`, `trip_id`, `driver_id`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 1, 2, 'accepted', '2024-06-12 11:50:39', '2024-06-12 11:50:39'),
(2, 2, 2, 'accepted', '2024-06-12 12:56:53', '2024-06-12 12:56:53');

-- --------------------------------------------------------

--
-- Table structure for table `trips`
--

CREATE TABLE `trips` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `start_location` varchar(255) NOT NULL,
  `end_location` varchar(255) NOT NULL,
  `status` enum('pending','completed') DEFAULT 'pending',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `trips`
--

INSERT INTO `trips` (`id`, `user_id`, `start_location`, `end_location`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'a', 'c', 'completed', '2024-06-12 11:50:39', '2024-06-12 11:50:39'),
(2, 3, 'Bandung', 'Jakarta', 'completed', '2024-06-12 12:56:53', '2024-06-12 12:56:53');

-- --------------------------------------------------------

--
-- Table structure for table `userroles`
--

CREATE TABLE `userroles` (
  `id` int(11) NOT NULL,
  `role_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `userroles`
--

INSERT INTO `userroles` (`id`, `role_name`) VALUES
(2, 'driver'),
(1, 'user');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int(11) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role_id`, `createdAt`, `updatedAt`) VALUES
(1, 'string', 'string', '$2a$10$QKd7nWrQBrH/bAcleH.3DedYrtnhf/ceLFHP/4SD0md38.Dcs9Voa', 1, '2024-06-12 09:57:26', '2024-06-12 09:57:26'),
(2, 'dadan', 'dadan', '$2a$10$m5sQorG13scE9sKapAbkyuJw/gxzuKeOkCcFphZn558lGDbr2hr/W', 2, '2024-06-12 10:48:04', '2024-06-12 10:48:04'),
(3, 'Roy', 'roy@gmail.com', '$2a$10$pgd7YWE1TndIvUYusnhSPOb4YJE5.WpYzbrV6ZxM9KwzS8LuK3aEe', 1, '2024-06-12 12:47:45', '2024-06-12 12:47:45');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ordertrips`
--
ALTER TABLE `ordertrips`
  ADD PRIMARY KEY (`id`),
  ADD KEY `trip_id` (`trip_id`),
  ADD KEY `driver_id` (`driver_id`);

--
-- Indexes for table `trips`
--
ALTER TABLE `trips`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `userroles`
--
ALTER TABLE `userroles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `role_name` (`role_name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ordertrips`
--
ALTER TABLE `ordertrips`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `trips`
--
ALTER TABLE `trips`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `userroles`
--
ALTER TABLE `userroles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ordertrips`
--
ALTER TABLE `ordertrips`
  ADD CONSTRAINT `ordertrips_ibfk_1` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`),
  ADD CONSTRAINT `ordertrips_ibfk_2` FOREIGN KEY (`driver_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `trips`
--
ALTER TABLE `trips`
  ADD CONSTRAINT `trips_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `userroles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
