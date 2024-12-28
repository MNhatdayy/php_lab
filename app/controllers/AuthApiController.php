<?php
require_once('app/config/database.php');
require_once('app/models/UserModel.php');

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthApiController
{
    private $userModel;
    private $db;
    private $secretKey = "nhat30112003";
    public function __construct()
    {
        $this->db = (new Database())->getConnection();
        $this->userModel = new UserModel($this->db);
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
    // Đăng ký người dùng mới
    public function register()
    {
        $this->setCorsHeaders();

        header('Content-Type: application/json');

        // Lấy dữ liệu từ body của request
        $data = json_decode(file_get_contents('php://input'), true);

        // Kiểm tra nếu dữ liệu không hợp lệ
        if (!isset($data['name']) || !isset($data['email']) || !isset($data['password']) || !isset($data['phone']) || !isset($data['role'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Thiếu thông tin cần thiết']);
            return;
        }

        $name = $data['name'];
        $email = $data['email'];
        $phone = $data['phone'];
        $role = $data['role'];
        $password = $data['password'];

        // Gọi phương thức thêm người dùng từ model
        $result = $this->userModel->addUser($name, $email, $password, $phone, $role);

        // Nếu thêm thành công
        if ($result === true) {
            http_response_code(201); // Trả về mã HTTP 201 - Created
            echo json_encode(['message' => 'Người dùng được đăng ký thành công']);
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

    // Đăng nhập người dùng
    public function login()
    {
        $this->setCorsHeaders();
        header('Content-Type: application/json');

        // Lấy dữ liệu từ body của request
        $data = json_decode(file_get_contents('php://input'), true);
        // Kiểm tra nếu dữ liệu không hợp lệ
        if (!isset($data['email']) || !isset($data['password'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Thiếu thông tin cần thiết']);
            return;
        }

        $email = $data['email'];
        $password = $data['password'];

        // Gọi phương thức lấy người dùng từ model
        $user = $this->userModel->getUserByEmail($email);
        if ($user && password_verify($password, $user['password'])) {
            $tokenInfo = [
                'id' => $user['id'],
                'name' => $user['name'],
                'role' => $user['role']
            ];
            $token = $this->generateJWT($tokenInfo);
            $_SESSION['token'] = $token;
            http_response_code(200);
            echo json_encode(['message' => 'Đăng nhập thành công', 'token' => $_SESSION['token']]);
        } else {
            http_response_code(401);
            echo json_encode(['message' => 'Email hoặc mật khẩu không đúng', 'pass' => $password, 'hash' => $user['password']]);
        }
    }

    // Đăng xuất người dùng
    public function logout()
    {
        $this->setCorsHeaders();
        header('Content-Type: application/json');
        session_start();
        session_unset();
        session_destroy();

        http_response_code(200);
        echo json_encode(['message' => 'Đăng xuất thành công']);
    }
    private function generateJWT($user)
    {
        $payload = [
            'id' => $user['id'],
            'name' => $user['name'],
            'role' => $user['role'],
            'iat' => time(),
            'exp' => time() + (60 * 60)
        ];

        return JWT::encode($payload, $this->secretKey, 'HS256');
    }
    public function validateToken($token)
    {
        try {
            // Giải mã token bằng thư viện JWT
            $decoded = JWT::decode($token, new Key($this->secretKey, 'HS256'));

            // Nếu token hợp lệ, trả về dữ liệu giải mã
            echo json_encode([
                'status' => 'success',
                'data' => (array) $decoded
            ]);
            return;
        } catch (\Exception $e) {
            // Nếu có lỗi, trả về lỗi 401 với thông báo "Invalid token"
            http_response_code(401); // Unauthorized
            echo json_encode([
                'status' => 'error',
                'message' => 'Invalid token: ' . $e->getMessage()
            ]);
        }
    }
}
