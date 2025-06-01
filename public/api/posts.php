<?php
header('Content-Type: application/json');

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Database configuration
$dbFile = '../data/posts.json';

// Create data directory if it doesn't exist
if (!file_exists('../data')) {
    mkdir('../data', 0777, true);
}

// Initialize database file if it doesn't exist
if (!file_exists($dbFile)) {
    file_put_contents($dbFile, json_encode([]));
}

// Get all posts
function getPosts() {
    global $dbFile;
    return json_decode(file_get_contents($dbFile), true) ?? [];
}

// Save posts
function savePosts($posts) {
    global $dbFile;
    file_put_contents($dbFile, json_encode($posts, JSON_PRETTY_PRINT));
}

// Handle different HTTP methods
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        echo json_encode(getPosts());
        break;

    case 'POST':
        $posts = getPosts();
        $post = [
            'id' => time(),
            'title' => $_POST['title'],
            'category' => $_POST['category'],
            'date' => $_POST['date'],
            'description' => $_POST['description']
        ];

        // Handle image upload
        if (isset($_FILES['image'])) {
            $image = $_FILES['image'];
            $imageName = time() . '_' . basename($image['name']);
            $uploadDir = '../uploads/';
            
            // Create uploads directory if it doesn't exist
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }
            
            if (move_uploaded_file($image['tmp_name'], $uploadDir . $imageName)) {
                $post['image'] = $imageName;
            }
        }

        $posts[] = $post;
        savePosts($posts);
        echo json_encode(['success' => true, 'post' => $post]);
        break;

    case 'PUT':
        parse_str(file_get_contents("php://input"), $_PUT);
        $posts = getPosts();
        $id = $_PUT['id'];
        
        foreach ($posts as &$post) {
            if ($post['id'] == $id) {
                $post['title'] = $_PUT['title'];
                $post['category'] = $_PUT['category'];
                $post['date'] = $_PUT['date'];
                $post['description'] = $_PUT['description'];
                break;
            }
        }
        
        savePosts($posts);
        echo json_encode(['success' => true]);
        break;

    case 'DELETE':
        parse_str(file_get_contents("php://input"), $_DELETE);
        $posts = getPosts();
        $id = $_DELETE['id'];
        
        $posts = array_filter($posts, function($post) use ($id) {
            return $post['id'] != $id;
        });
        
        savePosts($posts);
        echo json_encode(['success' => true]);
        break;
}
?> 