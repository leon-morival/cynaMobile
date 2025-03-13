import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import AuthInput from "../Common/AuthInput";
import { Civilite } from "../../models/Entities";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../../constants/Colors";

import { API_URL } from "../../../constants/api";

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
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      console.log("register response", JSON.stringify(data, null, 2));
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

      // Save token first
      if (data.token) {
        await AsyncStorage.setItem("token", data.token);
        setToken(data.token);

        // Fetch complete user profile using the token
        try {
          const userResponse = await fetch(`${API_URL}/user`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${data.token}`,
            },
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            console.log(
              "Complete user data:",
              JSON.stringify(userData, null, 2)
            );
            setUser(userData);
            await AsyncStorage.setItem("user", JSON.stringify(userData));
          } else {
            // Fallback to the limited user data if the profile fetch fails
            setUser(data.user);
            await AsyncStorage.setItem("user", JSON.stringify(data.user));
          }
        } catch (profileError) {
          console.error("Error fetching complete profile:", profileError);
          // Still use the basic user data we have
          if (data.user) {
            setUser(data.user);
            await AsyncStorage.setItem("user", JSON.stringify(data.user));
          }
        }
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
    <View style={styles.section}>
      <View style={styles.headerContainer}>
        <Ionicons name="person-add-outline" size={40} color={Colors.primary} />
        <Text style={styles.sectionTitle}>Inscription</Text>
      </View>

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
      <Text style={styles.label}>Civilité :</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={registerCivilite}
          onValueChange={(itemValue) => setRegisterCivilite(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Monsieur" value={Civilite.MR} />
          <Picker.Item label="Madame" value={Civilite.MME} />
          <Picker.Item label="Entreprise" value={Civilite.ENT} />
          <Picker.Item label="Autres" value={Civilite.AUT} />
        </Picker>
      </View>
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
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: Colors.darkGray,
    fontWeight: "500",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  picker: {
    height: 50,
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

export default Register;
