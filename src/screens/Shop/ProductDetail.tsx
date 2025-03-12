import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { RouteProp } from "@react-navigation/native";

interface Product {
  id: number;
  name: string;
  image_path: string;
  min_price: number;
}

type ProductDetailRouteProp = RouteProp<
  { params: { product: Product } },
  "params"
>;

type ProductDetailProps = {
  route: ProductDetailRouteProp;
};

export default function ProductDetail({ route }: ProductDetailProps) {
  const { product } = route.params;
  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image_path }} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>Price: ${product.min_price}</Text>
      {/* ...more details if needed... */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    marginBottom: 16,
  },
});
