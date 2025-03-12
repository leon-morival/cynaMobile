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
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../../../constants/Colors";

import { SubscriptionOffer } from "../../models/Entities";

// Add a new type for cart items based on SubscriptionOffer
type CartItem = SubscriptionOffer & {
  quantity: number;
  type: string;
  url: string;
};

export default function CartScreen() {
  const navigation = useNavigation();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [token, setToken] = useState<string | null>(null);

  // Load cart items and token when component mounts
  useEffect(() => {
    // Initialize Stripe Configuration
    initStripe({
      publishableKey:
        "pk_test_51Ny7JaHVnu49ZpSn2I9HIRbRQeJqmf4Ttz3EscQuyFBYDdsTFFd7xgleXcIM8ognR3BG4sdV1Mfq7iC3hVpheYG700Ay6HrQsk", // replace with your actual publishable key
    });
    loadCartData();
    getToken();
  }, []);

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
        setCart(JSON.parse(storedCart));
      } else {
        setCart([]);
      }
    } catch (error) {
      console.log("Error loading cart from storage:", error);
    }
  };

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

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
            <Image source={{ uri: item.url }} style={styles.productImage} />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productDetail}>Prix: {item.price} €</Text>
              <Text style={styles.productDetail}>Type: {item.type}</Text>
              <Text style={styles.productDetail}>Qté: {item.quantity}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.bottomBar}>
        <View style={styles.totalRow}>
          <Text style={styles.labelTotal}>Total:</Text>
          <Text style={styles.priceTotal}>{totalAmount} €</Text>
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
});
