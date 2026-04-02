import { Navigate } from "react-router-dom";
import { ContextApi } from "../../ContextApi/ContextApi";
import { useContext } from "react";

const ProtectedRoutes = ({ element, allowedRoles }) => {
	const { authenticated } = useContext(ContextApi);
	if (!authenticated.token) {
		return <Navigate to="/login" replace />;
	}

	if (allowedRoles && !allowedRoles.includes(authenticated.role)) {
		return <Navigate to="/dashboard" replace />;
	}

	return element;
};
export default ProtectedRoutes;
