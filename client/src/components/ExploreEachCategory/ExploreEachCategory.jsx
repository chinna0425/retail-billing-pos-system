import "./ExploreEachCategory.css";

const ExploreEachCategory = ({ isSelected, category, onClickHandler }) => {
	const cardBgColors = [
		{ bgColor: "#E3F2FD" }, // soft blue
		{ bgColor: "#FCE4EC" }, // soft pink
		{ bgColor: "#E8F5E9" }, // soft green
		{ bgColor: "#FFF3E0" }, // soft orange
		{ bgColor: "#F3E5F5" }, // soft purple
		{ bgColor: "#E0F7FA" }, // soft cyan
		{ bgColor: "#F9FBE7" }, // soft lime
		{ bgColor: "#ECEFF1" }, // soft gray
	];
	const bgColor =
		cardBgColors[Math.floor(Math.random() * cardBgColors.length)].bgColor;

	const { imgUrl, itemsCount, name } = category;
	const onClickItem = () => {
		onClickHandler(category.categoryId);
	};
	return (
		<div
			className="d-flex align-items-center p-3 rounded gap-1 position-relative category-hover"
			style={{
				backgroundColor: `${bgColor}`,
				color: "#263238",
				cursor: "pointer",
			}}
			onClick={onClickItem}
		>
			<div style={{ position: "relative", marginRight: "15px" }}>
				<img src={imgUrl} alt={name} className="category-image" />
			</div>
			<div>
				<h5 className="mb-0">{name}</h5>
				<p className="mb-0">{itemsCount}</p>
			</div>
			{isSelected && <div className="active-category"></div>}
		</div>
	);
};
export default ExploreEachCategory;
