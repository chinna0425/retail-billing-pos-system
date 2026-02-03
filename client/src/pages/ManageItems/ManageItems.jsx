import ManageItemsForm from "../../components/ManageItemsForm/ManageItemsForm";
import ItemsList from "../../components/ItemsList/ItemsList";

import "./ManageItems.css";
const ManageItems = () => {
	return (
		<div className="items-container text-light">
			<div className="left-column">
				<ManageItemsForm />
			</div>
			<div className="right-column">
				<ItemsList />
			</div>
		</div>
	);
};
export default ManageItems;
