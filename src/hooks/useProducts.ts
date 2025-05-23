import { useState, useEffect } from "react";
import { Category, Product } from "../models/Entities";
import { API_URL } from "../../constants/api";

export const useProducts = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subscriptionOffers, setSubscriptionOffers] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDataReady, setIsDataReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch categories
      const catResponse = await fetch(`${API_URL}/categories`);
      if (!catResponse.ok) {
        throw new Error(`Error fetching categories: ${catResponse.status}`);
      }
      const catData = await catResponse.json();
      console.log("Categories data:", JSON.stringify(catData, null, 2));

      // Fetch subscription offers
      const offerResponse = await fetch(`${API_URL}/products`);
      if (!offerResponse.ok) {
        throw new Error(
          `Error fetching subscription offers: ${offerResponse.status}`
        );
      }
      const offerData = await offerResponse.json();
      console.log("offers data:", JSON.stringify(offerData, null, 2));
      // Update state with fetched data
      // Map API categories to expected Category shape
      setCategories(
        (catData.member || []).map((cat: any) => ({
          ...cat,
          name: cat.slug,
          image_path: cat.image_path || null,
        }))
      );
      setSubscriptionOffers(offerData || []);
      setIsDataReady(true);

      console.log(
        `Data loaded: ${catData.member?.length || 0} categories, ${
          offerData?.length || 0
        } products`
      );
    } catch (err) {
      console.error("Error fetching products data:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      // Even if there's an error, we should mark data as ready so the app can proceed
      setIsDataReady(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    let isMounted = true;

    const initFetch = async () => {
      try {
        await fetchData();
      } catch (err) {
        if (isMounted) {
          console.error("Failed to fetch products:", err);
        }
      }
    };

    initFetch();

    return () => {
      isMounted = false;
    };
  }, []);

  // Find a product by ID
  const findProductById = (id: number): Product | undefined => {
    return subscriptionOffers.find((product) => product.id === id);
  };

  // Get products by category
  const getProductsByCategory = (categoryId: number): Product[] => {
    return subscriptionOffers.filter(
      (product) => product.category_id === categoryId
    );
  };

  // Search products
  const searchProducts = (query: string): Product[] => {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return subscriptionOffers;

    return subscriptionOffers.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
  };

  // Manually refresh data
  const refreshData = () => {
    fetchData();
  };

  return {
    categories,
    subscriptionOffers,
    isLoading,
    isDataReady,
    error,
    findProductById,
    getProductsByCategory,
    searchProducts,
    refreshData,
  };
};
