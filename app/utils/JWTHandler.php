<?php
require_once 'vendor/autoload.php';

use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

class JWTHandler
{
    private $secret_key;
    public function __construct()
    {
        $this->secret_key = "HUTECH"; 
    }
    // Tạo JWT
    public function encode($data)
    {
        $issuedAt = time();
        $expirationTime = $issuedAt + 3600;
        $payload = array(
            'iat' => $issuedAt,
            'exp' => $expirationTime,
            'data' => $data
        );
        return JWT::encode($payload, $this->secret_key, 'HS256');
    }
    // Giải mã JWT
    public function decode($jwt)
    {
        try {
            $decoded = JWT::decode($jwt, new Key($this->secret_key, 'HS256'));
            return (array) $decoded->data;
        } catch (Exception $e) {
            return null;
        }
    }
    public function authenticateToken() {
        $headers = getallheaders();
        if (!isset($headers['Authorization'])) {
            http_response_code(401);
            echo json_encode(['message' => 'Authorization header not found']);
            exit;
        }
    
        $authHeader = $headers['Authorization'];
        $token = str_replace('Bearer ', '', $authHeader);
    
        try {
            $decoded = JWT::decode($token, new Key($this->secret_key, 'HS256'));
            return $decoded; // Dữ liệu của token (ví dụ: user ID)
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(['message' => 'Invalid or expired token']);
            exit;
        }
    }
}
