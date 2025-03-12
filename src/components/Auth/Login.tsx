import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import AuthInput from "../Common/AuthInput";

const BASE_URL = "https://api.leonmorival.xyz/api";

const Login = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const loginHandler = async () => {
    console.log("login pressed");
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await response.json();
      console.log(data);
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
        secureTextEntry={true}
      />
      <TouchableOpacity style={styles.button} onPress={loginHandler}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // ...existing style properties...
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
