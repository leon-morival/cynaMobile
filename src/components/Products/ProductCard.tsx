import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Product } from "../../models/Entities";
import { Colors } from "../../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Routes } from "../../navigation/Routes";
import { translateEntity } from "../../utils/translationUtils";
import { useTranslate } from "../../utils/translationUtils";
interface ProductCardProps {
  offer: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ offer }) => {
  const navigation = useNavigation<any>();
  const translate = useTranslate();
  // Fonction utilitaire pour obtenir le prix à afficher
  const getDisplayPrice = () => {
    if (offer.monthly_price != null) return offer.monthly_price;
    if (offer.annual_price != null) return offer.annual_price;
    if (offer.lifetime_price != null) return offer.lifetime_price;
    return null;
  };

  const displayPrice = getDisplayPrice();

  const translatedOffer = translateEntity(offer.translations, offer);
  const translatedName = translatedOffer.name || "";
  const translatedDescription = translatedOffer.description || "";

  const handlePress = () => {
    navigation.navigate(Routes.ProductDetail, { product: offer });
  };

  return (
    <TouchableOpacity
      style={styles.cardWrapper}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: offer.image }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.priceTag}>
            {displayPrice !== null && (
              <Text style={styles.priceText}>{displayPrice}€</Text>
            )}
          </View>
        </View>
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1}>
            {translatedName}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {translatedDescription}
          </Text>
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={handlePress}
            >
              <Text style={styles.detailsButtonText}>
                {translate("details")}
              </Text>
              <Ionicons name="chevron-forward" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const { width } = Dimensions.get("window");
const cardWidth = width * 0.7;

const styles = StyleSheet.create({
  cardWrapper: {
    marginRight: 15,
    width: cardWidth,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 3,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 10,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 150,
  },
  priceTag: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: Colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  priceText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  content: {
    padding: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: Colors.darkGray,
    marginBottom: 15,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  detailsButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  detailsButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginRight: 3,
  },
});

export default ProductCard;
