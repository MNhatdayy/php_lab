import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, Table, Typography, Button } from "antd";
import { getProductById } from "../../../../../services/ProductController";
import { fetchOrderDetails } from "../../../../../services/OrderController";
const { Title } = Typography;

const OrderDetail = () => {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrderDetails(id, getProductById, setOrderDetails, setLoading);
  }, [id]);

  const columns = [
    { title: "Product ID", dataIndex: "product_id", key: "product_id" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (text, record) => (
        <img
          src={`http://localhost/php/php_lab/${record.imageUrl}`}
          alt={record.productId}
          style={{ width: "50px", height: "50px" }}
        />
      ),
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      key: "unitPrice",
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => price.toFixed(2),
    },
  ];

  if (loading) {
    return <Spin tip="Loading..." />;
  }

  // Calculate the total order price
  const totalOrderPrice = orderDetails.reduce(
    (total, orderDetail) => total + orderDetail.totalPrice,
    0
  );

  return (
    <div>
      <Title level={2}>Order Details</Title>
      <Table
        columns={columns}
        dataSource={orderDetails}
        rowKey="id"
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell colSpan={4} align="right">
              <b>Total Order:</b>
            </Table.Summary.Cell>
            <Table.Summary.Cell>
              <b>{totalOrderPrice.toFixed(2)}</b>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />
      <Button type="primary" onClick={() => navigate("/admin/orders")}>
        Exit
      </Button>
    </div>
  );
};

export default OrderDetail;
