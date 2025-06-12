import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../../constants/api";

export function useCart() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setCart(null);
        setLoading(false);
        return;
      }
      const response = await fetch(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        setCart(null);
      } else {
        const data = await response.json();
        setCart(data);
      }
    } catch (e) {
      setCart(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleDelete = useCallback(
    async (orderItemId: number) => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;
        const response = await fetch(`${API_URL}/remove-from-cart`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ order_item_id: orderItemId }),
        });
        if (response.ok) {
          fetchCart();
        }
      } catch (e) {}
    },
    [fetchCart]
  );

  const handleTypeChange = useCallback(
    async (orderItemId: number, newType: string) => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;
        const response = await fetch(`${API_URL}/update-cart-item`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            order_item_id: orderItemId,
            quantity: 1,
            subscription_type: newType,
          }),
        });
        if (response.ok) {
          fetchCart();
        }
      } catch (e) {}
    },
    [fetchCart]
  );

  return { cart, loading, fetchCart, handleDelete, handleTypeChange };
}
