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
import { SubscriptionOffer } from "../../models/Entities";

type ProductDetailRouteProp = RouteProp<
  { params: { product: SubscriptionOffer } },
  "params"
>;

export default function ProductDetail() {
  const { params } = useRoute<ProductDetailRouteProp>();
  const product = params.product;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image_path }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        <Text style={styles.description}>{product.description}</Text>
        <Text style={styles.date}>
          Créé le : {new Date(product.created_at).toLocaleDateString()}
        </Text>
        <Text style={styles.date}>
          Mis à jour le : {new Date(product.updated_at).toLocaleDateString()}
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            title="Ajouter au panier"
            onPress={() => {
              /* ...ajouter au panier logistique... */
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  image: {
    width: "100%",
    height: 250,
  },
  content: {
    padding: 15,
    backgroundColor: "#fff",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginTop: -8,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: "600",
    color: "#e67e22",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
  },
  date: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  buttonContainer: {
    marginTop: 15,
  },
});
