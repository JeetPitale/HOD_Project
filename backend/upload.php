<?php
// backend/upload.php
require 'db_connect.php';

$target_dir = "uploads/";
$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
$host = $_SERVER['HTTP_HOST'];
// Adjust path based on where this script is relative to root
// Assuming backend/ is accessed via localhost:8000/
$baseUrl = "$protocol://$host/uploads/";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['file'])) {
        $file = $_FILES['file'];
        $fileName = basename($file['name']);
        $fileType = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        // 1. Validate Type
        $allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        if (!in_array($fileType, $allowedTypes)) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid file type. Only JPG, PNG, GIF, & WEBP allowed.']);
            exit();
        }

        // 2. Validate Size (Max 5MB)
        if ($file['size'] > 5 * 1024 * 1024) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'File too large. Max 5MB.']);
            exit();
        }

        // 3. Generate Unique Name
        $newFileName = uniqid('img_', true) . '.' . $fileType;
        $targetFilePath = $target_dir . $newFileName;

        // 4. Move File
        if (move_uploaded_file($file['tmp_name'], $targetFilePath)) {
            echo json_encode([
                'status' => 'success',
                'url' => $baseUrl . $newFileName
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Failed to move uploaded file.']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'No file uploaded.']);
    }
    exit();
}
?>