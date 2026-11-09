-- Database Schema for WEAR YOUR BATTLES
CREATE DATABASE IF NOT EXISTS `wear_your_battles` 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `wear_your_battles`;

-- 1. Admin Users
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Series (e.g. SERIES 01 – THE GENTLE ARMOR™)
CREATE TABLE IF NOT EXISTS `series` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `tagline` VARCHAR(255) DEFAULT NULL,
  `description` TEXT,
  `cover_image` VARCHAR(500) NOT NULL,
  `status` ENUM('draft', 'published') NOT NULL DEFAULT 'published',
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_series_slug` (`slug`),
  INDEX `idx_series_status` (`status`)
) ENGINE=InnoDB;

-- 3. Chapters
CREATE TABLE IF NOT EXISTS `chapters` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `series_id` INT NOT NULL,
  `chapter_number` INT NOT NULL DEFAULT 1,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `subtitle` VARCHAR(255) DEFAULT NULL,
  `description` TEXT,
  `content` LONGTEXT,
  `cover_image` VARCHAR(500) NOT NULL,
  `secondary_image` VARCHAR(500) DEFAULT NULL,
  `design_philosophy` TEXT DEFAULT NULL,
  `sort_order` INT DEFAULT 0,
  `status` ENUM('draft', 'published') NOT NULL DEFAULT 'published',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`series_id`) REFERENCES `series`(`id`) ON DELETE CASCADE,
  INDEX `idx_chapters_slug` (`slug`),
  INDEX `idx_chapters_series` (`series_id`),
  INDEX `idx_chapters_status` (`status`),
  INDEX `idx_chapters_sort` (`sort_order`)
) ENGINE=InnoDB;

-- 4. Products
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `chapter_id` INT DEFAULT NULL,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `tagline` VARCHAR(255) DEFAULT NULL,
  `description` TEXT,
  `details` TEXT DEFAULT NULL,
  `composition` VARCHAR(255) DEFAULT '100% Heavyweight French Terry Cotton (320 GSM)',
  `care_instructions` VARCHAR(255) DEFAULT 'Hand wash cold or gentle cycle. Dry flat in shade. Do not tumble dry.',
  `price` DECIMAL(10,2) NOT NULL DEFAULT 1999.00,
  `stock` INT NOT NULL DEFAULT 60,
  `status` ENUM('draft', 'published') NOT NULL DEFAULT 'published',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`chapter_id`) REFERENCES `chapters`(`id`) ON DELETE SET NULL,
  INDEX `idx_products_slug` (`slug`),
  INDEX `idx_products_chapter` (`chapter_id`),
  INDEX `idx_products_status` (`status`)
) ENGINE=InnoDB;

-- 5. Product Images
CREATE TABLE IF NOT EXISTS `product_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `caption` VARCHAR(255) DEFAULT NULL,
  `is_primary` BOOLEAN NOT NULL DEFAULT FALSE,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  INDEX `idx_product_images_prod` (`product_id`)
) ENGINE=InnoDB;

-- 6. Product Sizes & Stock
CREATE TABLE IF NOT EXISTS `product_sizes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `size` VARCHAR(10) NOT NULL,
  `stock` INT NOT NULL DEFAULT 10,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `uniq_product_size` (`product_id`, `size`),
  INDEX `idx_product_sizes_prod` (`product_id`)
) ENGINE=InnoDB;

-- 7. Uploaded Media / Assets library
CREATE TABLE IF NOT EXISTS `media_library` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `original_name` VARCHAR(255) NOT NULL,
  `filename` VARCHAR(255) NOT NULL,
  `file_url` VARCHAR(500) NOT NULL,
  `mimetype` VARCHAR(100),
  `size_bytes` INT,
  `associated_entity` VARCHAR(50) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 8. Customer Orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_code` VARCHAR(50) NOT NULL UNIQUE,
  `customer_name` VARCHAR(150) NOT NULL,
  `customer_email` VARCHAR(150) NOT NULL,
  `customer_phone` VARCHAR(50) DEFAULT NULL,
  `shipping_address` TEXT NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `postal_code` VARCHAR(50) NOT NULL,
  `total_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `status` ENUM('confirmed', 'processing', 'dispatched', 'delivered') NOT NULL DEFAULT 'confirmed',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_orders_code` (`order_code`),
  INDEX `idx_orders_created` (`created_at`)
) ENGINE=InnoDB;

-- 9. Order Items
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `product_id` INT DEFAULT NULL,
  `product_name` VARCHAR(255) NOT NULL,
  `size` VARCHAR(10) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `unit_price` DECIMAL(10,2) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  INDEX `idx_order_items_order` (`order_id`)
) ENGINE=InnoDB;

