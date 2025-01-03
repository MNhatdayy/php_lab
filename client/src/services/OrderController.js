import axios from "axios";
export const fetchOrders = async (setOrders, notification) => {
  try {
    const response = await axios.get("http://localhost/php/php_lab/api/orders");
    setOrders(response.data.data);
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
      `http://localhost/php/php_lab/api/detail/${id}`
    );
    const orderDetails = response.data.data;
    console.log(response.data.data);

    // Fetch additional product details
    const updatedOrderDetails = await Promise.all(
      orderDetails.map(async (orderDetail) => {
        const product = await getProductById(orderDetail.product_id);
        console.log(product);

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
      `http://localhost/php/php_lab/api/submit`,
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
    console.log(orderData);

    if (!token) {
      throw new Error("JWT token is missing");
    }

    const response = await axios.post(
      "http://localhost/php/php_lab/api/orders",
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
      `http://localhost/php/php_lab/api/orders/confirmation`
    );
    return response.data; // Trả về dữ liệu từ phản hồi
  } catch (error) {
    console.error("Error fetching payment success message:", error);
    throw error; // Xử lý lỗi
  }
};
