<?php
class OrderDetailModel
{
    private $conn;
    private $table_name = "order_details";

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function getOrderDetailsByOrderId($order_id)
    {
        $query = "SELECT od.id, od.order_id, od.product_id, od.quantity
              FROM " . $this->table_name . " od
              WHERE od.order_id = :order_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':order_id', $order_id, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_OBJ); // Trả về danh sách kết quả dưới dạng đối tượng
    }


    public function addOrderDetail($order_id, $product_id, $quantity)
    {
        $query = "INSERT INTO " . $this->table_name . " (order_id, product_id, quantity)
VALUES (:order_id, :product_id, :quantity)";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':order_id', $order_id);
        $stmt->bindParam(':product_id', $product_id);
        $stmt->bindParam(':quantity', $quantity);

        return $stmt->execute();
    }

    public function updateOrderDetail($id, $order_id, $product_id, $quantity, $price)
    {
        $query = "UPDATE " . $this->table_name . "
SET order_id = ?, product_id = ?, quantity = ?, price = ?
WHERE id = ?";
        $stmt = $this->conn->prepare($query);

        return $stmt->execute([$order_id, $product_id, $quantity, $price, $id]);
    }

    public function deleteOrderDetail($id)
    {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);

        return $stmt->execute();
    }
}
