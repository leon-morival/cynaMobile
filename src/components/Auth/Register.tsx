import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import AuthInput from "../Common/AuthInput";
import { Civilite } from "../../models/Entities";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../../constants/Colors";
import apiClient from "../../apiClient";

import { API_URL } from "../../../constants/api";
import { useTranslate } from "../../utils/translationUtils";
const Register = () => {
  const [registerName, setRegisterName] = useState(__DEV__ ? "leon" : "");
  const [registerEmail, setRegisterEmail] = useState(
    __DEV__ ? "leon@gmail.com" : ""
  );
  const [registerPassword, setRegisterPassword] = useState(
    __DEV__ ? "password" : ""
  );
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState(
    __DEV__ ? "password" : ""
  );
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
        email: registerEmail.toLowerCase(),
        password: registerPassword,
        password_confirmation: registerConfirmPassword,
        civilite: registerCivilite,
      };
      if (registerCivilite === Civilite.ENT) {
        body.siret = registerSiret;
      }

      // Optionnel : test d'appel users (à supprimer si inutile)
      await apiClient.get("/users");

      const response = await apiClient.post("/register", body);
      const data = response.data;
      if (data.errors) {
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

        try {
          const userResponse = await apiClient.get("/user", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${data.token}`,
            },
          });

          setUser(userResponse.data);
          await AsyncStorage.setItem("user", JSON.stringify(userResponse.data));
        } catch (profileError) {
          setUser(data.user);
          await AsyncStorage.setItem("user", JSON.stringify(data.user));
        }
      }
      Toast.show({
        type: "success",
        text1: "Inscription réussie",
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: error?.response?.data?.message || "Erreur lors de l'inscription",
      });
    }
  };
  const translate = useTranslate();
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.section}>
        <View style={styles.headerContainer}>
          <Ionicons
            name="person-add-outline"
            size={40}
            color={Colors.primary}
          />
          <Text style={styles.sectionTitle}>{translate("registration")}</Text>
        </View>

        <AuthInput
          type="name"
          label={translate("name") + " :"}
          value={registerName}
          onChangeText={setRegisterName}
        />
        <AuthInput
          type="email"
          label={translate("email") + " :"}
          value={registerEmail.toLowerCase()}
          onChangeText={setRegisterEmail}
        />
        <Text style={styles.label}>{translate("title") + " :"}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={registerCivilite}
            onValueChange={(itemValue) => setRegisterCivilite(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label={translate("mr")} value={Civilite.MR} />
            <Picker.Item label={translate("mrs")} value={Civilite.MME} />
            <Picker.Item label={translate("company")} value={Civilite.ENT} />
            <Picker.Item label="Autres" value={Civilite.AUT} />
          </Picker>
        </View>
        <AuthInput
          type="password"
          label={translate("password") + " :"}
          value={registerPassword}
          onChangeText={setRegisterPassword}
        />
        <AuthInput
          type="password"
          label={translate("confirm_password") + " :"}
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
          <Text style={styles.buttonText}>{translate("sign_up")}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
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
