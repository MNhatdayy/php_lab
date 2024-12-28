import "./liked.scss";

import { Button } from "antd";

import { useEffect } from "react";
import { useState } from "react";

import ProductComponent from "../shop/Products/ProductComponent";
import { Link } from "react-router-dom";
import { loadLikedItems } from "../../services/LikedController";

const Liked = function () {
	const [likedProducts, setLikedProducts] = useState([]);
	useEffect(() => {
		const fetchLikedItems = async () => {
			try {
				const data = await loadLikedItems();
				setLikedProducts(data || []); // Ensure cartItems is an array
			} catch (error) {
				console.error("Error items:", error);
			}
		};

		fetchLikedItems();
	}, []);

	return (
		<div>
			<div className="container">
				<div className="gb--wrapper">
					<div className="title flip-animation">
						<span>F</span>
						<span>A</span>
						<span>V</span>
						<span>O</span>
						<span>U</span>
						<span>R</span>
						<span>I</span>
						<span>T</span>
						<span>E</span>
					</div>

					<div className="list-product">
						{likedProducts.map((value, index) => {
							return (
								<ProductComponent
									key={index}
									product={value.product}
								/>
							);
						})}
					</div>
					<div className="actions">
						<Link to={"/shop/product/all"}>
							<Button shape="round" type="primary">
								Back to shopping
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Liked;
