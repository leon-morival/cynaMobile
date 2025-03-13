import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SubscriptionOffer } from "../models/Entities";

export type SubscriptionType = "monthly" | "annual";

export const useCart = () => {
  const [cart, setCart] = useState<SubscriptionOffer[]>([]);
  const [subscriptionTypes, setSubscriptionTypes] = useState<{
    [key: number]: SubscriptionType;
  }>({});

  // Load cart data from AsyncStorage
  const loadCartData = async () => {
    try {
      const storedCart = await AsyncStorage.getItem("cart");
      if (storedCart !== null) {
        const parsedCart = JSON.parse(storedCart);
        setCart(parsedCart);

        // Initialize subscription types to monthly for all items
        const types: { [key: number]: SubscriptionType } = {};
        parsedCart.forEach((item: SubscriptionOffer) => {
          types[item.id] = "monthly";
        });
        setSubscriptionTypes(types);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.log("Error loading cart from storage:", error);
    }
  };

  // Update subscription type (monthly/annual)
  const updateSubscriptionType = (itemId: number, type: SubscriptionType) => {
    setSubscriptionTypes((prev) => ({
      ...prev,
      [itemId]: type,
    }));
  };

  // Update cart item quantity
  const updateCartItem = async (itemId: number, newQuantity: number) => {
    try {
      let updatedCart;

      if (newQuantity <= 0) {
        // Remove the item if quantity is 0 or negative
        updatedCart = cart.filter((item) => item.id !== itemId);
      } else {
        // Update quantity
        updatedCart = cart.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        );
      }

      setCart(updatedCart);
      await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.log("Error updating cart item:", error);
    }
  };

  // Delete item from cart
  const deleteCartItem = (itemId: number) => {
    updateCartItem(itemId, 0);
  };

  // Calculate total amount
  const calculateTotalAmount = () => {
    return cart.reduce((acc, item) => {
      const multiplier = subscriptionTypes[item.id] === "annual" ? 10 : 1;
      return acc + item.price * multiplier;
    }, 0);
  };

  // Clear the cart
  const clearCart = async () => {
    try {
      await AsyncStorage.removeItem("cart");
      setCart([]);
    } catch (error) {
      console.log("Error clearing cart:", error);
    }
  };

  return {
    cart,
    subscriptionTypes,
    loadCartData,
    updateSubscriptionType,
    updateCartItem,
    deleteCartItem,
    calculateTotalAmount,
    clearCart,
  };
};
