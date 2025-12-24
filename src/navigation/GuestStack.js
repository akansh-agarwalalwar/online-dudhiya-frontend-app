import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home";
import Product from "../screens/Product";
import ProductDetailsScreen from "../screens/ProductDetails";


const Stack = createStackNavigator();

export default function GuestStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GuestLogin" component={Home} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Products" component={Product} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
    </Stack.Navigator>
  );
}


