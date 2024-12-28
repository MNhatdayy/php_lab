import { useState, useEffect } from "react";
import { Form, Input, Button, notification } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchCategoryById,
  updateCategory,
} from "../../../../../services/CategoryController";

const UpdateCategory = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchCategoryById(id, form, notification);
  }, [id, form]);

  const onFinish = async (values) => {
    const success = updateCategory(
      id,
      values,
      setLoading,
      notification,
      navigate
    );
    if (success) {
      navigate("/admin/categories");
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: "Please input the category name!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Update Category
        </Button>
        <Button
          type="default"
          onClick={() => navigate("/admin/categories")}
          style={{ marginLeft: "10px" }}
        >
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UpdateCategory;
