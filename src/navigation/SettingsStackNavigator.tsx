import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import PasswordChange from "../screens/Settings/PasswordChange";
import SettingsScreen from "../screens/Settings/SettingsScreen";
import ConditionsScreen from "../screens/Settings/ConditionsScreen";
import OrdersScreen from "../screens/Orders/OrdersScreen";
import { Routes } from "./Routes";
import { useTranslate } from "../utils/translationUtils";
const Stack = createNativeStackNavigator();

export default function SettingsStackNavigator() {
  const translate = useTranslate();
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
        options={{ title: translate("change_password"), headerShown: true }}
      />
      <Stack.Screen
        name={Routes.ConditionsScreen}
        component={ConditionsScreen}
        options={{ headerShown: true, title: translate("terms_of_use") }}
      />
      <Stack.Screen
        name={Routes.OrdersScreen}
        component={OrdersScreen}
        options={{ headerShown: true, title: translate("orders_title") }}
      />
    </Stack.Navigator>
  );
}
