import { useState, useEffect } from 'react';
import { Table, Button, Space, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { fetchOrders } from '../../../../../services/OrderController';
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders(setOrders,notification);
  }, []);


  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Customer Name', dataIndex: ['customerName'], key: 'customerName' },
    { title: 'Address', dataIndex: 'customerAddress', key: 'customerAddress' },
    { title: 'Phone', dataIndex: 'customerPhone', key: 'customerPhone' },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => navigate(`/admin/orders/detail/${record.id}`)}>View</Button>
        </Space>
      ),
    },
  ];


  return (
    <div>

      <Table columns={columns} dataSource={orders} rowKey="id" />
    </div>
  );
};

export default Orders;
