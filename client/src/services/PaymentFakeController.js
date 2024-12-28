import axios from "axios";
export const fetchPayments = async () => {
    try {
      const response = await axios.get('http://localhost:8099/api/payments');
      return response.data;
    } catch (error) {
      console.error('Error fetching payment:', error);
    }
};