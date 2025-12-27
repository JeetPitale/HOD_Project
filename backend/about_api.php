<?php
// backend/about_api.php
require 'db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

// GET: Fetch About Data
if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT data FROM about_data WHERE id = 1");
        $row = $stmt->fetch();

        if ($row) {
            echo $row['data']; // Output raw JSON
        } else {
            echo json_encode(['error' => 'No data found']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit();
}

// POST: Save About Data
if ($method === 'POST') {
    $input = file_get_contents('php://input');

    // Simple validation: Ensure it is valid JSON
    if (!json_decode($input)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid JSON']);
        exit();
    }

    try {
        $stmt = $pdo->prepare("UPDATE about_data SET data = ? WHERE id = 1");
        $stmt->execute([$input]);
        echo json_encode(['status' => 'success']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
    exit();
}
?>