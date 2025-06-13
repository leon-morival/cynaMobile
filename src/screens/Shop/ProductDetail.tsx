import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { RouteProp, useRoute } from "@react-navigation/native";
import React from "react";
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { Colors } from "../../../constants/Colors";
import apiClient from "../../apiClient";
import { Product } from "../../models/Entities";
import { translateEntity, useTranslate } from "../../utils/translationUtils";

type ProductDetailRouteProp = RouteProp<
  { params: { product: Product } },
  "params"
>;

export default function ProductDetail() {
  const { params } = useRoute<ProductDetailRouteProp>();
  const product = params.product;
  const translate = useTranslate();
  const [selectedType, setSelectedType] = React.useState<string>(() => {
    if (product.monthly_price != null) return "mensual";
    if (product.annual_price != null) return "annual";
    if (product.lifetime_price != null) return "lifetime";
    return "";
  });

  // Liste des options disponibles (filtrage typé)
  type PriceOption = { label: string; value: string; price: number };
  const priceOptions: PriceOption[] = [
    product.monthly_price != null
      ? {
          label: translate("mensual"),
          value: "mensual",
          price: product.monthly_price,
        }
      : undefined,
    product.annual_price != null
      ? {
          label: translate("annual"),
          value: "annual",
          price: product.annual_price,
        }
      : undefined,
    product.lifetime_price != null
      ? {
          label: translate("lifetime"),
          value: "lifetime",
          price: product.lifetime_price,
        }
      : undefined,
  ].filter((opt): opt is PriceOption => !!opt);

  // Prix affiché selon la sélection
  const displayPrice =
    priceOptions.find((opt) => opt.value === selectedType)?.price ?? null;

  // Utilise translateEntity pour la traduction selon la langue courante
  const translatedProduct = translateEntity(product.translations, product);
  const translatedName = translatedProduct.name || "";
  const translatedDescription = translatedProduct.description || "";

  const addToCart = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Toast.show({ type: "error", text1: translate("not_logged_in") });
        return;
      }
      await apiClient.post(
        "/add-to-cart",
        {
          product_id: product.id,
          quantity: 1, // tu peux ajouter un sélecteur de quantité si besoin
          subscription_type: selectedType,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Toast.show({ type: "success", text1: translate("add_to_cart_success") });
    } catch (e: any) {
      const errorMsg = e?.response?.data?.message || "";
      Toast.show({
        type: "error",
        text1: translate("add_to_cart_error"),
        text2: errorMsg,
      });
    }
  };
  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{translatedName}</Text>
        {priceOptions.length > 1 && (
          <Picker
            selectedValue={selectedType}
            onValueChange={setSelectedType}
            style={{ marginBottom: 10 }}
          >
            {priceOptions.map((opt) => (
              <Picker.Item
                key={opt.value}
                label={opt.label + " - " + opt.price + "€"}
                value={opt.value}
              />
            ))}
          </Picker>
        )}
        {displayPrice !== null && priceOptions.length === 1 && (
          <Text style={styles.price}>{displayPrice}€</Text>
        )}
        {displayPrice !== null && priceOptions.length > 1 && (
          <Text style={styles.price}>{displayPrice}€</Text>
        )}
        <Text style={styles.description}>{translatedDescription}</Text>
        <View style={styles.buttonContainer}>
          <Button
            title={translate("add_to_cart")}
            onPress={addToCart}
            color={Colors.primary}
          />
        </View>
      </View>
      <Toast />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 250,
  },
  content: {
    paddingTop: 30,
    padding: 15,
    backgroundColor: "#fff",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginTop: -8,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.secondary,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
  },

  buttonContainer: {
    marginTop: 15,
    // backgroundColor: Colors.primary,
  },
});
