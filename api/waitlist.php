<?php
/**
 * Waitlist API Endpoint
 * Handles email submissions for the Kenz Tasks waitlist
 */

// Set headers for CORS and JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!$input || !isset($input['email'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email is required']);
    exit();
}

$email = filter_var(trim($input['email']), FILTER_SANITIZE_EMAIL);

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit();
}

// Configuration
$csvFile = '../data/waitlist.csv';
$maxFileSize = 10 * 1024 * 1024; // 10MB limit

try {
    // Create data directory if it doesn't exist
    $dataDir = dirname($csvFile);
    if (!is_dir($dataDir)) {
        mkdir($dataDir, 0755, true);
    }

    // Check if email already exists
    if (file_exists($csvFile)) {
        $existingEmails = array_map('str_getcsv', file($csvFile));
        foreach ($existingEmails as $row) {
            if (isset($row[0]) && $row[0] === $email) {
                echo json_encode([
                    'success' => true,
                    'message' => 'You\'re already on the waitlist! We\'ll notify you when Kenz Tasks launches.',
                    'alreadyExists' => true
                ]);
                exit();
            }
        }
        
        // Check file size
        if (filesize($csvFile) > $maxFileSize) {
            error_log('Waitlist CSV file size exceeded limit');
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Service temporarily unavailable']);
            exit();
        }
    }

    // Prepare data
    $timestamp = date('Y-m-d H:i:s');
    $source = isset($input['source']) ? $input['source'] : 'landing_page';
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
    $ipAddress = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '';
    
    // Sanitize IP address (remove potential multiple IPs)
    $ipAddress = explode(',', $ipAddress)[0];
    $ipAddress = filter_var(trim($ipAddress), FILTER_VALIDATE_IP) ? trim($ipAddress) : 'unknown';

    // Create CSV row
    $csvRow = [
        $email,
        $timestamp,
        $source,
        $ipAddress,
        substr($userAgent, 0, 200) // Limit user agent length
    ];

    // Write to CSV file
    $file = fopen($csvFile, 'a');
    if (!$file) {
        throw new Exception('Unable to open waitlist file');
    }

    // Add header if file is empty
    if (filesize($csvFile) === 0) {
        fputcsv($file, ['email', 'timestamp', 'source', 'ip_address', 'user_agent']);
    }

    if (!fputcsv($file, $csvRow)) {
        throw new Exception('Unable to write to waitlist file');
    }

    fclose($file);

    // Get current waitlist position (approximate)
    $waitlistCount = 0;
    if (file_exists($csvFile)) {
        $lines = file($csvFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        $waitlistCount = max(0, count($lines) - 1); // Subtract header row
    }

    // Log successful submission
    error_log("Waitlist signup: {$email} from {$ipAddress}");

    // Send success response
    echo json_encode([
        'success' => true,
        'message' => 'Welcome to the waitlist! We\'ll notify you when Kenz Tasks launches.',
        'waitlistPosition' => $waitlistCount,
        'timestamp' => $timestamp
    ]);

} catch (Exception $e) {
    error_log('Waitlist API error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Something went wrong. Please try again later.'
    ]);
}

// Optional: Send notification email to admin
function notifyAdmin($email) {
    $adminEmail = 'admin@kenztasks.com'; // Change this to your admin email
    $subject = 'New Waitlist Signup - Kenz Tasks';
    $message = "New waitlist signup:\n\nEmail: {$email}\nTime: " . date('Y-m-d H:i:s') . "\nIP: " . ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
    
    // Only send if mail function is available and admin email is set
    if (function_exists('mail') && filter_var($adminEmail, FILTER_VALIDATE_EMAIL)) {
        @mail($adminEmail, $subject, $message);
    }
}

// Uncomment the line below to enable admin notifications
// notifyAdmin($email);
?>