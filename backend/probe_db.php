<?php
// Probe for local DB credentials
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

$credentials = [
    ['host' => '127.0.0.1', 'user' => 'root', 'pass' => ''],
    ['host' => 'localhost', 'user' => 'root', 'pass' => ''],
    ['host' => '127.0.0.1', 'user' => 'root', 'pass' => 'root'],
    ['host' => 'localhost', 'user' => 'root', 'pass' => 'root'],
    ['host' => '127.0.0.1:8889', 'user' => 'root', 'pass' => 'root'], // MAMP
];

echo "Probing Database Connections...\n";

foreach ($credentials as $cred) {
    try {
        $dsn = "mysql:host={$cred['host']}";
        $pdo = new PDO($dsn, $cred['user'], $cred['pass'], $options);
        echo "✅ Connected with Host: {$cred['host']}, User: {$cred['user']}, Pass: " . ($cred['pass'] ? '******' : '(empty)') . "\n";

        // Try to list databases
        try {
            $stmt = $pdo->query("SHOW DATABASES");
            $dbs = $stmt->fetchAll(PDO::FETCH_COLUMN);
            echo "   Databases: " . implode(", ", $dbs) . "\n";

            // Check for vishalda1_project_db
            if (in_array('vishalda1_project_db', $dbs)) {
                echo "   🎯 TARGET DATABASE FOUND!\n";
            } else {
                echo "   ⚠️ Target database 'vishalda1_project_db' NOT found. You might need to create it.\n";
            }
        } catch (Exception $e) {
            echo "   Could not list databases: " . $e->getMessage() . "\n";
        }

    } catch (PDOException $e) {
        echo "❌ Failed Host: {$cred['host']}, User: {$cred['user']} - " . $e->getMessage() . "\n";
    }
}
?>