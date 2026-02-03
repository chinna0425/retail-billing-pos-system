import axios from "axios";
import Cookies from "js-cookie";

axios.defaults.baseURL = "http://localhost:8080/api/v1.0";

export const addCategory = async (category) => {
	return await axios.post("/admin/categories/add-category", category, {
		headers: {
			"Content-Type": "multipart/form-data",
			Authorization: `Bearer ${Cookies.get("token")}`,
		},
	});
};

export const deleteCategory = async (categoryId) => {
	return await axios.delete(`/admin/category/${categoryId}`, {
		headers: {
			Authorization: `Bearer ${Cookies.get("token")}`,
		},
	});
};

export const getAllCategories = async () => {
	return await axios.get("/categories/all-categories", {
		headers: {
			Authorization: `Bearer ${Cookies.get("token")}`,
		},
	});
};
