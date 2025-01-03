<?php

require_once('app/config/database.php');
require_once('app/models/OrderDetailModel.php');

class OrderDetailApiController
{
    private $orderDetailModel;

    public function __construct()
    {
        $db = (new Database())->getConnection();
        $this->orderDetailModel = new OrderDetailModel($db);
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

    // Lấy danh sách chi tiết đơn hàng theo Order ID
    public function getOrderDetailsByOrderId($orderId)
    {
        $this->setCorsHeaders();
        header('Content-Type: application/json');

        try {
            $details = $this->orderDetailModel->getOrderDetailsByOrderId($orderId);
            echo json_encode(['success' => true, 'data' => $details]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    // Thêm mới một chi tiết đơn hàng
    public function addOrderDetail()
    {
        $this->setCorsHeaders();
        header('Content-Type: application/json');

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['message' => 'Invalid request method']);
            return;
        }

        $data = json_decode(file_get_contents('php://input'), true);

        try {
            $orderId = $data['order_id'] ?? null;
            $productId = $data['product_id'] ?? null;
            $quantity = $data['quantity'] ?? 0;
            $price = $data['price'] ?? 0;

            if (!$orderId || !$productId || $quantity <= 0 || $price <= 0) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Invalid input data']);
                return;
            }

            $result = $this->orderDetailModel->addOrderDetail($orderId, $productId, $quantity, $price);
            if (!$result) {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Failed to add order detail']);
                return;
            }

            http_response_code(201);
            echo json_encode(['success' => true, 'message' => 'Order detail added successfully']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    // Cập nhật chi tiết đơn hàng
    public function updateOrderDetail($id)
    {
        $this->setCorsHeaders();
        header('Content-Type: application/json');

        if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
            http_response_code(405);
            echo json_encode(['message' => 'Invalid request method']);
            return;
        }

        $data = json_decode(file_get_contents('php://input'), true);

        try {
            $quantity = $data['quantity'] ?? 0;
            $price = $data['price'] ?? 0;
            $productId = $data['product_id'] ?? null;
            $orderId = $data['order_id'] ?? null;

            if (!$productId || !$orderId || $quantity <= 0 || $price <= 0) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Invalid input data']);
                return;
            }

            $result = $this->orderDetailModel->updateOrderDetail($id, $orderId, $productId, $quantity, $price);
            if (!$result) {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Failed to update order detail']);
                return;
            }

            echo json_encode(['success' => true, 'message' => 'Order detail updated successfully']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    // Xóa chi tiết đơn hàng
    public function deleteOrderDetail($id)
    {
        $this->setCorsHeaders();
        header('Content-Type: application/json');

        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
            http_response_code(405);
            echo json_encode(['message' => 'Invalid request method']);
            return;
        }

        try {
            $result = $this->orderDetailModel->deleteOrderDetail($id);
            if (!$result) {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Failed to delete order detail']);
                return;
            }

            echo json_encode(['success' => true, 'message' => 'Order detail deleted successfully']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }
}
