<?php
class OrderModel
{
    private $conn;
    private $table_name = "orders";

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function getOrders()
    {
        $query = "SELECT o.id, o.customer_address, o.customer_name, o.customer_phone, o.payment_id, o.user_id
              FROM " . $this->table_name . " o";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        // Trả về tất cả các bản ghi dưới dạng một mảng các đối tượng
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }


    public function getOrderById($id)
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_OBJ);
    }

    public function addOrder($customer_name, $customer_address, $customer_phone, $payment_id, $user_id)
    {
        $query = "INSERT INTO " . $this->table_name . " 
              (customer_name, customer_address, customer_phone, payment_id, user_id) 
              VALUES (:customer_name, :customer_address, :customer_phone, :payment_id, :user_id)";

        $stmt = $this->conn->prepare($query);

        // Gán giá trị cho các tham số
        $stmt->bindParam(':customer_name', $customer_name);
        $stmt->bindParam(':customer_address', $customer_address);
        $stmt->bindParam(':customer_phone', $customer_phone);
        $stmt->bindParam(':payment_id', $payment_id);
        $stmt->bindParam(':user_id', $user_id);
        if ($stmt->execute()) {
            return $this->conn->lastInsertId(); // Lấy ID của bản ghi vừa được thêm
        }
        // Thực thi câu lệnh và trả về kết quả
        return false;
    }


    public function updateOrder($id, $customer_name, $order_date, $total_amount)
    {
        $query = "UPDATE " . $this->table_name . " 
                  SET customer_name = ?, order_date = ?, total_amount = ?
                  WHERE id = ?";
        $stmt = $this->conn->prepare($query);

        return $stmt->execute([$customer_name, $order_date, $total_amount, $id]);
    }

    public function deleteOrder($id)
    {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);

        return $stmt->execute();
    }
}
