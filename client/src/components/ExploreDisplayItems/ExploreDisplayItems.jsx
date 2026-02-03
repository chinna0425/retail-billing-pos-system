import { useContext, useState } from "react";
import "./ExploreDisplayItems.css";
import { ContextApi } from "../../ContextApi/ContextApi";
import ExploreEachItem from "../ExploreEachItem/ExploreEachItem";
import SearchBox from "../SearchBox/SearchBox";

const ExploreDisplayItems = ({ selectedCategory }) => {
	const { itemsList } = useContext(ContextApi);
	const [searchTerm, setSearchTerm] = useState("");
	let filterSelectedCategory = [];
	if (selectedCategory === "") {
		filterSelectedCategory = itemsList;
	} else {
		filterSelectedCategory = itemsList.filter(
			(eachItem) => eachItem.categoryId === selectedCategory,
		);
	}

	const filteredItems = filterSelectedCategory.filter((eachItem) =>
		eachItem.name.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	return (
		<div className="p-1">
			<div className="d-flex justify-content-between align-items-center mb-4">
				<div>
					<h5>Items</h5>
				</div>
				<div>
					<SearchBox onSearch={setSearchTerm} searchTerm={searchTerm} />
				</div>
			</div>
			<div className="row g-3">
				{filteredItems.map((item) => (
					<div key={item.itemId} className="col-sm-6 col-md-4">
						<ExploreEachItem item={item} />
					</div>
				))}
			</div>
		</div>
	);
};
export default ExploreDisplayItems;
