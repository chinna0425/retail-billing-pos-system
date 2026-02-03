import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080/api/v1.0";

export const createRazorpayOrder = async (data) => {
	return await axios.post("/payments/create-order", data, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});
};

export const verifyPayment = async (paymentData) => {
	return await axios.post("/payments/verify", paymentData, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});
};
