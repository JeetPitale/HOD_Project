<?php
// save_contact.php
require 'db_connect.php';

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(['status' => 'error', 'message' => 'No data received']);
    exit();
}

$name = $input['name'] ?? '';
$email = $input['email'] ?? '';
$message = $input['message'] ?? '';

// Validate
if (empty($name) || empty($email)) {
    echo json_encode(['status' => 'error', 'message' => 'Name and Email are required']);
    exit();
}

try {
    // PREPARE SQL
    // Assuming a table named 'contacts' exists with columns: id, name, email, message, created_at
    // You must create this table in your database!
    $stmt = $pdo->prepare("INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)");
    $stmt->execute([$name, $email, $message]);

    echo json_encode(['status' => 'success', 'message' => 'Data saved successfully']);
} catch (PDOException $e) {
    // If table doesn't exist or other DB error
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage(),
        'hint' => 'Ensure the "contacts" table exists in your database.'
    ]);
}
?>