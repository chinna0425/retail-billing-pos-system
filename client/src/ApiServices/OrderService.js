import axios from "axios";
import Cookies from "js-cookie";

axios.defaults.baseURL = "http://localhost:8080/api/v1.0";

export const getAllNewOrders = async () => {
	return await axios.get("/orders/all-orders", {
		headers: {
			Authorization: `Bearer ${Cookies.get("token")}`,
		},
	});
};

export const createOrder = async (order) => {
	return await axios.post("/orders/create", order, {
		headers: {
			Authorization: `Bearer ${Cookies.get("token")}`,
		},
	});
};

export const deleteOrder = async (orderId) => {
	return await axios.delete(`/orders/${orderId}`, {
		headers: {
			Authorization: `Bearer ${Cookies.get("token")}`,
		},
	});
};
