import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { payWithVNPay } from "../../../services/PaymentController";
import { submitOrder } from "../../../services/OrderController";
import { Typography, Button, Card, Radio, message, Row, Col } from "antd";
import { RightOutlined, FilePdfOutlined } from "@ant-design/icons";
import "./paymentpage.scss";
const { Title } = Typography;

const PaymentPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { orderData } = state || {};

  useEffect(() => {
    if (!orderData) {
      navigate("/");
    }
  }, [orderData, navigate]);

  const handlePayment = async () => {
    // try {
    //   if (paymentMethod === "vnpay") {
    //     const paymentResponse = await payWithVNPay(orderData.totalPrice);
    //     console.log("Payment Response:", paymentResponse);
    //     if (
    //       paymentResponse &&
    //       paymentResponse.data &&
    //       paymentResponse.data.paymentUrl
    //     ) {
    //       message.success("Vui lòng đợi để chuyển qua thanh toán!", 3); // Duration set to 3 seconds
    //       setTimeout(() => {
    //         window.location.href = paymentResponse.data.paymentUrl;
    //       }, 3000);
    //     } else {
    //       console.error("Invalid payment response:", paymentResponse);
    //     }
    //   } else if (paymentMethod === "cod") {
    //     await submitOrder(
    //       orderData.customerName,
    //       orderData.customerAddress,
    //       orderData.customerPhone,
    //       "cod"
    //     );
    //     // Handle order submission for COD (Cash on Delivery)
    //     // Optionally show success message or redirect to another page
    //     // navigate('/confirmation');
    //   }
    // } catch (error) {
    //   console.error("Error initiating payment:", error);
    // }
    navigate("/");
  };
  const handleInvoice = () => {
    // Implement your invoice generation logic here
    message.info("Tạo hóa đơn chưa được triển khai.");
  };

  return (
    <div className="payment-form">
      <Title level={2}>Phiếu xác nhận đơn hàng</Title>
      {orderData && (
        <>
          <Card bordered className="order-summary">
            <Title level={3}>Thông tin đơn hàng</Title>
            <div className="summary-item">
              <p>
                <strong>Tên khách hàng:</strong> {orderData.customerName}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {orderData.customerPhone}
              </p>
              <p>
                <strong>Địa chỉ đặt hàng:</strong> {orderData.customerAddress}
              </p>
              <p>
                <strong>Tổng tiền:</strong>{" "}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(orderData.totalPrice)}
              </p>
            </div>
          </Card>
          {/* <Card bordered className="payment-method">
            <Title level={3}>Khách hàng đã chọn</Title>
            <Radio.Group
              onChange={(e) => setPaymentMethod(e.target.value)}
              value={paymentMethod}
            >
              <Radio value="vnpay">VNPay</Radio>
            </Radio.Group>
          </Card> */}
          <Row justify="center" gutter={[16, 16]} style={{ marginTop: "24px" }}>
            <Col>
              <Button
                type="primary"
                danger
                onClick={handleInvoice}
                size="large"
                icon={<FilePdfOutlined />}
              >
                Xuất hóa đơn
              </Button>
            </Col>
            <Col>
              <Button type="primary" onClick={handlePayment} size="large">
                Trang chủ
                <RightOutlined />
              </Button>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default PaymentPage;
