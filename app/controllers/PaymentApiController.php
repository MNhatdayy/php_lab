<?php
require_once('app/config/database.php');
require_once('app/models/PaymentModel.php');
class PaymentApiController
{
    private $paymentModel;

    public function __construct()
    {
        $db = (new Database())->getConnection();
        $this->paymentModel = new PaymentModel($db);
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
        echo json_encode($this->paymentModel->getAllPayments());
    }
}
