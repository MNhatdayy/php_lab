<?php
require_once('app/config/database.php');
require_once('app/models/UserModel.php');

class UserApiController{

    private $userModel;
    private $db;

    public function __construct()
    {
        $this->db = (new Database())->getConnection();
        $this->userModel = new UserModel($this->db);
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
        $users = $this->userModel->getUsers();
        echo json_encode($users);
    }

    public function getById($id)
    {
        $this->setCorsHeaders();
        header('Content-Type: application/json');
        $user = $this->userModel->getUserById($id);
        if ($user) {
            echo json_encode($user);
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'User not found']);
        }
    }

    public function create()
    {
        $this->setCorsHeaders();
        header('Content-Type: application/json');

        $data = json_decode(file_get_contents("php://input"), true);
        $name = $data['name'] ?? '';
        $email = $data['email'] ?? '';
        $phone = $data['phone'] ?? '';
        $role = $data['role'] ?? '';
        $password = $data['password'] ?? '';

        $result = $this->userModel->addUser($name, $email, $password, $phone, $role);

        if ($result === true) {
            http_response_code(201);
            echo json_encode(['message' => 'User created successfully']);
        } elseif (is_array($result)) {
            http_response_code(400);
            echo json_encode($result);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Something went wrong']);
        }
    }

    public function update($id)
    {
        $this->setCorsHeaders();
        header('Content-Type: application/json');

        $data = json_decode(file_get_contents("php://input"), true);
        $name = $data['name'] ?? '';
        $email = $data['email'] ?? '';
        $phone = $data['phone'] ?? '';
        $role = $data['role'] ?? '';
        $password = $data['password'] ?? '';

        $result = $this->userModel->updateUser($id, $name, $email, $password, $phone, $role);

        if ($result === true) {
            http_response_code(200);
            echo json_encode(['message' => 'User updated successfully']);
        } elseif (is_array($result)) {
            http_response_code(400);
            echo json_encode($result);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Something went wrong']);
        }
    }

    public  function delete($id)
    {
        $this->setCorsHeaders();
        header('Content-Type: application/json');

        $result = $this->userModel->deleteUser($id);

        if ($result === true) {
            http_response_code(200);
            echo json_encode(['message' => 'User deleted successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Something went wrong']);
        }
    }
}