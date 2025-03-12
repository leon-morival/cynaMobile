import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";

import TabNavigator from "./src/navigation/TabNavigator";

export default function App() {
  return (
    <>
      <SafeAreaProvider>
        <NavigationContainer>
          <TabNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </SafeAreaProvider>
      <Toast />
    </>
  );
}
