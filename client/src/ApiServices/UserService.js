import Cookies from "js-cookie";
import API from "./api";

export const addUser = async (user) => {
	return await API.post("/admin/users/register", user, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${Cookies.get("token")}`,
		},
	});
};

export const getAllUsers = async () => {
	return await API.get("/users/all-users", {
		headers: {
			Authorization: `Bearer ${Cookies.get("token")}`,
		},
	});
};

export const deleteUser = async (userId) => {
	return await API.delete(`/admin/user/${userId}`, {
		headers: {
			Authorization: `Bearer ${Cookies.get("token")}`,
		},
	});
};
