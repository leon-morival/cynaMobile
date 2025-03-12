import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useState, useEffect } from "react";
import CategoryCard from "../../components/Categories/CategoryCard";
import ProductCard from "../../components/Products/ProductCard";
import { useNavigation } from "@react-navigation/native";
import React from "react";

interface Category {
  id: number;
  name: string;
  image_path: string;
}

interface Product {
  id: number;
  name: string;
  image_path: string;
  min_price: number;
}

export default function ShoppingScreen() {
  const navigation = useNavigation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [productLoading, setProductLoading] = useState<boolean>(false);
  const [productError, setProductError] = useState<any>(null);

  useEffect(() => {
    fetch("https://api.leonmorival.xyz/api/categories")
      .then((response) => response.json())
      .then((data: Category[]) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setProductLoading(true);
    setProductError(null);

    fetch(`https://api.leonmorival.xyz/api/categories/${category.id}/products`)
      .then((response) => response.json())
      .then((data: Product[]) => {
        setProducts(data);
        setProductLoading(false);
      })
      .catch((err) => {
        setProductError(err);
        setProductLoading(false);
      });
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shop Categories</Text>
      <ScrollView contentContainerStyle={styles.cardContainer}>
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onPress={() => handleCategorySelect(category)}
          />
        ))}
      </ScrollView>

      {selectedCategory && (
        <>
          <Text style={styles.productsTitle}>
            Products in {selectedCategory.name}
          </Text>
          {productLoading ? (
            <Text>Loading products...</Text>
          ) : productError ? (
            <Text>Error: {productError.message}</Text>
          ) : (
            <ScrollView contentContainerStyle={styles.productsContainer}>
              {products.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={styles.productTouchArea} // added style to control touch area width
                  // onPress={() => navigation.navigate("ProductDetail", { product })}
                >
                  <ProductCard product={product} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    marginTop: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "500",
  },
  productsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 16,
  },
  productsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productTouchArea: {
    // new style added to wrap the product card
    width: "48%",
    marginBottom: 16,
  },
  productCard: {
    width: "48%",
    backgroundColor: "#e8f4fc",
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  productText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
