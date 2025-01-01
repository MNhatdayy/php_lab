import { useState, useEffect } from "react";
import { Form, Input, Button, Upload, message, Select } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchProductDetails,
  updateProduct,
} from "../../../../../services/ProductController";
import { fetchCategories } from "../../../../../services/CategoryController";

const { Option } = Select;

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
    fetchProductDetails(id, form, setImageUrl, setCategories); // Lấy thông tin chi tiết sản phẩm
  }, [id, form]);

  const onFinish = async (values) => {
    if (!imageUrl && !imageFile) {
      message.error("Please upload the main image.");
      return;
    }

    let price = parseFloat(values.price);
    if (isNaN(price) || price <= 0) {
      message.error("Invalid price value");
      return;
    }

    price = price.toFixed(2);

    const payload = {
      ...values,
      price,
      imageUrl: imageUrl.name, // Gửi tên file
    };
    console.log("Form values:",payload);
    updateProduct(
      id,
      payload,
      navigate,
      setImageUrl,
      setLoading,
      message
    );
  };
  

  const handleImageUpload = (info) => {
		const file = info.file;
		const allowedTypes = ["image/jpeg", "image/png"];
		if (file && allowedTypes.includes(file.type)) {
		  setImageUrl({
        name: file.name, // lưu tên file
      });
		  message.success(`${file.name} selected successfully`);
		  console.log('Image URL:', file);
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
						beforeUpload={() => false}>
						<p className="ant-upload-drag-icon">
							Drag & drop an image here or click to select
						</p>
					</Upload.Dragger>
				</Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Update Product
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UpdateProduct;
