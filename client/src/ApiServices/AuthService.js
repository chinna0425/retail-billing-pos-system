import API from "./api";

export const loginUser = async (credentials) => {
	return await API.post("/auth/login", credentials);
};
