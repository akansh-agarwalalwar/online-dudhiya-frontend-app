import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Splash from "../screens/Splash";
import Login from "../screens/Login";
import OtpVerificationScreen from "../screens/OtpVerification";

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator 
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
    </Stack.Navigator>
  );
}