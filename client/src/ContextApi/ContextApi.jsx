import { createContext, useEffect, useState } from "react";
import { getAllCategories } from "../ApiServices/CategoryService.js";
import { getAllItems } from "../ApiServices/ItemService.js";
export const ContextApi = createContext(null);

export const ContextApiProvider = (props) => {
	const [categories, setCategories] = useState([]);
	const [itemsList, setItemsList] = useState([]);
	const [cartItems, setCartItems] = useState([]);
	const [authenticated, setAuthenticated] = useState({
		token: localStorage.getItem("token") || null,
		role: localStorage.getItem("role") || null,
	});

	const addToCart = (item) => {
		const existingItem = cartItems.find(
			(cartItem) => cartItem.name === item.name,
		);
		if (existingItem) {
			setCartItems((prevItems) =>
				prevItems.map((eachItem) =>
					eachItem.itemId === item.itemId
						? { ...eachItem, quantity: eachItem.quantity + 1 }
						: eachItem,
				),
			);
		} else {
			setCartItems((prevItems) => [...prevItems, { ...item, quantity: 1 }]);
		}
	};

	const clearCart = () => {
		setCartItems([]);
	};

	const removeCartItem = (itemId) => {
		setCartItems((prevItems) =>
			prevItems.filter((eachItem) => eachItem.itemId !== itemId),
		);
	};

	const updateQuantity = (itemId, quantity) => {
		if (quantity === 0) {
			setCartItems((prevItems) =>
				prevItems.filter((eachItem) => eachItem.itemId !== itemId),
			);
		} else {
			setCartItems((prevItems) =>
				prevItems.map((eachItem) =>
					eachItem.itemId === itemId
						? { ...eachItem, quantity: quantity }
						: eachItem,
				),
			);
		}
	};

	useEffect(() => {
		async function loadData() {
			const response = await getAllCategories();
			const itemsResponse = await getAllItems();
			setCategories(response.data);
			setItemsList(itemsResponse.data);
		}
		if (authenticated.token && authenticated.role) {
			loadData();
		}
	}, [authenticated]);

	const setAuthData = (token, role) => {
		setAuthenticated({ token, role });
	};

	const contextValue = {
		categories,
		setCategories,
		itemsList,
		setItemsList,
		authenticated,
		setAuthData,
		addToCart,
		cartItems,
		updateQuantity,
		removeCartItem,
		clearCart,
	};

	return (
		<ContextApi.Provider value={contextValue}>
			{props.children}
		</ContextApi.Provider>
	);
};
