import { createContext, useEffect, useState } from "react";
import { getAllCategories } from "../ApiServices/CategoryService.js";
import { getAllItems } from "../ApiServices/ItemService.js";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
export const ContextApi = createContext(null);

export const ContextApiProvider = (props) => {
	const [categories, setCategories] = useState([]);
	const [itemsList, setItemsList] = useState([]);
	const [cartItems, setCartItems] = useState([]);
	const navigate = useNavigate();
	const [authenticated, setAuthenticated] = useState({
		token: Cookies.get("token") || null,
		role: Cookies.get("role") || null,
		loggedUserId: Cookies.get("userId") || null,
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
			try {
				const response = await getAllCategories();
				const itemsResponse = await getAllItems();
				setCategories(response.data);
				setItemsList(itemsResponse.data);
			} catch (err) {
				console.error(err);
				Cookies.remove("token");
				Cookies.remove("role");
				Cookies.remove("loggedUserId");
				setAuthenticated({ token: null, role: null, loggedUserId: null });
				navigate("/login");
			}
		}
		if (authenticated.token && authenticated.role) {
			loadData();
		}
	}, [authenticated.token, authenticated.role]);

	const setAuthData = (token, role, loggedUserId) => {
		setAuthenticated({ token, role, loggedUserId });
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
