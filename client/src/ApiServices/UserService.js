import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080/api/v1.0";

export const addUser = async (user) => {
	return await axios.post("/admin/users/register", user, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});
};

export const getAllUsers = async () => {
	return await axios.get("/users/all-users", {
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});
};

export const deleteUser = async (userId) => {
	return await axios.delete(`/admin/user/${userId}`, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});
};
