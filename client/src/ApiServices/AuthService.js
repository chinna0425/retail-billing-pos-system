import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080/api/v1.0";

export const loginUser = async (credentials) => {
	return await axios.post("/auth/login", credentials);
};
