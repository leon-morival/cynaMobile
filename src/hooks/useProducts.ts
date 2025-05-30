import { useState, useEffect } from "react";
import { Category, Product } from "../models/Entities";
import { API_URL } from "../../constants/api";
import { useLanguage } from "../context/LanguageContext";
import { translateEntity } from "../utils/translationUtils";

export const useProducts = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
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
      const catData: Category[] = await catResponse.json();

      const offerResponse = await fetch(`${API_URL}/products`);
      if (!offerResponse.ok) {
        throw new Error(`Error fetching products: ${offerResponse.status}`);
      }
      const productsData: Product[] = await offerResponse.json();

      setCategories(catData || []);
      setProducts(productsData || []);
      setIsDataReady(true);
    } catch (err) {
      console.error("Error fetching products data:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
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
    return products.find((product) => product.id === id);
  };

  // Get products by category
  const getProductsByCategory = (categoryId: number): Product[] => {
    return products.filter((product) => product.category_id === categoryId);
  };

  // Search products
  const searchProducts = (query: string, lang: string): Product[] => {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return products;

    return products.filter((product) =>
      product.translations.some(
        (translation) =>
          translation.lang === lang &&
          (translation.name.toLowerCase().includes(searchTerm) ||
            translation.description?.toLowerCase().includes(searchTerm))
      )
    );
  };

  // Manually refresh data
  const refreshData = () => {
    fetchData();
  };

  return {
    categories,
    products,
    isLoading,
    isDataReady,
    error,
    findProductById,
    getProductsByCategory,
    searchProducts,
    refreshData,
  };
};
