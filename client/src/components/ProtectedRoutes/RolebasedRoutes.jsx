import { Navigate } from "react-router-dom";
import { ContextApi } from "../../ContextApi/ContextApi";
import { useContext } from "react";

const RoleBasedRoutes = ({ children, roles }) => {
	const { authenticated } = useContext(ContextApi);

	if (!roles.includes(authenticated.role)) {
		return <Navigate to="/dashboard" replace />;
	}

	return children;
};

export default RoleBasedRoutes;
