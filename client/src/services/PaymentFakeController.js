import axios from "axios";
export const fetchPayments = async () => {
  try {
    const response = await axios.get(
      "http://localhost/php/php_lab/api/payments/all"
    );
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("Error fetching payment:", error);
  }
};
