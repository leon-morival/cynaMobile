import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { Colors } from "../../../constants/Colors";
export default function HomeScreen() {
  const featureList = [
    {
      key: "freeShipping",
      image: require("../../assets/img-1/features/f2.png"),
      title: "Free Shipping",
    },
    {
      key: "onlineOrder",
      image: require("../../assets/img-1/features/f1.png"),
      title: "Online Order",
    },
    {
      key: "saveMoney",
      image: require("../../assets/img-1/features/f3.png"),
      title: "Save Money",
    },
    {
      key: "promotions",
      image: require("../../assets/img-1/features/f4.png"),
      title: "Promotions",
    },
    {
      key: "happySell",
      image: require("../../assets/img-1/features/f5.png"),
      title: "Happy Sell",
    },
    {
      key: "support",
      image: require("../../assets/img-1/features/f6.png"),
      title: "F24/7 Support",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.tradeInText}>Trade-in-offer</Text>
        <Text style={styles.valueDealsText}>Super value deals</Text>
        <Text style={styles.productsText}>On all products</Text>
        <Text style={styles.savingsText}>
          Save more with coupons & up to 70% off !
        </Text>
      </View>

      <Image
        source={require("../../assets/images/hero4.png")}
        style={styles.image}
      />

      <TouchableOpacity style={styles.button}>
        <Image
          source={require("../../assets/button.png")}
          style={StyleSheet.absoluteFill}
        />
        <Text style={styles.buttonText}>Shop now</Text>
      </TouchableOpacity>

      {/* Features Section */}
      <View style={styles.featureSection}>
        {featureList.map((feature) => (
          <View key={feature.key} style={styles.feBox}>
            <Image source={feature.image} style={styles.feImage} />
            <Text style={styles.feText}>{feature.title}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    flex: 1,
    paddingTop: 20,
  },
  textContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    color: "white",
  },
  tradeInText: {
    textAlign: "center",
    marginBottom: 5,
    color: "white",
  },
  valueDealsText: {
    fontWeight: "600",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 5,
    color: "white",
  },
  productsText: {
    color: "#FF6B00",
    fontWeight: "600",
    fontSize: 27,
    textAlign: "center",
    marginBottom: 5,
  },
  savingsText: {
    textAlign: "center",
    color: "white",
  },
  image: {
    width: 250,
    height: 250,
    alignSelf: "center",
    marginTop: 20,
  },
  button: {
    marginTop: 20,
    paddingVertical: 14,
    paddingRight: 80,
    paddingLeft: 65,
    backgroundColor: "transparent",
    alignSelf: "center",
  },
  buttonText: {
    color: "#FF6B00",
    fontWeight: "700",
    fontSize: 15,
    textAlign: "center",
  },
  featureSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
  },
  feBox: {
    width: 100,
    alignItems: "center",
    margin: 10,
  },
  feImage: {
    width: 70,
    height: 70,
    marginBottom: 5,
  },
  feText: {
    textAlign: "center",
    fontWeight: "900",
    color: "#FF6B00",
    fontSize: 14,
    borderRadius: 2,
    padding: 4,
    backgroundColor: "#cdd4f8",
  },
});
