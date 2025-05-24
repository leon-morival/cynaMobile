import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Category } from "../../models/Entities";
import { Colors } from "../../../constants/Colors";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <View style={styles.categoryHeader}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{category.slug}</Text>
        <View style={styles.underline} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  imagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 5,
  },
  underline: {
    height: 3,
    width: 40,
    backgroundColor: Colors.secondary,
    borderRadius: 2,
  },
});

export default CategoryCard;
