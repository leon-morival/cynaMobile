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
  const route = useRoute<RouteProp<{ params: RouteParams }, "params">>();
  const navigation = useNavigation();

  const { feature } = route.params || {};

  if (!feature) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>
          Information sur la solution non disponible
        </Text>
      </SafeAreaView>
    );
  }

  // Define feature-specific benefits
  const featureBenefits = {
    advancedSecurity: [
      "Détection avancée des intrusions et attaques",
      "Protection en temps réel contre les menaces connues et inconnues",
      "Analyse comportementale et prédictive",
      "Mise à jour automatique des signatures de sécurité",
    ],
    threatDetection: [
      "Détection précoce des activités suspectes",
      "Analyse de trafic réseau en temps réel",
      "Identification des comportements anormaux",
      "Réduction du temps moyen de détection des menaces",
    ],
    secureAccess: [
      "Authentification multi-facteurs robuste",
      "Gestion centralisée des identités et des accès",
      "Contrôle granulaire basé sur les rôles",
      "Traçabilité complète des accès aux ressources sensibles",
    ],
    dataEncryption: [
      "Protection des données au repos et en transit",
      "Chiffrement de bout en bout conforme aux standards",
      "Gestion sécurisée des clés de chiffrement",
      "Conformité aux exigences réglementaires",
    ],
    complianceTools: [
      "Tableaux de bord de conformité en temps réel",
      "Documentation automatisée pour les audits",
      "Gestion des risques et des vulnérabilités",
      "Adaptation aux évolutions réglementaires",
    ],
    support: [
      "Assistance 24/7 par des experts certifiés",
      "Temps de réponse garanti par SLA",
      "Support multilingue et multi-canal",
      "Formation et accompagnement personnalisés",
    ],
  };

  // Additional content texts for each feature
  const featureContent = {
    advancedSecurity:
      "Notre solution de Protection Avancée utilise l'intelligence artificielle et le machine learning pour identifier et neutraliser les menaces sophistiquées avant qu'elles n'affectent votre infrastructure.",
    threatDetection:
      "Notre système de Détection des Menaces combine l'analyse comportementale, la détection d'anomalies et des règles expertes pour identifier les menaces émergentes et les tentatives d'intrusion.",
    secureAccess:
      "Nos solutions d'Accès Sécurisé offrent un équilibre parfait entre sécurité robuste et expérience utilisateur fluide, avec des mécanismes d'authentification adaptés à vos besoins spécifiques.",
    dataEncryption:
      "Notre technologie de Chiffrement protège vos données sensibles grâce aux algorithmes les plus récents et à une gestion sécurisée des clés, tout en maintenant des performances optimales.",
    complianceTools:
      "Nos Outils de Conformité simplifient le respect des réglementations en automatisant la collecte de preuves, les rapports et en fournissant une visibilité continue sur votre posture de sécurité.",
    support:
      "Notre Support 24/7 vous garantit un accès permanent à des experts en cybersécurité, avec une résolution rapide des incidents et un accompagnement proactif pour améliorer votre sécurité.",
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
          <Text style={styles.backText}>Retour</Text>
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
            <Text style={styles.sectionTitle}>Avantages</Text>
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
            <Text style={styles.sectionTitle}>Idéal pour</Text>
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
            <Text style={styles.contactButtonText}>Demander un devis</Text>
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
