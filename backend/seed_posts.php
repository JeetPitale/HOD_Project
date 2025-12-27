<?php
require 'db_connect.php';

try {
    // 1. Check if posts exist
    $check = $pdo->query("SELECT COUNT(*) FROM blog_posts WHERE id IN (1, 2)");
    if ($check->fetchColumn() > 0) {
        echo json_encode(["status" => "skipped", "message" => "Posts already exist."]);
        exit;
    }

    // 2. Insert if not
    $sql = "INSERT INTO blog_posts (id, title, category, image, content, full_content, likes, dislikes) VALUES 
    (1, 'The Future of Digital Learning', 'Education', 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1200&q=80', 'Digital learning is transforming education...', '<p>Digital learning is transforming education by making it more accessible, personalized, and engaging.</p><p>With the integration of AI and data-driven tools, learning experiences can now adapt to individual student needs.</p>', 0, 0),
    (2, 'AI in Modern Education', 'Technology', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80', 'Artificial Intelligence is reshaping classrooms...', '<p>AI is no longer a futuristic concept; it is actively transforming modern education.</p><p>From intelligent tutoring systems to automated assessment, AI empowers educators and learners alike.</p>', 0, 0)";

    $pdo->exec($sql);
    echo json_encode(["status" => "success", "message" => "Default posts inserted successfully!"]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>