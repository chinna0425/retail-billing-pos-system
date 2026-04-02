import Cookies from "js-cookie";
import API from "./api";

export const createRazorpayOrder = async (data) => {
	return await API.post("/payments/create-order", data, {
		headers: {
			Authorization: `Bearer ${Cookies.get("token")}`,
		},
	});
};

export const verifyPayment = async (paymentData) => {
	return await API.post("/payments/verify", paymentData, {
		headers: {
			Authorization: `Bearer ${Cookies.get("token")}`,
		},
	});
};
