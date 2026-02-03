import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080/api/v1.0";

export const fetchDashboardData = async () => {
	return await axios.get("/dashboard", {
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});
};
