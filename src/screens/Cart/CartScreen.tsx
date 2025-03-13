import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useStripe, initStripe } from "@stripe/stripe-react-native";
import { createPaymentIntent } from "../../../services/paymentService";
import Toast from "react-native-toast-message";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";

import { SubscriptionOffer } from "../../models/Entities";

// Add a new type for cart items based on SubscriptionOffer
type SubscriptionType = "monthly" | "annual";

// Create data for the dropdown
const subscriptionTypeData = [
  { label: "Mensuel", value: "monthly" },
  { label: "Annuel", value: "annual" },
];

export default function CartScreen() {
  const navigation = useNavigation();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<SubscriptionOffer[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [subscriptionTypes, setSubscriptionTypes] = useState<{
    [key: number]: SubscriptionType;
  }>({});

  // Replace useEffect with useFocusEffect to update cart and token on screen focus
  useFocusEffect(
    React.useCallback(() => {
      // Initialize Stripe Configuration only once if needed
      initStripe({
        publishableKey:
          "pk_test_51Ny7JaHVnu49ZpSn2I9HIRbRQeJqmf4Ttz3EscQuyFBYDdsTFFd7xgleXcIM8ognR3BG4sdV1Mfq7iC3hVpheYG700Ay6HrQsk",
      });
      loadCartData();
      getToken();
      // Cleanup if necessary
      return () => {};
    }, [])
  );

  console.log("token", token);
  const getToken = async () => {
    try {
      const userToken = await AsyncStorage.getItem("token");
      setToken(userToken);
    } catch (error) {
      console.log("Error fetching token:", error);
    }
  };

  const loadCartData = async () => {
    try {
      const storedCart = await AsyncStorage.getItem("cart");
      if (storedCart !== null) {
        const parsedCart = JSON.parse(storedCart);
        setCart(parsedCart);

        // Initialize subscription types to monthly for all items
        const types: { [key: number]: SubscriptionType } = {};
        parsedCart.forEach((item: SubscriptionOffer) => {
          types[item.id] = "monthly";
        });
        setSubscriptionTypes(types);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.log("Error loading cart from storage:", error);
    }
  };

  const totalAmount = cart.reduce((acc, item) => {
    // Apply 10x multiplier for annual subscriptions
    const multiplier = subscriptionTypes[item.id] === "annual" ? 10 : 1;
    return acc + item.price * item.quantity * multiplier;
  }, 0);

  const handleSubscriptionTypeChange = (
    itemId: number,
    type: SubscriptionType
  ) => {
    setSubscriptionTypes((prev) => ({
      ...prev,
      [itemId]: type,
    }));
  };

  const initializePaymentSheet = async () => {
    try {
      setLoading(true);

      if (!token) {
        Toast.show({
          type: "error",
          text1: "Erreur",
          text2: "Vous devez être connecté pour effectuer un paiement.",
        });
        setLoading(false);
        return { error: new Error("Token manquant") };
      }

      // Get payment intent from your backend
      const { clientSecret } = await createPaymentIntent(totalAmount, token);
      // Added check for invalid clientSecret (or invalid token)
      if (!clientSecret) {
        Toast.show({
          type: "error",
          text1: "Erreur",
          text2:
            "Token invalide ou erreur lors de la récupération du paiement.",
        });
        setLoading(false);
        return { error: new Error("Token invalide ou clientSecret manquant") };
      }
      console.log("ClientSecret retrieved:", clientSecret);

      // Initialize the Payment Sheet
      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "Cyna Store",
        style: "alwaysLight",
      });

      if (error) {
        console.log("Error initializing payment sheet:", error);
        Toast.show({
          type: "error",
          text1: "Erreur",
          text2: error.message,
        });
      }

      setLoading(false);
      return { error };
    } catch (error) {
      console.log("Error in initializePaymentSheet:", error);
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: "Impossible d'initialiser le système de paiement",
      });
      setLoading(false);
      return { error };
    }
  };

  const handlePayPress = async () => {
    // Add token check before processing payment
    if (!token) {
      Toast.show({
        type: "error",
        text1: "Veuillez vous connecter avant de commander",
      });
      return;
    }

    // Initialize payment sheet if not already initialized
    const { error: initError } = await initializePaymentSheet();
    if (initError) {
      console.log("Initialization error:", initError);
      return;
    }
    // Present the payment sheet
    const { error } = await presentPaymentSheet();
    console.log("Payment sheet presented. Error from sheet:", error);
    if (error) {
      Toast.show({
        type: "error",
        text1: "Paiement échoué",
        text2: error.message,
      });
    } else {
      Toast.show({
        type: "success",
        text1: "Succès",
        text2: "Paiement effectué avec succès!",
      });
      // Clear the cart on successful payment
      await clearCart();
      // Reload cart data
      loadCartData();
    }
  };

  const clearCart = async () => {
    try {
      if (!token) return;

      // Call your API to clear the cart
      // await fetch("https://api.leonmorival.xyz/api/cart", {
      //   method: "DELETE",
      //   headers: {
      //     "Authorization": `Bearer ${token}`,
      //     "Content-Type": "application/json"
      //   }
      // });

      // For demo purposes, just clear the local state
      await AsyncStorage.removeItem("cart");
      setCart([]);
    } catch (error) {
      console.log("Error clearing cart:", error);
    }
  };

  // New function: update cart item quantity and remove if quantity <= 0
  const updateCartItem = async (itemId: number, newQuantity: number) => {
    const updatedCart = cart
      .map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
      .filter((item) => item.quantity > 0);
    setCart(updatedCart);
    await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
  };
  const handleDelete = (itemId: number) => {
    updateCartItem(itemId, 0);
  };

  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Votre panier est vide</Text>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => navigation.navigate("Shop")}
        >
          <Text style={styles.shopButtonText}>Continuer mes achats</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.productContainer}>
        <Text style={styles.headerTitle}>Mon panier</Text>
        {cart.map((item) => (
          <View key={item.id} style={styles.productItem}>
            <Image
              source={{ uri: item.image_path }}
              style={styles.productImage}
            />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productDetail}>
                Prix:{" "}
                {(
                  item.price *
                  (subscriptionTypes[item.id] === "annual" ? 10 : 1)
                ).toFixed(2)}{" "}
                €
              </Text>
              <View style={styles.subscriptionTypeContainer}>
                <Text style={styles.productDetail}>Type: </Text>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={subscriptionTypeData}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Choisir"
                  value={subscriptionTypes[item.id] || "monthly"}
                  onChange={(selectedItem) => {
                    handleSubscriptionTypeChange(
                      item.id,
                      selectedItem.value as SubscriptionType
                    );
                  }}
                />
              </View>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Ionicons name="trash" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <View style={styles.bottomBar}>
        <View style={styles.totalRow}>
          <Text style={styles.labelTotal}>Total:</Text>
          <Text style={styles.priceTotal}>{totalAmount.toFixed(2)} €</Text>
        </View>
        <TouchableOpacity
          style={styles.commandButton}
          onPress={handlePayPress}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.commandButtonText}>Commander</Text>
          )}
        </TouchableOpacity>
      </View>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    position: "relative",
  },
  productContainer: {
    padding: 10,
    paddingBottom: 140,
  },
  headerTitle: {
    fontWeight: "900",
    fontSize: 30,
    color: "#fff",
    textAlign: "left",
    marginBottom: 10,
    marginTop: 25,
    marginLeft: 20,
  },
  productItem: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 3,
    width: "90%",
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  productImage: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "600",
  },
  productDetail: {
    fontSize: 14,
    color: "#555",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.lightGray,
    padding: 10,
    alignItems: "center",
    paddingVertical: 40,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 5,
  },
  labelTotal: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: "600",
  },
  priceTotal: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: "600",
  },
  commandButton: {
    backgroundColor: "#FF6B00",
    padding: 10,
    borderRadius: 5,
    width: "90%",
    alignSelf: "center",
    marginBottom: 5,
  },
  commandButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "500",
  },
  paymentMethods: {
    color: "#fff",
    marginTop: 5,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: "#302082",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 20,
  },
  shopButton: {
    backgroundColor: Colors.secondary,
    padding: 12,
    borderRadius: 5,
    width: "80%",
  },
  shopButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "500",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  controlButton: {
    fontSize: 20,
    fontWeight: "600",
    marginHorizontal: 10,
    color: Colors.primary,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  deleteButton: {
    marginLeft: 15,
    fontSize: 16,
    color: "red",
  },
  dropdown: {
    width: 120,
    height: 36,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 8,
  },
  placeholderStyle: {
    fontSize: 12,
    color: "#555",
  },
  selectedTextStyle: {
    fontSize: 12,
    color: "#000",
  },
  subscriptionTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  pickerContainer: {
    display: "none",
  },
  picker: {
    display: "none",
  },
  pickerItem: {
    display: "none",
  },
  pickerItemText: {
    display: "none",
  },
});
