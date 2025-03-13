import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  ScrollView,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SubscriptionOffer } from "../../models/Entities";
import { Colors } from "../../../constants/Colors";
import Toast from "react-native-toast-message";

type ProductDetailRouteProp = RouteProp<
  { params: { product: SubscriptionOffer } },
  "params"
>;

export default function ProductDetail() {
  const { params } = useRoute<ProductDetailRouteProp>();
  const product = params.product;

  const addToCart = async () => {
    try {
      const storedCart = await AsyncStorage.getItem("cart");
      const currentCart = storedCart ? JSON.parse(storedCart) : [];
      // If product is already in cart, do not add it again
      const exists = currentCart.find((item: any) => item.id === product.id);
      if (exists) {
        Toast.show({
          type: "info",
          text1:
            "Produit déjà présent dans le panier. Modifiez la quantité dans le panier!",
        });
        return;
      }
      // Map the product to the cart item structure
      const newItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        type: "subscription",
        url: product.image_path,
      };
      currentCart.push(newItem);
      await AsyncStorage.setItem("cart", JSON.stringify(currentCart));
      Toast.show({
        type: "success",
        text1: "Produit ajouté au panier!",
      });
    } catch (error) {
      console.log("Error adding product to cart:", error);
      Toast.show({
        type: "error",
        text1: "Erreur lors de l'ajout du produit au panier",
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image_path }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>${product.price}</Text>
        <Text style={styles.description}>{product.description}</Text>
        <View style={styles.buttonContainer}>
          <Button
            title="Ajouter au panier"
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
