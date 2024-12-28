import React from 'react';
import { Form, Input, Button, Divider, notification } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';
import axios from 'axios';
import './contact.scss';

const Contact = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const response = await axios.post('http://localhost:8099/api/contacts', values);
      console.log('Form values: ', response.data);

      // Display success notification
      notification.success({
        message: 'Thành công',
        description: 'Bạn đã gửi thông tin thành công!',
      });

      // Optionally, clear the form fields after submission
      form.resetFields();
    } catch (error) {
      console.error('Error submitting form:', error);
      notification.error({
        message: 'Thất bại',
        description: 'Đã có lỗi xảy ra, vui lòng thử lại!',
      });
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-info">
        <h1 className='title'>FloneStore</h1>
        <p><EnvironmentOutlined /> Địa chỉ: số 508, Long Bình, Quận 9, TP. Hồ Chí Minh</p>
        <p><PhoneOutlined /> Số điện thoại: 0888115511</p>
        <p><MailOutlined /> Email: sales@flonestore.com</p>
        <Divider />
        <h1>LIÊN HỆ VỚI CHÚNG TÔI</h1>
        <Form form={form} onFinish={onFinish} className="contact-form">
          <Form.Item name="name" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
            <Input placeholder='Họ tên*' />
          </Form.Item>
          <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ' }]}>
            <Input placeholder='Email*' />
          </Form.Item>
          <Form.Item name="phone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
            <Input placeholder='Số điện thoại*' />
          </Form.Item>
          <Form.Item name="description" rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}>
            <Input.TextArea placeholder='Nhập nội dung*' />
          </Form.Item>
          <Form.Item>
            <Button id='button' type="primary" htmlType="submit">Gửi liên hệ của bạn</Button>
          </Form.Item>
        </Form>
      </div>
      <div className="contact-form-map">
        <div className="map">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d979.5441367908355!2d106.81514006955277!3d10.874172999330057!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d8ab72a00a47%3A0xac29be8cbd9a52c8!2zNy0yMSA1MDgsIExvbmcgQsOsbmgsIFF14bqtbiA5LCBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1719138540645!5m2!1svi!2s" 
            width="600"
			height="480"
            allowFullScreen=""
            loading="lazy"
            title="FloneStore Location" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;