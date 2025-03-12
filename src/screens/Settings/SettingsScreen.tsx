import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
import Login from "../../components/Auth/Login";
import Register from "../../components/Auth/Register";
import { Colors } from "../../../constants/Colors";
import { User } from "../../models/Entities";
import AsyncStorage from "@react-native-async-storage/async-storage";
const SettingsScreen = () => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [selectedForm, setSelectedForm] = useState<"login" | "register">(
    "login"
  );
  const logoutHandler = async () => {
    await AsyncStorage.removeItem("token");
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
      {!token && (
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
      )}

      {selectedForm === "login" ? <Login /> : <Register />}
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
});

export default SettingsScreen;
