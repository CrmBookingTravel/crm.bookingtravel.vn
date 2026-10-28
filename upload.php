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
    mkdir($uploadDir, 0755, true);
}

// Bảo vệ thư mục uploads: Không cho phép thực thi mã PHP
$htaccessFile = $uploadDir . '.htaccess';
if (!file_exists($htaccessFile)) {
    file_put_contents($htaccessFile, "<FilesMatch \"\\.(php|phtml|php3|php4|php5|php7|phps|cgi|pl|py|sh)$\">\n    Deny from all\n</FilesMatch>\nOptions -Indexes\n");
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

// Giới hạn kích thước tối đa 25MB
if ($file['size'] > 25 * 1024 * 1024) {
    echo json_encode(['success' => false, 'error' => 'File vượt quá kích thước tối đa 25MB']);
    exit();
}

$originalName = pathinfo($file['name'], PATHINFO_FILENAME);
$extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

// Danh sách các định dạng file chứng từ an toàn cho phép
$allowedExtensions = ['pdf', 'png', 'jpg', 'jpeg', 'webp', 'xlsx', 'xls', 'docx', 'doc', 'csv', 'zip', 'rar', 'xml'];
if (!in_array($extension, $allowedExtensions)) {
    echo json_encode([
        'success' => false, 
        'error' => 'Định dạng file không an toàn. Chỉ cho phép: PDF, Ảnh (PNG, JPG, WEBP), Excel (XLSX, CSV), Word (DOCX), Hóa đơn XML, file nén (ZIP, RAR)'
    ]);
    exit();
}

// Làm sạch tên file, tránh ký tự lạ và đường dẫn tương đối
$cleanName = preg_replace('/[^a-zA-Z0-9_-]/', '_', $originalName);
$fileName = date('Ymd_His') . '_' . substr($cleanName, 0, 30) . '.' . $extension;
$targetPath = $uploadDir . $fileName;

if (move_uploaded_file($file['tmp_name'], $targetPath)) {
    echo json_encode([
        'success' => true,
        'fileName' => $file['name'],
        'storedName' => $fileName,
        'fileUrl' => 'uploads/' . $fileName,
        'fileSize' => $file['size'],
        'uploadTime' => date('d/m/Y H:i:s')
    ]);
} else {
    echo json_encode(['success' => false, 'error' => 'Không thể lưu file vào thư mục uploads trên máy chủ']);
}
