import React from "react";
import { TouchableOpacity, Image, Text, StyleSheet } from "react-native";

interface Product {
  id: number;
  name: string;
  image_path: string;
  min_price: number;
}

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <TouchableOpacity style={styles.productCard}>
      <Image source={{ uri: product.image_path }} style={styles.productImage} />
      <Text style={styles.productText}>{product.name}</Text>
      <Text style={styles.productText}>${product.min_price.toFixed(2)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
