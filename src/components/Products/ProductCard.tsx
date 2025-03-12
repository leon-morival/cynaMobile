import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SubscriptionOffer } from "../../models/Entities";

interface ProductCardProps {
  offer: SubscriptionOffer;
}

const ProductCard: React.FC<ProductCardProps> = ({ offer }) => {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("ProductDetail", { product: offer })}
    >
      <View style={styles.card}>
        <Image source={{ uri: offer.image_path }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{offer.name}</Text>
          <Text style={styles.price}>${offer.price.toFixed(2)}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {offer.description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    marginVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
  },
  info: {
    flex: 1,
    padding: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  price: {
    fontSize: 14,
    fontWeight: "500",
    color: "#e67e22",
    marginVertical: 4,
  },
  description: {
    fontSize: 12,
    color: "#666",
  },
});

export default ProductCard;
