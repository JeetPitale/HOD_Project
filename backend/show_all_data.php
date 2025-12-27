<?php
require 'db_connect.php';

header('Content-Type: application/json');

$data = [];

try {
    // 1. Contacts
    $stmt = $pdo->query("SELECT * FROM contacts");
    $data['contacts'] = $stmt->fetchAll();

    // 2. Blog Posts
    $stmt = $pdo->query("SELECT id, title, category, likes, dislikes FROM blog_posts");
    $data['blog_posts'] = $stmt->fetchAll();

    // 3. Blog Comments
    $stmt = $pdo->query("SELECT * FROM blog_comments");
    $data['blog_comments'] = $stmt->fetchAll();

    // 4. About Data (Just checking if it exists, not dumping the huge JSON)
    $stmt = $pdo->query("SELECT id, LEFT(data, 50) as data_preview FROM about_data");
    $data['about_data'] = $stmt->fetchAll();

    echo json_encode($data, JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>