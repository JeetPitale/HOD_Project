<?php
require 'db_connect.php';

try {
    $sql = "CREATE TABLE IF NOT EXISTS `highlights` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `title` varchar(255) NOT NULL,
      `description` text,
      `icon` varchar(50),
      `date` varchar(50),
      `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;";

    $pdo->exec($sql);
    echo "Migration successful: highlights table created or already exists.";
} catch (PDOException $e) {
    echo "Migration failed: " . $e->getMessage();
}
?>