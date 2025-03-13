import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import AuthInput from "../Common/AuthInput";
import { Colors } from "../../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

interface LoginProps {
  onLogin: (email: string, password: string) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleLogin = () => {
    onLogin(loginEmail, loginPassword);
  };

  return (
    <View style={styles.section}>
      <View style={styles.headerContainer}>
        <Ionicons name="log-in-outline" size={40} color={Colors.primary} />
        <Text style={styles.sectionTitle}>Connexion</Text>
      </View>

      <AuthInput
        type="email"
        label="Email :"
        value={loginEmail}
        onChangeText={setLoginEmail}
      />
      <AuthInput
        type="password"
        label="Mot de passe :"
        value={loginPassword}
        onChangeText={setLoginPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    width: "90%",
    marginBottom: 30,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginLeft: 10,
    color: Colors.darkGray,
  },
  button: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Login;
