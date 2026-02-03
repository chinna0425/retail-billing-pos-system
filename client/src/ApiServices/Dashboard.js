import axios from "axios";
import Cookies from "js-cookie";

axios.defaults.baseURL = "http://localhost:8080/api/v1.0";

export const fetchDashboardData = async () => {
	return await axios.get("/dashboard", {
		headers: {
			Authorization: `Bearer ${Cookies.get("token")}`,
		},
	});
};
