<?php
require_once('app/models/CartModel.php');


class CartApiController
{
    private $cartModel;
    private $userModel;
    public function __construct()
    {
        $db = (new Database())->getConnection();
        $this->cartModel = new CartModel($db);
        $this->userModel = new UserModel($db);
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
    // Thêm sản phẩm vào giỏ hàng
    public function create()
    {
        $this->setCorsHeaders();
        header('Content-Type: application/json');
        // Lấy dữ liệu từ POST
        $data = json_decode(file_get_contents('php://input'), true);

        // Kiểm tra dữ liệu
        $quantity = $data['quantity'] ?? 0;
        $product_id = $data['productId'] ?? null;
        $username = $data['username'] ?? null;
        $user = $this->userModel->getUserByUsername($username);
        if (!$product_id || $quantity <= 0 || !$user['id']) {
            http_response_code(400);
            echo json_encode(['message' => 'Invalid input data']);
            return;
        }

        // Thêm sản phẩm vào giỏ hàng
        if ($this->cartModel->addCartItem($quantity, $product_id, $user['id'])) {
            http_response_code(201);
            echo json_encode(['message' => 'Product added to cart']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to add product to cart']);
        }
    }

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    public function update()
    {
        $this->setCorsHeaders();
        header('Content-Type: application/json');
        // Lấy dữ liệu từ POST
        $data = json_decode(file_get_contents('php://input'), true);

        // Kiểm tra dữ liệu
        $id = $data['id'] ?? null;
        $quantity = $data['quantity'] ?? 0;

        if (!$id || $quantity <= 0) {
            http_response_code(400);
            echo json_encode(['message' => 'Invalid input data']);
            return;
        }

        // Cập nhật số lượng sản phẩm
        if ($this->cartModel->updateCartItem($id, $quantity)) {
            http_response_code(200);
            echo json_encode(['message' => 'Cart updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to update cart']);
        }
    }

    // Xóa sản phẩm khỏi giỏ hàng
    public function delete($id)
    {
        $this->setCorsHeaders();
        header('Content-Type: application/json');
        // Lấy dữ liệu từ POST


        if (!$id) {
            http_response_code(400);
            echo json_encode(['message' => 'Invalid input data']);
            return;
        }

        // Xóa sản phẩm khỏi giỏ hàng
        if ($this->cartModel->removeCartItem($id)) {
            http_response_code(200);
            echo json_encode(['message' => 'Product removed from cart']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to remove product from cart']);
        }
    }
    public function getCartItemsByUsername()
    {
        $this->setCorsHeaders();
        header('Content-Type: application/json');
        // Lấy dữ liệu từ URL (ví dụ: /cart/user?username=john_doe)
        $username = $_GET['username'] ?? null;
        if (!$username) {
            http_response_code(400);
            echo json_encode(['message' => 'Username is required']);
            return;
        }

        // Kiểm tra người dùng có tồn tại không
        $user = $this->userModel->getUserByUsername($username);

        if (!$user) {
            http_response_code(404);
            echo json_encode(['message' => 'User not found']);
            return;
        }

        // Lấy giỏ hàng của người dùng dựa trên user_id
        $cartItems = $this->cartModel->getCartItemsByUser($user['id']);

        if (empty($cartItems)) {
            http_response_code(404);
            echo json_encode(['message' => 'No items in the cart']);
            return;
        }

        // Trả về thông tin giỏ hàng của người dùng
        http_response_code(200);
        echo json_encode(['cart_items' => $cartItems]);
    }
    public function removeCartByIdUser($id)
    {
        $this->setCorsHeaders();
        header('Content-Type: application/json');
        $result = $this->cartModel->clearCartByUser($id);

        if ($result) {
            http_response_code(200);
            echo json_encode([
                'status' => 'success',
                'message' => 'Cart cleared successfully for user with ID ' . $id
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to clear cart for user with ID ' . $id
            ]);
        }
    }
}
