// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Form, Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { createCategory } from '../../../../../services/CategoryController';

const CreateCategory = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = (values) => {
    createCategory(values,navigate)
  };
  const onReturn = () => {
    navigate('/admin/categories');
  };

  return (
    <>
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Please input the category name!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: 'Please input the category description!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create Category
        </Button>
        <Button type="default" onClick={onReturn} style={{ marginLeft: '10px' }}>Cancel</Button>
      </Form.Item>
    </Form>
    </>
    
  );
};

export default CreateCategory;