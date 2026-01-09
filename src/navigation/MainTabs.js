import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Text, View } from "react-native";
import Home from "../screens/Home";
import SearchScreen from "../screens/SearchScreen";
import Product from "../screens/Product";
import ProductDetailsScreen from "../screens/ProductDetails";
import CartWithRedux from "../screens/CartWithRedux";
import Cart from "../screens/Cart";
import Profile from "../screens/Profile";
import MyOrdersScreen from "../screens/MyOrder";
import ManageAddressScreen from "../screens/Address/ManageAddress";
import AddAddressScreen from "../screens/Address/AddAddress";
import WishlistScreen from "../screens/WishlistScreen";
import EditProfileScreen from "../screens/EditProfile";
import OrderConfirmationScreen from "../screens/OrderConfirmation";
import About from "../screens/About";
import HelpAndSupport from "../screens/HelpAndSupport";
import PrivacyPolicy from "../screens/PrivacyPolicy";
import TermsAndConditions from "../screens/TermsAndConditions";
import ReturnPolicy from "../screens/ReturnPolicy";
// Import specific icons
import { Home as HomeIcon, ShoppingBag, ShoppingCart, User } from "lucide-react-native";


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { clearRedirectScreen } from "../redux/slices/authSlice";
import { useEffect } from "react";

// Tab Navigator Component
function TabNavigator() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { redirectScreen } = useSelector(state => state.auth);

  useEffect(() => {
    if (redirectScreen) {
      // Clear before navigating to avoid loop or race conditions
      const screen = redirectScreen;
      dispatch(clearRedirectScreen());
      navigation.navigate(screen);
    }
  }, [redirectScreen, navigation, dispatch]);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2F5795",
        tabBarInactiveTintColor: "#8e8e93",
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <HomeIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Products"
        component={Product}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("Products", {
              categoryId: null,
              categorySlug: null,
              categoryName: null,
            });
          },
        })}
        options={{
          tabBarLabel: "Products",
          tabBarIcon: ({ color, size }) => (
            <ShoppingBag color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        // component={CartWithRedux}
        component={Cart}
        options={{
          tabBarLabel: "Cart",
          tabBarIcon: ({ color, size }) => (
            <ShoppingCart color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Placeholder components for screens that don't exist yet
const PlaceholderProducts = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Products Screen</Text>
  </View>
);
const PlaceholderProfile = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Profile Screen</Text>
  </View>
);

export default function MainTabs() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      <Stack.Screen name="Products" component={PlaceholderProducts} />
      <Stack.Screen name="Profile" component={PlaceholderProfile} />
      <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
      <Stack.Screen name="ManageAddress" component={ManageAddressScreen} />
      <Stack.Screen name="AddAddress" component={AddAddressScreen} />
      <Stack.Screen name="Wishlist" component={WishlistScreen} />
      <Stack.Screen name="Cart" component={Cart} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} />
      <Stack.Screen name="ReturnPolicy" component={ReturnPolicy} />
      <Stack.Screen name="About" component={About} />
      <Stack.Screen name="HelpAndSupport" component={HelpAndSupport} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
    </Stack.Navigator>
  );
}