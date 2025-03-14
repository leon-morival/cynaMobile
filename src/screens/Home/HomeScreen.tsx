import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Colors } from "../../../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Routes } from "../../navigation/Routes";

export default function HomeScreen() {
  const navigation = useNavigation();
  const windowWidth = Dimensions.get("window").width;

  const featureList = [
    {
      key: "advancedSecurity",
      title: "Protection Avancée",
      icon: "shield-checkmark-outline",
    },
    {
      key: "threatDetection",
      title: "Détection Menaces",
      icon: "scan-outline",
    },
    {
      key: "secureAccess",
      title: "Accès Sécurisé",
      icon: "key-outline",
    },
    {
      key: "dataEncryption",
      title: "Chiffrement",
      icon: "lock-closed-outline",
    },
    {
      key: "complianceTools",
      title: "Conformité",
      icon: "checkmark-circle-outline",
    },
    {
      key: "support",
      title: "Support 24/7",
      icon: "headset-outline",
    },
  ];

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.textContainer}>
            <Text style={styles.valueDealsText}>Sécurité Intransigeante</Text>
            <Text style={styles.productsText}>Solutions SAS Cybersécurité</Text>
            <Text style={styles.savingsText}>
              Protégez votre entreprise contre les cybermenaces avec nos
              systèmes d'accès sécurisés de pointe
            </Text>
          </View>

          <Image
            source={require("../../assets/images/hero4.png")}
            style={styles.heroImage}
            resizeMode="contain"
          />

          <TouchableOpacity
            style={styles.shopNowButton}
            onPress={() => {
              navigation.navigate("Shop" as never);
            }}
          >
            <Text style={styles.buttonText}>Sécuriser maintenant</Text>
            <Ionicons
              name="arrow-forward"
              size={20}
              color={Colors.secondary}
              style={styles.buttonIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Features Section */}
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>
            Nos solutions de cybersécurité
          </Text>
        </View>

        <View style={styles.featureSection}>
          {featureList.map((feature) => (
            <View key={feature.key} style={styles.feBox}>
              <View style={styles.feImageContainer}>
                <Ionicons
                  name={feature.icon}
                  size={32}
                  color={Colors.primary}
                />
              </View>
              <Text style={styles.feText}>{feature.title}</Text>
            </View>
          ))}
        </View>

        {/* Call to action section */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Protection Entreprise</Text>
          <Text style={styles.ctaSubtitle}>
            Des SAS d'accès sécurisés pour protéger vos données sensibles et
            infrastructures critiques
          </Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate(Routes.ShopTab as never)}
          >
            <Text style={styles.ctaButtonText}>Découvrir nos SAS</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Chat Bot Floating Button */}
      <TouchableOpacity
        style={styles.chatBotButton}
        onPress={() => navigation.navigate("ChatBot" as never)}
      >
        <Ionicons name="chatbubble-ellipses" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    position: "relative",
  },
  container: {
    backgroundColor: Colors.primary,
    flex: 1,
  },
  heroSection: {
    paddingTop: 50,
    paddingBottom: 20,
  },
  textContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  tradeInText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
    color: "white",
    opacity: 0.8,
  },
  valueDealsText: {
    fontWeight: "700",
    fontSize: 24,
    textAlign: "center",
    marginBottom: 5,
    color: "white",
  },
  productsText: {
    color: Colors.secondary,
    fontWeight: "700",
    fontSize: 30,
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  savingsText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    lineHeight: 22,
  },
  heroImage: {
    width: "100%",
    height: 280,
    alignSelf: "center",
    marginVertical: 20,
  },
  shopNowButton: {
    marginVertical: 20,
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: Colors.primary,
    fontWeight: "700",
    fontSize: 16,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  sectionTitle: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 15,
  },
  sectionTitleText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  featureSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  feBox: {
    width: "30%",
    alignItems: "center",
    margin: 5,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    padding: 12,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  feImageContainer: {
    width: 60,
    height: 60,
    backgroundColor: "rgba(205, 212, 248, 0.6)",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  feText: {
    textAlign: "center",
    fontWeight: "600",
    color: Colors.primary,
    fontSize: 14,
  },
  ctaSection: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 25,
    marginHorizontal: 15,
    marginBottom: 40,
    borderRadius: 15,
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.secondary,
    marginBottom: 10,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  ctaButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  chatBotButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: Colors.secondary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 999,
  },
});
