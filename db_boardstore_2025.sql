-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 26, 2025 at 04:58 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_boardstore_2025`
--
CREATE DATABASE IF NOT EXISTS `db_boardstore_2025` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `db_boardstore_2025`;

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `account_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('admin','user') NOT NULL,
  `profile_img` varchar(255) NOT NULL,
  `account_status` enum('active','inactive') NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`account_id`, `user_id`, `username`, `password`, `role`, `profile_img`, `account_status`, `created_at`, `updated_at`) VALUES
(1, 1, 'adminuser', '$2y$10$FH87.YlExRF8FdGd/jwmA.hApq4BeMoJDorqFRX6IrFB2fwJxbdTq', 'admin', 'profile_pictures/39VUZIZ9LUrGPtea7YBm3RvMT3Oo7VkrJYqNm4K9.png', 'active', '2025-04-05 17:51:05', '2025-04-06 21:32:33'),
(2, 2, 'testuser', '$2y$10$/kTj7AH.TSerMb1PUw6oquPXdQKWAe.xeC1Pd7/o0p1Ct3NJLj3A.', 'admin', 'default.jpg', 'active', '2025-04-05 17:51:05', '2025-04-07 01:06:45'),
(3, 3, 'nyseam', '$2y$10$GjxiJ8lhetqbKKvjODzDRu57x77wxOUeLyzTsAppcfQqe/iqF.XWi', 'user', 'profile_pictures/68OjGUoNOYqq4SkueHSAKjqNfAE5udPC62ZFruCG.jpg', 'active', '2025-04-05 18:09:16', '2025-04-05 18:09:16'),
(4, 4, 'lansss', '$2y$10$4fh/K/B1dGVi6N1jQS1kHO9cplXTdBEwz4eoN125nHpsUxtuO/fJy', 'user', 'profile_pictures/jRsmfD0zQUDJynJkbtEZ64w92Lzh3f3A7P1koksU.jpg', 'active', '2025-04-06 20:34:31', '2025-04-06 22:22:58'),
(5, 5, 'ctrlv_ince', '$2y$10$g32qIYsDdpmutlgpetWgBe65PsP5u7244QSlj6KKhCkUP0tM0YQoy', 'user', 'profile_pictures/Ll2RuNDBCLac6Cr1IXIW0cGGc1PApOT3xn7OPwme.jpg', 'active', '2025-04-06 22:54:37', '2025-04-06 22:54:37');

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `cart_id` bigint(20) UNSIGNED NOT NULL,
  `account_id` bigint(20) UNSIGNED NOT NULL,
  `item_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL,
  `date_placed` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `group_id` bigint(20) UNSIGNED NOT NULL,
  `group_name` varchar(50) NOT NULL,
  `group_description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`group_id`, `group_name`, `group_description`, `created_at`, `updated_at`) VALUES
(1, 'Arduino', 'Official Arduino boards and compatible variants', '2025-04-05 17:50:10', '2025-04-05 17:50:10'),
(2, 'Raspberry Pi', 'Raspberry Pi single-board computers and accessories', '2025-04-05 17:50:10', '2025-04-05 17:50:10'),
(3, 'ESP32', 'ESP32 development boards and modules', '2025-04-05 17:50:10', '2025-04-05 17:50:10'),
(4, 'ESP8266', 'ESP8266 WiFi modules and development boards', '2025-04-05 17:50:10', '2025-04-05 17:50:10'),
(5, 'STM32', 'STM32 microcontroller development boards', '2025-04-05 17:50:10', '2025-04-05 17:50:10'),
(6, 'BeagleBone', 'BeagleBone single-board computers and accessories', '2025-04-05 17:50:10', '2025-04-05 17:50:10'),
(7, 'Atmel', 'The company focused on embedded systems built around microcontrollers.', '2025-04-06 21:42:04', '2025-04-06 21:42:04');

-- --------------------------------------------------------

--
-- Table structure for table `inventories`
--

