import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

export default function AuthInput({
  type = "default",
  label = "",
  placeholder = "",
  required = true,
  value,
  onChangeText,
}) {
  const getKeyboardType = (inputType: string) => {
    switch (inputType) {
      case "email":
        return "email-address";
      case "siret":
        return "numeric";
      default:
        return "default";
    }
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder || label}
        keyboardType={getKeyboardType(type)}
        secureTextEntry={type === "password"}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
});
