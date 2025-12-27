<?php
// TEMPORARY TEST FILE - Delete after testing
// Upload this to: public_html/backend/test_db.php

$host = 'localhost';
$db = 'vishalda1_project_db';
$user = 'vishalda1_phpma';
$pass = 'Vishal@2310';  // ← REPLACE WITH YOUR ACTUAL PASSWORD!

echo "<h2>Database Connection Test</h2>";
echo "<p>Testing connection to: <strong>$db</strong></p>";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    echo "<p style='color: green; font-weight: bold;'>✅ SUCCESS! Database connected!</p>";
    echo "<p>Host: $host</p>";
    echo "<p>Database: $db</p>";
    echo "<p>User: $user</p>";

    // Test if tables exist
    echo "<h3>Tables in database:</h3>";
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "<ul>";
    foreach ($tables as $table) {
        echo "<li>$table</li>";
    }
    echo "</ul>";

} catch (PDOException $e) {
    echo "<p style='color: red; font-weight: bold;'>❌ CONNECTION FAILED!</p>";
    echo "<p>Error: " . $e->getMessage() . "</p>";
    echo "<h3>Common fixes:</h3>";
    echo "<ul>";
    echo "<li>Check database name includes prefix (e.g., vishalda1_project_db)</li>";
    echo "<li>Check username includes prefix (e.g., vishalda1_user)</li>";
    echo "<li>Check password is correct (no extra spaces)</li>";
    echo "<li>Make sure user has privileges on this database</li>";
    echo "</ul>";
}
?>