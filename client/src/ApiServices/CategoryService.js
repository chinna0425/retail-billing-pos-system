import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080/api/v1.0";

export const addCategory = async (category) => {
	return await axios.post("/admin/categories/add-category", category, {
		headers: {
			"Content-Type": "multipart/form-data",
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});
};

export const deleteCategory = async (categoryId) => {
	return await axios.delete(`/admin/category/${categoryId}`, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});
};

export const getAllCategories = async () => {
	return await axios.get("/categories/all-categories", {
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});
};
