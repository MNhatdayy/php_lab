import { useParams } from "react-router-dom";
import "./productdetail.scss";
import { Breadcrumb, Button, InputNumber } from "antd";
import Slider from "react-slick";
import { useEffect, useState } from "react";
import { loadProductById } from "../../../services/HomeController";
import { addToCart } from "../../../services/CartController";
import { HeartOutlined } from "@ant-design/icons";
import { HeartFilled } from "@ant-design/icons";
import { checkLikeItem, likeItem, unlikeItem } from "../../../services/LikedController";

var settings = {
	dots: true,
	infinite: true,
	speed: 500,
	slidesToShow: 1,
	slidesToScroll: 1,
};

const ProductDetail = () => {
	const { id } = useParams();
	const [productDetail, setProductDetail] = useState("");
	const [quantity, setQuantity] = useState(1);
	const [itemBread, setItem] = useState([]);
	const [liked, setLiked] = useState(0);
	const onChange = (value) => {
		setQuantity(value);
	};
	const handleAddToCart = (cartId, quantity) => {
		addToCart(cartId, quantity)
			.then((response) => {
				console.log("Cart updated:", response);
			})
			.catch((error) => {
				console.error("Error updating cart:", error);
				// Xử lý lỗi nếu có
			});
	};
	const handleLiked = (productId) => {
		likeItem(productId)
			.then((response) => {
				console.log(response);
				setLiked(1);
			})
			.catch((error) => {
				console.error("Lỗi khi thích sản phẩm", error)
			});

	}
	const handleUnLiked = (productId) => {
		unlikeItem(productId)
			.then((response) => {
				console.log(response);
				setLiked(0);
			})
			.catch((error) => {
				console.error("Lỗi khi unlike", error);
			});
	}
	
	useEffect(() => {
		// Kiểm tra xem sản phẩm đã được thích hay chưa khi component được mount
		const fetchLikedStatus = async () => {
		try {
			const response = await checkLikeItem(id);
			setLiked(response); // Giả sử API trả về đối tượng có thuộc tính 'liked'
		} catch (error) {
			console.error("Lỗi khi kiểm tra trạng thái thích sản phẩm", error);
		}
		};
	
		fetchLikedStatus();
	}, [id]);
	useEffect(() => {
		const fetchCartItems = async () => {
			try {
				const data = await loadProductById(id);
				setProductDetail(data || []);
				setItem([
					{
						title: "Home",
					},
					{
						title:
							productDetail.category?.name || "Unknown Category",
						href: `/shop/product/${
							productDetail.category?.name || "unknown"
						}`,
					},
				]);
			} catch (error) {
				console.error("Error loading cart items:", error);
			}
		};
		fetchCartItems();
	}, [id, itemBread]);
	

	return (
		<>
			<div className="product--detail--wrapper">
				<div className="breadcrumb">
					<Breadcrumb separator=">" items={itemBread} />
				</div>
				<div className="product--detail--container">
					<div className="product--detail">
						<div className="product--slide">
							<Slider {...settings}>
								{/* {productDetail.Images.map((ele) => {
									<div className="product--slide--img">
										<img
											width="100%"
											src={`http://localhost:8099${ele}`}
											alt="img"
										/>
									</div>;
								})} */}
							</Slider>
							<div className="product--slide--img">
								<img
									width="100%"
									src={`http://localhost:8099${productDetail.imageUrl}`}
									alt="img"
								/>
							</div>
						</div>

						<div className="product--info">
							<h3 className="product--name">
								{productDetail.name}
							</h3>
							<p className="product--vendor">
								{productDetail.description}
							</p>
							<p className="product--price">
								{new Intl.NumberFormat("vi-VN", {
									style: "currency",
									currency: "VND",
								}).format(productDetail.price)}
							</p>
							<Button
								icon={liked ? <HeartFilled /> : <HeartOutlined />}
								shape="circle"
								onClick={liked ? () => handleUnLiked(productDetail.id) : () => handleLiked(productDetail.id)}
							></Button>
							{/* <p className="product--version">
								Version: Bridge75
							</p> */}

							<div className="product--actions">
								<InputNumber
									min={1}
									max={10}
									defaultValue={1}
									onChange={onChange}
								/>
								<Button
									block
									className="btn-add-cart"
									href="/shop/cart"
									onClick={() =>
										handleAddToCart(
											productDetail.id,
											quantity
										)
									}>
									Add to cart
								</Button>
							</div>
							<div className="product--buy">
								<Button
									type="primary"
									size="large"
									shape="round"
									block>
									Buy now
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ProductDetail;
