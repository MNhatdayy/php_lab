/* eslint-disable react/prop-types */
import "./productComponent.scss";
import { Button, message } from "antd";
import { SearchOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { addToCart } from "../../../services/CartController";

const ProductComponent = ({ product }) => {
    const [messageApi, contextHolder] = message.useMessage();

    const handleAddToCart = (cartId, quantity) => {
        addToCart(cartId, quantity)
            .then(() => {
                messageApi.open({
                    type: "success",
                    content: "Add products success !",
                });
            })
            .catch((error) => {
                messageApi.open({
                    type: "error",
                    content: "Add product failed ! " + error,
                });
            });
    };
    return (
        <>
            {contextHolder}
            <div className="product--card">
                <div className="product--img">
                    <img
                        loading="lazy"
                        src={`http://localhost:81/php_lab/${product.imageUrl}`}
                        alt=""
                    />
                    <div className="info">
                        <div className="actions">
                            <Button size="large" type="primary" shape="circle">
                                <Link to={`/shop/product/${product.id}`}>
                                    <SearchOutlined />
                                </Link>
                            </Button>
                            <Button
                                size="large"
                                type="primary"
                                shape="circle"
                                onClick={() => handleAddToCart(product.id, 1)}
                            >
                                <ShoppingCartOutlined />
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="product--description">
                    <p className="product--type">KEYCAP</p>
                    <p className="product--name"> Name: {product.name} </p>
                    <p className="product--price">
                        {/* <span className="price-sale">{product.priceSale}</span> */}

                        <span className="price-sale">
                            {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                            }).format(product.price)}
                        </span>
                    </p>
                </div>
            </div>
        </>
    );
};

export default ProductComponent;
