import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
import Login from "../../components/Auth/Login";
import Register from "../../components/Auth/Register";

const SettingsScreen = () => {
  const [selectedForm, setSelectedForm] = useState<"login" | "register">(
    "login"
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
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
    backgroundColor: "#2196F3",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default SettingsScreen;
