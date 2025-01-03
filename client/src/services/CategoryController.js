import axios from "axios";
import { notification } from "antd";
export const fetchCategories = async (setCategories) => {
  try {
    // const response = await axios.get("http://localhost:82/php_lab/api/categories");
    const response = await axios.get(
      "http://localhost/php/php_lab/api/categories"
    );
    setCategories(response.data);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};
export const deleteCategory = async (id, categories, setCategories) => {
  try {
    // await axios.delete(`http://localhost:82/php_lab/api/categories/${id}`);
    await axios.delete(`http://localhost/php/php_lab/api/categories/${id}`);
    setCategories(categories.filter((category) => category.id !== id));
    notification.success({
      message: "Delete Success",
      description: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("There was an error deleting the category!", error);
  }
};
export const fetchCategoryById = async (id, form) => {
  try {
    const response = await axios.get(
      `http://localhost/php/php_lab/api/categories/${id}`
    );
    form.setFieldsValue(response.data);
  } catch (error) {
    console.error("There was an error fetching the category!", error);
    notification.error({
      message: "Error",
      description: "There was an error fetching the category.",
    });
  }
};
export const updateCategory = async (id, values, setLoading) => {
  setLoading(true);
  try {
    await axios.put(
      `http://localhost/php/php_lab/api/categories/${id}`,
      values
    );
    notification.success({
      message: "Success",
      description: "Category updated successfully.",
    });
    return true;
  } catch (error) {
    notification.error({
      message: "Error",
      description: "There was an error updating the category.",
    });
  } finally {
    setLoading(false);
  }
};
export const createCategory = async (values, navigate) => {
  try {
    await axios.post("http://localhost/php/php_lab/api/categories", values);
    navigate("/admin/categories");
    notification.success({
      message: "Success",
      description: "Category updated successfully.",
    });
  } catch (error) {
    console.error("There was an error creating the category!", error);
    // Xử lý thông báo lỗi tại đây nếu cần
  }
};
