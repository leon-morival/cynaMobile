import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../../constants/Colors";
import { Routes } from "../../navigation/Routes";

export default function HomeScreen() {
  const navigation = useNavigation();

  const featureList = [
    {
      key: "advancedSecurity",
      title: "Protection Avancée",
      icon: "shield-checkmark-outline",
      iconColor: "#7986CB", // Bleu indigo pastel
      textColor: "#5C6BC0",
      bgColor: "rgba(121, 134, 203, 0.15)",
      description:
        "Solutions de protection avancée pour protéger vos actifs numériques contre les menaces les plus sophistiquées.",
    },
    {
      key: "threatDetection",
      title: "Détection Menaces",
      icon: "scan-outline",
      iconColor: "#81C784", // Vert pastel
      textColor: "#66BB6A",
      bgColor: "rgba(129, 199, 132, 0.15)",
      description:
        "Systèmes de détection proactive des menaces avec alertes en temps réel et analyses comportementales.",
    },
    {
      key: "secureAccess",
      title: "Accès Sécurisé",
      icon: "key-outline",
      iconColor: "#9575CD", // Violet pastel
      textColor: "#7E57C2",
      bgColor: "rgba(149, 117, 205, 0.15)",
      description:
        "Solutions d'accès sécurisé avec authentification multi-facteurs et contrôles d'accès basés sur les rôles.",
    },
    {
      key: "dataEncryption",
      title: "Chiffrement",
      icon: "lock-closed-outline",
      iconColor: "#4FC3F7", // Bleu clair pastel
      textColor: "#29B6F6",
      bgColor: "rgba(79, 195, 247, 0.15)",
      description:
        "Technologies de chiffrement de pointe pour protéger vos données sensibles au repos et en transit.",
    },
    {
      key: "complianceTools",
      title: "Conformité",
      icon: "checkmark-circle-outline",
      iconColor: "#FF8A65", // Orange doux
      textColor: "#FF7043",
      bgColor: "rgba(255, 138, 101, 0.15)",
      description:
        "Outils de conformité adaptés aux réglementations RGPD, ISO27001 et autres standards internationaux.",
    },
    {
      key: "support",
      title: "Support 24/7",
      icon: "headset-outline",
      iconColor: "#90A4AE", // Bleu-gris
      textColor: "#78909C",
      bgColor: "rgba(144, 164, 174, 0.15)",
      description:
        "Support technique disponible 24h/24 et 7j/7 avec des experts en cybersécurité à votre service.",
    },
  ];

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.textContainer}>
            <Text style={styles.valueDealsText}>Sécurité Intransigeante</Text>
            <Text style={styles.productsText}>
              Solutions Saas Cybersécurité
            </Text>
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
              navigation.navigate(Routes.ShopTab as never);
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
            <TouchableOpacity
              key={feature.key}
              style={styles.feBox}
              onPress={() =>
                navigation.navigate(
                  Routes.SolutionsScreen as never,
                  { feature } as never
                )
              }
            >
              <View
                style={[
                  styles.feImageContainer,
                  { backgroundColor: feature.bgColor },
                ]}
              >
                <Ionicons
                  name={feature.icon}
                  size={32}
                  color={feature.iconColor}
                />
              </View>
              <Text style={[styles.feText, { color: feature.textColor }]}>
                {feature.title}
              </Text>
            </TouchableOpacity>
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
            <Text style={styles.ctaButtonText}>Découvrir nos SaaS</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Chat Bot Floating Button */}
      <TouchableOpacity
        style={styles.chatBotButton}
        onPress={() => navigation.navigate(Routes.ChatBot as never)}
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
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  feText: {
    textAlign: "center",
    fontWeight: "600",
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
