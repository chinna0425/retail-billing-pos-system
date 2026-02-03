import CategoriesListItems from "../../components/CategoriesListItems/CategoriesListItems";
import ManageCategoriesForm from "../../components/ManageCategoriesForm/ManageCategoriesForm";

import "./ManageCategories.css";

const ManageCategories = () => {
	return (
		<div className="category-container text-light">
			<div className="left-column">
				<ManageCategoriesForm />
			</div>
			<div className="right-column">
				<CategoriesListItems />
			</div>
		</div>
	);
};
export default ManageCategories;
