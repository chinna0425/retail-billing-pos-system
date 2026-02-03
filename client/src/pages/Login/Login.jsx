import "./Login.css";
import login from "../../assets/assets.js";
import { loginUser } from "../../ApiServices/AuthService.js";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { ContextApi } from "../../ContextApi/ContextApi.jsx";
import toast from "react-hot-toast";

const Login = () => {
	const navigate = useNavigate();
	const { setAuthData } = useContext(ContextApi);
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState({
		email: "",
		password: "",
	});

	const showError = (msg) => {
		toast.error(msg);
		setLoading(false);
	};

	const onSubmitLogin = async (event) => {
		event.preventDefault();
		if (data.email === "") {
			showError("Please fill the email field");
			return;
		}
		if (data.password === "") {
			showError("Please fill the password field");
			return;
		}
		setLoading(true);
		try {
			const response = await loginUser(data);
			if (response.status === 200) {
				toast.success("Login successful!");
				localStorage.setItem("token", response.data.token);
				localStorage.setItem("role", response.data.role);
				// Redirect to dashboard or another page
				setAuthData(response.data.token, response.data.role);
				setData({ email: "", password: "" });
				navigate("/dashboard");
			}
		} catch (error) {
			console.error("Login error:", error);

			if (error.response) {
				const status = error.response.status;
				const message = error.response.data?.message || "Login failed";

				if (status === 401 || status === 400) {
					showError(message);
				} else {
					showError("Server error. Try again later.");
				}
			} else {
				showError("Network error. Backend not reachable.");
			}
		}
	};

	return (
		<div
			className="bg-light d-flex align-items-center justify-content-center vh-100 login-background"
			style={{
				backgroundImage: `linear-gradient(
        rgba(255,255,255,0.5),
        rgba(255,255,255,0.5)
      ),
      url(${login.login})`,
			}}
		>
			<div className="card shadow-lg w-100" style={{ maxWidth: "480px" }}>
				<div className="card-body">
					<div className="text-center">
						<h1 className="card-title">Sign in</h1>
						<p className="card-text text-muted">
							Sign in below to access your account
						</p>
					</div>
					<div className="mt-4">
						<form onSubmit={onSubmitLogin}>
							<div className="mb-4">
								<label htmlFor="email" className="form-label text-muted">
									Email address
								</label>
								<input
									value={data.email}
									onChange={(event) =>
										setData({ ...data, email: event.target.value })
									}
									type="email"
									name="email"
									className="form-control"
									id="email"
									placeholder="yourname@gmail.com"
								/>
							</div>
							<div className="mb-4">
								<label htmlFor="password" className="form-label text-muted">
									Password
								</label>
								<input
									value={data.password}
									onChange={(event) =>
										setData({ ...data, password: event.target.value })
									}
									type="password"
									name="password"
									className="form-control"
									id="password"
									placeholder="*********"
								/>
							</div>
							<div className="d-grid">
								<button
									type="submit"
									className="btn btn-dark btn-lg"
									disabled={loading}
								>
									{loading ? "Signing in..." : "Sign In"}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Login;
