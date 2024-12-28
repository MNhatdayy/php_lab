import { useEffect, useState } from "react";
import { Card, Statistic, Typography, Space, message, notification } from "antd";
import { UserOutlined, ShoppingCartOutlined, AppstoreOutlined, TagsOutlined } from "@ant-design/icons";
import { fetchCategories } from "../../../../services/CategoryController";
import { fetchOrders } from "../../../../services/OrderController";
import { fetchProducts } from "../../../../services/ProductController";
import { fetchUsers } from "../../../../services/UserController";

const Dashboard = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchOrders(setOrders, notification);
                await fetchProducts(setProducts);
                await fetchUsers(setUsers, setLoading, message);
                await fetchCategories(setCategories);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <Typography.Title level={4}>Dashboard</Typography.Title>
            <Space direction="horizontal" size="large">
                <Card>
                    <Statistic 
                        title="Orders" 
                        value={orders.length} 
                        prefix={<ShoppingCartOutlined />} 
                    />
                </Card>
                <Card>
                    <Statistic 
                        title="Products" 
                        value={products.length} 
                        prefix={<AppstoreOutlined />} 
                    />
                </Card>
                <Card>
                    <Statistic 
                        title="Users" 
                        value={users.length} 
                        prefix={<UserOutlined />} 
                    />
                </Card>
                <Card>
                    <Statistic 
                        title="Categories" 
                        value={categories.length} 
                        prefix={<TagsOutlined />} 
                    />
                </Card>
            </Space>
        </div>
    );
};

export default Dashboard;

