<?php
// backend/ebooks_api.php
require 'db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];
header('Content-Type: application/json');

// GET: Fetch All Books
if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM ebooks ORDER BY created_at DESC");
        $books = $stmt->fetchAll();
        echo json_encode($books);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit();
}

// POST: Create New Book
if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    try {
        $stmt = $pdo->prepare("INSERT INTO ebooks (title, description, full_description, image, tag, link) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $input['title'],
            $input['description'],
            $input['fullDescription'],
            $input['image'] ?? '',
            $input['tag'],
            $input['link']
        ]);
        echo json_encode(['status' => 'success', 'id' => $pdo->lastInsertId()]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
    exit();
}

// PUT: Update Existing Book
if ($method === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['id'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Missing Book ID']);
        exit();
    }

    try {
        $stmt = $pdo->prepare("UPDATE ebooks SET title=?, description=?, full_description=?, image=?, tag=?, link=? WHERE id=?");
        $result = $stmt->execute([
            $input['title'],
            $input['description'],
            $input['fullDescription'],
            $input['image'] ?? '',
            $input['tag'],
            $input['link'],
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

// DELETE: Delete Book
if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if ($id) {
        try {
            $stmt = $pdo->prepare("DELETE FROM ebooks WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['status' => 'success']);
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
    exit();
}
?>