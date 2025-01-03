<?php
class PaymentModel
{
    private $conn;
    private $table_name = "payments";

    public $id;
    public $payment_type;
    public $allow;

    public function __construct($db)
    {
        $this->conn = $db;
    }


    public function getAllPayments()
    {
        // Viết câu truy vấn
        $query = "SELECT id, payment_type, allow FROM " . $this->table_name;

        // Chuẩn bị câu truy vấn
        $stmt = $this->conn->prepare($query);

        // Thực thi câu truy vấn
        $stmt->execute();

        // Kiểm tra và trả về kết quả dưới dạng mảng
        $payments = $stmt->fetchAll(PDO::FETCH_ASSOC); // Lấy tất cả kết quả dưới dạng mảng

        return $payments; // Trả về mảng kết quả
    }
}
