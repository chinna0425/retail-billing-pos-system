import toast from "react-hot-toast";
import { deleteUser } from "../../ApiServices/UserService";
import { useContext, useState } from "react";
import { ContextApi } from "../../ContextApi/ContextApi";

const UsersListItems = ({ users, setUsers }) => {
	const [searchTerm, setSearchTerm] = useState("");
	const { authenticated } = useContext(ContextApi);

	const filteredUsers = users.filter((user) =>
		user.name.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const deleteByUserId = async (userId) => {
		try {
			const response = await deleteUser(userId);
			if (response.status === 204) {
				toast.success("Deleted User");
				setUsers((prevUsers) =>
					prevUsers.filter((user) => user.userId !== userId),
				);
			}
		} catch (error) {
			console.log("Delete user", error);
			toast.error(error.response.data.message);
		}
	};

	return (
		<div
			className="category-list-container"
			style={{ height: "100vh", overflowY: "auto", overflowX: "hidden" }}
		>
			<div className="row pe-2">
				<div className="input-group mb-3">
					<input
						name="keyword"
						id="keyword"
						type="text"
						className="form-control"
						placeholder="Search User..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<span className="input-group-text bg-warning">
						<i className="bi bi-search"></i>
					</span>
				</div>
			</div>
			<div className="row g-3 pe-2">
				{filteredUsers.map((user) => (
					<div key={user.userId} className="col-12">
						<div className="card p-3 bg-dark">
							<div className="d-flex align-items-center">
								<div className="flex-grow-1">
									<h5 className="mb-1 text-white">{user.name}</h5>
									<p className="mb-0 text-white">{user.email}</p>
								</div>
								<div>
									<button
										className="btn btn-danger btn-sm"
										onClick={() => deleteByUserId(user.userId)}
										disabled={user.userId === authenticated.loggedUserId}
									>
										<i className="bi bi-trash"></i>
									</button>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
export default UsersListItems;
