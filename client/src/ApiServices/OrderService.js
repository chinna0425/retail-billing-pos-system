import Cookies from "js-cookie";
import API from "./api";

export const getAllNewOrders = async () => {
	return await API.get("/orders/all-orders", {
		headers: {
			Authorization: `Bearer ${Cookies.get("token")}`,
		},
	});
};

export const createOrder = async (order) => {
	return await API.post("/orders/create", order, {
		headers: {
			Authorization: `Bearer ${Cookies.get("token")}`,
		},
	});
};

export const deleteOrder = async (orderId) => {
	return await API.delete(`/orders/${orderId}`, {
		headers: {
			Authorization: `Bearer ${Cookies.get("token")}`,
		},
	});
};
