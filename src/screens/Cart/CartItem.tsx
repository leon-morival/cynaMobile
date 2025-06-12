import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";
import { Colors } from "../../../constants/Colors";
import { useTranslate } from "../../utils/translationUtils";
import { StyleSheet } from "react-native";

interface CartItemProps {
  item: any;
  onDelete: (id: number) => void;
  onTypeChange: (id: number, type: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onDelete,
  onTypeChange,
}) => {
  const translate = useTranslate();
  if (!item || !item.product) return null;
  const translated =
    item?.product?.translations?.find((t: any) => t.lang === "fr") ||
    item?.product?.translations?.[0] ||
    {};
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
    <View style={styles.productItem}>
      <Image source={{ uri: item.product.image }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{translated.name || "Produit"}</Text>
        <Text style={styles.productDetail}>
          Prix:{" "}
          <Text style={styles.priceValue}>{item.ttc_price?.toFixed(2)} €</Text>
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
            onChange={(val: any) => onTypeChange(item.id, val.value)}
          />
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(item.id)}
      >
        <Ionicons name="trash-outline" size={24} color={Colors.secondary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
  subscriptionTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
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
  deleteButton: {
    padding: 10,
  },
});
