import "./categories.scss";

import { Link, useNavigate } from "react-router-dom";
import { Button, Table, Space } from "antd";
import { useState, useEffect } from 'react';
import DeleteModal from "../../../components/DeleteConfirm";
import { deleteCategory, fetchCategories } from "../../../../../services/CategoryController";
const Categories = () => {
	const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

	//modal
	
	const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);
	const showModal = (id) => {
        setCategoryIdToDelete(id);
        setIsModalOpen(true);
    };

    const handleOk = () => {
        deleteCategory(categoryIdToDelete,categories,setCategories);
        setIsModalOpen(false);
        setCategoryIdToDelete(null);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setCategoryIdToDelete(null);
    };
	//modal
    useEffect(() => {
        fetchCategories(setCategories);
    }, []);

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => navigate(`/admin/categories/update/${record.id}`)}>Edit</Button>
                    <Button type="danger" onClick={() => showModal(record.id)}>Delete</Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
			<Button type="primary"><Link to={`/admin/categories/create`}>Create</Link></Button>
            <Table columns={columns} dataSource={categories} rowKey="id" />
			<DeleteModal
                show={isModalOpen}
                onCancel={handleCancel}
                onConfirm={handleOk}
            />
        </div>

    );
};

export default Categories;