import axios from "axios";
import { notification } from "antd";

export const fetchProducts = async (setProducts) => {
  try {
    const response = await axios.get("http://localhost:8099/api/products");
    setProducts(response.data);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};
export const deleteProduct = async (id, setProducts, products) => {
  try {
    await axios.delete(`http://localhost:8099/api/products/${id}`);
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
export const fetchProductDetails = async (id, form, setImageUrl) => {
  try {
    const response = await axios.get(
      `http://localhost:8099/api/products/${id}`
    );
    const product = response.data;
    form.setFieldsValue({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      categoryId: product.category.id,
    });
    setImageUrl(product.imageUrl);
    // Set more images if necessary
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
};
export const createProduct = async (
  values,
  imageUrl,
  moreImages,
  navigate,
  form,
  setImageUrl,
  setMoreImages,
  message,
  categories
) => {
  try {
    const { categoryId, ...restValues } = values;
    const selectedCategory = categories.find(
      (category) => category.id === categoryId
    );
    const product = {
      ...restValues,
      category: {
        id: categoryId,
        name: selectedCategory?.name,
      },
    };

    const formData = new FormData();
    formData.append("product", JSON.stringify(product));
    if (imageUrl) {
      formData.append("imageUrl", imageUrl);
    }
    moreImages.forEach((image) => {
      formData.append("images", image);
    });
    formData.append("categoryId", categoryId);
    console.log(formData);

    const response = await axios.post(
      "http://localhost:8099/api/products",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status === 200) {
      message.success("Product created successfully");
      form.resetFields();
      setImageUrl(null);
      setMoreImages([]);
      navigate("/admin/products");
    } else {
      message.error("Failed to create product");
    }
  } catch (error) {
    console.log("Error creating product:", error);
    message.error("Failed to create product");
  }
};
export const updateProduct = async (
  id,
  values,
  imageUrl,
  moreImages,
  navigate,
  setLoading,
  message,
  categories
) => {
  try {
    setLoading(true);
    const { categoryId, ...restValues } = values;
    const selectedCategory = categories.find(
      (category) => category.id === categoryId
    );
    const product = {
      ...restValues,
      category: {
        id: categoryId,
        name: selectedCategory?.name,
      },
    };

    const formData = new FormData();
    formData.append("product", JSON.stringify(product));
    if (imageUrl instanceof File) {
      formData.append("imageUrl", imageUrl);
    }
    moreImages.forEach((image) => {
      formData.append("moreImages", image);
    });
    formData.append("categoryId", categoryId);

    await axios.put(`http://localhost:8099/api/products/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    message.success("Product updated successfully");
    navigate("/admin/products"); // Redirect to product list after update
  } catch (error) {
    console.error("Error updating product:", error);
    message.error("Failed to update product");
  } finally {
    setLoading(false);
  }
};
export const getProductById = async (id) => {
  try {
    const response = await axios.get(
      `http://localhost:8099/api/products/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const getProductByCategory = async (category) => {
  try {
    const response = await axios.get(
      `http://localhost:8099/api/products?category=${category}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};
