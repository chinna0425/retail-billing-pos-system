import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import Explore from "./pages/Explore/Explore";
import ManageItems from "./pages/ManageItems/ManageItems";
import ManageUsers from "./pages/ManageUsers/MangeUsers";
import ManageCategories from "./pages/ManageCategories/ManageCategories";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login/Login";
import OrderHistory from "./pages/OrderHistory/OrderHistory";
import MenuBar from "./components/MenuBar/MenuBar";
import { useContext } from "react";
import { ContextApi } from "./ContextApi/ContextApi";
import NotFound from "./pages/NotFound/Notfound";

const App = () => {
	const location = useLocation();

	const { authenticated } = useContext(ContextApi);

	const LoginRoute = ({ element }) => {
		if (authenticated.token) {
			return <Navigate to="/" replace />;
		}
		return element;
	};

	const ProtectedRoute = ({ element, allowedRoles }) => {
		if (!authenticated.token) {
			return <Navigate to="/login" replace />;
		}

		if (allowedRoles && !allowedRoles.includes(authenticated.role)) {
			return <Navigate to="/dashboard" replace />;
		}

		return element;
	};

	return (
		<div>
			{location.pathname !== "/login" && <MenuBar />}
			<Toaster />
			<Routes>
				<Route path="/login" element={<LoginRoute element={<Login />} />} />

				{/* Anyone can access */}

				<Route
					path="/dashboard"
					element={
						<ProtectedRoute
							element={<Dashboard />}
							allowedRoles={["ROLE_ADMIN", "ROLE_USER"]}
						/>
					}
				/>
				<Route
					path="/explore"
					element={
						<ProtectedRoute
							element={<Explore />}
							allowedRoles={["ROLE_ADMIN", "ROLE_USER"]}
						/>
					}
				/>
				<Route
					path="/orders-history"
					element={
						<ProtectedRoute
							element={<OrderHistory />}
							allowedRoles={["ROLE_ADMIN", "ROLE_USER"]}
						/>
					}
				/>
				<Route
					path="/"
					element={
						<ProtectedRoute
							element={<Dashboard />}
							allowedRoles={["ROLE_ADMIN", "ROLE_USER"]}
						/>
					}
				/>

				{/* Only Admin can access */}
				<Route
					path="/manage-items"
					element={
						<ProtectedRoute
							element={<ManageItems />}
							allowedRoles={["ROLE_ADMIN"]}
						/>
					}
				/>
				<Route
					path="/manage-users"
					element={
						<ProtectedRoute
							element={<ManageUsers />}
							allowedRoles={["ROLE_ADMIN"]}
						/>
					}
				/>
				<Route
					path="/manage-categories"
					element={
						<ProtectedRoute
							element={<ManageCategories />}
							allowedRoles={["ROLE_ADMIN"]}
						/>
					}
				/>
				<Route path="/not-found" element={<NotFound />} />
				<Route path="*" element={<Navigate to="/not-found" replace />} />
			</Routes>
		</div>
	);
};

export default App;
