import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import AuthInput from "../Common/AuthInput";
import { Civilite } from "../../models/Entities";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../context/AuthContext";

const BASE_URL = "https://api.leonmorival.xyz/api";

const Register = () => {
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerSiret, setRegisterSiret] = useState("");
  const [registerCivilite, setRegisterCivilite] = useState(Civilite.MR);
  const { token, setToken, user, setUser } = useContext(AuthContext);

  const registerHandler = async () => {
    if (registerPassword !== registerConfirmPassword) {
      return Toast.show({
        type: "error",
        text1: "Erreur",
        text2: "Les mots de passe ne correspondent pas",
      });
    }
    try {
      const body: any = {
        name: registerName,
        email: registerEmail,
        password: registerPassword,
        password_confirmation: registerConfirmPassword,
        civilite: registerCivilite,
      };
      if (registerCivilite === Civilite.ENT) {
        body.siret = registerSiret;
      }
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
      if (data.token) {
        await AsyncStorage.setItem("token", data.token);
        setToken(data.token);
      }
      if (data.user) {
        setUser(data.user);
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

  if (token) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>
        {user ? (
          <>
            <Text>Email: {user.email}</Text>
            <Text>Civilité: {user.civilite}</Text>
          </>
        ) : (
          <Text>Chargement des informations...</Text>
        )}
      </View>
    );
  }

  return (
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
      <Text>Civilité :</Text>
      <Picker
        selectedValue={registerCivilite}
        onValueChange={(itemValue) => setRegisterCivilite(itemValue)}
      >
        <Picker.Item label="MR" value={Civilite.MR} />
        <Picker.Item label="MME" value={Civilite.MME} />
        <Picker.Item label="ENT" value={Civilite.ENT} />
        <Picker.Item label="AUT" value={Civilite.AUT} />
      </Picker>
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
      {registerCivilite === Civilite.ENT && (
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

export default Register;
