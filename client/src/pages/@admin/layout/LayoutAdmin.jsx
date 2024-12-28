import { useState } from "react";

import { Button, Layout, Menu, theme } from "antd";
import {
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	ProductOutlined,
	UserOutlined,
	UnorderedListOutlined,
	BarChartOutlined,
	DollarOutlined,
} from "@ant-design/icons";

import { Routes, Route, Link } from "react-router-dom";

import Dashboard from "../pages/dashboard/Dashboard";
import Users from "../pages/management/users/Users";
import Categories from "../pages/management/categories/Categories";
import Products from "../pages/management/products/Products";
import CreateCategory from "../pages/management/categories/Create";
import UpdateCategory from "../pages/management/categories/Update";
import CreateProduct from "../pages/management/products/Create";
import UpdateProduct from "../pages/management/products/Update";
import Orders from "../pages/management/orders/Orders";
import OrderDetail from "../pages/management/orders/Detail";
const { Header, Sider, Content } = Layout;

const LayoutAdmin = () => {
	const [collapsed, setCollapsed] = useState(false);
	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken();

	const containerStyle = {
		width: "100%",
		minHeight: "100vh",
	};

	const menu = [
		{
			key: "1",
			icon: <BarChartOutlined />,
			label: "Dashboard",
			href: "/admin/dashboard",
		},
		{
			key: "2",
			icon: <UserOutlined />,
			label: "User",
			href: "/admin/user",
		},
		{
			key: "3",
			icon: <UnorderedListOutlined />,
			label: "Category",
			href: "/admin/categories",
		},
		{
			key: "4",
			icon: <ProductOutlined />,
			label: "Product",
			href: "/admin/products",
		},
		{
			key: "5",
			icon: <DollarOutlined />,
			label: "Order",
			href: "/admin/orders",
		},
	];

	return (
		<Layout style={containerStyle}>
			<Sider trigger={null} collapsible collapsed={collapsed}>
				<div className="demo-logo-vertical" />
				<Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
					{menu.map((item) => (
						<Menu.Item key={item.key} icon={item.icon}>
							{item.href ? (
								<Link to={item.href}>{item.label}</Link>
							) : (
								item.label
							)}
						</Menu.Item>
					))}
				</Menu>
			</Sider>
			<Layout>
				<Header style={{ padding: 0, background: colorBgContainer }}>
					<Button
						type="text"
						icon={
							collapsed ? (
								<MenuUnfoldOutlined />
							) : (
								<MenuFoldOutlined />
							)
						}
						onClick={() => setCollapsed(!collapsed)}
						style={{
							fontSize: "16px",
							width: 64,
							height: 64,
						}}
					/>
				</Header>
				<Content
					style={{
						margin: "24px 16px",
						padding: 24,
						minHeight: 280,
						background: colorBgContainer,
						borderRadius: borderRadiusLG,
					}}>
					<Routes>
						<Route path="dashboard" element={<Dashboard />} />
						<Route path="user" element={<Users />} />

						<Route path="categories">
							<Route path="" element={<Categories />} />
							<Route path="create" element={<CreateCategory />} />
							<Route
								path="update/:id"
								element={<UpdateCategory />}
							/>
						</Route>

						<Route path="products">
							<Route path="" element={<Products />} />
							<Route path="create" element={<CreateProduct />} />
							<Route
								path="update/:id"
								element={<UpdateProduct />}
							/>
						</Route>
						<Route path="orders">
							<Route path="" element={<Orders />} />
							<Route
								path="detail/:id"
								element={<OrderDetail />}
							/>
						</Route>
					</Routes>
				</Content>
			</Layout>
		</Layout>
	);
};

export default LayoutAdmin;
