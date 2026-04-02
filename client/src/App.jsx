import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import Explore from "./pages/Explore/Explore";
import ManageItems from "./pages/ManageItems/ManageItems";
import ManageUsers from "./pages/ManageUsers/MangeUsers";
import ManageCategories from "./pages/ManageCategories/ManageCategories";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login/Login";
import OrderHistory from "./pages/OrderHistory/OrderHistory";
import { useContext } from "react";
import { ContextApi } from "./ContextApi/ContextApi";
import NotFound from "./pages/NotFound/Notfound";
import ProtectedRoutes from "./components/ProtectedRoutes/ProtectedRoutes";
import RoleBasedRoutes from "./components/ProtectedRoutes/RolebasedRoutes";
import Layout from "./components/Layout/Layout";

const App = () => {
	const { authenticated } = useContext(ContextApi);

	const LoginRoute = ({ element }) => {
		if (authenticated.token) {
			return <Navigate to="/" replace />;
		}
		return element;
	};

	return (
		<>
			<Toaster />
			<Routes>
				<Route path="/login" element={<LoginRoute element={<Login />} />} />

				<Route
					path="/"
					element={
						<ProtectedRoutes
							element={<Layout />}
							allowedRoles={["ROLE_ADMIN", "ROLE_USER"]}
						/>
					}
				>
					<Route index element={<Dashboard />} />
					<Route path="dashboard" element={<Dashboard />} />
					<Route path="explore" element={<Explore />} />
					<Route path="orders-history" element={<OrderHistory />} />

					<Route
						path="manage-items"
						element={
							<RoleBasedRoutes roles={["ROLE_ADMIN"]}>
								<ManageItems />
							</RoleBasedRoutes>
						}
					/>
					<Route
						path="manage-users"
						element={
							<RoleBasedRoutes roles={["ROLE_ADMIN"]}>
								<ManageUsers />
							</RoleBasedRoutes>
						}
					/>
					<Route
						path="manage-categories"
						element={
							<RoleBasedRoutes roles={["ROLE_ADMIN"]}>
								<ManageCategories />
							</RoleBasedRoutes>
						}
					/>

					<Route path="not-found" element={<NotFound />} />
					<Route path="*" element={<NotFound />} />
				</Route>

				<Route path="*" element={<Navigate to="/login" replace />} />
			</Routes>
		</>
	);
};

export default App;
