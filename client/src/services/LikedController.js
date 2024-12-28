import { request } from "../util/ApiFunction";

import { jwtDecode } from "jwt-decode";
export const loadLikedItems = async function () {
	try {
		// Lấy token từ localStorage
		const token = sessionStorage.getItem("token");
		if (!token) {
			throw new Error("No token found in localStorage");
		}

		// Giải mã token để lấy thông tin người dùng
		const decodedToken = jwtDecode(token);
		const username = decodedToken.sub; // Giả sử token có thuộc tính username

		// Thực hiện yêu cầu đến API để lấy các giỏ hàng của người dùng
		const response = await request("GET", `/api/favourite/user/${username}`);

		if (response.status === 200) {
			console.log("API Response Data:", response.data); // Kiểm tra phản hồi của API
			return response.data;
		} else {
			throw new Error("Failed to Like items");
		}
	} catch (error) {
		console.error("Error like items:", error);
		throw error;
	}
};
export const likeItem = async function (productId) {
	try {
		// Lấy token từ localStorage
		const token = sessionStorage.getItem("token");
		if (!token) {
			throw new Error("No token found in localStorage");
		}

		// Giải mã token để lấy thông tin người dùng
		const decodedToken = jwtDecode(token);
		const username = decodedToken.sub; // Giả sử token có thuộc tính userId

		// Tạo payload để gửi đến API
		const payload = {
			username: username,
			productId: productId,
			
		};

		// Thực hiện yêu cầu đến API để thêm sản phẩm vào giỏ hàng của người dùng
		const response = await request("POST", "/api/favourite", payload);

		if (response.status === 201) {
			console.log("Liked Product successfully");
			return response.data;
		} else {
			throw new Error("Failed to like product");
		}
	} catch (error) {
		console.error("Error like product:", error);
		throw error;
	}
};
export const unlikeItem = async function (productId) {
	try {
		// Lấy token từ localStorage
		const token = sessionStorage.getItem("token");
		if (!token) {
			throw new Error("No token found in localStorage");
		}

		// Giải mã token để lấy thông tin người dùng
		const decodedToken = jwtDecode(token);
		const username = decodedToken.sub; // Giả sử token có thuộc tính userId

		// Tạo payload để gửi đến API
		const payload = {
			username: username,
			productId: productId,
			
		};

		// Thực hiện yêu cầu đến API để thêm sản phẩm vào giỏ hàng của người dùng
		const response = await request("POST", "/api/favourite/unlike", payload);

		if (response.data === 1) {
			console.log("UnLiked Product successfully");
			return 1;

		}
        else {
			throw new Error("Failed to unlike product");
		}
	} catch (error) {
		console.error("Error unlike product:", error);
		throw error;
	}
};
export const checkLikeItem = async function (productId) {
	try {
		// Lấy token từ localStorage
		const token = sessionStorage.getItem("token");
		if (!token) {
			throw new Error("No token found in localStorage");
		}

		// Giải mã token để lấy thông tin người dùng
		const decodedToken = jwtDecode(token);
		const username = decodedToken.sub; // Giả sử token có thuộc tính userId
        
		// Tạo payload để gửi đến API
		

		
		
        

        // Thực hiện yêu cầu đến API để kiểm tra sản phẩm có trong danh sách yêu thích của người dùng không
        const url = `/api/favourite/check?username=${encodeURIComponent(username)}&productId=${encodeURIComponent(productId)}`;

        // Thực hiện yêu cầu đến API để kiểm tra sản phẩm có trong danh sách yêu thích của người dùng không
        const response = await request("GET", url);

		if (response.data === 1) {
			console.log("ĐÃ LIKE");
			return 1;
		}
        if(response.data === 0){
            return 0;
        } else {
			throw new Error("Failed to like product");
		}
	} catch (error) {
		console.error("Error like product:", error);
		throw error;
	}
};