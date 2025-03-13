import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ShoppingScreen from "../screens/Shop/ShoppingScreen";
import ProductDetail from "../screens/Shop/ProductDetail";
import { Routes } from "./Routes";
const Stack = createNativeStackNavigator();

export default function ShopStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={Routes.ShoppingScreen}
        component={ShoppingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={Routes.ProductDetail}
        component={ProductDetail}
        options={{ title: "Product Detail" }}
      />
    </Stack.Navigator>
  );
}
