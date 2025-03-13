import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Category, SubscriptionOffer } from "../../models/Entities";
import CategoryCard from "../../components/Categories/CategoryCard";
import ProductCard from "../../components/Products/ProductCard";
import { Colors } from "../../../constants/Colors";
import { API_URL } from "../../../constants/api";
import { Ionicons } from "@expo/vector-icons";

export default function ShoppingScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subscriptionOffers, setSubscriptionOffers] = useState<
    SubscriptionOffer[]
  >([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filter offers based on search query
  const filteredOffers =
    searchQuery.trim() === ""
      ? subscriptionOffers
      : subscriptionOffers.filter(
          (offer) =>
            offer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            offer.description.toLowerCase().includes(searchQuery.toLowerCase())
        );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const catResponse = await fetch(`${API_URL}/categories`);
        const catData = await catResponse.json();
        setCategories(catData.member);

        const offerResponse = await fetch(`${API_URL}/subscription-offers`);
        const offerData: SubscriptionOffer[] = await offerResponse.json();
        setSubscriptionOffers(offerData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={Colors.darkGray}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher des produits..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== "" && (
          <Ionicons
            name="close-circle"
            size={20}
            color={Colors.darkGray}
            style={styles.clearIcon}
            onPress={() => setSearchQuery("")}
          />
        )}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.secondary} />
          <Text style={styles.loadingText}>Chargement des produits...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {categories && categories.length > 0 ? (
            searchQuery.trim() === "" ? (
              // Show categories when not searching
              categories.map((category) => {
                const categoryOffers = filteredOffers.filter(
                  (offer) => offer.category_id === category.id
                );

                // Skip categories with no offers
                if (categoryOffers.length === 0) return null;

                return (
                  <View key={category.id} style={styles.categorySection}>
                    <CategoryCard category={category} />
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.productsRow}
                    >
                      {categoryOffers.map((offer) => (
                        <ProductCard key={offer.id} offer={offer} />
                      ))}
                    </ScrollView>
                  </View>
                );
              })
            ) : (
              // Show all filtered results when searching
              <View style={styles.searchResultsContainer}>
                <Text style={styles.searchResultsTitle}>
                  Résultats pour "{searchQuery}"
                </Text>
                <View style={styles.searchResults}>
                  {filteredOffers.length > 0 ? (
                    filteredOffers.map((offer) => (
                      <ProductCard key={offer.id} offer={offer} />
                    ))
                  ) : (
                    <Text style={styles.noResultsText}>
                      Aucun produit ne correspond à votre recherche
                    </Text>
                  )}
                </View>
              </View>
            )
          ) : (
            <Text style={styles.noContentText}>
              Aucune catégorie disponible
            </Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGray,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    margin: 15,
    marginTop: 50,
    paddingHorizontal: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: Colors.darkGray,
  },
  clearIcon: {
    padding: 5,
  },
  categorySection: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  productsRow: {
    paddingVertical: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.darkGray,
  },
  searchResultsContainer: {
    paddingHorizontal: 15,
  },
  searchResultsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
    marginVertical: 10,
  },
  searchResults: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  noResultsText: {
    fontSize: 16,
    color: Colors.darkGray,
    textAlign: "center",
    marginTop: 20,
  },
  noContentText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
    color: Colors.darkGray,
  },
});
