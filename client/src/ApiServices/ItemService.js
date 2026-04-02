import Cookies from "js-cookie";
import API from "./api";

export const addItem = async (item) => {
	return await API.post("/admin/items/add-item", item, {
		headers: {
			"Content-Type": "multipart/form-data",
			Authorization: `Bearer ${Cookies.get("token")}`,
		},
	});
};

export const getAllItems = async () => {
	return API.get("/items/all-items", {
		headers: {
			"Content-Type": "multipart/form-data",
			Authorization: `Bearer ${Cookies.get("token")}`,
		},
	});
};

export const deleteItem = async (itemId) => {
	return API.delete(`/admin/item/${itemId}`, {
		headers: {
			"Content-Type": "multipart/form-data",
			Authorization: `Bearer ${Cookies.get("token")}`,
		},
	});
};
