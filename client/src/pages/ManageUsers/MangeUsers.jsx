import { useEffect, useState } from "react";
import ManageUsersForm from "../../components/ManageUsersForm/ManageUsersForm";
import UsersListItems from "../../components/UsersListItems/UsersListItems";
import "./ManageUsers.css";
import { getAllUsers } from "../../ApiServices/UserService";
import toast from "react-hot-toast";
const ManageUsers = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		async function fetchUsers() {
			try {
				setLoading(true);
				const response = await getAllUsers();
				if (response.status === 200) {
					setUsers(response.data);
				}
			} catch (error) {
				toast.error("Unable to fetch Users");
			} finally {
				setLoading(false);
			}
		}
		fetchUsers();
	}, []);

	return (
		<div className="users-container text-light">
			<div className="left-column d-flex flex-column justify-content-center">
				<ManageUsersForm setUsers={setUsers} />
			</div>
			<div className="right-column">
				<UsersListItems users={users} setUsers={setUsers} />
			</div>
		</div>
	);
};
export default ManageUsers;
