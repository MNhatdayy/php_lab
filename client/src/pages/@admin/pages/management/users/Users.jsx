// Users.jsx
import { useState, useEffect } from 'react';
import { Table, Button, message } from 'antd';
import DeleteModal from '../../../components/DeleteConfirm';
import { fetchUsers, deleteUser } from '../../../../../services/UserController';
const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [IdUserDelete, setUserIdToDelete] = useState(null);
  useEffect(() => {
    fetchUsers(setUsers,setLoading,message);
  }, []);


  const showModal = (id) => {
    setUserIdToDelete(id);
    setIsModalOpen(true);
};

const handleOk = () => {
    deleteUser(IdUserDelete,message);
    setIsModalOpen(false);
    setUserIdToDelete(null);
};

const handleCancel = () => {
    setIsModalOpen(false);
    setUserIdToDelete(null);
};


  

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button type="primary" onClick={() => showModal(record)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Table
        dataSource={users}
        columns={columns}
        rowKey="id"
        loading={loading}
      />
      <DeleteModal
                show={isModalOpen}
                onCancel={handleCancel}
                onConfirm={handleOk}
            />
    </div>
  );
};

export default Users;
