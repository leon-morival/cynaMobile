import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
import Login from "../../components/Auth/Login";
import Register from "../../components/Auth/Register";
import { Colors } from "../../../constants/Colors";
import { AuthContext } from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SettingsScreen = () => {
  const { token, user, setToken, setUser } = useContext(AuthContext);
  const [selectedForm, setSelectedForm] = useState<"login" | "register">(
    "login"
  );

  useEffect(() => {
    console.log("Token in context after update:", token);
  }, [token]);
  console.log("user", user);
  const BASE_URL = "https://api.leonmorival.xyz/api";

  // New login handler moved from Login.tsx
  const loginHandler = async (email: string, password: string) => {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok || data.errors) {
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
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: "Erreur de connexion",
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
      text2: "Vous êtes déconnecté",
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      {token ? (
        <>
          <View style={styles.profileContainer}>
            <Text style={styles.profileTitle}>Profile</Text>
            {user ? (
              <>
                <Text>Email: {user.email}</Text>
                <Text>Civilité: {user.civilite}</Text>
              </>
            ) : (
              <Text>Chargement des informations...</Text>
            )}
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={logoutHandler}>
            <Text style={styles.logoutButtonText}>Déconnexion</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                selectedForm === "login" && styles.activeButton,
              ]}
              onPress={() => setSelectedForm("login")}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                selectedForm === "register" && styles.activeButton,
              ]}
              onPress={() => setSelectedForm("register")}
            >
              <Text style={styles.buttonText}>Register</Text>
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
    paddingTop: 100,
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  toggleButton: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: "#888",
    borderRadius: 5,
  },
  activeButton: {
    backgroundColor: Colors.primary,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: Colors.secondary,
    padding: 10,
    borderRadius: 5,
    alignSelf: "center",
    marginBottom: 20,
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default SettingsScreen;
