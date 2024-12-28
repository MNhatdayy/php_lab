import { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, message , Select, } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductDetails, updateProduct} from '../../../../../services/ProductController';
import { fetchCategories } from '../../../../../services/CategoryController';

const { Option } = Select;

const UpdateProduct = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [moreImages, setMoreImages] = useState([]);

  useEffect(() => {
    fetchProductDetails(id,form,setImageUrl);
    fetchCategories(setCategories);
  }, []); 

  const onFinish = async (values) => {
    updateProduct(id, values, imageUrl, moreImages, navigate, setLoading, message, categories)
  };

  const handleImageUpload = (info) => {
    const file = info.file;
    if (file) {
      setImageUrl(file);
      message.success(`${file.name} selected successfully`);
    } else {
      message.error('No file selected or invalid file');
    }
  };

  const handleMoreImagesUpload = (info) => {
    const files = info.fileList.map((file) => file?.originFileObj).filter(Boolean);
    if (files.length > 0) {
      setMoreImages(files);
      message.success(` images selected successfully`);
    } else {
      message.error('No files selected or invalid files');
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Please enter the product name' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: 'Please enter the product description' }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item
        name="price"
        label="Price"
        rules={[{ required: true, message: 'Please enter the product price' }]}
      >
        <Input type="number" min="0" step="0.01" />
      </Form.Item>
      <Form.Item
        name="quantity"
        label="Quantity"
        rules={[{ required: true, message: 'Please enter the product quantity' }]}
      >
        <Input type="number" min="0" />
      </Form.Item>
      <Form.Item
        name="categoryId"
        label="Category"
        rules={[{ required: true, message: 'Please select the product category' }]}
      >
        <Select>
          {categories.map((category) => (
            <Option key={category.id} value={category.id}>
              {category.name}
            </Option>
          ))}
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
          <p className="ant-upload-drag-icon">Drag &amp; drop an image here or click to select</p>
        </Upload.Dragger>
      </Form.Item>
      <Form.Item label="Additional Images">
        <Upload.Dragger
          name="moreImages"
          listType="picture"
          multiple={true}
          onChange={handleMoreImagesUpload}
          beforeUpload={() => false}
        >
          <p className="ant-upload-drag-icon">
            Drag &amp; drop additional images here or click to select
          </p>
        </Upload.Dragger>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Update Product
        </Button>
        <Button onClick={() => navigate('/admin/products')}>Cancel</Button>
      </Form.Item>
    </Form>
  );
};

export default UpdateProduct;
