import Cookies from "js-cookie";
import API from "./api";

export const fetchDashboardData = async () => {
	return await API.get("/dashboard", {
		headers: {
			Authorization: `Bearer ${Cookies.get("token")}`,
		},
	});
};
