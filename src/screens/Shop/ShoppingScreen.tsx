import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Category, SubscriptionOffer } from "../../models/Entities";
import CategoryCard from "../../components/Categories/CategoryCard";
import ProductCard from "../../components/Products/ProductCard";
import { Colors } from "../../../constants/Colors";

export default function ShoppingScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subscriptionOffers, setSubscriptionOffers] = useState<
    SubscriptionOffer[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catResponse = await fetch(
          "https://api.leonmorival.xyz/api/categories"
        );
        const catData: Category[] = await catResponse.json();
        const offerResponse = await fetch(
          "https://api.leonmorival.xyz/api/subscription-offers"
        );
        const offerData: SubscriptionOffer[] = await offerResponse.json();
        setCategories(catData);
        setSubscriptionOffers(offerData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* <Text style={styles.header}>Categories</Text> */}
      {categories.map((category) => (
        <View key={category.id} style={styles.categoryContainer}>
          <CategoryCard category={category} />
          {subscriptionOffers
            .filter((offer) => offer.category_id === category.id)
            .map((offer) => (
              <ProductCard key={offer.id} offer={offer} />
            ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 35,
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 10,
    color: "#333",
  },
  categoryContainer: {
    margin: 10,
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
});
