<?php
require_once('app/config/database.php');
require_once('app/models/ProductModel.php');
require_once('app/utils/JWTHandler.php');

class ProductApiController
{
    private $productModel;

    public function __construct()
    {
        $db = (new Database())->getConnection();
        $this->productModel = new ProductModel($db);
    }

    private function setCorsHeaders()
    {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            http_response_code(200);
            exit;
        }
    }

    public function index()
    {
        $this->setCorsHeaders();
        header('Content-Type: application/json');
        echo json_encode($this->productModel->getProducts());
    }

    public function getById($id)
    {
        $this->setCorsHeaders();
        header('Content-Type: application/json');

        $product = $this->productModel->getProductById($id);
        if ($product) {
            echo json_encode($product);
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Product not found']);
        }
    }

    public function create()
    {
        $this->setCorsHeaders();
        header('Content-Type: application/json');
        // $data = json_decode(file_get_contents('php://input'), true);
        if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['imageUrl'])) {
            // Lấy dữ liệu từ $_POST và $_FILES
            $name = $_POST['name'] ?? '';
            $description = $_POST['description'] ?? '';
            $price = $_POST['price'] ?? '';
            $category_id = $_POST['categoryId'] ?? null;
            $image = $_FILES['imageUrl'];

            // Kiểm tra dữ liệu đầu vào
            $errors = $this->productModel->validateProductData($name, $description, $price, $image);
            if (!empty($errors)) {
                http_response_code(400);
                echo json_encode(['message' => 'Validation errors', 'errors' => $errors]);
                return;
            }

            // Xử lý upload ảnh
            try {
                $imageUrl = $this->productModel->processImage($image);
            } catch (Exception $e) {
                http_response_code(400);
                echo json_encode(['message' => 'Error processing image: ' . $e->getMessage()]);
                return;
            }

            // Thêm sản phẩm vào database
            if ($this->productModel->addProduct($name, $description, $price, $imageUrl, $category_id)) {
                http_response_code(201);
                echo json_encode(['message' => 'Sản phẩm được thêm thành công']);
            } else {
                http_response_code(500);
                echo json_encode(['message' => 'Lỗi khi thêm sản phẩm']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'No form data received']);
        }
    }
    public function update($id)
    {
        
        $this->setCorsHeaders();
        header('Content-Type: application/json');

        $product = $this->productModel->getProductById($id);
        if (!$product) {
            http_response_code(404);
            echo json_encode(['message' => 'Product not found.']);
            return;
        }
        
        // Kiểm tra có file upload không
        $image = $_FILES['imageUrl'] ?? null;

        // Kiểm tra JSON payload
        $data = json_decode(file_get_contents('php://input'), true);

        if (!$data && !$image) {
            http_response_code(400);
            echo json_encode(['message' => 'Invalid request: No data provided.']);
            return;
        }

        // Lấy dữ liệu từ JSON payload
        $name = $data['name'] ?? '';
        $description = $data['description'] ?? '';
        $price = $data['price'] ?? '';
        $category_id = $data['category_id'] ?? null;
       

        try {
            $imageUrl = $this->productModel->processImage($image);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['message' => 'Error processing image: ' . $e->getMessage()]);
            return;
        }
        // Xử lý logic cập nhật sản phẩm
        try {
            // Gọi model để cập nhật sản phẩm
            $result = $this->productModel->updateProduct($id, $name, $description, $price, $imageUrl, $category_id);

            if ($result === true) {
                echo json_encode(['message' => 'Product updated successfully']);
            } else {
                http_response_code(400);
                echo json_encode(['message' => 'Product update failed']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['message' => 'Error: ' . $e->getMessage()]);
        }
    }
    
    // Xóa sản phẩm theo ID
    public function delete($id)
    {
        $this->setCorsHeaders();
        header('Content-Type: application/json');

        try {
            $result = $this->productModel->deleteProduct($id);
            if ($result) {
                echo json_encode(['message' => 'Product deleted successfully']);
            } else {
                http_response_code(400);
                echo json_encode(['message' => 'Product deletion failed']);
            }
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['message' => $e->getMessage()]);
        }
    }
}
