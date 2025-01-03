<?php

class UploadService
{
    private $uploadDir;

    public function __construct($uploadDir = 'uploads/')
    {
        $this->uploadDir = $uploadDir;

        // Tạo thư mục nếu chưa tồn tại
        if (!is_dir($this->uploadDir)) {
            mkdir($this->uploadDir, 0755, true);
        }
    }

    /**
     * Xử lý upload ảnh
     * @param array $file - Tệp từ $_FILES
     * @return string|null - Trả về đường dẫn file hoặc null nếu thất bại
     * @throws Exception - Nếu xảy ra lỗi
     */
    public function uploadImage($file)
    {
        // Kiểm tra file hợp lệ
        if (!isset($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
            throw new Exception("Không tìm thấy tệp được tải lên.");
        }

        // Lấy thông tin file
        $fileName = basename($file['name']);
        $targetFilePath = $this->uploadDir . $this->generateUniqueFileName($fileName);

        // Di chuyển file đến thư mục đích
        if (move_uploaded_file($file['tmp_name'], $targetFilePath)) {
            return $targetFilePath; // Trả về đường dẫn file
        } else {
            throw new Exception("Không thể lưu tệp vào thư mục đích.");
        }
    }

    /**
     * Tạo tên file duy nhất để tránh trùng lặp
     * @param string $fileName
     * @return string
     */
    private function generateUniqueFileName($fileName)
    {
        $fileExtension = pathinfo($fileName, PATHINFO_EXTENSION);
        $uniqueName = uniqid('img_', true) . '.' . $fileExtension;
        return $uniqueName;
    }
}
