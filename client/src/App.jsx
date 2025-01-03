/* eslint-disable no-unused-vars */
// import { useState } from 'react'
import "./App.scss";

import { Layout, ConfigProvider } from "antd";

const { Footer, Content } = Layout;

const layoutStyle = {
  overflow: "hidden",
  width: "100%",
  height: "100vh",
  maxWidth: "calc(100% - 8px)",
};

const headerStyle = {
  textAlign: "center",
  color: "#fff",
  width: "100%",
  height: "70px",
  lineHeight: "70px",
  backgroundColor: "white",
};

const contentStyle = {
  textAlign: "center",
  minHeight: 120,
  lineHeight: "120px",
  color: "#fff",
  backgroundColor: "white",
};

const footerStyle = {
  textAlign: "center",
  color: "#fff",
  backgroundColor: "white",
};

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./@auth/components/login/Login.jsx";
import Register from "./@auth/components/register/Register.jsx";

import LayoutAdmin from "./pages/@admin/layout/LayoutAdmin.jsx";
import Dashboard from "./pages/@admin/pages/dashboard/Dashboard.jsx";
import User from "./pages/@admin/pages/management/users/Users.jsx";
import Categories from "./pages/@admin/pages/management/categories/Categories.jsx";
import Products from "./pages/@admin/pages/management/products/Products.jsx";

import LayoutShop from "./pages/layout/LayoutShop.jsx";
import HomePage from "./pages/home/HomePage.jsx";
import ShopCategory from "./pages/shop/ShopByCategory/ShopCategory.jsx";

import Liked from "./pages/liked/Liked.jsx";
import Cart from "./pages/cart/Cart.jsx";
import Contact from "./pages/shop/Contact/Contact.jsx";

import { login, parseToken } from "./services/AuthController.js";
import { useEffect, useState } from "react";

import CreateCategory from "./pages/@admin/pages/management/categories/Create.jsx";
import UpdateCategory from "./pages/@admin/pages/management/categories/Update.jsx";
import CreateProduct from "./pages/@admin/pages/management/products/Create.jsx";
import UpdateProduct from "./pages/@admin/pages/management/products/Update.jsx";
import Orders from "./pages/@admin/pages/management/orders/Orders.jsx";
import OrderDetail from "./pages/@admin/pages/management/orders/Detail.jsx";
import Order from "./pages/order/Order";
import PaymentConfirmation from "./pages/order/PaymentConfirmation";
import PaymentPage from "./pages/order/payment/PaymentPage";
import { loadCartItems } from "./services/CartController.js";
import { toast } from "react-toastify";

function App() {
  // const [count, setCount] = useState(0)
  const [isLoggedIn, setLogin] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const tokenInfo = parseToken();

    if (tokenInfo !== null) {
      setLogin(true);
      setRole(tokenInfo.role);
      console.log(role);
    }
  }, []);

  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
          colorPrimary: "#00b96b",
          borderRadius: 2,

          // Alias Token
          colorBgContainer: "#f6ffed",
        },
      }}
    >
      <div className="full">
        <Router>
          <Routes>
            {role === "ADMIN" ||
              (role === "admin" && (
                <Route path="/admin/*" element={<LayoutAdmin />}>
                  <Route index element={<Dashboard />} />
                  <Route path="" element={<Dashboard />} />

                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="user" element={<User />} />
                  <Route path="products">
                    <Route path="" element={<Products />} />
                    <Route path="create" element={<CreateProduct />} />
                    <Route path="update/:id" element={<UpdateProduct />} />
                  </Route>

                  <Route path="categories">
                    <Route path="" element={<Categories />} />
                    <Route path="create" element={<CreateCategory />} />
                    <Route path="update/:id" element={<UpdateCategory />} />
                  </Route>

                  <Route path="orders">
                    <Route path="" element={<Orders />} />
                    <Route path="detail/:id" element={<OrderDetail />} />
                  </Route>
                </Route>
              ))}
            <Route path="/shop/*" element={<LayoutShop />}>
              <Route index element={<HomePage />} />
              <Route path="" element={<HomePage />} />
              <Route path="product">
                <Route path="kit" element={<ShopCategory />} />
                <Route path="keycap" element={<ShopCategory />} />
                <Route path="switch" element={<ShopCategory />} />
                <Route path="keycap" element={<ShopCategory />} />
                <Route path="accessories" element={<ShopCategory />} />
                <Route path="all" element={<ShopCategory />} />
              </Route>
              <Route path="cart" element={<Cart />} />
              <Route path="liked" element={<Liked />} />
            </Route>
            <Route path="" element={<LayoutShop />}>
              <Route index element={<HomePage />} />
              <Route path="" element={<HomePage />} />
              <Route path="contact" element={<Contact />} />
            </Route>
            <Route path="order" element={<Order />} />
            <Route path="payment" element={<PaymentPage />} />
            <Route
              path="paymentconfirmation"
              element={<PaymentConfirmation />}
            />

            <Route path="/auth/*">
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>

            <Route exact path="/" element={<HomePage />} replace />
          </Routes>
        </Router>
      </div>
    </ConfigProvider>
  );
}

export default App;
