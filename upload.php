<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$uploadDir = __DIR__ . '/uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

if (!isset($_FILES['file'])) {
    echo json_encode(['success' => false, 'error' => 'Không tìm thấy file tải lên']);
    exit();
}

$file = $_FILES['file'];
if ($file['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['success' => false, 'error' => 'Lỗi khi upload: ' . $file['error']]);
    exit();
}

// Giới hạn 25MB
if ($file['size'] > 25 * 1024 * 1024) {
    echo json_encode(['success' => false, 'error' => 'File vượt quá kích thước 25MB']);
    exit();
}

$originalName = pathinfo($file['name'], PATHINFO_FILENAME);
$extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

// Làm sạch tên file tiếng Việt
$cleanName = preg_replace('/[^a-zA-Z0-9_-]/', '_', $originalName);
$fileName = time() . '_' . substr($cleanName, 0, 30) . '.' . $extension;
$targetPath = $uploadDir . $fileName;

if (move_uploaded_file($file['tmp_name'], $targetPath)) {
    echo json_encode([
        'success' => true,
        'fileName' => $file['name'],
        'storedName' => $fileName,
        'fileUrl' => 'uploads/' . $fileName,
        'fileSize' => $file['size'],
        'uploadTime' => date('d/m/Y H:i')
    ]);
} else {
    echo json_encode(['success' => false, 'error' => 'Không thể lưu file vào thư mục uploads']);
}
