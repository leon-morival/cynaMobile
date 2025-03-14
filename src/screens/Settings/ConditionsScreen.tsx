import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { Colors } from "../../../constants/Colors";

export default function ConditionsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.sectionTitle}>1. Acceptation des Conditions</Text>
        <Text style={styles.paragraph}>
          En utilisant cette application, vous acceptez de vous conformer aux
          présentes Conditions d'Utilisation. Si vous n'acceptez pas ces
          conditions, veuillez ne pas utiliser l'application.
        </Text>

        <Text style={styles.sectionTitle}>2. Description du Service</Text>
        <Text style={styles.paragraph}>
          Notre application propose des services de cybersécurité. Nous nous
          réservons le droit de modifier, suspendre ou interrompre tout aspect
          du service à tout moment.
        </Text>

        <Text style={styles.sectionTitle}>3. Confidentialité</Text>
        <Text style={styles.paragraph}>
          Notre Politique de Confidentialité explique comment nous collectons,
          utilisons et protégeons vos informations personnelles. En utilisant
          notre application, vous consentez à notre collecte et utilisation des
          données conformément à notre Politique de Confidentialité.
        </Text>

        <Text style={styles.sectionTitle}>4. Comptes Utilisateurs</Text>
        <Text style={styles.paragraph}>
          Vous êtes responsable du maintien de la confidentialité de vos
          identifiants de compte et de toutes les activités qui se produisent
          sous votre compte. Vous devez nous informer immédiatement de toute
          utilisation non autorisée de votre compte.
        </Text>

        <Text style={styles.sectionTitle}>5. Propriété Intellectuelle</Text>
        <Text style={styles.paragraph}>
          Tous les droits de propriété intellectuelle relatifs à l'application
          et son contenu appartiennent à notre entreprise. Aucun droit ou
          licence ne vous est accordé sauf autorisation expresse dans ces
          conditions.
        </Text>

        <Text style={styles.sectionTitle}>6. Limitation de Responsabilité</Text>
        <Text style={styles.paragraph}>
          Dans toute la mesure permise par la loi, nous ne serons pas
          responsables des dommages indirects, spéciaux, accessoires ou
          consécutifs résultant de l'utilisation ou de l'impossibilité
          d'utiliser notre application.
        </Text>

        <Text style={styles.sectionTitle}>7. Modifications des Conditions</Text>
        <Text style={styles.paragraph}>
          Nous nous réservons le droit de modifier ces conditions d'utilisation
          à tout moment. Les modifications entreront en vigueur dès leur
          publication dans l'application. Votre utilisation continue de
          l'application après de telles modifications constitue votre
          acceptation des nouvelles conditions.
        </Text>

        <Text style={styles.sectionTitle}>8. Loi Applicable</Text>
        <Text style={styles.paragraph}>
          Ces conditions sont régies par les lois françaises. Tout litige
          relatif à ces conditions sera soumis à la compétence exclusive des
          tribunaux français.
        </Text>

        <Text style={styles.footer}>
          Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: Colors.primary,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    color: Colors.primary,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 22,
    color: Colors.darkGray,
  },
  footer: {
    marginTop: 30,
    marginBottom: 20,
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    color: Colors.darkGray,
  },
});
