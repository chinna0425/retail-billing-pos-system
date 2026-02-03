import { useContext } from "react";
import "./ExploreDisplayCartItems.css";
import { ContextApi } from "../../ContextApi/ContextApi";

const ExploreDisplayCartItems = () => {
	const { cartItems, updateQuantity, removeCartItem } = useContext(ContextApi);

	return (
		<div className="p-3 h-100 overflow-y-auto">
			{cartItems.length === 0 ? (
				<div className="d-flex flex-column justify-content-center align-items-center h-100 w-100">
					<p className="text-light">Your Cart is Empty</p>
				</div>
			) : (
				<div className="cart-items-list">
					{cartItems.map((item) => (
						<div
							key={item.itemId}
							className="cart-item mb-3 p-3 bg-dark rounded"
						>
							<div className="d-flex justify-content-between align-items-center mb-2">
								<h6 className="mb-0 text-light">{item.name}</h6>
								<p className="mb-0 text-light">
									₹{(item.price * item.quantity).toFixed(2)}
								</p>
							</div>
							<div className="d-flex justify-content-between align-item-center">
								<div className="d-flex align-items-center gap-2">
									<button
										className="btn btn-danger btn-sm"
										onClick={() =>
											updateQuantity(item.itemId, item.quantity - 1)
										}
									>
										<i className="bi bi-dash"></i>
									</button>
									<span className="text-light">{item.quantity}</span>
									<button
										className="btn btn-primary btn-sm"
										onClick={() =>
											updateQuantity(item.itemId, item.quantity + 1)
										}
									>
										<i className="bi bi-plus"></i>
									</button>
								</div>
								<button
									className="btn btn-danger btn-sm"
									onClick={() => removeCartItem(item.itemId)}
									style={{ width: "auto" }}
								>
									<i className="bi bi-trash"></i>
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default ExploreDisplayCartItems;
