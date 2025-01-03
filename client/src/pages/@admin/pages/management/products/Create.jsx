import { useState, useEffect } from "react";
import { Form, Input, Button, Select, Upload, message } from "antd";
import { useNavigate } from "react-router-dom";
import { fetchCategories } from "../../../../../services/CategoryController";
import { createProduct } from "../../../../../services/ProductController";

import "./products.scss";

const CreateProduct = () => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories(setCategories);
  }, []);

  const onFinish = async (values) => {
    if (!imageUrl) {
      message.error("Please upload the main image.");
      return;
    }
    createProduct(
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
      setImageUrl(file);
      message.success(`${file.name} selected successfully`);
      console.log("Image URL:", file);
    } else {
      message.error("Invalid file type. Only JPEG and PNG are allowed.");
    }
  };
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      method="POST"
      enctype="multipart/form-data"
    >
      <Form.Item
        name="name"
        label="Name"
        rules={[
          {
            required: true,
            message: "Please enter the product name",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        rules={[
          {
            required: true,
            message: "Please enter the product description",
          },
        ]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>
      <div className="form-product-wrapper">
        <Form.Item
          name="price"
          label="Price"
          rules={[
            {
              required: true,
              message: "Please enter the product price",
            },
          ]}
        >
          <Input type="number" min="0" step="0.01" />
        </Form.Item>
        <Form.Item
          name="categoryId"
          label="Category"
          rules={[
            {
              required: true,
              message: "Please select the product category",
            },
          ]}
        >
          <Select>
            {categories.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </div>
      <Form.Item label="Main Image">
        <Upload.Dragger
          name="imageUrl"
          listType="picture"
          multiple={false}
          onChange={handleImageUpload}
          beforeUpload={() => false}
        >
          <p className="ant-upload-drag-icon">
            Drag & drop an image here or click to select
          </p>
        </Upload.Dragger>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create Product
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateProduct;
