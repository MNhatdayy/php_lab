import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./cart.scss";
import {
    deleteCart,
    loadCartItems,
    updateCart,
} from "../../services/CartController";
import { Button, InputNumber, Space, Table } from "antd";
import { parseToken } from "../../services/AuthController";
import "./cart.scss";
import { getProductById } from "../../services/ProductController";
const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            const data = await loadCartItems();
            console.log(data.cart_items);

            if (!Array.isArray(data.cart_items)) {
                console.error("Expected data to be an array, but got:", data);
                return;
            }

            const cartItemsWithProducts = await Promise.all(
                data.cart_items.map(async (ele) => {
                    const productData = await getProductById(ele.product_id);
                    return {
                        id: ele.id,
                        name: productData.name,
                        product: productData,
                        quantity: ele.quantity,
                        imageUrl: productData.imageUrl,
                        price: productData.price,
                    };
                })
            );

            // Cập nhật state với giỏ hàng đã có thông tin sản phẩm đầy đủ
            setCartItems(cartItemsWithProducts);

            // Tính toán tổng giá
            const calculatedPrice = cartItemsWithProducts.reduce(
                (total, item) => total + item.quantity * item.price,
                0
            );
            setTotalPrice(calculatedPrice);
        } catch (error) {
            console.error("Error loading cart items:", error);
        }
    };
    //doi thanh host cua m la chay dc // do cai nayt hoi moi lam nen cau hinh base dở ừa oke có điều setup composer với phải tải php.exe mới đẩy lên server hosting dc căng:v mà sao có firebase nữa??? đâu ủa cái này nó của composer mà cái jwt thầy hướng dẫn mà ờ oke hiểu rồi để t mò, còn cái db thì oke liên kết đc rồi đúng không ừa tesst dc là gọi được r
    const columns = [
        {
            title: "Image",
            dataIndex: "imageUrl",
            key: "imageUrl",
            render: (text, record) => (
                <img
                    src={`http://localhost/php/php_lab/${record.imageUrl}`}
                    alt={record.name}
                    style={{
                        width: "80px",
                        objectFit: "contain",
                    }}
                />
            ),
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
            render: (text, record) => (
                <InputNumber
                    min={0}
                    value={record.quantity}
                    onChange={(value) => handleUpdateQuantity(value, record.id)}
                />
            ),
        },
        { title: "Price", dataIndex: "price", key: "price" },
        {
            title: "Action",
            key: "action",
            render: (text, record) => (
                <Space size="middle">
                    <Button onClick={() => handleDeleteItem(record.id)}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    const handleUpdateQuantity = async (newQuantity, cartId) => {
        try {
            const response = await updateCart(cartId, newQuantity);
            console.log("Cart updated:", response);
            const updatedItems = cartItems.map((item) =>
                item.id === cartId ? { ...item, quantity: newQuantity } : item
            );
            setCartItems(updatedItems);
            const calculatedPrice = updatedItems.reduce(
                (total, item) => total + item.quantity * item.price,
                0
            );
            setTotalPrice(calculatedPrice);
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    };

    const handleDeleteItem = async (cartId) => {
        try {
            const response = await deleteCart(cartId);
            if (response === 204) {
                console.log("Successfully deleted product:", response);
                const updatedItems = cartItems.filter(
                    (item) => item.id !== cartId
                );
                setCartItems(updatedItems);

                const calculatedPrice = updatedItems.reduce(
                    (total, item) => total + item.quantity * item.price,
                    0
                );
                setTotalPrice(calculatedPrice);
            } else {
                console.log("Delete action was cancelled");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };
    const handleCheckout = () => {
        const tokenInfo = parseToken();
        const userId = tokenInfo ? tokenInfo.id : null;

        navigate("/order", { state: { cartItems, totalPrice, userId } });
    };

    return (
        <div className="full">
            <div id="container">
                <div className="cart--wrapper">
                    <h3>Your cart</h3>
                    <div className="cart--container">
                        <div className="cart--list">
                            <Table
                                columns={columns}
                                dataSource={cartItems}
                                rowKey="id"
                                pagination={false}
                                className="align-items-center-table"
                            />
                        </div>
                        <div className="cart--total">
                            <div className="price">
                                <p>Total:</p>
                                <p>
                                    {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    }).format(totalPrice)}
                                </p>
                            </div>
                            <div className="actions">
                                <Button
                                    type="primary"
                                    shape="round"
                                    block
                                    onClick={handleCheckout}
                                >
                                    Check out
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
