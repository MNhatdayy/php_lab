<?php

require_once('app/config/database.php');
require_once('app/models/OrderModel.php');
require_once('app/models/OrderDetailModel.php');

class OrderApiController
{
    private $orderModel;
    private $orderDetailModel;
    private $cartModel;

    public function __construct()
    {
        $db = (new Database())->getConnection();
        $this->orderModel = new OrderModel($db);
        $this->orderDetailModel = new OrderDetailModel($db);
        $this->cartModel = new CartModel($db);
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

    // Lấy danh sách đơn hàng
    public function index()
    {
        $this->setCorsHeaders();
        header('Content-Type: application/json');

        try {
            $orders = $this->orderModel->getOrders();
            echo json_encode(['success' => true, 'data' => $orders]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    // Lấy thông tin đơn hàng và chi tiết đơn hàng theo ID
    public function getById($id)
    {
        $this->setCorsHeaders();
        header('Content-Type: application/json');

        try {
            $order = $this->orderModel->getOrderById($id);
            if (!$order) {
                http_response_code(404);
                echo json_encode(['message' => 'Order not found']);
                return;
            }

            $orderDetails = $this->orderDetailModel->getOrderDetailsByOrderId($id);
            echo json_encode(['success' => true, 'data' => ['order' => $order, 'details' => $orderDetails]]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    // Thêm đơn hàng mới
    public function create()
    {
        $this->setCorsHeaders();
        header('Content-Type: application/json');

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405); // Method Not Allowed
            echo json_encode(['message' => 'Invalid request method']);
            return;
        }

        // Lấy dữ liệu từ body của request
        $data = json_decode(file_get_contents('php://input'), true);

        // Kiểm tra dữ liệu
        if (empty($data)) {
            http_response_code(400); // Bad Request
            echo json_encode(['message' => 'Invalid input data']);
            return;
        }

        $customerName = trim($data['customerName'] ?? '');
        $customerAddress = trim($data['customerAddress'] ?? '');
        $customerPhone = trim($data['customerPhone'] ?? '');
        $payment_id = $data['paymentId'] ?? 0;
        $user_id = $data['userId'];
        $details = $data['cartItem'];

        // Kiểm tra dữ liệu bắt buộc
        if (empty($customerName) || empty($customerAddress) || empty($customerPhone)) {
            http_response_code(400); // Bad Request
            echo json_encode(['message' => 'Customer name, address, and phone are required']);
            return;
        }

        try {
            // Tạo đơn hàng
            $order = $this->orderModel->addOrder($customerName, $customerAddress, $customerPhone, $payment_id, $user_id);
            if (!$order) {
                throw new Exception('Failed to create order');
            }

            // Thêm chi tiết đơn hàng
            foreach ($details as $detail) {
                $productId = $detail['product']['id'] ?? null;
                $quantity = $detail['quantity'] ?? 0;

                if (!$productId || $quantity <= 0) {
                    throw new Exception('Invalid order detail data');
                }

                $this->orderDetailModel->addOrderDetail($order, $productId, $quantity);
            }

            $this->cartModel->clearCartByUser($user_id);
            // Phản hồi thành công
            http_response_code(201); // Created
            echo json_encode(['message' => 'Order created successfully', 'order_id' => $order]);
        } catch (Exception $e) {
            // Phản hồi lỗi
            http_response_code(500); // Internal Server Error
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }


    // Cập nhật đơn hàng
    public function update($id)
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
            $customerName = $data['customer_name'] ?? '';
            $orderDate = $data['order_date'] ?? date('Y-m-d H:i:s');
            $totalAmount = $data['total_amount'] ?? 0;

            $updated = $this->orderModel->updateOrder($id, $customerName, $orderDate, $totalAmount);
            if (!$updated) {
                http_response_code(400);
                echo json_encode(['message' => 'Failed to update order']);
                return;
            }

            echo json_encode(['message' => 'Order updated successfully']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    // Xóa đơn hàng
    public function delete($id)
    {
        $this->setCorsHeaders();
        header('Content-Type: application/json');

        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
            http_response_code(405);
            echo json_encode(['message' => 'Invalid request method']);
            return;
        }

        try {
            $deleted = $this->orderModel->deleteOrder($id);
            if (!$deleted) {
                http_response_code(400);
                echo json_encode(['message' => 'Failed to delete order']);
                return;
            }

            echo json_encode(['message' => 'Order deleted successfully']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }
}
