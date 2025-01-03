import { request } from "../util/ApiFunction";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
export const loadCartItems = async function () {
  try {
    // Lấy token từ localStorage
    const token = sessionStorage.getItem("token");
    if (!token) {
      throw new Error("No token found in localStorage");
    }

    // Giải mã token để lấy thông tin người dùng
    const decodedToken = jwtDecode(token);
    const username = decodedToken.name; // Giả sử token có thuộc tính username

    // Thực hiện yêu cầu đến API để lấy các giỏ hàng của người dùng
    const response = await request("GET", `/cart?username=${username}`);

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to load cart items");
    }
  } catch (error) {
    console.error("Error loading cart items:", error);
    throw error;
  }
};
export const addToCart = async function (productId, quantity) {
  try {
    // Lấy token từ localStorage
    const token = sessionStorage.getItem("token");
    if (!token) {
      throw new Error("No token found in localStorage");
    }

    // Giải mã token để lấy thông tin người dùng
    const decodedToken = jwtDecode(token);
    const username = decodedToken.name; // Giả sử token có thuộc tính userId

    // Tạo payload để gửi đến API
    const payload = {
      username: username,
      productId: productId,
      quantity: quantity,
    };

    // Thực hiện yêu cầu đến API để thêm sản phẩm vào giỏ hàng của người dùng
    const response = await request("POST", "/cart", payload);

    if (response.status === 201) {
      console.log("Product added to cart successfully");
      return response.data;
    } else {
      throw new Error("Failed to add product to cart");
    }
  } catch (error) {
    console.error("Error adding product to cart:", error);
    throw error;
  }
};
export const updateCart = async function (cartId, quantity) {
  try {
    // Lấy token từ localStorage
    const token = sessionStorage.getItem("token");
    if (!token) {
      throw new Error("No token found in localStorage");
    }

    // Giải mã token để lấy thông tin người dùng
    const decodedToken = jwtDecode(token);
    const username = decodedToken.sub; // Giả sử token có thuộc tính userId

    // Tạo payload để gửi đến API
    const payload = {
      id: cartId,
      username: username,
      quantity: quantity,
    };

    // Thực hiện yêu cầu đến API để cập nhật số lượng sản phẩm trong giỏ hàng của người dùng
    const response = await request("PUT", `/cart/${cartId}`, payload);

    if (response.status === 200) {
      console.log("Cart updated successfully");
      toast.success("Tăng số lượng thành công");
      return response.data;
    } else {
      throw new Error("Failed to update cart");
    }
  } catch (error) {
    console.error("Error updating cart:", error);
    throw error;
  }
};
// Hàm để xóa sản phẩm khỏi giỏ hàng
export const deleteCart = async (cartId) => {
  try {
    const confirmRemove = window.confirm("Bạn có chắc muốn xóa");
    if (confirmRemove) {
      const response = await request("DELETE", `/cart/${cartId}`);
      if (response.status === 200) {
        console.log("Cart item deleted successfully:", response.data);
        window.location.reload();
      } else {
        throw new Error("Failed to delete cart item");
      }
    }
  } catch (error) {
    console.error("Error deleting cart item:", error);
    throw error; // Xử lý lỗi nếu có
  }
};

// Hàm để thanh toán
export const checkout = async (cartItems, setCartItems) => {
  try {
    if (cartItems.length <= 0) {
      toast.error("Add a product to the cart to proceed with checkout");
      return;
    }
    const confirmOrder = window.confirm(
      "Do you want to proceed with checkout?"
    );
    if (confirmOrder) {
      // Thực hiện thanh toán bằng cách gửi request tới server
      // Ví dụ:
      // const response = await request('POST', '/api/checkout', { cartItems });
      setCartItems([]);
      toast.success("Checkout successful. Thank you!");
    }
  } catch (error) {
    console.error("Error checking out:", error);
    toast.error("Failed to checkout");
  }
};

// Hàm để xóa toàn bộ giỏ hàng
export const removeFromCart = async (cartItems, setCartItems) => {
  try {
    const shouldRemove = window.confirm(
      "Are you sure you want to remove all items from the cart?"
    );
    if (shouldRemove) {
      setCartItems([]);
      toast.success("Cart has been cleared");
    }
  } catch (error) {
    console.error("Error removing from cart:", error);
    toast.error("Failed to remove items from cart");
  }
};
