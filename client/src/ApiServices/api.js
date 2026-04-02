import axios from "axios";

// base URL from environment
const API = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

export default API;
