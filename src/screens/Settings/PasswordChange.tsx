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
import { AuthContext } from "../../context/AuthContext";
import Toast from "react-native-toast-message";
import { useTranslate } from "../../utils/translationUtils";
import apiClient from "../../apiClient";

export default function PasswordChange() {
  const { token } = useContext(AuthContext);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const translate = useTranslate();

  const handleChangePassword = async () => {
    try {
      setErrors({});

      // Client-side validation
      if (!currentPassword) {
        setErrors((prev) => ({
          ...prev,
          current_password: translate("current_password_required"),
        }));
        return;
      }

      if (!newPassword) {
        setErrors((prev) => ({
          ...prev,
          password: translate("new_password_required"),
        }));
        return;
      }

      if (newPassword.length < 8) {
        setErrors((prev) => ({
          ...prev,
          password: translate("password_min_length"),
        }));
        return;
      }

      if (newPassword !== confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          password_confirmation: translate("passwords_do_not_match"),
        }));
        return;
      }

      setIsLoading(true);

      if (!token) {
        Toast.show({
          type: "error",
          text1: translate("error"),
          text2: translate("must_be_logged_in_to_change_password"),
        });
        setIsLoading(false);
        return;
      }

      // Call API using axios
      const response = await apiClient.post(
        "/change-password",
        {
          current_password: currentPassword,
          password: newPassword,
          password_confirmation: confirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/ld+json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      if (data.errors) {
        setErrors(data.errors || {});
        setIsLoading(false);
        return;
      }

      // Success
      Toast.show({
        type: "success",
        text1: translate("password_change_success"),
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      if (error?.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        Toast.show({
          type: "error",
          text1: translate("error"),
          text2:
            error?.response?.data?.message ||
            translate("password_change_error"),
        });
      }
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              errors.current_password ? styles.inputError : null,
            ]}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            placeholder={translate("current_password")}
          />
          {errors.current_password && (
            <Text style={styles.errorText}>{errors.current_password}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, errors.password ? styles.inputError : null]}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            placeholder={translate("new_password")}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              errors.password_confirmation ? styles.inputError : null,
            ]}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholder={translate("confirm_new_password")}
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
            <Text style={styles.buttonText}>
              {translate("change_password")}
            </Text>
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
