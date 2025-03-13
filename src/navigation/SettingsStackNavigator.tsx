import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import PasswordChange from "../screens/Settings/PasswordChange";
import SettingsScreen from "../screens/Settings/SettingsScreen";
import { Routes } from "./Routes";
const Stack = createNativeStackNavigator();

export default function SettingsStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={Routes.SettingsScreen}
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={Routes.PasswordChange}
        component={PasswordChange}
        options={{ title: "Modifier le mot de passe", headerShown: true }}
      />
    </Stack.Navigator>
  );
}
