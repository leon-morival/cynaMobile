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
import { Product } from "../../models/Entities";
import { translateEntity } from "../../utils/translationUtils";
import { useTranslate } from "../../utils/translationUtils";

type ProductDetailRouteProp = RouteProp<
  { params: { product: Product } },
  "params"
>;

export default function ProductDetail() {
  const { params } = useRoute<ProductDetailRouteProp>();
  const product = params.product;
  const translate = useTranslate();
  // Fonction utilitaire pour obtenir le prix à afficher
  const getDisplayPrice = () => {
    if (product.monthly_price != null) return product.monthly_price;
    if (product.annual_price != null) return product.annual_price;
    if (product.lifetime_price != null) return product.lifetime_price;
    return null;
  };
  const displayPrice = getDisplayPrice();

  // Utilise translateEntity pour la traduction selon la langue courante
  const translatedProduct = translateEntity(product.translations, product);
  const translatedName = translatedProduct.name || "";
  const translatedDescription = translatedProduct.description || "";

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{translatedName}</Text>
        {displayPrice !== null && (
          <Text style={styles.price}>{displayPrice}€</Text>
        )}
        <Text style={styles.description}>{translatedDescription}</Text>
        <View style={styles.buttonContainer}>
          <Button
            title={translate("add_to_cart")}
            onPress={() => {
              console.log("add to cart");
            }}
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
