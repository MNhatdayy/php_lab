import React from 'react';
import { Layout, Row, Col, Typography, Space, Form, Input, Button } from 'antd';
import { EnvironmentOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import './footercomponent.scss';

const { Footer } = Layout;
const { Title, Text, Link } = Typography;

const FooterComponent = () => {
  return (
    <Footer className="footer-container">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Title level={2} className="logo-section">
            <i className="fa fa-cloud"></i>FloneStore
          </Title>
          <Space direction="vertical" size="middle">
            <div className="single-contact">
              <EnvironmentOutlined />
              <div className="content">
                Địa chỉ: 
                <Link href="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1959.0882735772707!2d106.815784!3d10.874173!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d8ab6d22e1b9%3A0x8b88143b68a1fb81!2zSG_DoG5nIEjhu691IE5hbS83IDUwOCwgS2h1IHBo4buRIEdpw6NuIETDom4sIFF14bqtbiA5LCBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2sus!4v1719333110851!5m2!1svi!2sus">
                   7-21 508, Long Bình, Quận 9, Hồ Chí Minh
                </Link>
              </div>
            </div>
            <div className="single-contact">
              <PhoneOutlined />
              <div className="content">
                Số điện thoại:
                <Link href="#"> 0888115511</Link>
              </div>
            </div>
            <div className="single-contact">
              <MailOutlined />
              <div className="content">
                Email:
                <Link href="#"> sales@flonestore.com</Link>
              </div>
            </div>
          </Space>
          <div id="copyright" className="fot_copyright mt-3">
            <span className="wsp">
              © Bản quyền thuộc về <Link href="#" className="footer-link">FloneStore</Link>
            </span>
          </div>
        </Col>
        <Col xs={24} md={6}>
          <Title level={3}>Hướng dẫn</Title>
          <ul>
            <li className="instruct-content">
              <Link href="#huongdanmua">Hướng dẫn mua hàng và thanh toán</Link>
            </li>
            <li className="instruct-content">
              <Link href="#huongdansudung">Hướng dẫn sử dụng</Link>
            </li>
            <li className="instruct-content">
              <Link href="#kiemtradonhang">Kiểm tra đơn hàng</Link>
            </li>
          </ul>
        </Col>
        <Col xs={24} md={6}>
          <Title level={3}>Chính sách</Title>
          <ul>
            <li><Link href="#groupbuy">Chính sách Group Buy</Link></li>
            <li><Link href="#baohanh">Chính sách bảo hành</Link></li>
          </ul>
        </Col>
        <Col xs={24} md={6} className="subscribe-section">
          <Title level={3}>ĐĂNG KÝ NHẬN TIN</Title>
          <Text>Bạn muốn nhận khuyến mãi đặc biệt?</Text>
          <Text>Đăng ký tại đây !</Text>
          <Form className="subscribe-form">
            <Form.Item className="subscribe-form-item">
              <Input type="email" placeholder="Địa chỉ Email" required className="subscribe-input" />
              <Button type="primary" htmlType="submit" className="subscribe-button">Đăng ký</Button>
            </Form.Item>
          </Form>
          <div className="social-icons">
            <Space size="middle">
              <Link href="https://facebook.com" target="_blank" title="Theo dõi Facebook FloneStore">
                <img src="//bizweb.dktcdn.net/100/484/752/themes/920128/assets/facebook.png?1717509348028" alt="facebook" />
              </Link>
              <Link href="https://zalo.me" target="_blank" title="Theo dõi Zalo FloneStore">
                <img src="//bizweb.dktcdn.net/100/484/752/themes/920128/assets/zalo.png?1717509348028" alt="zalo" />
              </Link>
              <Link href="https://instagram.com" target="_blank" title="Theo dõi Instagram FloneStore">
                <img src="//bizweb.dktcdn.net/100/484/752/themes/920128/assets/instagram.png?1717509348028" alt="instagram" />
              </Link>
            </Space>
          </div>
        </Col>
      </Row>
    </Footer>
  );
};

export default FooterComponent;