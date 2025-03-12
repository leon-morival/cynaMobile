import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ShoppingScreen from "../screens/Shop/ShoppingScreen";
import ProductDetail from "../screens/Shop/ProductDetail";

const Stack = createNativeStackNavigator();

export default function ShopStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ShoppingScreen"
        component={ShoppingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetail}
        options={{ title: "Product Detail" }}
      />
    </Stack.Navigator>
  );
}
