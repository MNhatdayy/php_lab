import axios from "axios";
export const fetchOrders = async (setOrders, notification) => {
	try {
		const response = await axios.get("http://localhost:8099/api/orders");
		setOrders(response.data);
	} catch (error) {
		console.error("Error fetching orders:", error);
		notification.error({
			message: "Fetch Error",
			description: "Failed to fetch orders.",
		});
	}
};
export const fetchOrderDetails = async (
	id,
	getProductById,
	setOrderDetails,
	setLoading
) => {
	try {
		const response = await axios.get(
			`http://localhost:8099/api/detail/${id}`
		);
		const orderDetails = response.data;

		// Fetch additional product details
		const updatedOrderDetails = await Promise.all(
			orderDetails.map(async (orderDetail) => {
				const product = await getProductById(orderDetail.productId);
				return {
					...orderDetail,
					imageUrl: product.imageUrl,
					unitPrice: product.price,
					totalPrice: product.price * orderDetail.quantity,
				};
			})
		);

		setOrderDetails(updatedOrderDetails);
		setLoading(false);
	} catch (error) {
		console.error("Error fetching order details:", error);
		setLoading(false);
	}
};
export const submitOrder = async (
	customerName,
	customerAddress,
	customerPhone,
	payment
) => {
	try {
		const response = await axios.post(
			`http://localhost:8099/api/orders/submit`,
			{
				customerName: customerName,
				customerAddress: customerAddress,
				customerPhone: customerPhone,
				payment: payment,
			}
		);
		return response.data; // Trả về dữ liệu từ backend (URL thanh toán hoặc thông báo lỗi)
	} catch (error) {
		console.error("Error submitting order:", error);
		throw error; // Xử lý lỗi
	}
};
export const createOrder = async (orderData) => {
	try {
		const token = sessionStorage.getItem("token");
		console.log("JWT Token:", token); // Debugging statement to check the token

		if (!token) {
			throw new Error("JWT token is missing");
		}

		const response = await axios.post(
			"http://localhost:8099/api/orders/create",
			orderData,
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response.data;
	} catch (error) {
		console.error("Error creating order:", error);
		throw error;
	}
};
export const getPaymentSuccessMessage = async () => {
	try {
		const response = await axios.get(
			`http://localhost:8099/api/orders/confirmation`
		);
		return response.data; // Trả về dữ liệu từ phản hồi
	} catch (error) {
		console.error("Error fetching payment success message:", error);
		throw error; // Xử lý lỗi
	}
};
