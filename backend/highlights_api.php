<?php
// backend/highlights_api.php
require 'db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

// GET: Fetch All Highlights
if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM highlights ORDER BY created_at DESC");
        $highlights = $stmt->fetchAll();
        echo json_encode($highlights);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit();
}

// POST: Create New Highlight
if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    try {
        $stmt = $pdo->prepare("INSERT INTO highlights (title, description, icon, date) VALUES (?, ?, ?, ?)");
        $stmt->execute([
            $input['title'],
            $input['description'],
            $input['icon'],
            $input['date']
        ]);
        echo json_encode(['status' => 'success', 'id' => $pdo->lastInsertId()]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
    exit();
}

// PUT: Update Existing Highlight
if ($method === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['id'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Missing Highlight ID']);
        exit();
    }

    try {
        $stmt = $pdo->prepare("UPDATE highlights SET title=?, description=?, icon=?, date=? WHERE id=?");
        $result = $stmt->execute([
            $input['title'],
            $input['description'],
            $input['icon'],
            $input['date'],
            $input['id']
        ]);

        if ($result) {
            echo json_encode(['status' => 'success']);
        } else {
            throw new Exception("Update failed execution");
        }

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
    exit();
}

// DELETE: Delete Highlight
if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if ($id) {
        try {
            $stmt = $pdo->prepare("DELETE FROM highlights WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['status' => 'success']);
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
    exit();
}
?>