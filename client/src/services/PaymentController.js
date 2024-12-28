import axios from "axios";

const BASE_URL = 'http://localhost:8099/api/payment';

export const payWithVNPay = async (total) => {
    try{
        const response = await axios.get(`${BASE_URL}/vn-pay`,{
        params: {
              total: Math.round(total),
            },

        });
        return response.data;
    }catch{
        console.error('Error paying with VNPay:', error);
        throw error; // Xử lý lỗi
    }
};

// Hàm xử lý callback từ VNPay
export const handleVNPayCallback = async (vnp_ResponseCode) => {
    try {
      const response = await axios.get(`${BASE_URL}/vn-pay-callback`, {
        params: {
          vnp_ResponseCode: vnp_ResponseCode,
        },
      });
      return response.data; // Trả về dữ liệu từ phản hồi
    } catch (error) {
      console.error('Error handling VNPay callback:', error);
      throw error; // Xử lý lỗi
    }
  };
  