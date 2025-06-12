import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import TabNavigator from "./src/navigation/TabNavigator";
import { AuthProvider } from "./src/context/AuthContext";
import { LanguageProvider } from "./src/context/LanguageContext";
import { StripeProvider } from "@stripe/stripe-react-native";

export default function App() {
  return (
    <SafeAreaProvider>
      <StripeProvider publishableKey="pk_test_51Ny7JaHVnu49ZpSn2I9HIRbRQeJqmf4Ttz3EscQuyFBYDdsTFFd7xgleXcIM8ognR3BG4sdV1Mfq7iC3hVpheYG700Ay6HrQsk">
        <AuthProvider>
          <LanguageProvider>
            <NavigationContainer>
              <TabNavigator />
              <StatusBar style="auto" />
            </NavigationContainer>
          </LanguageProvider>
        </AuthProvider>
        <Toast />
      </StripeProvider>
    </SafeAreaProvider>
  );
}
