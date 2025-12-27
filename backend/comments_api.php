<?php
// backend/comments_api.php
require 'db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

// GET: Fetch Comments
if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM blog_comments ORDER BY created_at ASC");
        $comments = $stmt->fetchAll();

        // Group by post_id via PHP to easier frontend consumption
        $grouped = [];
        foreach ($comments as $c) {
            $grouped[$c['post_id']][] = [
                'id' => $c['id'],
                'user' => $c['user_name'],
                'text' => $c['comment_text'],
                'date' => date('d/m/Y', strtotime($c['created_at']))
            ];
        }

        echo json_encode($grouped); // Returns object { post_id: [comments] }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit();
}

// POST: Add Comment
if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    try {
        $stmt = $pdo->prepare("INSERT INTO blog_comments (post_id, user_name, comment_text) VALUES (?, ?, ?)");
        $stmt->execute([
            $input['postId'],
            $input['user'],
            $input['text']
        ]);
        echo json_encode(['status' => 'success', 'id' => $pdo->lastInsertId()]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
    exit();
}

// DELETE: Delete Comment
if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if ($id) {
        try {
            $stmt = $pdo->prepare("DELETE FROM blog_comments WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['status' => 'success']);
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
    exit();
}
?>