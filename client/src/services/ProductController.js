import axios from "axios";
import { notification } from "antd";

export const fetchProducts = async (setProducts) => {
  try {
    const response = await axios.get(
      "http://localhost:82/php_lab/api/products"
    );
    setProducts(response.data);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};
export const deleteProduct = async (id, setProducts, products) => {
  try {
    await axios.delete(`http://localhost:82/php_lab/api/products/${id}`);
    setProducts(products.filter((product) => product.id !== id));
    notification.success({
      message: "Delete Success",
      description: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    notification.error({
      message: "Delete Error",
      description: "Failed to delete product.",
    });
  }
};
export const fetchProductDetails = async (
  id,
  form,
  setImageUrl,
  setCategories
) => {
  try {
    const response = await axios.get(
      `http://localhost:82/php_lab/api/products/${id}`
    );
    const product = response.data;
    form.setFieldsValue(response.data, { categoryId: product.categoryId });
    setImageUrl(product.imageUrl);
    if (!setCategories || setCategories.length === 0) {
      const categoriesResponse = await axios.get(
        "http://localhost:82/php_lab/api/categories"
      );
      setCategories(categoriesResponse.data); // Set categories if needed
    }
    // Set more images if necessary
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
};
export const createProduct = async (
  values,
  imageUrl,
  navigate,
  form,
  setImageUrl,
  message,
  categories
) => {
  try {
    // Tạo FormData để gửi dữ liệu bao gồm ảnh
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("categoryId", values.categoryId);
    formData.append("imageUrl", imageUrl);
    // if (imageUrl && imageUrl instanceof File) {
    //   formData.append('imageUrl', imageUrl);
    // } else {
    //   message.error('Please select a valid image.');
    //   return;
    // }

    // Gửi request đến API để tạo sản phẩm mới
    const response = await axios.post(
      "http://localhost:82/php_lab/api/products",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status === 201) {
      // Kiểm tra mã trạng thái thành công (201)
      message.success("Product created successfully");
      navigate("/admin/products"); // Chuyển hướng đến danh sách sản phẩm
    }
  } catch (error) {
    console.error("Error creating product:", error);
    message.error("Error creating product. Please try again.");
  }
};

export const updateProduct = async (
  id,
  payload,
  navigate,
  setImageUrl,
  setLoading,
  message
) => {
  setLoading(true);
  try {
    const response = await axios.put(
      `http://localhost:82/php_lab/api/products/${id}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200 || response.status === 201) {
      message.success("Product updated successfully");
      navigate("/admin/products");
    }
    return response.data;
  } catch (error) {
    console.error("Error:", error.response || error.message);
    const errorMessage =
      error.response?.data?.message || "Failed to update product";
    message.error("Error: " + errorMessage);
  }
};
export const getProductById = async (id) => {
  try {
    const response = await axios.get(
      `http://localhost:82/php_lab/api/products/${id}`
    );
    return response.data;
    console.log(response); // Trả về dữ liệu sản phẩm
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const getProductByCategory = async (category) => {
  try {
    const response = await axios.get(
      `http://localhost:82/php_lab/api/products?category=${category}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};
