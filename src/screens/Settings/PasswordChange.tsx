import React, { useState, useContext } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { Colors } from "../../../constants/Colors";
import { API_URL } from "../../../constants/api";
import { AuthContext } from "../../context/AuthContext";
import Toast from "react-native-toast-message";

export default function PasswordChange() {
  const { token } = useContext(AuthContext);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async () => {
    try {
      // Reset errors
      setErrors({});

      // Client-side validation
      if (!currentPassword) {
        setErrors((prev) => ({
          ...prev,
          current_password: "Le mot de passe actuel est requis",
        }));
        return;
      }

      if (!newPassword) {
        setErrors((prev) => ({
          ...prev,
          password: "Le nouveau mot de passe est requis",
        }));
        return;
      }

      if (newPassword.length < 8) {
        setErrors((prev) => ({
          ...prev,
          password: "Le mot de passe doit contenir au moins 8 caractères",
        }));
        return;
      }

      if (newPassword !== confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          password_confirmation: "Les mots de passe ne correspondent pas",
        }));
        return;
      }

      setIsLoading(true);

      if (!token) {
        Toast.show({
          type: "error",
          text1: "Erreur",
          text2: "Vous devez être connecté pour modifier votre mot de passe",
        });
        setIsLoading(false);
        return;
      }

      // Call API using fetch
      const response = await fetch(`${API_URL}/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/ld+json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          password: newPassword,
          password_confirmation: confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.errors) {
        if (response.status === 422) {
          // Validation errors from server
          setErrors(data.errors || {});
        } else {
          const errorMsg =
            data.message ||
            "Une erreur est survenue lors de la modification du mot de passe";
          Toast.show({
            type: "error",
            text1: "Erreur",
            text2: errorMsg,
          });
        }
        setIsLoading(false);
        return;
      }

      // Success
      Toast.show({
        type: "success",
        text1: "Succès",
        text2: data.message || "Votre mot de passe a été modifié avec succès",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: error.message || "Une erreur est survenue",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mot de passe actuel</Text>
          <TextInput
            style={[
              styles.input,
              errors.current_password ? styles.inputError : null,
            ]}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            placeholder="Votre mot de passe actuel"
          />
          {errors.current_password && (
            <Text style={styles.errorText}>{errors.current_password}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nouveau mot de passe</Text>
          <TextInput
            style={[styles.input, errors.password ? styles.inputError : null]}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            placeholder="Votre nouveau mot de passe"
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirmez le nouveau mot de passe</Text>
          <TextInput
            style={[
              styles.input,
              errors.password_confirmation ? styles.inputError : null,
            ]}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholder="Confirmer votre nouveau mot de passe"
          />
          {errors.password_confirmation && (
            <Text style={styles.errorText}>{errors.password_confirmation}</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleChangePassword}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Modifier le mot de passe</Text>
          )}
        </TouchableOpacity>
      </View>
      <Toast />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 10,
  },
  formContainer: {
    justifyContent: "center",
    // alignSelf: "center",
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
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.darkGray,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
  },
  inputError: {
    borderColor: "red",
  },
});
