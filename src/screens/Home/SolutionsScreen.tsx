import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Colors } from "../../../constants/Colors";
import { useTranslate } from "../../utils/translationUtils";

type RouteParams = {
  feature: {
    key: string;
    title: string;
    description: string;
    icon: string;
    iconColor: string;
    bgColor: string;
    textColor: string;
  };
};

export default function SolutionsScreen() {
  const translate = useTranslate();
  const route = useRoute<RouteProp<{ params: RouteParams }, "params">>();
  const navigation = useNavigation();

  const { feature } = route.params || {};

  if (!feature) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>
          {translate("information_not_available")}
        </Text>
      </SafeAreaView>
    );
  }

  // Define feature-specific benefits
  const featureBenefits = {
    advancedSecurity: [
      translate("advanced_security_benefit_1"),
      translate("advanced_security_benefit_2"),
      translate("advanced_security_benefit_3"),
      translate("advanced_security_benefit_4"),
    ],
    threatDetection: [
      translate("threat_detection_benefit_1"),
      translate("threat_detection_benefit_2"),
      translate("threat_detection_benefit_3"),
      translate("threat_detection_benefit_4"),
    ],
    secureAccess: [
      translate("secure_access_benefit_1"),
      translate("secure_access_benefit_2"),
      translate("secure_access_benefit_3"),
      translate("secure_access_benefit_4"),
    ],
    dataEncryption: [
      translate("data_encryption_benefit_1"),
      translate("data_encryption_benefit_2"),
      translate("data_encryption_benefit_3"),
      translate("data_encryption_benefit_4"),
    ],
    complianceTools: [
      translate("compliance_tools_benefit_1"),
      translate("compliance_tools_benefit_2"),
      translate("compliance_tools_benefit_3"),
      translate("compliance_tools_benefit_4"),
    ],
    support: [
      translate("support_benefit_1"),
      translate("support_benefit_2"),
      translate("support_benefit_3"),
      translate("support_benefit_4"),
    ],
  };

  // Additional content texts for each feature
  const featureContent = {
    advancedSecurity: translate("advanced_security_description"),
    threatDetection: translate("threat_detection_description"),
    secureAccess: translate("secure_access_description"),
    dataEncryption: translate("data_encryption_description"),
    complianceTools: translate("compliance_tools_description"),
    support: translate("support_description"),
  };

  const benefits = featureBenefits[feature.key] || [];
  const additionalContent = featureContent[feature.key] || feature.description;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text style={styles.backText}>{translate("back")}</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <View
            style={[styles.iconContainer, { backgroundColor: feature.bgColor }]}
          >
            <Ionicons name={feature.icon} size={50} color={feature.iconColor} />
          </View>
          <Text style={[styles.title, { color: feature.textColor }]}>
            {feature.title}
          </Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.description}>{additionalContent}</Text>

          <View style={styles.benefitsSection}>
            <Text style={styles.sectionTitle}>
              {translate("benefits_title")}
            </Text>
            <View style={styles.benefitsList}>
              {benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color={feature.textColor}
                  />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.useCasesSection}>
            <Text style={styles.sectionTitle}>{translate("ideal_for")}</Text>
            <View style={styles.useCaseChips}>
              <View
                style={[
                  styles.chip,
                  { backgroundColor: `${feature.textColor}20` },
                ]}
              >
                <Text style={[styles.chipText, { color: feature.textColor }]}>
                  {feature.key === "advancedSecurity"
                    ? "Entreprises"
                    : feature.key === "threatDetection"
                    ? "Infrastructures critiques"
                    : feature.key === "secureAccess"
                    ? "Institutions financières"
                    : feature.key === "dataEncryption"
                    ? "Secteur médical"
                    : feature.key === "complianceTools"
                    ? "Services réglementés"
                    : "Tous secteurs"}
                </Text>
              </View>
              <View
                style={[
                  styles.chip,
                  { backgroundColor: `${feature.textColor}20` },
                ]}
              >
                <Text style={[styles.chipText, { color: feature.textColor }]}>
                  {feature.key === "advancedSecurity"
                    ? "Systèmes critiques"
                    : feature.key === "threatDetection"
                    ? "Réseaux complexes"
                    : feature.key === "secureAccess"
                    ? "Données sensibles"
                    : feature.key === "dataEncryption"
                    ? "Transferts sécurisés"
                    : feature.key === "complianceTools"
                    ? "Audits réguliers"
                    : "Assistance continue"}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>
              {translate("request_quote")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 35,
    flex: 1,
    backgroundColor: Colors.primary,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backText: {
    color: "white",
    marginLeft: 10,
    fontSize: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  content: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 20,
    borderRadius: 15,
    marginBottom: 40,
  },
  description: {
    fontSize: 16,
    color: "white",
    lineHeight: 24,
    marginBottom: 30,
    textAlign: "center",
  },
  benefitsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    color: Colors.secondary,
    fontWeight: "bold",
    marginBottom: 15,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  benefitText: {
    color: "white",
    fontSize: 16,
  },
  contactButton: {
    backgroundColor: Colors.secondary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 5,
  },
  contactButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    padding: 20,
  },
  useCasesSection: {
    marginBottom: 30,
  },
  useCaseChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 5,
  },
  chipText: {
    fontWeight: "500",
    fontSize: 14,
  },
});
