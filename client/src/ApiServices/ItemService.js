import axios from "axios";
import Cookies from "js-cookie";

axios.defaults.baseURL = "http://localhost:8080/api/v1.0";

export const addItem = async (item) => {
	return await axios.post("/admin/items/add-item", item, {
		headers: {
			"Content-Type": "multipart/form-data",
			Authorization: `Bearer ${Cookies.get("token")}`,
		},
	});
};

export const getAllItems = async () => {
	return axios.get("/items/all-items", {
		headers: {
			"Content-Type": "multipart/form-data",
			Authorization: `Bearer ${Cookies.get("token")}`,
		},
	});
};

export const deleteItem = async (itemId) => {
	return axios.delete(`/admin/item/${itemId}`, {
		headers: {
			"Content-Type": "multipart/form-data",
			Authorization: `Bearer ${Cookies.get("token")}`,
		},
	});
};
