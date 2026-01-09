import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home";
import Product from "../screens/Product";
import ProductDetailsScreen from "../screens/ProductDetails";
import Cart from "../screens/Cart";
import SearchScreen from "../screens/SearchScreen";
import { Home as HomeIcon, ShoppingBag, ShoppingCart } from "lucide-react-native";
import { Search } from "lucide-react-native";


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const GuestTab = () => {
  return (
    <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: "#2F5795",
      tabBarInactiveTintColor: "#8e8e93",
      tabBarStyle: {
        backgroundColor: "#fff",
      },
    }}
    >
      <Tab.Screen name="Home" component={Home} options={{
        tabBarLabel: "Home",
        tabBarIcon: ({ color, size }) => (
          <HomeIcon color={color} size={size} />
        ),
      }} />
      <Tab.Screen name="Products" component={Product} options={{
        tabBarLabel: "Products",
        tabBarIcon: ({ color, size }) => (
          <ShoppingBag color={color} size={size} />
        ),
      }} />
      <Tab.Screen name="Cart" component={Cart} options={{
        tabBarLabel: "Cart",
        tabBarIcon: ({ color, size }) => (
          <ShoppingCart color={color} size={size} />
        ),
      }} />
      <Tab.Screen name="SearchScreen" component={SearchScreen} options={{
        tabBarLabel: "Search",
        tabBarIcon: ({ color, size }) => (
          <Search color={color} size={size} />
        ),
      }} />
    </Tab.Navigator>
  )
}

export default function GuestStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GuestTab" component={GuestTab} />
      <Stack.Screen name="GuestLogin" component={Home} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Products" component={Product} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      <Stack.Screen name="Cart" component={Cart} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
    </Stack.Navigator>
  );
}


