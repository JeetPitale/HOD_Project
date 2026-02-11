<?php
// db_connect.php

// CORS Headers to allow React (localhost:5173) to talk to this PHP script
header("Access-Control-Allow-Origin: *"); // For development, allow all. In production, specify domain.
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight OPTIONS request
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Production Database Credentials for MilesWeb
// Detect Environment
$isLocal = in_array($_SERVER['HTTP_HOST'] ?? '', ['localhost:8000', '127.0.0.1:8000', 'localhost', '127.0.0.1']) || php_sapi_name() === 'cli';

$host = $isLocal ? '127.0.0.1' : 'localhost';
$db = 'vishalda1_project_db';
$charset = 'utf8mb4';

if ($isLocal) {
    // Local Credentials (XAMPP/MAMP/Default)
    $user = 'root';
    $pass = '';
} else {
    // Production Credentials for MilesWeb
    $user = 'vishalda1_website';
    $pass = 'Root@12345';
}

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
    // echo "Connected successfully"; // Don't echo in production API, it breaks JSON
} catch (\PDOException $e) {
    // If connection fails, send a JSON error
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit();
}
?>