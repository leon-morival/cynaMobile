import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../../constants/api";
import apiClient from "../../apiClient";

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
      const response = await apiClient.get("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(response.data);
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
        await apiClient.delete("/remove-from-cart", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: { order_item_id: orderItemId },
        });
        fetchCart();
      } catch (e) {}
    },
    [fetchCart]
  );

  const handleTypeChange = useCallback(
    async (orderItemId: number, newType: string) => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;
        await apiClient.put(
          "/update-cart-item",
          {
            order_item_id: orderItemId,
            quantity: 1,
            subscription_type: newType,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        fetchCart();
      } catch (e) {}
    },
    [fetchCart]
  );

  return { cart, loading, fetchCart, handleDelete, handleTypeChange };
}
