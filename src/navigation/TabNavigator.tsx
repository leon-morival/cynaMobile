import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/Home/HomeScreen";
import ShopStackNavigator from "./ShopStackNavigator";
import CartScreen from "../screens/Cart/CartScreen";
import { Colors } from "../../constants/Colors";
import SettingsStackNavigator from "./SettingsStackNavigator";
import { Routes } from "./Routes";
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any = "";

          if (route.name === Routes.HomeScreen) {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === Routes.ShopTab) {
            // changé: icône de 'person' modifiée pour une icône de shopping
            iconName = focused ? "basket" : "basket-outline";
          } else if (route.name === Routes.CartScreen) {
            iconName = focused ? "cart" : "cart-outline"; // changed from settings to cart
          } else if (route.name === Routes.SettingsTab) {
            iconName = focused ? "settings" : "settings-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.secondary,
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name={Routes.HomeScreen} component={HomeScreen} />
      <Tab.Screen name={Routes.ShopTab} component={ShopStackNavigator} />
      <Tab.Screen name={Routes.CartScreen} component={CartScreen} />
      <Tab.Screen
        name={Routes.SettingsTab}
        component={SettingsStackNavigator}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