CREATE TABLE `inventories` (
  `item_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `inventories`
--

INSERT INTO `inventories` (`item_id`, `quantity`, `created_at`, `updated_at`) VALUES
(1, 44, '2025-04-05 17:50:10', '2025-04-06 22:06:24'),
(2, 24, '2025-04-05 17:50:10', '2025-04-06 22:07:28'),
(3, 20, '2025-04-05 17:50:10', '2025-04-05 23:07:03'),
(4, 100, '2025-04-05 17:50:10', '2025-04-05 17:50:10'),
(5, 40, '2025-04-05 17:50:10', '2025-04-05 17:50:10'),
(6, 30, '2025-04-05 17:50:10', '2025-04-06 22:21:44'),
(7, 45, '2025-04-05 17:50:10', '2025-04-05 17:50:10'),
(8, 48, '2025-04-05 17:50:10', '2025-04-06 02:10:46'),
(9, 26, '2025-04-05 17:50:10', '2025-04-06 02:16:50'),
(10, 25, '2025-04-05 17:50:10', '2025-04-05 17:50:10'),
(11, 20, '2025-04-05 17:50:10', '2025-04-05 17:50:10'),
(12, 15, '2025-04-05 17:50:10', '2025-04-05 17:50:10'),
(16, 20, '2025-04-06 21:53:46', '2025-04-06 22:56:15'),
(22, 10, '2025-04-07 00:55:14', '2025-04-07 00:55:14');

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `item_id` bigint(20) UNSIGNED NOT NULL,
  `item_name` varchar(50) NOT NULL,
  `item_description` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`item_id`, `item_name`, `item_description`, `price`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Arduino Uno R3', 'ATmega328P microcontroller, 14 digital I/O pins, 6 analog inputs', 24.99, '2025-04-05 17:50:10', '2025-04-06 21:10:27', NULL),
(2, 'Arduino Mega 2560', 'ATmega2560 microcontroller, 54 digital I/O pins, 16 analog inputs', 39.99, '2025-04-05 17:50:10', '2025-04-05 17:50:10', NULL),
(3, 'Raspberry Pi 4 Model B', '4GB RAM, 1.5GHz quad-core CPU, dual-band WiFi, Bluetooth 5.0', 55.00, '2025-04-05 17:50:10', '2025-04-05 17:50:10', NULL),
(4, 'Raspberry Pi Pico', 'RP2040 microcontroller, dual-core Arm Cortex-M0+', 4.00, '2025-04-05 17:50:10', '2025-04-05 17:50:10', NULL),
(5, 'ESP32 DevKit V1', 'Dual-core Xtensa LX6, WiFi and Bluetooth, 38 GPIO pins', 12.99, '2025-04-05 17:50:10', '2025-04-05 17:50:10', NULL),
(6, 'ESP32-CAM', 'ESP32 with OV2640 camera, WiFi, Bluetooth, microSD slot', 9.99, '2025-04-05 17:50:10', '2025-04-05 17:50:10', NULL),
(7, 'NodeMCU ESP8266', 'ESP-12E module, WiFi, 11 GPIO pins, microUSB', 8.99, '2025-04-05 17:50:10', '2025-04-05 17:50:10', NULL),
(8, 'Wemos D1 Mini', 'ESP8266 based, compact size, WiFi, 11 GPIO pins', 6.99, '2025-04-05 17:50:10', '2025-04-05 17:50:10', NULL),
(9, 'STM32F103C8T6', 'Blue Pill development board, ARM Cortex-M3, 72MHz', 7.99, '2025-04-05 17:50:10', '2025-04-06 07:22:31', NULL),
(10, 'STM32F407VET6', 'Black Pill development board, ARM Cortex-M4, 168MHz', 14.99, '2025-04-05 17:50:10', '2025-04-05 17:50:10', NULL),
(11, 'BeagleBone Black', '1GHz ARM Cortex-A8, 512MB RAM, 4GB eMMC', 55.00, '2025-04-05 17:50:10', '2025-04-05 17:50:10', NULL),
(12, 'BeagleBone AI', 'Dual Cortex-A15, 1GB RAM, 16GB eMMC, AI capabilities', 129.00, '2025-04-05 17:50:10', '2025-04-05 17:50:10', NULL),
(16, 'Atmel AT89', 'Based on the Intel 8051 core, the AT89 series remains very popular as general purpose microcontrollers, due to their industry standard instruction set, their low unit cost, and the availability of these chips in DIL (DIP) packages.', 159.00, '2025-04-06 21:53:46', '2025-04-06 21:53:46', NULL),
(22, 'Arduino Uno R3', 'Microcontroller board', 24.99, '2025-04-07 00:55:14', '2025-04-07 00:55:14', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `item_groups`
--

CREATE TABLE `item_groups` (
  `group_id` bigint(20) UNSIGNED NOT NULL,
  `item_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `item_groups`
--

INSERT INTO `item_groups` (`group_id`, `item_id`, `created_at`, `updated_at`) VALUES
(1, 1, NULL, NULL),
(1, 2, '2025-04-05 17:50:10', '2025-04-05 17:50:10'),
(1, 22, NULL, NULL),
(2, 3, '2025-04-05 17:50:10', '2025-04-05 17:50:10'),
(2, 4, '2025-04-05 17:50:10', '2025-04-05 17:50:10'),
(3, 5, '2025-04-05 17:50:10', '2025-04-05 17:50:10'),
(3, 6, '2025-04-05 17:50:10', '2025-04-05 17:50:10'),
(4, 7, '2025-04-05 17:50:10', '2025-04-05 17:50:10'),
(4, 8, '2025-04-05 17:50:10', '2025-04-05 17:50:10'),
(5, 9, '2025-04-05 17:50:10', '2025-04-05 17:50:10'),
(5, 10, '2025-04-05 17:50:10', '2025-04-05 17:50:10'),
(6, 11, '2025-04-05 17:50:10', '2025-04-05 17:50:10'),
(6, 12, '2025-04-05 17:50:10', '2025-04-05 17:50:10'),
(7, 16, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `item_images`
--

CREATE TABLE `item_images` (
  `image_id` bigint(20) UNSIGNED NOT NULL,
  `item_id` bigint(20) UNSIGNED NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT 0,
  `uploaded_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `item_images`
--

INSERT INTO `item_images` (`image_id`, `item_id`, `image_path`, `is_primary`, `uploaded_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(3, 1, 'items/RNMpMyd6CTXbB3IE6PwE6V629vJ5T3MGgc5DOHy3.png', 0, '2025-04-07 12:51:23', '2025-04-06 20:51:23', '2025-04-06 21:10:27', NULL),
(5, 16, 'items/tRmvI80F8rAV3bIeZ9CPJit6CgIQWwbblSBcXNxx.jpg', 0, '2025-04-07 13:53:46', '2025-04-06 21:53:46', '2025-04-06 21:53:46', NULL),
(6, 16, 'items/wGEFDnF8O7MTjz8JYlulJEw4azxOJ78KhJf7onbW.png', 0, '2025-04-07 13:53:46', '2025-04-06 21:53:46', '2025-04-06 21:53:46', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_100000_create_password_reset_tokens_table', 1),
(2, '2014_10_12_100000_create_password_resets_table', 1),
(3, '2019_08_19_000000_create_failed_jobs_table', 1),
(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(5, '2025_04_05_100000_create_users_table', 1),
(6, '2025_04_05_100001_create_accounts_table', 1),
(7, '2025_04_05_100002_create_groups_table', 1),
(8, '2025_04_05_100003_create_items_table', 1),
(9, '2025_04_05_100004_create_orders_table', 1),
(10, '2025_04_05_100005_create_orderinfos_table', 1),
(11, '2025_04_05_100006_create_item_images_table', 1),
(12, '2025_04_05_100007_create_item_groups_table', 1),
(13, '2025_04_05_100008_create_inventories_table', 1),
(14, '2025_04_05_100009_create_reviews_table', 1),
(15, '2025_04_05_100010_create_carts_table', 1),
(16, '2023_05_19_123456_add_soft_deletes_to_items_table', 2),
(17, '2025_04_07_044912_add_soft_deletes_to_item_images_table', 3),
(18, '2025_04_07_053514_update_group_description_to_nullable', 4);

-- --------------------------------------------------------

--
-- Table structure for table `orderinfos`
--

CREATE TABLE `orderinfos` (
  `orderinfo_id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `item_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL,
  `created` datetime NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orderinfos`
--

INSERT INTO `orderinfos` (`orderinfo_id`, `order_id`, `item_id`, `quantity`, `created`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 2, '2025-04-06 11:48:20', '2025-04-05 19:48:20', '2025-04-05 19:48:20'),
(2, 2, 2, 3, '2025-04-06 04:33:17', '2025-04-05 20:33:17', '2025-04-05 20:33:17'),
(3, 2, 1, 3, '2025-04-06 04:33:17', '2025-04-05 20:33:17', '2025-04-05 20:33:17'),
(4, 2, 3, 1, '2025-04-06 04:33:17', '2025-04-05 20:33:17', '2025-04-05 20:33:17'),
(5, 2, 6, 1, '2025-04-06 04:33:17', '2025-04-05 20:33:17', '2025-04-05 20:33:17'),
(6, 3, 3, 2, '2025-04-06 04:37:39', '2025-04-05 20:37:39', '2025-04-05 20:37:39'),
(7, 4, 3, 1, '2025-04-06 06:19:31', '2025-04-05 22:19:31', '2025-04-05 22:19:31'),
(8, 5, 3, 1, '2025-04-06 07:07:03', '2025-04-05 23:07:03', '2025-04-05 23:07:03'),
(9, 6, 2, 2, '2025-04-06 08:48:22', '2025-04-06 00:48:22', '2025-04-06 00:48:22'),
(10, 7, 8, 2, '2025-04-06 10:10:46', '2025-04-06 02:10:46', '2025-04-06 02:10:46'),
(11, 8, 6, 1, '2025-04-06 10:13:26', '2025-04-06 02:13:26', '2025-04-06 02:13:26'),
(12, 9, 9, 2, '2025-04-06 18:16:29', '2025-04-06 02:16:29', '2025-04-06 02:16:29'),
(13, 10, 9, 2, '2025-04-06 10:16:50', '2025-04-06 02:16:50', '2025-04-06 02:16:50'),
(14, 11, 1, 1, '2025-04-07 06:06:24', '2025-04-06 22:06:24', '2025-04-06 22:06:24'),
(15, 12, 2, 1, '2025-04-07 14:07:28', '2025-04-06 22:07:28', '2025-04-06 22:07:28'),
(17, 14, 6, 1, '2025-04-07 14:21:33', '2025-04-06 22:21:33', '2025-04-06 22:21:33'),
(18, 15, 6, 1, '2025-04-07 14:21:38', '2025-04-06 22:21:38', '2025-04-06 22:21:38'),
(19, 16, 6, 1, '2025-04-07 14:21:44', '2025-04-06 22:21:44', '2025-04-06 22:21:44'),
(20, 17, 16, 2, '2025-04-07 06:56:15', '2025-04-06 22:56:15', '2025-04-06 22:56:15');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `account_id` bigint(20) UNSIGNED NOT NULL,
  `date_ordered` datetime NOT NULL,
  `total_amount` int(11) NOT NULL,
  `status` enum('pending','shipped','for_confirm','completed','cancelled') NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `account_id`, `date_ordered`, `total_amount`, `status`, `created_at`, `updated_at`) VALUES
(1, 3, '2025-04-06 03:48:20', 50, 'pending', '2025-04-05 19:48:20', '2025-04-05 19:48:20'),
(2, 3, '2025-04-06 04:33:17', 260, 'completed', '2025-04-05 20:33:17', '2025-04-05 20:33:17'),
(3, 3, '2025-04-06 04:37:39', 110, 'completed', '2025-04-05 20:37:39', '2025-04-05 20:37:39'),
(4, 3, '2025-04-06 06:19:31', 55, 'pending', '2025-04-05 22:19:31', '2025-04-05 22:19:31'),
(5, 3, '2025-04-06 07:07:03', 55, 'pending', '2025-04-05 23:07:03', '2025-04-05 23:07:03'),
(6, 3, '2025-04-06 08:48:22', 80, 'pending', '2025-04-06 00:48:22', '2025-04-06 00:48:22'),
(7, 3, '2025-04-06 10:10:46', 14, 'pending', '2025-04-06 02:10:46', '2025-04-06 02:10:46'),
(8, 3, '2025-04-06 10:13:26', 10, 'pending', '2025-04-06 02:13:26', '2025-04-06 02:13:26'),
(9, 3, '2025-04-06 10:16:29', 16, 'pending', '2025-04-06 02:16:29', '2025-04-06 02:16:29'),
(10, 3, '2025-04-06 10:16:50', 16, 'completed', '2025-04-06 02:16:50', '2025-04-06 22:04:49'),
(11, 4, '2025-04-07 06:06:24', 25, 'for_confirm', '2025-04-06 22:06:24', '2025-04-06 22:14:09'),
(12, 4, '2025-04-07 06:07:28', 40, 'pending', '2025-04-06 22:07:28', '2025-04-06 22:07:28'),
(14, 4, '2025-04-07 06:21:33', 10, 'pending', '2025-04-06 22:21:33', '2025-04-06 22:21:33'),
(15, 4, '2025-04-07 06:21:38', 10, 'pending', '2025-04-06 22:21:38', '2025-04-06 22:21:38'),
(16, 4, '2025-04-07 06:21:44', 10, 'pending', '2025-04-06 22:21:44', '2025-04-06 22:21:44'),
(17, 5, '2025-04-07 06:56:15', 318, 'completed', '2025-04-06 22:56:15', '2025-04-06 22:57:17');

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `review_id` bigint(20) UNSIGNED NOT NULL,
  `account_id` bigint(20) UNSIGNED NOT NULL,
  `item_id` bigint(20) UNSIGNED NOT NULL,
  `comment` text NOT NULL,
  `rating` int(11) NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`review_id`, `account_id`, `item_id`, `comment`, `rating`, `create_at`, `update_at`, `created_at`, `updated_at`) VALUES
(1, 2, 1, 'Doesn\'t perform as promised. Save your money.', 1, '2025-03-02 17:51:15', '2025-03-02 17:51:15', '2025-03-02 17:51:15', '2025-03-02 17:51:15'),
(2, 1, 1, 'This is exactly what I was looking for. Perfect for my setup.', 5, '2024-11-20 17:51:15', '2024-11-20 17:51:15', '2024-11-20 17:51:15', '2024-11-20 17:51:15'),
(3, 1, 1, 'Acceptable performance with some limitations.', 3, '2025-02-18 17:51:15', '2025-02-18 17:51:15', '2025-02-18 17:51:15', '2025-02-18 17:51:15'),
(4, 1, 1, 'Amazing build quality and works flawlessly. Very impressed!', 4, '2025-01-29 17:51:15', '2025-01-29 17:51:15', '2025-01-29 17:51:15', '2025-01-29 17:51:15'),
(5, 1, 2, 'Some pros and cons, but overall a satisfactory purchase.', 2, '2024-12-23 17:51:15', '2024-12-23 17:51:15', '2024-12-23 17:51:15', '2024-12-23 17:51:15'),
(6, 2, 2, 'Best purchase I\'ve made this year. Absolutely no regrets!', 4, '2025-03-01 17:51:15', '2025-03-01 17:51:15', '2025-03-01 17:51:15', '2025-03-01 17:51:15'),
(7, 2, 2, 'Some pros and cons, but overall a satisfactory purchase.', 3, '2025-01-23 17:51:15', '2025-01-23 17:51:15', '2025-01-23 17:51:15', '2025-01-23 17:51:15'),
(8, 2, 2, 'Reasonable quality for the price point. Gets the job done.', 2, '2024-11-09 17:51:15', '2024-11-09 17:51:15', '2024-11-09 17:51:15', '2024-11-09 17:51:15'),
(9, 1, 2, 'Overpriced for what it offers. Look elsewhere.', 1, '2024-12-09 17:51:15', '2024-12-09 17:51:15', '2024-12-09 17:51:15', '2024-12-09 17:51:15'),
(10, 1, 3, 'Exceptional product that delivers on all its promises.', 5, '2024-12-11 17:51:15', '2024-12-11 17:51:15', '2024-12-11 17:51:15', '2024-12-11 17:51:15'),
(11, 2, 3, 'Had issues right from the start. Would not recommend.', 1, '2025-02-23 17:51:15', '2025-02-23 17:51:15', '2025-02-23 17:51:15', '2025-02-23 17:51:15'),
(12, 1, 3, 'Easy to set up and works as advertised. Very happy with my purchase.', 4, '2024-11-05 17:51:15', '2024-11-05 17:51:15', '2024-11-05 17:51:15', '2024-11-05 17:51:15'),
(13, 2, 3, 'Overpriced for what it offers. Look elsewhere.', 1, '2025-04-03 17:51:15', '2025-04-03 17:51:15', '2025-04-03 17:51:15', '2025-04-03 17:51:15'),
(14, 1, 3, 'This is exactly what I was looking for. Perfect for my setup.', 5, '2025-01-04 17:51:15', '2025-01-04 17:51:15', '2025-01-04 17:51:15', '2025-01-04 17:51:15'),
(15, 1, 4, 'This is exactly what I was looking for. Perfect for my setup.', 5, '2025-03-20 17:51:15', '2025-03-20 17:51:15', '2025-03-20 17:51:15', '2025-03-20 17:51:15'),
(16, 2, 5, 'Acceptable performance with some limitations.', 3, '2024-11-18 17:51:15', '2024-11-18 17:51:15', '2024-11-18 17:51:15', '2024-11-18 17:51:15'),
(17, 1, 5, 'Best purchase I\'ve made this year. Absolutely no regrets!', 4, '2025-02-18 17:51:15', '2025-02-18 17:51:15', '2025-02-18 17:51:15', '2025-02-18 17:51:15'),
(18, 2, 5, 'Does the job but nothing extraordinary. Fair value.', 3, '2025-01-05 17:51:15', '2025-01-05 17:51:15', '2025-01-05 17:51:15', '2025-01-05 17:51:15'),
(19, 2, 5, 'Great value for money. Would definitely recommend to others.', 5, '2025-03-22 17:51:15', '2025-03-22 17:51:15', '2025-03-22 17:51:15', '2025-03-22 17:51:15'),
(20, 2, 6, 'Expected better performance for the cost. Rather underwhelming.', 1, '2025-01-14 17:51:15', '2025-01-14 17:51:15', '2025-01-14 17:51:15', '2025-01-14 17:51:15'),
(21, 1, 6, 'This is exactly what I was looking for. Perfect for my setup.', 5, '2025-01-03 17:51:15', '2025-01-03 17:51:15', '2025-01-03 17:51:15', '2025-01-03 17:51:15'),
(22, 2, 7, 'Best purchase I\'ve made this year. Absolutely no regrets!', 4, '2025-03-01 17:51:15', '2025-03-01 17:51:15', '2025-03-01 17:51:15', '2025-03-01 17:51:15'),
(23, 1, 8, 'Best purchase I\'ve made this year. Absolutely no regrets!', 4, '2024-12-29 17:51:15', '2024-12-29 17:51:15', '2024-12-29 17:51:15', '2024-12-29 17:51:15'),
(24, 1, 8, 'This is exactly what I was looking for. Perfect for my setup.', 5, '2025-03-01 17:51:15', '2025-03-01 17:51:15', '2025-03-01 17:51:15', '2025-03-01 17:51:15'),
(25, 2, 9, 'Decent product for the price. Works as expected.', 2, '2024-11-16 17:51:15', '2024-11-16 17:51:15', '2024-11-16 17:51:15', '2024-11-16 17:51:15'),
(26, 1, 9, 'Decent product for the price. Works as expected.', 3, '2025-02-17 17:51:15', '2025-02-17 17:51:15', '2025-02-17 17:51:15', '2025-02-17 17:51:15'),
(27, 2, 9, 'Some pros and cons, but overall a satisfactory purchase.', 2, '2024-11-17 17:51:15', '2024-11-17 17:51:15', '2024-11-17 17:51:15', '2024-11-17 17:51:15'),
(28, 1, 9, 'The performance is outstanding, definitely worth the investment.', 4, '2025-04-02 17:51:15', '2025-04-02 17:51:15', '2025-04-02 17:51:15', '2025-04-02 17:51:15'),
(29, 2, 10, 'Disappointed with the quality. Not worth the price.', 1, '2025-03-23 17:51:15', '2025-03-23 17:51:15', '2025-03-23 17:51:15', '2025-03-23 17:51:15'),
(30, 2, 10, 'Does the job but nothing extraordinary. Fair value.', 3, '2025-04-01 17:51:15', '2025-04-01 17:51:15', '2025-04-01 17:51:15', '2025-04-01 17:51:15'),
(31, 1, 10, 'Absolutely love this product! Exceeded my expectations in every way.', 5, '2025-03-16 17:51:15', '2025-03-16 17:51:15', '2025-03-16 17:51:15', '2025-03-16 17:51:15'),
(32, 1, 11, 'Reasonable quality for the price point. Gets the job done.', 2, '2025-03-23 17:51:15', '2025-03-23 17:51:15', '2025-03-23 17:51:15', '2025-03-23 17:51:15'),
(33, 1, 11, 'Some pros and cons, but overall a satisfactory purchase.', 2, '2024-11-26 17:51:15', '2024-11-26 17:51:15', '2024-11-26 17:51:15', '2024-11-26 17:51:15'),
(35, 1, 12, 'Best purchase I\'ve made this year. Absolutely no regrets!', 5, '2025-03-16 17:51:15', '2025-03-16 17:51:15', '2025-03-16 17:51:15', '2025-03-16 17:51:15'),
(36, 2, 12, 'Disappointed with the quality. Not worth the price.', 1, '2024-11-22 17:51:15', '2024-11-22 17:51:15', '2024-11-22 17:51:15', '2024-11-22 17:51:15'),
(37, 2, 12, 'The performance is outstanding, definitely worth the investment.', 4, '2024-11-11 17:51:15', '2024-11-11 17:51:15', '2024-11-11 17:51:15', '2024-11-11 17:51:15'),
(38, 5, 16, 'Good product', 5, '2025-04-06 22:58:11', '2025-04-06 22:58:11', '2025-04-06 22:58:11', '2025-04-06 22:58:11');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `age` tinyint(3) UNSIGNED DEFAULT NULL,
  `sex` enum('Male','Female') DEFAULT NULL,
  `phone_number` varchar(12) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `email_verified_at`, `password`, `age`, `sex`, `phone_number`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin', 'User', 'admin@techstore.com', '2025-04-05 17:50:54', '$2y$10$UbqQRVmiAvXe4QeDO10I8.Dh1dy3VBFegkw6WbzowlGyZJIMhlvvG', 30, 'Male', '1234567890', NULL, '2025-04-05 17:50:54', '2025-04-05 17:50:54'),
(2, 'Test', 'User', 'user@techstore.com', '2025-04-05 17:50:54', '$2y$10$9ou.fBiT99YOgk/NNX5ofu7acuWvWG8SB23cnwNWek3mae25yY7kS', 25, 'Female', '0987654321', NULL, '2025-04-05 17:50:54', '2025-04-05 17:50:54'),
(3, 'Vincent', 'Borja', 'nyseam14@gmail.com', '2025-04-05 18:09:56', '$2y$10$GNz59uHvR5y9DljW7u6pFe.D7p1CgkQYxuJH2Bz7jN6uZpH.m7xzO', 20, 'Male', '09277640406', 'uJG7SxsqAfCSZjL7W9SP4Z7A6vO8brcwxYiFtuD7K11JZhxbxt4MWiHxFOYP', '2025-04-05 18:09:16', '2025-04-06 20:26:20'),
(4, 'Lance', 'David', 'lancedavid3495@gmail.com', '2025-04-06 20:35:34', '$2y$10$4fh/K/B1dGVi6N1jQS1kHO9cplXTdBEwz4eoN125nHpsUxtuO/fJy', 20, 'Female', '09064819476', 'mxhJUkD8VvDPt7I0j3qXa09QGJmMsqHV3Ip15I1Mwr8ugwzdEeitHRlBu7NP', '2025-04-06 20:34:31', '2025-04-06 22:29:10'),
(5, 'Erol', 'Borja', 'ryllaen14@gmail.com', '2025-04-06 22:55:18', '$2y$10$g32qIYsDdpmutlgpetWgBe65PsP5u7244QSlj6KKhCkUP0tM0YQoy', 20, 'Male', '09074819476', NULL, '2025-04-06 22:54:37', '2025-04-06 22:55:18');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`account_id`),
  ADD UNIQUE KEY `accounts_username_unique` (`username`),
  ADD KEY `accounts_user_id_foreign` (`user_id`);

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`cart_id`),
  ADD KEY `carts_account_id_foreign` (`account_id`),
  ADD KEY `carts_item_id_foreign` (`item_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`group_id`);

--
-- Indexes for table `inventories`
--
ALTER TABLE `inventories`
  ADD PRIMARY KEY (`item_id`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`item_id`);

--
-- Indexes for table `item_groups`
--
ALTER TABLE `item_groups`
  ADD PRIMARY KEY (`group_id`,`item_id`),
  ADD KEY `item_groups_item_id_foreign` (`item_id`);

--
-- Indexes for table `item_images`
--
ALTER TABLE `item_images`
  ADD PRIMARY KEY (`image_id`),
  ADD KEY `item_images_item_id_foreign` (`item_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orderinfos`
--
ALTER TABLE `orderinfos`
  ADD PRIMARY KEY (`orderinfo_id`),
  ADD KEY `orderinfos_order_id_foreign` (`order_id`),
  ADD KEY `orderinfos_item_id_foreign` (`item_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `orders_account_id_foreign` (`account_id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD KEY `password_resets_email_index` (`email`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `reviews_account_id_foreign` (`account_id`),
  ADD KEY `reviews_item_id_foreign` (`item_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `users_phone_number_unique` (`phone_number`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `account_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `cart_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `groups`
--
ALTER TABLE `groups`
  MODIFY `group_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `item_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `item_images`
--
ALTER TABLE `item_images`
  MODIFY `image_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `orderinfos`
--
ALTER TABLE `orderinfos`
  MODIFY `orderinfo_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accounts`
--
ALTER TABLE `accounts`
  ADD CONSTRAINT `accounts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_account_id_foreign` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `carts_item_id_foreign` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE CASCADE;

--
-- Constraints for table `inventories`
--
ALTER TABLE `inventories`
  ADD CONSTRAINT `inventories_item_id_foreign` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE CASCADE;

--
-- Constraints for table `item_groups`
--
ALTER TABLE `item_groups`
  ADD CONSTRAINT `item_groups_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `item_groups_item_id_foreign` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE CASCADE;

--
-- Constraints for table `item_images`
--
ALTER TABLE `item_images`
  ADD CONSTRAINT `item_images_item_id_foreign` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE CASCADE;

--
-- Constraints for table `orderinfos`
--
ALTER TABLE `orderinfos`
  ADD CONSTRAINT `orderinfos_item_id_foreign` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `orderinfos_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_account_id_foreign` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_account_id_foreign` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_item_id_foreign` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
