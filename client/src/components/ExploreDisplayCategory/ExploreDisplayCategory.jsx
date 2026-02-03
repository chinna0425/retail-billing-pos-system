import ExploreEachCategory from "../ExploreEachCategory/ExploreEachCategory.jsx";

import "./ExploreDisplayCategory.css";

const ExploreDisplayCategory = ({
	selectedCategory,
	setSelectedCategory,
	categories,
}) => {
	const onClickHandler = (categoryId) => {
		if (selectedCategory !== categoryId) {
			setSelectedCategory(categoryId);
		} else {
			setSelectedCategory("");
		}
	};
	return (
		<div className="row g-3" style={{ width: "100%", margin: 0 }}>
			{categories.map((category) => (
				<div
					key={category.categoryId}
					className="col-md-3 col-sm-6"
					style={{ padding: "0 10px" }}
				>
					<ExploreEachCategory
						isSelected={selectedCategory === category.categoryId}
						category={category}
						onClickHandler={onClickHandler}
					/>
				</div>
			))}
		</div>
	);
};

export default ExploreDisplayCategory;
