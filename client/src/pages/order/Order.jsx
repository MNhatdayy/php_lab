import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
	List,
	Typography,
	Card,
	Row,
	Col,
	Button,
	Form,
	Input,
	Select,
	message,
} from "antd";
import { createOrder } from "../../services/OrderController";
import { fetchPayments } from "../../services/PaymentFakeController";
import { parseToken } from "../../services/AuthController";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "./order.scss";

const { Title, Text } = Typography;
const { Option } = Select;

const Order = () => {
	const location = useLocation();
	const { cartItems } = useLocation().state || { cartItems: [] };
	const [form] = Form.useForm();
	const [totalPrice, setTotalPrice] = useState(0);
	const [payments, setPayments] = useState([]);
	const [selectedPaymentId, setSelectedPaymentId] = useState(null);
	const [userId, setUserId] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		calculateTotalPrice();
		fetchPayments().then((data) => setPayments(data));
	}, [cartItems]);

	useEffect(() => {
		const tokenInfo = parseToken();
		if (tokenInfo) {
			setUserId(tokenInfo.id);
		}
	}, []);

	const calculateTotalPrice = () => {
		const calculatedPrice = cartItems.reduce(
			(total, item) => total + item.quantity * item.product.price,
			0
		);
		setTotalPrice(calculatedPrice);
	};

	const handlePaymentChange = (value) => {
		setSelectedPaymentId(value);
	};

	const handlePayment = async () => {
		const values = await form.validateFields();
		const { name, phone, address } = values;

		const orderData = {
			customerName: name,
			customerAddress: address,
			customerPhone: phone,
			userId: userId,
			paymentId: selectedPaymentId,
			totalPrice: totalPrice,
		};

		console.log("Order Data:", orderData);

		// Retrieve JWT token from local storage or session storage
		const token = localStorage.getItem("jwtToken"); // Adjust this based on your implementation

		const createdOrder = await createOrder(orderData, token);
		message.success("Chuyển qua bước xác nhận!", 1.5);
		setTimeout(() => {
			navigate("/payment", { state: { orderData } }); // Redirect to payment page with order data
		}, 1500);
		console.log("Created Order:", createdOrder);
		// history.push('/order-confirmation');
	};

	return (
		<div className="orderContainer">
			<Title level={3} className="logo-section">
				<i className="fa fa-cloud"></i>FloneStore{" "}
			</Title>
			<Row gutter={24}>
				<Col xs={24} md={12}>
					<Card bordered>
						<Title level={3}>Thông tin mua hàng</Title>
						<Form layout="vertical" form={form}>
							<div className="formContainer">
								<div className="formColumn">
									<Form.Item
										label="Tên khách hàng"
										name="name"
										rules={[
											{
												required: true,
												message:
													"Please enter your name",
											},
										]}>
										<Input placeholder="Enter your name" />
									</Form.Item>
									<Form.Item
										label="Số điện thoại"
										name="phone"
										rules={[
											{
												required: true,
												message:
													"Please enter your phone number",
											},
										]}>
										<Input placeholder="Enter your phone number" />
									</Form.Item>
									<Form.Item
										label="Địa chỉ"
										name="address"
										rules={[
											{
												required: true,
												message:
													"Please enter your address",
											},
										]}>
										<Input placeholder="Enter your address" />
									</Form.Item>
									<Form.Item
										label="Loại thanh toán"
										name="paymentMethod"
										rules={[
											{
												required: true,
												message:
													"Please select a payment method",
											},
										]}>
										<Select
											onChange={handlePaymentChange}
											placeholder="Select a payment method">
											{payments.map((payment) => (
												<Option
													key={payment.id}
													value={payment.id}>
													{payment.paymentType}
												</Option>
											))}
										</Select>
									</Form.Item>
								</div>
								<div className="formColumn">
									<Form.Item
										label="Mã giảm giá"
										className="discount-code">
										<Input placeholder="Nhập mã giảm giá" />
										<Button type="primary">Áp dụng</Button>
									</Form.Item>
								</div>
							</div>
						</Form>
					</Card>
				</Col>
				<Col xs={24} md={12}>
					<Card bordered>
						<Title level={3}>Sản phẩm</Title>
						<List
							bordered
							dataSource={cartItems}
							renderItem={(item) => (
								<List.Item>
									<List.Item.Meta
										title={item.product.name}
										description={`Price: ${new Intl.NumberFormat(
											"vi-VN",
											{
												style: "currency",
												currency: "VND",
											}
										).format(item.product.price)} x ${
											item.quantity
										}`}
									/>
								</List.Item>
							)}
						/>
						<List.Item className="totalPrice">
							<Text strong>Tổng tiền:</Text>
							<Text>
								{new Intl.NumberFormat("vi-VN", {
									style: "currency",
									currency: "VND",
								}).format(totalPrice)}
							</Text>
						</List.Item>
					</Card>
				</Col>
			</Row>
			<Row justify="center" className="submitButton">
				<Link to="/shop/cart">
					<Button type="primary-cart" className="btn-cart">
						<LeftOutlined />
						Giỏ hàng
					</Button>
				</Link>
				<Col>
					<Button type="primary" onClick={handlePayment} size="large">
						Chuyển qua bước xác nhận thanh toán <RightOutlined />
					</Button>
				</Col>
			</Row>
		</div>
	);
};

export default Order;
