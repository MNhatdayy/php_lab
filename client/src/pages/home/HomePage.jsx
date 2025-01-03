import "./home.scss";
import { Button, Empty, Layout, Modal } from "antd";
import Slider from "react-slick";
import { useEffect } from "react";
import { loadProducts } from "../../services/HomeController";
import { useState } from "react";
const { Sider, Content } = Layout;

import ProductComponent from "../shop/Products/ProductComponent";
import { Link } from "react-router-dom";
const siderStyle = {
    backgroundColor: "white",
};

const layoutStyle = {
    borderRadius: 8,
    width: "100%",
    backgroundColor: "white",
};

const contentStyle = {
    minHeight: 100,
    color: "#fff",
    backgroundColor: "white",
};

var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
};

const HomePage = () => {
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [products, setProducts] = useState([]);
    useEffect(() => {
        checkPaymentSuccess();
        loadProducts()
            .then((response) => response)
            .then((data) => setProducts(data));
    }, []);
    console.log(products);
    const checkPaymentSuccess = async () => {
        const params = new URLSearchParams(window.location.search); // Get query parameters
        const vnp_ResponseCode = params.get("vnp_ResponseCode");

        if (vnp_ResponseCode === "00") {
            // If VNPay response code indicates success
            setPaymentSuccess(true); // Set payment success state to true
            // Optional: Redirect to home or a success page after handling payment
            // history.push("/success"); // Example redirect to /success route
        }
    };
    const handleModalCancel = () => {
        setPaymentSuccess(false); // Close the modal
        window.location.href = "http://localhost:5173/"; // Redirect to home page //may cai host 5173 la cua fe ke no di nha
    };
    return (
        <div>
            <Layout>
                <Layout style={layoutStyle}>
                    <Sider width="100%" style={siderStyle}>
                        <Slider {...settings}>
                            <div className="img-slide">
                                <img
                                    width="100%"
                                    src="https://bizweb.dktcdn.net/100/484/752/themes/920128/assets/slider_3.jpg?1717509348028"
                                    alt=""
                                />
                            </div>
                            <div className="img-slide">
                                <img
                                    width="100%"
                                    src="https://bizweb.dktcdn.net/100/484/752/products/bridge75-render-1-1714960856873.jpg?v=1714967409093"
                                    alt=""
                                />
                            </div>
                            <div className="img-slide">
                                <img
                                    width="100%"
                                    src="https://bizweb.dktcdn.net/thumb/1024x1024/100/484/752/products/qk65v2-classic-case-1-1716989514613.jpg?v=1716989518583"
                                    alt=""
                                />
                            </div>
                        </Slider>
                    </Sider>
                </Layout>
                <Content style={contentStyle}>
                    <div className="container">
                        <div className="service--wrapper">
                            <div className="service--card">
                                <div className="service--img">
                                    <i className="fa-solid fa-truck"></i>
                                </div>
                                <div className="service--info">
                                    <h4 className="service--title">
                                        Free Shipping
                                    </h4>
                                    <p className="service--description">
                                        Free shipping on all order
                                    </p>
                                </div>
                            </div>
                            <div className="service--card">
                                <div className="service--img">
                                    <i className="fa-solid fa-clock"></i>
                                </div>
                                <div className="service--info">
                                    <h4 className="service--title">
                                        Support Service
                                    </h4>
                                    <p className="service--description">
                                        Fast & Careful
                                    </p>
                                </div>
                            </div>
                            <div className="service--card">
                                <div className="service--img">
                                    <i className="fa-solid fa-credit-card"></i>
                                </div>
                                <div className="service--info">
                                    <h4 className="service--title">VN Pay</h4>
                                    <p className="service--description">
                                        Smart pay
                                    </p>
                                </div>
                            </div>
                            <div className="service--card">
                                <div className="service--img">
                                    <i className="fa-solid fa-tags"></i>
                                </div>
                                <div className="service--info">
                                    <h4 className="service--title">
                                        Order Discount
                                    </h4>
                                    <p className="service--description">
                                        Vouncher, sales, gift
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* <div className="sale--wrapper">
							<div className="title flip-animation">
								<span>S</span>
								<span>A</span>
								<span>L</span>
								<span>E</span>
								<span>S</span>
							</div>

							<div className="list-product">
								{products.map((value, index) => {
									return (
										<ProductComponent
											key={index}
											product={value}
										/>
									);
								})}
							</div>
							<div className="actions">
								<Button shape="round" type="primary">
									View more details
								</Button>
							</div>
						</div> */}

                        <div className="gb--wrapper">
                            <div className="title flip-animation">
                                <span>I</span>
                                <span>N</span>
                                <span>S</span>
                                <span>T</span>
                                <span>O</span>
                                <span>C</span>
                                <span>K</span>
                            </div>

                            <div className="list-product">
                                {products.map((value, index) => {
                                    return (
                                        <ProductComponent
                                            key={index}
                                            product={value}
                                        />
                                    );
                                })}
                            </div>
                            <div className="actions">
                                <Link to={"/shop/product/all"}>
                                    <Button shape="round" type="primary">
                                        View more details
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </Content>
            </Layout>
            <Modal
                title="Thanh toán thành công"
                visible={paymentSuccess}
                onCancel={handleModalCancel}
                onOk={handleModalCancel}
            >
                <p>Đơn hàng của bạn đã được tiếp nhận.</p>
                {/* Add additional content or actions here */}
            </Modal>
        </div>
    );
};

export default HomePage;
