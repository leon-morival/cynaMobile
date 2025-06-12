import React, { useEffect, useContext, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../../constants/Colors";
import { useTranslate } from "../../utils/translationUtils";
import { useCart } from "./useCart";
import { CartItem } from "./CartItem";
import {
  startStripeCheckout,
  getStripePaymentIntent,
} from "../../../services/paymentService";
import { AuthContext } from "../../context/AuthContext";
import { useStripe } from "@stripe/stripe-react-native";

// Refactored CartScreen component
export default function CartScreen() {
  const { cart, loading, fetchCart, handleDelete, handleTypeChange } =
    useCart();
  const translate = useTranslate();
  const isFocused = useIsFocused();
  const { token } = useContext(AuthContext);
  const [paying, setPaying] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  useEffect(() => {
    if (isFocused) {
      fetchCart();
    }
  }, [isFocused]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.secondary} />
      </View>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="cart-outline"
          size={60}
          color="#fff"
          style={styles.emptyIcon}
        />
        <Text style={styles.emptyText}>{translate("cart_empty")}</Text>
      </View>
    );
  }

  const totalAmount = cart.ttc_price ?? 0;

  const handleStripePay = async () => {
    if (!token) return;
    setPaying(true);
    try {
      const clientSecret = await getStripePaymentIntent(token);
      console.log("Stripe clientSecret:", clientSecret);
      const initResult = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "Cyna",
      });
      console.log("initPaymentSheet result:", initResult);
      if (initResult.error) throw new Error(initResult.error.message);
      const presentResult = await presentPaymentSheet();
      console.log("presentPaymentSheet result:", presentResult);
      if (presentResult.error) throw new Error(presentResult.error.message);
      // Optionally: show success toast
      fetchCart(); // refresh cart after payment
    } catch (e) {
      console.log("Stripe PaymentSheet error:", e);
      // Optionally: show error toast
    } finally {
      setPaying(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.productContainer}>
        <Text style={styles.headerTitle}>{translate("cart")}</Text>
        {cart.items.map((item: any, idx: number) => (
          <CartItem
            key={item.id}
            item={item}
            onDelete={handleDelete}
            onTypeChange={handleTypeChange}
          />
        ))}
      </ScrollView>
      <View style={styles.bottomBar}>
        <View style={styles.totalRow}>
          <Text style={styles.labelTotal}>Total:</Text>
          <Text style={styles.priceTotal}>{totalAmount.toFixed(2)} €</Text>
        </View>
        <TouchableOpacity
          style={styles.commandButton}
          onPress={handleStripePay}
          disabled={paying}
        >
          <Text style={styles.commandButtonText}>
            {paying ? translate("loading") : translate("place_order")}
          </Text>
          <Ionicons
            name="arrow-forward"
            size={20}
            color="#fff"
            style={styles.buttonIcon}
          />
        </TouchableOpacity>
      </View>
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
    padding: 15,
    paddingBottom: 140,
  },
  headerTitle: {
    fontWeight: "900",
    fontSize: 30,
    color: "#fff",
    textAlign: "left",
    marginBottom: 20,
    marginTop: 30,
    marginLeft: 10,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  labelTotal: {
    color: Colors.primary,
    fontSize: 22,
    fontWeight: "700",
  },
  priceTotal: {
    color: Colors.secondary,
    fontSize: 22,
    fontWeight: "700",
  },
  commandButton: {
    backgroundColor: Colors.secondary,
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignSelf: "center",
    marginBottom: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  commandButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyText: {
    color: "#fff",
    fontSize: 20,
    marginBottom: 30,
    fontWeight: "500",
  },
  shopButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "80%",
  },
  shopButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
});
