import Cookies from "js-cookie";
import API from "./api";

export const addCategory = async (category) => {
	return await API.post("/admin/categories/add-category", category, {
		headers: {
			"Content-Type": "multipart/form-data",
			Authorization: `Bearer ${Cookies.get("token")}`,
		},
	});
};

export const deleteCategory = async (categoryId) => {
	return await API.delete(`/admin/category/${categoryId}`, {
		headers: {
			Authorization: `Bearer ${Cookies.get("token")}`,
		},
	});
};

export const getAllCategories = async () => {
	return await API.get("/categories/all-categories", {
		headers: {
			Authorization: `Bearer ${Cookies.get("token")}`,
		},
	});
};
