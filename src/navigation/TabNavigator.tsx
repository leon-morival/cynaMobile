import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";

import { Colors } from "../../constants/Colors";
import CartScreen from "../screens/Cart/CartScreen";
import ChatBotScreen from "../screens/ChatBot/ChatBotScreen";
import HomeStackNavigator from "./HomeStackNavigator";
import { Routes } from "./Routes";
import SettingsStackNavigator from "./SettingsStackNavigator";
import ShopStackNavigator from "./ShopStackNavigator";
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any = "";

          if (route.name === "Accueil") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Offres") {
            // changé: icône de 'person' modifiée pour une icône de shopping
            iconName = focused ? "basket" : "basket-outline";
          } else if (route.name === "Panier") {
            iconName = focused ? "cart" : "cart-outline"; // changed from settings to cart
          } else if (route.name === "Paramètres") {
            iconName = focused ? "settings" : "settings-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.secondary,
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name={"Accueil"} component={HomeStackNavigator} />
      <Tab.Screen name={"Offres"} component={ShopStackNavigator} />
      <Tab.Screen name={"Panier"} component={CartScreen} />
      <Tab.Screen name={"Paramètres"} component={SettingsStackNavigator} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
