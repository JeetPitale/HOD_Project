<?php
// backend/blog_api.php
require 'db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

// GET: Fetch All Posts
if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM blog_posts ORDER BY created_at DESC");
        $posts = $stmt->fetchAll();
        echo json_encode($posts);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit();
}

// POST: Create New Post OR Update Reaction
$input = json_decode(file_get_contents('php://input'), true);

if ($method === 'POST') {
    // Check if it's a reaction update (Toggle Like/Dislike)
    if (isset($input['action']) && isset($input['id'])) {
        $id = $input['id'];
        $action = $input['action']; // 'like' or 'dislike' OR 'update_counts'

        if ($action === 'update_counts') {
            try {
                $stmt = $pdo->prepare("UPDATE blog_posts SET likes = ?, dislikes = ? WHERE id = ?");
                $stmt->execute([$input['likes'], $input['dislikes'], $id]);
                echo json_encode(['status' => 'success']);
            } catch (PDOException $e) {
                echo json_encode(['error' => $e->getMessage()]);
            }
            exit();
        }
    }

    // Normal Create Post
    try {
        $stmt = $pdo->prepare("INSERT INTO blog_posts (title, category, image, content, full_content) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            $input['title'],
            $input['category'],
            $input['image'] ?? '',
            $input['content'],
            $input['fullContent']
        ]);
        echo json_encode(['status' => 'success', 'id' => $pdo->lastInsertId()]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
    exit();
}

// PUT: Update Existing Post
if ($method === 'PUT') {
    if (!isset($input['id'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Missing Post ID']);
        exit();
    }

    try {
        $stmt = $pdo->prepare("UPDATE blog_posts SET title=?, category=?, image=?, content=?, full_content=? WHERE id=?");
        $result = $stmt->execute([
            $input['title'],
            $input['category'],
            $input['image'] ?? '',
            $input['content'],
            $input['fullContent'],
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

// DELETE: Delete Post
if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if ($id) {
        try {
            $stmt = $pdo->prepare("DELETE FROM blog_posts WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['status' => 'success']);
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
    exit();
}
?>