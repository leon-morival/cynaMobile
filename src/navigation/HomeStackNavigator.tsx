import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import ChatBotScreen from "../screens/ChatBot/ChatBotScreen";
import HomeScreen from "../screens/Home/HomeScreen";
import { Routes } from "./Routes";
const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={Routes.HomeScreen}
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={Routes.ChatBot}
        component={ChatBotScreen}
        options={{ title: "Product Detail" }}
      />
    </Stack.Navigator>
  );
}
