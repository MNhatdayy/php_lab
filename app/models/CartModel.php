<?php

class CartModel
{
    private $conn;
    private $table_name = "cart_items";

    public $id;
    public $quantity;
    public $product_id;
    public $user_id;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Thêm sản phẩm vào giỏ hàng
    public function addCartItem($quantity, $product_id, $user_id)
    {
        // Kiểm tra xem sản phẩm và người dùng đã có trong giỏ hàng chưa
        $checkQuery = "SELECT id, quantity FROM " . $this->table_name . " WHERE product_id = :product_id AND user_id = :user_id";
        $checkStmt = $this->conn->prepare($checkQuery);
        $checkStmt->bindParam(':product_id', $product_id);
        $checkStmt->bindParam(':user_id', $user_id);
        $checkStmt->execute();

        // Nếu có kết quả, thực hiện update số lượng
        if ($checkStmt->rowCount() > 0) {
            $existingCartItem = $checkStmt->fetch(PDO::FETCH_ASSOC);
            $newQuantity = $existingCartItem['quantity'] + $quantity;  // Cộng số lượng vào giỏ hiện tại

            // Cập nhật số lượng trong giỏ hàng
            $updateQuery = "UPDATE " . $this->table_name . " SET quantity = :quantity WHERE product_id = :product_id AND user_id = :user_id";
            $updateStmt = $this->conn->prepare($updateQuery);
            $updateStmt->bindParam(':quantity', $newQuantity);
            $updateStmt->bindParam(':product_id', $product_id);
            $updateStmt->bindParam(':user_id', $user_id);

            if ($updateStmt->execute()) {
                return true;
            } else {
                return false;
            }
        } else {
            // Nếu không có giỏ hàng cho sản phẩm này, thêm mới
            $insertQuery = "INSERT INTO " . $this->table_name . " (quantity, product_id, user_id) VALUES (:quantity, :product_id, :user_id)";
            $insertStmt = $this->conn->prepare($insertQuery);
            $insertStmt->bindParam(':quantity', $quantity);
            $insertStmt->bindParam(':product_id', $product_id);
            $insertStmt->bindParam(':user_id', $user_id);

            if ($insertStmt->execute()) {
                return true;
            }
            return false;
        }
    }


    // Cập nhật số lượng sản phẩm trong giỏ hàng
    public function updateCartItem($id, $quantity)
    {
        $query = "UPDATE " . $this->table_name . " 
                  SET quantity = :quantity 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':quantity', $quantity);
        $stmt->bindParam(':id', $id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Xóa sản phẩm khỏi giỏ hàng
    public function removeCartItem($id)
    {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':id', $id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Lấy danh sách sản phẩm trong giỏ hàng của người dùng
    public function getCartItemsByUser($user_id)
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE user_id = :user_id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':user_id', $user_id);

        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


    public function clearCartByUser($user_id)
    {
        $query = "DELETE FROM " . $this->table_name . " WHERE user_id = :user_id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':user_id', $user_id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
}
