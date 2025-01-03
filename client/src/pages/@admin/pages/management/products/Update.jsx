import { useState, useEffect } from "react";
import { Form, Input, Button, Upload, message, Select } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchProductDetails,
  updateProduct,
} from "../../../../../services/ProductController";
import { fetchCategories } from "../../../../../services/CategoryController";

const { Option } = Select;
const baseURL = "http://localhost/php/php_lab/";
const UpdateProduct = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null); // Lưu trữ URL ảnh cũ

  useEffect(() => {
    fetchCategories(setCategories); // Lấy danh sách các category
  }, []);

  useEffect(() => {
    fetchProductDetails(id, form, setImageUrl, setCategories);
  }, [id, form]);

  const onFinish = async (values) => {
    if (!imageUrl) {
      message.error("Please upload the main image.");
      return;
    }
    updateProduct(
      values,
      imageUrl,
      navigate,
      form,
      setImageUrl,
      message,
      categories
    );
  };

  const handleImageUpload = (info) => {
    const file = info.file;
    const allowedTypes = ["image/jpeg", "image/png"];
    if (file && allowedTypes.includes(file.type)) {
      setImageUrl(file.name);
      message.success(`${file.name} selected successfully`);
    } else {
      message.error("Invalid file type. Only JPEG and PNG are allowed.");
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: "Please enter the product name" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        rules={[
          { required: true, message: "Please enter the product description" },
        ]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item
        name="price"
        label="Price"
        rules={[{ required: true, message: "Please enter the product price" }]}
      >
        <Input type="number" min="0.01" step="0.01" />
      </Form.Item>
      <Form.Item
        name="category_id"
        label="Category"
        rules={[{ required: true, message: "Please select a category" }]}
      >
        <Select>
          {categories && categories.length > 0 ? (
            categories.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))
          ) : (
            <Option disabled>No categories available</Option>
          )}
        </Select>
      </Form.Item>

      <Form.Item label="Main Image">
        <Upload.Dragger
          name="imageUrl"
          listType="picture"
          multiple={false}
          onChange={handleImageUpload}
          beforeUpload={() => false}
        >
          {imageUrl ? (
            <img
              src={`${baseURL}${imageUrl}`}
              alt="current"
              style={{ width: "100px", height: "100px" }}
            />
          ) : (
            <p className="ant-upload-drag-icon">Hãy bấm vào đây để thêm ảnh</p>
          )}
        </Upload.Dragger>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="sub  mit" loading={loading}>
          Update Product
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UpdateProduct;
