<?php
class ProductModel
{
    private $conn;
    private $table_name = "product";

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function getProducts()
    {
        $query = "SELECT p.id, p.name, p.description, p.price, p.imageUrl, c.name as category_name
                  FROM " . $this->table_name . " p
                  LEFT JOIN category c ON p.category_id = c.id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    public function getProductById($id)
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_OBJ);
    }

    public function addProduct($name, $description, $price, $imageUrl, $category_id)
    {
        try {
            $query = "INSERT INTO " . $this->table_name . " (name, description, price, imageUrl, category_id)
                      VALUES (:name, :description, :price, :imageUrl, :category_id)";

            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':description', $description);
            $stmt->bindParam(':price', $price);
            $stmt->bindParam(':imageUrl', $imageUrl);
            $stmt->bindParam(':category_id', $category_id);

            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Database Error in addProduct: " . $e->getMessage());
            return false;
        }
    }
    public function updateProduct($id, $name, $description, $price, $imageUrl, $category_id)
    {
        $query = "UPDATE product SET name = ?, description = ?, price = ?, category_id = ?" .
            ($imageUrl ? ", imageUrl = ?" : "") .
            " WHERE id = ?";

        $params = [$name, $description, $price, $category_id];
        if ($imageUrl) {
            $params[] = $imageUrl;
        }
        $params[] = $id;

        $stmt = $this->conn->prepare($query);
        return $stmt->execute($params);
    }
    public function deleteProduct($id)
    {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function processImage($image)
    {
        if (empty($image) || !isset($image['tmp_name']) || $image['tmp_name'] === '') {
            throw new Exception('No file uploaded.');
        }
    
        // Kiểm tra thư mục upload
        $uploadDir = 'app/public/uploads/';
        if (!is_dir($uploadDir)) {
            if (!mkdir($uploadDir, 0777, true) && !is_dir($uploadDir)) {
                throw new Exception('Failed to create upload directory.');
            }
        }
    
        // Kiểm tra file hợp lệ
        $allowedTypes = ['image/jpeg', 'image/png'];
        if (!in_array($image['type'], $allowedTypes)) {
            throw new Exception('Invalid file type. Only JPEG and PNG are allowed.');
        }
    
        // Tạo tên file duy nhất để tránh ghi đè
        $extension = pathinfo($image['name'], PATHINFO_EXTENSION);
        $fileName = uniqid('img_', true) . '.' . $extension;
    
        $targetFile = $uploadDir . $fileName;
    
        // Di chuyển file từ tmp đến thư mục upload
        if (!move_uploaded_file($image['tmp_name'], $targetFile)) {
            throw new Exception('Failed to upload file.');
        }
    
        return $fileName;
    }

    public function validateProductData($name, $description, $price, $image, $isImageRequired = true)
    {
        $errors = [];

        if (empty($name)) {
            $errors['name'] = 'Product name is required.';
        }
        if (empty($description)) {
            $errors['description'] = 'Description is required.';
        }
        if (!is_numeric($price) || $price <= 0) {
            $errors['price'] = 'Giá sản phẩm phải là một số hợp lệ và lớn hơn 0';
        }
        if ($isImageRequired && empty($image['tmp_name'])) {
            $errors['image'] = 'Image is required.';
        }

        return $errors;
    }
}
