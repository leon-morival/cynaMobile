import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import Login from "../../components/Auth/Login";
import Register from "../../components/Auth/Register";
import Profile from "../../components/Settings/Profile";

import { Colors } from "../../../constants/Colors";
import apiClient from "../../apiClient";
import { AuthContext } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { useTranslate } from "../../utils/translationUtils";

const SettingsScreen = () => {
  const translate = useTranslate();
  const { token, user, setToken, setUser } = useContext(AuthContext);
  const { language, setLanguage } = useLanguage();
  const [selectedForm, setSelectedForm] = useState<"login" | "register">(
    "login"
  );
  const navigation = useNavigation();

  const loginHandler = async (email: string, password: string) => {
    try {
      const response = await apiClient.post(
        "/login",
        { email, password },
        { headers: { "Content-Type": "application/ld+json" } }
      );
      const data = response.data;
      if (data.errors) {
        const errorMsg =
          data.errors?.email && Array.isArray(data.errors.email)
            ? data.errors.email[0]
            : "Erreur de connexion";
        return Toast.show({
          type: "error",
          text1: "Erreur",
          text2: errorMsg,
        });
      }
      await AsyncStorage.setItem("token", data.token);
      setToken(data.token);
      if (data.user) {
        setUser(data.user);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
      }
      Toast.show({
        type: "success",
        text1: "Login",
        text2: "Connexion réussie",
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: error?.response?.data?.message || "Erreur de connexion",
      });
    }
  };

  const logoutHandler = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    setToken(null);
    setUser(null);
    Toast.show({
      type: "success",
      text1: "Logout",
      text2: translate("logout_success"),
    });
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };

  return (
    <View style={styles.container}>
      {/* LANGUE */}
      <View style={styles.languageSwitcher}>
        <TouchableOpacity
          style={[
            styles.languageOption,
            language === "fr" && styles.languageOptionActive,
          ]}
          onPress={() => handleLanguageChange("fr")}
        >
          <Text style={styles.languageText}>🇫🇷 Français</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.languageOption,
            language === "en" && styles.languageOptionActive,
          ]}
          onPress={() => handleLanguageChange("en")}
        >
          <Text style={styles.languageText}>🇬🇧 English</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.languageOption,
            language === "es" && styles.languageOptionActive,
          ]}
          onPress={() => handleLanguageChange("es")}
        >
          <Text style={styles.languageText}>🇪🇸 Español</Text>
        </TouchableOpacity>
      </View>

      {/* UTILISATEUR CONNECTÉ */}
      {token ? (
        <>
          {user ? (
            <>
              <Profile user={user} />

              <TouchableOpacity
                style={styles.logoutButton}
                onPress={logoutHandler}
              >
                <Text style={styles.logoutButtonText}>
                  {translate("logout")}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>
                {translate("loading_user_info")}
              </Text>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={logoutHandler}
              >
                <Text style={styles.logoutButtonText}>
                  {translate("logout")}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      ) : (
        <>
          {/* CONNEXION/INSCRIPTION */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                selectedForm === "login" && styles.activeButton,
              ]}
              onPress={() => setSelectedForm("login")}
            >
              <Text style={styles.buttonText}>{translate("login")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                selectedForm === "register" && styles.activeButton,
              ]}
              onPress={() => setSelectedForm("register")}
            >
              <Text style={styles.buttonText}>
                {translate("create_account")}
              </Text>
            </TouchableOpacity>
          </View>
          {selectedForm === "login" ? (
            <Login onLogin={loginHandler} />
          ) : (
            <Register />
          )}
        </>
      )}
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  languageSwitcher: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: Colors.secondary,
    borderRadius: 26,
    marginBottom: 30,
    padding: 5,
  },
  languageOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  languageOptionActive: {
    backgroundColor: Colors.primary,
  },
  languageText: {
    fontWeight: "bold",
    color: "#fff",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    padding: 12,
    backgroundColor: "#bbb",
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: Colors.primary,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  logoutButton: {
    marginTop: 30,
    alignSelf: "center",
    backgroundColor: Colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loadingContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
  accountText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  menuButton: {
    marginTop: 20,
    alignSelf: "center",
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  menuButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default SettingsScreen;
