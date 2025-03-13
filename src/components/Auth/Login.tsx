import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import AuthInput from "../Common/AuthInput";

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
      <Text style={styles.sectionTitle}>Login</Text>
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
    width: "80%",
    marginBottom: 30,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignSelf: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Login;
