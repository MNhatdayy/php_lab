import "./products.scss";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Table, Button, Space } from "antd";
import DeleteModal from "../../../components/DeleteConfirm";
import { fetchCategories } from "../../../../../services/CategoryController";
import {
    deleteProduct,
    fetchProducts,
} from "../../../../../services/ProductController";
const Products = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [IdproductDelete, setProducIdToDelete] = useState(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchProducts(setProducts);
    }, []);

    const showModal = (id) => {
        setProducIdToDelete(id);
        setIsModalOpen(true);
    };

    const handleOk = () => {
        deleteProduct(IdproductDelete, setProducts, products);
        setIsModalOpen(false);
        setProducIdToDelete(null);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setProducIdToDelete(null);
    };

    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Description", dataIndex: "description", key: "description" },
        {
            title: "Image",
            dataIndex: "imageUrl",
            key: "imageUrl",
            render: (text, record) => (
                // Tạo URL đầy đủ từ đường dẫn ảnh và hiển thị ảnh trong <img>
                <img
                    src={`http://localhost:81/php_lab/${record.imageUrl}`} // Kết hợp URL gốc với đường dẫn ảnh từ backend
                    alt={record.name}
                    style={{ width: "50px", height: "50px" }}
                />
            ),
        },
        { title: "Price", dataIndex: "price", key: "price" },
        {
            title: "Category",
            key: "category_name",
            render: (category) => category.category_name || "No Category",
        },
        {
            title: "Action",
            key: "action",
            render: (text, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        onClick={() =>
                            navigate(`/admin/products/update/${record.id}`)
                        }
                    >
                        Edit
                    </Button>
                    <Button type="danger" onClick={() => showModal(record.id)}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Button type="primary">
                <Link to="/admin/products/create">Create</Link>
            </Button>
            <Table columns={columns} dataSource={products} rowKey="id" />
            <DeleteModal
                show={isModalOpen}
                onCancel={handleCancel}
                onConfirm={handleOk}
            />
        </div>
    );
};

export default Products;
