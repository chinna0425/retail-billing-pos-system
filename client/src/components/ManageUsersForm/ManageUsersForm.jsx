import { useState } from "react";
import toast from "react-hot-toast";
import { addUser } from "../../ApiServices/UserService";

const ManageUsersForm = ({ setUsers }) => {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState({
		name: "",
		email: "",
		password: "",
	});

	const showError = (msg) => {
		toast.error(msg);
		setLoading(false);
	};

	const onSubmitUserData = async (event) => {
		event.preventDefault();
		setLoading(true);
		if (data.name === "") {
			showError("Name is required");
			return;
		}
		if (data.email === "") {
			showError("Email is required");
			return;
		}
		if (data.password === "") {
			showError("Password is required");
			return;
		}
		if (data.name.length <= 2) {
			showError("Name is too short");
			return;
		}
		if (!data.email.endsWith("@gmail.com")) {
			showError("Provide correct Email format");
			return;
		}

		if (data.password.length < 6) {
			showError("Password is too short");
			return;
		}

		try {
			const response = await addUser(data);
			console.log("added", response);
			if (response.status === 201) {
				setUsers((prevUsers) => [...prevUsers, response.data]);
				toast.success("User added");
				setData({ name: "", email: "", password: "" });
			}
		} catch (error) {
			if (error.response) {
				toast.error(error.response.data?.message || "User already exists");
			} else {
				toast.error("Network error or server unreachable");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="mx-2 mt-2">
			<div className="row">
				<div className="card col-md-8 form-container m-auto">
					<div className="card-body">
						<h5 className="card-title mb-0">Add New User Details</h5>
						<form className="mt-3" onSubmit={onSubmitUserData}>
							<div className="mb-3">
								<label htmlFor="name" className="form-label">
									Name
								</label>
								<input
									value={data.name}
									onChange={(event) =>
										setData({ ...data, name: event.target.value })
									}
									type="text"
									name="name"
									className="form-control"
									id="name"
									placeholder="Kiran Kandula"
									required
								/>
							</div>
							<div className="mb-3">
								<label htmlFor="email" className="form-label">
									Email
								</label>
								<input
									value={data.email}
									onChange={(event) =>
										setData({ ...data, email: event.target.value })
									}
									type="text"
									name="email"
									className="form-control"
									id="email"
									placeholder="kiran@gmail.com"
									required
								/>
							</div>
							<div className="mb-3">
								<label htmlFor="password" className="form-label">
									Password
								</label>
								<input
									onChange={(event) =>
										setData({ ...data, password: event.target.value })
									}
									value={data.password}
									type="text"
									name="password"
									className="form-control"
									id="password"
									placeholder="********"
									required
								/>
							</div>
							<button
								type="submit"
								className="btn btn-warning w-100"
								disabled={loading}
							>
								{loading ? "Adding User..." : "Add User"}
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};
export default ManageUsersForm;
