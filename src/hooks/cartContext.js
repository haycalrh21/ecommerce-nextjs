// src/hooks/cartContext.js

import React, { createContext, useContext, useEffect, useState } from "react";

// Membuat context untuk CartContext
const CartContext = createContext();

export const CartProvider = ({ children }) => {
	const [cart, setCart] = useState([]);

	useEffect(() => {
		const savedCart = localStorage.getItem("cart");
		if (savedCart) {
			setCart(JSON.parse(savedCart));
		}
	}, []);

	const addToCart = (item) => {
		setCart((prevCart) => {
			const itemIndex = prevCart.findIndex(
				(cartItem) => cartItem._id === item._id && cartItem.name === item.name
			);
			let updatedCart;
			if (itemIndex !== -1) {
				updatedCart = prevCart.map((cartItem, index) =>
					index === itemIndex
						? { ...cartItem, quantity: cartItem.quantity + 1 }
						: cartItem
				);
			} else {
				updatedCart = [...prevCart, { ...item, quantity: 1 }];
			}
			saveCartToLocalStorage(updatedCart);
			return updatedCart;
		});
	};

	const removeFromCart = (itemId) => {
		setCart((prevCart) => {
			const updatedCart = prevCart
				.map((item) => {
					if (item.id === itemId && item.quantity > 0) {
						return { ...item, quantity: item.quantity - 1 };
					}
					return item;
				})
				.filter((item) => item.quantity > 0 || item.id !== itemId);

			saveCartToLocalStorage(updatedCart);
			return updatedCart;
		});
	};

	const clearCart = () => {
		setCart([]);
		localStorage.removeItem("cart");
	};

	const saveCartToLocalStorage = (cart) => {
		localStorage.setItem("cart", JSON.stringify(cart));
	};

	return (
		<CartContext.Provider
			value={{ cart, addToCart, removeFromCart, clearCart }}
		>
			{children}
		</CartContext.Provider>
	);
};

export const useCart = () => {
	return useContext(CartContext);
};
