import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { User, Civilite, Role } from "../../models/Entities";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "../../navigation/Routes";
interface ProfileProps {
  user: User;
}

const civiliteLabel = {
  [Civilite.MR]: "Monsieur",
  [Civilite.MME]: "Madame",
  [Civilite.ENT]: "Entreprise",
  [Civilite.AUT]: "Autre",
};

const roleLabel = {
  [Role.ADMIN]: "Administrateur",
  [Role.USER]: "Utilisateur",
};

export default function Profile({ user }: ProfileProps) {
  const navigation = useNavigation();

  const handlePasswordChange = () => {
    navigation.navigate(Routes.PasswordChange as never);
  };

  return (
    <>
      <Text style={{ alignSelf: "center", fontSize: 26, fontWeight: "800" }}>
        Mon compte
      </Text>
      <View style={styles.profileContainer}>
        <View style={styles.avatarContainer}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="person-outline"
              size={100}
              color={Colors.primary}
              selectionColor={Colors.secondary}
            />
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Ionicons
              name="mail-outline"
              size={20}
              color={Colors.primary}
              style={styles.rowIcon}
            />
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="person-outline"
              size={20}
              color={Colors.primary}
              style={styles.rowIcon}
            />
            <Text style={styles.infoValue}>{civiliteLabel[user.civilite]}</Text>
          </View>

          {user.siret && (
            <View style={styles.infoRow}>
              <Ionicons
                name="business-outline"
                size={20}
                color={Colors.primary}
                style={styles.rowIcon}
              />
              <Text style={styles.infoLabel}>SIRET:</Text>
              <Text style={styles.infoValue}>{user.siret}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Ionicons
              name="calendar-outline"
              size={20}
              color={Colors.primary}
              style={styles.rowIcon}
            />
            <Text style={styles.infoValue}>
              Date de création : &nbsp;
              {new Date(user.created_at).toLocaleDateString("fr-FR")}
            </Text>
          </View>

          {/* Redirection vers l'écran de modification du mot de passe */}
          <TouchableOpacity
            style={[styles.infoRow]}
            onPress={handlePasswordChange}
          >
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={Colors.primary}
              style={styles.rowIcon}
            />
            <Text style={styles.infoValue}>Modifier le mot de passe</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
          </TouchableOpacity>
          {/* Redirection vers l'écran des conditions d'utilisation */}
          <TouchableOpacity
            style={[styles.infoRow, styles.passwordChangeRow]}
            onPress={() =>
              navigation.navigate(Routes.ConditionsScreen as never)
            }
          >
            <Ionicons
              name="document-text-outline"
              size={20}
              color={Colors.primary}
              style={styles.rowIcon}
            />
            <Text style={styles.infoValue}>Conditions d'utilisation</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    margin: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  infoContainer: {
    width: "100%",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 8,
    alignItems: "center",
  },
  passwordChangeRow: {
    marginBottom: -8,
    borderBottomWidth: 0,
  },
  infoLabel: {
    fontWeight: "bold",
    width: "38%",
    fontSize: 16,
    color: "#555",
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    color: Colors.darkGray,
  },
  rowIcon: {
    marginRight: 8,
    width: "8%",
  },
});
