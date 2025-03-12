import React from "react";
import { TouchableOpacity, Image, Text, StyleSheet } from "react-native";

interface Category {
  id: number;
  name: string;
  image_path: string;
}

interface Props {
  category: Category;
  onPress: () => void;
}

export default function CategoryCard({ category, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: category.image_path }} style={styles.cardImage} />
      <Text style={styles.cardText}>{category.name}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
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
});
