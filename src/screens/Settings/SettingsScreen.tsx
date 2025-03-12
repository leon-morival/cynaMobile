import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
import AuthInput from "../../components/Common/AuthInput";

const BASE_URL = "https://api.leonmorival.xyz/api";

const SettingsScreen = () => {
  const type = "ent";

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerSiret, setRegisterSiret] = useState("");

  const loginHandler = async () => {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await response.json();
      console.log(data);
      // Vérification de l'existence d'erreurs dans la réponse
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

  const registerHandler = async () => {
    if (registerPassword !== registerConfirmPassword) {
      return Toast.show({
        type: "error",
        text1: "Erreur",
        text2: "Les mots de passe ne correspondent pas",
      });
    }
    try {
      const body = {
        name: registerName,
        email: registerEmail,
        password: registerPassword,
        password_confirmation: registerConfirmPassword,
      };
      const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok || data.errors) {
        const errorMsg =
          data.errors?.email && Array.isArray(data.errors.email)
            ? data.errors.email[0]
            : "Erreur lors de l'inscription";
        return Toast.show({
          type: "error",
          text1: "Erreur",
          text2: errorMsg,
        });
      }
      Toast.show({
        type: "success",
        text1: "Register",
        text2: "Inscription réussie",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: "Erreur lors de l'inscription",
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>

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
        <TouchableOpacity style={styles.button} onPress={loginHandler}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Register</Text>
        <AuthInput
          type="name"
          label="Nom :"
          value={registerName}
          onChangeText={setRegisterName}
        />
        <AuthInput
          type="email"
          label="Email :"
          value={registerEmail}
          onChangeText={setRegisterEmail}
        />
        <AuthInput
          type="password"
          label="Mot de passe :"
          value={registerPassword}
          onChangeText={setRegisterPassword}
        />
        <AuthInput
          type="password"
          label="Confirmer le mot de passe :"
          value={registerConfirmPassword}
          onChangeText={setRegisterConfirmPassword}
        />
        {type === "ent" && (
          <AuthInput
            type="siret"
            label="Numéro de siret :"
            value={registerSiret}
            onChangeText={setRegisterSiret}
          />
        )}
        <TouchableOpacity style={styles.button} onPress={registerHandler}>
          <Text style={styles.buttonText}>S'inscrire</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: {
    width: "80%",
    marginBottom: 30,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
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

export default SettingsScreen;
