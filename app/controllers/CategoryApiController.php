<?php
require_once('app/config/database.php');
require_once('app/models/CategoryModel.php');
class CategoryApiController
{
    private $categoryModel;
    private $db;
    public function __construct()
    {
        $this->db = (new Database())->getConnection();
        $this->categoryModel = new CategoryModel($this->db);
    }
    private function setCorsHeaders()
    {
        header("Access-Control-Allow-Origin: *"); // Cho phép tất cả các domain, có thể thay bằng một domain cụ thể
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); // Các phương thức HTTP được phép
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With"); // Các header được phép

        // Nếu là phương thức OPTIONS (pre-flight), trả về 200 OK
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            http_response_code(200);
            exit;
        }
    }
    // Lấy danh sách danh mục
    public function index()
    {
        $this->setCorsHeaders();
        header('Content-Type: application/json');
        $categories = $this->categoryModel->getCategories();
        echo json_encode($categories);
    }
    public function create()
    {
        $this->setCorsHeaders();
        header('Content-Type: application/json');

        // Lấy dữ liệu từ body của request
        $data = json_decode(file_get_contents('php://input'), true);

        // Kiểm tra nếu dữ liệu không hợp lệ
        if (!isset($data['name']) || !isset($data['description'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Thiếu thông tin cần thiết']);
            return;
        }

        $name = $data['name'];
        $description = $data['description'];

        // Gọi phương thức thêm danh mục từ model
        $result = $this->categoryModel->addCategory($name, $description);

        // Nếu thêm thành công
        if ($result === true) {
            http_response_code(201); // Trả về mã HTTP 201 - Created
            echo json_encode(['message' => 'Danh mục được thêm thành công']);
        } elseif (is_array($result)) {
            // Nếu có lỗi từ phía validate
            http_response_code(400); // Trả về mã HTTP 400 - Bad Request
            echo json_encode(['errors' => $result]);
        } else {
            // Nếu có lỗi từ phía server
            http_response_code(500); // Trả về mã HTTP 500 - Internal Server Error
            echo json_encode(['message' => 'Đã xảy ra lỗi, vui lòng thử lại']);
        }
    }
    public function getById($id)
    {
        $this->setCorsHeaders();
        header('Content-Type: application/json');
        $category = $this->categoryModel->getCategoryById($id);

        if ($category) {
            echo json_encode($category);
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Danh mục không tồn tại']);
        }
    }
    public function update($id)
    {
        $this->setCorsHeaders();
        header('Content-Type: application/json');
        $data = json_decode(file_get_contents('php://input'), true);

        if (!isset($data['name']) || !isset($data['description'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Thiếu thông tin cần thiết']);
            return;
        }

        $name = $data['name'];
        $description = $data['description'];

        $result = $this->categoryModel->updateCategory($id, $name, $description);

        if ($result === true) {
            http_response_code(200);
            echo json_encode(['message' => 'Danh mục được sửa thành công']);
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Danh mục không tồn tại']);
        }
    }

    // Xóa danh mục
    public function delete($id)
    {
        $this->setCorsHeaders();
        header('Content-Type: application/json');

        // Gọi phương thức xóa danh mục từ model
        $result = $this->categoryModel->deleteCategory($id);

        // Nếu xóa thành công
        if ($result === true) {
            http_response_code(200); // Trả về mã HTTP 200 - OK
            echo json_encode(['message' => 'Danh mục được xóa thành công']);
        } else {
            // Nếu không tìm thấy danh mục hoặc có lỗi
            http_response_code(404); // Trả về mã HTTP 404 - Not Found
            echo json_encode(['message' => 'Danh mục không tồn tại']);
        }
    }
}
