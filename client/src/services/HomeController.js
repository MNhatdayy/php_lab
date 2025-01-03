import { request } from "../util/ApiFunction";
import axios from "axios";
export const loadProducts = async () => {
  try {
    const response = await axios.get(
      `http://localhost/php/php_lab/api/products`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};
export const loadProductById = async function (productId) {
  try {
    const response = await request("GET", `/api/products/${productId}`);

    if (response.status === 200) {
      console.log("API Response Data:", response.data); // Kiểm tra phản hồi của API
      return response.data;
    } else {
      throw new Error("Failed to load products items");
    }
  } catch (error) {
    console.error("Error loading products items:", error);
    throw error;
  }
};
