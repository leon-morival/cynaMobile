import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";
import { Colors } from "../../../constants/Colors";
import { useTranslate } from "../../utils/translationUtils";
import { API_URL } from "../../../constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Données statiques pour le panier
const staticCart = [
  {
    id: "1",
    name: "Produit A",
    price: 12.99,
    url: "https://via.placeholder.com/80",
    type: "monthly",
  },
  {
    id: "2",
    name: "Produit B",
    price: 8.5,
    url: "https://via.placeholder.com/80",
    type: "annual",
  },
];

const subscriptionTypeData = [
  { label: "Mensuel", value: "monthly" },
  { label: "Annuel", value: "annual" },
];

export default function CartScreen() {
  const [cart, setCart] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const translate = useTranslate();

  React.useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          setCart(null);
          setLoading(false);
          return;
        }
        const response = await fetch(`${API_URL}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          setCart(null);
        } else {
          const data = await response.json();
          setCart(data);
        }
      } catch (e) {
        setCart(null);
      }
      setLoading(false);
    };
    fetchCart();
  }, []);

  // Fonction pour supprimer un item du panier
  const handleDelete = async (orderItemId: number) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      const response = await fetch(`${API_URL}/remove-from-cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ order_item_id: orderItemId }),
      });
      if (response.ok) {
        // Refresh cart
        const data = await response.json();
        setCart(data);
      }
    } catch (e) {}
  };

  // Fonction pour modifier le type d'abonnement d'un item
  const handleTypeChange = async (orderItemId: number, newType: string) => {
    console.log("[Cart] handleTypeChange called", { orderItemId, newType });
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("[Cart] token:", token);
      if (!token) return;
      const response = await fetch(`${API_URL}/update-cart-item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          order_item_id: orderItemId,
          quantity: 1,
          subscription_type: newType,
        }),
      });
      console.log("[Cart] response status:", response.status);
      if (response.ok) {
        const data = await response.json();
        console.log("[Cart] type changed successfully, new cart:", data);
        setCart(data);
      } else {
        const error = await response.text();
        // console.log("[Cart] error response:", error);
      }
    } catch (e) {
      console.log("[Cart] handleTypeChange error:", e);
    }
  };

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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.productContainer}>
        <Text style={styles.headerTitle}>{translate("cart")}</Text>
        {cart.items.map((item: any) => {
          const translated =
            item.product.translations?.find((t: any) => t.lang === "fr") ||
            item.product.translations?.[0] ||
            {};
          // Détermine les types d'abonnement disponibles pour ce produit
          const typeOptions = [
            item.product.monthly_price != null && {
              label: translate("mensual"),
              value: "mensual",
            },
            item.product.annual_price != null && {
              label: translate("annual"),
              value: "annual",
            },
            item.product.lifetime_price != null && {
              label: translate("lifetime"),
              value: "lifetime",
            },
          ].filter(Boolean);
          return (
            <View key={item.id} style={styles.productItem}>
              <Image
                source={{ uri: item.product.image }}
                style={styles.productImage}
              />
              <View style={styles.productDetails}>
                <Text style={styles.productName}>
                  {translated.name || "Produit"}
                </Text>
                <Text style={styles.productDetail}>
                  Prix:{" "}
                  <Text style={styles.priceValue}>
                    {item.ttc_price?.toFixed(2)} €
                  </Text>
                </Text>
                <View style={styles.subscriptionTypeContainer}>
                  <Text style={styles.productDetail}>Type: </Text>
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    itemContainerStyle={styles.dropdownItemContainer}
                    itemTextStyle={styles.dropdownItemText}
                    data={typeOptions as any}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Choisir"
                    value={item.subscription_type}
                    disable={typeOptions.length <= 1}
                    onChange={(val: any) =>
                      handleTypeChange(item.id, val.value)
                    }
                  />
                </View>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
              >
                <Ionicons
                  name="trash-outline"
                  size={24}
                  color={Colors.secondary}
                />
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
      <View style={styles.bottomBar}>
        <View style={styles.totalRow}>
          <Text style={styles.labelTotal}>Total:</Text>
          <Text style={styles.priceTotal}>{totalAmount.toFixed(2)} €</Text>
        </View>
        <TouchableOpacity style={styles.commandButton} disabled>
          <Text style={styles.commandButtonText}>
            {translate("place_order")}
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
  productItem: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    width: "95%",
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    marginRight: 15,
    borderRadius: 8,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 5,
  },
  productDetail: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  priceValue: {
    fontWeight: "600",
    color: Colors.secondary,
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
  deleteButton: {
    padding: 10,
  },
  dropdown: {
    width: 120,
    height: 36,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 10,
    marginLeft: 5,
  },
  placeholderStyle: {
    fontSize: 13,
    color: "#555",
  },
  selectedTextStyle: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: "500",
  },
  dropdownItemContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownItemText: {
    fontSize: 13,
    color: Colors.primary,
  },
  subscriptionTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  // Removing unused styles
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
  paymentMethods: {
    color: "#fff",
    marginTop: 5,
  },
});
