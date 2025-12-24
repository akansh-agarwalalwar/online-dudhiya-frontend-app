import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Splash from "../screens/Splash";
import Login from "../screens/Login";
import OtpVerificationScreen from "../screens/OtpVerification";
import PrivacyPolicy from "../screens/PrivacyPolicy";
import TermsAndConditions from "../screens/TermsAndConditions";

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
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} />
    </Stack.Navigator>
  );
}