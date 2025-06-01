<?php
header('Content-Type: application/json');

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Simple Markdown parser
function parseMarkdown($text) {
    // Convert headers
    $text = preg_replace('/^# (.*$)/m', '<h1>$1</h1>', $text);
    $text = preg_replace('/^## (.*$)/m', '<h2>$1</h2>', $text);
    $text = preg_replace('/^### (.*$)/m', '<h3>$1</h3>', $text);
    
    // Convert bold
    $text = preg_replace('/\*\*(.*?)\*\*/s', '<strong>$1</strong>', $text);
    
    // Convert italic
    $text = preg_replace('/\*(.*?)\*/s', '<em>$1</em>', $text);
    
    // Convert links
    $text = preg_replace('/\[(.*?)\]\((.*?)\)/s', '<a href="$2">$1</a>', $text);
    
    // Convert lists
    $text = preg_replace('/^\* (.*$)/m', '<li>$1</li>', $text);
    $text = preg_replace('/(<li>.*<\/li>)/s', '<ul>$1</ul>', $text);
    
    // Convert paragraphs
    $text = '<p>' . str_replace("\n\n", '</p><p>', $text) . '</p>';
    
    return $text;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (isset($input['markdown'])) {
        $html = parseMarkdown($input['markdown']);
        echo json_encode(['html' => $html]);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'No markdown content provided']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?> 