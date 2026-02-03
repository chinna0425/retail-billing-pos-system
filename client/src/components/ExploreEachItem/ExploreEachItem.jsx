import { useContext } from "react";
import "./ExploreEachItem.css";
import { ContextApi } from "../../ContextApi/ContextApi";

const ExploreEachItem = ({ item }) => {
	const { addToCart } = useContext(ContextApi);
	const { name, price, imgUrl } = item;
	const handleAddToCart = () => {
		addToCart(item);
	};
	return (
		<div className="p-3 bg-dark rounded shadow-sm h-100 d-flex align-items-center item-card">
			<div style={{ position: "relative", marginRight: "15px" }}>
				<img src={imgUrl} className="item-image" alt={name} />
			</div>
			<div className="flex-grow-1 ms-2">
				<h6 className="mb-1 text-light">{name}</h6>
				<p className="mb-0 fw-bold text-light">₹{price}</p>
			</div>
			<div
				className="d-flex flex-column justify-content-between align-items-center ms-3"
				style={{ height: "100%" }}
			>
				<i className="bi bi-cart-plus fs-4 text-warning mb-1"></i>
				<button className="btn btn-success btn-sm" onClick={handleAddToCart}>
					<i className="bi bi-plus"></i>
				</button>
			</div>
		</div>
	);
};
export default ExploreEachItem;
