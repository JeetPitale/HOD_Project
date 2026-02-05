<?php
require 'db_connect.php';

try {
    // Check if column image already exists
    $stmt = $pdo->query("SHOW COLUMNS FROM `highlights` LIKE 'image'");
    if (!$stmt->fetch()) {
        $pdo->exec("ALTER TABLE `highlights` CHANGE `icon` `image` LONGTEXT");
        echo "Migration successful: icon column changed to image (LONGTEXT).";
    } else {
        echo "Migration skipped: image column already exists.";
    }
} catch (PDOException $e) {
    echo "Migration failed: " . $e->getMessage();
}
?>