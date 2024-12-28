import { useParams } from "react-router-dom";
import "./shopcategory.scss";
import { useEffect, useState } from "react";

import { getProductByCategory } from "../../../services/ProductController";
import ProductComponent from "../Products/ProductComponent";
import { Breadcrumb } from "antd";
import { Empty } from "antd";
const ShopCategory = () => {
	const params = useParams();

	const [category, setCategory] = useState(params["*"].substring(8));

	const [products, setProducts] = useState([]);

	const [itemBread, setItem] = useState([]);

	useEffect(() => {
		setCategory(
			params["*"].substring(8) !== "all"
				? params["*"].substring(8)
				: "All"
		);
		getProductByCategory(
			params["*"].substring(8) !== "all" ? params["*"].substring(8) : ""
		)
			.then((response) => response)
			.then((data) => setProducts(data));

		setItem([
			{
				title: "Home",
			},
			{
				title:
					`${
						category.charAt(0).toUpperCase() + category.substring(1)
					}` || "Unknown Category",
				href: `/shop/product/${category || "unknown"}`,
			},
		]);
	}, [params, category]);

	return (
		<>
			<div className="shop--category--wrapper">
				<div className="breadcrumb">
					<Breadcrumb separator=">" items={itemBread} />
				</div>

				{products.length > 0 ? (
					<>
						<div className="shop--category__list-product">
							{products.map((value, index) => {
								return (
									<ProductComponent
										key={index}
										product={value}
									/>
								);
							})}
						</div>
					</>
				) : (
					<Empty />
				)}
			</div>
		</>
	);
};

export default ShopCategory;
